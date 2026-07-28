# Music-in-a-Box — Architecture Foundation

This is the doc every other doc in `/docs` inherits from. If a number, model name, or package name conflicts between this file and any app doc, this file wins.

---

## 1. Current State (as of this repo)

```
D:\revised8\app
├── Adea Lyric Frontend.src     ← Writer Hub, own package.json, own deps
└── Musicbox App                ← main web app, only /src imported into app/, own deps

D:\revised8 (root)
├── docs
├── app                ← the two frontends above
├── upload
├── tests
├── tool-results
├── agent-ctx
├── db
├── download
├── examples
├── mini-services
├── prisma            ← exists, not yet the shared package
├── public
├── .devscripts
├── supabase          ← exists, not yet wired to prisma or the frontends
├── .env
├── next.config.ts
├── package.json
```

Neither frontend is wired to a database. Neither is wired to each other. This is expected at this stage — **do not** try to connect them to Supabase yet. First job is consolidating them into one monorepo skeleton with one schema, then wiring one app at a time.

---

## 2. App Boundaries — Corrected

**Correction (supersedes the first draft of this doc):** Adea is not "the Writer Hub app." Adea is the self-serve, single-artist product — the public artist page plus that artist's *own* direct admin over their music, shop, sync submissions, and CMS. It is the "take my template, put it into production" EPK. Musicbox is the separate, multi-tenant enterprise side — Label OS, Catalog, Distribution, Rights, Royalty, Touring, Analytics, cross-artist Admin.

Writer Hub (the Yjs/Tiptap collaborative lyric editor) is a **module**, not an app. It's mounted inside whichever shell needs it — inside Adea for an artist writing alone or with one co-writer, inside Musicbox's Studio for a full A&R session with producer/engineer/label all invited into the same room. Same hook (`useCollaborativeLyrics`), two different shells.

| App | Product | Scope | Formerly (wrong) |
|---|---|---|---|
| `apps/adea` | Self-serve artist EPK — public page + own users/music/shop/sync/CMS | Single artist/org | "writer" |
| `apps/web-studio` | Musicbox Studio — Writer Hub (module), A&R Workspace, DAW | Org-wide, multi-collaborator | "web" (partially) |
| `apps/distro-portal` | Musicbox enterprise — Catalog, Rights, Distribution, Royalty, Admin | Org-wide, cross-artist | "admin" |
| `apps/fan` | Direct-to-Fan PWA, offline playback | Public, per-fan | (new) |

## 3. Target Monorepo Layout

Turborepo, single repo (not the 12-repo GitHub-org split from the earlier brainstorm — that's a Phase 4+ luxury once you have a team; one repo is objectively faster for one person or a small team).

```
musicbox/
├── apps/
│   ├── adea/                # self-serve artist EPK: public page + own music/shop/sync/CMS admin
│   ├── web-studio/          # Musicbox Studio — Writer Hub module, DAW, A&R Workspace
│   ├── distro-portal/       # Musicbox enterprise — Catalog, Rights, Distribution, Royalty, Admin
│   └── fan/                 # Direct-to-Fan PWA (offline playback lives here)
├── packages/
│   ├── database/            # schema.prisma lives HERE, nowhere else. Generates @musicbox/db + withOrgScope()
│   ├── ledger/               # double-entry posting helpers, chart-of-accounts seeding
│   ├── auth/                 # Supabase Auth helpers, session/role resolution
│   ├── hooks/                 # useCollaborativeLyrics, useAudioPlayer, useOfflineLibrary — shared across apps
│   ├── ui/                   # shared Tailwind components
│   ├── permissions/            # Role/Permission matrix + guard functions (Section 33 rules)
│   ├── metadata/               # ISRC/UPC/DDEX field validation
│   ├── rights/                  # Split sheet + rights logic (feeds ledger)
│   ├── distribution/             # Delivery adapter interface + TooLost adapter
│   ├── sync/                      # SyncListing/DealRoom state machine
│   ├── touring/                    # Booking/Offer/Settlement logic
│   ├── commerce/                    # Orders/Products/Payouts
│   ├── cms/                          # Page builder models/renderer
│   ├── notifications/                 # Notification event bus
│   ├── sdk/                            # typed client for /api + Supabase Edge Functions
│   └── ts-config/
├── supabase/
│   ├── migrations/           # RLS policies, ledger balance trigger, bucket config
│   └── functions/            # Deno Edge Functions — short-lived glue only (see Section 8)
│       ├── generate-split-sheet-pdf/
│       ├── post-royalty-ledger/
│       └── ...
├── services/                  # long-lived processes — deliberately NOT on Vercel (Section 8)
│   ├── collab-server/          # standalone y-websocket relay for Writer Hub
│   └── ai-worker/               # Demucs/Matchering/RVC job runner, polls AiJob
├── docs/
└── turbo.json
```

**Migration move (do this first, mechanically, no logic changes):**
1. `mkdir apps packages services` at root.
2. `git mv "app/Musicbox App" apps/distro-portal` (split into `distro-portal` + `web-studio` once Studio and Admin diverge; fine to keep merged short-term).
3. `git mv "app/Adea Lyric Frontend.src" apps/adea`
4. `mkdir packages/database && git mv prisma packages/database/prisma`
5. Add a `package.json` to `packages/database` that exports the generated Prisma client.
6. In every app, add `@musicbox/database` as a workspace dependency; do **not** copy the schema into any app.
7. Root `package.json` gets `"workspaces": ["apps/*", "packages/*"]`, add `turbo.json`.
8. Do **not** attempt `services/collab-server` or `services/ai-worker` as Vercel functions — they need long-lived connections/GPU time serverless can't give (Section 8).

Nothing else changes yet — this step is pure file-mechanics so all frontends start pointing at one schema.

---

## 4. Canonical Prisma Models (the contract every package/app reads from)

**Superseded by the actual schema.prisma you're running.** The list below is corrected to match it — three renames/additions from the first draft of this doc, noted inline.

This is the single list every app doc below references by name. Don't let any app doc invent a model that isn't here — add it here first.

**Identity & Access**
`User`, `Account`, `Session`, `Organization`, `Membership` (join: User↔Organization, carries `Role`), `Role`, `Permission`

**Catalog / Digital Asset Management (Section 2.1.1, 6)**
`Artist`, `Label`, `Publisher`, `Song`, `Track`, `Release`, `Album`, `Asset` (audio/artwork/video/stem file pointer), `Credit` (contributor + role on a Track/Song)

**Creation (Studio/Writer)**
`Project`, `StudioSession`, `LyricDoc`, `VoiceNote`, `TrackVersion`

**Rights & Money**
`RightsRecord` (master/publishing/neighboring/mechanical/sync — Section 5.1), `SplitSheet` (now carries `status`, `pdfAssetId`), `SplitParticipant` (renamed from `Split` — participant + percentage), `SplitSignature` (**new** — a split sheet isn't executed until every required participant has `signedAt` set, now a real queryable state), `RoyaltyStatement`, `RoyaltyLineItem`, `LedgerAccount`, `LedgerTransaction` (**new** — the grouping unit; a transaction is immutable and must own ≥2 balanced `LedgerEntry` rows), `LedgerEntry` (double-entry — see §6 below)

**Distribution**
`DistributionSubmission` (adapter-agnostic; `adapterName` = "toolost" for V1 — Section 8.4), `DeliveryTarget` (per-DSP status row)

**Sync**
`SyncListing` (**renamed from `SyncRequest`** — the browsable marketplace entry; deliberately readable cross-tenant, see RLS §5), `DealRoom` (the negotiation — visible only to the two participant orgs), `License`, `LicenseAsset`

**Touring**
`Venue`, `TourDate`, `BookingOffer`, `Settlement`, `Itinerary`

**Commerce**
`Order`, `Product`, `Payout`

**CMS / Growth**
`CMSPage`, `Campaign`, `Notification`

**Async / Collaboration Infrastructure (new — not in the first draft)**
`AiJob` (queue table for Demucs/Matchering/RVC — polled by `services/ai-worker`, never run inline in a request), `CollabDoc` (Postgres pointer for a Yjs room; gates who's allowed to open a websocket to it, holds periodic snapshot `Asset` reference)

Every app doc's "Database models used" section pulls only from this list. If a doc needs something new, that's a signal to extend this file, not to fork the schema.

---

## 5. Supabase Role

Supabase is **infrastructure only** — Postgres, Auth, Storage, Realtime, Edge Functions. Prisma is the **only** thing that writes schema/migrations. Don't hand-edit tables in the Supabase dashboard once Prisma is in place; every change goes `schema.prisma` → `prisma migrate dev` → committed migration → `supabase db push` (or just point Supabase's connection string at what Prisma manages — one Postgres, one migration authority).

**Buckets** (Storage): `audio`, `artwork`, `videos`, `stems`, `contracts`, `press`, `avatars`, `documents`, `exports`.

**RLS pattern:** every table with an `organizationId` or `userId` column gets a policy of the shape:
```sql
create policy "org_isolation" on "Track"
  for all using (
    "organizationId" in (
      select "organizationId" from "Membership" where "userId" = auth.uid()
    )
  );
```
Write this once as a Prisma migration + matching `.sql` policy file per table, not per-app — RLS is a `packages/database` concern.

**The one deliberate exception:** `SyncListing` and `DealRoom` don't follow pure tenant isolation. `SyncListing` is publicly readable by any authenticated org when `status = 'available'` (that's the whole point of a marketplace), writable only by the org that owns the underlying `Track`. `DealRoom` is visible only to its two participant orgs (`licensorOrgId` / `buyerOrgId`) — neither fully closed nor fully open, scoped to exactly the two parties in the negotiation. See `0002_ledger_balance_and_rls.sql` for the actual policy SQL — treat that file as the reference implementation for every future org-scoped table, not just the ledger ones.

**Edge Functions** — short-lived glue only: TooLost webhook receivers, scheduled royalty statement generation, `generate-split-sheet-pdf`, `post-royalty-ledger`, DDEX delivery retries. Anything needing a long-lived connection or heavy compute goes in `services/` instead (Section 8).

---

## 6. Ledger / Double-Entry Schema (for Splits & Royalties)

**Superseded — this is now built and running**, not a sketch. Real shape is `LedgerAccount → LedgerTransaction → LedgerEntry` (a transaction is the grouping unit; an account's entries reference it, not the other way around):

```prisma
model LedgerAccount {
  id             String   @id @default(cuid())
  organizationId String
  code           String   // e.g. "1000-DISTRIBUTION-CLEARING", "2100-PAYABLE-<participantId>"
  name           String
  type           String   // "ASSET" | "LIABILITY"
  ownerType      String   // "PLATFORM" | "PARTICIPANT"
  ownerId        String?
  entries        LedgerEntry[]
}

model LedgerTransaction {
  id             String   @id @default(cuid())
  organizationId String
  memo           String
  sourceType     String   // "DSP_ROYALTY" | "SYNC_FEE" | "PAYOUT"
  sourceId       String
  entries        LedgerEntry[]
  createdAt      DateTime @default(now())
}

model LedgerEntry {
  id            String   @id @default(cuid())
  transactionId String
  transaction   LedgerTransaction @relation(fields: [transactionId], references: [id])
  accountId     String
  account       LedgerAccount @relation(fields: [accountId], references: [id])
  direction     String   // "DEBIT" | "CREDIT"
  amount        Decimal
}
```

Two enforcement layers, not one:
1. **App layer** — `post-royalty-ledger` (edge function) builds the full debit + N-credit entry set for a statement and inserts it as one transaction.
2. **Database layer, the real backstop** — a deferred constraint trigger (`0002_ledger_balance_and_rls.sql`) rejects any `LedgerEntry` write whose parent `LedgerTransaction` doesn't sum to zero (debits positive, credits negative). Even a buggy edge function can't post an unbalanced entry.

Balance is always `sum(debits) - sum(credits)` for an account's entries, computed at read time — never a stored, mutable `balance` column. A withdrawal is a *second* transaction, not an edit to the first.

---

## 7. PDF Split-Sheet Export (pdf-lib)

**Built** as `supabase/functions/generate-split-sheet-pdf` (Deno edge function), not a `packages/rights` library call — this is intentionally glue-tier work (fetch rows, draw text, upload a file), which is exactly what Edge Functions are for. It fetches the `SplitSheet` + `SplitParticipant` + `SplitSignature` rows, **refuses to render if percentages don't sum to 100%** (a 422 before a legal document with bad math ever gets created), draws the document with `pdf-lib`, uploads to the `documents` bucket, and writes the resulting `Asset` id back onto `SplitSheet.pdfAssetId`. Runs under the Supabase service role — this function *is* the trusted boundary that's allowed to bypass RLS, precisely because it's the one place generating a document that will be treated as authoritative.

---

## 8. The Services Tier — What Can't Live on Vercel or in an Edge Function

Two things need a long-lived process or heavy compute that serverless can't provide. Both live in `services/`, deployed to Fly.io/Railway/a VM — never attempted as a Vercel function:

**`services/collab-server`** — a small Node process running `y-websocket`, holding each Writer Hub `Y.Doc` in memory with periodic persistence. Chosen over `y-webrtc` specifically because WebRTC is peer-to-peer with no server-side persistence — fine for a demo, useless for "the label needs to see what happened in this session later." The `CollabDoc` table gates access: before the websocket upgrade happens, check the requesting user's org matches `CollabDoc.organizationId` for that `roomName`. Periodic binary snapshots (`Y.encodeStateAsUpdate(doc)`) persist to the `documents` bucket via `CollabDoc.snapshotAssetId` so a server restart doesn't lose history.

**`services/ai-worker`** — polls (or subscribes via Supabase Realtime to) the `AiJob` table for queued jobs: Demucs (stem separation), Matchering (reference mastering), RVC (voice conversion). None of these belong in a request/response cycle — they can take 30 seconds to several minutes, well past any serverless timeout. Flow: Server Action inserts an `AiJob` row (`status: QUEUED`) → worker downloads the input `Asset`, runs the model, uploads the result as a new `Asset`, flips `status` to `SUCCEEDED`/`FAILED` → client subscribes to that same row via Supabase Realtime, no polling loop on the frontend. RVC specifically triggers the Section 18.1 voice-rights consent flow the moment a job is queued, not after — the `AiJob` row doubles as the audit trail for who generated a voice clone and when.

Lighter AI stays client-side, no worker needed: **Essentia.js** (BPM/key/loudness, runs during upload) and **Magenta.js** (SongStarter melody ideas, TensorFlow.js in-browser). **Datamuse API** for rhyme lookups is a plain REST call from Writer Hub — no infra of your own unless rate limits force a self-hosted CMU-dict engine later.

---

## 9. Offline Playback (Fan App)

**Howler.js + Workbox**, not MPD (MPD is a native daemon — wrong target for a browser/PWA). `useAudioPlayer` wraps Howler with `html5: true` (streams rather than fully buffers, matters once a session queues a full album) and checks a `resolveCachedUrl` callback before hitting the network. `useOfflineLibrary` is the other half: a Workbox service worker with `CacheFirst` + **`rangeRequests: true`** (non-negotiable — seeking requires HTTP range support even against a cached response), plus a client-side-only IndexedDB table tracking which tracks *this device* downloaded — deliberately not synced server-side, since a phone's local downloads shouldn't propagate to a different phone.

---

## 10. Deployment Path (Vercel)

1. `apps/adea`, `apps/web-studio`, `apps/distro-portal`, `apps/fan` each become their own Vercel Project pointed at the same monorepo, different `Root Directory`.
2. All four share one Supabase project (one Postgres, one Auth instance) — same `DATABASE_URL` / `SUPABASE_URL` / `SUPABASE_ANON_KEY` across all four Vercel projects.
3. Set the Supabase JWT to carry an `organization_id` claim at session creation (custom claims via a Postgres function on `auth.users`) — every RLS policy reads `auth.jwt() ->> 'organization_id'`.
4. `packages/database`'s Prisma Client generates at build time (`postinstall: prisma generate`); Turborepo caches this across apps.
5. Migrations run from CI on merge to `main`: `prisma migrate deploy` against the Supabase connection string — never `migrate dev` against production.
6. Edge Functions deploy via `supabase functions deploy` in the same CI job.
7. `services/collab-server` and `services/ai-worker` deploy separately to Fly.io/Railway — not part of the Vercel build at all.

---

## 11. Build Order (what to actually do, in order)

1. Mechanical monorepo split (Section 3 above) — no logic yet.
2. `packages/database`: write Identity + Catalog models only (User, Organization, Membership, Role, Permission, Artist, Song, Track, Release). Get one migration running against Supabase.
3. Run `0002_ledger_balance_and_rls.sql` against Supabase; confirm the deferred trigger actually rejects a deliberately unbalanced test transaction before trusting it.
4. Wire `apps/adea`'s existing landing/auth page to real Supabase Auth + `User`/`Organization` — this is the first real "not a shell" milestone.
5. Wire Writer Hub (`useCollaborativeLyrics`) into `apps/adea` against `Project`/`LyricDoc`, reusing `@musicbox/auth`. Stand up `services/collab-server` at this point, not before.
6. Seed the chart of accounts (`LedgerAccount`) for your one Organization now, before the first real royalty statement.
7. Only then start Rights/Ledger end-to-end, Distribution, Sync, `services/ai-worker` — those depend on Catalog existing and being real.

---

## 12. The 13 Application Docs

Each doc in this `/docs` folder answers: Purpose · Users & Roles · Navigation · Dashboard · Sidebar · Core Entities · Features · Workflows · Database Models Used · API Endpoints · Permissions · Integrations · Notifications · Reports · Future Roadmap — and every "Database Models Used" section pulls only from Section 4 above. Two of those docs need a one-line correction given Section 2: **Writer Hub** is a module mounted inside Adea and inside Musicbox Studio, not a standalone app; **Website Manager / CMS / Commerce / Sync Hub** each apply at two scopes now — single-artist inside Adea, org-wide inside Musicbox — same models, same features, filtered by `organizationId` either way.
