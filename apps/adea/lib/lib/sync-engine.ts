/**
 * Sync Licensing Engine — Service layer for music synchronization licensing workflows.
 *
 * Sync licensing is the process of licensing a musical recording and/or composition
 * for use in visual media: films, TV shows, advertisements, video games, trailers,
 * corporate presentations, and social media content. This is one of the most lucrative
 * revenue streams in the music industry — sync fees can range from $500 to $500,000+
 * per placement.
 *
 * Key industry concepts:
 * - Clearance: The process of obtaining permission from ALL rightsholders (master + publishing)
 *   to license a song for sync use. Without full clearance, no sync deal can proceed.
 * - One-stop clearance: When a single entity controls both master AND publishing rights,
 *   enabling fast licensing decisions without chasing multiple owners.
 * - Sync fee: The one-time payment for the sync license, typically split per royalty splits.
 * - Exclusivity: A license can be exclusive (no other placements in same territory/usage)
 *   or non-exclusive (multiple simultaneous placements allowed).
 * - Watermarked preview: A low-quality or audio-tagged version of the track sent to music
 *   supervisors for evaluation, preventing unauthorized use of the full master.
 * - License request workflow: submitted → under_review → cleared → approved → completed
 */

import type { CatalogSong, RightsRecord, SyncLicenseRequest } from '@/types/database';
import { MetadataEngine } from '@/lib/metadata-engine';
import type { ClearanceStatus } from '@/lib/metadata-engine';

// ============ EXPORTED TYPES ============

/** Advanced search filters for catalog browsing */
export type SyncSearchFilters = {
  genre?: string[];
  moodTags?: string[];
  bpmRange?: { min: number; max: number };
  energyRange?: { min: number; max: number };
  valenceRange?: { min: number; max: number };
  durationRange?: { minSeconds: number; maxSeconds: number };
  key?: string[];
  explicit?: boolean;
  language?: string[];
  oneStopOnly?: boolean;
  stemsAvailable?: boolean;
  forSaleOnly?: boolean;
  searchTerm?: string;
  syncStatus?: string[];
  maxResults?: number;
};

/** Search result from catalog browsing */
export type SearchResult = {
  totalMatches: number;
  results: SyncSearchMatch[];
  facets: {
    genres: Record<string, number>;
    moods: Record<string, number>;
    keys: Record<string, number>;
  };
};

export type SyncSearchMatch = {
  song: CatalogSong;
  clearanceStatus: ClearanceStatus;
  relevanceScore: number;
  matchedFilters: string[];
};

/** Clearance check result for sync eligibility */
export type ClearanceResult = {
  songId: string;
  eligible: boolean;
  clearanceStatus: ClearanceStatus;
  syncAvailable: boolean;
  oneStop: boolean;
  requiredApprovals: string[];
  estimatedClearanceDays: number;
  feeGuidance: { min: number; max: number; currency: string };
  blockers: string[];
};

/** Person requesting a sync license */
export type SyncRequester = {
  name: string;
  org: string | null;
  email: string;
  phone: string | null;
  role: string;
};

/** Usage details for a sync license request */
export type SyncUsage = {
  type: 'film' | 'tv' | 'ad' | 'game' | 'trailer' | 'corporate' | 'social';
  territory: string;
  termMonths: number;
  media: string[];
  description: string;
  exclusivity: boolean;
};

/** Action to process in the clearance workflow */
export type ClearanceAction = 'advance_review' | 'grant_clearance' | 'approve' | 'decline' | 'counter' | 'request_info';

/** Result of a clearance workflow step */
export type ClearanceStepResult = {
  requestId: string;
  previousStatus: string;
  newStatus: string;
  action: ClearanceAction;
  timestamp: string;
  notes: string;
  nextSteps: string[];
};

/** License contract template */
export type LicenseTemplate = {
  id: string;
  name: string;
  type: 'sync' | 'master' | 'publishing' | 'combined';
  sections: string[];
  defaultTermMonths: number;
  defaultTerritory: string;
};

/** Generated license contract document */
export type LicenseContract = {
  id: string;
  requestId: string;
  songId: string;
  songTitle: string;
  licensee: { name: string; org: string };
  licenser: { name: string; org: string };
  usageType: string;
  territory: string;
  termMonths: number;
  media: string[];
  feeCents: number;
  exclusivity: boolean;
  effectiveDate: string;
  sections: string[];
  generatedAt: string;
};

/** Result of exclusivity conflict check */
export type ConflictCheckResult = {
  hasConflicts: boolean;
  conflictingLicenses: {
    requestId: string;
    usageType: string;
    territory: string;
    termEnd: string;
    exclusivity: boolean;
  }[];
  overlapMonths: number;
  recommendation: string;
};

/** Watermarked preview generation result */
export type WatermarkResult = {
  songId: string;
  previewId: string;
  watermarkedUrl: string;
  expiresAt: string;
  quality: 'preview';
  watermarkType: string;
};

// ============ INTERNAL STATE ============

/** In-memory store for license requests */
const requestStore: Record<string, SyncLicenseRequest> = {};
const metadataEngine = new MetadataEngine();

function uuid(): string {
  return `se-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

// ============ SYNC ENGINE CLASS ============

export class SyncEngine {
  /**
   * Search catalog with advanced metadata-driven filtering.
   * Music supervisors search for tracks by mood, energy, tempo, genre, and other
   * metadata attributes. One-stop clearance status is a key filter — supervisors
   * strongly prefer tracks that can be cleared quickly without chasing multiple owners.
   */
  searchCatalog(filters: SyncSearchFilters, songs?: CatalogSong[], rights?: RightsRecord[]): SearchResult {
    const catalog = songs ?? [];
    const allRights = rights ?? [];
    const maxResults = filters.maxResults ?? 50;

    const matches: SyncSearchMatch[] = [];
    const genreFacets: Record<string, number> = {};
    const moodFacets: Record<string, number> = {};
    const keyFacets: Record<string, number> = {};

    for (const song of catalog) {
      if (!song.is_active || song.deleted_at) continue;

      const matchedFilters: string[] = [];
      let relevanceScore = 0;

      // Text search
      if (filters.searchTerm) {
        const term = filters.searchTerm.toLowerCase();
        const searchable = `${song.title} ${song.description ?? ''} ${song.mood_tags.join(' ')} ${song.genre} ${song.composer.join(' ')}`.toLowerCase();
        if (searchable.includes(term)) {
          relevanceScore += 10;
          matchedFilters.push('searchTerm');
        } else {
          continue; // If searchTerm specified and doesn't match, skip entirely
        }
      }

      // Genre filter
      if (filters.genre && filters.genre.length > 0) {
        if (filters.genre.includes(song.genre)) {
          relevanceScore += 5;
          matchedFilters.push('genre');
        } else {
          continue;
        }
      }

      // Mood tags filter
      if (filters.moodTags && filters.moodTags.length > 0) {
        const matchedMoods = song.mood_tags.filter((m) => filters.moodTags!.includes(m));
        if (matchedMoods.length > 0) {
          relevanceScore += matchedMoods.length * 3;
          matchedFilters.push('moodTags');
        } else {
          continue;
        }
      }

      // BPM range
      if (filters.bpmRange && song.bpm !== null) {
        if (song.bpm >= filters.bpmRange.min && song.bpm <= filters.bpmRange.max) {
          relevanceScore += 2;
          matchedFilters.push('bpm');
        } else {
          continue;
        }
      }

      // Energy range
      if (filters.energyRange && song.energy !== null) {
        if (song.energy >= filters.energyRange.min && song.energy <= filters.energyRange.max) {
          relevanceScore += 2;
          matchedFilters.push('energy');
        } else {
          continue;
        }
      }

      // Valence range
      if (filters.valenceRange && song.valence !== null) {
        if (song.valence >= filters.valenceRange.min && song.valence <= filters.valenceRange.max) {
          relevanceScore += 2;
          matchedFilters.push('valence');
        } else {
          continue;
        }
      }

      // Duration range
      if (filters.durationRange) {
        if (song.duration_seconds >= filters.durationRange.minSeconds && song.duration_seconds <= filters.durationRange.maxSeconds) {
          relevanceScore += 1;
          matchedFilters.push('duration');
        } else {
          continue;
        }
      }

      // One-stop filter
      if (filters.oneStopOnly) {
        const songRights = allRights.filter((r) => r.catalog_song_id === song.id);
        const clearance = metadataEngine.calculateClearance(songRights);
        if (!clearance.oneStop) continue;
        matchedFilters.push('oneStop');
        relevanceScore += 8;
      }

      // Stems available
      if (filters.stemsAvailable && !song.stems_available) continue;

      // Sync status
      if (filters.syncStatus && filters.syncStatus.length > 0) {
        if (!filters.syncStatus.includes(song.sync_status)) continue;
      }

      // Calculate clearance status
      const songRights = allRights.filter((r) => r.catalog_song_id === song.id);
      const clearanceStatus = metadataEngine.calculateClearance(songRights);

      matches.push({
        song,
        clearanceStatus,
        relevanceScore,
        matchedFilters,
      });

      // Build facets
      genreFacets[song.genre] = (genreFacets[song.genre] ?? 0) + 1;
      song.mood_tags.forEach((m) => { moodFacets[m] = (moodFacets[m] ?? 0) + 1; });
      if (song.key) keyFacets[song.key] = (keyFacets[song.key] ?? 0) + 1;
    }

    // Sort by relevance score descending
    matches.sort((a, b) => b.relevanceScore - a.relevanceScore);
    const results = matches.slice(0, maxResults);

    return {
      totalMatches: matches.length,
      results,
      facets: { genres: genreFacets, moods: moodFacets, keys: keyFacets },
    };
  }

  /**
   * Calculate clearance status for sync eligibility.
   * Determines whether a song can be quickly licensed for sync use based on
   * its rights structure. One-stop clearance (single entity controls both
   * master and publishing) is ideal — clearance can be granted in days.
   * Split ownership requires separate approvals and can take weeks or months.
   */
  checkSyncClearance(songId: string, rights: RightsRecord[]): ClearanceResult {
    const clearance = metadataEngine.calculateClearance(rights);

    const requiredApprovals: string[] = [];
    if (!clearance.oneStop) {
      const masterOwners = rights.filter((r) => r.rights_type === 'master').map((r) => r.owner);
      const pubOwners = rights.filter((r) => r.rights_type === 'publishing').map((r) => r.owner);
      requiredApprovals.push(...Array.from(new Set([...masterOwners, ...pubOwners])));
    }

    // Estimate clearance timeline based on complexity
    const estimatedDays = clearance.oneStop ? 3 :
      requiredApprovals.length <= 2 ? 14 :
      requiredApprovals.length <= 4 ? 30 : 60;

    // Fee guidance based on usage type averages (sync fees vary wildly)
    const feeGuidance = clearance.oneStop
      ? { min: 2000, max: 50000, currency: 'USD' }
      : { min: 1000, max: 25000, currency: 'USD' };

    return {
      songId,
      eligible: clearance.masterClear && clearance.publishingClear,
      clearanceStatus: clearance,
      syncAvailable: clearance.syncClear || (clearance.masterClear && clearance.publishingClear),
      oneStop: clearance.oneStop,
      requiredApprovals,
      estimatedClearanceDays: estimatedDays,
      feeGuidance,
      blockers: clearance.blockers,
    };
  }

  /**
   * Create a sync license request.
   * Initiates the licensing workflow when a music supervisor or creative agency
   * identifies a track they want to use in their production.
   */
  createLicenseRequest(songId: string, requester: SyncRequester, usage: SyncUsage): SyncLicenseRequest {
    const now = new Date().toISOString();
    const id = uuid();

    const request: SyncLicenseRequest = {
      id,
      catalog_song_id: songId,
      requester_name: requester.name,
      requester_org: requester.org,
      requester_email: requester.email,
      usage_type: usage.type,
      territory: usage.territory,
      term_months: usage.termMonths,
      media: usage.media,
      budget_range: null,
      notes: usage.description,
      status: 'submitted',
      cleared_at: null,
      approved_at: null,
      fee_cents: null,
      created_at: now,
      updated_at: now,
    };

    requestStore[id] = request;
    return request;
  }

  /**
   * Process a clearance workflow step.
   * The sync licensing workflow follows a defined progression:
   * submitted → under_review → cleared → approved (or countered/declined at any stage)
   * Each step requires authorization from the appropriate rightsholder.
   */
  processClearanceStep(requestId: string, action: ClearanceAction): ClearanceStepResult {
    const request = requestStore[requestId];
    if (!request) {
      return {
        requestId,
        previousStatus: 'unknown',
        newStatus: 'unknown',
        action,
        timestamp: new Date().toISOString(),
        notes: `Request ${requestId} not found`,
        nextSteps: ['Create a new license request first'],
      };
    }

    const previousStatus = request.status;
    const now = new Date().toISOString();
    let newStatus: SyncLicenseRequest['status'];
    let notes: string;
    let nextSteps: string[];

    switch (action) {
      case 'advance_review':
        newStatus = 'under_review';
        notes = 'Request moved to under review — rights team evaluating clearance';
        nextSteps = ['Check sync clearance status', 'Identify required approvals'];
        break;
      case 'grant_clearance':
        newStatus = 'cleared';
        notes = 'All rights cleared for sync licensing';
        request.cleared_at = now;
        nextSteps = ['Negotiate fee terms', 'Approve or counter the license'];
        break;
      case 'approve':
        newStatus = 'approved';
        notes = 'Sync license approved — contract can be generated';
        request.approved_at = now;
        nextSteps = ['Generate license contract', 'Process payment'];
        break;
      case 'decline':
        newStatus = 'declined';
        notes = 'Sync license request declined';
        nextSteps = ['Notify requester', 'Record decline reason'];
        break;
      case 'counter':
        newStatus = 'countered';
        notes = 'Counter offer proposed — different terms suggested';
        nextSteps = ['Await requester response to counter offer'];
        break;
      case 'request_info':
        newStatus = previousStatus; // Stay in current status
        notes = 'Additional information requested from licensee';
        nextSteps = ['Await additional info from requester'];
        break;
      default:
        newStatus = previousStatus;
        notes = 'Unknown action';
        nextSteps = [];
    }

    request.status = newStatus;
    request.updated_at = now;
    requestStore[requestId] = request;

    return {
      requestId,
      previousStatus,
      newStatus,
      action,
      timestamp: now,
      notes,
      nextSteps,
    };
  }

  /**
   * Generate a sync license contract from request data and template.
   * The contract formalizes the licensing agreement between the rights holder(s)
   * and the licensee, specifying usage type, territory, term, fee, exclusivity,
   * and other legal terms.
   */
  generateLicenseContract(request: SyncLicenseRequest, template: LicenseTemplate): LicenseContract {
    return {
      id: uuid(),
      requestId: request.id,
      songId: request.catalog_song_id,
      songTitle: '', // Would be populated from song lookup
      licensee: {
        name: request.requester_name,
        org: request.requester_org ?? '',
      },
      licenser: { name: '', org: '' }, // Would be populated from rights lookup
      usageType: request.usage_type,
      territory: request.territory,
      termMonths: request.term_months,
      media: request.media,
      feeCents: request.fee_cents ?? 0,
      exclusivity: false, // Default to non-exclusive unless specified
      effectiveDate: new Date().toISOString(),
      sections: template.sections,
      generatedAt: new Date().toISOString(),
    };
  }

  /**
   * Check exclusivity conflicts — whether the same song has an exclusive sync license
   * overlapping in territory and usage type with a new request.
   * Exclusive licenses prevent any other sync placements in the specified territory
   * and usage type for the license term. This check prevents double-booking.
   */
  checkExclusivityConflicts(
    songId: string,
    usageType: string,
    territory: string,
    termMonths: number,
    existingRequests?: SyncLicenseRequest[]
  ): ConflictCheckResult {
    const existing = existingRequests ?? Object.values(requestStore);
    const conflictingLicenses: ConflictCheckResult['conflictingLicenses'] = [];

    const now = new Date();

    for (const req of existing) {
      if (req.catalog_song_id !== songId) continue;
      if (req.status !== 'approved' && req.status !== 'cleared') continue;

      // Check territory overlap
      const territoriesOverlap = req.territory === 'Worldwide' ||
        req.territory === 'WW' || territory === 'Worldwide' ||
        territory === 'WW' || req.territory === territory;

      // Check usage type overlap
      const usageOverlap = req.usage_type === usageType;

      if (territoriesOverlap && usageOverlap) {
        const termEnd = new Date(req.approved_at ?? req.created_at);
        termEnd.setMonth(termEnd.getMonth() + req.term_months);

        conflictingLicenses.push({
          requestId: req.id,
          usageType: req.usage_type,
          territory: req.territory,
          termEnd: termEnd.toISOString(),
          exclusivity: false, // Would need exclusivity flag on request
        });
      }
    }

    // Calculate overlap months
    let overlapMonths = 0;
    if (conflictingLicenses.length > 0) {
      overlapMonths = termMonths; // Simplified — full overlap if any conflict
    }

    const recommendation = conflictingLicenses.length > 0
      ? 'Conflicts detected — consider non-exclusive license or negotiate with existing licensee'
      : 'No conflicts — exclusive license can be granted safely';

    return {
      hasConflicts: conflictingLicenses.length > 0,
      conflictingLicenses,
      overlapMonths,
      recommendation,
    };
  }

  /**
   * Generate a watermarked preview identifier for secure evaluation.
   * Music supervisors receive watermarked previews to evaluate tracks before
   * committing to a license. The watermark prevents unauthorized use while
   * allowing assessment of the track's suitability for the production.
   * Previews typically expire after 30 days and use reduced audio quality.
   */
  generateWatermarkedPreview(songId: string): WatermarkResult {
    const previewId = `wm-${uuid()}`;
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    return {
      songId,
      previewId,
      watermarkedUrl: `/previews/${previewId}`, // Would resolve to actual URL in production
      expiresAt: expiresAt.toISOString(),
      quality: 'preview',
      watermarkType: 'audio_tag_midroll',
    };
  }
}

/** Export singleton instance */
export const syncEngine = new SyncEngine();
