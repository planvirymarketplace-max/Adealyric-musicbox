import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/app/api/auth/_helpers';
import { successResponse, errorResponse, handleApiError } from '@/app/api/_middleware';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAuth(request);
    const { id } = await params;
    const order = await db.shopOrder.findUnique({ where: { id } });
    if (!order) return errorResponse('Order not found', 'NOT_FOUND', 404);
    return successResponse(order);
  } catch (error) { return handleApiError(error); }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAuth(request);
    const { id } = await params;
    const body = await request.json();
    const order = await db.shopOrder.update({ where: { id }, data: { ...body, updatedAt: new Date() } });
    return successResponse(order);
  } catch (error) { return handleApiError(error); }
}
