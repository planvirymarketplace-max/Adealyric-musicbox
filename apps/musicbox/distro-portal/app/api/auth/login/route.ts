import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';
import { generateToken } from '@/app/api/auth/_helpers';
import { errorResponse, handleApiError } from '@/app/api/_middleware';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, tenantId = 'tenant-1' } = body;

    if (!email || !password) return errorResponse('Email and password required', 'MISSING_FIELDS', 400);

    const user = await db.portalUser.findUnique({ where: { tenantId_email: { tenantId, email } } });
    if (!user) return errorResponse('Invalid credentials', 'INVALID_CREDENTIALS', 401);
    if (!user.passwordHash) return errorResponse('Account has no password set', 'NO_PASSWORD', 401);

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return errorResponse('Invalid credentials', 'INVALID_CREDENTIALS', 401);

    if (user.status === 'suspended') return errorResponse('Account suspended', 'ACCOUNT_SUSPENDED', 403);

    await db.portalUser.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });

    const authUser = { id: user.id, email: user.email, role: user.role, tenantId: user.tenantId, displayName: user.displayName, orgName: user.orgName, status: user.status };
    const token = await generateToken(authUser);

    const response = NextResponse.json({ user: authUser, token });
    response.cookies.set('session-token', token, { httpOnly: true, secure: true, sameSite: 'lax', maxAge: 86400 });
    return response;
  } catch (error) { return handleApiError(error); }
}
