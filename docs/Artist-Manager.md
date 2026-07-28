# Artist Manager

## Purpose
Roster & Identity Management (Section 44.A) — the master artist/label directory every other portal reads from. This is the "single source of truth for who exists," distinct from Catalog (what they've released) — no re-entering an artist's name/profile per portal.

## Users & Roles
- Super Admin (bulk user management, tiering)
- Label/Artist Manager (own roster onboarding/approval)

## Navigation
Sidebar: Roster · Onboarding Queue · Roles & Permissions · Artist Tiering

## Dashboard
Action card: Artists Awaiting Onboarding (incomplete verification/tax/banking, Section 28).

## Sidebar
Roster List · Onboarding & Approval Workflow · Role & Permission Assignment · Bulk User Management · Artist Tiering

## Core Entities
`Artist`, `Organization`, `Membership`, `Role`

## Features
- Master artist/label directory read by Studio, Catalog, D2F, Distribution, Touring
- Roster onboarding & approval workflow (Portal IA Section 3.7)
- Role assignment per artist (Co-Writer, Manager, Booking Agent, etc.)
- Bulk user management (deactivate, merge duplicate profiles)
- Artist tiering: self-serve indie vs. label-managed vs. enterprise/major

## Workflows
1. New artist signs up → Onboarding wizard collects verification, tax forms, banking, contracts (System Architecture Section 10.1).
2. Admin reviews and approves.
3. Role assignment determines which portals (Studio, Distribution, Sync, Touring) the artist and their invited collaborators can see.
4. Artist tier determines feature gating downstream (e.g., white-label eligibility).

## Database Models Used
`Artist`, `Organization`, `Membership`, `Role`, `Permission`

## API Endpoints
- `POST /api/artists`
- `PATCH /api/artists/:id/approve`
- `POST /api/artists/:id/roles`
- `POST /api/artists/merge` — duplicate profile merge

## Permissions
`roster.artist.write` — Label Admin scoped to own roster; Super Admin unrestricted.

## Integrations
Feeds every other portal's artist-selector; no other module stores its own artist profile copy.

## Notifications
New onboarding request, verification incomplete, artist tier changed.

## Reports
Roster growth, onboarding funnel drop-off, artists by tier.

## Future Roadmap
Self-service artist tier upgrade requests; automated duplicate-profile detection.
