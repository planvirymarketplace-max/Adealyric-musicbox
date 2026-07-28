'use client';

import { StatusBadge } from '@/components/ui/Badge';
import { formatDate, formatCents } from '@/lib/format';
import { mockBookings } from '@/lib/mock-data';

export default function BookingMyBookings() {
  const bookings = mockBookings;

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-white">My Bookings</h1><p className="mt-1 text-sm text-white/50">Track all your booking requests and confirmed shows</p></div>
      <div className="space-y-3">
        {bookings.map((b) => (
          <div key={b.id} className="bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div><p className="text-sm font-semibold text-white">{b.event_name}</p><p className="text-xs text-white/40 mt-0.5">{b.venue_name} · {formatDate(b.event_date)}</p></div>
              <div className="text-right"><p className="text-sm font-medium text-white">{formatCents(b.fee_cents)}</p><StatusBadge status={b.status} /></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
