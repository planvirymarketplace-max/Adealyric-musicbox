import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/app/api/auth/_helpers';
import { successResponse, errorResponse, handleApiError } from '@/app/api/_middleware';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAuth(request);
    const { id } = await params;
    const adapter = await db.dspAdapter.findUnique({ where: { id }, include: { deliveryRecords: true } });
    if (!adapter) return errorResponse('DSP adapter not found', 'NOT_FOUND', 404);
    return successResponse(adapter);
  } catch (error) { return handleApiError(error); }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAuth(request);
    const { id } = await params;
    const body = await request.json();
    const adapter = await db.dspAdapter.update({ where: { id }, data: { ...body } });
    return successResponse(adapter);
  } catch (error) { return handleApiError(error); }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAuth(request);
    const { id } = await params;
    await db.dspAdapter.update({ where: { id }, data: { status: 'inactive' } });
    return successResponse({ message: 'DSP adapter deactivated' });
  } catch (error) { return handleApiError(error); }
}
