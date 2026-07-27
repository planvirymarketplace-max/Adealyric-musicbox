import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/app/api/auth/_helpers';
import { parsePagination, paginatedResponse, successResponse, handleApiError } from '@/app/api/_middleware';

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    const { page, limit, skip } = parsePagination(request);
    const requests = await db.portalRequest.findMany({ where: { tenantId: user.tenantId, type: 'custom_write', deletedAt: null }, skip, take: limit, orderBy: { createdAt: 'desc' } });
    const total = await db.portalRequest.count({ where: { tenantId: user.tenantId, type: 'custom_write', deletedAt: null } });
    return paginatedResponse(requests, total, page, limit);
  } catch (error) { return handleApiError(error); }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    const body = await request.json();
    const { title, description, genre, moodTags, bpmRange, language, durationTarget, deadline, budgetRange, exclusivity, deliverables } = body;

    const req = await db.portalRequest.create({
      data: { tenantId: user.tenantId, requesterId: user.id, type: 'custom_write', status: 'open',
        payload: { title, description, genre, moodTags, bpmRange, language, durationTarget, deadline, budgetRange, exclusivity, deliverables } },
    });
    return successResponse(req, 201);
  } catch (error) { return handleApiError(error); }
}
