import { NextRequest } from 'next/server';
import { getAuthUser, requireAuth } from '@/app/api/auth/_helpers';
import { successResponse, errorResponse, handleApiError } from '@/app/api/_middleware';

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) return errorResponse('No active session', 'NO_SESSION', 401);
    return successResponse({ user });
  } catch (error) { return handleApiError(error); }
}

export async function DELETE(request: NextRequest) {
  try {
    const response = successResponse({ message: 'Logged out successfully' });
    response.cookies.set('session-token', '', { httpOnly: true, secure: true, sameSite: 'lax', maxAge: 0 });
    return response;
  } catch (error) { return handleApiError(error); }
}
