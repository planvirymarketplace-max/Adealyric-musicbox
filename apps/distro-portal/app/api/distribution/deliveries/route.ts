import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { DistributionPipeline } from '@/lib/distribution-pipeline';
import { requireAuth } from '@/app/api/auth/_helpers';
import { parsePagination, paginatedResponse, successResponse, errorResponse, handleApiError } from '@/app/api/_middleware';

const pipeline = new DistributionPipeline();

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    const { page, limit, skip } = parsePagination(request);
    const url = new URL(request.url);
    const where: Record<string, unknown> = {};
    if (url.searchParams.get('release_id')) where.releaseId = url.searchParams.get('release_id');
    if (url.searchParams.get('status')) where.status = url.searchParams.get('status');

    const [records, total] = await Promise.all([
      db.deliveryRecord.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' }, include: { release: true, dspAdapter: true } }),
      db.deliveryRecord.count({ where }),
    ]);
    return paginatedResponse(records, total, page, limit);
  } catch (error) { return handleApiError(error); }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    const body = await request.json();
    const { releaseId, dspIds } = body;

    const release = await db.release.findUnique({ where: { id: releaseId }, include: { catalogSongs: true } });
    if (!release) return errorResponse('Release not found', 'NOT_FOUND', 404);

    const dsps = await db.dspAdapter.findMany({ where: { id: { in: dspIds } } });
    const result = pipeline.prepareForDelivery(releaseId, dspIds, release as any, release.catalogSongs as any, dsps as any);

    for (const pkg of result.packages) {
      await db.deliveryRecord.create({ data: { releaseId, dspAdapterId: pkg.dspId, status: 'pending', responseData: { ...pkg } } });
    }
    return successResponse(result, 201);
  } catch (error) { return handleApiError(error); }
}
