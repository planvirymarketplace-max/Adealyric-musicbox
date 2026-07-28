'use client';

import { useRouter } from '@/lib/router';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Badge, StatusBadge } from '@/components/ui/Badge';
import { mockContacts } from '@/lib/mock-data';

export default function ContactsPage() {
  const { navigate } = useRouter();

  return (
    <div>
      <PageHeader title="Contacts" description="CRM contacts and relationships" />
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="border-b border-neutral-200"><th className="px-4 py-3 text-xs font-semibold text-neutral-500 uppercase text-left">Name</th><th className="px-4 py-3 text-xs font-semibold text-neutral-500 uppercase text-left">Company</th><th className="px-4 py-3 text-xs font-semibold text-neutral-500 uppercase text-left">Type</th><th className="px-4 py-3 text-xs font-semibold text-neutral-500 uppercase text-left">Stage</th><th className="px-4 py-3 text-xs font-semibold text-neutral-500 uppercase text-left">Tags</th></tr></thead>
            <tbody>
              {mockContacts.map((c) => <tr key={c.id} className="border-b border-neutral-100 hover:bg-neutral-50 cursor-pointer" onClick={() => navigate(`/admin/audience/contacts/${c.id}`)}><td className="px-4 py-3 text-sm font-medium text-neutral-900">{c.name}</td><td className="px-4 py-3 text-sm text-neutral-500">{c.company ?? '—'}</td><td className="px-4 py-3 text-sm"><Badge color="gray">{c.contact_type}</Badge></td><td className="px-4 py-3"><StatusBadge status={c.stage} /></td><td className="px-4 py-3"><div className="flex gap-1">{c.tags.slice(0, 3).map((t) => <Badge key={t} color="gray" size="sm">{t}</Badge>)}</div></td></tr>)}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
