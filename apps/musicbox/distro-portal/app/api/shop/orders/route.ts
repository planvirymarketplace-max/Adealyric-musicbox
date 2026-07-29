import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/app/api/auth/_helpers';
import { parsePagination, paginatedResponse, successResponse, errorResponse, handleApiError } from '@/app/api/_middleware';

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    const { page, limit, skip } = parsePagination(request);
    const url = new URL(request.url);
    const where: Record<string, unknown> = {};
    if (url.searchParams.get('status')) where.status = url.searchParams.get('status');

    const [orders, total] = await Promise.all([
      db.shopOrder.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
      db.shopOrder.count({ where }),
    ]);
    return paginatedResponse(orders, total, page, limit);
  } catch (error) { return handleApiError(error); }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    const body = await request.json();
    const { productId, quantity, fanEmail, fanName, shippingAddress } = body;

    const product = await db.shopProduct.findUnique({ where: { id: productId } });
    if (!product) return errorResponse('Product not found', 'NOT_FOUND', 404);

    const totalCents = product.priceCents * (quantity ?? 1);
    const order = await db.shopOrder.create({
      data: { userId: user.id, fanEmail: fanEmail ?? user.email, fanName: fanName ?? user.displayName, productId, quantity: quantity ?? 1, totalCents, totalAmount: totalCents, currency: 'USD', status: 'pending', items: [{ productId, quantity: quantity ?? 1, priceCents: product.priceCents }], shippingAddress: shippingAddress ?? null },
    });
    return successResponse(order, 201);
  } catch (error) { return handleApiError(error); }
}
