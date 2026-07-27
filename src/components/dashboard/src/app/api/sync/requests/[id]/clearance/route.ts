import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { SyncEngine } from '@/lib/sync-engine';
import { requireAuth } from '@/app/api/auth/_helpers';
import { successResponse, errorResponse, handleApiError } from '@/app/api/_middleware';

const syncEngine = new SyncEngine();

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAuth(request);
    const { id } = await params;
    const body = await request.json();
    const { action } = body;

    const syncReq = await db.syncLicenseRequest.findUnique({ where: { id } });
    if (!syncReq) return errorResponse('Request not found', 'NOT_FOUND', 404);

    const result = syncEngine.processClearanceStep(id, action);

    let statusUpdate: Record<string, unknown> = { status: result.newStatus, updatedAt: new Date() };
    if (result.newStatus === 'cleared') statusUpdate.clearedAt = new Date();
    if (result.newStatus === 'approved') statusUpdate.approvedAt = new Date();
    await db.syncLicenseRequest.update({ where: { id }, data: statusUpdate });

    return successResponse(result);
  } catch (error) { return handleApiError(error); }
}
