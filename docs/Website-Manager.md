# Website Manager

## Purpose
Owns the public, unauthenticated surface of Music-in-a-Box: marketing site, artist showcase pages, label storefront pages, and SEO-facing content. This is what a visitor sees before logging into any workspace — distinct from CMS (the editing tool) in that Website Manager is the *rendering + routing* layer, while CMS is the *authoring* layer.

## Users & Roles
- Super Admin / Platform Operator (full control)
- Label/Artist Manager (scoped to their own roster's public pages)
- Marketing Specialist (content edits, no structural changes)
- Public/anonymous visitor (read-only)

## Navigation
Top-level: Home · Artists · Releases · Label · Contact. Workspace switcher is hidden entirely on public routes — this app has no sidebar shell for anonymous users.

## Dashboard
Admin-only view: page list with publish status (draft/staged/live), last-modified, and traffic snapshot per page.

## Sidebar (admin view only)
Pages · Artist Showcase Pages · Redirects & SEO · Domains · Templates

## Core Entities
`CMSPage`, `Artist`, `Release`, `Organization`

## Features
- Public artist showcase pages (bulk-editable from Admin, Section 44.F)
- Label storefront landing page
- SEO settings & redirects
- Staging → preview → publish workflow
- Multi-language/localization support

## Workflows
1. Marketing Specialist drafts a page in CMS → saved as `CMSPage.status = draft`.
2. Admin previews via staging URL.
3. Publish flips `status = live`; page becomes reachable at its public route.
4. Redirects created automatically when a page's slug changes.

## Database Models Used
`CMSPage`, `Artist`, `Release`, `Organization`, `Membership`

## API Endpoints
- `GET /api/pages/:slug` — public page render data
- `POST /api/admin/pages` — create page (auth required)
- `PATCH /api/admin/pages/:id/publish`
- `GET /api/admin/pages` — list with status

## Permissions
Public routes: no auth. Admin routes: gated by `Permission: cms.page.write` scoped to `Organization`.

## Integrations
Shares the Public-Facing Page Renderer with Catalog's branded portfolio page and Distribution's artist pages (Section 45 cross-cutting system) — one rendering engine, three audiences.

## Notifications
"Page published", "Page failed SEO check" surface in the Notification Center (Section 23).

## Reports
Page views, top referrers, per-page conversion to artist follow/fan signup.

## Future Roadmap
Drag-and-drop template builder; A/B testing on landing pages; custom domain mapping per label.
