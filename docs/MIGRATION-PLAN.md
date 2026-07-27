# SPA → Next.js App Router Migration Plan

## Current state

The app uses a **hash-based SPA router** (`SpaClient.tsx` ~6000+ lines) that renders everything client-side. All data comes from **mock fallback** — no real backend. There are 5 portals (Admin, Pro, Fan, Sync, Writer) each with their own shell component and sidebar.

## Phase 0: Audit (do this first)

Open `src/app/SpaClient.tsx` and map every hash route → component. This is your migration source of truth. Then read each file below and understand what it does:

- `src/lib/mock-fallback.ts` — API URL patterns → mock data
- `src/lib/mock-data.ts` — mock data shapes (your real data contracts)
- `src/types/database.ts` — TypeScript types (maps to Supabase schema)
- `src/hooks/queries/` — 15 hook files, each with query keys and API paths
- `supabase/migrations/` — 6 SQL files defining real database tables

## Phase 1: Create App Router directory structure

Replace hash routes with `src/app/` file-based routes:

```
src/app/
  admin/
    layout.tsx              ← wraps AdminLayout
    dashboard/page.tsx      ← imports AdminDashboardPage
    shop/albums/page.tsx
    shop/collections/page.tsx
    shop/shop-all/page.tsx
    shop/get-the-look/page.tsx
    discography/page.tsx    ← 5-step wizard
    tour/calendar/page.tsx  ← publish toggle
    tour/bookings/page.tsx
    cms/banners/page.tsx    ← target_pages multi-select
    ...
  pro/
    layout.tsx              ← wraps ProPortalShell
    overview/page.tsx
    catalog/page.tsx
    booking/overview/page.tsx
    ...
  portal/
    layout.tsx              ← wraps PortalShell
    home/page.tsx
    music/page.tsx
    shop/page.tsx
    ...
  sync/
    layout.tsx              ← wraps SyncPortalShell
    overview/page.tsx
    search/page.tsx
    ...
  writer/
    layout.tsx              ← wraps WriterPortalShell
    overview/page.tsx
    submit/page.tsx
    ...
```

Each `page.tsx` is a thin wrapper:
```tsx
import { AdminDashboardPage } from '@/admin/pages/AdminDashboardPage';
export default function AdminDashboardRoute() {
  return <AdminDashboardPage />;
}
```

Each `layout.tsx` wraps the portal shell:
```tsx
import { AdminLayout } from '@/components/layout/AdminLayout';
export default function AdminLayoutRoute({ children }) {
  return <AdminLayout>{children}</AdminLayout>;
}
```

## Phase 2: Wire Supabase

1. Create `src/lib/supabase.ts` — Supabase client init
2. Create `src/lib/supabase-auth.ts` — replace JWT helpers with Supabase Auth
3. Map Supabase migration tables → Prisma schema (ensure they match)
4. Generate Prisma client with Supabase connection string
5. Add RLS policies per portal

### Migration → Schema checklist

| Migration | Tables |
|-----------|--------|
| 0001_admin_portal_core | Core admin tables |
| 0002_cms_ticketing_fan_mgmt | CMS, ticketing, fan management |
| 0003_track_commerce | Track, commerce, audio storage |
| 0004_b2b_portal_schema | B2B/industry portal |
| 0005_user_portal_enhancements | User portal enhancements |

## Phase 3: Replace mock hooks with real queries

For each hook in `src/hooks/queries/`:

1. Keep the same query key structure
2. Point `apiClient` calls at real Supabase-backed API routes
3. Keep `ensureArray()` defensive utility during transition
4. Phase out `mock-fallback.ts` once backend is stable

## Phase 4: Remove SPA router

1. Delete `SpaClient.tsx`
2. Delete `src/app/[...slug]/page.tsx` (catch-all that renders SpaClient)
3. Delete `src/lib/router.tsx` (hash router)
4. Replace all `useRouter()` from `@/lib/router` with `useRouter()` from `next/navigation`
5. Update all `navigate('/path')` calls to `router.push('/path')`

## Product types to build

- Standard merch (apparel, accessories)
- `hair_wig` — custom product type with size guide
- `footwear` — custom product type with size guide
- Music (vinyl, cassette, CD, digital)
