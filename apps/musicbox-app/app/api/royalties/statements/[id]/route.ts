import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/app/api/auth/_helpers';
import { successResponse, errorResponse, handleApiError } from '@/app/api/_middleware';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAuth(request);
    const { id } = await params;
    const statement = await db.royaltyStatement.findUnique({ where: { id } });
    if (!statement) return errorResponse('Statement not found', 'NOT_FOUND', 404);
    return successResponse(statement);
  } catch (error) { return handleApiError(error); }
}
