/**
 * Mock data fallback registry — maps API endpoint URL patterns to their
 * corresponding mock data arrays/objects. Used by apiClient when the
 * backend is unavailable (no database running) so that all pages render
 * with realistic UI structure and mock content instead of "Failed to load".
 */

import * as mockData from '@/lib/mock-data';
import type { PaginatedResponse } from '@/lib/api-client';

// ── Helper: wrap an array as a paginated response ──
function paginated<T>(data: T[], page = 1, limit = 50): PaginatedResponse<T> {
  return {
    data,
    pagination: { total: data.length, page, limit, totalPages: Math.ceil(data.length / limit) },
  };
}

// ── Helper: find item by ID in array ──
function findById<T extends { id: string }>(arr: T[], id: string): T | undefined {
  return arr.find(item => item.id === id);
}

/**
 * Registry of API URL patterns → mock data responses.
 * Keys are regex patterns that match API paths.
 * Values are functions that return the mock data for that path,
 * optionally extracting IDs from the URL.
 */
const registry: Array<{ pattern: RegExp; handler: (url: string) => unknown }> = [
  // ─── SHOP ───
  { pattern: /^\/api\/shop\/products$/, handler: () => paginated(mockData.mockShopProducts) },
  { pattern: /^\/api\/shop\/products\/([^\/]+)$/, handler: (url) => {
    const id = url.match(/^\/api\/shop\/products\/([^\/]+)$/)?.[1];
    return findById(mockData.mockShopProducts, id ?? '') ?? null;
  }},
  { pattern: /^\/api\/shop\/orders$/, handler: () => paginated(mockData.mockOrders) },
  { pattern: /^\/api\/shop\/orders\/([^\/]+)$/, handler: (url) => {
    const id = url.match(/^\/api\/shop\/orders\/([^\/]+)$/)?.[1];
    return findById(mockData.mockOrders, id ?? '') ?? null;
  }},

  // ─── BOOKINGS ───
  { pattern: /^\/api\/bookings$/, handler: () => paginated(mockData.mockBookings) },
  { pattern: /^\/api\/bookings\/([^\/]+)$/, handler: (url) => {
    const id = url.match(/^\/api\/bookings\/([^\/]+)$/)?.[1];
    return findById(mockData.mockBookings, id ?? '') ?? null;
  }},
  { pattern: /^\/api\/bookings\/inquiries$/, handler: () => paginated(mockData.mockBookingInquiries) },
  { pattern: /^\/api\/bookings\/inquiries\/([^\/]+)$/, handler: (url) => {
    const id = url.match(/^\/api\/bookings\/inquiries\/([^\/]+)$/)?.[1];
    return findById(mockData.mockBookingInquiries, id ?? '') ?? null;
  }},

  // ─── CATALOG ───
  { pattern: /^\/api\/catalog\/songs$/, handler: () => paginated(mockData.mockCatalogSongs) },
  { pattern: /^\/api\/catalog\/songs\/([^\/]+)$/, handler: (url) => {
    const id = url.match(/^\/api\/catalog\/songs\/([^\/]+)$/)?.[1];
    return findById(mockData.mockCatalogSongs, id ?? '') ?? null;
  }},
  { pattern: /^\/api\/catalog\/releases$/, handler: () => paginated(mockData.mockReleases) },
  { pattern: /^\/api\/catalog\/releases\/([^\/]+)$/, handler: (url) => {
    const id = url.match(/^\/api\/catalog\/releases\/([^\/]+)$/)?.[1];
    return findById(mockData.mockReleases, id ?? '') ?? null;
  }},
  { pattern: /^\/api\/catalog\/releases\/([^\/]+)\/validate$/, handler: () => ({ success: true }) },

  // ─── FANS ───
  { pattern: /^\/api\/fans$/, handler: () => paginated(mockData.mockFans) },
  { pattern: /^\/api\/fans\/([^\/]+)$/, handler: (url) => {
    const id = url.match(/^\/api\/fans\/([^\/]+)$/)?.[1];
    return findById(mockData.mockFans, id ?? '') ?? null;
  }},
  { pattern: /^\/api\/fans\/([^\/]+)\/loyalty$/, handler: () => mockData.mockUserLoyalty },

  // ─── EVENTS ───
  { pattern: /^\/api\/events$/, handler: () => paginated(mockData.mockTicketEvents) },
  { pattern: /^\/api\/events\/([^\/]+)$/, handler: (url) => {
    const id = url.match(/^\/api\/events\/([^\/]+)$/)?.[1];
    return findById(mockData.mockTicketEvents, id ?? '') ?? null;
  }},
  { pattern: /^\/api\/events\/([^\/]+)\/ticket-tiers$/, handler: () => paginated(mockData.mockTicketTiers) },
  { pattern: /^\/api\/events\/([^\/]+)\/purchase$/, handler: () => ({ success: true, order: mockData.mockTicketOrders[0] }) },

  // ─── CMS ───
  { pattern: /^\/api\/cms\/pages$/, handler: () => paginated(mockData.mockBanners) },
  { pattern: /^\/api\/cms\/pages\/([^\/]+)$/, handler: (url) => {
    const id = url.match(/^\/api\/cms\/pages\/([^\/]+)$/)?.[1];
    return findById(mockData.mockBanners, id ?? '') ?? null;
  }},

  // ─── RIGHTS ───
  { pattern: /^\/api\/rights\/records$/, handler: () => paginated(mockData.mockRightsRecords) },
  { pattern: /^\/api\/rights\/records\/([^\/]+)$/, handler: (url) => {
    const id = url.match(/^\/api\/rights\/records\/([^\/]+)$/)?.[1];
    return findById(mockData.mockRightsRecords, id ?? '') ?? null;
  }},
  { pattern: /^\/api\/rights\/splits$/, handler: () => paginated(mockData.mockRoyaltySplits) },
  { pattern: /^\/api\/rights\/splits\/([^\/]+)$/, handler: (url) => {
    const id = url.match(/^\/api\/rights\/splits\/([^\/]+)$/)?.[1];
    return findById(mockData.mockRoyaltySplits, id ?? '') ?? null;
  }},
  { pattern: /^\/api\/rights\/clearance\/([^\/]+)$/, handler: () => ({ status: 'cleared', territories: ['US', 'CA', 'GB'] }) },
  { pattern: /^\/api\/rights\/territory-matrix\/([^\/]+)$/, handler: () => ({ territories: { US: 'cleared', CA: 'cleared', GB: 'pending', DE: 'blocked' } }) },

  // ─── DISTRIBUTION ───
  { pattern: /^\/api\/distribution\/dsp-adapters$/, handler: () => paginated(mockData.mockDspAdapters) },
  { pattern: /^\/api\/distribution\/dsp-adapters\/([^\/]+)$/, handler: (url) => {
    const id = url.match(/^\/api\/distribution\/dsp-adapters\/([^\/]+)$/)?.[1];
    return findById(mockData.mockDspAdapters, id ?? '') ?? null;
  }},
  { pattern: /^\/api\/distribution\/deliveries$/, handler: () => paginated(mockData.mockDeliveryRecords) },
  { pattern: /^\/api\/distribution\/deliveries\/([^\/]+)$/, handler: (url) => {
    const id = url.match(/^\/api\/distribution\/deliveries\/([^\/]+)$/)?.[1];
    return findById(mockData.mockDeliveryRecords, id ?? '') ?? null;
  }},
  { pattern: /^\/api\/distribution\/deliveries\/([^\/]+)\/retry$/, handler: () => ({ success: true }) },
  { pattern: /^\/api\/distribution\/ddex\/([^\/]+)$/, handler: () => ({ xml: '<DDEX>mock</DDEX>' }) },

  // ─── SYNC ───
  { pattern: /^\/api\/sync\/search$/, handler: () => paginated(mockData.mockCatalogSongs) },
  { pattern: /^\/api\/sync\/requests$/, handler: () => paginated(mockData.mockSyncLicenseRequests) },
  { pattern: /^\/api\/sync\/requests\/([^\/]+)$/, handler: (url) => {
    const id = url.match(/^\/api\/sync\/requests\/([^\/]+)$/)?.[1];
    return findById(mockData.mockSyncLicenseRequests, id ?? '') ?? null;
  }},
  { pattern: /^\/api\/sync\/requests\/([^\/]+)\/clearance$/, handler: () => ({ status: 'processing' }) },
  { pattern: /^\/api\/sync\/requests\/([^\/]+)\/contract$/, handler: () => ({ contract_url: '/contracts/mock.pdf' }) },
  { pattern: /^\/api\/sync\/exclusivity-check$/, handler: () => ({ exclusive: false }) },

  // ─── MARKETPLACE ───
  { pattern: /^\/api\/marketplace\/listings$/, handler: () => paginated(mockData.mockCatalogSongs) },
  { pattern: /^\/api\/marketplace\/listings\/([^\/]+)$/, handler: (url) => {
    const id = url.match(/^\/api\/marketplace\/listings\/([^\/]+)$/)?.[1];
    return findById(mockData.mockCatalogSongs, id ?? '') ?? null;
  }},
  { pattern: /^\/api\/marketplace\/offers$/, handler: () => paginated(mockData.mockSyncLicenseRequests) },
  { pattern: /^\/api\/marketplace\/offers\/([^\/]+)$/, handler: (url) => {
    const id = url.match(/^\/api\/marketplace\/offers\/([^\/]+)$/)?.[1];
    return findById(mockData.mockSyncLicenseRequests, id ?? '') ?? null;
  }},
  { pattern: /^\/api\/marketplace\/offers\/([^\/]+)\/purchase$/, handler: () => ({ success: true }) },
  { pattern: /^\/api\/marketplace\/custom-writes$/, handler: () => paginated(mockData.mockCollabCalls) },
  { pattern: /^\/api\/marketplace\/collab-calls$/, handler: () => paginated(mockData.mockCollabCalls) },

  // ─── ROYALTIES ───
  { pattern: /^\/api\/royalties\/statements$/, handler: () => paginated(mockData.mockRoyaltyStatements) },
  { pattern: /^\/api\/royalties\/statements\/([^\/]+)$/, handler: (url) => {
    const id = url.match(/^\/api\/royalties\/statements\/([^\/]+)$/)?.[1];
    return findById(mockData.mockRoyaltyStatements, id ?? '') ?? null;
  }},
  { pattern: /^\/api\/royalties\/per-stream\/([^\/]+)$/, handler: () => ({ rate: 0.0035, dsp: 'spotify' }) },
  { pattern: /^\/api\/royalties\/mechanical$/, handler: () => ({ rate: 0.091, currency: 'USD' }) },
  { pattern: /^\/api\/royalties\/recoupment$/, handler: () => ({ recouped: false, balance: 50000 }) },
  { pattern: /^\/api\/royalties\/calculations\/([^\/]+)$/, handler: () => ({ total: 150000, splits: mockData.mockRoyaltySplits.slice(0, 3) }) },

  // ─── VALIDATION ───
  { pattern: /^\/api\/validation\/checks$/, handler: () => paginated(mockData.mockValidationChecks) },
  { pattern: /^\/api\/validation\/run\/([^\/]+)$/, handler: () => ({ success: true, errors: 0, warnings: 2 }) },

  // ─── MESSAGES ───
  { pattern: /^\/api\/messages\/threads$/, handler: () => paginated([]) },
  { pattern: /^\/api\/messages\/threads\/([^\/]+)\/messages$/, handler: () => paginated([]) },

  // ─── AUTH ───
  { pattern: /^\/api\/auth\/session$/, handler: () => ({ user: { id: 'art-1', name: 'Adea Lyric', role: 'admin' }, authenticated: true }) },
];

/**
 * Look up mock data for a given API URL path.
 * Returns undefined if no matching pattern is found.
 */
export function getMockFallback(path: string): unknown | undefined {
  for (const entry of registry) {
    if (entry.pattern.test(path)) {
      return entry.handler(path);
    }
  }
  return undefined;
}
