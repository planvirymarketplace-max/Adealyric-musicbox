'use client';

import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/Badge';
import { formatCents, formatDate } from '@/lib/format';
import { mockOrders } from '@/lib/mock-data';

export default function OrdersPage() {
  return (
    <div>
      <PageHeader title="Orders" description="Customer orders and payment status" />
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="border-b border-neutral-200"><th className="px-4 py-3 text-xs font-semibold text-neutral-500 uppercase text-left">Order ID</th><th className="px-4 py-3 text-xs font-semibold text-neutral-500 uppercase text-left">Amount</th><th className="px-4 py-3 text-xs font-semibold text-neutral-500 uppercase text-left">Date</th><th className="px-4 py-3 text-xs font-semibold text-neutral-500 uppercase text-left">Status</th></tr></thead>
            <tbody>
              {mockOrders.map((o) => <tr key={o.id} className="border-b border-neutral-100 hover:bg-neutral-50"><td className="px-4 py-3 text-sm font-medium text-neutral-900">{o.id.slice(0, 8)}</td><td className="px-4 py-3 text-sm text-neutral-900">{formatCents(o.amount_total_cents)}</td><td className="px-4 py-3 text-sm text-neutral-500">{formatDate(o.created_at)}</td><td className="px-4 py-3"><StatusBadge status={o.status} /></td></tr>)}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
