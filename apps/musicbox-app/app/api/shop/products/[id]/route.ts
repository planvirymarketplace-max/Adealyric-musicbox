import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/app/api/auth/_helpers';
import { successResponse, errorResponse, handleApiError } from '@/app/api/_middleware';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAuth(request);
    const { id } = await params;
    const product = await db.shopProduct.findUnique({ where: { id } });
    if (!product) return errorResponse('Product not found', 'NOT_FOUND', 404);
    return successResponse(product);
  } catch (error) { return handleApiError(error); }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAuth(request);
    const { id } = await params;
    const body = await request.json();
    const product = await db.shopProduct.update({ where: { id }, data: { ...body, updatedAt: new Date() } });
    return successResponse(product);
  } catch (error) { return handleApiError(error); }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAuth(request);
    const { id } = await params;
    await db.shopProduct.update({ where: { id }, data: { isActive: false, status: 'archived' } });
    return successResponse({ message: 'Product archived' });
  } catch (error) { return handleApiError(error); }
}
