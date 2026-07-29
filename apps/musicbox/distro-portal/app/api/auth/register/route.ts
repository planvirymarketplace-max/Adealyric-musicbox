import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';
import { generateToken } from '@/app/api/auth/_helpers';
import { errorResponse, handleApiError } from '@/app/api/_middleware';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, role = 'label', displayName, orgName, tenantId = 'tenant-1' } = body;

    if (!email || !password) return errorResponse('Email and password required', 'MISSING_FIELDS', 400);
    if (password.length < 8) return errorResponse('Password must be at least 8 characters', 'WEAK_PASSWORD', 400);

    const existing = await db.portalUser.findUnique({ where: { tenantId_email: { tenantId, email } } });
    if (existing) return errorResponse('Email already registered', 'EMAIL_EXISTS', 409);

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await db.portalUser.create({
      data: {
        tenantId, email, passwordHash, role, displayName, orgName,
        secondaryRoles: [], status: 'pending', socialLinks: {},
      },
    });

    const authUser = { id: user.id, email: user.email, role: user.role, tenantId: user.tenantId, displayName: user.displayName, orgName: user.orgName, status: user.status };
    const token = await generateToken(authUser);

    return NextResponse.json({ user: authUser, token }, { status: 201 });
  } catch (error) { return handleApiError(error); }
}
