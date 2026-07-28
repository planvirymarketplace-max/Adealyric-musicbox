import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/app/api/auth/_helpers';
import { parsePagination, paginatedResponse, successResponse, handleApiError } from '@/app/api/_middleware';

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    const { page, limit, skip } = parsePagination(request);
    const url = new URL(request.url);
    const where: Record<string, unknown> = {};
    if (url.searchParams.get('status')) where.status = url.searchParams.get('status');

    const [adapters, total] = await Promise.all([
      db.dspAdapter.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
      db.dspAdapter.count({ where }),
    ]);
    return paginatedResponse(adapters, total, page, limit);
  } catch (error) { return handleApiError(error); }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    const body = await request.json();
    const { name, slug, deliveryFormat, authType, config } = body;

    const adapter = await db.dspAdapter.create({
      data: { name, slug, deliveryFormat: deliveryFormat ?? 'ddex_ern', authType: authType ?? 'api_key', config: config ?? {}, status: 'active' },
    });
    return successResponse(adapter, 201);
  } catch (error) { return handleApiError(error); }
}
