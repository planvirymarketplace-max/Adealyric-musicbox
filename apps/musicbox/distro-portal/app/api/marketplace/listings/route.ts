import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { MarketplaceEngine } from '@/lib/marketplace-engine';
import { requireAuth } from '@/app/api/auth/_helpers';
import { successResponse, handleApiError } from '@/app/api/_middleware';

const marketplaceEngine = new MarketplaceEngine();

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    const url = new URL(request.url);
    const filters = {
      genre: url.searchParams.get('genre')?.split(','),
      moodTags: url.searchParams.get('mood')?.split(','),
      bpmRange: url.searchParams.get('bpm_min') ? { min: parseInt(url.searchParams.get('bpm_min')!), max: parseInt(url.searchParams.get('bpm_max') ?? '200') } : undefined,
      priceRange: url.searchParams.get('price_min') ? { min: parseInt(url.searchParams.get('price_min')!), max: parseInt(url.searchParams.get('price_max') ?? '100000') } : undefined,
      oneStopOnly: url.searchParams.get('one_stop') === 'true',
      stemsAvailable: url.searchParams.get('stems') === 'true',
      searchTerm: url.searchParams.get('search') ?? undefined,
      sortBy: url.searchParams.get('sort') as any ?? undefined,
      maxResults: parseInt(url.searchParams.get('max') ?? '100'),
    };

    const songs = await db.catalogSong.findMany({ where: { tenantId: user.tenantId, forSale: true, isActive: true, deletedAt: null } });
    const results = marketplaceEngine.browseListings(filters, songs as any);
    return successResponse(results);
  } catch (error) { return handleApiError(error); }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    const body = await request.json();
    const { songId, askingPrice, negotiable } = body;

    const song = await db.catalogSong.findUnique({ where: { id: songId } });
    if (!song) return successResponse({ error: 'Song not found' });

    const seller = { id: user.id, name: user.displayName ?? user.email, bio: null, specialties: [], genres: [song.genre], proAffiliation: null, experienceYears: 0, rating: 0, completedProjects: 0, avatarUrl: null };
    const listing = marketplaceEngine.submitSongForSale(song as any, seller, askingPrice, negotiable ?? true);

    await db.catalogSong.update({ where: { id: songId }, data: { forSale: true, askingPriceCents: Math.round(askingPrice * 100), askingPriceNegotiable: negotiable ?? true } });
    return successResponse(listing, 201);
  } catch (error) { return handleApiError(error); }
}
