'use client';

import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Badge, StatusBadge } from '@/components/ui/Badge';
import { formatDate } from '@/lib/format';
import { mockConnections } from '@/lib/mock-data';

export default function IntegrationsPage() {
  return (
    <div>
      <PageHeader title="Integrations" description="Connected services and platforms" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockConnections.map((c) => (
          <Card className="p-5" key={c.id}>
            <div className="flex items-start justify-between mb-3"><h3 className="font-semibold text-neutral-900 capitalize">{c.provider}</h3><StatusBadge status={c.status} /></div>
            <p className="text-xs text-neutral-500">Auth: {c.auth_type}</p>
            {c.last_synced_at && <p className="text-xs text-neutral-400 mt-1">Last synced: {formatDate(c.last_synced_at)}</p>}
            {c.last_error && <p className="text-xs text-red-500 mt-1">{c.last_error}</p>}
          </Card>
        ))}
      </div>
    </div>
  );
}
