import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { MarketplaceEngine } from '@/lib/marketplace-engine';
import { requireAuth } from '@/app/api/auth/_helpers';
import { successResponse, errorResponse, handleApiError } from '@/app/api/_middleware';

const marketplaceEngine = new MarketplaceEngine();

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAuth(request);
    const { id } = await params;
    const req = await db.portalRequest.findFirst({ where: { id, type: 'purchase' } });
    if (!req) return errorResponse('Offer not found', 'NOT_FOUND', 404);
    return successResponse(req);
  } catch (error) { return handleApiError(error); }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAuth(request);
    const { id } = await params;
    const body = await request.json();
    const { action, counterAmount, counterMessage } = body;

    const result = marketplaceEngine.processOfferNegotiation(id, action, counterAmount, counterMessage);
    if (action === 'accept' || action === 'decline') {
      await db.portalRequest.update({ where: { id }, data: { status: action === 'accept' ? 'completed' : 'cancelled' } });
    }
    return successResponse(result);
  } catch (error) { return handleApiError(error); }
}
