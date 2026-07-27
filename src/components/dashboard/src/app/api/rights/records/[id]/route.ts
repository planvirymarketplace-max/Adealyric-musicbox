import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/app/api/auth/_helpers';
import { successResponse, errorResponse, handleApiError } from '@/app/api/_middleware';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAuth(request);
    const { id } = await params;
    const record = await db.rightsRecord.findUnique({ where: { id }, include: { catalogSong: true } });
    if (!record) return errorResponse('Rights record not found', 'NOT_FOUND', 404);
    return successResponse(record);
  } catch (error) { return handleApiError(error); }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAuth(request);
    const { id } = await params;
    const body = await request.json();
    if (body.expiration) body.expiration = new Date(body.expiration);
    const record = await db.rightsRecord.update({ where: { id }, data: { ...body, updatedAt: new Date() } });
    return successResponse(record);
  } catch (error) { return handleApiError(error); }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAuth(request);
    const { id } = await params;
    await db.rightsRecord.delete({ where: { id } });
    return successResponse({ message: 'Rights record removed' });
  } catch (error) { return handleApiError(error); }
}
