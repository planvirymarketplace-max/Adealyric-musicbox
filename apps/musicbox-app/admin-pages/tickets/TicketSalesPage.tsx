'use client';

import { PageHeader } from '@/components/layout/PageHeader';
import { Card, StatCard } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/Badge';
import { formatCents, formatDate } from '@/lib/format';
import { mockTicketOrders, mockTicketEvents } from '@/lib/mock-data';

export default function TicketSalesPage() {
  const totalRevenue = mockTicketOrders.filter((o) => o.status === 'paid').reduce((s, o) => s + o.total_cents, 0);
  const totalTickets = mockTicketOrders.filter((o) => o.status === 'paid').reduce((s, o) => s + o.quantity, 0);

  return (
    <div>
      <PageHeader title="Ticket Sales" description="Track ticket sales and revenue" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard label="Total Revenue" value={formatCents(totalRevenue)} />
        <StatCard label="Tickets Sold" value={totalTickets} />
        <StatCard label="Orders" value={mockTicketOrders.length} />
      </div>
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="border-b border-neutral-200"><th className="px-4 py-3 text-xs font-semibold text-neutral-500 uppercase text-left">Order</th><th className="px-4 py-3 text-xs font-semibold text-neutral-500 uppercase text-left">Event</th><th className="px-4 py-3 text-xs font-semibold text-neutral-500 uppercase text-left">Qty</th><th className="px-4 py-3 text-xs font-semibold text-neutral-500 uppercase text-left">Total</th><th className="px-4 py-3 text-xs font-semibold text-neutral-500 uppercase text-left">Status</th></tr></thead>
            <tbody>
              {mockTicketOrders.map((o) => {
                const event = mockTicketEvents.find((e) => e.id === o.event_id);
                return <tr key={o.id} className="border-b border-neutral-100 hover:bg-neutral-50"><td className="px-4 py-3 text-sm font-medium text-neutral-900">{o.id.slice(0, 8)}</td><td className="px-4 py-3 text-sm text-neutral-500">{event?.title ?? '—'}</td><td className="px-4 py-3 text-sm text-neutral-500">{o.quantity}</td><td className="px-4 py-3 text-sm text-neutral-900">{formatCents(o.total_cents)}</td><td className="px-4 py-3"><StatusBadge status={o.status} /></td></tr>;
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
