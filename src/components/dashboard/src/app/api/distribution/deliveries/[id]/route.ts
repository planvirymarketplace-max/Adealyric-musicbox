import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/app/api/auth/_helpers';
import { successResponse, errorResponse, handleApiError } from '@/app/api/_middleware';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAuth(request);
    const { id } = await params;
    const record = await db.deliveryRecord.findUnique({ where: { id }, include: { release: true, dspAdapter: true } });
    if (!record) return errorResponse('Delivery record not found', 'NOT_FOUND', 404);
    return successResponse(record);
  } catch (error) { return handleApiError(error); }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAuth(request);
    const { id } = await params;
    const body = await request.json();
    if (body.status === 'delivered') body.submittedAt = new Date();
    if (body.status === 'accepted') body.confirmedAt = new Date();
    const record = await db.deliveryRecord.update({ where: { id }, data: { ...body, updatedAt: new Date() } });
    return successResponse(record);
  } catch (error) { return handleApiError(error); }
}
