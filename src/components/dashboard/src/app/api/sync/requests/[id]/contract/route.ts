import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { SyncEngine } from '@/lib/sync-engine';
import { requireAuth } from '@/app/api/auth/_helpers';
import { successResponse, errorResponse, handleApiError } from '@/app/api/_middleware';

const syncEngine = new SyncEngine();

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAuth(request);
    const { id } = await params;

    const syncReq = await db.syncLicenseRequest.findUnique({ where: { id }, include: { catalogSong: true } });
    if (!syncReq) return errorResponse('Request not found', 'NOT_FOUND', 404);

    const template = { id: 'sync-standard', name: 'Standard Sync License', type: 'sync' as const, sections: ['grant', 'scope', 'fee', 'term', 'territory', 'exclusivity', 'warranties', 'termination'], defaultTermMonths: 12, defaultTerritory: 'WW' };
    const contract = syncEngine.generateLicenseContract(syncReq as any, template);

    return successResponse(contract);
  } catch (error) { return handleApiError(error); }
}
