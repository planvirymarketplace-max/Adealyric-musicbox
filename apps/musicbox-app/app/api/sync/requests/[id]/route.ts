import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/app/api/auth/_helpers';
import { successResponse, errorResponse, handleApiError } from '@/app/api/_middleware';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAuth(request);
    const { id } = await params;
    const req = await db.syncLicenseRequest.findUnique({ where: { id }, include: { catalogSong: true } });
    if (!req) return errorResponse('Request not found', 'NOT_FOUND', 404);
    return successResponse(req);
  } catch (error) { return handleApiError(error); }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAuth(request);
    const { id } = await params;
    const body = await request.json();
    const updated = await db.syncLicenseRequest.update({ where: { id }, data: { ...body, updatedAt: new Date() } });
    return successResponse(updated);
  } catch (error) { return handleApiError(error); }
}
