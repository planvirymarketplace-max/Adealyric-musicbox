/**
 * Royalty Calculation Engine — Service layer for computing, aggregating, and
 * managing music royalty payments.
 *
 * Royalties are the primary revenue mechanism in the music industry. This engine
 * handles multiple royalty types:
 *
 * - Streaming Royalties: Per-stream payments from DSPs (Spotify ~$0.003-0.005/stream,
 *   Apple Music ~$0.01/stream). Amounts vary wildly by DSP, territory, and subscription tier.
 * - Mechanical Royalties: US statutory rate of 9.1¢ per song (under 5 min) per physical/digital
 *   copy. Paid to songwriters/publishers via HFA or The MLC (Mechanical Licensing Collective).
 * - Sync Pass-Through: When a sync license fee is earned, it passes through to participants
 *   per their royalty split percentages.
 * - Recoupment: Labels recoup advances before paying artist royalties. The engine calculates
 *   whether an artist is "in the red" (unrecouped) or "in the green" (recouped, earning payments).
 * - Tax Withholding: 30% withholding for non-US recipients per IRS requirements, reduced
 *   by tax treaties for specific countries.
 *
 * Key calculations:
 * - Split payments: Total revenue × participant share percentage = individual payment
 * - Per-stream rate: Total revenue ÷ total streams = effective per-stream rate
 * - Mechanical rate: Fixed statutory rate × number of units/streams
 */

import type { RoyaltyStatement, RoyaltySplit } from '@/types/database';
import { MetadataEngine } from '@/lib/metadata-engine';

// ============ EXPORTED TYPES ============

/** Per-split payment calculation result */
export type SplitPaymentResult = {
  totalRevenueCents: number;
  currency: string;
  payments: {
    participantName: string;
    participantRole: string;
    sharePct: number;
    paymentCents: number;
    proAffiliation: string | null;
    ipiCae: string | null;
  }[];
  residualCents: number; // Rounding remainder
  splitValid: boolean;
  splitErrors: string[];
};

/** Per-stream rate calculation per DSP */
export type PerStreamRate = {
  dspSource: string;
  period: string;
  totalStreams: number;
  totalRevenueCents: number;
  effectivePerStreamCents: number;
  currency: string;
  breakdown: {
    freeTierStreams: number;
    freeTierRateCents: number;
    premiumTierStreams: number;
    premiumTierRateCents: number;
  };
};

/** Royalty aggregation across DSPs per song */
export type SongRoyaltyAggregate = {
  songId: string;
  totalStreams: number;
  totalRevenueCents: number;
  currency: string;
  perStreamRateCents: number;
  byDsp: { dsp: string; streams: number; revenueCents: number }[];
  byPeriod: { period: string; streams: number; revenueCents: number }[];
  topDsp: string;
  growthPct: number;
};

/** Import result for DSP royalty report parsing */
export type ImportResult = {
  success: boolean;
  rowsImported: number;
  rowsSkipped: number;
  errors: string[];
  warnings: string[];
  importedAt: string;
};

/** Mechanical royalty calculation result */
export type MechanicalRoyaltyResult = {
  streams: number;
  songDurationSeconds: number;
  statutoryRateCents: number;
  totalMechanicalCents: number;
  rateType: 'statutory' | 'negotiated';
  notes: string;
};

/** Sync royalty pass-through calculation */
export type SyncPassThroughResult = {
  syncFeeCents: number;
  currency: string;
  payments: {
    participantName: string;
    participantRole: string;
    sharePct: number;
    paymentCents: number;
  }[];
  totalAllocatedCents: number;
  unallocatedCents: number;
};

/** Recoupment calculation result */
export type RecoupmentResult = {
  artistAdvancesCents: number;
  totalEarningsCents: number;
  recouped: boolean;
  remainingBalanceCents: number;
  artistPaymentCents: number;
  labelKeepCents: number;
  recoupmentPct: number;
  notes: string;
};

/** Tax withholding calculation */
export type TaxWithholdingResult = {
  grossAmountCents: number;
  recipientCountry: string;
  isUSResident: boolean;
  withholdingRatePct: number;
  withholdingAmountCents: number;
  netPaymentCents: number;
  treatyBenefit: boolean;
  treatyRatePct: number | null;
  notes: string;
};

/** Royalty period specification */
export type RoyaltyPeriod = {
  startDate: string;
  endDate: string;
  periodLabel: string;
};

/** Generated royalty statement */
export type GeneratedStatement = {
  id: string;
  artistId: string;
  period: RoyaltyPeriod;
  totalEarningsCents: number;
  currency: string;
  lineItems: { source: string; streams: number; revenueCents: number; perStreamCents: number }[];
  splitPayments: { participantName: string; role: string; sharePct: number; amountCents: number }[];
  recoupmentStatus: RecoupmentResult;
  withholdingStatus: TaxWithholdingResult;
  generatedAt: string;
};

// ============ INTERNALS ============

const metadataEngine = new MetadataEngine();

function uuid(): string {
  return `re-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * US tax treaty rates by country (simplified — actual treaty rates vary).
 * These represent reduced withholding rates for royalty payments to non-US residents
 * who are eligible for treaty benefits.
 */
const TAX_TREATY_RATES: Record<string, number> = {
  GB: 0, DE: 0, FR: 0, CA: 10, JP: 10, AU: 5, NL: 0, SE: 0,
  IT: 0, ES: 5, KR: 10, BR: 15, MX: 10, IN: 15, ZA: 0,
};

// ============ ROYALTY ENGINE CLASS ============

export class RoyaltyEngine {
  /**
   * Calculate per-split payments from a royalty statement.
   * Each participant receives their contractual share percentage of total revenue.
   * The split must total exactly 100% — any deviation indicates a contractual error.
   * Rounding residuals (cents that don't distribute evenly) are tracked separately.
   */
  calculateSplitPayments(statement: RoyaltyStatement, splits: RoyaltySplit[]): SplitPaymentResult {
    const splitValidation = metadataEngine.validateSplitIntegrity(splits);

    const payments = splits.map((split) => {
      const paymentCents = Math.floor(statement.total_revenue_cents * (split.share_pct / 100));
      return {
        participantName: split.participant_name,
        participantRole: split.participant_role,
        sharePct: split.share_pct,
        paymentCents,
        proAffiliation: split.pro,
        ipiCae: split.ipi_cae,
      };
    });

    const totalAllocated = payments.reduce((sum, p) => sum + p.paymentCents, 0);
    const residualCents = statement.total_revenue_cents - totalAllocated;

    return {
      totalRevenueCents: statement.total_revenue_cents,
      currency: statement.currency,
      payments,
      residualCents,
      splitValid: splitValidation.valid,
      splitErrors: splitValidation.errors,
    };
  }

  /**
   * Calculate effective per-stream rate per DSP.
   * DSPs pay different rates based on subscription tier (free vs. premium),
   * territory, and the platform's own revenue model. The effective per-stream
   * rate is the average revenue per stream across all tiers for a given period.
   */
  calculatePerStreamRate(statement: RoyaltyStatement): PerStreamRate {
    const effectiveRate = statement.total_streams > 0
      ? statement.total_revenue_cents / statement.total_streams
      : 0;

    // Estimate tier breakdown (industry averages: ~30% free tier, ~70% premium)
    const freeTierStreams = Math.floor(statement.total_streams * 0.3);
    const premiumTierStreams = statement.total_streams - freeTierStreams;

    // Free tier typically pays ~1/5 of premium tier rate
    const premiumRate = effectiveRate > 0 ? effectiveRate * 1.3 : 0;
    const freeRate = effectiveRate > 0 ? effectiveRate * 0.3 : 0;

    return {
      dspSource: statement.dsp_source,
      period: statement.period,
      totalStreams: statement.total_streams,
      totalRevenueCents: statement.total_revenue_cents,
      effectivePerStreamCents: Math.round(effectiveRate * 100) / 100,
      currency: statement.currency,
      breakdown: {
        freeTierStreams,
        freeTierRateCents: Math.round(freeRate * 100) / 100,
        premiumTierStreams,
        premiumTierRateCents: Math.round(premiumRate * 100) / 100,
      },
    };
  }

  /**
   * Aggregate royalties across DSPs per song.
   * Combines multiple royalty statements to show total earnings, stream counts,
   * and per-stream rates across all platforms. Identifies the top-performing DSP
   * and calculates period-over-period growth.
   */
  aggregateBySong(statements: RoyaltyStatement[]): SongRoyaltyAggregate {
    if (statements.length === 0) {
      return {
        songId: '',
        totalStreams: 0,
        totalRevenueCents: 0,
        currency: 'USD',
        perStreamRateCents: 0,
        byDsp: [],
        byPeriod: [],
        topDsp: '',
        growthPct: 0,
      };
    }

    const totalStreams = statements.reduce((sum, s) => sum + s.total_streams, 0);
    const totalRevenue = statements.reduce((sum, s) => sum + s.total_revenue_cents, 0);
    const perStreamRate = totalStreams > 0 ? totalRevenue / totalStreams : 0;

    // Group by DSP
    const dspMap: Record<string, { streams: number; revenueCents: number }> = {};
    for (const s of statements) {
      if (!dspMap[s.dsp_source]) dspMap[s.dsp_source] = { streams: 0, revenueCents: 0 };
      dspMap[s.dsp_source].streams += s.total_streams;
      dspMap[s.dsp_source].revenueCents += s.total_revenue_cents;
    }
    const byDsp = Object.entries(dspMap).map(([dsp, data]) => ({ dsp, ...data }));
    const topDsp = byDsp.reduce((best, cur) => cur.revenueCents > best.revenueCents ? cur : best, byDsp[0])?.dsp ?? '';

    // Group by period
    const periodMap: Record<string, { streams: number; revenueCents: number }> = {};
    for (const s of statements) {
      if (!periodMap[s.period]) periodMap[s.period] = { streams: 0, revenueCents: 0 };
      periodMap[s.period].streams += s.total_streams;
      periodMap[s.period].revenueCents += s.total_revenue_cents;
    }
    const byPeriod = Object.entries(periodMap).map(([period, data]) => ({ period, ...data }))
      .sort((a, b) => a.period.localeCompare(b.period));

    // Calculate growth (compare last two periods)
    let growthPct = 0;
    if (byPeriod.length >= 2) {
      const prev = byPeriod[byPeriod.length - 2].revenueCents;
      const curr = byPeriod[byPeriod.length - 1].revenueCents;
      growthPct = prev > 0 ? ((curr - prev) / prev) * 100 : 0;
    }

    return {
      songId: '',
      totalStreams,
      totalRevenueCents: totalRevenue,
      currency: statements[0].currency,
      perStreamRateCents: Math.round(perStreamRate * 100) / 100,
      byDsp,
      byPeriod,
      topDsp,
      growthPct: Math.round(growthPct * 100) / 100,
    };
  }

  /**
   * Import DSP royalty report (CSV/XLSX parsing).
   * DSPs deliver royalty data in various formats (CSV, XLSX, proprietary).
   * This method provides a framework for parsing and importing those reports.
   * Actual parsing would use a CSV/XLSX library in production.
   */
  importRoyaltyReport(dataSource: string, fileData: Buffer): ImportResult {
    // In production, this would parse the actual CSV/XLSX data
    // For now, return a structured result indicating the import framework
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!dataSource) {
      errors.push('Data source must be specified (e.g., "spotify", "apple-music")');
    }

    if (fileData.length === 0) {
      errors.push('File data is empty — no rows to import');
    }

    // Validate data source is a known DSP
    const knownDsps = ['spotify', 'apple-music', 'amazon-music', 'tiktok', 'youtube', 'deezer', 'pandora', 'tidal'];
    if (!knownDsps.includes(dataSource.toLowerCase())) {
      warnings.push(`Unknown DSP source "${dataSource}" — import format may not be recognized`);
    }

    return {
      success: errors.length === 0,
      rowsImported: 0, // Would be populated from actual parsing
      rowsSkipped: 0,
      errors,
      warnings,
      importedAt: new Date().toISOString(),
    };
  }

  /**
   * Calculate mechanical royalties.
   * The US statutory mechanical royalty rate is set by law:
   * - 9.1 cents per song for songs under 5 minutes
   * - 1.75 cents per minute or fraction thereof for songs over 5 minutes
   * This rate applies to both physical copies (CDs, vinyl) and digital downloads.
   * For streaming, mechanical royalties are collected by The MLC (Mechanical Licensing Collective)
   * under the Music Modernization Act (MMA) of 2018.
   */
  calculateMechanicalRoyalty(streams: number, songDuration: number): MechanicalRoyaltyResult {
    // US statutory rate: 9.1¢ per song under 5 min, 1.75¢ per minute over 5 min
    const STATUTORY_RATE_UNDER_5MIN_CENTS = 9.1;
    const STATUTORY_RATE_PER_MIN_CENTS = 1.75;

    let statutoryRateCents: number;
    let notes: string;

    if (songDuration <= 300) { // Under 5 minutes
      statutoryRateCents = STATUTORY_RATE_UNDER_5MIN_CENTS;
      notes = `Statutory rate: ${STATUTORY_RATE_UNDER_5MIN_CENTS}¢ per song (${songDuration}s < 5 min threshold)`;
    } else {
      // Over 5 minutes: 1.75¢ per minute (rounded up to next minute)
      const minutes = Math.ceil(songDuration / 60);
      statutoryRateCents = minutes * STATUTORY_RATE_PER_MIN_CENTS;
      notes = `Statutory rate: ${STATUTORY_RATE_PER_MIN_CENTS}¢ × ${minutes} min = ${statutoryRateCents.toFixed(2)}¢ (${songDuration}s > 5 min)`;
    }

    const totalMechanicalCents = Math.round(streams * statutoryRateCents);

    return {
      streams,
      songDurationSeconds: songDuration,
      statutoryRateCents,
      totalMechanicalCents,
      rateType: 'statutory',
      notes,
    };
  }

  /**
   * Calculate sync royalty pass-through.
   * When a sync license fee is earned (e.g., $10,000 for a film placement), the fee
   * is distributed to all participants per their royalty split percentages. This is
   * called "pass-through" because the fee passes through the label/rights holder to
   * the individual participants. Sync fees are typically split 50/50 between master
   * and publishing sides, then further divided per splits within each side.
   */
  calculateSyncPassThrough(syncFeeCents: number, splits: RoyaltySplit[]): SyncPassThroughResult {
    const payments = splits.map((split) => {
      const paymentCents = Math.floor(syncFeeCents * (split.share_pct / 100));
      return {
        participantName: split.participant_name,
        participantRole: split.participant_role,
        sharePct: split.share_pct,
        paymentCents,
      };
    });

    const totalAllocated = payments.reduce((sum, p) => sum + p.paymentCents, 0);
    const unallocatedCents = syncFeeCents - totalAllocated;

    return {
      syncFeeCents,
      currency: 'USD',
      payments,
      totalAllocatedCents: totalAllocated,
      unallocatedCents,
    };
  }

  /**
   * Calculate recoupment (holdback) before artist payment.
   * In the music industry, labels typically advance money to artists for recording,
   * marketing, and touring costs. These advances are recouped (recovered) from the
   * artist's royalty earnings before any payments are made to the artist.
   * An artist is "unrecouped" when their advances exceed their earnings — they receive
   * no payments until the label has recovered the full advance amount.
   */
  calculateRecoupment(artistAdvancesCents: number, totalEarningsCents: number): RecoupmentResult {
    const recouped = totalEarningsCents >= artistAdvancesCents;
    const remainingBalance = recouped ? 0 : artistAdvancesCents - totalEarningsCents;
    const recoupmentPct = artistAdvancesCents > 0
      ? Math.min((totalEarningsCents / artistAdvancesCents) * 100, 100)
      : 0;

    // If recouped: artist gets earnings minus advances; label keeps nothing extra
    // If unrecouped: artist gets nothing; label keeps all earnings toward recoupment
    const artistPayment = recouped ? totalEarningsCents - artistAdvancesCents : 0;
    const labelKeep = recouped ? 0 : totalEarningsCents;

    const notes = recouped
      ? `Fully recouped. Artist receives $${(artistPayment / 100).toFixed(2)} after $${(artistAdvancesCents / 100).toFixed(2)} advance recovery.`
      : `Unrecouped: $${(remainingBalance / 100).toFixed(2)} remaining balance. All earnings applied to advance recovery. Artist receives $0.`;

    return {
      artistAdvancesCents,
      totalEarningsCents,
      recouped,
      remainingBalanceCents: remainingBalance,
      artistPaymentCents: artistPayment,
      labelKeepCents: labelKeep,
      recoupmentPct: Math.round(recoupmentPct * 100) / 100,
      notes,
    };
  }

  /**
   * Calculate tax withholding for royalty payments.
   * The US requires 30% withholding on royalty payments to non-US recipients,
   * per IRS Section 1442. However, tax treaties between the US and many countries
   * reduce or eliminate this withholding. For example:
   * - UK/DE/FR: 0% withholding (full treaty benefit)
   * - Canada/Japan: 10% withholding
   * - Brazil/India: 15% withholding
   * US residents are subject to standard income tax reporting, not withholding.
   */
  calculateTaxWithholding(amountCents: number, recipientCountry: string, isUSResident: boolean): TaxWithholdingResult {
    const STANDARD_RATE = 30;
    const treatyRate = TAX_TREATY_RATES[recipientCountry.toUpperCase()] ?? null;
    const treatyBenefit = treatyRate !== null && treatyRate < STANDARD_RATE;

    const withholdingRatePct = isUSResident ? 0 : (treatyBenefit ? treatyRate! : STANDARD_RATE);
    const withholdingAmount = Math.floor(amountCents * (withholdingRatePct / 100));
    const netPayment = amountCents - withholdingAmount;

    const notes = isUSResident
      ? 'US resident — no withholding required. Subject to standard income tax reporting (W-2/1099).'
      : treatyBenefit
        ? `Non-US resident (${recipientCountry}) — treaty rate of ${treatyRate}% applied instead of standard 30%. Submit Form W-8BEN to claim treaty benefit.`
        : `Non-US resident (${recipientCountry}) — standard 30% withholding applied. No tax treaty benefit available. Submit Form W-8BEN for identification.`;

    return {
      grossAmountCents: amountCents,
      recipientCountry,
      isUSResident,
      withholdingRatePct,
      withholdingAmountCents: withholdingAmount,
      netPaymentCents: netPayment,
      treatyBenefit,
      treatyRatePct: treatyRate,
      notes,
    };
  }

  /**
   * Generate a royalty statement for a period.
   * Combines all royalty data for an artist across DSPs, calculates split payments,
   * recoupment status, and tax withholding to produce a comprehensive statement.
   */
  generateStatement(artistId: string, period: RoyaltyPeriod, statements?: RoyaltyStatement[], splits?: RoyaltySplit[]): GeneratedStatement {
    const allStatements = statements ?? [];
    const allSplits = splits ?? [];
    const now = new Date().toISOString();

    const totalEarnings = allStatements.reduce((sum, s) => sum + s.total_revenue_cents, 0);

    const lineItems = allStatements.map((s) => {
      const perStream = s.total_streams > 0 ? s.total_revenue_cents / s.total_streams : 0;
      return {
        source: s.dsp_source,
        streams: s.total_streams,
        revenueCents: s.total_revenue_cents,
        perStreamCents: Math.round(perStream * 100) / 100,
      };
    });

    const splitPayments = allSplits.map((s) => ({
      participantName: s.participant_name,
      role: s.participant_role,
      sharePct: s.share_pct,
      amountCents: Math.floor(totalEarnings * (s.share_pct / 100)),
    }));

    // Assume zero advances for default recoupment calculation
    const recoupmentStatus = this.calculateRecoupment(0, totalEarnings);

    // Default to US resident withholding
    const withholdingStatus = this.calculateTaxWithholding(totalEarnings, 'US', true);

    return {
      id: uuid(),
      artistId,
      period,
      totalEarningsCents: totalEarnings,
      currency: allStatements.length > 0 ? allStatements[0].currency : 'USD',
      lineItems,
      splitPayments,
      recoupmentStatus,
      withholdingStatus,
      generatedAt: now,
    };
  }
}

/** Export singleton instance */
export const royaltyEngine = new RoyaltyEngine();
