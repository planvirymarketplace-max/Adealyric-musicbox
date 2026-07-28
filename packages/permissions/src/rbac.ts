import { prisma } from '@musicbox/database/client';

export enum PermissionAction {
  // Catalog
  RELEASE_VIEW = 'release:view',
  RELEASE_CREATE = 'release:create',
  RELEASE_EDIT = 'release:edit',
  RELEASE_DELETE = 'release:delete',
  RELEASE_PUBLISH = 'release:publish',
  
  // Sync
  SYNC_VIEW = 'sync:view',
  SYNC_SUBMIT = 'sync:submit',
  SYNC_APPROVE = 'sync:approve',
  SYNC_NEGOTIATE = 'sync:negotiate',
  
  // Royalty
  ROYALTY_VIEW = 'royalty:view',
  ROYALTY_MANAGE = 'royalty:manage',
  
  // Admin
  ADMIN_VIEW = 'admin:view',
  ADMIN_MANAGE_USERS = 'admin:manage_users',
  ADMIN_MANAGE_ROLES = 'admin:manage_roles',
  ADMIN_MANAGE_ORG = 'admin:manage_org',
}

export async function getUserPermissions(userId: string, organizationId: string) {
  const membership = await prisma.membership.findUnique({
    where: {
      userId_organizationId: {
        userId,
        organizationId,
      },
    },
    include: {
      role: {
        include: {
          permissions: true,
        },
      },
    },
  });

  if (!membership) {
    return [];
  }

  return membership.role.permissions.map((p) => p.action);
}

export async function hasPermission(
  userId: string,
  organizationId: string,
  action: PermissionAction
): Promise<boolean> {
  const permissions = await getUserPermissions(userId, organizationId);
  return permissions.includes(action);
}

export async function hasAnyPermission(
  userId: string,
  organizationId: string,
  actions: PermissionAction[]
): Promise<boolean> {
  const permissions = await getUserPermissions(userId, organizationId);
  return actions.some((action) => permissions.includes(action));
}

export async function hasAllPermissions(
  userId: string,
  organizationId: string,
  actions: PermissionAction[]
): Promise<boolean> {
  const permissions = await getUserPermissions(userId, organizationId);
  return actions.every((action) => permissions.includes(action));
}
