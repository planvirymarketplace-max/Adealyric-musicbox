'use client';

import { useRouter } from '@/lib/router';
import { useSyncRequests, useSyncSearch } from '@/hooks/queries';
import { formatCents, formatDate } from '@/lib/format';
import { Card, StatCard } from '@/components/ui/Card';
import { Badge, StatusBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { PageHeader } from '@/components/layout/PageHeader';
import { mockCatalogSongs, mockSyncLicenseRequests } from '@/lib/mock-data';
import { ensureArray } from '@/lib/ensure-array';
import { ScrollText, Download, Clock, CheckCircle2, DollarSign } from 'lucide-react';

export function SyncMyLicensesPage() {
  const { navigate } = useRouter();
  const catalogQuery = useSyncSearch();
  const requestsQuery = useSyncRequests();

  const catalog = ensureArray(catalogQuery.data, mockCatalogSongs);
  const allRequests = ensureArray(requestsQuery.data, mockSyncLicenseRequests);

  // Only approved or completed
  const licenses = allRequests.filter(r => r.status === 'approved' || r.status === 'completed');

  const totalRevenue = licenses.reduce((sum, l) => sum + (l.fee_cents ?? 0), 0);
  const activeCount = licenses.filter(l => l.status === 'approved').length;
  const completedCount = licenses.filter(l => l.status === 'completed').length;

  return (
    <div>
      <PageHeader title="My Licenses" description="Approved and completed sync licenses with fee, territory, and term details." />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard label="Active Licenses" value={activeCount} icon={<ScrollText size={28} />} />
        <StatCard label="Completed" value={completedCount} icon={<CheckCircle2 size={28} />} />
        <StatCard label="Total Revenue" value={formatCents(totalRevenue)} icon={<DollarSign size={28} />} />
      </div>

      {/* License cards */}
      {licenses.length === 0 ? (
        <Card className="p-8">
          <div className="flex flex-col items-center text-center">
            <ScrollText size={32} className="text-neutral-300 mb-3" />
            <p className="text-sm font-medium text-neutral-900">No approved licenses yet</p>
            <p className="text-sm text-neutral-500 mt-1">Once your requests are approved, they will appear here.</p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {licenses.map(lic => {
            const song = catalog.find(s => s.id === lic.catalog_song_id);
            // Calculate expiration based on approved_at + term_months
            const approvedDate = lic.approved_at ? new Date(lic.approved_at) : new Date(lic.created_at);
            const expirationDate = new Date(approvedDate);
            expirationDate.setMonth(expirationDate.getMonth() + lic.term_months);
            const now = new Date();
            const daysRemaining = Math.ceil((expirationDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
            const isExpired = daysRemaining < 0;

            return (
              <Card key={lic.id} className="p-5">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-neutral-200 to-neutral-300 flex items-center justify-center">
                      <ScrollText size={16} className="text-neutral-500" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-neutral-900">{song?.title ?? 'Unknown Track'}</p>
                      <p className="text-xs text-neutral-500">License #{lic.id}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={lic.status} />
                    {!isExpired ? <Badge color="green">Active</Badge> : <Badge color="red">Expired</Badge>}
                  </div>
                </div>

                {/* License details grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-4">
                  <div className="p-3 rounded-lg bg-neutral-50">
                    <p className="text-xs text-neutral-400">License Fee</p>
                    <p className="text-sm font-semibold text-neutral-900">{formatCents(lic.fee_cents)}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-neutral-50">
                    <p className="text-xs text-neutral-400">Usage Type</p>
                    <p className="text-sm text-neutral-900 capitalize">{lic.usage_type}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-neutral-50">
                    <p className="text-xs text-neutral-400">Territory</p>
                    <p className="text-sm text-neutral-900">{lic.territory}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-neutral-50">
                    <p className="text-xs text-neutral-400">Term</p>
                    <p className="text-sm text-neutral-900">{lic.term_months} months</p>
                  </div>
                  <div className="p-3 rounded-lg bg-neutral-50">
                    <p className="text-xs text-neutral-400">Expires</p>
                    <p className="text-sm text-neutral-900">{formatDate(expirationDate.toISOString())}</p>
                  </div>
                </div>

                {/* Media & additional info */}
                <div className="flex items-center gap-2 mb-3">
                  <p className="text-xs text-neutral-400">Media:</p>
                  {lic.media.map(m => <Badge key={m} color="gray" size="sm">{m}</Badge>)}
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <p className="text-xs text-neutral-400">Requester:</p>
                  <p className="text-sm text-neutral-600">{lic.requester_name} · {lic.requester_org ?? 'No org'} · {lic.requester_email}</p>
                </div>

                {/* Expiration tracking */}
                <div className="flex items-center justify-between p-3 rounded-lg border border-neutral-200 bg-white">
                  <div className="flex items-center gap-2">
                    <Clock size={16} className={isExpired ? 'text-red-500' : 'text-green-500'} />
                    <p className="text-sm text-neutral-900">
                      {isExpired ? 'License expired' : `${daysRemaining} days remaining`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="secondary" size="sm">
                      <Download size={14} /> Download Assets
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => navigate(`/sync/track/${lic.catalog_song_id}`)}>
                      View Track
                    </Button>
                  </div>
                </div>

                {/* Notes */}
                {lic.notes && (
                  <div className="mt-3 p-3 rounded-lg bg-neutral-50">
                    <p className="text-xs text-neutral-400 mb-1">Request Notes</p>
                    <p className="text-sm text-neutral-600">{lic.notes}</p>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
