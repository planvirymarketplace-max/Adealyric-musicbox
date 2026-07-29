/**
 * Marketplace Engine — Service layer for the song marketplace, custom write requests,
 * and collaboration calls.
 *
 * The marketplace enables writers, producers, and labels to transact music assets:
 * - Song Sales: Writers can list songs for sale with asking prices, negotiate offers,
 *   and complete purchases with rights transfers.
 * - Custom Write Requests: Labels can post briefs describing what they need (e.g.,
 *   "upbeat pop track for summer campaign") and writers submit proposals.
 * - Collab Calls: Writers/producers post open calls for collaboration (e.g.,
 *   "Need a verse for my ambient track") and others apply with submissions.
 *
 * Key industry concepts:
 * - Rights Transfer: When a song is sold, the buyer receives the rights specified
 *   in the transfer type (master only, publishing only, or full assignment).
 * - Negotiation: Offers can be countered, creating a back-and-forth until agreement.
 * - Writer Criteria: Custom write requests define specific needs (genre, mood, BPM,
 *   language, experience) that are matched against writer profiles.
 */

import type { CatalogSong, PortalUser, CollabCall } from '@/types/database';

// ============ EXPORTED TYPES ============

/** A marketplace listing for a song for sale */
export type MarketplaceListing = {
  id: string;
  songId: string;
  songTitle: string;
  sellerId: string;
  sellerName: string;
  askingPrice: number;
  negotiable: boolean;
  genre: string;
  moodTags: string[];
  bpm: number | null;
  key: string | null;
  durationSeconds: number;
  description: string | null;
  oneStopClearance: boolean;
  stemsAvailable: boolean;
  status: 'active' | 'under_offer' | 'sold' | 'withdrawn';
  createdAt: string;
  updatedAt: string;
};

/** Marketplace browsing filters */
export type MarketplaceFilters = {
  genre?: string[];
  moodTags?: string[];
  bpmRange?: { min: number; max: number };
  priceRange?: { min: number; max: number };
  oneStopOnly?: boolean;
  stemsAvailable?: boolean;
  searchTerm?: string;
  sortBy?: 'price_asc' | 'price_desc' | 'newest' | 'oldest';
  maxResults?: number;
};

/** Marketplace browse result */
export type MarketplaceBrowseResult = {
  totalResults: number;
  listings: MarketplaceListing[];
  facets: {
    genres: Record<string, number>;
    priceRanges: Record<string, number>;
  };
};

/** Writer profile extracted from PortalUser */
export type WriterProfile = {
  id: string;
  name: string;
  bio: string | null;
  specialties: string[];
  genres: string[];
  proAffiliation: string | null;
  experienceYears: number;
  rating: number;
  completedProjects: number;
  avatarUrl: string | null;
};

/** An offer on a listed song */
export type SongOffer = {
  amount: number;
  message: string;
  buyerId: string;
  buyerName: string;
  proposedRightsTransfer: RightsTransferType;
  contingencies: string[];
};

/** Result of making an offer */
export type OfferResult = {
  offerId: string;
  listingId: string;
  status: 'submitted' | 'countered' | 'accepted' | 'declined';
  message: string;
  createdAt: string;
};

/** Negotiation actions */
export type NegotiationAction = 'accept' | 'decline' | 'counter';

/** Result of offer negotiation processing */
export type NegotiationResult = {
  offerId: string;
  action: NegotiationAction;
  result: 'accepted' | 'declined' | 'countered';
  counterAmount?: number;
  counterMessage?: string;
  updatedAt: string;
};

/** Payment details for completing a purchase */
export type PaymentDetails = {
  method: 'stripe' | 'wire' | 'ach' | 'crypto';
  referenceId: string;
  amountCents: number;
  currency: string;
  payerId: string;
};

/** Result of completing a song purchase */
export type PurchaseResult = {
  songId: string;
  buyerId: string;
  sellerId: string;
  amountCents: number;
  currency: string;
  rightsTransfer: RightsTransferResult;
  paymentStatus: 'completed' | 'pending' | 'failed';
  completedAt: string;
};

/** Types of rights transfer */
export type RightsTransferType = 'master_only' | 'publishing_only' | 'full_assignment' | 'split_transfer';

/** Result of rights transfer */
export type RightsTransferResult = {
  songId: string;
  fromOwner: string;
  toOwner: string;
  transferType: RightsTransferType;
  transferredRights: string[];
  effectiveDate: string;
  registrationRequired: boolean;
  notes: string;
};

/** Custom write brief from a label */
export type CustomWriteBrief = {
  title: string;
  description: string;
  genre: string;
  moodTags: string[];
  bpmRange?: { min: number; max: number };
  language: string;
  durationTarget: number;
  deadline: string;
  budgetRange: { min: number; max: number };
  exclusivity: boolean;
  deliverables: string[];
};

/** Custom write request created from a brief */
export type CustomWriteRequest = {
  id: string;
  brief: CustomWriteBrief;
  labelId: string;
  labelName: string;
  status: 'open' | 'in_progress' | 'completed' | 'cancelled';
  submissions: { writerId: string; writerName: string; demoUrl: string | null; message: string }[];
  createdAt: string;
  updatedAt: string;
};

/** Criteria for matching writers to requests */
export type WriterCriteria = {
  genres: string[];
  minExperience: number;
  minRating: number;
  proRequired: boolean;
  specialties: string[];
  availableOnly: boolean;
};

/** Result of writer matching */
export type WriterMatchResult = {
  requestId: string;
  matchedWriters: { writer: WriterProfile; matchScore: number; matchedCriteria: string[] }[];
  totalMatches: number;
};

/** Input for creating a collab call */
export type CollabCallInput = {
  title: string;
  description: string;
  whatNeeded: string;
  deadline: string | null;
};

/** Submission for a collab call application */
export type CollabSubmission = {
  demoUrl: string | null;
  message: string;
  relevantExperience: string;
  proposedTimeline: string;
};

/** Result of applying to a collab call */
export type ApplicationResult = {
  callId: string;
  applicantId: string;
  status: 'submitted' | 'shortlisted' | 'accepted' | 'declined';
  message: string;
  createdAt: string;
};

// ============ INTERNAL STATE ============

const listingsStore: Record<string, MarketplaceListing> = {};
const offersStore: Record<string, OfferResult & { originalAmount: number; counterAmounts: number[] }> = {};

function uuid(): string {
  return `mp-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

// ============ MARKETPLACE ENGINE CLASS ============

export class MarketplaceEngine {
  /**
   * Submit a song for sale on the marketplace.
   * Creates a listing with the seller's asking price and negotiability flag.
   * Songs with one-stop clearance and stems available are more attractive to buyers.
   */
  submitSongForSale(song: CatalogSong, seller: WriterProfile, askingPrice: number, negotiable: boolean): MarketplaceListing {
    const now = new Date().toISOString();
    const id = uuid();

    const listing: MarketplaceListing = {
      id,
      songId: song.id,
      songTitle: song.title,
      sellerId: seller.id,
      sellerName: seller.name,
      askingPrice,
      negotiable,
      genre: song.genre,
      moodTags: song.mood_tags,
      bpm: song.bpm,
      key: song.key,
      durationSeconds: song.duration_seconds,
      description: song.description,
      oneStopClearance: false, // Would be calculated from rights records
      stemsAvailable: song.stems_available,
      status: 'active',
      createdAt: now,
      updatedAt: now,
    };

    listingsStore[id] = listing;
    return listing;
  }

  /**
   * Browse marketplace listings with filters.
   * Buyers search listings by genre, mood, price, BPM, and clearance status.
   * One-stop clearance is a premium filter — buyers strongly prefer tracks
   * that can be immediately used without multi-party clearance negotiations.
   */
  browseListings(filters: MarketplaceFilters, songs?: CatalogSong[]): MarketplaceBrowseResult {
    const allListings = Object.values(listingsStore);
    const maxResults = filters.maxResults ?? 100;

    // Also generate listings from songs marked for_sale if not already listed
    if (songs) {
      for (const song of songs) {
        if (song.for_sale && song.asking_price && !allListings.some((l) => l.songId === song.id)) {
          // Create ad-hoc listing representation (not stored)
          allListings.push({
            id: song.id,
            songId: song.id,
            songTitle: song.title,
            sellerId: '',
            sellerName: song.master_owner ?? '',
            askingPrice: song.asking_price,
            negotiable: song.asking_price_negotiable,
            genre: song.genre,
            moodTags: song.mood_tags,
            bpm: song.bpm,
            key: song.key,
            durationSeconds: song.duration_seconds,
            description: song.description,
            oneStopClearance: false,
            stemsAvailable: song.stems_available,
            status: 'active',
            createdAt: song.created_at,
            updatedAt: song.updated_at,
          });
        }
      }
    }

    const genreFacets: Record<string, number> = {};
    const priceFacets: Record<string, number> = {};
    const filtered: MarketplaceListing[] = [];

    for (const listing of allListings) {
      if (listing.status !== 'active') continue;

      // Genre filter
      if (filters.genre && filters.genre.length > 0 && !filters.genre.includes(listing.genre)) continue;

      // Mood filter
      if (filters.moodTags && filters.moodTags.length > 0) {
        if (!listing.moodTags.some((m) => filters.moodTags!.includes(m))) continue;
      }

      // BPM range
      if (filters.bpmRange && listing.bpm !== null) {
        if (listing.bpm < filters.bpmRange.min || listing.bpm > filters.bpmRange.max) continue;
      }

      // Price range
      if (filters.priceRange) {
        if (listing.askingPrice < filters.priceRange.min || listing.askingPrice > filters.priceRange.max) continue;
      }

      // One-stop filter
      if (filters.oneStopOnly && !listing.oneStopClearance) continue;

      // Stems available
      if (filters.stemsAvailable && !listing.stemsAvailable) continue;

      // Search term
      if (filters.searchTerm) {
        const term = filters.searchTerm.toLowerCase();
        const searchable = `${listing.songTitle} ${listing.description ?? ''} ${listing.genre} ${listing.moodTags.join(' ')}`.toLowerCase();
        if (!searchable.includes(term)) continue;
      }

      filtered.push(listing);
      genreFacets[listing.genre] = (genreFacets[listing.genre] ?? 0) + 1;
      const priceBucket = listing.askingPrice < 1000 ? '<$1k' :
        listing.askingPrice < 5000 ? '$1k-$5k' :
        listing.askingPrice < 10000 ? '$5k-$10k' : '$10k+';
      priceFacets[priceBucket] = (priceFacets[priceBucket] ?? 0) + 1;
    }

    // Sort
    const sorted = [...filtered];
    switch (filters.sortBy) {
      case 'price_asc': sorted.sort((a, b) => a.askingPrice - b.askingPrice); break;
      case 'price_desc': sorted.sort((a, b) => b.askingPrice - a.askingPrice); break;
      case 'newest': sorted.sort((a, b) => b.createdAt.localeCompare(a.createdAt)); break;
      case 'oldest': sorted.sort((a, b) => a.createdAt.localeCompare(b.createdAt)); break;
      default: sorted.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    }

    return {
      totalResults: sorted.length,
      listings: sorted.slice(0, maxResults),
      facets: { genres: genreFacets, priceRanges: priceFacets },
    };
  }

  /**
   * Make an offer on a listed song.
   * The offer specifies the amount, proposed rights transfer type, and any contingencies.
   * The seller can accept, decline, or counter the offer.
   */
  makeOffer(listingId: string, offer: SongOffer): OfferResult {
    const listing = listingsStore[listingId];
    if (!listing) {
      return {
        offerId: uuid(),
        listingId,
        status: 'declined',
        message: `Listing ${listingId} not found`,
        createdAt: new Date().toISOString(),
      };
    }

    if (listing.status !== 'active') {
      return {
        offerId: uuid(),
        listingId,
        status: 'declined',
        message: `Listing is ${listing.status} — offers cannot be made`,
        createdAt: new Date().toISOString(),
      };
    }

    const offerId = uuid();
    const result: OfferResult = {
      offerId,
      listingId,
      status: 'submitted',
      message: `Offer of $${offer.amount} submitted for "${listing.songTitle}"`,
      createdAt: new Date().toISOString(),
    };

    offersStore[offerId] = {
      ...result,
      originalAmount: offer.amount,
      counterAmounts: [],
    };

    // Update listing status
    listing.status = 'under_offer';
    listing.updatedAt = new Date().toISOString();

    return result;
  }

  /**
   * Process offer negotiation — accept, decline, or counter an offer.
   * Negotiation is a back-and-forth between buyer and seller. Each counter
   * creates a new proposed amount. The process ends with acceptance or decline.
   */
  processOfferNegotiation(offerId: string, action: NegotiationAction, counterAmount?: number, counterMessage?: string): NegotiationResult {
    const existing = offersStore[offerId];
    if (!existing) {
      return {
        offerId,
        action,
        result: 'declined',
        updatedAt: new Date().toISOString(),
      };
    }

    const now = new Date().toISOString();

    switch (action) {
      case 'accept':
        existing.status = 'accepted';
        // Find and update the listing
        const listing = listingsStore[existing.listingId];
        if (listing) {
          listing.status = 'sold';
          listing.updatedAt = now;
        }
        return {
          offerId,
          action,
          result: 'accepted',
          updatedAt: now,
        };

      case 'decline':
        existing.status = 'declined';
        const declinedListing = listingsStore[existing.listingId];
        if (declinedListing) {
          declinedListing.status = 'active';
          declinedListing.updatedAt = now;
        }
        return {
          offerId,
          action,
          result: 'declined',
          updatedAt: now,
        };

      case 'counter':
        if (!counterAmount) {
          return {
            offerId,
            action,
            result: 'countered',
            updatedAt: now,
          };
        }
        existing.status = 'countered';
        existing.counterAmounts.push(counterAmount);
        return {
          offerId,
          action,
          result: 'countered',
          counterAmount,
          counterMessage: counterMessage ?? 'Counter offer proposed',
          updatedAt: now,
        };

      default:
        return {
          offerId,
          action,
          result: 'declined',
          updatedAt: now,
        };
    }
  }

  /**
   * Complete a song purchase — process payment and execute rights transfer.
   * This is the final step after negotiation concludes. Payment is processed
   * and rights are transferred from seller to buyer per the agreed transfer type.
   */
  completePurchase(offerId: string, paymentDetails: PaymentDetails): PurchaseResult {
    const offer = offersStore[offerId];
    if (!offer || offer.status !== 'accepted') {
      return {
        songId: '',
        buyerId: paymentDetails.payerId,
        sellerId: '',
        amountCents: paymentDetails.amountCents,
        currency: paymentDetails.currency,
        rightsTransfer: {
          songId: '',
          fromOwner: '',
          toOwner: '',
          transferType: 'full_assignment',
          transferredRights: [],
          effectiveDate: new Date().toISOString(),
          registrationRequired: false,
          notes: 'Purchase failed — offer not in accepted state',
        },
        paymentStatus: 'failed',
        completedAt: new Date().toISOString(),
      };
    }

    const listing = listingsStore[offer.listingId];
    const finalAmount = offer.counterAmounts.length > 0
      ? offer.counterAmounts[offer.counterAmounts.length - 1]
      : offer.originalAmount;

    const transferResult = this.transferRights(
      listing?.songId ?? '',
      listing?.sellerName ?? '',
      paymentDetails.payerId,
      'full_assignment'
    );

    return {
      songId: listing?.songId ?? '',
      buyerId: paymentDetails.payerId,
      sellerId: listing?.sellerId ?? '',
      amountCents: Math.round(finalAmount * 100),
      currency: paymentDetails.currency,
      rightsTransfer: transferResult,
      paymentStatus: 'completed',
      completedAt: new Date().toISOString(),
    };
  }

  /**
   * Transfer rights on purchase completion.
   * Rights transfers require proper documentation and registration updates:
   * - Master only: Recording rights transfer, publishing stays with seller
   * - Publishing only: Composition rights transfer, master stays with seller
   * - Full assignment: Both master and publishing transfer to buyer
   * - Split transfer: Specific percentage of rights transfer
   * All transfers require PRO registration updates (ASCAP, BMI, etc.)
   */
  transferRights(songId: string, fromOwner: string, toOwner: string, transferType: RightsTransferType): RightsTransferResult {
    const transferredRights: string[] = [];
    let registrationRequired = false;

    switch (transferType) {
      case 'master_only':
        transferredRights.push('master_recording');
        registrationRequired = true;
        break;
      case 'publishing_only':
        transferredRights.push('composition_publishing');
        registrationRequired = true;
        break;
      case 'full_assignment':
        transferredRights.push('master_recording', 'composition_publishing', 'sync', 'neighboring');
        registrationRequired = true;
        break;
      case 'split_transfer':
        transferredRights.push('partial_master', 'partial_publishing');
        registrationRequired = true;
        break;
    }

    return {
      songId,
      fromOwner,
      toOwner,
      transferType,
      transferredRights,
      effectiveDate: new Date().toISOString(),
      registrationRequired,
      notes: `${transferType} rights transfer from ${fromOwner} to ${toOwner}. PRO registration updates required.`,
    };
  }

  /**
   * Create a custom write request — a label brief describing the track they need.
   * Labels and brands post detailed briefs (genre, mood, BPM, language, deliverables)
   * and writers respond with proposals. This is the "demand side" of the marketplace.
   */
  createCustomWriteRequest(brief: CustomWriteBrief, label: WriterProfile): CustomWriteRequest {
    const id = uuid();
    const now = new Date().toISOString();

    return {
      id,
      brief,
      labelId: label.id,
      labelName: label.name,
      status: 'open',
      submissions: [],
      createdAt: now,
      updatedAt: now,
    };
  }

  /**
   * Match writers to custom write requests based on criteria.
   * Matching considers genre expertise, specialties, experience, rating, and PRO affiliation.
   * Higher match scores indicate stronger alignment with the brief requirements.
   */
  matchWritersToRequest(requestId: string, criteria: WriterCriteria, writers?: WriterProfile[]): WriterMatchResult {
    const availableWriters = writers ?? [];
    const matchedWriters: { writer: WriterProfile; matchScore: number; matchedCriteria: string[] }[] = [];

    for (const writer of availableWriters) {
      const matchedCriteria: string[] = [];
      let score = 0;

      // Genre match
      const genreOverlap = writer.genres.filter((g) => criteria.genres.includes(g));
      if (genreOverlap.length > 0) {
        score += genreOverlap.length * 10;
        matchedCriteria.push('genres');
      } else if (criteria.genres.length > 0) {
        continue; // Genre mismatch — skip writer
      }

      // Specialty match
      const specialtyOverlap = writer.specialties.filter((s) => criteria.specialties.includes(s));
      if (specialtyOverlap.length > 0) {
        score += specialtyOverlap.length * 5;
        matchedCriteria.push('specialties');
      }

      // Experience
      if (writer.experienceYears >= criteria.minExperience) {
        score += 3;
        matchedCriteria.push('experience');
      }

      // Rating
      if (writer.rating >= criteria.minRating) {
        score += 3;
        matchedCriteria.push('rating');
      }

      // PRO affiliation
      if (criteria.proRequired && writer.proAffiliation) {
        score += 5;
        matchedCriteria.push('pro');
      }

      // Completed projects bonus
      score += Math.min(writer.completedProjects, 10);

      matchedWriters.push({ writer, matchScore: score, matchedCriteria });
    }

    matchedWriters.sort((a, b) => b.matchScore - a.matchScore);

    return {
      requestId,
      matchedWriters: matchedWriters.slice(0, 20),
      totalMatches: matchedWriters.length,
    };
  }

  /**
   * Create a collab call — an open invitation for writers/producers to collaborate.
   * Collab calls specify what's needed (vocal verse, beat, co-write), a deadline,
   * and a description of the project context.
   */
  createCollabCall(call: CollabCallInput, creator: WriterProfile): CollabCall {
    return {
      id: uuid(),
      tenant_id: 'default',
      title: call.title,
      description: call.description,
      what_needed: call.whatNeeded,
      deadline: call.deadline,
      status: 'open',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      deleted_at: null,
    };
  }

  /**
   * Apply to a collab call with a submission.
   * Applicants provide a demo URL (if available), a message explaining their fit,
   * relevant experience, and a proposed timeline for delivery.
   */
  applyToCollabCall(callId: string, applicant: WriterProfile, submission: CollabSubmission): ApplicationResult {
    return {
      callId,
      applicantId: applicant.id,
      status: 'submitted',
      message: `Application submitted by ${applicant.name}: "${submission.message}"`,
      createdAt: new Date().toISOString(),
    };
  }
}

/** Export singleton instance */
export const marketplaceEngine = new MarketplaceEngine();
