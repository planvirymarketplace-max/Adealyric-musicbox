'use client';

import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Badge, StatusBadge } from '@/components/ui/Badge';
import { formatDate, formatCents } from '@/lib/format';
import { mockTicketEvents, mockTicketTiers } from '@/lib/mock-data';

export default function TicketEventsPage() {
  return (
    <div>
      <PageHeader title="Ticket Events" description="Manage ticketed events" />
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="border-b border-neutral-200"><th className="px-4 py-3 text-xs font-semibold text-neutral-500 uppercase text-left">Event</th><th className="px-4 py-3 text-xs font-semibold text-neutral-500 uppercase text-left">Venue</th><th className="px-4 py-3 text-xs font-semibold text-neutral-500 uppercase text-left">Date</th><th className="px-4 py-3 text-xs font-semibold text-neutral-500 uppercase text-left">Capacity</th><th className="px-4 py-3 text-xs font-semibold text-neutral-500 uppercase text-left">Published</th></tr></thead>
            <tbody>
              {mockTicketEvents.map((e) => <tr key={e.id} className="border-b border-neutral-100 hover:bg-neutral-50"><td className="px-4 py-3 text-sm font-medium text-neutral-900">{e.title}</td><td className="px-4 py-3 text-sm text-neutral-500">{e.venue_name}</td><td className="px-4 py-3 text-sm text-neutral-500">{formatDate(e.event_date)}</td><td className="px-4 py-3 text-sm text-neutral-500">{e.capacity ?? '—'}</td><td className="px-4 py-3"><Badge color={e.published ? 'green' : 'gray'}>{e.published ? 'Published' : 'Draft'}</Badge></td></tr>)}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
