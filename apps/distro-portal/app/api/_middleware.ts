import { NextResponse } from 'next/server';
import { AuthError } from './auth/_helpers';

/** Consistent error response format */
export function errorResponse(error: string, code: string, status: number = 400): NextResponse {
  return NextResponse.json({ error, code }, { status });
}

/** Consistent success response with data */
export function successResponse(data: unknown, status: number = 200): NextResponse {
  return NextResponse.json(data, { status });
}

/** Paginated response wrapper */
export function paginatedResponse(data: unknown[], total: number, page: number, limit: number): NextResponse {
  return NextResponse.json({
    data,
    pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
  });
}

/** Parse pagination query params */
export function parsePagination(request: NextRequest): { page: number; limit: number; skip: number } {
  const url = new URL(request.url);
  const page = Math.max(1, parseInt(url.searchParams.get('page') || '1'));
  const limit = Math.min(100, Math.max(1, parseInt(url.searchParams.get('limit') || '20')));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}

/** Handle API errors consistently — catches AuthError and generic errors */
export function handleApiError(error: unknown): NextResponse {
  if (error instanceof AuthError) {
    return errorResponse(error.message, error.code, error.statusCode);
  }
  if (error instanceof Error) {
    return errorResponse(error.message, 'INTERNAL_ERROR', 500);
  }
  return errorResponse('An unexpected error occurred', 'UNKNOWN_ERROR', 500);
}

/** Parse JSON body from request safely */
export async function parseBody<T>(request: NextRequest): Promise<T> {
  const body = await request.json();
  return body as T;
}
