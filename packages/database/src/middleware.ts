import { Prisma } from '@prisma/client';

/**
 * Prisma middleware to automatically filter queries by organizationId
 * This enforces tenant isolation at the database level
 */
export function createTenantMiddleware(organizationId: string) {
  return async (params: Prisma.MiddlewareParams, next: Prisma.MiddlewareNext) => {
    // Skip for models that don't have organizationId
    const modelsWithoutTenant = [
      'User',
      'Organization',
      'Role',
      'Permission',
      'Membership',
      'SyncListing',
      'DealRoom',
      'LedgerEntry',
      'AiJob',
      'CollabDoc',
    ];

    if (modelsWithoutTenant.includes(params.model)) {
      return next(params);
    }

    // Apply organizationId filter for read operations
    if (params.action === 'findMany' || params.action === 'findFirst' || params.action === 'findUnique') {
      params.args = params.args || {};
      
      // For findUnique, we need to convert to findFirst with organizationId
      if (params.action === 'findUnique') {
        params.action = 'findFirst';
        params.args.where = {
          ...params.args.where,
          organizationId,
        };
      } else {
        params.args.where = {
          ...params.args.where,
          organizationId,
        };
      }
    }

    // Apply organizationId for write operations
    if (
      params.action === 'create' ||
      params.action === 'update' ||
      params.action === 'delete' ||
      params.action === 'createMany' ||
      params.action === 'updateMany' ||
      params.action === 'deleteMany'
    ) {
      params.args = params.args || {};

      if (params.action === 'create') {
        params.args.data = {
          ...params.args.data,
          organizationId,
        };
      } else if (params.action === 'createMany') {
        params.args.data = Array.isArray(params.args.data)
          ? params.args.data.map((item) => ({ ...item, organizationId }))
          : { ...params.args.data, organizationId };
      } else if (params.action === 'update' || params.action === 'updateMany') {
        params.args.where = {
          ...params.args.where,
          organizationId,
        };
      } else if (params.action === 'delete' || params.action === 'deleteMany') {
        params.args.where = {
          ...params.args.where,
          organizationId,
        };
      }
    }

    return next(params);
  };
}

/**
 * Creates a Prisma client with tenant isolation middleware
 */
export function createTenantPrismaClient(
  prisma: any,
  organizationId: string
) {
  prisma.$use(createTenantMiddleware(organizationId));
  return prisma;
}
