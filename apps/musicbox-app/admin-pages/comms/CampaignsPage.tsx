'use client';

import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/Badge';
import { formatDate } from '@/lib/format';
import { mockCampaigns } from '@/lib/mock-data';

export default function CampaignsPage() {
  return (
    <div>
      <PageHeader title="Email Campaigns" description="Manage email campaigns and newsletters" />
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="border-b border-neutral-200"><th className="px-4 py-3 text-xs font-semibold text-neutral-500 uppercase text-left">Subject</th><th className="px-4 py-3 text-xs font-semibold text-neutral-500 uppercase text-left">Status</th><th className="px-4 py-3 text-xs font-semibold text-neutral-500 uppercase text-left">Recipients</th><th className="px-4 py-3 text-xs font-semibold text-neutral-500 uppercase text-left">Opens</th><th className="px-4 py-3 text-xs font-semibold text-neutral-500 uppercase text-left">Date</th></tr></thead>
            <tbody>
              {mockCampaigns.map((c) => <tr key={c.id} className="border-b border-neutral-100 hover:bg-neutral-50"><td className="px-4 py-3 text-sm font-medium text-neutral-900">{c.subject}</td><td className="px-4 py-3"><StatusBadge status={c.status} /></td><td className="px-4 py-3 text-sm text-neutral-500">{c.recipient_count ?? '—'}</td><td className="px-4 py-3 text-sm text-neutral-500">{c.open_count ?? '—'}</td><td className="px-4 py-3 text-sm text-neutral-500">{formatDate(c.sent_at ?? c.scheduled_for ?? c.created_at)}</td></tr>)}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
