/**
 * Metadata Engine — Core service layer for music metadata capture, tracking, and management.
 *
 * Handles C-Line/P-Line generation, imprint creation, ISRC/UPC/ISWC assignment,
 * DDEX-compliant metadata structuring, validation, versioning, and clearance calculations.
 *
 * Music Industry Context:
 * - C-Line (Copyright Line): Identifies the copyright holder of the release packaging/artwork.
 *   Format: "© [Year] [Copyright Holder]" — required on all commercially distributed releases.
 * - P-Line (Phonographic Line): Identifies the copyright holder of the sound recording (master).
 *   Format: "℗ [Year] [Copyright Holder]" — required alongside C-Line on all releases.
 * - ISRC (International Standard Recording Code): Unique identifier for a specific sound recording.
 *   Format: CC-XXX-YY-NNNNN (Country Code + Registrant Code + Year + Designation Code).
 *   Each recording needs its own ISRC — different mixes/edits require separate codes.
 * - UPC (Universal Product Code): 12-digit barcode identifying the release (album/EP/single).
 * - ISWC (International Standard Work Code): T-XXXXXXXX-X format identifying the composition itself.
 * - DDEX ERN (Electronic Release Notification): XML messaging standard for delivering
 *   release metadata to DSPs (Spotify, Apple Music, etc.) per DDEX standard 4.2.
 * - Imprint: The label/brand name under which a release is commercially issued.
 */

import type { CatalogSong, Release, RightsRecord, RoyaltySplit } from '@/types/database';

// ============ EXPORTED TYPES ============

/** Full metadata record for a catalog song, including computed/generated fields */
export type CatalogSongMetadata = {
  song: CatalogSong;
  cLine: string;
  pLine: string;
  imprint: ImprintRecord;
  isrc: string;
  iswc: string | null;
  upc: string | null;
  metadataVersion: number;
  validationStatus: ValidationResult;
  createdAt: string;
  updatedAt: string;
};

/** Imprint record — the commercial label brand under which a release is issued */
export type ImprintRecord = {
  id: string;
  name: string;
  labelName: string;
  year: number;
  suffix: string;
  fullImprint: string;
  createdAt: string;
};

/** Validation result for distribution or sync readiness checks */
export type ValidationResult = {
  valid: boolean;
  errors: string[];
  warnings: string[];
  missingFields: string[];
};

/** DDEX ERN 4.2 compliant message structure for release delivery to DSPs */
export type DdexErnMessage = {
  messageHeader: {
    messageThreadId: string;
    messageId: string;
    messageSender: { partyId: string; partyName: string };
    messageRecipient: { partyId: string; partyName: string };
    messageCreatedDateTime: string;
  };
  resourceList: {
    soundRecording: DdexSoundRecording[];
  };
  releaseList: {
    release: DdexRelease;
  };
  dealList: {
    deal: DdexDeal[];
  };
  rightsAgreementInfo?: {
    rightsAgreementId: string;
    rightsAgreementType: string;
    rightsController: { partyId: string; partyName: string; role: string };
  };
};

export type DdexSoundRecording = {
  resourceId: string;
  resourceReference: string;
  isrc: string;
  title: string;
  duration: number;
  technicalDetails: {
    audioCodecType: string;
    bitRate: number;
    samplingRate: number;
    bitsPerSample: number;
    numberOfChannels: number;
  };
  displayArtistName: string;
  displayArtist: { partyName: string; role: string }[];
  genre: { genreText: string; subGenre?: string };
  pLine: string;
  releaseDate?: string;
};

export type DdexRelease = {
  releaseId: string;
  releaseReference: string;
  upc: string;
  title: string;
  displayArtistName: string;
  displayArtist: { partyName: string; role: string }[];
  cLine: string;
  pLine: string;
  imprint: string;
  genre: { genreText: string; subGenre?: string };
  releaseDate: string;
  releaseType: string;
  resourceReferenceList: string[];
  explicitContent: boolean;
};

export type DdexDeal = {
  dealReference: string;
  commercialModelType: string;
  territoryCode: string[];
  useConstraints?: { useType: string; consumerRetailPrice?: number }[];
  validityPeriod?: { startDateTime: string; endDateTime?: string };
};

/** Metadata version tracking record for change history */
export type MetadataVersion = {
  id: string;
  songId: string;
  field: string;
  oldValue: unknown;
  newValue: unknown;
  version: number;
  changedAt: string;
  changedBy: string | null;
};

/** Clearance status for sync/distribution eligibility */
export type ClearanceStatus = {
  oneStop: boolean;
  masterClear: boolean;
  publishingClear: boolean;
  syncClear: boolean;
  mechanicalClear: boolean;
  totalOwnershipPct: number;
  blockers: string[];
  notes: string;
};

/** Result of validating that royalty splits sum to 100% */
export type SplitValidationResult = {
  valid: boolean;
  totalPct: number;
  deviation: number;
  participants: { name: string; role: string; share: number }[];
  errors: string[];
};

// ============ INTERNAL STATE ============

/** ISRC designation code counter per registrant+year */
const isrcCounter: Record<string, number> = {};
/** UPC counter for generating sequential UPCs */
let upcCounter = 1000000000;
/** ISWC counter for generating sequential ISWCs */
let iswcCounter = 10000000;
/** Version tracker per song */
const songVersions: Record<string, number> = {};
/** Change history per song */
const changeHistory: Record<string, MetadataVersion[]> = {};

function uuid(): string {
  return `me-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

// ============ METADATA ENGINE CLASS ============

export class MetadataEngine {
  /**
   * Create a new song metadata record from minimal input.
   * Auto-generates ISRC, imprint, C-Line, P-Line where possible.
   */
  createSongMetadata(input: Partial<CatalogSong>): CatalogSongMetadata {
    const now = new Date().toISOString();
    const song = this.autoPopulate(input);
    const year = song.recording_year ?? new Date().getFullYear();
    const holder = song.master_owner ?? song.composer[0] ?? 'Unknown';
    const pubHolder = song.publishing_owner ?? holder;

    const cLine = this.generateCLine(year, holder);
    const pLine = this.generatePLine(year, pubHolder);
    const imprint = this.createImprint(
      song.publishing_owner ?? song.composer[0] ?? 'Independent',
      year
    );
    const isrc = song.isrc ?? this.assignISRC('US', 'XXX', year);
    const iswc = song.iswc ?? this.assignISWC();
    const upc = song.upc ?? null;

    songVersions[song.id] = 1;

    return {
      song,
      cLine,
      pLine,
      imprint,
      isrc,
      iswc,
      upc,
      metadataVersion: 1,
      validationStatus: this.validateForDistribution(song),
      createdAt: now,
      updatedAt: now,
    };
  }

  /**
   * Auto-populate fields from available data.
   * Generates slug from title, sets defaults for missing fields.
   */
  autoPopulate(song: Partial<CatalogSong>): CatalogSong {
    const now = new Date().toISOString();
    const title = song.title ?? 'Untitled Song';
    const slug = song.slug ?? title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const id = song.id ?? uuid();

    return {
      id,
      tenant_id: song.tenant_id ?? 'default',
      title,
      slug,
      alternate_titles: song.alternate_titles ?? [],
      description: song.description ?? null,
      lyrics: song.lyrics ?? null,
      explicit: song.explicit ?? false,
      language: song.language ?? 'English',
      genre: song.genre ?? 'Pop',
      mood_tags: song.mood_tags ?? [],
      energy: song.energy ?? null,
      valence: song.valence ?? null,
      bpm: song.bpm ?? null,
      key: song.key ?? null,
      time_signature: song.time_signature ?? '4/4',
      duration_seconds: song.duration_seconds ?? 0,
      composer: song.composer ?? [],
      producer: song.producer ?? [],
      mix_engineer: song.mix_engineer ?? null,
      master_owner: song.master_owner ?? null,
      publishing_owner: song.publishing_owner ?? null,
      recording_year: song.recording_year ?? new Date().getFullYear(),
      release_year: song.release_year ?? null,
      album: song.album ?? null,
      version_label: song.version_label ?? 'Original',
      isrc: song.isrc ?? null,
      iswc: song.iswc ?? null,
      upc: song.upc ?? null,
      pro: song.pro ?? null,
      splits: song.splits ?? [],
      stems_available: song.stems_available ?? false,
      master_url: song.master_url ?? null,
      preview_url: song.preview_url ?? null,
      watermarked_url: song.watermarked_url ?? null,
      cover_art_url: song.cover_art_url ?? null,
      distribution_flag: song.distribution_flag ?? 'catalog_only',
      distribution_status: song.distribution_status ?? 'not_submitted',
      sync_status: song.sync_status ?? 'unavailable',
      for_sale: song.for_sale ?? false,
      asking_price: song.asking_price ?? null,
      asking_price_negotiable: song.asking_price_negotiable ?? false,
      visible_to_roles: song.visible_to_roles ?? ['label'],
      is_active: song.is_active ?? true,
      published_at: song.published_at ?? null,
      version: song.version ?? 1,
      created_at: song.created_at ?? now,
      updated_at: song.updated_at ?? now,
      deleted_at: song.deleted_at ?? null,
    };
  }

  /**
   * Generate C-Line (Copyright Line).
   * The C-Line identifies the copyright holder of the release packaging,
   * artwork, and liner notes. Required on all commercially released recordings.
   * Format: "© [Year] [Copyright Holder]"
   */
  generateCLine(year: number, holder: string): string {
    if (!holder || holder.trim() === '') {
      throw new Error('C-Line requires a valid copyright holder name');
    }
    if (year < 1900 || year > new Date().getFullYear() + 1) {
      throw new Error(`C-Line year ${year} is out of valid range`);
    }
    return `© ${year} ${holder.trim()}`;
  }

  /**
   * Generate P-Line (Phonographic Line).
   * The P-Line identifies the copyright holder of the sound recording (master).
   * Distinguish from C-Line: C-Line = packaging/artwork, P-Line = recording itself.
   * Format: "℗ [Year] [Copyright Holder]"
   */
  generatePLine(year: number, holder: string): string {
    if (!holder || holder.trim() === '') {
      throw new Error('P-Line requires a valid copyright holder name');
    }
    if (year < 1900 || year > new Date().getFullYear() + 1) {
      throw new Error(`P-Line year ${year} is out of valid range`);
    }
    return `℗ ${year} ${holder.trim()}`;
  }

  /**
   * Create imprint automatically from label name + year + unique suffix.
   * An imprint is the commercial label/brand identity under which a release is
   * issued. Many major labels have multiple imprints (e.g., Atlantic Records is
   * an imprint of Warner Music Group).
   */
  createImprint(labelName: string, year: number): ImprintRecord {
    const suffix = `IMP-${year}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
    const fullImprint = `${labelName} / ${suffix}`;

    return {
      id: uuid(),
      name: labelName,
      labelName,
      year,
      suffix,
      fullImprint,
      createdAt: new Date().toISOString(),
    };
  }

  /**
   * Assign an ISRC code (International Standard Recording Code).
   * The ISRC uniquely identifies a specific sound recording worldwide.
   * Format: CC-XXX-YY-NNNNN where:
   *   CC   = 2-letter country code (ISO 3166-1 alpha-2, e.g., US, GB, DE)
   *   XXX  = 3-character registrant code assigned by national ISRC agency
   *   YY   = 2-digit year of first fixation (last two digits of recording year)
   *   NNNN = 5-digit designation code (sequential within registrant+year)
   * Each distinct recording (remix, edit, live version) needs its own ISRC.
   */
  assignISRC(countryCode: string, registrantCode: string, year: number): string {
    if (countryCode.length !== 2) {
      throw new Error('ISRC country code must be 2 characters (ISO 3166-1 alpha-2)');
    }
    if (registrantCode.length !== 3) {
      throw new Error('ISRC registrant code must be 3 characters');
    }

    const yearPart = String(year % 100).padStart(2, '0');
    const key = `${countryCode}-${registrantCode}-${yearPart}`;
    isrcCounter[key] = (isrcCounter[key] ?? 0) + 1;
    const designation = String(isrcCounter[key]).padStart(5, '0');

    return `${countryCode}-${registrantCode}-${yearPart}-${designation}`;
  }

  /**
   * Assign a UPC (Universal Product Code).
   * UPC is a 12-digit barcode identifying a release (album, EP, single) for
   * retail and digital distribution. Each release needs a unique UPC.
   * Generated sequentially with a GS1-compatible structure.
   */
  assignUPC(): string {
    upcCounter += 1;
    const base = String(upcCounter).padStart(11, '0');
    // Calculate check digit (Modulo 10 / GS1 algorithm)
    let sum = 0;
    for (let i = 0; i < 11; i++) {
      const digit = parseInt(base[i], 10);
      sum += digit * (i % 2 === 0 ? 3 : 1);
    }
    const checkDigit = (10 - (sum % 10)) % 10;
    return `${base}${checkDigit}`;
  }

  /**
   * Assign an ISWC (International Standard Work Code).
   * The ISWC uniquely identifies a musical composition (the underlying work,
   * not a specific recording). Format: T-XXXXXXXX-X where the first digit
   * identifies the submitting organization and the last is a check digit.
   * This is distinct from ISRC which identifies recordings, not compositions.
   */
  assignISWC(): string {
    iswcCounter += 1;
    const base = String(iswcCounter).padStart(8, '0');
    // Calculate check digit per ISO 15707
    const weights = [1, 3, 1, 3, 1, 3, 1, 3];
    let sum = 0;
    for (let i = 0; i < 8; i++) {
      sum += parseInt(base[i], 10) * weights[i];
    }
    const checkDigit = (10 - (sum % 10)) % 10;
    return `T-${base}-${checkDigit}`;
  }

  /**
   * Validate metadata completeness for distribution readiness.
   * Checks that all fields required for DSP delivery (Spotify, Apple Music, etc.)
   * are present and properly formatted. Missing ISRC, UPC, or required metadata
   * fields will cause DSP rejection.
   */
  validateForDistribution(song: CatalogSong): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const missingFields: string[] = [];

    // Required fields for distribution
    const requiredFields: [string, string][] = [
      ['title', 'Song title is required for distribution'],
      ['isrc', 'ISRC code is required — DSPs reject tracks without ISRC'],
      ['genre', 'Genre classification is required by all DSPs'],
      ['duration_seconds', 'Duration must be specified (minimum 1 second)'],
      ['composer', 'At least one composer must be listed'],
      ['master_owner', 'Master rights owner must be identified'],
      ['language', 'Language is required for lyrics/metadata indexing'],
    ];

    for (const [field, message] of requiredFields) {
      const val = song[field as keyof CatalogSong];
      if (val === null || val === undefined || val === '' || (Array.isArray(val) && val.length === 0)) {
        errors.push(message);
        missingFields.push(field);
      }
    }

    // Conditional checks
    if (song.duration_seconds > 0 && song.duration_seconds < 30) {
      warnings.push('Duration under 30 seconds may be rejected by some DSPs');
    }
    if (song.duration_seconds > 3600) {
      warnings.push('Duration over 60 minutes — verify this is intentional');
    }
    if (song.explicit && !song.lyrics) {
      warnings.push('Explicit flag set but no lyrics provided — some DSPs require lyrics for explicit tracks');
    }
    if (!song.upc) {
      warnings.push('UPC not assigned — required for release-level distribution');
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      missingFields,
    };
  }

  /**
   * Validate metadata completeness for sync readiness.
   * Sync licensing requires more granular metadata: rights clearance info,
   * split details, contact info, and mood/energy metadata for search.
   */
  validateForSync(song: CatalogSong): ValidationResult {
    const distResult = this.validateForDistribution(song);
    const errors = [...distResult.errors];
    const warnings = [...distResult.warnings];
    const missingFields = [...distResult.missingFields];

    // Additional sync-specific requirements
    const syncRequired: [string, string][] = [
      ['mood_tags', 'Mood tags required for sync search discoverability'],
      ['bpm', 'BPM required for sync search filtering'],
      ['energy', 'Energy rating required for sync matching'],
      ['valence', 'Valence/emotion rating required for sync matching'],
      ['publishing_owner', 'Publishing owner required for clearance determination'],
      ['splits', 'Royalty splits required for sync fee pass-through'],
    ];

    for (const [field, message] of syncRequired) {
      const val = song[field as keyof CatalogSong];
      if (val === null || val === undefined || val === '' || (Array.isArray(val) && val.length === 0)) {
        warnings.push(message);
        missingFields.push(field);
      }
    }

    if (!song.stems_available) {
      warnings.push('Stems not available — limits sync customization potential');
    }
    if (!song.master_url) {
      errors.push('Master audio URL required for sync preview delivery');
      missingFields.push('master_url');
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      missingFields,
    };
  }

  /**
   * Build DDEX ERN (Electronic Release Notification) compliant metadata object.
   * DDEX ERN is the XML messaging standard used by the music industry to deliver
   * release metadata and resource references to DSPs. Version 4.2 is the current
   * standard. This builds the data structure; use ddex-builder.ts for XML generation.
   */
  buildDdexErn(song: CatalogSong, release: Release): DdexErnMessage {
    const now = new Date().toISOString();
    const year = song.recording_year ?? new Date().getFullYear();
    const holder = song.master_owner ?? song.composer[0] ?? 'Unknown';
    const pubHolder = song.publishing_owner ?? holder;

    return {
      messageHeader: {
        messageThreadId: `ERN-${release.id}-${Date.now()}`,
        messageId: `MSG-${uuid()}`,
        messageSender: {
          partyId: release.catalog_number ?? 'UNKNOWN',
          partyName: holder,
        },
        messageRecipient: {
          partyId: 'DSP-GENERIC',
          partyName: 'Digital Service Provider',
        },
        messageCreatedDateTime: now,
      },
      resourceList: {
        soundRecording: [
          {
            resourceId: song.id,
            resourceReference: `A${String(1).padStart(3, '0')}`,
            isrc: song.isrc ?? 'USXXX0000000',
            title: song.title,
            duration: song.duration_seconds * 1000, // DDEX uses milliseconds
            technicalDetails: {
              audioCodecType: 'PCM',
              bitRate: 1411,
              samplingRate: 44100,
              bitsPerSample: 16,
              numberOfChannels: 2,
            },
            displayArtistName: song.composer[0] ?? holder,
            displayArtist: song.composer.map((c) => ({
              partyName: c,
              role: 'Composer',
            })),
            genre: {
              genreText: song.genre,
              subGenre: song.mood_tags[0] ?? undefined,
            },
            pLine: this.generatePLine(year, pubHolder),
            releaseDate: release.release_date ?? undefined,
          },
        ],
      },
      releaseList: {
        release: {
          releaseId: release.id,
          releaseReference: `R${String(1).padStart(3, '0')}`,
          upc: release.upc ?? this.assignUPC(),
          title: release.title,
          displayArtistName: song.composer[0] ?? holder,
          displayArtist: song.composer.map((c) => ({
            partyName: c,
            role: 'Composer',
          })),
          cLine: this.generateCLine(year, holder),
          pLine: this.generatePLine(year, pubHolder),
          imprint: this.createImprint(holder, year).fullImprint,
          genre: {
            genreText: release.genre ?? song.genre,
            subGenre: undefined,
          },
          releaseDate: release.release_date ?? now,
          releaseType: release.type ?? 'Single',
          resourceReferenceList: ['A001'],
          explicitContent: song.explicit,
        },
      },
      dealList: {
        deal: [
          {
            dealReference: `D${String(1).padStart(3, '0')}`,
            commercialModelType: 'PayForUse',
            territoryCode: ['Worldwide'],
            useConstraints: [{ useType: 'PermanentDownload', consumerRetailPrice: release.price_cents / 100 }],
            validityPeriod: { startDateTime: release.release_date ?? now },
          },
        ],
      },
      rightsAgreementInfo: {
        rightsAgreementId: `RA-${song.id}`,
        rightsAgreementType: 'RightsControllerAssignment',
        rightsController: {
          partyId: holder,
          partyName: holder,
          role: 'RightsController',
        },
      },
    };
  }

  /**
   * Track metadata changes for versioning and audit trail.
   * Every field modification increments the song version and records
   * the old/new values for compliance traceability.
   */
  trackChange(songId: string, field: string, oldValue: unknown, newValue: unknown): MetadataVersion {
    if (!songVersions[songId]) songVersions[songId] = 1;
    songVersions[songId] += 1;

    const version: MetadataVersion = {
      id: uuid(),
      songId,
      field,
      oldValue,
      newValue,
      version: songVersions[songId],
      changedAt: new Date().toISOString(),
      changedBy: null, // Would be set by auth context in production
    };

    if (!changeHistory[songId]) changeHistory[songId] = [];
    changeHistory[songId].push(version);

    return version;
  }

  /**
   * Calculate one-stop clearance status from rights records.
   * "One-stop clearance" means a single entity controls both master AND publishing
   * rights for a song, enabling fast sync licensing without chasing multiple owners.
   * This is a critical factor in sync — songs with one-stop clearance are far more
   * attractive to music supervisors because deals can be closed quickly.
   */
  calculateClearance(rights: RightsRecord[]): ClearanceStatus {
    const blockers: string[] = [];
    let notes = '';

    // Check master rights coverage
    const masterRights = rights.filter((r) => r.rights_type === 'master');
    const masterTotal = masterRights.reduce((sum, r) => sum + r.ownership_pct, 0);
    const masterClear = masterTotal >= 100;

    // Check publishing rights coverage
    const pubRights = rights.filter((r) => r.rights_type === 'publishing');
    const pubTotal = pubRights.reduce((sum, r) => sum + r.ownership_pct, 0);
    const publishingClear = pubTotal >= 100;

    // Check sync rights
    const syncRights = rights.filter((r) => r.rights_type === 'sync');
    const syncClear = syncRights.length > 0 && syncRights.some((r) => r.ownership_pct >= 100);

    // Check mechanical rights
    const mechRights = rights.filter((r) => r.rights_type === 'mechanical');
    const mechanicalClear = mechRights.length > 0;

    // One-stop: same entity controls both master and publishing at 100%
    const masterOwners = masterRights.filter((r) => r.ownership_pct >= 100).map((r) => r.owner);
    const pubOwners = pubRights.filter((r) => r.ownership_pct >= 100).map((r) => r.owner);
    const oneStop = masterOwners.length > 0 && pubOwners.length > 0 &&
      masterOwners.some((mo) => pubOwners.some((po) => po === mo || po.startsWith(mo)));

    if (!masterClear) blockers.push(`Master ownership incomplete: ${masterTotal}% (need 100%)`);
    if (!publishingClear) blockers.push(`Publishing ownership incomplete: ${pubTotal}% (need 100%)`);
    if (!syncClear) blockers.push('No full sync rights controller identified');
    if (!mechanicalClear) blockers.push('Mechanical rights not registered');

    const totalPct = Math.min(masterTotal, pubTotal);
    if (oneStop) notes = 'One-stop clearance available — single entity controls master + publishing';
    else if (masterClear && publishingClear) notes = 'Full clearance possible but requires multiple rightsholder approvals';
    else notes = 'Clearance blocked — rights gaps exist';

    return {
      oneStop,
      masterClear,
      publishingClear,
      syncClear,
      mechanicalClear,
      totalOwnershipPct: totalPct,
      blockers,
      notes,
    };
  }

  /**
   * Validate that royalty splits sum to exactly 100%.
   * In the music industry, all royalty/recording splits for a song MUST total 100%.
   * Deviations cause payment disputes, audit failures, and legal complications.
   * Each participant's share represents their contractual entitlement to revenue.
   */
  validateSplitIntegrity(splits: RoyaltySplit[]): SplitValidationResult {
    const totalPct = splits.reduce((sum, s) => sum + s.share_pct, 0);
    const deviation = Math.abs(totalPct - 100);

    const participants = splits.map((s) => ({
      name: s.participant_name,
      role: s.participant_role,
      share: s.share_pct,
    }));

    const errors: string[] = [];
    if (deviation > 0) {
      if (totalPct < 100) {
        errors.push(`Splits total ${totalPct}% — missing ${(100 - totalPct).toFixed(1)}% allocation`);
      } else {
        errors.push(`Splits total ${totalPct}% — over-allocated by ${(totalPct - 100).toFixed(1)}%`);
      }
    }

    // Check for duplicate participants
    const names = splits.map((s) => s.participant_name);
    const duplicates = names.filter((n, i) => names.indexOf(n) !== i);
    if (duplicates.length > 0) {
      errors.push(`Duplicate participants found: ${duplicates.join(', ')}`);
    }

    // Check for zero-percent splits
    const zeroSplits = splits.filter((s) => s.share_pct === 0);
    if (zeroSplits.length > 0) {
      errors.push(`Zero-percent splits found for: ${zeroSplits.map((s) => s.participant_name).join(', ')}`);
    }

    return {
      valid: deviation === 0 && errors.length === 0,
      totalPct,
      deviation,
      participants,
      errors,
    };
  }

  /** Get change history for a song */
  getChangeHistory(songId: string): MetadataVersion[] {
    return changeHistory[songId] ?? [];
  }
}

/** Export singleton instance for convenience */
export const metadataEngine = new MetadataEngine();
