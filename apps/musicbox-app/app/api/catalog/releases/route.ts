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
    const where: Record<string, unknown> = {};
    if (url.searchParams.get('type')) where.type = url.searchParams.get('type');
    if (url.searchParams.get('status')) where.status = url.searchParams.get('status');

    const [releases, total] = await Promise.all([
      db.release.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' }, include: { tracks: true } }),
      db.release.count({ where }),
    ]);
    return paginatedResponse(releases, total, page, limit);
  } catch (error) { return handleApiError(error); }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    const body = await request.json();
    const { title, type, artistId, genre, releaseDate, explicit, ...rest } = body;

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const year = releaseDate ? new Date(releaseDate).getFullYear() : new Date().getFullYear();
    const holder = rest.masterOwner ?? 'Independent';
    const cLine = metadataEngine.generateCLine(year, holder);
    const pLine = metadataEngine.generatePLine(year, rest.publishingOwner ?? holder);
    const imprint = metadataEngine.createImprint(holder, year);
    const upc = metadataEngine.assignUPC();

    const release = await db.release.create({
      data: { title, slug, type: type ?? 'single', artistId, genre, releaseDate: releaseDate ? new Date(releaseDate) : null,
        explicit: explicit ?? false, upc, cLine, pLine, imprint: imprint.fullImprint, status: 'draft',
        metadata: rest.metadata ?? {}, priceCents: rest.priceCents ?? 0, isFree: rest.isFree ?? false },
    });
    return successResponse({ release, generated: { cLine, pLine, imprint, upc } }, 201);
  } catch (error) { return handleApiError(error); }
}
