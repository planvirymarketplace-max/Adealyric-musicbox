import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/app/api/auth/_helpers';
import { successResponse, errorResponse, handleApiError } from '@/app/api/_middleware';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAuth(request);
    const { id } = await params;
    const inquiry = await db.bookingInquiry.findUnique({ where: { id }, include: { bookings: true } });
    if (!inquiry) return errorResponse('Inquiry not found', 'NOT_FOUND', 404);
    return successResponse(inquiry);
  } catch (error) { return handleApiError(error); }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAuth(request);
    const { id } = await params;
    const body = await request.json();
    const inquiry = await db.bookingInquiry.update({ where: { id }, data: { ...body, updatedAt: new Date() } });
    return successResponse(inquiry);
  } catch (error) { return handleApiError(error); }
}
