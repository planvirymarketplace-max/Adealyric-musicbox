import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/app/api/auth/_helpers';
import { successResponse, errorResponse, handleApiError } from '@/app/api/_middleware';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAuth(request);
    const { id } = await params;
    const fan = await db.fan.findUnique({ where: { id }, include: { loyaltyActions: true, orders: true } });
    if (!fan) return errorResponse('Fan not found', 'NOT_FOUND', 404);
    return successResponse(fan);
  } catch (error) { return handleApiError(error); }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAuth(request);
    const { id } = await params;
    const body = await request.json();
    const fan = await db.fan.update({ where: { id }, data: { ...body, updatedAt: new Date() } });
    return successResponse(fan);
  } catch (error) { return handleApiError(error); }
}
