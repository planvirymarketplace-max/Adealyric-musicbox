'use client';

import { useProAuth } from '@/lib/auth';
import { StatusBadge } from '@/components/ui/Badge';
import { formatDate } from '@/lib/format';
import { mockPortalRequests } from '@/lib/mock-data';

export default function WriterSubmissions() {
  const { portalUser } = useProAuth();
  if (!portalUser) return null;

  const submissions = mockPortalRequests.filter((r) => r.user_id === portalUser.id);

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-white">My Submissions</h1><p className="mt-1 text-sm text-white/50">Track the status of your pitches and submissions</p></div>
      <div className="space-y-3">
        {submissions.length === 0 ? <p className="text-white/30 text-center py-12">No submissions yet</p> : (
          submissions.map((req) => (
            <div key={req.id} className="bg-white/5 border border-white/10 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white">{(req.payload as Record<string, unknown>)?.title as string ?? (req.payload as Record<string, unknown>)?.songTitle as string ?? req.type}</p>
                  <p className="text-xs text-white/40 mt-0.5">{req.type.replace(/_/g, ' ')} · {formatDate(req.created_at)}</p>
                </div>
                <StatusBadge status={req.status} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
