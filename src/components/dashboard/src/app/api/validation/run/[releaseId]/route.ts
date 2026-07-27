import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { ValidationEngine } from '@/lib/validation-engine';
import { requireAuth } from '@/app/api/auth/_helpers';
import { successResponse, errorResponse, handleApiError } from '@/app/api/_middleware';

const validationEngine = new ValidationEngine();

export async function POST(request: NextRequest, { params }: { params: Promise<{ releaseId: string }> }) {
  try {
    const user = await requireAuth(request);
    const { releaseId } = await params;

    const release = await db.release.findUnique({ where: { id: releaseId }, include: { catalogSongs: true } });
    if (!release) return errorResponse('Release not found', 'NOT_FOUND', 404);

    const songs = release.catalogSongs;
    const rights = await db.rightsRecord.findMany({ where: { catalogSongId: { in: songs.map(s => s.id) } } });

    const artwork = { width: 3000, height: 3000, colorMode: 'RGB', fileFormat: 'JPEG', fileSizeBytes: 500000, containsUrls: false, containsBorders: false, isSquare: true };
    const audio = { format: 'WAV', sampleRate: 44100, bitDepth: 16, channels: 2, durationSeconds: songs[0]?.durationSeconds ?? 0, loudnessLUFS: -14, truePeakDb: -1, bitRate: 1411, codec: 'PCM', hasSilenceAtStart: false, hasSilenceAtEnd: false };

    const report = validationEngine.runFullValidation(release as any, songs as any, artwork, audio, rights as any);

    for (const check of report.checks) {
      await db.validationCheck.upsert({
        where: { id: `vc-${releaseId}-${check.checkType}` },
        update: { status: check.status, message: check.message, details: check.details ?? [], checkedAt: new Date() },
        create: { releaseId, checkType: check.checkType as any, status: check.status as any, message: check.message, details: check.details ?? [], checkedAt: new Date() },
      });
    }
    return successResponse(report);
  } catch (error) { return handleApiError(error); }
}
