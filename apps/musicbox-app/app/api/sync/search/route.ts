import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { SyncEngine } from '@/lib/sync-engine';
import { requireAuth } from '@/app/api/auth/_helpers';
import { successResponse, handleApiError } from '@/app/api/_middleware';

const syncEngine = new SyncEngine();

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    const url = new URL(request.url);

    const filters = {
      genre: url.searchParams.get('genre')?.split(','),
      moodTags: url.searchParams.get('mood')?.split(','),
      bpmRange: url.searchParams.get('bpm_min') ? { min: parseInt(url.searchParams.get('bpm_min')!), max: parseInt(url.searchParams.get('bpm_max') ?? '200') } : undefined,
      searchTerm: url.searchParams.get('search') ?? undefined,
      oneStopOnly: url.searchParams.get('one_stop') === 'true',
      stemsAvailable: url.searchParams.get('stems') === 'true',
      maxResults: parseInt(url.searchParams.get('max') ?? '50'),
    };

    const songs = await db.catalogSong.findMany({ where: { tenantId: user.tenantId, isActive: true, deletedAt: null } });
    const rights = await db.rightsRecord.findMany({ where: { catalogSongId: { in: songs.map(s => s.id) } } });

    const results = syncEngine.searchCatalog(filters as any, songs as any, rights as any);
    return successResponse(results);
  } catch (error) { return handleApiError(error); }
}
