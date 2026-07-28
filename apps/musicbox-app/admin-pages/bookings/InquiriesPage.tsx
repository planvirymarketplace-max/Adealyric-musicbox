'use client';

import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/Badge';
import { formatDate } from '@/lib/format';
import { mockInquiries } from '@/lib/mock-data';

export default function InquiriesPage() {
  return (
    <div>
      <PageHeader title="Booking Inquiries" description="Incoming booking requests" />
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="border-b border-neutral-200"><th className="px-4 py-3 text-xs font-semibold text-neutral-500 uppercase text-left">Contact</th><th className="px-4 py-3 text-xs font-semibold text-neutral-500 uppercase text-left">Event</th><th className="px-4 py-3 text-xs font-semibold text-neutral-500 uppercase text-left">Date</th><th className="px-4 py-3 text-xs font-semibold text-neutral-500 uppercase text-left">Budget</th><th className="px-4 py-3 text-xs font-semibold text-neutral-500 uppercase text-left">Source</th><th className="px-4 py-3 text-xs font-semibold text-neutral-500 uppercase text-left">Status</th></tr></thead>
            <tbody>
              {mockInquiries.map((i) => <tr key={i.id} className="border-b border-neutral-100 hover:bg-neutral-50"><td className="px-4 py-3 text-sm font-medium text-neutral-900">{i.contact_name}</td><td className="px-4 py-3 text-sm text-neutral-500">{i.event_name ?? '—'}</td><td className="px-4 py-3 text-sm text-neutral-500">{formatDate(i.event_date_requested)}</td><td className="px-4 py-3 text-sm text-neutral-500">{i.budget_range ?? '—'}</td><td className="px-4 py-3 text-sm text-neutral-500">{i.source}</td><td className="px-4 py-3"><StatusBadge status={i.status} /></td></tr>)}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
