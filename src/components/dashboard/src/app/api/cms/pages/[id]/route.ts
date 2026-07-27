import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/app/api/auth/_helpers';
import { successResponse, errorResponse, handleApiError } from '@/app/api/_middleware';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAuth(request);
    const { id } = await params;
    const page = await db.cmsPage.findUnique({ where: { id } });
    if (!page) return errorResponse('Page not found', 'NOT_FOUND', 404);
    return successResponse(page);
  } catch (error) { return handleApiError(error); }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAuth(request);
    const { id } = await params;
    const body = await request.json();
    if (body.status === 'published') body.publishedAt = new Date();
    const page = await db.cmsPage.update({ where: { id }, data: { ...body, updatedAt: new Date() } });
    return successResponse(page);
  } catch (error) { return handleApiError(error); }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAuth(request);
    const { id } = await params;
    await db.cmsPage.update({ where: { id }, data: { status: 'archived' } });
    return successResponse({ message: 'Page archived' });
  } catch (error) { return handleApiError(error); }
}
