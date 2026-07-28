# Multi-Tenancy: Single User Today, Label Services Tomorrow

## The core insight

You don't need to build multi-tenancy. You need to make sure **nothing in the
schema or the app code assumes single-tenancy**, so that turning it on later
is a config and onboarding change, not a migration.

The lever that makes this true: **`Organization` is the tenant root, and every
domain table carries `organizationId`** — even though today there is exactly
one row in `Organization`.

```
Organization (tenant boundary)
  └─ Membership (User × Role, scoped to one Organization)
  └─ Artist, Label, Publisher
  └─ Song, Track, Release, Project, Session
  └─ Asset, Metadata
  └─ RightsRecord, SplitSheet
  └─ RoyaltyStatement
  └─ Venue, Tour
  └─ Product, Order
  └─ CmsPage
  └─ Notification
```

If you skip `organizationId` now because "it's just me," every one of those
tables needs a backfill migration and every query needs a rewrite the day you
sign your first outside artist. If you include it now, onboarding artist #2
is: insert one `Organization` row, insert one `Membership`, done.

## Why `User` and `Membership` are separate

`User` is global — one row per human, forever, regardless of how many
tenants they touch. `Membership` is what scopes a `User` to an `Organization`
with a `Role`. This is what lets a session musician, a mixing engineer, or a
sync agent belong to **your** org today and a second label's org next year,
without you ever needing a second account system. It's also what makes "a
manager invited into an artist's A&R Workspace" (Section 7.7 in your doc)
a first-class relationship instead of a special case.

## Enforce it twice: app layer *and* database layer

Prisma queries scoped by `organizationId` are necessary but not sufficient —
one missed `where: { organizationId }` clause in a Server Action is a
cross-tenant data leak. Supabase gives you Postgres Row Level Security for
free, so enforce the same boundary at the database:

```sql
-- Example policy on the tracks table
create policy "tenant_isolation_tracks"
on "Track"
for all
using (
  "organizationId" = (auth.jwt() ->> 'organization_id')::text
);
```

Your Supabase JWT carries `organization_id` as a claim (set at
session/membership time). Even with a single tenant today, turn RLS on now —
it costs nothing when there's one org, and it means a bug in application code
can never leak data across tenants later, because the database refuses the
query regardless of what the app asked for.

## The one deliberate exception: SyncOS

Everything above is strict tenant isolation. But your Sync Marketplace is
*designed* to cross tenant boundaries — a music supervisor at another
organization needs to search and license a track that lives in your catalog.

Rather than punching holes in RLS per-feature, the schema isolates the
crossing point to two tables:

- **`SyncListing`** — exists only if a `Track`'s `syncVisibility` was
  explicitly set to `SYNC_MARKETPLACE` and published. This is your
  Automatic Sync Package Generation step (Section 7.6) made literal: nothing
  reaches `SyncListing` by accident.
- **`DealRoom`** — references `licensorOrgId` and an optional `buyerOrgId`,
  so the negotiation itself is a first-class cross-tenant record, not a
  workaround.

RLS policy on `SyncListing`/`DealRoom` reads: any authenticated org can
`SELECT` where `status = 'available'`; only the licensor/buyer org can
`SELECT`/`UPDATE` a specific `DealRoom`. Every other table stays "own org
only, full stop."

## Next.js + Server Actions: resolving "current org"

Since you're on Vercel/Next.js, resolve the active `organizationId` once, in
middleware, and thread it through every Server Action rather than trusting
the client to say who it is:

```ts
// middleware.ts
export async function middleware(req: NextRequest) {
  const session = await getSupabaseSession(req);
  // today: session.organizationId is always your one org's id
  // later: resolved from subdomain, custom domain, or an org switcher
  const orgId = session?.membership?.organizationId;
  const res = NextResponse.next();
  res.headers.set('x-org-id', orgId ?? '');
  return res;
}
```

```ts
// packages/database/withOrgScope.ts
export function withOrgScope(orgId: string) {
  return {
    track: {
      findMany: (args?: Prisma.TrackFindManyArgs) =>
        prisma.track.findMany({
          ...args,
          where: { ...args?.where, organizationId: orgId },
        }),
      // ...same pattern for create/update/delete
    },
    // repeat per model, or generate via Prisma Client Extensions
  };
}
```

Every Server Action calls `withOrgScope(orgId)` instead of the raw `prisma`
client. This is the app-layer discipline that pairs with RLS: two
independent walls, so a mistake in one doesn't become a breach.

## What "turning on multi-tenancy" actually looks like later

Nothing in the schema changes. The work is entirely product/ops:

1. **Onboarding flow** — a form that creates a new `Organization` row
   (`type: LABEL` or `ARTIST`), a `Membership` for the signing user with
   `role: OWNER`, and seeds default `Role`/`Permission` rows for that org.
2. **Org resolution** — decide how a tenant is identified: subdomain
   (`artistname.musicinabox.com`), custom domain (the `domain` field is
   already on `Organization`), or an org switcher in the UI for users with
   multiple memberships.
3. **Billing** — `plan` is already on `Organization`; wire it to Stripe
   whenever you're ready to charge a second tenant.
4. **White-label branding** — `isWhiteLabel`, `logoUrl`, and `settings` (Json)
   are already there for a label that wants its own look.

You are not deferring a hard problem. You're doing the 20% of work
(`organizationId` everywhere, RLS from day one) that removes the 80% you'd
otherwise have to redo under pressure the day someone else wants in.
