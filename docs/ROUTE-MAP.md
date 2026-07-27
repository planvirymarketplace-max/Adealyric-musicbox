# Route Mapping from SpaClient.tsx

This document maps all hash routes from the current SPA router to their corresponding components.

## Root Route
- `/` → GatePage

## Fan Portal (/portal)
Layout: PortalShell (except for login/signup which render without shell)

- `/portal` → PortalHomePage
- `/portal/login` → PortalLoginPage (no shell)
- `/portal/signup` → PortalSignupPage (no shell)
- `/portal/dashboard` → PortalDashboardPage
- `/portal/account` → PortalLoyaltyPage
- `/portal/music` → PortalMusicPage
- `/portal/music/:id` → PortalReleaseDetailPage
- `/portal/events` → PortalEventsPage
- `/portal/events/:id` → PortalEventDetailPage
- `/portal/gallery` → PortalGalleryPage
- `/portal/videos` → PortalVideosPage
- `/portal/shop` → PortalShopPageNew
- `/portal/shop/:id` → PortalProductDetailPage
- `/portal/wallet` → PortalWalletPage
- `/portal/cart` → PortalCartPage
- `/portal/orders` → PortalOrdersPage
- `/portal/tours` → PortalToursPage
- `/portal/membership` → MembershipPage
- `/portal/exclusive` → ExclusivePage
- `/portal/community` → CommunityPage
- `/portal/premium` → PremiumContentPage

## Pro Portal (/pro)
Layout: ProPortalShell (with role prop)

### Auth
- `/pro/login` → ProLoginPage
- `/pro/signup` → ProSignupPage
- `/pro/pending` → ProPendingPage
- `/pro/suspended` → ProSuspendedPage

### Label Dashboard (role="label")
- `/pro` → LabelOverview (default)
- `/pro/dashboard/label` → LabelOverview
- `/pro/dashboard/label/catalog` → LabelCatalog
- `/pro/dashboard/label/requests` → LabelRequests
- `/pro/dashboard/label/deals` → LabelDeals
- `/pro/dashboard/label/custom` → LabelCustomWrite
- `/pro/dashboard/label/messages` → LabelMessages
- `/pro/dashboard/label/documents` → LabelDocuments

### Booking Dashboard (role="booking")
- `/pro/dashboard/booking` → BookingOverview
- `/pro/dashboard/booking/:subpage` → GenericProPage (booking)

### Writer Dashboard (role="writer")
- `/pro/dashboard/writer` → WriterOverview
- `/pro/dashboard/writer/:subpage` → GenericProPage (writer)

### Admin Dashboard (role="admin")
- `/pro/dashboard/admin` → ProAdminDashboard
- `/pro/dashboard/admin/:subpage` → GenericProPage (admin)

### New Industry & Sync Routes
- `/pro/catalog/releases` → ProCatalogReleasesPage
- `/pro/catalog/tracks` → ProCatalogTracksPage
- `/pro/catalog/assets` → ProCatalogAssetsPage
- `/pro/distribution/status` → ProDistributionStatusPage
- `/pro/distribution/submit` → ProDistributionSubmitPage
- `/pro/distribution/corrections` → ProDistributionCorrectionsPage
- `/pro/sync/search` → ProSyncSearchPage
- `/pro/sync/deals` → ProSyncDealRoomsPage
- `/pro/sync/workspace` → ProSyncWorkspacePage
- `/pro/sync/history` → ProSyncLicenseHistoryPage
- `/pro/rights` → ProRightsPage
- `/pro/royalties` → ProRoyaltiesPage
- `/pro/analytics` → ProAnalyticsPage
- `/pro/settings` → ProSettingsPage

## Writer Portal (/writer)
Layout: WriterPortalShell

- `/writer` → WriterHomePage
- `/writer/studio/projects` → WriterStudioProjectsPage
- `/writer/studio/collaborators` → WriterCollaboratorsPage
- `/writer/studio/beats` → WriterBeatMarketplacePage
- `/writer/studio/songwriting` → WriterSongwritingWorkspacePage
- `/writer/studio/samples` → WriterSampleLibraryPage
- `/writer/releases/drafts` → WriterReleasesDraftsPage
- `/writer/releases/live` → WriterReleasesLivePage
- `/writer/rights/my-splits` → WriterRightsMySplitsPage
- `/writer/rights/documents` → WriterRightsDocumentsPage
- `/writer/royalties/earnings` → WriterRoyaltiesEarningsPage
- `/writer/royalties/statements` → WriterRoyaltiesStatementsPage
- `/writer/marketplace/buy` → WriterBuyPage
- `/writer/marketplace/collab-calls` → WriterCollabCallsPage
- `/writer/marketplace/submissions` → WriterSubmissionsPage
- `/writer/marketplace/submit` → WriterSubmitPage
- `/writer/messages` → WriterMessagesPage
- `/writer/profile` → WriterProfilePage
- `/writer/settings` → WriterSettingsPage

## Sync Portal (/sync)
Layout: SyncPortalShell

- `/sync` → SyncOverviewPage
- `/sync/search` → SyncSearchPage
- `/sync/track/:id` → SyncTrackDetailPage
- `/sync/license-requests` → SyncLicenseRequestsPage
- `/sync/my-licenses` → SyncMyLicensesPage
- `/sync/deals` → SyncDealsPage
- `/sync/distribution` → SyncDistributionPage
- `/sync/revenue` → SyncRevenuePage
- `/sync/messages` → SyncMessagesPage

## Admin Portal (/admin)
Layout: AdminLayout

### Overview
- `/admin` → AdminDashboardPage

### Create
- `/admin/discography/new-release` → AdminNewReleaseWizard
- `/admin/shop/new-look` → AdminNewLookPage
- `/admin/tour/new-tour-date` → AdminNewTourDatePage
- `/admin/cms/new-banner` → AdminCmsNewBannerPage

### Website
- `/admin/website/homepage` → AdminWebsiteHomepagePage
- `/admin/website/pages` → AdminWebsitePagesPage
- `/admin/website/navigation` → AdminWebsiteNavigationPage
- `/admin/website/seo` → AdminWebsiteSeoPage
- `/admin/website/theme` → AdminWebsiteThemePage

### CMS
- `/admin/cms/blog` → AdminCmsBlogPage
- `/admin/cms/press` → AdminCmsPressPage
- `/admin/cms/gallery` → AdminCmsGalleryPage
- `/admin/cms/banners` → AdminCmsBannersPageNew

### Shop
- `/admin/shop/albums` → AdminShopAlbumsPage
- `/admin/shop/collections` → AdminShopCollectionsPage
- `/admin/shop/catalog` → AdminShopAllPage
- `/admin/shop/catalog/new` → AdminAddProductPage
- `/admin/shop/catalog/:id` → AdminProductEditPage
- `/admin/shop/get-the-look` → AdminShopGetTheLookPage
- `/admin/shop/carts` → AdminShopCartsPage
- `/admin/shop/orders` → OrdersPage
- `/admin/shop/inventory` → AdminShopInventoryPage
- `/admin/shop/bundles` → AdminShopBundlesPage

### Discography
- `/admin/discography` → ReleasesPage
- `/admin/music/albums` → ReleasesPage (legacy)
- `/admin/music/albums/:id` → ReleaseDetailAdminPage
- `/admin/music/tracks` → TracksPage

### Tour
- `/admin/tour/calendar` → AdminTourCalendarPageExternal
- `/admin/tour/bookings` → AdminTourBookingsPageExternal
- `/admin/tour/venues` → AdminTourVenuesPageExternal
- `/admin/tour/recently-played` → AdminTourRecentlyPlayedPageExternal

### Business - Artists
- `/admin/artists/roster` → AdminArtistsRosterPage
- `/admin/artists/onboarding` → AdminArtistsOnboardingPage

### Business - CRM
- `/admin/audience/contacts` → ContactsPage
- `/admin/audience/contacts/:id` → ContactDetailPage
- `/admin/audience/import` → CsvImportPage
- `/admin/audience/fans` → FansPage
- `/admin/audience/campaigns` → CampaignsPage

### Business - Bookings
- `/admin/bookings/pipeline` → BookingsPipelinePage
- `/admin/bookings/calendar` → BookingsCalendarPage
- `/admin/bookings/inquiries` → InquiriesPage
- `/admin/bookings/:id` → BookingDetailAdminPage

### Music Business
- `/admin/music/distribution` → AdminDistributionPage
- `/admin/music/rights` → AdminRightsPage
- `/admin/music/royalty` → AdminRoyaltyPage
- `/admin/music/sync` → AdminSyncPage

### Oversight
- `/admin/oversight/validation` → AdminValidationPage
- `/admin/oversight/analytics` → AdminAnalyticsPage

### AI & API
- `/admin/ai` → AdminAIPage
- `/admin/api` → AdminAPIPage

### System
- `/admin/settings` → SettingsPage

### Legacy Routes
- `/admin/studio` → AdminStudioPage
- `/admin/catalog` → AdminCatalogPage
