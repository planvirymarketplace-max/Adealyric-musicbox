import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { MetadataEngine } from '@/lib/metadata-engine';
import { requireAuth } from '@/app/api/auth/_helpers';
import { parsePagination, paginatedResponse, successResponse, handleApiError } from '@/app/api/_middleware';

const metadataEngine = new MetadataEngine();

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    const { page, limit, skip } = parsePagination(request);
    const url = new URL(request.url);

    const where: Record<string, unknown> = { tenantId: user.tenantId, deletedAt: null };
    if (url.searchParams.get('genre')) where.genre = url.searchParams.get('genre');
    if (url.searchParams.get('for_sale') === 'true') where.forSale = true;
    if (url.searchParams.get('sync_status')) where.syncStatus = url.searchParams.get('sync_status');
    const bpm = url.searchParams.get('bpm');
    if (bpm) where.bpm = parseInt(bpm);

    const [songs, total] = await Promise.all([
      db.catalogSong.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
      db.catalogSong.count({ where }),
    ]);
    return paginatedResponse(songs, total, page, limit);
  } catch (error) { return handleApiError(error); }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    const body = await request.json();

    const metadata = metadataEngine.createSongMetadata({ ...body, tenant_id: user.tenantId });

    const song = await db.catalogSong.create({
      data: {
        tenantId: user.tenantId, title: metadata.song.title, slug: metadata.song.slug,
        genre: metadata.song.genre, durationSeconds: metadata.song.duration_seconds,
        composer: metadata.song.composer, producer: metadata.song.producer,
        moodTags: metadata.song.mood_tags, isrc: metadata.isrc, iswc: metadata.iswc,
        masterOwner: metadata.song.master_owner, publishingOwner: metadata.song.publishing_owner,
        recordingYear: metadata.song.recording_year, explicit: metadata.song.explicit,
        language: metadata.song.language, bpm: metadata.song.bpm, key: metadata.song.key,
        energy: metadata.song.energy, valence: metadata.song.valence,
        stemsAvailable: metadata.song.stems_available, forSale: metadata.song.for_sale,
        alternateTitles: metadata.song.alternate_titles, splits: metadata.song.splits ?? [],
        visibleToRoles: metadata.song.visible_to_roles, distributionFlag: metadata.song.distribution_flag,
        distributionStatus: metadata.song.distribution_status, syncStatus: metadata.song.sync_status,
      },
    });
    return successResponse({ song, metadata: { cLine: metadata.cLine, pLine: metadata.pLine, imprint: metadata.imprint } }, 201);
  } catch (error) { return handleApiError(error); }
}
