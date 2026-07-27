import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/app/api/auth/_helpers';
import { successResponse, errorResponse, handleApiError } from '@/app/api/_middleware';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAuth(request);
    const { id } = await params;
    const body = await request.json();
    const { tierId, quantity, fanEmail, fanName } = body;

    const tier = await db.ticketTier.findUnique({ where: { id: tierId } });
    if (!tier) return errorResponse('Ticket tier not found', 'NOT_FOUND', 404);
    if (tier.quantitySold + quantity > tier.quantityAvailable) return errorResponse('Not enough tickets available', 'INSUFFICIENT_STOCK', 400);

    const totalCents = tier.priceCents * quantity;
    const purchase = await db.ticketPurchase.create({
      data: { eventId: id, tierId, quantity, totalCents, status: 'pending' },
    });

    await db.ticketTier.update({ where: { id: tierId }, data: { quantitySold: tier.quantitySold + quantity } });
    return successResponse(purchase, 201);
  } catch (error) { return handleApiError(error); }
}
