import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { RoyaltyEngine } from '@/lib/royalty-engine';
import { requireAuth } from '@/app/api/auth/_helpers';
import { successResponse, errorResponse, handleApiError } from '@/app/api/_middleware';

const royaltyEngine = new RoyaltyEngine();

export async function GET(request: NextRequest, { params }: { params: Promise<{ dsp: string }> }) {
  try {
    const user = await requireAuth(request);
    const { dsp } = await params;

    const statement = await db.royaltyStatement.findFirst({ where: { dspSource: dsp, status: 'finalized' }, orderBy: { createdAt: 'desc' } });
    if (!statement) return errorResponse('No statement found for this DSP', 'NOT_FOUND', 404);

    const result = royaltyEngine.calculatePerStreamRate(statement as any);
    return successResponse(result);
  } catch (error) { return handleApiError(error); }
}
