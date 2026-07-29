import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/app/api/auth/_helpers';
import { successResponse, errorResponse, handleApiError } from '@/app/api/_middleware';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAuth(request);
    const { id } = await params;
    const split = await db.royaltySplit.findUnique({ where: { id }, include: { catalogSong: true } });
    if (!split) return errorResponse('Split not found', 'NOT_FOUND', 404);
    return successResponse(split);
  } catch (error) { return handleApiError(error); }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAuth(request);
    const { id } = await params;
    const body = await request.json();
    const split = await db.royaltySplit.update({ where: { id }, data: { ...body, updatedAt: new Date() } });
    return successResponse(split);
  } catch (error) { return handleApiError(error); }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAuth(request);
    const { id } = await params;
    await db.royaltySplit.delete({ where: { id } });
    return successResponse({ message: 'Split removed' });
  } catch (error) { return handleApiError(error); }
}
