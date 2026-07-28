'use client';

import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Download } from 'lucide-react';

export default function ExportsPage() {
  return (
    <div>
      <PageHeader title="Exports" description="Export data from your portal" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {['Contacts', 'Orders', 'Bookings', 'Fans', 'Tickets', 'Releases'].map((name) => (
          <Card className="p-5" key={name}>
            <h3 className="font-semibold text-neutral-900 mb-2">{name}</h3>
            <p className="text-xs text-neutral-500 mb-3">Export all {name.toLowerCase()} data as CSV</p>
            <Button size="sm" variant="secondary"><Download size={14} /> Export CSV</Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
