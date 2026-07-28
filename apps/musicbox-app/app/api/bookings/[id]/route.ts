import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/app/api/auth/_helpers';
import { successResponse, errorResponse, handleApiError } from '@/app/api/_middleware';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAuth(request);
    const { id } = await params;
    const booking = await db.booking.findUnique({ where: { id }, include: { payments: true, inquiry: true } });
    if (!booking) return errorResponse('Booking not found', 'NOT_FOUND', 404);
    return successResponse(booking);
  } catch (error) { return handleApiError(error); }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAuth(request);
    const { id } = await params;
    const body = await request.json();
    if (body.eventDate) body.eventDate = new Date(body.eventDate);
    const booking = await db.booking.update({ where: { id }, data: { ...body, updatedAt: new Date() } });
    return successResponse(booking);
  } catch (error) { return handleApiError(error); }
}
