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
    if (url.searchParams.get('tier')) where.tier = url.searchParams.get('tier');
    if (url.searchParams.get('artist_id')) where.artistId = url.searchParams.get('artist_id');

    const [fans, total] = await Promise.all([
      db.fan.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
      db.fan.count({ where }),
    ]);
    return paginatedResponse(fans, total, page, limit);
  } catch (error) { return handleApiError(error); }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    const body = await request.json();
    const { email, name, artistId, tier, subscribed } = body;

    const existing = await db.fan.findFirst({ where: { email } });
    if (existing) return successResponse({ error: 'Fan already exists', fan: existing });

    const fan = await db.fan.create({
      data: { email, name, artistId, tier: tier ?? 'free', subscribed: subscribed ?? false, tags: [] },
    });
    return successResponse(fan, 201);
  } catch (error) { return handleApiError(error); }
}
