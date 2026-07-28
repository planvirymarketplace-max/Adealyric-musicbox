'use client';

import { useEffect } from 'react';
import { useRouter } from '@/lib/router';

/**
 * Title map: route pattern → [portal label, page label]
 * The resulting document.title = "Page Label · Portal Label — Adea Lyric"
 */
const TITLE_MAP: Record<string, [string, string]> = {
  // ─── Gate ───
  '/':                              ['Adea Lyric', 'Gate'],
  // ─── Fan Portal ───
  '/portal':                        ['Fan Portal', 'Home'],
  '/portal/login':                  ['Fan Portal', 'Log In'],
  '/portal/signup':                 ['Fan Portal', 'Sign Up'],
  '/portal/dashboard':              ['Fan Portal', 'My Dashboard'],
  '/portal/music':                  ['Fan Portal', 'Music'],
  '/portal/events':                 ['Fan Portal', 'Events'],
  '/portal/gallery':                ['Fan Portal', 'Gallery'],
  '/portal/videos':                 ['Fan Portal', 'Videos'],
  '/portal/shop':                   ['Fan Portal', 'Shop'],
  '/portal/wallet':                 ['Fan Portal', 'Wallet'],
  '/portal/cart':                   ['Fan Portal', 'Cart'],
  '/portal/orders':                 ['Fan Portal', 'Orders'],
  '/portal/tours':                  ['Fan Portal', 'Tours'],
  '/portal/account':                ['Fan Portal', 'Loyalty & Account'],
  '/portal/membership':             ['Fan Portal', 'Bundles & Tiers'],
  '/portal/exclusive':              ['Fan Portal', 'Exclusive Access'],
  '/portal/community':              ['Fan Portal', 'Community'],
  '/portal/premium':                ['Fan Portal', 'Premium Content'],
  // ─── Industry / Pro Portal ───
  '/pro/login':                     ['Industry Portal', 'Log In'],
  '/pro/signup':                    ['Industry Portal', 'Sign Up'],
  '/pro/dashboard/label':           ['Industry Portal', 'Label Dashboard'],
  '/pro/dashboard/booking':         ['Industry Portal', 'Booking Dashboard'],
  '/pro/dashboard/writer':          ['Industry Portal', 'Writer Dashboard'],
  '/pro/dashboard/admin':           ['Industry Portal', 'Admin Dashboard'],
  '/pro/catalog/releases':          ['Industry Portal', 'Catalog Releases'],
  '/pro/catalog/tracks':            ['Industry Portal', 'Catalog Tracks'],
  '/pro/catalog/assets':            ['Industry Portal', 'Catalog Assets'],
  '/pro/distribution/status':       ['Industry Portal', 'Delivery Status'],
  '/pro/distribution/submit':       ['Industry Portal', 'New Release Submission'],
  '/pro/distribution/corrections':  ['Industry Portal', 'Store Corrections'],
  '/pro/sync/search':               ['Industry Portal', 'Sync Browse & Search'],
  '/pro/sync/deals':                ['Industry Portal', 'Deal Rooms'],
  '/pro/sync/workspace':            ['Industry Portal', 'A&R Workspace'],
  '/pro/sync/history':              ['Industry Portal', 'License History'],
  '/pro/rights':                    ['Industry Portal', 'Rights & Splits'],
  '/pro/royalties':                 ['Industry Portal', 'Royalties & Statements'],
  '/pro/analytics':                 ['Industry Portal', 'Analytics'],
  '/pro/settings':                  ['Industry Portal', 'Settings'],
  // ─── Sync Portal ───
  '/sync':                          ['Sync Portal', 'Overview'],
  '/sync/search':                   ['Sync Portal', 'Advanced Search'],
  '/sync/license-requests':         ['Sync Portal', 'License Requests'],
  '/sync/my-licenses':              ['Sync Portal', 'My Licenses'],
  '/sync/deals':                    ['Sync Portal', 'Deals & Negotiations'],
  '/sync/clearance':                ['Sync Portal', 'Clearance Tracker'],
  '/sync/distribution':             ['Sync Portal', 'Distribution Pipeline'],
  '/sync/revenue':                  ['Sync Portal', 'Revenue & Royalty'],
  '/sync/messages':                 ['Sync Portal', 'Messages'],
  // ─── Writer Portal ───
  '/writer':                        ['Writer Portal', 'Home'],
  '/writer/studio/projects':        ['Writer Portal', 'Projects'],
  '/writer/studio/collaborators':   ['Writer Portal', 'Collaborators'],
  '/writer/studio/beats':           ['Writer Portal', 'Beat Marketplace'],
  '/writer/studio/songwriting':     ['Writer Portal', 'Songwriting'],
  '/writer/studio/samples':         ['Writer Portal', 'Sample Library'],
  '/writer/releases/drafts':        ['Writer Portal', 'Draft Releases'],
  '/writer/releases/live':          ['Writer Portal', 'Live Releases'],
  '/writer/rights/my-splits':       ['Writer Portal', 'My Splits'],
  // ─── Admin Portal ───
  '/admin':                         ['Admin Portal', 'Dashboard'],
  '/admin/discography/new-release': ['Admin Portal', 'New Release'],
  '/admin/shop/new-look':           ['Admin Portal', 'New Look'],
  '/admin/tour/new-tour-date':      ['Admin Portal', 'New Tour Date'],
  '/admin/cms/new-banner':          ['Admin Portal', 'New Banner'],
  '/admin/website/homepage':        ['Admin Portal', 'Website Homepage'],
  '/admin/website/pages':           ['Admin Portal', 'Website Pages'],
  '/admin/website/navigation':      ['Admin Portal', 'Website Navigation'],
  '/admin/website/seo':             ['Admin Portal', 'Website SEO'],
  '/admin/website/theme':           ['Admin Portal', 'Website Theme'],
  '/admin/cms/blog':                ['Admin Portal', 'Blog / News'],
  '/admin/cms/press':               ['Admin Portal', 'Press Releases'],
  '/admin/cms/gallery':             ['Admin Portal', 'Media Gallery'],
  '/admin/cms/banners':             ['Admin Portal', 'Announcements & Banners'],
  '/admin/shop/albums':             ['Admin Portal', 'Shop Albums'],
  '/admin/shop/collections':        ['Admin Portal', 'Shop Collections'],
  '/admin/shop/catalog':            ['Admin Portal', 'Shop All'],
  '/admin/shop/get-the-look':       ['Admin Portal', 'Get the Look'],
  '/admin/shop/carts':              ['Admin Portal', 'Carts'],
  '/admin/shop/orders':             ['Admin Portal', 'Orders'],
  '/admin/shop/inventory':          ['Admin Portal', 'Inventory'],
  '/admin/shop/settings':           ['Admin Portal', 'Storefront Settings'],
  '/admin/discography/releases':    ['Admin Portal', 'Discography Releases'],
  '/admin/discography/tracks':      ['Admin Portal', 'Discography Tracks'],
  '/admin/discography/credits':     ['Admin Portal', 'Credits & Splits'],
  '/admin/discography/metadata':    ['Admin Portal', 'Metadata Engine'],
  '/admin/tour/calendar':           ['Admin Portal', 'Tour Calendar'],
  '/admin/tour/recently-played':    ['Admin Portal', 'Recently Played'],
  '/admin/tour/venues':             ['Admin Portal', 'Venues'],
  '/admin/tour/bookings':           ['Admin Portal', 'Booking Requests'],
  '/admin/artists/roster':          ['Admin Portal', 'Artist Roster'],
  '/admin/artists/contracts':       ['Admin Portal', 'Artist Contracts'],
  '/admin/artists/onboarding':      ['Admin Portal', 'Artist Onboarding'],
  '/admin/audience/contacts':       ['Admin Portal', 'CRM Contacts'],
  '/admin/audience/import':         ['Admin Portal', 'CSV Import'],
  '/admin/audience/fans':           ['Admin Portal', 'Fans'],
  '/admin/audience/campaigns':      ['Admin Portal', 'Email Campaigns'],
  '/admin/oversight':               ['Admin Portal', 'Oversight Dashboard'],
  '/admin/rights':                  ['Admin Portal', 'Rights'],
  '/admin/rights/splits':           ['Admin Portal', 'Rights Splits'],
  '/admin/distribution':            ['Admin Portal', 'Distribution'],
  '/admin/distribution/queue':      ['Admin Portal', 'Distribution Queue'],
  '/admin/sync':                    ['Admin Portal', 'Sync Licensing'],
  '/admin/validation':              ['Admin Portal', 'Validation Engine'],
  '/admin/licensing':               ['Admin Portal', 'Licensing'],
  '/admin/royalty':                 ['Admin Portal', 'Royalty Oversight'],
  '/admin/royalty/revenue':         ['Admin Portal', 'Royalty Revenue'],
  '/admin/analytics':               ['Admin Portal', 'Analytics'],
  '/admin/events/tickets':          ['Admin Portal', 'Ticket Events'],
  '/admin/social/metricool':        ['Admin Portal', 'Social — Metricool'],
  '/admin/social/scheduler':        ['Admin Portal', 'Social — Scheduler'],
  '/admin/social/analytics':        ['Admin Portal', 'Social — Analytics'],
  '/admin/ai':                      ['Admin Portal', 'AI Assistant'],
  '/admin/api':                     ['Admin Portal', 'API Settings'],
  '/admin/settings':                ['Admin Portal', 'Settings'],
  '/admin/exports':                 ['Admin Portal', 'Exports'],
};

/**
 * Infer portal from path prefix
 */
function inferPortal(path: string): string {
  if (path.startsWith('/portal')) return 'Fan Portal';
  if (path.startsWith('/pro'))     return 'Industry Portal';
  if (path.startsWith('/sync'))    return 'Sync Portal';
  if (path.startsWith('/writer'))  return 'Writer Portal';
  if (path.startsWith('/admin'))   return 'Admin Portal';
  if (path === '/' || path === '') return 'Adea Lyric';
  return 'Adea Lyric';
}

/**
 * Hook that sets document.title based on the current route.
 * Title format: "Page Label · Portal Label — Adea Lyric"
 * For the gate: "Adea Lyric — One Platform, Every Connection"
 */
export function usePageTitle(customTitle?: string) {
  const { path } = useRouter();

  useEffect(() => {
    let title: string;

    if (customTitle) {
      title = `${customTitle} · ${inferPortal(path)} — Adea Lyric`;
    } else {
      // Look up exact path match first
      const entry = TITLE_MAP[path];
      if (entry) {
        const [portal, page] = entry;
        title = path === '/' || path === ''
          ? 'Adea Lyric — One Platform, Every Connection'
          : `${page} · ${portal} — Adea Lyric`;
      } else {
        // Try prefix matching for dynamic routes (e.g., /portal/music/song-id)
        const prefix = Object.keys(TITLE_MAP)
          .filter(k => k !== '/' && path.startsWith(k))
          .sort((a, b) => b.length - a.length)[0];
        if (prefix) {
          const [portal, page] = TITLE_MAP[prefix];
          title = `${page} · ${portal} — Adea Lyric`;
        } else {
          title = `${inferPortal(path)} — Adea Lyric`;
        }
      }
    }

    document.title = title;
  }, [path, customTitle]);
}
