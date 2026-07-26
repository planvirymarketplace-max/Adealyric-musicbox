---
Task ID: 1
Agent: Main Agent
Task: Complete frontend overhaul — white backgrounds, nav/footer restructuring, booking widget, Buy Now, slow listening schema, catalog taxonomy

Work Log:
- Read all key files: Shop.tsx, catalog.ts, SiteChrome.tsx, MusicDiscography.tsx, BioAccount.tsx, Booking.tsx, page.tsx, store.ts, prisma/schema.prisma
- Analyzed reference image with VLM: left album cover on gray bg, right side vertical action list with black circle dots, white background
- Updated SiteChrome.tsx: removed Booking/Account from NAV, added Log In/Sign Up/Cart to header, moved Booking to footer, added light prop to SiteHeader/PageShell/PageIntro
- Updated page.tsx: removed Account tab, added light mode for interior pages, detail pages get their own shell
- Updated MusicDiscography.tsx: Discography page has dark hero + white content, filters/player in white, added Buy Now button on release detail, Tour page has dark hero + white content + booking widget
- Updated BioAccount.tsx: BioPage dark hero + white content
- Updated Booking.tsx: dark hero + white content, form inputs styled for white bg
- Updated prisma/schema.prisma: added Listening_Session, Listening_Access, Listening_Progress models for slow/partial listening
- Fixed catalog.ts unquoted key lint errors
- Catalog.ts already has complete CATEGORY_TREE with all taxonomy from product-catalog-schema.md including Beauty, Bags, Apparel subcategories

Stage Summary:
- All interior pages now have dark hero sections with white content below (matching shop page style)
- Navigation: Booking moved to footer, Account removed, Log In and Sign Up added
- Tour page has "Book Adea →" booking widget
- Release detail page has "Buy Now" button linking to shop
- Slow listening schema designed with 3 models: Session, Access, Progress
- Album detail page already had correct layout from previous session (left cover + right vertical action list with black dots)
- Category sidebar already present on all shop pages from previous session
- Dev server compiling, lint passes with 1 warning (unrelated alt-text issue)