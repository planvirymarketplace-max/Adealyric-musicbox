import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/app/api/auth/_helpers';
import { parsePagination, paginatedResponse, successResponse, handleApiError } from '@/app/api/_middleware';

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    const { page, limit, skip } = parsePagination(request);
    const url = new URL(request.url);
    const where: Record<string, unknown> = { tenantId: user.tenantId, deletedAt: null };
    if (url.searchParams.get('status')) where.status = url.searchParams.get('status');

    const [calls, total] = await Promise.all([
      db.collabCall.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
      db.collabCall.count({ where }),
    ]);
    return paginatedResponse(calls, total, page, limit);
  } catch (error) { return handleApiError(error); }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    const body = await request.json();
    const { title, description, whatNeeded, deadline } = body;

    const call = await db.collabCall.create({
      data: { tenantId: user.tenantId, creatorId: user.id, title, description, whatNeeded: whatNeeded ?? {}, deadline: deadline ? new Date(deadline) : null, status: 'open' },
    });
    return successResponse(call, 201);
  } catch (error) { return handleApiError(error); }
}
