import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/app/api/auth/_helpers';
import { successResponse, errorResponse, handleApiError } from '@/app/api/_middleware';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAuth(request);
    const { id } = await params;
    const actions = await db.loyaltyAction.findMany({ where: { fanId: id }, orderBy: { createdAt: 'desc' } });
    return successResponse(actions);
  } catch (error) { return handleApiError(error); }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAuth(request);
    const { id } = await params;
    const body = await request.json();
    const { actionType, points, description } = body;

    const fan = await db.fan.findUnique({ where: { id } });
    if (!fan) return errorResponse('Fan not found', 'NOT_FOUND', 404);

    const action = await db.loyaltyAction.create({ data: { fanId: id, actionType, points, description } });
    await db.fan.update({ where: { id }, data: { loyaltyPoints: fan.loyaltyPoints + points } });

    return successResponse(action, 201);
  } catch (error) { return handleApiError(error); }
}
