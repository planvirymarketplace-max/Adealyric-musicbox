# Tour Manager

## Purpose
Touring & Booking Back Office — venue database, holds/offers, contracts, deposits, settlements, and itineraries (System Architecture Section 21/43). Deep-dive spec exists at Section 21 as the reference example for how one sidebar item decomposes into full field/state spec.

## Users & Roles
- Booking Agent/Tour Manager (primary)
- Label/Artist Manager (secondary, roster-wide view)
- Crew & Team members (itinerary/task assignees)

## Navigation
Sidebar: Venue Database · Holds Calendar · Offers · Contracts · Payments · Itineraries · Team

## Dashboard
Upcoming confirmed dates, holds aging past threshold (bottleneck flag), settlements pending.

## Sidebar
Venue Directory · Smart Holds Calendar · Offer Sheet (Kanban) · Contract Builder · Deposit/Settlement Collection · Tour Analytics · Itinerary Builder · Team & Task Delegation

## Core Entities
`Venue`, `TourDate`, `BookingOffer`, `Settlement`, `Itinerary`

## Features
- Searchable venue database (Overture/Pollstar-style), card grid + filter by genre/capacity/region
- Radius clauses attached as a field set on a Booking Request
- Smart Holds Calendar with competing-holds-inline color coding
- Offer Sheet Kanban (Sent → Countered → Accepted)
- Contract Builder wizard (Select Template → Auto-Fill From Booking → Review → Send for Signature), same doc-gen engine as Publishing's Agreement Generator
- Configurable deposit-collection schedule with auto-reminders
- Show Settlements (gross revenue, expenses, promoter split, final settlement)
- Tour Analytics (chart-first: dates, tracked artists, forecasting, bottlenecks)

## Workflows
Venue selected → Hold placed on Smart Holds Calendar → Offer Sheet sent/countered/accepted → Contract auto-filled from booking fields and sent for e-signature → deposit schedule configured → show occurs → Settlement recorded in Detail Drawer → revenue flows into Analytics and cross-portal P&L rollup (Section 44.E).

## Database Models Used
`Venue`, `TourDate`, `BookingOffer`, `Settlement`, `Itinerary`, `Payout`

## API Endpoints
- `GET /api/touring/venues`
- `POST /api/touring/holds`
- `PATCH /api/touring/offers/:id`
- `POST /api/touring/contracts/generate`
- `POST /api/touring/settlements`

## Permissions
`touring.booking.write` scoped to the agent's assigned artists; Label Admin sees full roster.

## Integrations
Google Calendar sync for confirmed dates/itineraries; same payments rail (FlexPay) as Commerce Manager and Royalty disbursement (Section 45).

## Notifications
Hold expiring, offer countered, contract signed, booking confirmed, settlement ready.

## Reports
Tour dates by status, show forecasting (confirmed + held projected revenue), bottleneck aging report.

## Future Roadmap
Cross-portal date-conflict detection (release date colliding with tour date, Section 44.C); venue/agent dispute escalation queue.
