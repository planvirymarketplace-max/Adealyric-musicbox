'use client';

import { PageHeader } from '@/components/layout/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { formatDate } from '@/lib/format';
import { mockBookings } from '@/lib/mock-data';

export default function BookingsCalendarPage() {
  const bookings = mockBookings.sort((a, b) => a.event_date.localeCompare(b.event_date));

  return (
    <div>
      <PageHeader title="Bookings Calendar" description="Calendar view of all bookings" />
      <div className="space-y-3">
        {bookings.map((b) => (
          <div key={b.id} className="flex items-center gap-4 p-4 rounded-lg bg-white border border-neutral-200 hover:bg-neutral-50">
            <div className="flex-shrink-0 text-center w-14"><p className="text-xs text-neutral-400 uppercase">{new Date(b.event_date).toLocaleDateString('en', { month: 'short' })}</p><p className="text-2xl font-bold text-neutral-900">{new Date(b.event_date).getDate()}</p></div>
            <div className="flex-1"><p className="text-sm font-medium text-neutral-900">{b.event_name}</p><p className="text-xs text-neutral-500">{b.venue_name}</p></div>
            <Badge color={b.status === 'deposit_paid' ? 'green' : b.status === 'confirmed' ? 'blue' : b.status === 'contract_sent' ? 'blue' : 'gray'}>{b.status.replace(/_/g, ' ')}</Badge>
          </div>
        ))}
      </div>
    </div>
  );
}
