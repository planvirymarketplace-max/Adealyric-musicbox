'use client';

import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Field, Input, Select } from '@/components/ui/Form';
import { Button } from '@/components/ui/Button';

export default function SettingsPage() {
  return (
    <div>
      <PageHeader title="Settings" description="Portal configuration" />
      <div className="space-y-6">
        <Card className="p-5">
          <h3 className="font-semibold text-neutral-900 mb-4">General</h3>
          <div className="space-y-4">
            <Field label="Portal Name"><Input defaultValue="My Artist Portal" /></Field>
            <Field label="Default Currency"><Select defaultValue="USD"><option value="USD">USD</option><option value="EUR">EUR</option><option value="GBP">GBP</option></Select></Field>
          </div>
        </Card>
        <Card className="p-5">
          <h3 className="font-semibold text-neutral-900 mb-4">Notifications</h3>
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm text-neutral-700"><input type="checkbox" defaultChecked /> Email notifications for new bookings</label>
            <label className="flex items-center gap-2 text-sm text-neutral-700"><input type="checkbox" defaultChecked /> Email notifications for new orders</label>
            <label className="flex items-center gap-2 text-sm text-neutral-700"><input type="checkbox" /> SMS notifications</label>
          </div>
        </Card>
        <Button variant="primary">Save Changes</Button>
      </div>
    </div>
  );
}
