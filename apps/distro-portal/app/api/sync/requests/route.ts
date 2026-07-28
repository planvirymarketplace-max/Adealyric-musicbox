import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { SyncEngine } from '@/lib/sync-engine';
import { requireAuth } from '@/app/api/auth/_helpers';
import { parsePagination, paginatedResponse, successResponse, handleApiError } from '@/app/api/_middleware';

const syncEngine = new SyncEngine();

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    const { page, limit, skip } = parsePagination(request);
    const url = new URL(request.url);
    const where: Record<string, unknown> = {};
    if (url.searchParams.get('status')) where.status = url.searchParams.get('status');
    if (url.searchParams.get('song_id')) where.catalogSongId = url.searchParams.get('song_id');

    const [requests, total] = await Promise.all([
      db.syncLicenseRequest.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' }, include: { catalogSong: true } }),
      db.syncLicenseRequest.count({ where }),
    ]);
    return paginatedResponse(requests, total, page, limit);
  } catch (error) { return handleApiError(error); }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    const body = await request.json();
    const { songId, requesterName, requesterOrg, requesterEmail, usageType, territory, termMonths, media, budgetRange, notes } = body;

    const syncRequest = syncEngine.createLicenseRequest(songId, { name: requesterName, org: requesterOrg, email: requesterEmail, phone: null, role: 'supervisor' },
      { type: usageType, territory, termMonths, media, description: notes, exclusivity: false });

    const saved = await db.syncLicenseRequest.create({
      data: { catalogSongId: songId, requesterName, requesterOrg, requesterEmail, requesterType: usageType as any, usageType, territory, termMonths, media: media ?? [], budgetRange, status: 'submitted', notes },
    });
    return successResponse(saved, 201);
  } catch (error) { return handleApiError(error); }
}
