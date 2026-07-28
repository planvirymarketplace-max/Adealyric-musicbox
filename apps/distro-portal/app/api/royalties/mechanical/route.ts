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
    const { streams, songDurationSeconds } = body;

    if (!streams || !songDurationSeconds) return successResponse({ error: 'streams and songDurationSeconds required' });

    const result = royaltyEngine.calculateMechanicalRoyalty(streams, songDurationSeconds);
    return successResponse(result);
  } catch (error) { return handleApiError(error); }
}
