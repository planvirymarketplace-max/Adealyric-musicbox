import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { RightsEngine } from '@/lib/rights-engine';
import { requireAuth } from '@/app/api/auth/_helpers';
import { successResponse, errorResponse, handleApiError } from '@/app/api/_middleware';

const rightsEngine = new RightsEngine();

export async function GET(request: NextRequest, { params }: { params: Promise<{ songId: string }> }) {
  try {
    const user = await requireAuth(request);
    const { songId } = await params;

    const song = await db.catalogSong.findUnique({ where: { id: songId } });
    if (!song) return errorResponse('Song not found', 'NOT_FOUND', 404);

    const rights = await db.rightsRecord.findMany({ where: { catalogSongId: songId } });
    const territories = rights.map(r => r.territory).concat(['US', 'GB', 'DE', 'FR', 'JP', 'AU', 'WW']);
    const matrix = rightsEngine.buildTerritoryMatrix(rights as any, territories);
    return successResponse(matrix);
  } catch (error) { return handleApiError(error); }
}
