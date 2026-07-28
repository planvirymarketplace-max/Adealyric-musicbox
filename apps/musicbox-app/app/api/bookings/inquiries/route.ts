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

    const [inquiries, total] = await Promise.all([
      db.bookingInquiry.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
      db.bookingInquiry.count({ where }),
    ]);
    return paginatedResponse(inquiries, total, page, limit);
  } catch (error) { return handleApiError(error); }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    const body = await request.json();
    const { contactName, contactEmail, contactPhone, eventName, eventType, dateRequested, city, state, country, budgetRange, budgetCents, message, artistId } = body;

    const inquiry = await db.bookingInquiry.create({
      data: { artistId, requesterId: user.id, requesterName: user.displayName ?? user.email, contactName, contactEmail, contactPhone, eventName, eventType, dateRequested: dateRequested ? new Date(dateRequested) : null, city, state, country, budgetRange, budgetCents, message, source: 'portal', status: 'received' },
    });
    return successResponse(inquiry, 201);
  } catch (error) { return handleApiError(error); }
}
