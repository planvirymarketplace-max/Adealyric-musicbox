# Sync Hub

## Purpose
SyncOS — a role-gated marketplace view into the same catalog used for DSP delivery, exposing sync-specific creative/legal metadata to music supervisors, brands, and agencies without granting distribution or accounting access (System Architecture Section 7).

## Users & Roles
- Music Supervisor / Sync Agent (primary, external)
- Artist/Label (pitching side, secondary)
- A&R (approves sync-readiness)
- Marketing Specialist (secondary)

## Navigation
Sidebar: Sync Search · Deal Rooms · Submission Inbox · Pitch Pipeline · Licensing History

## Dashboard
Open Deal Rooms needing response, new inbound requests, tracks awaiting A&R sync-readiness sign-off.

## Sidebar
Advanced Sync Search · Deal Rooms · A&R Workspace · Sync Marketplace Participants · Automatic Sync Package status

## Core Entities
`SyncRequest`, `DealRoom`, `License`, `LicenseAsset`, `Track`

## Features
- Advanced Sync Search across mood/genre/tempo/key/vocal/clearance/territory (Section 7.2, 6.3)
- Deal Rooms: full Request → Private Workspace → Review → Approve → Negotiate → Contract → Sign → Invoice → Deliver → Usage → Royalty Tracking flow (Section 7.4)
- Automatic Sync Package generation the moment a master is approved (Section 7.6)
- A&R Workspace — extends live Studio sessions to business-side sign-off roles (Section 7.7)
- Pitch Pipeline placement CRM

## Workflows
Sync Request to Royalty Tracking (Section 7.4, 11 steps): a supervisor requests a song → private Deal Room created → watermarked preview reviewed → versions approved → terms negotiated in-room → Rights Manager checks ownership/one-stop status → contract generated and signed → invoice issued → assets delivered → usage tracked → sync fee flows into the Royalty Engine against the same canonical song record.

## Database Models Used
`SyncRequest`, `DealRoom`, `License`, `LicenseAsset`, `Track`, `RightsRecord`, `LedgerEntry`

## API Endpoints
- `GET /sync/search`
- `GET /sync/tracks/:id`, `/sync/tracks/:id/preview`
- `POST /sync/license-requests`
- `GET /sync/license-requests/:id`
- `GET /sync/tracks/:id/assets`

## Permissions
Sync Agent/Music Supervisor: read catalog + Deal Room participation only, no distribution/royalty/accounting access (Section 7.3 role matrix).

## Integrations
Reads the same canonical `Track` record Studio/Catalog produce — no re-upload. Feeds `packages/rights` and the Ledger (Section 5 of Architecture doc) on contract signature.

## Notifications
New sync request, Deal Room updated, contract signed, invoice paid.

## Reports
Placements by buyer category (Section 7.5), average time-to-close per Deal Room, sync revenue by track/genre.

## Future Roadmap
Free access tier for verified supervisors; automated brief-matching via AI Assistant sync-opportunity suggestions (Section 20.13).
