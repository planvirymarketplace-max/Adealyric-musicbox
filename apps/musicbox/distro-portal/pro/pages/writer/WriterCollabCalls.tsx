'use client';

import { Badge } from '@/components/ui/Badge';
import { formatDate } from '@/lib/format';
import { Clock } from 'lucide-react';
import { mockCollabCalls } from '@/lib/mock-data';

export default function WriterCollabCalls() {
  const calls = mockCollabCalls.filter((c) => c.status === 'open');

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-white">Open Collaboration Calls</h1><p className="mt-1 text-sm text-white/50">Browse open calls and submit your pitch</p></div>
      <div className="space-y-4">
        {calls.map((call) => (
          <div key={call.id} className="bg-white/5 border border-white/10 rounded-xl p-5">
            <div className="flex items-start justify-between mb-2"><h3 className="font-semibold text-white">{call.title}</h3>{call.deadline && <Badge color="amber"><Clock size={12} /> {formatDate(call.deadline)}</Badge>}</div>
            <p className="text-sm text-white/50 mb-3">{call.description}</p>
            <div className="pt-3 border-t border-white/10"><p className="text-xs uppercase tracking-wide text-white/30 mb-1">What&apos;s needed</p><p className="text-sm text-white/70">{call.what_needed}</p></div>
          </div>
        ))}
      </div>
    </div>
  );
}
