import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { SyncEngine } from '@/lib/sync-engine';
import { requireAuth } from '@/app/api/auth/_helpers';
import { successResponse, handleApiError } from '@/app/api/_middleware';

const syncEngine = new SyncEngine();

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    const body = await request.json();
    const { songId, usageType, territory, termMonths } = body;

    const existingRequests = await db.syncLicenseRequest.findMany({ where: { catalogSongId: songId, status: { in: ['approved', 'cleared'] } } });

    const result = syncEngine.checkExclusivityConflicts(songId, usageType, territory, termMonths, existingRequests as any);
    return successResponse(result);
  } catch (error) { return handleApiError(error); }
}
