# CRM

## Purpose
Tracks relationships and pipeline for external contacts the label deals with outside the artist roster itself — venue/buyer contacts, sync buyers, press contacts — complementing Artist Manager (internal roster) rather than duplicating it.

## Users & Roles
- Label/Artist Manager (primary)
- Booking Agent/Tour Manager (venue/buyer contacts)
- Marketing/Promo Specialist (press/media contacts)

## Navigation
Sidebar: Contacts · Pipelines · Activity Log

## Dashboard
Contacts by pipeline stage (new/contacted/won), stale contacts needing follow-up.

## Sidebar
Contact Directory · Pipeline Boards (Kanban) · Activity Timeline · Tags & Segments

## Core Entities
`Organization` (external orgs), a lightweight `Contact` model (not yet in the canonical list — add to Architecture doc Section 3 before building), `Venue`

## Features
- Contact directory shared with Venue Directory (Touring) and Sync Marketplace Participants (Sync Hub) rather than three separate address books
- Kanban pipeline (new → contacted → won), same status-color semantics as everywhere else (Section 30.1)
- Activity timeline per contact

## Workflows
Contact created (manually or from an inbound Sync Request/Booking inquiry) → tagged and staged in a pipeline → activity logged as calls/emails/meetings occur → converted to a formal `BookingOffer` or `SyncRequest` when it's ready to become a real transaction.

## Database Models Used
`Contact` *(new — add to canonical model list)*, `Venue`, `Organization`

## API Endpoints
- `POST /api/crm/contacts`
- `PATCH /api/crm/contacts/:id/stage`
- `GET /api/crm/pipeline`

## Permissions
`crm.contact.write` scoped to `Organization`; venue contacts additionally visible to Touring role.

## Integrations
Feeds Venue Directory (Touring) and Sync Marketplace inbound requests (Sync Hub) — same underlying contact record, not a duplicate.

## Notifications
New inbound contact, stale contact reminder, stage change.

## Reports
Pipeline conversion rate, contacts by source (sync inbound vs. touring vs. manual).

## Future Roadmap
Email/inbox integration for auto-logging activity; press-contact segment for Marketing Hub campaigns.
