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
    if (url.searchParams.get('type')) where.type = url.searchParams.get('type');
    if (url.searchParams.get('status')) where.status = url.searchParams.get('status');

    const [threads, total] = await Promise.all([
      db.messageThread.findMany({ where, skip, take: limit, orderBy: { updatedAt: 'desc' }, include: { messages: { take: 1, orderBy: { createdAt: 'desc' } } } }),
      db.messageThread.count({ where }),
    ]);
    return paginatedResponse(threads, total, page, limit);
  } catch (error) { return handleApiError(error); }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    const body = await request.json();
    const { subject, requestId, type, participants } = body;

    const thread = await db.messageThread.create({
      data: { tenantId: user.tenantId, requestId, subject, userId: user.id, type: type ?? 'general', participants: participants ?? [user.id], status: 'active' },
    });
    return successResponse(thread, 201);
  } catch (error) { return handleApiError(error); }
}
