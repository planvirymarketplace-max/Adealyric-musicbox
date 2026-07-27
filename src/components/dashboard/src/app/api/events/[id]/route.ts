import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/app/api/auth/_helpers';
import { successResponse, errorResponse, handleApiError } from '@/app/api/_middleware';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAuth(request);
    const { id } = await params;
    const event = await db.event.findUnique({ where: { id }, include: { ticketTiers: true, ticketPurchases: true } });
    if (!event) return errorResponse('Event not found', 'NOT_FOUND', 404);
    return successResponse(event);
  } catch (error) { return handleApiError(error); }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAuth(request);
    const { id } = await params;
    const body = await request.json();
    if (body.date) body.date = new Date(body.date);
    const event = await db.event.update({ where: { id }, data: { ...body, updatedAt: new Date() } });
    return successResponse(event);
  } catch (error) { return handleApiError(error); }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAuth(request);
    const { id } = await params;
    await db.event.update({ where: { id }, data: { status: 'cancelled' } });
    return successResponse({ message: 'Event cancelled' });
  } catch (error) { return handleApiError(error); }
}
