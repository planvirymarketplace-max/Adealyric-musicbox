'use client';

import { Badge } from '@/components/ui/Badge';
import { formatDate } from '@/lib/format';
import { mockAvailabilityHolds } from '@/lib/mock-data';

export default function BookingCalendar() {
  const holds = mockAvailabilityHolds;
  const statusColors: Record<string, string> = { open: 'green', hold: 'amber', booked: 'red', blocked: 'gray' };

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-white">Availability Calendar</h1><p className="mt-1 text-sm text-white/50">Check available dates and plan your booking</p></div>
      <div className="space-y-3">
        {holds.map((h) => (
          <div key={h.id} className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center justify-between">
            <div><p className="text-sm font-medium text-white">{formatDate(h.date)}</p><p className="text-xs text-white/40">{h.label ?? 'No label'}</p></div>
            <Badge color={statusColors[h.status] ?? 'gray'}>{h.status}</Badge>
          </div>
        ))}
      </div>
    </div>
  );
}
