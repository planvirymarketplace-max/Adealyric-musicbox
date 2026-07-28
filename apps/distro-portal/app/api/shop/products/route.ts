import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/app/api/auth/_helpers';
import { parsePagination, paginatedResponse, successResponse, handleApiError } from '@/app/api/_middleware';

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    const { page, limit, skip } = parsePagination(request);
    const url = new URL(request.url);
    const where: Record<string, unknown> = { isActive: true };
    if (url.searchParams.get('type')) where.type = url.searchParams.get('type');
    if (url.searchParams.get('category')) where.category = url.searchParams.get('category');
    if (url.searchParams.get('artist_id')) where.artistId = url.searchParams.get('artist_id');

    const [products, total] = await Promise.all([
      db.shopProduct.findMany({ where, skip, take: limit, orderBy: { sortOrder: 'asc' } }),
      db.shopProduct.count({ where }),
    ]);
    return paginatedResponse(products, total, page, limit);
  } catch (error) { return handleApiError(error); }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    const body = await request.json();
    const { name, slug, description, category, priceCents, currency, type, imageUrl, inventoryCount, artistId } = body;

    const product = await db.shopProduct.create({
      data: { name, slug, description, category, priceCents, currency: currency ?? 'USD', type: type ?? 'merch', imageUrl, inventoryCount, artistId, isActive: true, status: 'active' },
    });
    return successResponse(product, 201);
  } catch (error) { return handleApiError(error); }
}
