import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { MetadataEngine } from '@/lib/metadata-engine';
import { buildDdexErnXml } from '@/lib/ddex-builder';
import { requireAuth } from '@/app/api/auth/_helpers';
import { successResponse, errorResponse, handleApiError } from '@/app/api/_middleware';

const metadataEngine = new MetadataEngine();

export async function GET(request: NextRequest, { params }: { params: Promise<{ releaseId: string }> }) {
  try {
    const user = await requireAuth(request);
    const { releaseId } = await params;

    const release = await db.release.findUnique({ where: { id: releaseId }, include: { catalogSongs: true } });
    if (!release) return errorResponse('Release not found', 'NOT_FOUND', 404);

    const songs = release.catalogSongs;
    if (!songs || songs.length === 0) return errorResponse('No songs on this release', 'NO_SONGS', 400);

    const ernMessage = metadataEngine.buildDdexErn(songs[0] as any, release as any);
    const xml = buildDdexErnXml(ernMessage);

    return successResponse({ releaseId, xml, message: ernMessage });
  } catch (error) { return handleApiError(error); }
}
