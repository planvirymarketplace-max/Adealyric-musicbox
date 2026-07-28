import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { RightsEngine } from '@/lib/rights-engine';
import { requireAuth } from '@/app/api/auth/_helpers';
import { parsePagination, paginatedResponse, successResponse, handleApiError } from '@/app/api/_middleware';

const rightsEngine = new RightsEngine();

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    const { page, limit, skip } = parsePagination(request);
    const url = new URL(request.url);
    const where: Record<string, unknown> = {};
    if (url.searchParams.get('song_id')) where.catalogSongId = url.searchParams.get('song_id');
    if (url.searchParams.get('rights_type')) where.rightsType = url.searchParams.get('rights_type');

    const [records, total] = await Promise.all([
      db.rightsRecord.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
      db.rightsRecord.count({ where }),
    ]);
    return paginatedResponse(records, total, page, limit);
  } catch (error) { return handleApiError(error); }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    const body = await request.json();
    const { catalogSongId, rightsType, owner, territory, expiration, ownershipPct, licenseRef, notes } = body;

    const record = rightsEngine.createRightsRecord({ catalogSongId, rightsType, owner, territory, expiration, ownershipPct, licenseRef, notes });

    const saved = await db.rightsRecord.create({
      data: { catalogSongId, rightsType, ownerName: record.owner, territory: record.territory, ownershipPct: record.ownership_pct,
        expiration: record.expiration ? new Date(record.expiration) : null, licenseRef: record.license_ref, notes: record.notes },
    });
    return successResponse(saved, 201);
  } catch (error) { return handleApiError(error); }
}
