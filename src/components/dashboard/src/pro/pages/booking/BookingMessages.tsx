'use client';

import { formatDate } from '@/lib/format';
import { mockMessageThreads, mockMessages } from '@/lib/mock-data';
import { Badge } from '@/components/ui/Badge';

export default function BookingMessages() {
  const threads = mockMessageThreads.filter((t) => t.subject?.includes('Booking'));

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-white">Messages</h1><p className="mt-1 text-sm text-white/50">Communication with the artist team about bookings</p></div>
      <div className="space-y-3">
        {threads.length === 0 ? <p className="text-white/30 text-center py-12">No booking messages yet</p> : (
          threads.map((t) => {
            const msgs = mockMessages.filter((m) => m.thread_id === t.id);
            return (
              <div key={t.id} className="bg-white/5 border border-white/10 rounded-xl p-4">
                <p className="text-sm font-semibold text-white">{t.subject}</p>
                <p className="text-xs text-white/40 mt-0.5">{msgs.length} messages · {formatDate(t.created_at)}</p>
                {msgs.slice(0, 2).map((m) => <div key={m.id} className="mt-2 p-2 rounded-lg bg-white/10"><p className="text-xs text-white/60">{m.body}</p></div>)}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
