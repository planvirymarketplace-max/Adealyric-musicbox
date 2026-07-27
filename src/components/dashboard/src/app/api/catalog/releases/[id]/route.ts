import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/app/api/auth/_helpers';
import { successResponse, errorResponse, handleApiError } from '@/app/api/_middleware';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAuth(request);
    const { id } = await params;
    const release = await db.release.findUnique({ where: { id }, include: { tracks: true, catalogSongs: true, validationChecks: true, deliveryRecords: true } });
    if (!release) return errorResponse('Release not found', 'NOT_FOUND', 404);
    return successResponse(release);
  } catch (error) { return handleApiError(error); }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAuth(request);
    const { id } = await params;
    const body = await request.json();
    if (body.releaseDate) body.releaseDate = new Date(body.releaseDate);
    const release = await db.release.update({ where: { id }, data: { ...body, updatedAt: new Date() } });
    return successResponse(release);
  } catch (error) { return handleApiError(error); }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAuth(request);
    const { id } = await params;
    await db.release.update({ where: { id }, data: { status: 'archived' } });
    return successResponse({ message: 'Release archived' });
  } catch (error) { return handleApiError(error); }
}
