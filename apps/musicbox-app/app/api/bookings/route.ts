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

    const [bookings, total] = await Promise.all([
      db.booking.findMany({ where, skip, take: limit, orderBy: { eventDate: 'asc' }, include: { payments: true } }),
      db.booking.count({ where }),
    ]);
    return paginatedResponse(bookings, total, page, limit);
  } catch (error) { return handleApiError(error); }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    const body = await request.json();
    const { eventName, venueName, eventDate, eventType, feeCents, depositCents, artistId, inquiryId, city } = body;

    const booking = await db.booking.create({
      data: { eventName, venueName, eventDate: new Date(eventDate), eventType, feeCents, depositCents, artistId, inquiryId, city, status: 'confirmed' },
    });
    if (inquiryId) await db.bookingInquiry.update({ where: { id: inquiryId }, data: { status: 'accepted' } });
    return successResponse(booking, 201);
  } catch (error) { return handleApiError(error); }
}
