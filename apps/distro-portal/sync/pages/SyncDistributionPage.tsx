'use client';

import { useState } from 'react';
import { useRouter } from '@/lib/router';
import { formatDate, formatDateTime } from '@/lib/format';
import { Card, StatCard } from '@/components/ui/Card';
import { Badge, StatusBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { PageHeader } from '@/components/layout/PageHeader';
import { EmptyState } from '@/components/ui/States';
import {
  Send, CheckCircle2, Clock, AlertTriangle, Ban, Package,
  ChevronDown, ChevronUp, RefreshCw, Server, Settings, FileArchive,
  Music, Zap
} from 'lucide-react';

// ─── Mock Data ────────────────────────────────────────────────────────────────

type DeliveryStatus = 'pending' | 'processing' | 'delivered' | 'failed';

interface DspAdapter {
  id: string;
  name: string;
  logo_initial: string;
  format: string;
  version: string;
  delivery_method: string;
  max_file_size: string;
  required_assets: string[];
  auto_delivery: boolean;
  last_delivery_at: string;
  status: 'active' | 'maintenance' | 'configuring';
}

interface Delivery {
  id: string;
  release_title: string;
  artist: string;
  dsp: string;
  package_type: string;
  status: DeliveryStatus;
  created_at: string;
  updated_at: string;
  delivery_attempts: number;
  error_message: string | null;
  assets_count: number;
  catalog_id: string;
}

const MOCK_DSP_ADAPTERS: DspAdapter[] = [
  {
    id: 'dsp-spotify',
    name: 'Spotify',
    logo_initial: 'S',
    format: 'DDEX ERN 4.2',
    version: 'ERN/4.2.1',
    delivery_method: 'SFTP Push',
    max_file_size: '500 MB',
    required_assets: ['Audio (FLAC/PCM)', 'Cover Art (3000x3000 JPEG)', 'Metadata XML', 'ISRC Codes'],
    auto_delivery: true,
    last_delivery_at: '2026-02-28T08:00:00Z',
    status: 'active',
  },
  {
    id: 'dsp-apple',
    name: 'Apple Music',
    logo_initial: 'A',
    format: 'DDEX ERN 4.2',
    version: 'ERN/4.2.3',
    delivery_method: 'iTunes Producer API',
    max_file_size: '1 GB',
    required_assets: ['Audio (AAC 256kbps + FLAC)', 'Cover Art (4000x4000 JPEG)', 'Metadata XML', 'ISRC Codes', 'Lyrics (timed)'],
    auto_delivery: true,
    last_delivery_at: '2026-02-25T12:00:00Z',
    status: 'active',
  },
  {
    id: 'dsp-amazon',
    name: 'Amazon Music',
    logo_initial: 'Am',
    format: 'DDEX ERN 4.2',
    version: 'ERN/4.2.0',
    delivery_method: 'SFTP Push',
    max_file_size: '750 MB',
    required_assets: ['Audio (FLAC)', 'Cover Art (3000x3000 JPEG)', 'Metadata XML', 'ISRC Codes'],
    auto_delivery: true,
    last_delivery_at: '2026-02-20T10:00:00Z',
    status: 'active',
  },
  {
    id: 'dsp-youtube',
    name: 'YouTube Music',
    logo_initial: 'Y',
    format: 'DDEX ERN 3.8.2',
    version: 'ERN/3.8.2',
    delivery_method: 'YouTube Content ID API',
    max_file_size: '2 GB',
    required_assets: ['Audio (FLAC/MP3)', 'Cover Art (2000x2000 JPEG)', 'Metadata XML', 'Video (optional)', 'ISRC Codes'],
    auto_delivery: false,
    last_delivery_at: '2026-01-15T09:00:00Z',
    status: 'active',
  },
  {
    id: 'dsp-tidal',
    name: 'Tidal',
    logo_initial: 'T',
    format: 'DDEX ERN 4.2',
    version: 'ERN/4.2.1',
    delivery_method: 'SFTP Push',
    max_file_size: '500 MB',
    required_assets: ['Audio (FLAC/MQA)', 'Cover Art (3000x3000 JPEG)', 'Metadata XML', 'ISRC Codes'],
    auto_delivery: true,
    last_delivery_at: '2026-02-18T14:00:00Z',
    status: 'maintenance',
  },
  {
    id: 'dsp-deezer',
    name: 'Deezer',
    logo_initial: 'D',
    format: 'DDEX ERN 4.2',
    version: 'ERN/4.2.0',
    delivery_method: 'Deezer API v2',
    max_file_size: '300 MB',
    required_assets: ['Audio (FLAC)', 'Cover Art (2000x2000 JPEG)', 'Metadata JSON', 'ISRC Codes'],
    auto_delivery: false,
    last_delivery_at: '2025-12-10T08:00:00Z',
    status: 'configuring',
  },
];

const MOCK_DELIVERIES: Delivery[] = [
  {
    id: 'del-001',
    release_title: 'Midnight Skyline (Sync Edit)',
    artist: 'Nova Collective',
    dsp: 'Spotify',
    package_type: 'DDEX ERN 4.2',
    status: 'delivered',
    created_at: '2026-02-25T08:00:00Z',
    updated_at: '2026-02-28T08:00:00Z',
    delivery_attempts: 1,
    error_message: null,
    assets_count: 12,
    catalog_id: 'cat-001',
  },
  {
    id: 'del-002',
    release_title: 'Midnight Skyline (Sync Edit)',
    artist: 'Nova Collective',
    dsp: 'Apple Music',
    package_type: 'DDEX ERN 4.2',
    status: 'delivered',
    created_at: '2026-02-25T08:00:00Z',
    updated_at: '2026-02-27T12:00:00Z',
    delivery_attempts: 1,
    error_message: null,
    assets_count: 14,
    catalog_id: 'cat-001',
  },
  {
    id: 'del-003',
    release_title: 'Electric Pulse (Remastered)',
    artist: 'DJ Flux',
    dsp: 'Spotify',
    package_type: 'DDEX ERN 4.2',
    status: 'processing',
    created_at: '2026-03-01T10:00:00Z',
    updated_at: '2026-03-02T06:00:00Z',
    delivery_attempts: 1,
    error_message: null,
    assets_count: 8,
    catalog_id: 'cat-002',
  },
  {
    id: 'del-004',
    release_title: 'Electric Pulse (Remastered)',
    artist: 'DJ Flux',
    dsp: 'Amazon Music',
    package_type: 'DDEX ERN 4.2',
    status: 'processing',
    created_at: '2026-03-01T10:00:00Z',
    updated_at: '2026-03-02T08:00:00Z',
    delivery_attempts: 1,
    error_message: null,
    assets_count: 8,
    catalog_id: 'cat-002',
  },
  {
    id: 'del-005',
    release_title: 'Golden Horizon (Instrumental)',
    artist: 'The Wanderers',
    dsp: 'Apple Music',
    package_type: 'DDEX ERN 4.2',
    status: 'pending',
    created_at: '2026-03-03T09:00:00Z',
    updated_at: '2026-03-03T09:00:00Z',
    delivery_attempts: 0,
    error_message: null,
    assets_count: 10,
    catalog_id: 'cat-003',
  },
  {
    id: 'del-006',
    release_title: 'Golden Horizon (Instrumental)',
    artist: 'The Wanderers',
    dsp: 'Spotify',
    package_type: 'DDEX ERN 4.2',
    status: 'pending',
    created_at: '2026-03-03T09:00:00Z',
    updated_at: '2026-03-03T09:00:00Z',
    delivery_attempts: 0,
    error_message: null,
    assets_count: 10,
    catalog_id: 'cat-003',
  },
  {
    id: 'del-007',
    release_title: 'Neon Dreams (Game OST)',
    artist: 'Synthwave Runners',
    dsp: 'Tidal',
    package_type: 'DDEX ERN 4.2',
    status: 'failed',
    created_at: '2026-02-18T14:00:00Z',
    updated_at: '2026-02-19T16:00:00Z',
    delivery_attempts: 3,
    error_message: 'Tidal SFTP endpoint returned 503 — maintenance mode active. Retry after 72h.',
    assets_count: 6,
    catalog_id: 'cat-004',
  },
  {
    id: 'del-008',
    release_title: 'Solar Flare (Clean Version)',
    artist: 'Bright Matter',
    dsp: 'YouTube Music',
    package_type: 'DDEX ERN 3.8.2',
    status: 'pending',
    created_at: '2026-03-04T11:00:00Z',
    updated_at: '2026-03-04T11:00:00Z',
    delivery_attempts: 0,
    error_message: null,
    assets_count: 4,
    catalog_id: 'cat-009',
  },
  {
    id: 'del-009',
    release_title: 'Ocean Breeze (Trailer Mix)',
    artist: 'Coral Reef Band',
    dsp: 'Amazon Music',
    package_type: 'DDEX ERN 4.2',
    status: 'delivered',
    created_at: '2026-02-10T08:00:00Z',
    updated_at: '2026-02-15T10:00:00Z',
    delivery_attempts: 1,
    error_message: null,
    assets_count: 8,
    catalog_id: 'cat-005',
  },
  {
    id: 'del-010',
    release_title: 'Thunder Road (Radio Edit)',
    artist: 'Highway Echo',
    dsp: 'Deezer',
    package_type: 'DDEX ERN 4.2',
    status: 'failed',
    created_at: '2026-01-20T10:00:00Z',
    updated_at: '2026-01-22T14:00:00Z',
    delivery_attempts: 2,
    error_message: 'Deezer API v2 auth token expired — adapter reconfiguration required.',
    assets_count: 5,
    catalog_id: 'cat-007',
  },
];

const DELIVERY_STATUS_CONFIG: Record<DeliveryStatus, { icon: React.ReactNode; color: string }> = {
  pending: { icon: <Clock size={16} className="text-amber-600" />, color: 'bg-amber-50 border-amber-200' },
  processing: { icon: <RefreshCw size={16} className="text-blue-600" />, color: 'bg-blue-50 border-blue-200' },
  delivered: { icon: <CheckCircle2 size={16} className="text-green-600" />, color: 'bg-green-50 border-green-200' },
  failed: { icon: <AlertTriangle size={16} className="text-red-600" />, color: 'bg-red-50 border-red-200' },
};

// ─── Page Component ───────────────────────────────────────────────────────────

export function SyncDistributionPage() {
  const { navigate } = useRouter();
  const [expandedDelivery, setExpandedDelivery] = useState<string | null>(null);
  const [expandedAdapter, setExpandedAdapter] = useState<string | null>(null);
  const [deliveryFilter, setDeliveryFilter] = useState<DeliveryStatus | 'all'>('all');

  const filteredDeliveries = deliveryFilter === 'all'
    ? MOCK_DELIVERIES
    : MOCK_DELIVERIES.filter(d => d.status === deliveryFilter);

  const deliveryStats = {
    pending: MOCK_DELIVERIES.filter(d => d.status === 'pending').length,
    processing: MOCK_DELIVERIES.filter(d => d.status === 'processing').length,
    delivered: MOCK_DELIVERIES.filter(d => d.status === 'delivered').length,
    failed: MOCK_DELIVERIES.filter(d => d.status === 'failed').length,
  };

  const activeAdapters = MOCK_DSP_ADAPTERS.filter(a => a.status === 'active').length;

  return (
    <div>
      <PageHeader
        title="Distribution Pipeline"
        description="Manage DSP adapter configurations, DDEX ERN 4.2 delivery packages, and monitor delivery status across digital service providers."
        actions={
          <Button variant="primary" size="sm">
            <Send size={14} /> New Delivery
          </Button>
        }
      />

      {/* Stats overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Active DSPs" value={activeAdapters} icon={<Server size={28} />} trend={`${MOCK_DSP_ADAPTERS.length} total adapters`} />
        <StatCard label="Queue Size" value={deliveryStats.pending + deliveryStats.processing} icon={<Package size={28} />} trend="In delivery pipeline" />
        <StatCard label="Delivered" value={deliveryStats.delivered} icon={<CheckCircle2 size={28} />} />
        <StatCard label="Failed" value={deliveryStats.failed} icon={<AlertTriangle size={28} />} trend="Requires attention" />
      </div>

      {/* DSP Adapter Config Cards */}
      <h2 className="text-lg font-semibold text-neutral-900 mb-4">DSP Adapter Configurations</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {MOCK_DSP_ADAPTERS.map(adapter => {
          const isExpanded = expandedAdapter === adapter.id;
          const statusConfig = adapter.status === 'active'
            ? { color: 'bg-green-100 text-green-700', icon: <CheckCircle2 size={14} className="text-green-600" /> }
            : adapter.status === 'maintenance'
            ? { color: 'bg-amber-100 text-amber-700', icon: <Clock size={14} className="text-amber-600" /> }
            : { color: 'bg-blue-100 text-blue-700', icon: <Settings size={14} className="text-blue-600" /> };

          return (
            <Card key={adapter.id} className="p-4">
              {/* Adapter header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-lg bg-neutral-900 flex items-center justify-center text-white text-sm font-bold">
                    {adapter.logo_initial}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-neutral-900">{adapter.name}</p>
                    <p className="text-xs text-neutral-500">{adapter.format}</p>
                  </div>
                </div>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-medium text-xs ${statusConfig.color}`}>
                  {statusConfig.icon} {adapter.status}
                </span>
              </div>

              {/* Adapter quick details */}
              <div className="space-y-2 mb-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-neutral-400">Delivery Method</span>
                  <span className="text-neutral-900 font-medium">{adapter.delivery_method}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-neutral-400">Max File Size</span>
                  <span className="text-neutral-900 font-medium">{adapter.max_file_size}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-neutral-400">Auto-Delivery</span>
                  <span className="font-medium">{adapter.auto_delivery ? <Badge color="green" size="sm">Enabled</Badge> : <Badge color="gray" size="sm">Manual</Badge>}</span>
                </div>
              </div>

              {/* Expand/collapse */}
              <button
                onClick={() => setExpandedAdapter(isExpanded ? null : adapter.id)}
                className="text-xs text-neutral-500 hover:text-neutral-900 flex items-center gap-1 w-full"
              >
                {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                {isExpanded ? 'Hide details' : 'Show required assets & config'}
              </button>

              {isExpanded && (
                <div className="mt-3 pt-3 border-t border-neutral-200">
                  <p className="text-xs font-semibold uppercase text-neutral-400 mb-2">Required Assets</p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {adapter.required_assets.map(a => <Badge key={a} color="gray" size="sm">{a}</Badge>)}
                  </div>
                  <p className="text-xs font-semibold uppercase text-neutral-400 mb-2">Version</p>
                  <p className="text-sm text-neutral-900 mb-3">{adapter.version}</p>
                  <p className="text-xs font-semibold uppercase text-neutral-400 mb-2">Last Delivery</p>
                  <p className="text-sm text-neutral-900">{formatDate(adapter.last_delivery_at)}</p>
                  <div className="flex items-center gap-2 mt-3">
                    <Button variant="secondary" size="sm"><Settings size={14} /> Configure</Button>
                    {adapter.status === 'maintenance' && <Button variant="secondary" size="sm"><RefreshCw size={14} /> Check Status</Button>}
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* Delivery Queue */}
      <h2 className="text-lg font-semibold text-neutral-900 mb-4">Delivery Queue</h2>

      {/* Delivery status filter */}
      <div className="flex items-center gap-3 mb-4">
        <select
          value={deliveryFilter}
          onChange={e => setDeliveryFilter(e.target.value as DeliveryStatus | 'all')}
          className="text-sm bg-white border border-neutral-200 rounded-lg px-3 py-1.5"
        >
          <option value="all">All Statuses</option>
          {Object.entries(DELIVERY_STATUS_CONFIG).map(([key]) => (
            <option key={key} value={key}>{key.charAt(0).toUpperCase() + key.slice(1)}</option>
          ))}
        </select>
        <p className="text-sm text-neutral-500">{filteredDeliveries.length} deliveries</p>
      </div>

      {/* Status filter cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {Object.entries(deliveryStats).map(([status, count]) => {
          const config = DELIVERY_STATUS_CONFIG[status as DeliveryStatus];
          return (
            <Card
              key={status}
              className={`p-3 cursor-pointer transition-colors border ${config.color} ${deliveryFilter === status ? 'ring-2 ring-neutral-900' : ''}`}
              onClick={() => setDeliveryFilter(deliveryFilter === status ? 'all' : status as DeliveryStatus)}
            >
              <div className="flex items-center gap-2 mb-1">{config.icon}<p className="text-xs font-medium capitalize">{status}</p></div>
              <p className="text-lg font-semibold text-neutral-900">{count}</p>
            </Card>
          );
        })}
      </div>

      {/* Delivery list */}
      {filteredDeliveries.length === 0 ? (
        <Card className="p-8">
          <EmptyState icon={<Send size={32} />} title="No deliveries found" description="No deliveries match the current filter." />
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredDeliveries.map(delivery => {
            const isExpanded = expandedDelivery === delivery.id;
            const config = DELIVERY_STATUS_CONFIG[delivery.status];
            return (
              <Card key={delivery.id} className="p-4">
                {/* Header row */}
                <div className="flex items-center justify-between cursor-pointer" onClick={() => setExpandedDelivery(isExpanded ? null : delivery.id)}>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center border ${config.color}`}>
                      {config.icon}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-neutral-900">{delivery.release_title}</p>
                      <p className="text-xs text-neutral-500">{delivery.artist} · {delivery.dsp} · {delivery.package_type}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={delivery.status} />
                    <Badge color="gray" size="sm">{delivery.assets_count} assets</Badge>
                    <button className="text-neutral-400">
                      {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>
                  </div>
                </div>

                {/* Expanded details */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-neutral-200 space-y-4">
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                      <div className="p-3 rounded-lg bg-neutral-50">
                        <p className="text-xs text-neutral-400">DSP</p>
                        <p className="text-sm text-neutral-900">{delivery.dsp}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-neutral-50">
                        <p className="text-xs text-neutral-400">Package Type</p>
                        <p className="text-sm text-neutral-900 flex items-center gap-1"><FileArchive size={12} /> {delivery.package_type}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-neutral-50">
                        <p className="text-xs text-neutral-400">Delivery Attempts</p>
                        <p className="text-sm text-neutral-900">{delivery.delivery_attempts}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-neutral-50">
                        <p className="text-xs text-neutral-400">Assets</p>
                        <p className="text-sm text-neutral-900">{delivery.assets_count} files</p>
                      </div>
                      <div className="p-3 rounded-lg bg-neutral-50">
                        <p className="text-xs text-neutral-400">Created</p>
                        <p className="text-sm text-neutral-900">{formatDateTime(delivery.created_at)}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-neutral-50">
                        <p className="text-xs text-neutral-400">Last Updated</p>
                        <p className="text-sm text-neutral-900">{formatDateTime(delivery.updated_at)}</p>
                      </div>
                    </div>

                    {/* Error message */}
                    {delivery.error_message && (
                      <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                        <p className="text-xs text-red-600 font-semibold mb-1">Error</p>
                        <p className="text-sm text-red-700">{delivery.error_message}</p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-2 pt-2">
                      {delivery.status === 'failed' && (
                        <Button variant="primary" size="sm"><RefreshCw size={14} /> Retry Delivery</Button>
                      )}
                      {delivery.status === 'pending' && (
                        <Button variant="primary" size="sm"><Send size={14} /> Push to DSP</Button>
                      )}
                      {delivery.status === 'delivered' && (
                        <Button variant="secondary" size="sm"><CheckCircle2 size={14} /> Confirm Live</Button>
                      )}
                      <Button variant="ghost" size="sm" onClick={() => navigate(`/sync/track/${delivery.catalog_id}`)}>
                        <Music size={14} /> View Release
                      </Button>
                    </div>
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
