'use client';

import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

const automations = [
  { name: 'New Booking Notification', trigger: 'Booking created', action: 'Send email to artist team', status: 'active' },
  { name: 'Order Confirmation Email', trigger: 'Order paid', action: 'Send confirmation to fan', status: 'active' },
  { name: 'Welcome Email', trigger: 'Fan signup', action: 'Send welcome email', status: 'draft' },
  { name: 'Ticket Reminder', trigger: '24h before event', action: 'Send reminder email', status: 'draft' },
];

export default function AutomationPage() {
  return (
    <div>
      <PageHeader title="Automation" description="Configure automated workflows" />
      <div className="space-y-3">
        {automations.map((a) => (
          <Card className="p-4" key={a.name}>
            <div className="flex items-center justify-between">
              <div><p className="text-sm font-medium text-neutral-900">{a.name}</p><p className="text-xs text-neutral-500">Trigger: {a.trigger} → {a.action}</p></div>
              <Badge color={a.status === 'active' ? 'green' : 'gray'}>{a.status}</Badge>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
