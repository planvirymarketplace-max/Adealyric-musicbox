'use client';

import { useRouter } from '@/lib/router';
import { ArrowLeft } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/Badge';
import { PageHeader } from '@/components/layout/PageHeader';
import { formatCents, formatDate } from '@/lib/format';
import { mockBookings } from '@/lib/mock-data';

export default function BookingDetailPage() {
  const { path, navigate } = useRouter();
  const id = path.split('/').pop() ?? '';
  const booking = mockBookings.find((b) => b.id === id);
  if (!booking) return <div className="p-8 text-center text-neutral-400">Booking not found</div>;

  return (
    <div>
      <button onClick={() => navigate('/admin/bookings/pipeline')} className="inline-flex items-center gap-1 text-sm text-neutral-400 hover:text-neutral-600 mb-4"><ArrowLeft size={16} /> Back</button>
      <PageHeader title={booking.event_name} description={`${booking.venue_name} · ${formatDate(booking.event_date)}`} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-5">
          <h3 className="font-semibold text-neutral-900 mb-4">Booking Details</h3>
          <div className="space-y-2">
            <div className="flex justify-between"><span className="text-sm text-neutral-500">Status</span><StatusBadge status={booking.status} /></div>
            <div className="flex justify-between"><span className="text-sm text-neutral-500">Fee</span><span className="text-sm font-medium text-neutral-900">{formatCents(booking.fee_cents)}</span></div>
            <div className="flex justify-between"><span className="text-sm text-neutral-500">Deposit</span><span className="text-sm text-neutral-900">{booking.deposit_cents ? formatCents(booking.deposit_cents) : '—'}</span></div>
            <div className="flex justify-between"><span className="text-sm text-neutral-500">Set Length</span><span className="text-sm text-neutral-900">{booking.set_length_minutes ? `${booking.set_length_minutes} min` : '—'}</span></div>
            <div className="flex justify-between"><span className="text-sm text-neutral-500">Event Type</span><span className="text-sm text-neutral-900">{booking.event_type ?? '—'}</span></div>
          </div>
        </Card>
        <Card className="p-5">
          <h3 className="font-semibold text-neutral-900 mb-4">Schedule & Logistics</h3>
          <div className="space-y-2">
            <div className="flex justify-between"><span className="text-sm text-neutral-500">Address</span><span className="text-sm text-neutral-900">{booking.address ?? '—'}</span></div>
            <div className="flex justify-between"><span className="text-sm text-neutral-500">Load In</span><span className="text-sm text-neutral-900">{booking.load_in_time ?? '—'}</span></div>
            <div className="flex justify-between"><span className="text-sm text-neutral-500">Set Time</span><span className="text-sm text-neutral-900">{booking.set_time ?? '—'}</span></div>
            {booking.rider_notes && <div><p className="text-xs text-neutral-500 mt-2">Rider Notes</p><p className="text-sm text-neutral-700">{booking.rider_notes}</p></div>}
            {booking.internal_notes && <div><p className="text-xs text-neutral-500 mt-2">Internal Notes</p><p className="text-sm text-neutral-700">{booking.internal_notes}</p></div>}
          </div>
        </Card>
      </div>
    </div>
  );
}
