import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { MarketplaceEngine } from '@/lib/marketplace-engine';
import { requireAuth } from '@/app/api/auth/_helpers';
import { successResponse, errorResponse, handleApiError } from '@/app/api/_middleware';

const marketplaceEngine = new MarketplaceEngine();

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAuth(request);
    const { id } = await params;
    const body = await request.json();
    const { method, referenceId, amountCents, currency } = body;

    const req = await db.portalRequest.findFirst({ where: { id, type: 'purchase', status: 'completed' } });
    if (!req) return errorResponse('Offer not in accepted state', 'INVALID_STATE', 400);

    const paymentDetails = { method, referenceId, amountCents, currency, payerId: user.id };
    const result = marketplaceEngine.completePurchase(id, paymentDetails);

    await db.portalRequest.update({ where: { id }, data: { status: 'completed', payload: { ...req.payload, purchaseCompleted: true } } });
    return successResponse(result);
  } catch (error) { return handleApiError(error); }
}
