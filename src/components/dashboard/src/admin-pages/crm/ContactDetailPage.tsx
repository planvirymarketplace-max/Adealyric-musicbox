'use client';

import { useRouter } from '@/lib/router';
import { ArrowLeft, Mail, Phone, MapPin } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge, StatusBadge } from '@/components/ui/Badge';
import { PageHeader } from '@/components/layout/PageHeader';
import { formatDate, formatCents } from '@/lib/format';
import { mockContacts, mockActivities } from '@/lib/mock-data';

export default function ContactDetailPage() {
  const { path, navigate } = useRouter();
  const id = path.split('/').pop() ?? '';
  const contact = mockContacts.find((c) => c.id === id);
  if (!contact) return <div className="p-8 text-center text-neutral-400">Contact not found</div>;

  const activities = mockActivities.filter((a) => a.crm_contact_id === contact.id);

  return (
    <div>
      <button onClick={() => navigate('/admin/audience/contacts')} className="inline-flex items-center gap-1 text-sm text-neutral-400 hover:text-neutral-600 mb-4"><ArrowLeft size={16} /> Back</button>
      <div className="flex items-start gap-4 mb-6">
        <div className="w-14 h-14 rounded-full bg-neutral-200 flex items-center justify-center text-lg font-medium text-neutral-600">{contact.name.charAt(0)}</div>
        <div><h1 className="text-2xl font-semibold text-neutral-900">{contact.name}</h1><p className="text-sm text-neutral-500">{contact.company ?? 'No company'} · <StatusBadge status={contact.stage} /></p></div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-5">
          <h3 className="font-semibold text-neutral-900 mb-4">Contact Info</h3>
          <div className="space-y-2">
            {contact.email && <p className="text-sm text-neutral-500 flex items-center gap-2"><Mail size={14} /> {contact.email}</p>}
            {contact.phone && <p className="text-sm text-neutral-500 flex items-center gap-2"><Phone size={14} /> {contact.phone}</p>}
            {(contact.city || contact.state) && <p className="text-sm text-neutral-500 flex items-center gap-2"><MapPin size={14} /> {contact.city}{contact.city && contact.state ? ', ' : ''}{contact.state}</p>}
            {contact.role_title && <p className="text-sm text-neutral-500">{contact.role_title}</p>}
            {contact.rate_notes && <p className="text-sm text-neutral-500">{contact.rate_notes}</p>}
          </div>
          <div className="flex gap-1 mt-3">{contact.tags.map((t) => <Badge key={t} color="gray" size="sm">{t}</Badge>)}</div>
        </Card>
        <Card className="p-5">
          <h3 className="font-semibold text-neutral-900 mb-4">Activity</h3>
          {activities.length === 0 ? <p className="text-sm text-neutral-400 text-center py-8">No activity yet</p> : (
            <div className="space-y-2">
              {activities.map((a) => <div key={a.id} className="flex items-center justify-between py-2 border-b border-neutral-100 last:border-0"><div><p className="text-sm text-neutral-900">{a.content}</p><p className="text-xs text-neutral-400">{a.type} · {formatDate(a.created_at)}</p></div>{a.completed_at && <Badge color="green" size="sm">Done</Badge>}</div>)}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
