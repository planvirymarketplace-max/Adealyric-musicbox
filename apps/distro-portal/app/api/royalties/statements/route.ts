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
    if (url.searchParams.get('dsp_source')) where.dspSource = url.searchParams.get('dsp_source');
    if (url.searchParams.get('status')) where.status = url.searchParams.get('status');
    if (url.searchParams.get('period')) where.period = url.searchParams.get('period');

    const [statements, total] = await Promise.all([
      db.royaltyStatement.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
      db.royaltyStatement.count({ where }),
    ]);
    return paginatedResponse(statements, total, page, limit);
  } catch (error) { return handleApiError(error); }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    const body = await request.json();
    const { period, periodStart, periodEnd, dspSource, totalStreams, totalRevenueCents, currency, status, artistId, data } = body;

    const statement = await db.royaltyStatement.create({
      data: { artistId, period, periodStart: new Date(periodStart), periodEnd: new Date(periodEnd), dspSource, totalStreams, totalRevenueCents, currency: currency ?? 'USD', status: status ?? 'draft', data: data ?? {} },
    });
    return successResponse(statement, 201);
  } catch (error) { return handleApiError(error); }
}
