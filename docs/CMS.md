# CMS

## Purpose
The authoring tool behind every public page Website Manager renders — page builder, editorial/blog, navigation/menu builder, and the shared media library. CMS produces `CMSPage` records; Website Manager serves them.

## Users & Roles
- Super Admin (global templates, navigation structure)
- Label/Artist Manager (own pages)
- Marketing Specialist (drafting, editorial)

## Navigation
Sidebar: Pages · Blog/Press · Navigation Builder · Media Library · Templates

## Dashboard
Draft count, pending review count, recently published, broken-link/asset warnings.

## Sidebar
Page Builder · Editorial/Blog · Navigation & Menus · Media Library · SEO Settings · Templates

## Core Entities
`CMSPage`, `Asset` (shared media library), `Organization`

## Features
- Drag-and-drop page builder (templates)
- Editorial/news/blog with scheduling
- Navigation/menu builder
- Shared media library (press photos, banners) reused across storefront, EPK, and showcase pages
- Localization / multi-language content
- Staging → preview → publish

## Workflows
1. Author selects a template → builds page in editor → attaches `Asset`s from the shared media library.
2. Save creates/updates a `CMSPage` row (draft).
3. Reviewer approves → Website Manager exposes it.

## Database Models Used
`CMSPage`, `Asset`, `Organization`, `Membership`

## API Endpoints
- `POST /api/cms/pages`
- `PATCH /api/cms/pages/:id`
- `GET /api/cms/media` — media library listing
- `POST /api/cms/media/upload` — signed upload to `press`/`avatars` bucket

## Permissions
`cms.page.write`, `cms.media.write`, scoped per `Organization`.

## Integrations
Media Library is shared with Catalog Portal's asset storage and Distribution's artist-page assets (Section 45). Draft/publish states feed Dashboard Action Cards ("Needs Approval").

## Notifications
Draft submitted for review, publish succeeded/failed.

## Reports
Content freshness (pages not updated in N days), media library storage usage.

## Future Roadmap
Version history/rollback per page; AI-assisted copy drafting from artist metadata.
