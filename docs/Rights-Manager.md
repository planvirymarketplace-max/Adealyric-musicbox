# Rights Manager

## Purpose
RightsOS — the system of record for master, publishing, neighboring, mechanical, and sync rights, territories, expirations, ownership, and licenses (System Architecture Section 5). The Royalty Engine, Delivery Engine, and Sync Hub all read from this module rather than maintaining their own copy.

## Users & Roles
- Publisher/Royalty Administrator (primary)
- Label/Artist Manager (secondary)
- Artist/Songwriter (secondary, own splits)

## Navigation
Sidebar: Rights Records · Split Sheets · Collection Societies · Identifier Registry · Conflicts

## Dashboard
Action cards: Split Conflicts, missing IPI/ISWC registrations, rights nearing territory/expiration limits.

## Sidebar
Master/Publishing/Neighboring/Mechanical/Sync Rights · Split Sheets · PRO/CMO Registration Status · Identifier Registrations (ISRC/UPC/ISWC/IPI) · Sampling Clearances

## Core Entities
`RightsRecord`, `SplitSheet`, `Split`, `LedgerAccount`

## Features
- Five rights types tracked with owner/territory/expiration/percentage per record (Section 5.1)
- Automated split sheet generation on track completion (Section 18.3) — no manual filing
- PRO/CMO registration push to ASCAP, BMI, The MLC, SoundExchange via developer APIs
- Sampling fee/clearance modeling as ongoing splits, not one-time fees (Section 15.3)
- Split conflict detection across Beat Marketplace, Songwriting Workspace, and this module (Section 20.13)

## Workflows
1. Track/beat sale or songwriting session generates `Credit` records → `SplitSheet` draft auto-created (Section 20.11, 20.12).
2. All named parties sign (e-signature).
3. `RightsRecord` finalized; registration data pushed to relevant PRO/CMO.
4. Conflicts (overlapping/inconsistent splits) flagged to AI Assistant and Dashboard before release goes out.

## Database Models Used
`RightsRecord`, `SplitSheet`, `Split`, `LedgerAccount`, `Credit`, `Track`, `Release`

## API Endpoints
- `POST /api/rights/split-sheets`
- `POST /api/rights/split-sheets/:id/sign`
- `POST /api/rights/register` — push to PRO/CMO API
- `GET /api/rights/conflicts`

## Permissions
`rights.record.write` restricted to Publisher/Royalty Administrator and Label Admin roles; Artist/Songwriter can view their own splits only.

## Integrations
ASCAP/BMI/The MLC/SoundExchange developer APIs; feeds the Ledger (Architecture doc Section 5) and pdf-lib export for signed split sheets.

## Notifications
Split sheet awaiting signature, conflict detected, registration confirmed/failed.

## Reports
Unregistered works count, rights expiring within 90 days, split conflict rate by portal source.

## Future Roadmap
Automated retroactive "black box" royalty recovery matching (Section 41); CWR batch registration.
