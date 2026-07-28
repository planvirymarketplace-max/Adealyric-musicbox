'use client';

import { Badge, StatusBadge } from '@/components/ui/Badge';
import { formatDate } from '@/lib/format';
import { mockPortalRequests, mockPortalUsers } from '@/lib/mock-data';

const TYPE_COLORS: Record<string, 'blue' | 'purple' | 'teal' | 'amber' | 'pink'> = { booking: 'blue', sync: 'purple', collab: 'teal', purchase: 'amber', custom_write: 'pink' };

export default function AdminRequests() {
  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-white">Requests Inbox</h1><p className="mt-1 text-sm text-white/50">Review and manage all portal requests</p></div>
      <div className="space-y-3">
        {mockPortalRequests.map((req) => {
          const user = mockPortalUsers.find((u) => u.id === req.user_id);
          return (
            <div key={req.id} className="bg-white/5 border border-white/10 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Badge color={TYPE_COLORS[req.type] ?? 'gray'} size="sm">{req.type.replace(/_/g, ' ')}</Badge>
                  <div><p className="text-sm font-medium text-white">{user?.display_name ?? 'Unknown'}</p><p className="text-xs text-white/40">{((req.payload as Record<string, unknown>)?.usageType as string) ?? ((req.payload as Record<string, unknown>)?.eventName as string) ?? req.type}</p></div>
                </div>
                <div className="flex items-center gap-2"><StatusBadge status={req.status} /><span className="text-xs text-white/30">{formatDate(req.created_at)}</span></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
