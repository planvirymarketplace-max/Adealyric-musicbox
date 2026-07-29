import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { DistributionPipeline } from '@/lib/distribution-pipeline';
import { requireAuth } from '@/app/api/auth/_helpers';
import { successResponse, errorResponse, handleApiError } from '@/app/api/_middleware';

const pipeline = new DistributionPipeline();

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAuth(request);
    const { id } = await params;

    const record = await db.deliveryRecord.findUnique({ where: { id } });
    if (!record) return errorResponse('Delivery record not found', 'NOT_FOUND', 404);
    if (record.status !== 'rejected') return errorResponse('Only rejected deliveries can be retried', 'INVALID_STATUS', 400);

    const result = pipeline.retryDelivery(id);
    await db.deliveryRecord.update({ where: { id }, data: { status: 'pending', submittedAt: null, confirmedAt: null, errorMessage: null } });

    return successResponse(result);
  } catch (error) { return handleApiError(error); }
}
