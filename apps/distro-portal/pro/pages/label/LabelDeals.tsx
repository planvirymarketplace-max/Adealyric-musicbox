'use client';

import { useState } from 'react';
import { useRouter } from '@/lib/router';
import { useSyncRequests, useSyncSearch } from '@/hooks/queries';
import { useProAuth } from '@/lib/auth';
import { formatCents, formatDate } from '@/lib/format';
import { Badge, StatusBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, StatCard } from '@/components/ui/Card';
import { PageHeader } from '@/components/layout/PageHeader';
import { LoadingState, ErrorState } from '@/components/ui/States';
import { ScrollText, DollarSign, Clock, CheckCircle2, Download, ArrowUpRight, Music } from 'lucide-react';

export default function LabelDeals() {
  const { navigate } = useRouter();
  const { portalUser } = useProAuth();
  const [viewFilter, setViewFilter] = useState<'active' | 'completed' | 'all'>('all');

  const catalogQuery = useSyncSearch();
  const requestsQuery = useSyncRequests();

  if (!portalUser) return null;
  if (catalogQuery.isLoading || requestsQuery.isLoading) return <div><PageHeader title="Deal History" description="Completed and active sync license deals with fee breakdowns, territory, and term details." /><LoadingState label="Loading deals…" /></div>;

  const catalog = catalogQuery.data ?? [];
  const allRequests = requestsQuery.data ?? [];

  // Deals = approved or completed licenses
  const deals = allRequests.filter(r => r.status === 'approved' || r.status === 'completed');
  const filteredDeals = viewFilter === 'all' ? deals :
    viewFilter === 'active' ? deals.filter(d => d.status === 'approved') :
    deals.filter(d => d.status === 'completed');

  const totalRevenue = deals.reduce((sum, d) => sum + (d.fee_cents ?? 0), 0);
  const activeDeals = deals.filter(d => d.status === 'approved').length;
  const completedDeals = deals.filter(d => d.status === 'completed').length;

  return (
    <div>
      <PageHeader title="Deal History" description="Completed and active sync license deals with fee breakdowns, territory, and term details." />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard label="Active Deals" value={activeDeals} icon={<ScrollText size={28} />} />
        <StatCard label="Completed" value={completedDeals} icon={<CheckCircle2 size={28} />} />
        <StatCard label="Total Revenue" value={formatCents(totalRevenue)} icon={<DollarSign size={28} />} trend="Sync licensing income" />
      </div>

      {/* Filter */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center gap-2">
          {(['all', 'active', 'completed'] as const).map(v => (
            <Button key={v} variant={viewFilter === v ? 'primary' : 'secondary'} size="sm" onClick={() => setViewFilter(v)}>
              {v === 'all' ? 'All Deals' : v === 'active' ? 'Active' : 'Completed'}
            </Button>
          ))}
        </div>
        <p className="text-sm text-neutral-500">{filteredDeals.length} deals</p>
      </div>

      {/* Deal list */}
      {filteredDeals.length === 0 ? (
        <Card className="p-8">
          <div className="flex flex-col items-center text-center">
            <ScrollText size={32} className="text-neutral-300 mb-3" />
            <p className="text-sm font-medium text-neutral-900">No deals yet</p>
            <p className="text-sm text-neutral-500 mt-1">Once license requests are approved, they become active deals here.</p>
            <Button variant="primary" size="sm" className="mt-4" onClick={() => navigate('/pro/dashboard/label/catalog')}>Browse Catalog</Button>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredDeals.map(deal => {
            const song = catalog.find(s => s.id === deal.catalog_song_id);
            const approvedDate = deal.approved_at ? new Date(deal.approved_at) : new Date(deal.created_at);
            const expirationDate = new Date(approvedDate);
            expirationDate.setMonth(expirationDate.getMonth() + deal.term_months);
            const now = new Date();
            const daysRemaining = Math.ceil((expirationDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
            const isExpired = daysRemaining < 0;

            return (
              <Card key={deal.id} className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-neutral-200 to-neutral-300 flex items-center justify-center"><Music size={16} className="text-neutral-500" /></div>
                    <div>
                      <p className="text-sm font-semibold text-neutral-900">{song?.title ?? 'Unknown Track'}</p>
                      <p className="text-xs text-neutral-500">Deal #{deal.id.slice(0, 8)} · {deal.usage_type} · {deal.territory}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={deal.status} />
                    {!isExpired && deal.status === 'approved' && <Badge color="green">Active</Badge>}
                    {isExpired && <Badge color="red">Expired</Badge>}
                    {deal.status === 'completed' && <Badge color="blue">Completed</Badge>}
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-4">
                  <div className="p-3 rounded-lg bg-neutral-50"><p className="text-xs text-neutral-400">License Fee</p><p className="text-sm font-semibold text-neutral-900">{formatCents(deal.fee_cents)}</p></div>
                  <div className="p-3 rounded-lg bg-neutral-50"><p className="text-xs text-neutral-400">Usage Type</p><p className="text-sm text-neutral-900 capitalize">{deal.usage_type}</p></div>
                  <div className="p-3 rounded-lg bg-neutral-50"><p className="text-xs text-neutral-400">Territory</p><p className="text-sm text-neutral-900">{deal.territory}</p></div>
                  <div className="p-3 rounded-lg bg-neutral-50"><p className="text-xs text-neutral-400">Term</p><p className="text-sm text-neutral-900">{deal.term_months} months</p></div>
                  <div className="p-3 rounded-lg bg-neutral-50"><p className="text-xs text-neutral-400">{deal.status === 'completed' ? 'Completed' : 'Expires'}</p><p className="text-sm text-neutral-900">{deal.status === 'completed' ? formatDate(deal.updated_at ?? deal.created_at) : formatDate(expirationDate.toISOString())}</p></div>
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <p className="text-xs text-neutral-400">Media:</p>
                  {deal.media.map(m => <Badge key={m} color="gray" size="sm">{m}</Badge>)}
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg border border-neutral-200 bg-white">
                  <div className="flex items-center gap-2">
                    <Clock size={16} className={isExpired || deal.status === 'completed' ? 'text-neutral-400' : 'text-green-500'} />
                    <p className="text-sm text-neutral-900">
                      {deal.status === 'completed' ? 'Deal completed' : isExpired ? 'License expired' : `${daysRemaining} days remaining`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="secondary" size="sm"><Download size={14} /> Download Contract</Button>
                    <Button variant="secondary" size="sm"><Download size={14} /> Download Assets</Button>
                  </div>
                </div>

                {deal.notes && (
                  <div className="mt-3 p-3 rounded-lg bg-neutral-50">
                    <p className="text-xs text-neutral-400 mb-1">Deal Notes</p>
                    <p className="text-sm text-neutral-600">{deal.notes}</p>
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
