import { prisma } from '@musicbox/database/client';

export interface AuditLogEntry {
  userId?: string;
  organizationId: string;
  action: string;
  resourceType?: string;
  resourceId?: string;
  metadata?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
}

/**
 * Log an audit event
 */
export async function logAuditEvent(entry: AuditLogEntry) {
  try {
    // In a real implementation, this would write to an AuditLog table
    // For now, we'll log to console
    console.log('[AUDIT]', {
      timestamp: new Date().toISOString(),
      ...entry,
    });

    // TODO: Implement actual database logging when AuditLog model is added
    // await prisma.auditLog.create({
    //   data: {
    //     userId: entry.userId,
    //     organizationId: entry.organizationId,
    //     action: entry.action,
    //     resourceType: entry.resourceType,
    //     resourceId: entry.resourceId,
    //     metadata: entry.metadata,
    //     ipAddress: entry.ipAddress,
    //     userAgent: entry.userAgent,
    //   },
    // });
  } catch (error) {
    console.error('Failed to log audit event:', error);
  }
}

/**
 * Log authentication events
 */
export async function logAuthEvent(
  type: 'login' | 'logout' | 'failed_login',
  userId?: string,
  organizationId?: string,
  metadata?: Record<string, any>
) {
  await logAuditEvent({
    userId,
    organizationId: organizationId || '',
    action: `auth.${type}`,
    metadata,
  });
}

/**
 * Log data access events
 */
export async function logDataAccess(
  action: string,
  organizationId: string,
  userId: string,
  resourceType?: string,
  resourceId?: string
) {
  await logAuditEvent({
    userId,
    organizationId,
    action: `data.${action}`,
    resourceType,
    resourceId,
  });
}

/**
 * Log permission checks
 */
export async function logPermissionCheck(
  userId: string,
  organizationId: string,
  action: string,
  allowed: boolean
) {
  await logAuditEvent({
    userId,
    organizationId,
    action: `permission.${action}`,
    metadata: { allowed },
  });
}
