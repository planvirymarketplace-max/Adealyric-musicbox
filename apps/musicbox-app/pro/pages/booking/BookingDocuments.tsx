'use client';

import { Badge } from '@/components/ui/Badge';
import { formatDate } from '@/lib/format';
import { mockDocuments } from '@/lib/mock-data';

export default function BookingDocuments() {
  const docs = mockDocuments.filter((d) => d.user_id === 'booking-1');

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-white">Documents</h1><p className="mt-1 text-sm text-white/50">Contracts, invoices, and other documents</p></div>
      <div className="space-y-3">
        {docs.length === 0 ? <p className="text-white/30 text-center py-12">No documents yet</p> : (
          docs.map((d) => (
            <div key={d.id} className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between">
              <div><p className="text-sm font-medium text-white">{d.file_name}</p><p className="text-xs text-white/40">{d.type} · {formatDate(d.created_at)}</p></div>
              {d.esign_status && <Badge color={d.esign_status === 'signed' ? 'green' : 'amber'}>{d.esign_status}</Badge>}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
