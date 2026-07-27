# Adea Lyric — Inspect Download

This folder contains the full source code and Supabase migrations for the Adea Lyric platform.

## What's here

```
Inspect-Download/
├── src/               # All source code (the running app)
├── supabase/
│   └── migrations/    # 6 SQL migration files
└── MIGRATION-PLAN.md  # SPA → Next.js App Router migration strategy
```

## How to inspect

1. Open this folder in your IDE
2. Read MIGRATION-PLAN.md first
3. Start with `src/app/SpaClient.tsx` — it's the routing source of truth
4. Then `src/lib/mock-fallback.ts` — maps API patterns to mock data
5. Compare `src/types/database.ts` against `supabase/migrations/`

## Key files

| File | Why it matters |
|------|---------------|
| `src/app/SpaClient.tsx` | The entire hash router (~6000 lines). Every route lives here. |
| `src/lib/router.tsx` | Hash router hooks — `useRouter()` returns `{ path, navigate }` |
| `src/lib/api-client.ts` | HTTP client + mock fallback system |
| `src/lib/mock-data.ts` | All mock data shapes — become your real data contracts |
| `src/lib/ensure-array.ts` | Defensive utility preventing PaginatedResponse crashes |
| `src/types/database.ts` | TypeScript type system — maps to Supabase schema |
| `src/hooks/queries/` | 15 React Query hook files — the data layer to replace |
| `src/components/layout/` | 5 portal shells (Admin, Pro, Fan, Sync, Writer) |
