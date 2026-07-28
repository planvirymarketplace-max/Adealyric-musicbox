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
    if (url.searchParams.get('status')) where.status = url.searchParams.get('status');
    if (url.searchParams.get('artist_id')) where.artistId = url.searchParams.get('artist_id');
    if (url.searchParams.get('type')) where.eventType = url.searchParams.get('type');

    const [events, total] = await Promise.all([
      db.event.findMany({ where, skip, take: limit, orderBy: { date: 'asc' }, include: { ticketTiers: true } }),
      db.event.count({ where }),
    ]);
    return paginatedResponse(events, total, page, limit);
  } catch (error) { return handleApiError(error); }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    const body = await request.json();
    const { title, description, date, venue, city, country, eventType, artistId, imageUrl } = body;

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const event = await db.event.create({
      data: { title, slug, description, date: new Date(date), venue, city, country, eventType: eventType ?? 'concert', artistId, imageUrl, status: 'upcoming' },
    });
    return successResponse(event, 201);
  } catch (error) { return handleApiError(error); }
}
