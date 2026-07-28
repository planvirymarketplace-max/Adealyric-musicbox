# Distribution Center

## Purpose
Validates and delivers a finished release to DSPs. Runs V1 on the TooLost white-label adapter (System Architecture Section 8.4, 16.1) while direct-to-DSP capability is built in parallel (Section 16.2). Nothing reaches a DSP without passing the Validation Engine (Section 9).

## Users & Roles
- Artist (self-serve submission)
- Label/Manager (bulk/roster submission)
- Distributor Ops (enterprise ingestion pipelines)

## Navigation
Sidebar: Submit Release · Delivery Status · Validation Errors · DSP Directory

## Dashboard
Action cards: Metadata Errors, DSP Rejections (Section 28) — surfaced before historical metrics.

## Sidebar
New Release Wizard · Delivery Status by DSP · Validation Queue · Channel Directory (Section 4) · Territory Exclusions

## Core Entities
`Release`, `Track`, `DistributionSubmission`, `DeliveryTarget`, `Asset`

## Features
- Delivery to 45+ DSPs via adapter pattern (Section 8.3); V1 = TooLost adapter
- Free UPC/ISRC issuance, DDEX ERN/RIN/MEAD/PIE/MWN generation
- Artwork/audio/metadata/copyright/territory validation before submission (Section 9)
- Territory exclusions, custom pricing, pre-order preview hiding
- Video distribution, TikTok Official Sound distribution, ringtone generator
- Access-Reality validation — never routes to a channel without actual standing (Section 4.13, 9.6)

## Workflows
End-to-End Release Pipeline (Section 10.2): Catalog record created → Validation Engine checks pass → Delivery Engine dispatches per-DSP adapter payloads → DSP confirms/rejects → status surfaces on Dashboard and Notification Center.

## Database Models Used
`Release`, `Track`, `Asset`, `DistributionSubmission`, `DeliveryTarget`, `RightsRecord`

## API Endpoints
- `POST /releases` (mirrors TooLost's own schema — draft)
- `PATCH /releases/:id/metadata`, `/delivery`
- `POST /releases/:id/submit`
- `POST /releases/validate/upc`, `/releases/validate/isrc`
- `GET /releases/:id` status polling

## Permissions
`distribution.release.write` scoped to `Organization`; submit action additionally requires Validation Engine pass (enforced server-side, not just UI-gated).

## Integrations
TooLost REST API (OAuth2 + PKCE, Section 8.4) as the V1 adapter; direct DSP adapters added later behind the same interface (`packages/distribution`).

## Notifications
Distribution failed, store rejection, release went live.

## Reports
Delivery success rate per DSP, average time-to-live, rejection reasons breakdown.

## Future Roadmap
Direct DSP feeds replacing/supplementing TooLost as agreements are secured (Section 16.2); physical distribution (vinyl/CD) pipeline.
