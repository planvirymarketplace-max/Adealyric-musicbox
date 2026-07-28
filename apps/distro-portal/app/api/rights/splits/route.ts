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

    const [splits, total] = await Promise.all([
      db.royaltySplit.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
      db.royaltySplit.count({ where }),
    ]);
    return paginatedResponse(splits, total, page, limit);
  } catch (error) { return handleApiError(error); }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    const body = await request.json();
    const { catalogSongId, participants } = body;

    const song = await db.catalogSong.findUnique({ where: { id: catalogSongId } });
    const songs = song ? [song as any] : undefined;

    const sheet = rightsEngine.createSplitSheet(catalogSongId, participants, songs);

    for (const p of participants) {
      await db.royaltySplit.create({ data: { catalogSongId, participantName: p.name, participantRole: p.role, sharePct: p.sharePct, ipiCae: p.ipiCae, pro: p.proAffiliation } });
    }
    return successResponse({ splitSheet: sheet }, 201);
  } catch (error) { return handleApiError(error); }
}
