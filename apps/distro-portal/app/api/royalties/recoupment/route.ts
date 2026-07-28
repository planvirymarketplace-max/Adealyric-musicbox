import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { RoyaltyEngine } from '@/lib/royalty-engine';
import { requireAuth } from '@/app/api/auth/_helpers';
import { successResponse, handleApiError } from '@/app/api/_middleware';

const royaltyEngine = new RoyaltyEngine();

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    const body = await request.json();
    const { artistAdvancesCents, totalEarningsCents } = body;

    if (!artistAdvancesCents || !totalEarningsCents) return successResponse({ error: 'artistAdvancesCents and totalEarningsCents required' });

    const result = royaltyEngine.calculateRecoupment(artistAdvancesCents, totalEarningsCents);
    return successResponse(result);
  } catch (error) { return handleApiError(error); }
}
