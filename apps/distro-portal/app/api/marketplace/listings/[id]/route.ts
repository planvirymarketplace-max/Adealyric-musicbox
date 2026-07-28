import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/app/api/auth/_helpers';
import { successResponse, errorResponse, handleApiError } from '@/app/api/_middleware';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAuth(request);
    const { id } = await params;
    const song = await db.catalogSong.findFirst({ where: { id, forSale: true, isActive: true }, include: { rightsRecords: true, royaltySplits: true } });
    if (!song) return errorResponse('Listing not found', 'NOT_FOUND', 404);
    return successResponse({ song, askingPrice: song.askingPriceCents, negotiable: song.askingPriceNegotiable, oneStopClearance: song.rightsRecords.some(r => r.isOneStop), stemsAvailable: song.stemsAvailable });
  } catch (error) { return handleApiError(error); }
}
