import { prisma } from '@musicbox/database/client';

export async function getTenantFromSubdomain(subdomain: string) {
  return await prisma.organization.findUnique({
    where: { slug: subdomain },
    include: {
      memberships: {
        include: {
          user: true,
          role: true,
        },
      },
    },
  });
}

export async function getTenantFromDomain(domain: string) {
  return await prisma.organization.findUnique({
    where: { domain },
    include: {
      memberships: {
        include: {
          user: true,
          role: true,
        },
      },
    },
  });
}

export async function getTenantById(tenantId: string) {
  return await prisma.organization.findUnique({
    where: { id: tenantId },
    include: {
      memberships: {
        include: {
          user: true,
          role: true,
        },
      },
    },
  });
}
