'use client';

import { useRouter } from '@/lib/router';
import { useSyncSearch, useSyncRequests } from '@/hooks/queries';
import { useProAuth } from '@/lib/auth';
import { formatCents, formatDate } from '@/lib/format';
import { Badge, StatusBadge } from '@/components/ui/Badge';
import { Card, StatCard } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { PageHeader } from '@/components/layout/PageHeader';
import { mockCatalogSongs, mockSyncLicenseRequests } from '@/lib/mock-data';
import { Music, FileText, CheckCircle2, ScrollText, DollarSign, ArrowUpRight, Search, Sparkles, CalendarClock } from 'lucide-react';

export default function LabelOverview() {
  const { navigate } = useRouter();
  const { portalUser } = useProAuth();
  const catalogQuery = useSyncSearch();
  const requestsQuery = useSyncRequests();

  const catalog = catalogQuery.data ?? mockCatalogSongs;
  const requests = requestsQuery.data ?? mockSyncLicenseRequests;
  const availableTracks = catalog.filter(s => s.sync_status === 'available').length;
  const activeRequests = requests.filter(r => ['submitted', 'under_review', 'cleared'].includes(r.status)).length;
  const activeLicenses = requests.filter(r => r.status === 'approved' || r.status === 'completed').length;
  const revenue30d = requests.filter(r => r.status === 'approved' || r.status === 'completed').reduce((sum, r) => sum + (r.fee_cents ?? 0), 0);

  return (
    <div>
      <PageHeader title="Sync Agent Overview" description={`Welcome back${portalUser?.display_name ? `, ${portalUser.display_name}` : ''}. Here's your catalog and licensing activity.`} />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Available Tracks" value={availableTracks} icon={<Music size={28} />} trend={`${catalog.length} total in catalog`} />
        <StatCard label="Active Requests" value={activeRequests} icon={<FileText size={28} />} />
        <StatCard label="Active Licenses" value={activeLicenses} icon={<ScrollText size={28} />} />
        <StatCard label="Revenue (30d)" value={formatCents(revenue30d)} icon={<DollarSign size={28} />} trend="Sync licensing income" />
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card className="p-5 cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/pro/dashboard/label/catalog')}>
          <div className="flex items-center gap-3 mb-2"><Search size={20} className="text-neutral-400" /><h3 className="font-semibold text-neutral-900">Browse Catalog</h3></div>
          <p className="text-sm text-neutral-500">Search tracks by genre, mood, BPM, key, and clearance status.</p>
          <Button variant="ghost" size="sm" className="mt-3">Explore <ArrowUpRight size={14} /></Button>
        </Card>
        <Card className="p-5 cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/pro/dashboard/label/requests')}>
          <div className="flex items-center gap-3 mb-2"><FileText size={20} className="text-neutral-400" /><h3 className="font-semibold text-neutral-900">License Requests</h3></div>
          <p className="text-sm text-neutral-500">Track and manage your sync license requests with clearance workflow.</p>
          <Button variant="ghost" size="sm" className="mt-3">View requests <ArrowUpRight size={14} /></Button>
        </Card>
        <Card className="p-5 cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/pro/dashboard/label/deals')}>
          <div className="flex items-center gap-3 mb-2"><ScrollText size={20} className="text-neutral-400" /><h3 className="font-semibold text-neutral-900">Deal History</h3></div>
          <p className="text-sm text-neutral-500">View completed and active sync deals with fee details.</p>
          <Button variant="ghost" size="sm" className="mt-3">View deals <ArrowUpRight size={14} /></Button>
        </Card>
      </div>

      {/* Recent catalog additions */}
      <Card className="p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2"><Sparkles size={18} className="text-neutral-400" /><h3 className="font-semibold text-neutral-900">Recently Added to Catalog</h3></div>
          <button onClick={() => navigate('/pro/dashboard/label/catalog')} className="text-sm text-neutral-500 hover:text-neutral-900 flex items-center gap-1">View all <ArrowUpRight size={14} /></button>
        </div>
        <div className="space-y-2">
          {catalog.slice(0, 5).map(song => (
            <div key={song.id} className="flex items-center justify-between gap-3 py-2 border-b border-neutral-100 last:border-0">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded bg-neutral-100 flex items-center justify-center flex-shrink-0"><Music size={16} className="text-neutral-300" /></div>
                <div className="min-w-0"><p className="text-sm font-medium text-neutral-900 truncate">{song.title}</p><p className="text-xs text-neutral-500 truncate">{song.genre} · {song.bpm} BPM · {song.key}</p></div>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <Badge color={song.sync_status === 'available' ? 'green' : song.sync_status === 'on_hold' ? 'amber' : 'gray'}>{song.sync_status.replace(/_/g, ' ')}</Badge>
                <span className="text-xs text-neutral-400 hidden sm:inline">{formatDate(song.created_at)}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Recent requests */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2"><CalendarClock size={18} className="text-neutral-400" /><h3 className="font-semibold text-neutral-900">Recent License Requests</h3></div>
          <button onClick={() => navigate('/pro/dashboard/label/requests')} className="text-sm text-neutral-500 hover:text-neutral-900 flex items-center gap-1">View all <ArrowUpRight size={14} /></button>
        </div>
        {requests.length === 0 ? (
          <p className="text-sm text-neutral-500 text-center py-4">No license requests yet. Browse the catalog to submit one.</p>
        ) : (
          <div className="space-y-2">
            {requests.slice(0, 5).map(req => {
              const song = catalog.find(s => s.id === req.catalog_song_id);
              return (
                <div key={req.id} className="flex items-center justify-between gap-3 py-2 border-b border-neutral-100 last:border-0">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-neutral-900 truncate">{song?.title ?? 'Unknown'}</p>
                    <p className="text-xs text-neutral-500">{req.usage_type} · {req.territory}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={req.status} />
                    {req.fee_cents && <Badge color="teal">{formatCents(req.fee_cents)}</Badge>}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}
