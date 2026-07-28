# Marketing Hub

## Purpose
Runs campaigns and label-services marketing: genre specialist teams, DSP marketing, playlisting, influencer/TikTok campaigns, catalog optimization, and the "Label Services" revenue split model (System Architecture Section 17.2, Section 44).

## Users & Roles
- Marketing/Promo Specialist (primary)
- Label/Artist Manager (secondary)

## Navigation
Sidebar: Campaigns · Playlisting · Market Scanner · UGC Claims

## Dashboard
Active campaigns, playlist pitch status, UGC claim/dispute queue, email campaign performance.

## Sidebar
Campaigns (influencer, TikTok, social) · Email Newsletters · Market Scanner · Catalog Optimization/Playlisting · UGC Claim Management · YouTube Content ID Monetization

## Core Entities
`Campaign`, `Artist`, `Track`

## Features
- Genre specialist and activity specialist workflows (OOH, DSP marketing, in-house production, PR, radio/TV, A&R)
- Influencer and TikTok ad campaigns, social media activations
- Email newsletters (shared send infrastructure with D2F's fan email campaigns, Section 44)
- Market Scanner (opportunity/trend detection)
- Catalog optimization for playlist reach expansion
- UGC claim/dispute management and YouTube Content ID monetization
- "Label Services" 15–30% master-royalty-split offer flow (Section 17.2) — artist keeps 100% publishing

## Workflows
Marketing Specialist launches a `Campaign` targeting a `Track`/`Artist` → tracks spend and performance → results feed Analytics Center → high-performing artists flagged for a Label Services offer, which routes into Rights Manager as a new split arrangement.

## Database Models Used
`Campaign`, `Artist`, `Track`, `RightsRecord`

## API Endpoints
- `POST /api/marketing/campaigns`
- `GET /api/marketing/campaigns/:id/performance`
- `POST /api/marketing/ugc-claims`

## Permissions
`marketing.campaign.write` scoped to `Organization`.

## Integrations
YouTube Content ID, TikTok ad platform, shared analytics core (Section 45) with Catalog/D2F/Touring.

## Notifications
Campaign performance milestone, UGC claim dispute, playlist add.

## Reports
Campaign ROI, UGC claim revenue recovered, playlist reach growth.

## Future Roadmap
AI-drafted marketing plans from track metadata (Section 20.13 AI Assistant integration).
