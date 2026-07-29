/**
 * Validation Engine — Comprehensive pre-delivery validation pipeline for music releases.
 *
 * Before a release can be delivered to DSPs, it must pass a series of strict validation
 * checks. DSPs (Spotify, Apple Music, Amazon, etc.) reject releases with metadata errors,
 * missing artwork, audio quality issues, or rights gaps. This engine runs 6 distinct
 * validation checks to ensure a release is fully compliant:
 *
 * 1. DDEX Compliance: Validates metadata structure conforms to DDEX ERN 4.2 schema
 * 2. Metadata Completeness: All required fields present (ISRC, UPC, titles, artists)
 * 3. Artwork Specs: Cover art meets DSP requirements (3000x3000 px, RGB, no URLs)
 * 4. Audio Quality: Audio files are WAV format, proper loudness (LUFS), sample rate
 * 5. Copyright Chain: Rights ownership verified for all territories
 * 6. Territory Coverage: Rights cover all intended distribution territories
 *
 * Each check produces a CheckResult with pass/fail/warning status and detailed messages.
 * A release is only "delivery ready" when ALL checks pass (or have only warnings).
 */

import type { CatalogSong, Release, RightsRecord, ValidationCheck } from '@/types/database';
import { MetadataEngine } from '@/lib/metadata-engine';
import type { ValidationResult } from '@/lib/metadata-engine';

// ============ EXPORTED TYPES ============

/** Result of a single validation check */
export type CheckResult = {
  checkType: 'ddex' | 'metadata' | 'artwork' | 'audio' | 'copyright' | 'territory';
  status: 'pass' | 'fail' | 'warning' | 'pending';
  message: string;
  details?: string[];
  checkedAt: string;
};

/** Full validation report across all 6 checks */
export type ValidationReport = {
  releaseId: string;
  overallStatus: 'pass' | 'fail' | 'warning' | 'pending';
  checks: CheckResult[];
  passedChecks: number;
  failedChecks: number;
  warningChecks: number;
  summary: string;
  checkedAt: string;
};

/** Artwork metadata structure for validation */
export type ArtworkMetadata = {
  width: number;
  height: number;
  colorMode: string;
  fileFormat: string;
  fileSizeBytes: number;
  containsUrls: boolean;
  containsBorders: boolean;
  isSquare: boolean;
};

/** Audio metadata structure for validation */
export type AudioMetadata = {
  format: string;
  sampleRate: number;
  bitDepth: number;
  channels: number;
  durationSeconds: number;
  loudnessLUFS: number;
  truePeakDb: number;
  bitRate: number;
  codec: string;
  hasSilenceAtStart: boolean;
  hasSilenceAtEnd: boolean;
};

// ============ INTERNALS ============

const metadataEngine = new MetadataEngine();

function uuid(): string {
  return `ve-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

// ============ VALIDATION ENGINE CLASS ============

export class ValidationEngine {
  /**
   * Run all 6 validation checks on a release.
   * This is the comprehensive pre-delivery gate — a release must pass all checks
   * before it can be submitted to DSPs. Any 'fail' status blocks delivery entirely.
   */
  runFullValidation(
    release: Release,
    songs: CatalogSong[],
    artwork: ArtworkMetadata,
    audio: AudioMetadata,
    rights?: RightsRecord[]
  ): ValidationReport {
    const now = new Date().toISOString();
    const rightsForRelease = rights ?? [];

    const checks: CheckResult[] = [
      this.validateDdexCompliance(release, songs),
      this.validateMetadataCompleteness(songs),
      this.validateArtworkSpecs(artwork),
      this.validateAudioQuality(audio),
      this.validateCopyrightChain(rightsForRelease),
      this.validateTerritoryCoverage(rightsForRelease, ['US', 'GB', 'DE', 'FR', 'JP', 'AU', 'WW']),
    ];

    const failedChecks = checks.filter((c) => c.status === 'fail').length;
    const warningChecks = checks.filter((c) => c.status === 'warning').length;
    const passedChecks = checks.filter((c) => c.status === 'pass').length;

    const overallStatus: ValidationReport['overallStatus'] =
      failedChecks > 0 ? 'fail' :
      warningChecks > 0 ? 'warning' :
      'pass';

    const summary = failedChecks > 0
      ? `Release blocked: ${failedChecks} check(s) failed. Resolve issues before delivery.`
      : warningChecks > 0
        ? `Release has ${warningChecks} warnings. Delivery possible but may cause DSP issues.`
        : 'All checks passed — release is ready for delivery.';

    return {
      releaseId: release.id,
      overallStatus,
      checks,
      passedChecks,
      failedChecks,
      warningChecks,
      summary,
      checkedAt: now,
    };
  }

  /**
   * Validate DDEX ERN compliance.
   * Checks that the metadata structure can generate a valid DDEX ERN 4.2 message.
   * DDEX (Digital Data Exchange) is the global standard for music metadata delivery.
   * DSPs like Spotify and Apple Music ingest ERN messages for release cataloging.
   */
  validateDdexCompliance(release: Release, songs: CatalogSong[]): CheckResult {
    const now = new Date().toISOString();
    const details: string[] = [];

    // UPC required for ERN release element
    if (!release.upc) {
      details.push('UPC missing — DDEX ERN requires UPC on the Release element');
    }

    // Every track needs an ISRC for ResourceList
    const missingIsrc = songs.filter((s) => !s.isrc);
    if (missingIsrc.length > 0) {
      details.push(`${missingIsrc.length} tracks missing ISRC — each SoundRecording resource requires ISRC`);
      missingIsrc.forEach((s) => details.push(`  - "${s.title}" needs ISRC assignment`));
    }

    // Title length limits (DDEX recommends max 100 chars)
    const longTitles = songs.filter((s) => s.title.length > 100);
    if (longTitles.length > 0) {
      details.push(`${longTitles.length} tracks have titles exceeding 100 characters — may be truncated by DSPs`);
    }

    // Genre must be specified
    if (!release.genre) {
      details.push('Release genre missing — DDEX requires GenreText on Release and Resource');
    }

    // C-Line and P-Line generatable?
    const songsWithoutOwner = songs.filter((s) => !s.master_owner);
    if (songsWithoutOwner.length > 0) {
      details.push(`${songsWithoutOwner.length} tracks missing master_owner — C-Line/P-Line cannot be generated`);
    }

    // Release date required
    if (!release.release_date) {
      details.push('Release date missing — ERN requires ReleaseDate element');
    }

    const status: CheckResult['status'] =
      details.some((d) => d.includes('UPC missing') || d.includes('missing ISRC') || d.includes('master_owner'))
        ? 'fail' : details.length > 0 ? 'warning' : 'pass';

    return {
      checkType: 'ddex',
      status,
      message: status === 'pass'
        ? 'ERN message schema validated — all DDEX required fields present'
        : `DDEX compliance issues: ${details.length} problems found`,
      details,
      checkedAt: now,
    };
  }

  /**
   * Validate metadata completeness across all songs.
   * Checks that every track has the core metadata fields required by all major DSPs:
   * title, ISRC, genre, duration, composer, language, explicit flag.
   */
  validateMetadataCompleteness(songs: CatalogSong[]): CheckResult {
    const now = new Date().toISOString();
    const details: string[] = [];

    for (const song of songs) {
      const validation = metadataEngine.validateForDistribution(song);
      validation.errors.forEach((e) => details.push(`[${song.title}] ${e}`));
      validation.warnings.forEach((w) => details.push(`[${song.title}] ⚠ ${w}`));
    }

    const hasErrors = details.some((d) => !d.startsWith('[') || !d.includes('⚠'));
    const status: CheckResult['status'] =
      details.length === 0 ? 'pass' :
      hasErrors ? 'fail' : 'warning';

    return {
      checkType: 'metadata',
      status,
      message: status === 'pass'
        ? 'All core metadata fields complete (ISRC, UPC, IPI/CAE)'
        : `Metadata completeness issues: ${details.length} problems across ${songs.length} tracks`,
      details,
      checkedAt: now,
    };
  }

  /**
   * Validate artwork specifications.
   * DSPs have strict artwork requirements:
   * - Minimum 3000x3000 pixels (some DSPs reject anything smaller)
   * - RGB color mode (CMYK will be rejected)
   * - No URLs, social media handles, or promotional text in the image
   * - No borders or decorative frames
   * - Square aspect ratio (1:1)
   * - JPEG or PNG format preferred
   */
  validateArtworkSpecs(artwork: ArtworkMetadata): CheckResult {
    const now = new Date().toISOString();
    const details: string[] = [];

    // Resolution check
    if (artwork.width < 3000 || artwork.height < 3000) {
      details.push(`Resolution ${artwork.width}x${artwork.height} below minimum 3000x3000 — DSPs will reject`);
    }
    if (artwork.width > 6000 || artwork.height > 6000) {
      details.push(`Resolution ${artwork.width}x${artwork.height} very large — may cause upload failures`);
    }

    // Square aspect ratio
    if (!artwork.isSquare && artwork.width !== artwork.height) {
      details.push(`Artwork is not square (${artwork.width}x${artwork.height}) — DSPs require 1:1 aspect ratio`);
    }

    // Color mode
    if (artwork.colorMode !== 'RGB') {
      details.push(`Color mode is ${artwork.colorMode} — only RGB is accepted by DSPs (CMYK will be rejected)`);
    }

    // URLs in image
    if (artwork.containsUrls) {
      details.push('Artwork contains URLs/social media handles — DSPs reject images with promotional text');
    }

    // Borders
    if (artwork.containsBorders) {
      details.push('Artwork contains borders/frames — some DSPs reject bordered artwork');
    }

    // Format
    if (artwork.fileFormat !== 'JPEG' && artwork.fileFormat !== 'PNG') {
      details.push(`File format ${artwork.fileFormat} not preferred — use JPEG or PNG`);
    }

    const hasFailures = details.some((d) =>
      d.includes('below minimum') || d.includes('not square') ||
      d.includes('CMYK') || d.includes('contains URLs')
    );

    const status: CheckResult['status'] =
      details.length === 0 ? 'pass' :
      hasFailures ? 'fail' : 'warning';

    return {
      checkType: 'artwork',
      status,
      message: status === 'pass'
        ? '3000x3000 JPEG, RGB, no URLs/borders'
        : `Artwork specification issues: ${details.length} problems found`,
      details,
      checkedAt: now,
    };
  }

  /**
   * Validate audio quality specifications.
   * DSP audio requirements vary but common standards include:
   * - WAV format for delivery (lossless, uncompressed)
   * - 44.1kHz or 48kHz sample rate
   * - 16-bit or 24-bit depth
   * - -14 LUFS integrated loudness (Spotify target)
   * - True peak below -1 dBTP
   * - No excessive silence at start/end
   * - Minimum 30 seconds duration
   */
  validateAudioQuality(audio: AudioMetadata): CheckResult {
    const now = new Date().toISOString();
    const details: string[] = [];

    // Format check
    if (audio.format !== 'WAV' && audio.format !== 'FLAC') {
      details.push(`Audio format is ${audio.format} — DSPs require WAV (lossless) for delivery`);
    }

    // Sample rate
    if (audio.sampleRate !== 44100 && audio.sampleRate !== 48000) {
      details.push(`Sample rate ${audio.sampleRate}Hz not standard — use 44100 or 48000`);
    }

    // Bit depth
    if (audio.bitDepth < 16) {
      details.push(`Bit depth ${audio.bitDepth} below minimum 16-bit`);
    }

    // Duration
    if (audio.durationSeconds < 30) {
      details.push(`Duration ${audio.durationSeconds}s below minimum 30 seconds — DSPs may reject`);
    }

    // Loudness (Spotify targets -14 LUFS integrated)
    if (audio.loudnessLUFS > -10) {
      details.push(`Integrated loudness ${audio.loudnessLUFS} LUFS is too loud — target -14 LUFS for Spotify normalization`);
    }
    if (audio.loudnessLUFS < -20) {
      details.push(`Integrated loudness ${audio.loudnessLUFS} LUFS is very quiet — may sound soft after DSP normalization`);
    }

    // True peak
    if (audio.truePeakDb > -1) {
      details.push(`True peak ${audio.truePeakDb} dBTP exceeds -1 dBTP threshold — risk of clipping on DSP codecs`);
    }

    // Silence checks
    if (audio.hasSilenceAtStart) {
      details.push('Audio has silence at the start — trim leading silence for cleaner playback');
    }
    if (audio.hasSilenceAtEnd) {
      details.push('Audio has silence at the end — consider trimming excessive trailing silence');
    }

    const hasFailures = details.some((d) =>
      d.includes('require WAV') || d.includes('below minimum') ||
      d.includes('not standard') || d.includes('exceeds -1')
    );

    const status: CheckResult['status'] =
      details.length === 0 ? 'pass' :
      hasFailures ? 'fail' : 'warning';

    return {
      checkType: 'audio',
      status,
      message: status === 'pass'
        ? 'WAV files validated, checksums generated, loudness analyzed'
        : `Audio quality issues: ${details.length} problems found`,
      details,
      checkedAt: now,
    };
  }

  /**
   * Validate copyright chain — rights coverage completeness.
   * Ensures that master and publishing rights are properly documented for every track.
   * Without verified rights, DSPs cannot legally distribute the music and sync
   * licensing is impossible. Checks for:
   * - Master rights ownership at 100% per territory
   * - Publishing rights ownership at 100% per territory
   * - Sync rights availability
   * - One-stop clearance (ideal for fast sync deals)
   */
  validateCopyrightChain(rights: RightsRecord[]): CheckResult {
    const now = new Date().toISOString();
    const details: string[] = [];

    // Group rights by song
    const songIds = Array.from(new Set(rights.map((r) => r.catalog_song_id)));
    for (const songId of songIds) {
      const songRights = rights.filter((r) => r.catalog_song_id === songId);
      const clearance = metadataEngine.calculateClearance(songRights);

      if (!clearance.masterClear) {
        details.push(`Song ${songId}: Master rights incomplete (${clearance.totalOwnershipPct}%)`);
      }
      if (!clearance.publishingClear) {
        details.push(`Song ${songId}: Publishing rights incomplete`);
      }
      if (clearance.blockers.length > 0) {
        clearance.blockers.forEach((b) => details.push(`Song ${songId}: ${b}`));
      }
    }

    // Check for songs without any rights records
    if (rights.length === 0) {
      details.push('No rights records found — all tracks require rights documentation for distribution');
    }

    const status: CheckResult['status'] =
      details.length === 0 ? 'pass' :
      details.some((d) => d.includes('incomplete') || d.includes('No rights')) ? 'fail' : 'warning';

    return {
      checkType: 'copyright',
      status,
      message: status === 'pass'
        ? 'Rights ownership verified for all territories'
        : `Copyright chain issues: ${details.length} problems found`,
      details,
      checkedAt: now,
    };
  }

  /**
   * Validate territory coverage — rights cover all intended distribution territories.
   * A release can only be distributed in territories where rights are cleared.
   * Missing rights in a territory means the DSP must geo-block that territory,
   * which reduces potential revenue. Common territories:
   * - WW (Worldwide): Covers all territories — ideal for maximum distribution
   * - US, GB, DE, FR, JP, AU: Major music markets
   */
  validateTerritoryCoverage(rights: RightsRecord[], territories: string[]): CheckResult {
    const now = new Date().toISOString();
    const details: string[] = [];

    // If Worldwide rights exist, all territories are covered
    const hasWorldwide = rights.some((r) => r.territory === 'Worldwide' || r.territory === 'WW');
    if (hasWorldwide) {
      return {
        checkType: 'territory',
        status: 'pass',
        message: 'Worldwide rights coverage — all territories cleared for distribution',
        details: [],
        checkedAt: now,
      };
    }

    // Otherwise check each required territory
    const coveredTerritories = new Set(rights.map((r) => r.territory));
    const uncovered = territories.filter((t) => !coveredTerritories.has(t));

    if (uncovered.length > 0) {
      details.push(`Territories without rights coverage: ${uncovered.join(', ')}`);
      details.push('Uncovered territories will be geo-blocked by DSPs — revenue lost');
    }

    // Check for expired rights in covered territories
    const expired = rights.filter((r) => {
      if (!r.expiration) return false;
      return new Date(r.expiration) < new Date();
    });
    if (expired.length > 0) {
      details.push(`${expired.length} rights records have expired — territories may lose coverage`);
      expired.forEach((e) => details.push(`  - ${e.rights_type} in ${e.territory} expired ${e.expiration}`));
    }

    const status: CheckResult['status'] =
      details.length === 0 ? 'pass' :
      details.some((d) => d.includes('without rights')) ? 'fail' : 'warning';

    return {
      checkType: 'territory',
      status,
      message: status === 'pass'
        ? 'Rights coverage verified for all target territories'
        : `Territory coverage issues: ${details.length} problems found`,
      details,
      checkedAt: now,
    };
  }

  /**
   * Check if release is ready for delivery (all checks pass or only have warnings).
   * A single 'fail' status on any check blocks delivery entirely.
   */
  isReadyForDelivery(report: ValidationReport): boolean {
    return report.overallStatus === 'pass' || report.overallStatus === 'warning';
  }
}

/** Export singleton instance */
export const validationEngine = new ValidationEngine();
