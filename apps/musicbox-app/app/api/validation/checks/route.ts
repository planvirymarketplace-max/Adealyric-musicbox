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
    if (url.searchParams.get('release_id')) where.releaseId = url.searchParams.get('release_id');
    if (url.searchParams.get('song_id')) where.songId = url.searchParams.get('song_id');
    if (url.searchParams.get('check_type')) where.checkType = url.searchParams.get('check_type');
    if (url.searchParams.get('status')) where.status = url.searchParams.get('status');

    const [checks, total] = await Promise.all([
      db.validationCheck.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
      db.validationCheck.count({ where }),
    ]);
    return paginatedResponse(checks, total, page, limit);
  } catch (error) { return handleApiError(error); }
}
