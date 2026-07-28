'use client';

import { useState } from 'react';
import { useProAuth } from '@/lib/auth';
import { useRouter } from '@/lib/router';
import { formatDate } from '@/lib/format';
import { Badge, StatusBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { PageHeader } from '@/components/layout/PageHeader';
import { EmptyState } from '@/components/ui/States';
import { mockPortalDocuments } from '@/lib/mock-data';
import { FileText, Download, Clock, CheckCircle2, Eye, Search, Filter } from 'lucide-react';

export default function LabelDocuments() {
  const { portalUser } = useProAuth();
  const { navigate } = useRouter();
  const [typeFilter, setTypeFilter] = useState('all');

  if (!portalUser) return null;

  const docs = mockPortalDocuments;
  const filteredDocs = typeFilter === 'all' ? docs : docs.filter(d => d.type === typeFilter);
  const types = [...new Set(docs.map(d => d.type))];

  const signedCount = docs.filter(d => d.esign_status === 'signed').length;
  const pendingCount = docs.filter(d => d.esign_status === 'sent' || d.esign_status === 'pending').length;
  const unsignedCount = docs.filter(d => !d.esign_status || d.esign_status === 'draft').length;

  return (
    <div>
      <PageHeader title="Contracts & Invoices" description="Legal documents, license contracts, and financial records for your sync deals." />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <CheckCircle2 size={20} className="text-green-500" />
            <div><p className="text-sm font-medium text-neutral-900">{signedCount} Signed</p><p className="text-xs text-neutral-500">Fully executed contracts</p></div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Clock size={20} className="text-amber-500" />
            <div><p className="text-sm font-medium text-neutral-900">{pendingCount} Pending Signature</p><p className="text-xs text-neutral-500">Awaiting e-sign response</p></div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <FileText size={20} className="text-neutral-400" />
            <div><p className="text-sm font-medium text-neutral-900">{unsignedCount} Drafts</p><p className="text-xs text-neutral-500">Not yet sent for signature</p></div>
          </div>
        </Card>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-3 mb-4">
        <Filter size={16} className="text-neutral-400" />
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="text-sm bg-white border border-neutral-200 rounded-lg px-3 py-1.5">
          <option value="all">All Types</option>
          {types.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <p className="text-sm text-neutral-500">{filteredDocs.length} documents</p>
      </div>

      {/* Document list */}
      {filteredDocs.length === 0 ? (
        <Card className="p-8">
          <EmptyState title="No documents yet" description="Contracts and invoices are generated when license requests are approved. Check back after your first deal." />
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredDocs.map(doc => (
            <Card key={doc.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center">
                    <FileText size={16} className="text-neutral-500" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-neutral-900 truncate">{doc.file_name}</p>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      {doc.type} · {formatDate(doc.created_at)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {doc.esign_status && <Badge color={doc.esign_status === 'signed' ? 'green' : doc.esign_status === 'sent' ? 'amber' : 'gray'}>{doc.esign_status}</Badge>}
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm"><Eye size={14} /> View</Button>
                    <Button variant="secondary" size="sm"><Download size={14} /> Download</Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
