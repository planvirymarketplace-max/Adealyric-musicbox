# Analytics Center

## Purpose
The shared analytics core (System Architecture Section 13, Section 45) that Catalog, D2F, Touring, and Marketing all mount on rather than each building their own reporting stack. One data model, filtered per portal's context.

## Users & Roles
- All roles view a scoped slice (Artist sees own stats, Label Admin sees roster-wide, Super Admin sees global rollup)

## Navigation
Sidebar: Overview · Streams & Revenue · Audience · Sync · Touring · Global Rollup (Admin only)

## Dashboard
Chart-first (Section 29 Chart-First Dashboard component): revenue trend, top tracks, geography, device breakdown.

## Sidebar
Streaming Analytics · Revenue by DSP/Track/Album · Audience (followers, playlist adds, saves, Shazams, TikTok videos) · Sync Placements · Tour Performance · Global Analytics Rollup

## Core Entities
Reads from `Track`, `Release`, `Order`, `LedgerEntry`, `TourDate`, `SyncRequest` — Analytics Center has no primary entities of its own; it's a query/aggregation layer.

## Features
- Streams, revenue, geography, devices, followers, playlist adds, saves, Shazams, TikTok videos
- Revenue by DSP/track/album
- Global rollup aggregating Catalog, D2F, Touring, and Marketing analytics into one dashboard (Section 44.G) instead of duplicating metrics per portal

## Workflows
Each portal's underlying data (a stream report, an order, a settlement, a sync royalty) writes normally to its own model; Analytics Center runs scheduled aggregation (materialized views or a nightly job) rather than each portal computing its own rollup independently.

## Database Models Used
`Track`, `Release`, `Order`, `LedgerEntry`, `TourDate`, `SyncRequest`, `RoyaltyStatement`

## API Endpoints
- `GET /api/analytics/overview`
- `GET /api/analytics/tracks`, `/releases`, `/artists`
- `GET /api/analytics/global-rollup` (Super Admin only)

## Permissions
Scoped identically to the underlying data — an Artist's analytics query is filtered to their own `Organization`/`Membership`, same rule as Universal Search (Section 33).

## Integrations
TooLost's `/sales` and `/analytics` endpoint groups (Section 8.4) feed an independently reconcilable earnings stream, useful for catching discrepancies against royalty files.

## Notifications
Anomaly detection (sudden revenue drop/spike), milestone reached (e.g., 1M streams).

## Reports
All of the above, exportable as CSV; scheduled email digest option.

## Future Roadmap
Predictive playlist/release-timing suggestions feeding back into Marketing Hub and AI Assistant.
