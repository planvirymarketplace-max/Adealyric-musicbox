import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { MarketplaceEngine } from '@/lib/marketplace-engine';
import { requireAuth } from '@/app/api/auth/_helpers';
import { parsePagination, paginatedResponse, successResponse, handleApiError } from '@/app/api/_middleware';

const marketplaceEngine = new MarketplaceEngine();

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    const { page, limit, skip } = parsePagination(request);
    const url = new URL(request.url);
    const where: Record<string, unknown> = {};
    if (url.searchParams.get('listing_id')) where.id = url.searchParams.get('listing_id');

    // Marketplace offers are tracked in-memory in the engine; return portal requests of type 'purchase'
    const requests = await db.portalRequest.findMany({ where: { type: 'purchase', tenantId: user.tenantId, deletedAt: null }, skip, take: limit, orderBy: { createdAt: 'desc' } });
    const total = await db.portalRequest.count({ where: { type: 'purchase', tenantId: user.tenantId, deletedAt: null } });
    return paginatedResponse(requests, total, page, limit);
  } catch (error) { return handleApiError(error); }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    const body = await request.json();
    const { listingId, amount, message, proposedRightsTransfer, contingencies } = body;

    const song = await db.catalogSong.findUnique({ where: { id: listingId } });
    if (!song) return successResponse({ error: 'Listing not found' });

    const offer = marketplaceEngine.makeOffer(listingId, { amount, message, buyerId: user.id, buyerName: user.displayName ?? user.email, proposedRightsTransfer, contingencies });

    await db.portalRequest.create({ data: { tenantId: user.tenantId, requesterId: user.id, type: 'purchase', status: 'open', payload: { listingId, amount, offerId: offer.offerId } } });
    return successResponse(offer, 201);
  } catch (error) { return handleApiError(error); }
}
