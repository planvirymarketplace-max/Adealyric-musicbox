import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/app/api/auth/_helpers';
import { successResponse, errorResponse, handleApiError } from '@/app/api/_middleware';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAuth(request);
    const { id } = await params;
    const song = await db.catalogSong.findFirst({ where: { id, tenantId: user.tenantId, deletedAt: null }, include: { rightsRecords: true, royaltySplits: true } });
    if (!song) return errorResponse('Song not found', 'NOT_FOUND', 404);
    return successResponse(song);
  } catch (error) { return handleApiError(error); }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAuth(request);
    const { id } = await params;
    const body = await request.json();
    const song = await db.catalogSong.update({ where: { id }, data: { ...body, updatedAt: new Date() } });
    return successResponse(song);
  } catch (error) { return handleApiError(error); }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAuth(request);
    const { id } = await params;
    await db.catalogSong.update({ where: { id }, data: { deletedAt: new Date(), isActive: false } });
    return successResponse({ message: 'Song removed' });
  } catch (error) { return handleApiError(error); }
}
