import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/app/api/auth/_helpers';
import { parsePagination, paginatedResponse, successResponse, handleApiError } from '@/app/api/_middleware';

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    const { page, limit, skip } = parsePagination(request);
    const url = new URL(request.url);
    const where: Record<string, unknown> = {};
    if (url.searchParams.get('type')) where.type = url.searchParams.get('type');
    if (url.searchParams.get('status')) where.status = url.searchParams.get('status');
    if (url.searchParams.get('artist_id')) where.artistId = url.searchParams.get('artist_id');

    const [pages, total] = await Promise.all([
      db.cmsPage.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
      db.cmsPage.count({ where }),
    ]);
    return paginatedResponse(pages, total, page, limit);
  } catch (error) { return handleApiError(error); }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    const body = await request.json();
    const { title, content, type, artistId } = body;

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const page = await db.cmsPage.create({
      data: { title, slug, content: content ?? {}, type: type ?? 'page', status: 'draft', artistId },
    });
    return successResponse(page, 201);
  } catch (error) { return handleApiError(error); }
}
