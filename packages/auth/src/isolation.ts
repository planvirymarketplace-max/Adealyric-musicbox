import { createTenantPrismaClient, prisma as basePrisma } from '@musicbox/database';

let tenantPrismaInstance: any = null;

/**
 * Get a Prisma client instance scoped to the current tenant
 * This ensures all queries are automatically filtered by organizationId
 */
export function getTenantPrisma(organizationId: string) {
  if (!tenantPrismaInstance) {
    tenantPrismaInstance = createTenantPrismaClient(basePrisma, organizationId);
  }
  return tenantPrismaInstance;
}

/**
 * Reset the tenant Prisma instance (useful for testing or context switching)
 */
export function resetTenantPrisma() {
  tenantPrismaInstance = null;
}

/**
 * Execute a callback with tenant-scoped Prisma client
 */
export async function withTenantPrisma<T>(
  organizationId: string,
  callback: (prisma: any) => Promise<T>
): Promise<T> {
  const tenantPrisma = getTenantPrisma(organizationId);
  return callback(tenantPrisma);
}
