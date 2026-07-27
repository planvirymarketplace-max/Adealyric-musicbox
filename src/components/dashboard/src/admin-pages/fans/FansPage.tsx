'use client';

import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { formatDate } from '@/lib/format';
import { mockFans } from '@/lib/mock-data';

export default function FansPage() {
  return (
    <div>
      <PageHeader title="Fans" description="Registered fan profiles and activity" />
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="border-b border-neutral-200"><th className="px-4 py-3 text-xs font-semibold text-neutral-500 uppercase text-left">Name</th><th className="px-4 py-3 text-xs font-semibold text-neutral-500 uppercase text-left">Email</th><th className="px-4 py-3 text-xs font-semibold text-neutral-500 uppercase text-left">Subscribed</th><th className="px-4 py-3 text-xs font-semibold text-neutral-500 uppercase text-left">Tags</th><th className="px-4 py-3 text-xs font-semibold text-neutral-500 uppercase text-left">Joined</th></tr></thead>
            <tbody>
              {mockFans.map((f) => <tr key={f.id} className="border-b border-neutral-100 hover:bg-neutral-50"><td className="px-4 py-3 text-sm font-medium text-neutral-900">{f.name ?? '—'}</td><td className="px-4 py-3 text-sm text-neutral-500">{f.email}</td><td className="px-4 py-3"><Badge color={f.subscribed ? 'green' : 'gray'}>{f.subscribed ? 'Yes' : 'No'}</Badge></td><td className="px-4 py-3"><div className="flex gap-1">{f.tags.slice(0, 3).map((t) => <Badge key={t} color="gray" size="sm">{t}</Badge>)}</div></td><td className="px-4 py-3 text-sm text-neutral-500">{formatDate(f.created_at)}</td></tr>)}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
