'use client';

import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Badge, StatusBadge } from '@/components/ui/Badge';
import { formatCents } from '@/lib/format';
import { mockTracks, mockReleases } from '@/lib/mock-data';

export default function TracksPage() {
  return (
    <div>
      <PageHeader title="Tracks" description="All tracks across releases" />
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="border-b border-neutral-200"><th className="px-4 py-3 text-xs font-semibold text-neutral-500 uppercase text-left">#</th><th className="px-4 py-3 text-xs font-semibold text-neutral-500 uppercase text-left">Title</th><th className="px-4 py-3 text-xs font-semibold text-neutral-500 uppercase text-left">Release</th><th className="px-4 py-3 text-xs font-semibold text-neutral-500 uppercase text-left">ISRC</th><th className="px-4 py-3 text-xs font-semibold text-neutral-500 uppercase text-left">Price</th><th className="px-4 py-3 text-xs font-semibold text-neutral-500 uppercase text-left">Status</th></tr></thead>
            <tbody>
              {mockTracks.map((t) => {
                const release = mockReleases.find((r) => r.id === t.release_id);
                return <tr key={t.id} className="border-b border-neutral-100 hover:bg-neutral-50"><td className="px-4 py-3 text-sm text-neutral-500">{t.position}</td><td className="px-4 py-3 text-sm font-medium text-neutral-900">{t.title}</td><td className="px-4 py-3 text-sm text-neutral-500">{release?.title ?? '—'}</td><td className="px-4 py-3 text-sm text-neutral-500">{t.isrc ?? '—'}</td><td className="px-4 py-3 text-sm">{t.is_free ? <Badge color="green">Free</Badge> : <span className="text-neutral-900">{formatCents(t.price_cents)}</span>}</td><td className="px-4 py-3"><StatusBadge status={t.status} /></td></tr>;
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
