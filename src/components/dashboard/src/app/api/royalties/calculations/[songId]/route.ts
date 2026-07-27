import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { RoyaltyEngine } from '@/lib/royalty-engine';
import { requireAuth } from '@/app/api/auth/_helpers';
import { successResponse, errorResponse, handleApiError } from '@/app/api/_middleware';

const royaltyEngine = new RoyaltyEngine();

export async function GET(request: NextRequest, { params }: { params: Promise<{ songId: string }> }) {
  try {
    const user = await requireAuth(request);
    const { songId } = await params;

    const splits = await db.royaltySplit.findMany({ where: { catalogSongId: songId } });
    const statements = await db.royaltyStatement.findMany({ where: { status: 'finalized' }, take: 1, orderBy: { createdAt: 'desc' } });

    if (splits.length === 0) return errorResponse('No splits found for this song', 'NO_SPLITS', 404);
    if (statements.length === 0) return successResponse({ songId, payments: [], totalRevenueCents: 0, message: 'No finalized statements available' });

    const result = royaltyEngine.calculateSplitPayments(statements[0] as any, splits as any);
    return successResponse(result);
  } catch (error) { return handleApiError(error); }
}
