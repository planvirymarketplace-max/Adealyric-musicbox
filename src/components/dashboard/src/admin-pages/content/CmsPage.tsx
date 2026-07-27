'use client';

import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { formatDate } from '@/lib/format';
import { mockGalleries, mockBanners } from '@/lib/mock-data';

export default function CmsPage() {
  return (
    <div>
      <PageHeader title="Content Management" description="Pages, galleries, and banners" />
      <div className="space-y-6">
        <Card className="p-5">
          <h3 className="font-semibold text-neutral-900 mb-4">Banners</h3>
          <div className="space-y-2">
            {mockBanners.map((b) => <div key={b.id} className="flex items-center justify-between py-2 border-b border-neutral-100 last:border-0"><div><p className="text-sm font-medium text-neutral-900">{b.title}</p><p className="text-xs text-neutral-500">{b.position} · {formatDate(b.created_at)}</p></div><Badge color={b.published ? 'green' : 'gray'}>{b.published ? 'Published' : 'Draft'}</Badge></div>)}
          </div>
        </Card>
        <Card className="p-5">
          <h3 className="font-semibold text-neutral-900 mb-4">Galleries</h3>
          <div className="space-y-2">
            {mockGalleries.map((g) => <div key={g.id} className="flex items-center justify-between py-2 border-b border-neutral-100 last:border-0"><div><p className="text-sm font-medium text-neutral-900">{g.title}</p><p className="text-xs text-neutral-500">{g.kind} · {formatDate(g.created_at)}</p></div><Badge color={g.published ? 'green' : 'gray'}>{g.published ? 'Published' : 'Draft'}</Badge></div>)}
          </div>
        </Card>
      </div>
    </div>
  );
}
