import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/app/api/auth/_helpers';
import { parsePagination, paginatedResponse, successResponse, errorResponse, handleApiError } from '@/app/api/_middleware';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAuth(request);
    const { id } = await params;
    const { page, limit, skip } = parsePagination(request);

    const thread = await db.messageThread.findFirst({ where: { id, tenantId: user.tenantId, deletedAt: null } });
    if (!thread) return errorResponse('Thread not found', 'NOT_FOUND', 404);

    const [messages, total] = await Promise.all([
      db.message.findMany({ where: { threadId: id }, skip, take: limit, orderBy: { createdAt: 'asc' } }),
      db.message.count({ where: { threadId: id } }),
    ]);
    return paginatedResponse(messages, total, page, limit);
  } catch (error) { return handleApiError(error); }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAuth(request);
    const { id } = await params;
    const body = await request.json();
    const { content, recipientId, type, isInternalNote } = body;

    const thread = await db.messageThread.findFirst({ where: { id, tenantId: user.tenantId } });
    if (!thread) return errorResponse('Thread not found', 'NOT_FOUND', 404);

    const message = await db.message.create({
      data: { tenantId: user.tenantId, threadId: id, senderId: user.id, recipientId, content, type: type ?? 'text', isInternalNote: isInternalNote ?? false },
    });
    await db.messageThread.update({ where: { id }, data: { updatedAt: new Date() } });
    return successResponse(message, 201);
  } catch (error) { return handleApiError(error); }
}
