'use client';

import { useRouter } from '@/lib/router';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/Badge';
import { formatCents, formatDate } from '@/lib/format';
import { mockBookings } from '@/lib/mock-data';

export default function BookingsPipelinePage() {
  const { navigate } = useRouter();

  const byStatus = (status: string) => mockBookings.filter((b) => b.status === status);

  return (
    <div>
      <PageHeader title="Booking Pipeline" description="Track bookings through the pipeline" />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {['inquiry', 'confirmed', 'deposit_paid', 'completed'].map((status) => (
          <div key={status}>
            <div className="flex items-center justify-between mb-3"><h3 className="text-sm font-semibold text-neutral-900 capitalize">{status.replace(/_/g, ' ')}</h3><span className="text-xs text-neutral-400">{byStatus(status).length}</span></div>
            <div className="space-y-2">
              {byStatus(status).map((b) => (
                <button key={b.id} onClick={() => navigate(`/admin/bookings/${b.id}`)}>
                  <Card className="p-3 cursor-pointer hover:shadow-md transition-shadow">
                    <p className="text-sm font-medium text-neutral-900">{b.event_name}</p>
                    <p className="text-xs text-neutral-500">{b.venue_name} · {formatDate(b.event_date)}</p>
                    <p className="text-xs text-neutral-500 mt-1">{formatCents(b.fee_cents)}</p>
                  </Card>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
