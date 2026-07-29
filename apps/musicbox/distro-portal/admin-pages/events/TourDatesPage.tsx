'use client';

import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { formatDate } from '@/lib/format';
import { mockTourDates } from '@/lib/mock-data';

export default function TourDatesPage() {
  return (
    <div>
      <PageHeader title="Tour Dates" description="Manage upcoming tour dates and live events" />
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="border-b border-neutral-200"><th className="px-4 py-3 text-xs font-semibold text-neutral-500 uppercase text-left">Title</th><th className="px-4 py-3 text-xs font-semibold text-neutral-500 uppercase text-left">Venue</th><th className="px-4 py-3 text-xs font-semibold text-neutral-500 uppercase text-left">Date</th><th className="px-4 py-3 text-xs font-semibold text-neutral-500 uppercase text-left">City</th><th className="px-4 py-3 text-xs font-semibold text-neutral-500 uppercase text-left">Status</th></tr></thead>
            <tbody>
              {mockTourDates.map((t) => <tr key={t.id} className="border-b border-neutral-100 hover:bg-neutral-50"><td className="px-4 py-3 text-sm font-medium text-neutral-900">{t.title}</td><td className="px-4 py-3 text-sm text-neutral-500">{t.venue}</td><td className="px-4 py-3 text-sm text-neutral-500">{formatDate(t.date)}</td><td className="px-4 py-3 text-sm text-neutral-500">{t.city ?? '—'}</td><td className="px-4 py-3"><Badge color={t.is_sold_out ? 'red' : t.is_public ? 'green' : 'gray'}>{t.is_sold_out ? 'Sold Out' : t.is_public ? 'Public' : 'Private'}</Badge></td></tr>)}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
