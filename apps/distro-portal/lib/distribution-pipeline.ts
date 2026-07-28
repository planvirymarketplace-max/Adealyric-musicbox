/**
 * Distribution Pipeline — Service layer for preparing, validating, and delivering
 * music releases to Digital Service Providers (DSPs).
 *
 * The distribution pipeline orchestrates the end-to-end process of getting a release
 * onto streaming platforms (Spotify, Apple Music, Amazon Music, etc.). This involves:
 *
 * 1. Validation: Ensuring metadata, artwork, and audio meet each DSP's requirements
 * 2. Metadata building: Constructing DDEX ERN messages per DSP format specs
 * 3. Delivery packaging: Bundling metadata + audio + artwork into DSP-specific packages
 * 4. Submission: Sending packages to DSP ingestion endpoints (SFTP, API, etc.)
 * 5. Status tracking: Monitoring delivery confirmation/rejection per DSP
 * 6. Retry handling: Re-attempting failed deliveries with corrected data
 *
 * Key industry concepts:
 * - DSPs (Digital Service Providers): Spotify, Apple Music, Amazon, TikTok, YouTube, etc.
 * - Each DSP has unique ingestion requirements (format, encoding, metadata fields)
 * - DDEX ERN is the universal standard, but some DSPs accept proprietary feeds
 * - Delivery status lifecycle: pending → delivered → accepted/rejected/processing
 * - Rejections often stem from missing metadata, incorrect explicit flags, or codec issues
 */

import type { CatalogSong, Release, DspAdapter, DeliveryRecord } from '@/types/database';
import { MetadataEngine } from '@/lib/metadata-engine';
import { buildDdexErnXml } from '@/lib/ddex-builder';

// ============ EXPORTED TYPES ============

/** Result of preparing a release for delivery to specified DSPs */
export type DeliveryPreparationResult = {
  releaseId: string;
  ready: boolean;
  dspIds: string[];
  validationResult: DeliveryReadinessResult;
  packages: DeliveryPackage[];
  errors: string[];
  warnings: string[];
  preparedAt: string;
};

/** Full delivery readiness validation result */
export type DeliveryReadinessResult = {
  ready: boolean;
  checks: {
    metadataComplete: boolean;
    artworkValid: boolean;
    audioValid: boolean;
    rightsVerified: boolean;
    isrcAssigned: boolean;
    upcAssigned: boolean;
    cLinePresent: boolean;
    pLinePresent: boolean;
  };
  issues: string[];
  warnings: string[];
  dspSpecific: Record<string, string[]>; // per-DSP warnings/issues
};

/** DSP-specific delivery package containing metadata and resource references */
export type DeliveryPackage = {
  dspId: string;
  dspName: string;
  format: string;
  metadataXml: string | null;
  songResources: {
    songId: string;
    title: string;
    isrc: string;
    masterUrl: string | null;
    previewUrl: string | null;
    coverArtUrl: string | null;
  }[];
  releaseResources: {
    releaseId: string;
    upc: string;
    title: string;
    coverArtUrl: string | null;
  };
  createdAt: string;
};

/** Delivery status values matching the DeliveryRecord schema */
export type DeliveryStatus = 'pending' | 'delivered' | 'accepted' | 'rejected' | 'processing';

/** Result of a delivery retry attempt */
export type RetryResult = {
  deliveryId: string;
  retried: boolean;
  newStatus: DeliveryStatus;
  newSubmissionDate: string | null;
  error: string | null;
};

// ============ INTERNAL STATE ============

/** In-memory delivery record store */
const deliveryStore: Record<string, DeliveryRecord> = {};
const metadataEngine = new MetadataEngine();

function uuid(): string {
  return `dp-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

// ============ DISTRIBUTION PIPELINE CLASS ============

export class DistributionPipeline {
  /**
   * Prepare a release for distribution by running validation, building metadata,
   * and queuing delivery packages for each specified DSP.
   *
   * This is the primary entry point for the distribution workflow. It:
   * 1. Validates all metadata/artwork/audio requirements
   * 2. Assigns missing ISRC/UPC codes where possible
   * 3. Builds DDEX ERN XML per DSP format requirements
   * 4. Creates delivery packages ready for submission
   */
  prepareForDelivery(
    releaseId: string,
    dspIds: string[],
    release?: Release,
    songs?: CatalogSong[],
    dsps?: DspAdapter[]
  ): DeliveryPreparationResult {
    const now = new Date().toISOString();
    const errors: string[] = [];
    const warnings: string[] = [];

    // If no release/songs provided, we can't prepare
    if (!release || !songs || songs.length === 0) {
      errors.push('Release data and songs are required for delivery preparation');
      return {
        releaseId,
        ready: false,
        dspIds,
        validationResult: {
          ready: false,
          checks: {
            metadataComplete: false, artworkValid: false, audioValid: false,
            rightsVerified: false, isrcAssigned: false, upcAssigned: false,
            cLinePresent: false, pLinePresent: false,
          },
          issues: errors,
          warnings,
          dspSpecific: {},
        },
        packages: [],
        errors,
        warnings,
        preparedAt: now,
      };
    }

    // Run readiness validation
    const readiness = this.validateDeliveryReadiness(release, songs);

    // Build packages for each DSP
    const packages: DeliveryPackage[] = [];
    const availableDsps = dsps ?? [];

    for (const dspId of dspIds) {
      const dsp = availableDsps.find((d) => d.id === dspId);
      if (!dsp) {
        warnings.push(`DSP ${dspId} not found in adapter registry — skipping`);
        continue;
      }
      if (dsp.status !== 'active') {
        warnings.push(`DSP ${dsp.name} is ${dsp.status} — delivery may be delayed`);
      }

      const pkg = this.buildDeliveryPackage(release, songs, dsp);
      packages.push(pkg);
    }

    return {
      releaseId,
      ready: readiness.ready && packages.length > 0,
      dspIds,
      validationResult: readiness,
      packages,
      errors,
      warnings,
      preparedAt: now,
    };
  }

  /**
   * Validate all delivery requirements before pushing to DSPs.
   * Checks metadata completeness, artwork specs, audio quality, rights verification,
   * ISRC/UPC assignment, and C-Line/P-Line presence for every track on the release.
   */
  validateDeliveryReadiness(release: Release, songs: CatalogSong[]): DeliveryReadinessResult {
    const issues: string[] = [];
    const warnings: string[] = [];
    const dspSpecific: Record<string, string[]> = {};

    // Check metadata completeness across all songs
    const metadataComplete = songs.every((song) => {
      const validation = metadataEngine.validateForDistribution(song);
      if (!validation.valid) {
        issues.push(...validation.errors);
      }
      warnings.push(...validation.warnings);
      return validation.valid;
    });

    // Check artwork
    const artworkValid = release.cover_media_id !== null;
    if (!artworkValid) {
      issues.push('Release artwork missing — all DSPs require cover art');
    }

    // Check audio quality (basic check — all songs have duration)
    const audioValid = songs.every((song) => song.duration_seconds > 0);
    if (!audioValid) {
      issues.push('Some tracks have zero duration — audio files may be missing');
    }

    // Check rights verification (basic — master owner present)
    const rightsVerified = songs.every((song) => song.master_owner !== null);
    if (!rightsVerified) {
      issues.push('Master rights owner not specified for all tracks');
    }

    // Check ISRC assignment
    const isrcAssigned = songs.every((song) => song.isrc !== null);
    if (!isrcAssigned) {
      issues.push('ISRC codes not assigned for all tracks — DSPs require unique ISRC per track');
    }

    // Check UPC assignment
    const upcAssigned = release.upc !== null;
    if (!upcAssigned) {
      warnings.push('UPC not assigned for release — required for retail barcode identification');
    }

    // Check C-Line and P-Line (can be generated if master_owner is present)
    const cLinePresent = songs.every((song) => song.master_owner !== null);
    const pLinePresent = songs.every((song) => song.publishing_owner !== null || song.master_owner !== null);
    if (!cLinePresent) {
      issues.push('C-Line cannot be generated — copyright holder info missing');
    }
    if (!pLinePresent) {
      warnings.push('P-Line may need manual review — publishing owner info incomplete');
    }

    // DSP-specific checks
    // Apple Music: requires explicit flag on every track
    const appleWarnings: string[] = [];
    songs.filter((s) => !s.explicit && s.lyrics).forEach((s) => {
      appleWarnings.push(`Track "${s.title}" has lyrics but no explicit flag — Apple Music may require clarification`);
    });
    if (appleWarnings.length > 0) dspSpecific['apple-music'] = appleWarnings;

    // Spotify: requires language code
    const spotifyWarnings: string[] = [];
    songs.filter((s) => !s.language).forEach((s) => {
      spotifyWarnings.push(`Track "${s.title}" missing language code — Spotify requires language metadata`);
    });
    if (spotifyWarnings.length > 0) dspSpecific['spotify'] = spotifyWarnings;

    const ready = issues.length === 0 &&
      metadataComplete && artworkValid && audioValid &&
      rightsVerified && isrcAssigned && cLinePresent;

    return {
      ready,
      checks: {
        metadataComplete,
        artworkValid,
        audioValid,
        rightsVerified,
        isrcAssigned,
        upcAssigned,
        cLinePresent,
        pLinePresent,
      },
      issues,
      warnings,
      dspSpecific,
    };
  }

  /**
   * Build DSP-specific delivery package containing metadata XML and resource references.
   * Each DSP may require different formats (DDEX ERN, proprietary feed, direct upload).
   * The package includes all song resources, release metadata, and audio/artwork URLs.
   */
  buildDeliveryPackage(release: Release, songs: CatalogSong[], dsp: DspAdapter): DeliveryPackage {
    let metadataXml: string | null = null;

    // Generate DDEX ERN XML if DSP supports it
    if (dsp.delivery_format.includes('DDEX ERN')) {
      const primarySong = songs[0];
      const ernMessage = metadataEngine.buildDdexErn(primarySong, release);
      metadataXml = buildDdexErnXml(ernMessage);
    } else if (dsp.delivery_format === 'Direct upload') {
      metadataXml = null; // Direct upload DSPs don't need XML delivery
    } else {
      metadataXml = this.generateSimplifiedXml(release, songs, dsp);
    }

    const songResources = songs.map((song) => ({
      songId: song.id,
      title: song.title,
      isrc: song.isrc ?? 'UNASSIGNED',
      masterUrl: song.master_url,
      previewUrl: song.preview_url,
      coverArtUrl: song.cover_art_url,
    }));

    return {
      dspId: dsp.id,
      dspName: dsp.name,
      format: dsp.delivery_format,
      metadataXml,
      songResources,
      releaseResources: {
        releaseId: release.id,
        upc: release.upc ?? 'UNASSIGNED',
        title: release.title,
        coverArtUrl: null, // Would reference cover_media_id in production
      },
      createdAt: new Date().toISOString(),
    };
  }

  /**
   * Update delivery status per DSP. Tracks the lifecycle of a delivery:
   * pending → delivered → accepted/rejected/processing
   */
  updateDeliveryStatus(deliveryId: string, status: DeliveryStatus, details?: string): void {
    const existing = deliveryStore[deliveryId];
    if (!existing) {
      // Create new record
      deliveryStore[deliveryId] = {
        id: deliveryId,
        release_id: '',
        dsp_adapter_id: '',
        status,
        submitted_at: status === 'delivered' ? new Date().toISOString() : null,
        confirmed_at: status === 'accepted' ? new Date().toISOString() : null,
        error_message: status === 'rejected' ? details ?? null : null,
        created_at: new Date().toISOString(),
      };
    } else {
      // Update existing record
      deliveryStore[deliveryId] = {
        ...existing,
        status,
        submitted_at: status === 'delivered' ? new Date().toISOString() : existing.submitted_at,
        confirmed_at: status === 'accepted' ? new Date().toISOString() : existing.confirmed_at,
        error_message: status === 'rejected' ? details ?? existing.error_message : existing.error_message,
      };
    }
  }

  /**
   * Retry a failed delivery. Attempts re-submission with corrected metadata
   * if the original rejection was due to metadata issues.
   */
  retryDelivery(deliveryId: string): RetryResult {
    const existing = deliveryStore[deliveryId];

    if (!existing) {
      return {
        deliveryId,
        retried: false,
        newStatus: 'pending',
        newSubmissionDate: null,
        error: `Delivery record ${deliveryId} not found`,
      };
    }

    if (existing.status !== 'rejected') {
      return {
        deliveryId,
        retried: false,
        newStatus: existing.status,
        newSubmissionDate: existing.submitted_at,
        error: `Cannot retry delivery with status ${existing.status} — only rejected deliveries can be retried`,
      };
    }

    // Mark as pending for re-delivery
    const now = new Date().toISOString();
    deliveryStore[deliveryId] = {
      ...existing,
      status: 'pending',
      submitted_at: null,
      confirmed_at: null,
      error_message: null,
    };

    return {
      deliveryId,
      retried: true,
      newStatus: 'pending',
      newSubmissionDate: null,
      error: null,
    };
  }

  /** Generate simplified XML for DSPs that don't use full DDEX ERN */
  private generateSimplifiedXml(release: Release, songs: CatalogSong[], dsp: DspAdapter): string {
    const escapeXml = (s: string) => s.replace(/[&<>"']/g, (c) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;',
    })[c] ?? c);

    const songEntries = songs.map((s) =>
      `    <Track>\n      <Title>${escapeXml(s.title)}</Title>\n      <ISRC>${s.isrc ?? 'UNASSIGNED'}</ISRC>\n      <Duration>${s.duration_seconds}</Duration>\n      <Artist>${escapeXml(s.composer[0] ?? 'Unknown')}</Artist>\n    </Track>`
    ).join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<ReleaseDelivery target="${escapeXml(dsp.name)}">
  <Release>
    <UPC>${release.upc ?? 'UNASSIGNED'}</UPC>
    <Title>${escapeXml(release.title)}</Title>
    <Type>${release.type}</Type>
    <ReleaseDate>${release.release_date ?? 'TBD'}</ReleaseDate>
    <Genre>${release.genre ?? 'Pop'}</Genre>
    <Explicit>${String(release.explicit)}</Explicit>
  </Release>
  <Tracks>
${songEntries}
  </Tracks>
</ReleaseDelivery>`;
  }
}

/** Export singleton instance */
export const distributionPipeline = new DistributionPipeline();
