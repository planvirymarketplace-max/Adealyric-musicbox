/**
 * Rights Management Engine — Service layer for creating, classifying, and managing
 * music rights records, split sheets, territory matrices, and PRO/mechanical registrations.
 *
 * Music rights are the legal foundation of the entire industry. Every recording and
 * composition has multiple layers of rights, each with different owners, territories,
 * and expiration terms. Understanding and managing these rights correctly is essential
 * for distribution, sync licensing, and royalty payments.
 *
 * Key rights categories:
 * - Master Rights: Ownership of the specific sound recording (the "master tape").
 *   The master rightsholder controls who can reproduce and distribute the recording.
 *   Typically owned by the label or artist (if independent).
 *
 * - Publishing Rights: Ownership of the underlying composition (the melody + lyrics).
 *   Publishers administer the composition, collect mechanical royalties, and negotiate
 *   sync licenses. They register with PROs (ASCAP, BMI, SESAC, GEMA, etc.)
 *
 * - Mechanical Rights: The right to reproduce a composition in physical/digital format.
 *   In the US, mechanical licenses are administered by The MLC (under MMA 2018)
 *   and the Harry Fox Agency (HFA). Statutory rate: 9.1¢ per song.
 *
 * - Neighboring Rights: Royalties paid to performers and master owners for public
 *   performance of recordings (radio, TV, digital). Collected by SoundExchange (US),
 *   PPL (UK), and similar organizations worldwide. NOT the same as publishing royalties.
 *
 * - Sync Rights: The right to synchronize a recording/composition with visual media.
 *   Requires clearance from BOTH master AND publishing sides.
 *
 * - One-Stop Clearance: When a single entity controls both master AND publishing,
 *   enabling fast sync licensing without chasing multiple rightsholders.
 */

import type { CatalogSong, RightsRecord, RoyaltySplit } from '@/types/database';
import { MetadataEngine } from '@/lib/metadata-engine';
import type { SplitValidationResult } from '@/lib/metadata-engine';

// ============ EXPORTED TYPES ============

/** Input for creating a new rights record */
export type RightsInput = {
  catalogSongId: string;
  rightsType: 'master' | 'publishing' | 'neighboring' | 'mechanical' | 'sync';
  owner: string;
  territory: string;
  expiration: string | null;
  ownershipPct: number;
  licenseRef: string | null;
  notes: string | null;
};

/** Classified rights — composition rights vs. recording rights */
export type ClassifiedRights = {
  compositionRights: {
    publishing: RightsRecord[];
    mechanical: RightsRecord[];
  };
  recordingRights: {
    master: RightsRecord[];
    neighboring: RightsRecord[];
  };
  syncRights: RightsRecord[];
  summary: {
    totalCompositionPct: number;
    totalRecordingPct: number;
    compositionOwners: string[];
    recordingOwners: string[];
  };
};

/** Participant in a split sheet */
export type SplitParticipant = {
  name: string;
  role: 'composer' | 'lyricist' | 'producer' | 'mixer' | 'performer' | 'publisher';
  sharePct: number;
  ipiCae: string | null;
  proAffiliation: string | null;
  publishingCompany: string | null;
  territory: string;
};

/** Split sheet — the document defining ownership percentages for a song */
export type SplitSheet = {
  id: string;
  songId: string;
  songTitle: string;
  participants: SplitParticipant[];
  totalPct: number;
  valid: boolean;
  createdAt: string;
  notes: string;
};

/** Territory-level rights matrix */
export type TerritoryMatrix = {
  territories: {
    territory: string;
    masterPct: number;
    masterOwner: string[];
    publishingPct: number;
    publishingOwner: string[];
    mechanicalPct: number;
    mechanicalOwner: string[];
    neighboringPct: number;
    neighboringOwner: string[];
    syncPct: number;
    syncOwner: string[];
    fullyCovered: boolean;
  }[];
  coverageSummary: {
    fullyCoveredCount: number;
    partiallyCoveredCount: number;
    uncoveredCount: number;
    totalTerritories: number;
  };
};

/** One-stop clearance check result */
export type OneStopResult = {
  songId: string;
  oneStop: boolean;
  oneStopOwner: string | null;
  masterPct: number;
  publishingPct: number;
  masterOwners: string[];
  publishingOwners: string[];
  clearanceComplexity: 'simple' | 'moderate' | 'complex';
  estimatedClearanceDays: number;
  notes: string;
};

/** Expiration tracking report */
export type ExpirationReport = {
  totalRecords: number;
  expiringIn30Days: RightsRecord[];
  expiringIn90Days: RightsRecord[];
  alreadyExpired: RightsRecord[];
  perpetualRights: RightsRecord[];
  recommendations: string[];
  generatedAt: string;
};

/** PRO registration data */
export type ProRegistrationData = {
  songId: string;
  songTitle: string;
  splits: {
    participantName: string;
    role: string;
    sharePct: number;
    proAffiliation: string;
    ipiCae: string | null;
  }[];
  pro: string;
  registrationType: 'original' | 'supplemental';
  workId: string;
  registeredAt: string;
  status: 'pending' | 'submitted' | 'registered' | 'rejected';
};

/** Mechanical license registration data */
export type MechanicalRegistrationData = {
  songId: string;
  songTitle: string;
  composer: string[];
  publisher: string | null;
  pro: string | null;
  iswc: string | null;
  registrationAgency: 'MLC' | 'HFA';
  registrationType: 'statutory' | 'voluntary';
  status: 'pending' | 'submitted' | 'registered';
  registeredAt: string;
  notes: string;
};

// ============ INTERNALS ============

const metadataEngine = new MetadataEngine();

function uuid(): string {
  return `re-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

// ============ RIGHTS ENGINE CLASS ============

export class RightsEngine {
  /**
   * Create a rights record with proper classification.
   * Each rights record identifies a specific type of ownership (master, publishing,
   * etc.) for a specific territory. The ownership percentage indicates the share
   * controlled by that owner — it's common for multiple owners to each hold a
   * percentage (e.g., two co-writers each owning 50% of publishing).
   */
  createRightsRecord(input: RightsInput): RightsRecord {
    // Validate ownership percentage
    if (input.ownershipPct < 0 || input.ownershipPct > 100) {
      throw new Error(`Ownership percentage must be between 0 and 100, got ${input.ownershipPct}`);
    }

    // Validate territory format
    if (!input.territory || input.territory.trim() === '') {
      throw new Error('Territory must be specified for rights record');
    }

    // Validate owner
    if (!input.owner || input.owner.trim() === '') {
      throw new Error('Rights owner must be specified');
    }

    const now = new Date().toISOString();
    return {
      id: uuid(),
      catalog_song_id: input.catalogSongId,
      rights_type: input.rightsType,
      owner: input.owner.trim(),
      territory: input.territory.trim(),
      expiration: input.expiration,
      ownership_pct: input.ownershipPct,
      license_ref: input.licenseRef,
      notes: input.notes,
      created_at: now,
      updated_at: now,
    };
  }

  /**
   * Separate composition rights (publishing/mechanical) from recording rights
   * (master/neighboring). This classification is fundamental to music law:
   * - Composition rights protect the underlying song (melody + lyrics) — these
   *   are administered by publishers and registered with PROs.
   * - Recording rights protect the specific audio recording — these are typically
   *   owned by labels and administered by SoundExchange/PPL for neighboring rights.
   * Sync rights require BOTH composition and recording rights clearance.
   */
  classifyRights(rights: RightsRecord[]): ClassifiedRights {
    const publishing = rights.filter((r) => r.rights_type === 'publishing');
    const mechanical = rights.filter((r) => r.rights_type === 'mechanical');
    const master = rights.filter((r) => r.rights_type === 'master');
    const neighboring = rights.filter((r) => r.rights_type === 'neighboring');
    const sync = rights.filter((r) => r.rights_type === 'sync');

    const totalCompositionPct = publishing.reduce((sum, r) => sum + r.ownership_pct, 0);
    const totalRecordingPct = master.reduce((sum, r) => sum + r.ownership_pct, 0);
    const compositionOwners = Array.from(new Set(publishing.map((r) => r.owner)));
    const recordingOwners = Array.from(new Set(master.map((r) => r.owner)));

    return {
      compositionRights: { publishing, mechanical },
      recordingRights: { master, neighboring },
      syncRights: sync,
      summary: {
        totalCompositionPct,
        totalRecordingPct,
        compositionOwners,
        recordingOwners,
      },
    };
  }

  /**
   * Create a split sheet — the contractual document defining ownership percentages.
   * A split sheet is signed by all participants (composers, lyricists, producers,
   * publishers) and specifies each person's share of the song. It's the basis for:
   * - PRO registration (ASCAP/BMI need to know who owns what percentage)
   * - Royalty payments (earnings are divided per split percentages)
   * - Sync licensing (clearance requires knowing all owners and their shares)
   * Split sheets MUST total 100% — any deviation is a legal and financial error.
   */
  createSplitSheet(songId: string, participants: SplitParticipant[], songs?: CatalogSong[]): SplitSheet {
    const now = new Date().toISOString();
    const songTitle = songs?.find((s) => s.id === songId)?.title ?? 'Unknown Song';
    const totalPct = participants.reduce((sum, p) => sum + p.sharePct, 0);
    const valid = totalPct === 100;

    const notes = valid
      ? 'Split sheet valid — all shares total 100%'
      : `Split sheet INVALID — shares total ${totalPct}% instead of 100%. This must be corrected before distribution or sync licensing.`;

    return {
      id: uuid(),
      songId,
      songTitle,
      participants,
      totalPct,
      valid,
      createdAt: now,
      notes,
    };
  }

  /**
   * Validate splits sum to 100%.
   * In the music industry, ALL royalty/recording splits for a song must total exactly
   * 100%. Deviations — even 0.5% — cause payment errors, audit failures, and
   * potential legal disputes. This validation ensures splits are properly configured
   * before they're used for PRO registration, royalty calculations, or sync clearance.
   */
  validateSplits(splits: RoyaltySplit[]): SplitValidationResult {
    return metadataEngine.validateSplitIntegrity(splits);
  }

  /**
   * Build territory-level rights matrix.
   * Creates a comprehensive view of rights coverage across territories, showing
   * ownership percentages and coverage status for each rights type per territory.
   * This is critical for:
   * - Distribution planning (can we distribute in territory X?)
   * - Sync licensing (is the song clearable for territory Y?)
   * - Royalty collection (which organizations collect for territory Z?)
   */
  buildTerritoryMatrix(rights: RightsRecord[], territories: string[]): TerritoryMatrix {
    const territoryData: TerritoryMatrix['territories'] = [];

    // Include territories from rights records that aren't in the requested list
    const allTerritoriesSet = new Set(territories);
    rights.forEach((r) => {
      if (r.territory === 'Worldwide' || r.territory === 'WW') {
        // Worldwide covers all territories
        allTerritoriesSet.add('Worldwide');
      } else {
        allTerritoriesSet.add(r.territory);
      }
    });
    const allTerritories = Array.from(allTerritoriesSet);

    for (const territory of allTerritories) {
      // For Worldwide, include all rights; for specific territories, filter
      const territoryRights = territory === 'Worldwide' || territory === 'WW'
        ? rights
        : rights.filter((r) => r.territory === territory || r.territory === 'Worldwide' || r.territory === 'WW');

      const masterRights = territoryRights.filter((r) => r.rights_type === 'master');
      const pubRights = territoryRights.filter((r) => r.rights_type === 'publishing');
      const mechRights = territoryRights.filter((r) => r.rights_type === 'mechanical');
      const neighRights = territoryRights.filter((r) => r.rights_type === 'neighboring');
      const syncRights = territoryRights.filter((r) => r.rights_type === 'sync');

      const fullyCovered = masterRights.reduce((s, r) => s + r.ownership_pct, 0) >= 100
        && pubRights.reduce((s, r) => s + r.ownership_pct, 0) >= 100;

      territoryData.push({
        territory,
        masterPct: masterRights.reduce((s, r) => s + r.ownership_pct, 0),
        masterOwner: Array.from(new Set(masterRights.map((r) => r.owner))),
        publishingPct: pubRights.reduce((s, r) => s + r.ownership_pct, 0),
        publishingOwner: Array.from(new Set(pubRights.map((r) => r.owner))),
        mechanicalPct: mechRights.reduce((s, r) => s + r.ownership_pct, 0),
        mechanicalOwner: Array.from(new Set(mechRights.map((r) => r.owner))),
        neighboringPct: neighRights.reduce((s, r) => s + r.ownership_pct, 0),
        neighboringOwner: Array.from(new Set(neighRights.map((r) => r.owner))),
        syncPct: syncRights.reduce((s, r) => s + r.ownership_pct, 0),
        syncOwner: Array.from(new Set(syncRights.map((r) => r.owner))),
        fullyCovered,
      });
    }

    const fullyCoveredCount = territoryData.filter((t) => t.fullyCovered).length;
    const partiallyCoveredCount = territoryData.filter((t) => !t.fullyCovered && (t.masterPct > 0 || t.publishingPct > 0)).length;
    const uncoveredCount = territoryData.filter((t) => t.masterPct === 0 && t.publishingPct === 0).length;

    return {
      territories: territoryData,
      coverageSummary: {
        fullyCoveredCount,
        partiallyCoveredCount,
        uncoveredCount,
        totalTerritories: territoryData.length,
      },
    };
  }

  /**
   * Check one-stop clearance — whether a single entity controls both master AND publishing.
   * One-stop clearance is the gold standard for sync licensing. Music supervisors
   * strongly prefer one-stop songs because:
   * - No need to chase multiple rightsholders for approvals
   * - License can be granted in days instead of weeks/months
   * - No risk of a single co-owner blocking the deal
   * - Simpler legal paperwork and lower transaction costs
   */
  checkOneStopClearance(songId: string, rights: RightsRecord[]): OneStopResult {
    const songRights = rights.filter((r) => r.catalog_song_id === songId);

    const masterRights = songRights.filter((r) => r.rights_type === 'master');
    const pubRights = songRights.filter((r) => r.rights_type === 'publishing');

    const masterPct = masterRights.reduce((sum, r) => sum + r.ownership_pct, 0);
    const publishingPct = pubRights.reduce((sum, r) => sum + r.ownership_pct, 0);

    const masterOwners = Array.from(new Set(masterRights.map((r) => r.owner)));
    const publishingOwners = Array.from(new Set(pubRights.map((r) => r.owner)));

    // Check if any master owner also appears in publishing owners
    const overlappingOwner = masterOwners.find((mo) =>
      publishingOwners.some((po) => po === mo || po.startsWith(mo) || mo.startsWith(po))
    );

    const oneStop = !!overlappingOwner && masterPct >= 100 && publishingPct >= 100;

    // Determine clearance complexity
    let complexity: 'simple' | 'moderate' | 'complex';
    let estimatedDays: number;

    if (oneStop) {
      complexity = 'simple';
      estimatedDays = 3;
    } else if (masterPct >= 100 && publishingPct >= 100 && masterOwners.length + publishingOwners.length <= 3) {
      complexity = 'moderate';
      estimatedDays = 14;
    } else {
      complexity = 'complex';
      estimatedDays = 30;
    }

    const notes = oneStop
      ? `One-stop clearance available: ${overlappingOwner} controls both master (${masterPct}%) and publishing (${publishingPct}%).`
      : `Not one-stop: ${masterOwners.length} master owner(s) and ${publishingOwners.length} publishing owner(s). Requires ${complexity === 'moderate' ? '2-3' : '4+'} approvals.`;

    return {
      songId,
      oneStop,
      oneStopOwner: overlappingOwner ?? null,
      masterPct,
      publishingPct,
      masterOwners,
      publishingOwners,
      clearanceComplexity: complexity,
      estimatedClearanceDays: estimatedDays,
      notes,
    };
  }

  /**
   * Track rights expiration dates.
   * Rights records can have expiration dates (e.g., a 5-year sync license).
   * Expired rights create gaps in territory coverage that can block distribution
   * and sync licensing. This report identifies:
   * - Rights expiring within 30 days (immediate action required)
   * - Rights expiring within 90 days (renewal planning needed)
   * - Already expired rights (immediate coverage gap)
   * - Perpetual rights (no expiration — permanent ownership)
   */
  trackExpirations(rights: RightsRecord[]): ExpirationReport {
    const now = new Date();
    const thirtyDays = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    const ninetyDays = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);

    const expiringIn30 = rights.filter((r) => {
      if (!r.expiration) return false;
      const expDate = new Date(r.expiration);
      return expDate > now && expDate <= thirtyDays;
    });

    const expiringIn90 = rights.filter((r) => {
      if (!r.expiration) return false;
      const expDate = new Date(r.expiration);
      return expDate > thirtyDays && expDate <= ninetyDays;
    });

    const alreadyExpired = rights.filter((r) => {
      if (!r.expiration) return false;
      return new Date(r.expiration) <= now;
    });

    const perpetual = rights.filter((r) => r.expiration === null);

    const recommendations: string[] = [];
    if (alreadyExpired.length > 0) {
      recommendations.push(`URGENT: ${alreadyExpired.length} rights already expired — territory coverage gaps exist`);
      alreadyExpired.forEach((r) =>
        recommendations.push(`  - ${r.rights_type} in ${r.territory} owned by ${r.owner} expired on ${r.expiration}`)
      );
    }
    if (expiringIn30.length > 0) {
      recommendations.push(`${expiringIn30.length} rights expiring within 30 days — initiate renewal negotiations immediately`);
    }
    if (expiringIn90.length > 0) {
      recommendations.push(`${expiringIn90.length} rights expiring within 90 days — plan renewal strategy`);
    }

    return {
      totalRecords: rights.length,
      expiringIn30Days: expiringIn30,
      expiringIn90Days: expiringIn90,
      alreadyExpired: alreadyExpired,
      perpetualRights: perpetual,
      recommendations,
      generatedAt: now.toISOString(),
    };
  }

  /**
   * Generate PRO (Performing Rights Organization) registration data.
   * PROs (ASCAP, BMI, SESAC in the US; GEMA in Germany; PRS in the UK; JASRAC in Japan)
   * collect performance royalties for public performances of compositions (radio, TV,
   * live concerts, streaming). Each writer/publisher must register their shares with
   * their affiliated PRO. The registration includes:
   * - Work title and ISWC
   * - Each writer's share percentage and IPI/CAE number
   * - Each publisher's share percentage
   * - PRO affiliation per participant
   */
  generateProRegistration(songId: string, splits: RoyaltySplit[], songs?: CatalogSong[]): ProRegistrationData {
    const song = songs?.find((s) => s.id === songId);
    const proAffiliations = splits.map((s) => s.pro ?? 'Unknown');
    const primaryPro = proAffiliations.find((p) => p !== 'Unknown') ?? 'ASCAP';

    const registrationSplits = splits.map((s) => ({
      participantName: s.participant_name,
      role: s.participant_role,
      sharePct: s.share_pct,
      proAffiliation: s.pro ?? 'Unaffiliated',
      ipiCae: s.ipi_cae,
    }));

    return {
      songId,
      songTitle: song?.title ?? 'Unknown',
      splits: registrationSplits,
      pro: primaryPro,
      registrationType: 'original',
      workId: `PRO-${uuid()}`,
      registeredAt: new Date().toISOString(),
      status: 'pending',
    };
  }

  /**
   * Generate mechanical license registration data.
   * Mechanical licenses authorize the reproduction of a composition in physical/digital
   * format (CDs, downloads, streams). In the US, this is administered by:
   * - The MLC (Mechanical Licensing Collective): Handles blanket mechanical licenses
   *   for streaming under the Music Modernization Act (MMA 2018).
   * - HFA (Harry Fox Agency): Handles voluntary mechanical licenses for physical/digital.
   *
   * Registration includes:
   * - Composition title and ISWC
   * - Composer and publisher information
   * - PRO affiliation for identification
   * - Registration agency (MLC or HFA)
   * - Type of license (statutory = compulsory, voluntary = negotiated)
   */
  generateMechanicalRegistration(songId: string, songs?: CatalogSong[]): MechanicalRegistrationData {
    const song = songs?.find((s) => s.id === songId);

    return {
      songId,
      songTitle: song?.title ?? 'Unknown',
      composer: song?.composer ?? [],
      publisher: song?.publishing_owner ?? null,
      pro: song?.pro ?? null,
      iswc: song?.iswc ?? null,
      registrationAgency: 'MLC',
      registrationType: 'statutory',
      status: 'pending',
      registeredAt: new Date().toISOString(),
      notes: `Statutory mechanical license registration via The MLC for "${song?.title ?? 'Unknown'}". US compulsory rate applies under MMA 2018.`,
    };
  }
}

/** Export singleton instance */
export const rightsEngine = new RightsEngine();
