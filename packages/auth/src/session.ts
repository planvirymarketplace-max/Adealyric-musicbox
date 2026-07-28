import { prisma } from '@musicbox/database/client';

export interface SessionData {
  userId: string;
  organizationId: string;
  roleId: string;
  role: string;
}

export async function createSession(userId: string, organizationId: string, roleId: string) {
  const role = await prisma.role.findUnique({
    where: { id: roleId },
    include: { permissions: true },
  });

  if (!role) {
    throw new Error('Role not found');
  }

  return {
    userId,
    organizationId,
    roleId,
    role: role.name,
    permissions: role.permissions.map((p) => p.action),
  };
}

export async function validateSession(session: SessionData) {
  const membership = await prisma.membership.findUnique({
    where: {
      userId_organizationId: {
        userId: session.userId,
        organizationId: session.organizationId,
      },
    },
    include: {
      role: {
        include: { permissions: true },
      },
    },
  });

  if (!membership) {
    return null;
  }

  return {
    userId: session.userId,
    organizationId: session.organizationId,
    roleId: membership.roleId,
    role: membership.role.name,
    permissions: membership.role.permissions.map((p) => p.action),
  };
}

export function hasPermission(session: SessionData, action: string): boolean {
  // For now, this is a placeholder. In a real implementation,
  // we'd check against the session's permissions
  return true;
}
