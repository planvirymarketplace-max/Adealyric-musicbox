import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@musicbox/database/client';
import { createSession } from '@musicbox/auth';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        memberships: {
          include: {
            organization: true,
            role: {
              include: { permissions: true },
            },
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // TODO: Verify password hash
    // For now, skip password verification

    // Get the user's primary organization (first membership)
    const primaryMembership = user.memberships[0];
    if (!primaryMembership) {
      return NextResponse.json(
        { error: 'No organization found for user' },
        { status: 400 }
      );
    }

    // Create session
    const sessionData = await createSession(
      user.id,
      primaryMembership.organizationId,
      primaryMembership.roleId
    );

    // Return session data
    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatarUrl: user.avatarUrl,
      },
      tenant: {
        id: primaryMembership.organization.id,
        name: primaryMembership.organization.name,
        slug: primaryMembership.organization.slug,
        type: primaryMembership.organization.type,
      },
      role: {
        id: primaryMembership.role.id,
        name: primaryMembership.role.name,
        permissions: primaryMembership.role.permissions.map((p) => p.action),
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
