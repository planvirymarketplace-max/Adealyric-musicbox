'use client';

import { useRouter } from '@/lib/router';
import { useSyncSearch, useSyncRequests } from '@/hooks/queries';
import { formatCents, formatDate } from '@/lib/format';
import { Card, StatCard } from '@/components/ui/Card';
import { Badge, StatusBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { PageHeader } from '@/components/layout/PageHeader';
import { mockCatalogSongs, mockSyncLicenseRequests } from '@/lib/mock-data';
import { ensureArray } from '@/lib/ensure-array';
import { Music, Search, FileText, ScrollText, DollarSign, ArrowUpRight } from 'lucide-react';

export function SyncOverviewPage() {
  const { navigate } = useRouter();
  const catalogQuery = useSyncSearch();
  const requestsQuery = useSyncRequests();

  const catalog = ensureArray(catalogQuery.data, mockCatalogSongs);
  const requests = ensureArray(requestsQuery.data, mockSyncLicenseRequests);

  const availableTracks = catalog.filter(s => s.sync_status === 'available').length;
  const activeRequests = requests.filter(r => ['submitted', 'under_review', 'cleared'].includes(r.status)).length;
  const clearedTracks = requests.filter(r => r.status === 'cleared' || r.status === 'approved').length;
  const revenue30d = requests.filter(r => r.fee_cents && (r.status === 'approved' || r.status === 'completed')).reduce((sum, r) => sum + (r.fee_cents ?? 0), 0);

  return (
    <div>
      <PageHeader title="Sync Licensing Portal" description="Welcome back, Sync Agent. Manage your sync catalog and license requests." />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Available Tracks" value={availableTracks} icon={<Music size={28} />} trend={`${catalog.length} total in catalog`} />
        <StatCard label="Active Requests" value={activeRequests} icon={<FileText size={28} />} />
        <StatCard label="Cleared for Sync" value={clearedTracks} icon={<ScrollText size={28} />} />
        <StatCard label="Revenue (30d)" value={formatCents(revenue30d)} icon={<DollarSign size={28} />} trend="Sync licensing income" />
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card className="p-5 cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/sync/search')}>
          <div className="flex items-center gap-3 mb-2">
            <Search size={20} className="text-neutral-400" />
            <h3 className="font-semibold text-neutral-900">Search Catalog</h3>
          </div>
          <p className="text-sm text-neutral-500">Browse tracks by genre, mood, BPM, key, and clearance status.</p>
          <Button variant="ghost" size="sm" className="mt-3">Explore <ArrowUpRight size={14} /></Button>
        </Card>
        <Card className="p-5 cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/sync/license-requests')}>
          <div className="flex items-center gap-3 mb-2">
            <FileText size={20} className="text-neutral-400" />
            <h3 className="font-semibold text-neutral-900">License Requests</h3>
          </div>
          <p className="text-sm text-neutral-500">View and manage incoming sync license requests.</p>
          <Button variant="ghost" size="sm" className="mt-3">View requests <ArrowUpRight size={14} /></Button>
        </Card>
        <Card className="p-5 cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/sync/my-licenses')}>
          <div className="flex items-center gap-3 mb-2">
            <ScrollText size={20} className="text-neutral-400" />
            <h3 className="font-semibold text-neutral-900">My Licenses</h3>
          </div>
          <p className="text-sm text-neutral-500">Track approved and completed sync licenses.</p>
          <Button variant="ghost" size="sm" className="mt-3">View licenses <ArrowUpRight size={14} /></Button>
        </Card>
      </div>

      {/* Recent requests */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-neutral-900">Recent License Requests</h3>
          <button onClick={() => navigate('/sync/license-requests')} className="text-sm text-neutral-500 hover:text-neutral-900 flex items-center gap-1">View all <ArrowUpRight size={14} /></button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-200">
                <th className="text-left py-2 px-3 font-medium text-neutral-500">Track</th>
                <th className="text-left py-2 px-3 font-medium text-neutral-500">Requester</th>
                <th className="text-left py-2 px-3 font-medium text-neutral-500">Usage</th>
                <th className="text-left py-2 px-3 font-medium text-neutral-500">Territory</th>
                <th className="text-left py-2 px-3 font-medium text-neutral-500">Status</th>
                <th className="text-left py-2 px-3 font-medium text-neutral-500">Date</th>
              </tr>
            </thead>
            <tbody>
              {requests.slice(0, 5).map(req => {
                const song = catalog.find(s => s.id === req.catalog_song_id);
                return (
                  <tr key={req.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                    <td className="py-2 px-3 font-medium text-neutral-900">{song?.title ?? 'Unknown'}</td>
                    <td className="py-2 px-3 text-neutral-600">{req.requester_name}</td>
                    <td className="py-2 px-3"><Badge color="gray">{req.usage_type}</Badge></td>
                    <td className="py-2 px-3 text-neutral-600">{req.territory}</td>
                    <td className="py-2 px-3"><StatusBadge status={req.status} /></td>
                    <td className="py-2 px-3 text-neutral-500">{formatDate(req.created_at)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
