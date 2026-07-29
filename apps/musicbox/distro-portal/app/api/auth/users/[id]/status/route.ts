import { NextRequest, NextResponse } from 'next/server';
import { requireRole } from '@/app/api/auth/_helpers';
import { db } from '@/lib/db';
import { handleApiError, errorResponse } from '@/app/api/_middleware';

/** PUT — Update a user's status (approve/reject/suspend). Only admins can do this. */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireRole(request, ['admin']);

    const { id } = await params;
    const body = await request.json();
    const { status } = body as { status: string };

    // Validate status value
    const validStatuses = ['approved', 'rejected', 'suspended', 'pending'];
    if (!validStatuses.includes(status)) {
      return errorResponse(`Invalid status '${status}'. Must be one of: ${validStatuses.join(',')}`, 'INVALID_STATUS', 400);
    }

    const user = await db.portalUser.findUnique({ where: { id } });
    if (!user) return errorResponse('User not found', 'USER_NOT_FOUND', 404);

    const updated = await db.portalUser.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json({
      user: {
        id: updated.id,
        email: updated.email,
        role: updated.role,
        tenantId: updated.tenantId,
        displayName: updated.displayName,
        orgName: updated.orgName,
        status: updated.status,
      },
      action: `status changed to '${status}' by admin ${admin.email}`,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
