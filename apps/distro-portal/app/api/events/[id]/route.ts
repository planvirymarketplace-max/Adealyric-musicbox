import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/app/api/auth/_helpers';
import { successResponse, errorResponse, handleApiError } from '@/app/api/_middleware';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAuth(request);
    const { id } = await params;
    const tiers = await db.ticketTier.findMany({ where: { eventId: id }, orderBy: { sortOrder: 'asc' } });
    return successResponse(tiers);
  } catch (error) { return handleApiError(error); }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAuth(request);
    const { id } = await params;
    const body = await request.json();
    const { name, description, priceCents, quantityAvailable, perks, saleStartsAt, saleEndsAt, sortOrder } = body;

    const tier = await db.ticketTier.create({
      data: { eventId: id, name, description, priceCents, quantityAvailable, quantitySold: 0, perks: perks ?? {}, saleStartsAt: saleStartsAt ? new Date(saleStartsAt) : null, saleEndsAt: saleEndsAt ? new Date(saleEndsAt) : null, sortOrder: sortOrder ?? 0, status: 'available' },
    });
    return successResponse(tier, 201);
  } catch (error) { return handleApiError(error); }
}
