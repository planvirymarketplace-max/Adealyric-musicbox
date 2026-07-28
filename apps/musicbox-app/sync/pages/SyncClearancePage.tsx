'use client';

import { useState } from 'react';
import { useRouter } from '@/lib/router';
import { formatDate } from '@/lib/format';
import { Card, StatCard } from '@/components/ui/Card';
import { Badge, StatusBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { PageHeader } from '@/components/layout/PageHeader';
import { EmptyState } from '@/components/ui/States';
import {
  Shield, CheckCircle2, AlertTriangle, Ban, Clock, Search,
  ChevronDown, ChevronUp, User, Building2, MapPin, Music, Lock, Unlock
} from 'lucide-react';

// ─── Mock Data ────────────────────────────────────────────────────────────────

type ClearanceStatus = 'one_stop' | 'partial' | 'pending_verification' | 'blocked';

interface ClearanceRecord {
  id: string;
  song_title: string;
  artist: string;
  clearance_status: ClearanceStatus;
  master_owner: string;
  publisher: string;
  sync_rights_holder: string;
  rights_holder_contact: string;
  territory_restrictions: string[];
  master_clearance: 'cleared' | 'pending' | 'blocked';
  sync_rights_clearance: 'cleared' | 'pending' | 'blocked';
  publisher_clearance: 'cleared' | 'pending' | 'blocked';
  last_verified_at: string;
  notes: string;
}

const MOCK_CLEARANCE: ClearanceRecord[] = [
  {
    id: 'clr-001',
    song_title: 'Midnight Skyline',
    artist: 'Nova Collective',
    clearance_status: 'one_stop',
    master_owner: 'IndieStar Records',
    publisher: 'StarSync Publishing',
    sync_rights_holder: 'IndieStar Records (controls master + sync)',
    rights_holder_contact: 'rights@indiestar.com',
    territory_restrictions: [],
    master_clearance: 'cleared',
    sync_rights_clearance: 'cleared',
    publisher_clearance: 'cleared',
    last_verified_at: '2026-02-20T10:00:00Z',
    notes: 'One-stop clearance — all rights controlled by single entity. Fast-track licensing available.',
  },
  {
    id: 'clr-002',
    song_title: 'Electric Pulse',
    artist: 'DJ Flux',
    clearance_status: 'one_stop',
    master_owner: 'Flux Music Group',
    publisher: 'Flux Music Group',
    sync_rights_holder: 'Flux Music Group (master + publisher + sync)',
    rights_holder_contact: 'sync@fluxmusic.com',
    territory_restrictions: [],
    master_clearance: 'cleared',
    sync_rights_clearance: 'cleared',
    publisher_clearance: 'cleared',
    last_verified_at: '2026-02-18T08:00:00Z',
    notes: 'Fully self-contained rights. One-stop clearance confirmed. No third-party approvals needed.',
  },
  {
    id: 'clr-003',
    song_title: 'Golden Horizon',
    artist: 'The Wanderers',
    clearance_status: 'partial',
    master_owner: 'BigWave Records',
    publisher: 'Harmony House Publishing',
    sync_rights_holder: 'Harmony House Publishing',
    rights_holder_contact: 'licensing@harmonyhouse.com',
    territory_restrictions: ['Japan', 'South Korea'],
    master_clearance: 'cleared',
    sync_rights_clearance: 'cleared',
    publisher_clearance: 'pending',
    last_verified_at: '2026-01-15T14:00:00Z',
    notes: 'Publisher clearance pending for certain co-writing shares. Japan/Korea territories restricted due to sub-licensing agreements.',
  },
  {
    id: 'clr-004',
    song_title: 'Neon Dreams',
    artist: 'Synthwave Runners',
    clearance_status: 'partial',
    master_owner: 'Ubisoft Music',
    publisher: 'Electronic Arts Publishing Co.',
    sync_rights_holder: 'Ubisoft Music',
    rights_holder_contact: 'sync@ubisoft-music.com',
    territory_restrictions: ['China'],
    master_clearance: 'cleared',
    sync_rights_clearance: 'pending',
    publisher_clearance: 'cleared',
    last_verified_at: '2026-02-01T09:00:00Z',
    notes: 'Sync rights pending — co-publisher approval required. China territory excluded due to existing exclusive license.',
  },
  {
    id: 'clr-005',
    song_title: 'Ocean Breeze',
    artist: 'Coral Reef Band',
    clearance_status: 'pending_verification',
    master_owner: 'Tidal Sound',
    publisher: 'Oceanic Publishing Ltd.',
    sync_rights_holder: 'Unknown — under investigation',
    rights_holder_contact: 'info@tidalsound.com',
    territory_restrictions: ['Brazil', 'Argentina'],
    master_clearance: 'pending',
    sync_rights_clearance: 'pending',
    publisher_clearance: 'pending',
    last_verified_at: '2025-12-10T11:00:00Z',
    notes: 'Rights chain under verification. Multiple co-writers with unconfirmed publishing splits. Brazil/Argentina under separate distribution deal.',
  },
  {
    id: 'clr-006',
    song_title: 'Fading Light',
    artist: 'Ember & Ash',
    clearance_status: 'pending_verification',
    master_owner: 'Shadow Label Group',
    publisher: 'Dark Ink Publishing',
    sync_rights_holder: 'Dark Ink Publishing (partial)',
    rights_holder_contact: 'rights@darkink.com',
    territory_restrictions: [],
    master_clearance: 'pending',
    sync_rights_clearance: 'pending',
    publisher_clearance: 'cleared',
    last_verified_at: '2026-01-28T16:00:00Z',
    notes: 'Master ownership chain being verified — previous label acquisition may affect current rights holder. Publisher side cleared.',
  },
  {
    id: 'clr-007',
    song_title: 'Thunder Road',
    artist: 'Highway Echo',
    clearance_status: 'blocked',
    master_owner: 'MajorCorp Music',
    publisher: 'Global Hits Publishing',
    sync_rights_holder: 'Global Hits Publishing',
    rights_holder_contact: 'sync@globalhits.com',
    territory_restrictions: ['Worldwide — exclusive deal active'],
    master_clearance: 'blocked',
    sync_rights_clearance: 'blocked',
    publisher_clearance: 'blocked',
    last_verified_at: '2026-02-15T12:00:00Z',
    notes: 'Blocked — existing worldwide exclusive sync deal with competing agency active until Dec 2027. No sync licensing available.',
  },
  {
    id: 'clr-008',
    song_title: 'Velvet Night',
    artist: 'Luna Strings',
    clearance_status: 'blocked',
    master_owner: 'Classical Masters Inc.',
    publisher: 'Traditional Rights Holdings',
    sync_rights_holder: 'Disputed — legal proceedings active',
    rights_holder_contact: 'legal@classicalmasters.com',
    territory_restrictions: ['Germany', 'Austria', 'Switzerland'],
    master_clearance: 'blocked',
    sync_rights_clearance: 'blocked',
    publisher_clearance: 'blocked',
    last_verified_at: '2025-11-20T09:00:00Z',
    notes: 'Rights dispute in DACH region — ongoing legal proceedings between co-owners. All sync licensing suspended until resolution.',
  },
  {
    id: 'clr-009',
    song_title: 'Solar Flare',
    artist: 'Bright Matter',
    clearance_status: 'one_stop',
    master_owner: 'Bright Matter Studios',
    publisher: 'Bright Matter Studios',
    sync_rights_holder: 'Bright Matter Studios (all rights)',
    rights_holder_contact: 'sync@brightmatter.com',
    territory_restrictions: [],
    master_clearance: 'cleared',
    sync_rights_clearance: 'cleared',
    publisher_clearance: 'cleared',
    last_verified_at: '2026-02-25T08:00:00Z',
    notes: 'Fully independent artist-owned catalog. One-stop clearance with instant approval workflow. No territory restrictions.',
  },
  {
    id: 'clr-010',
    song_title: 'Cascade Falls',
    artist: 'Waterfall Project',
    clearance_status: 'partial',
    master_owner: 'River Sound Label',
    publisher: 'Flow Publishing + Third Stream Co.',
    sync_rights_holder: 'Flow Publishing',
    rights_holder_contact: 'sync@flowpub.com',
    territory_restrictions: ['India', 'Southeast Asia'],
    master_clearance: 'cleared',
    sync_rights_clearance: 'cleared',
    publisher_clearance: 'pending',
    last_verified_at: '2026-02-10T10:00:00Z',
    notes: 'Co-publisher Third Stream Co. approval needed for India/SEA territories. Master and primary sync rights cleared for all other territories.',
  },
  {
    id: 'clr-011',
    song_title: 'Crystal Dawn',
    artist: 'Prism Orchestra',
    clearance_status: 'pending_verification',
    master_owner: 'Verification Pending',
    publisher: 'Prism Publishing Ltd.',
    sync_rights_holder: 'Under review',
    rights_holder_contact: 'admin@prismorchestra.com',
    territory_restrictions: ['Russia', 'Belarus'],
    master_clearance: 'pending',
    sync_rights_clearance: 'pending',
    publisher_clearance: 'cleared',
    last_verified_at: '2026-01-05T13:00:00Z',
    notes: 'Master ownership transfer from defunct label being verified. Publisher side cleared. Russia/Belarus territories restricted due to sanctions compliance.',
  },
];

const CLEARANCE_STATUS_CONFIG: Record<ClearanceStatus, { label: string; color: string; icon: React.ReactNode; description: string }> = {
  one_stop: { label: 'One-Stop', color: 'bg-green-100 text-green-700 border-green-200', icon: <Unlock size={16} className="text-green-600" />, description: 'All rights held by single entity — instant clearance' },
  partial: { label: 'Partial', color: 'bg-amber-100 text-amber-700 border-amber-200', icon: <AlertTriangle size={16} className="text-amber-600" />, description: 'Some rights cleared, others pending or restricted' },
  pending_verification: { label: 'Pending Verification', color: 'bg-blue-100 text-blue-700 border-blue-200', icon: <Clock size={16} className="text-blue-600" />, description: 'Rights chain under verification — not yet confirmed' },
  blocked: { label: 'Blocked', color: 'bg-red-100 text-red-700 border-red-200', icon: <Ban size={16} className="text-red-600" />, description: 'Cannot license — rights dispute, exclusive deal, or legal hold' },
};

const FILTER_OPTIONS: ClearanceStatus[] = ['one_stop', 'partial', 'pending_verification', 'blocked'];

// ─── Page Component ───────────────────────────────────────────────────────────

export function SyncClearancePage() {
  const { navigate } = useRouter();
  const [statusFilter, setStatusFilter] = useState<ClearanceStatus | 'all'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = MOCK_CLEARANCE.filter(c => {
    if (statusFilter !== 'all' && c.clearance_status !== statusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return c.song_title.toLowerCase().includes(q) || c.artist.toLowerCase().includes(q);
    }
    return true;
  });

  const counts = {
    one_stop: MOCK_CLEARANCE.filter(c => c.clearance_status === 'one_stop').length,
    partial: MOCK_CLEARANCE.filter(c => c.clearance_status === 'partial').length,
    pending_verification: MOCK_CLEARANCE.filter(c => c.clearance_status === 'pending_verification').length,
    blocked: MOCK_CLEARANCE.filter(c => c.clearance_status === 'blocked').length,
  };

  const quickLicenseCount = counts.one_stop;

  return (
    <div>
      <PageHeader
        title="Clearance Tracker"
        description="Monitor rights clearance status across your catalog. One-stop clearance songs are ready for instant licensing."
        actions={
          <Button variant="primary" size="sm" onClick={() => setStatusFilter('one_stop')}>
            <Unlock size={14} /> Quick License ({quickLicenseCount} one-stop)
          </Button>
        }
      />

      {/* Stats overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="One-Stop Clearance" value={counts.one_stop} icon={<Unlock size={28} />} trend="Ready for instant licensing" />
        <StatCard label="Partial Clearance" value={counts.partial} icon={<AlertTriangle size={28} />} trend="Some rights pending" />
        <StatCard label="Pending Verification" value={counts.pending_verification} icon={<Clock size={28} />} />
        <StatCard label="Blocked" value={counts.blocked} icon={<Ban size={28} />} trend="Cannot license currently" />
      </div>

      {/* One-Stop Quick License Highlight */}
      {statusFilter === 'one_stop' && (
        <Card className="p-5 mb-6 border-green-200 bg-green-50">
          <div className="flex items-center gap-3 mb-3">
            <Unlock size={20} className="text-green-600" />
            <h3 className="font-semibold text-green-800">One-Stop Clearance — Quick License Ready</h3>
          </div>
          <p className="text-sm text-green-700 mb-3">These songs have all rights (master, publisher, sync) controlled by a single entity. No third-party approvals needed — license immediately.</p>
          <div className="flex flex-wrap gap-2">
            {MOCK_CLEARANCE.filter(c => c.clearance_status === 'one_stop').map(c => (
              <button
                key={c.id}
                onClick={() => setExpandedId(c.id)}
                className="px-3 py-1.5 rounded-lg bg-white border border-green-200 text-sm font-medium text-green-800 hover:bg-green-100 transition-colors"
              >
                {c.song_title} — {c.artist}
              </button>
            ))}
          </div>
        </Card>
      )}

      {/* Filter controls */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-xs">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search songs or artists..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-neutral-200 rounded-lg focus:outline-none focus:border-neutral-400"
          />
        </div>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value as ClearanceStatus | 'all')}
          className="text-sm bg-white border border-neutral-200 rounded-lg px-3 py-1.5"
        >
          <option value="all">All Clearance Statuses</option>
          {FILTER_OPTIONS.map(s => (
            <option key={s} value={s}>{CLEARANCE_STATUS_CONFIG[s].label}</option>
          ))}
        </select>
        <p className="text-sm text-neutral-500">{filtered.length} songs</p>
      </div>

      {/* Status filter cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {FILTER_OPTIONS.map(s => {
          const config = CLEARANCE_STATUS_CONFIG[s];
          return (
            <Card
              key={s}
              className={`p-3 cursor-pointer transition-colors border ${config.color} ${statusFilter === s ? 'ring-2 ring-neutral-900' : ''}`}
              onClick={() => setStatusFilter(statusFilter === s ? 'all' : s)}
            >
              <div className="flex items-center gap-2 mb-1">
                {config.icon}
                <p className="text-xs font-medium">{config.label}</p>
              </div>
              <p className="text-lg font-semibold text-neutral-900">{counts[s]}</p>
              <p className="text-xs text-neutral-500 mt-1">{config.description}</p>
            </Card>
          );
        })}
      </div>

      {/* Clearance records */}
      {filtered.length === 0 ? (
        <Card className="p-8">
          <EmptyState icon={<Shield size={32} />} title="No songs found" description="Adjust your search or filter criteria." />
        </Card>
      ) : (
        <div className="space-y-4">
          {filtered.map(record => {
            const isExpanded = expandedId === record.id;
            const config = CLEARANCE_STATUS_CONFIG[record.clearance_status];
            return (
              <Card key={record.id} className="p-5">
                {/* Header */}
                <div className="flex items-center justify-between cursor-pointer" onClick={() => setExpandedId(isExpanded ? null : record.id)}>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${record.clearance_status === 'one_stop' ? 'bg-green-100' : 'bg-neutral-100'}`}>
                      {config.icon}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-neutral-900">{record.song_title}</p>
                      <p className="text-xs text-neutral-500">{record.artist}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-medium text-xs border ${config.color}`}>
                      {config.icon} {config.label}
                    </span>
                    <button className="text-neutral-400">
                      {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>
                  </div>
                </div>

                {/* Quick clearance indicators */}
                <div className="grid grid-cols-3 gap-3 mt-3">
                  <div className={`p-2 rounded-lg ${record.master_clearance === 'cleared' ? 'bg-green-50' : record.master_clearance === 'blocked' ? 'bg-red-50' : 'bg-amber-50'}`}>
                    <p className="text-xs text-neutral-400">Master</p>
                    <p className="text-sm font-medium flex items-center gap-1">
                      {record.master_clearance === 'cleared' ? <CheckCircle2 size={14} className="text-green-600" /> :
                       record.master_clearance === 'blocked' ? <Ban size={14} className="text-red-600" /> :
                       <Clock size={14} className="text-amber-600" />}
                      <span className="capitalize">{record.master_clearance}</span>
                    </p>
                  </div>
                  <div className={`p-2 rounded-lg ${record.sync_rights_clearance === 'cleared' ? 'bg-green-50' : record.sync_rights_clearance === 'blocked' ? 'bg-red-50' : 'bg-amber-50'}`}>
                    <p className="text-xs text-neutral-400">Sync Rights</p>
                    <p className="text-sm font-medium flex items-center gap-1">
                      {record.sync_rights_clearance === 'cleared' ? <CheckCircle2 size={14} className="text-green-600" /> :
                       record.sync_rights_clearance === 'blocked' ? <Ban size={14} className="text-red-600" /> :
                       <Clock size={14} className="text-amber-600" />}
                      <span className="capitalize">{record.sync_rights_clearance}</span>
                    </p>
                  </div>
                  <div className={`p-2 rounded-lg ${record.publisher_clearance === 'cleared' ? 'bg-green-50' : record.publisher_clearance === 'blocked' ? 'bg-red-50' : 'bg-amber-50'}`}>
                    <p className="text-xs text-neutral-400">Publisher</p>
                    <p className="text-sm font-medium flex items-center gap-1">
                      {record.publisher_clearance === 'cleared' ? <CheckCircle2 size={14} className="text-green-600" /> :
                       record.publisher_clearance === 'blocked' ? <Ban size={14} className="text-red-600" /> :
                       <Clock size={14} className="text-amber-600" />}
                      <span className="capitalize">{record.publisher_clearance}</span>
                    </p>
                  </div>
                </div>

                {/* Expanded details */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-neutral-200 space-y-4">
                    {/* Rights holder info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="p-3 rounded-lg bg-neutral-50">
                        <p className="text-xs text-neutral-400 flex items-center gap-1"><Building2 size={12} /> Master Owner</p>
                        <p className="text-sm font-medium text-neutral-900">{record.master_owner}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-neutral-50">
                        <p className="text-xs text-neutral-400 flex items-center gap-1"><Building2 size={12} /> Publisher</p>
                        <p className="text-sm font-medium text-neutral-900">{record.publisher}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-neutral-50">
                        <p className="text-xs text-neutral-400 flex items-center gap-1"><User size={12} /> Sync Rights Holder</p>
                        <p className="text-sm font-medium text-neutral-900">{record.sync_rights_holder}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-neutral-50">
                        <p className="text-xs text-neutral-400 flex items-center gap-1"><User size={12} /> Contact</p>
                        <p className="text-sm text-neutral-900">{record.rights_holder_contact}</p>
                      </div>
                    </div>

                    {/* Territory restrictions */}
                    <div className="p-3 rounded-lg bg-neutral-50">
                      <p className="text-xs text-neutral-400 flex items-center gap-1 mb-1"><MapPin size={12} /> Territory Restrictions</p>
                      {record.territory_restrictions.length > 0 ? (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {record.territory_restrictions.map(t => <Badge key={t} color="red" size="sm">{t}</Badge>)}
                        </div>
                      ) : (
                        <p className="text-sm text-neutral-600 mt-1">None — available worldwide</p>
                      )}
                    </div>

                    {/* Verification date */}
                    <div className="p-3 rounded-lg bg-neutral-50">
                      <p className="text-xs text-neutral-400 flex items-center gap-1"><Clock size={12} /> Last Verified</p>
                      <p className="text-sm text-neutral-900">{formatDate(record.last_verified_at)}</p>
                    </div>

                    {/* Notes */}
                    <div className="p-3 rounded-lg bg-neutral-50">
                      <p className="text-xs text-neutral-400 mb-1">Notes</p>
                      <p className="text-sm text-neutral-600">{record.notes}</p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 pt-2">
                      {record.clearance_status === 'one_stop' && (
                        <Button variant="primary" size="sm" onClick={() => navigate('/sync/license-requests')}>
                          <Unlock size={14} /> Quick License
                        </Button>
                      )}
                      {record.clearance_status === 'partial' && (
                        <Button variant="secondary" size="sm">Request Missing Clearance</Button>
                      )}
                      {record.clearance_status === 'pending_verification' && (
                        <Button variant="secondary" size="sm">Initiate Verification</Button>
                      )}
                      <Button variant="ghost" size="sm" onClick={() => navigate(`/sync/track/${record.id}`)}>
                        <Music size={14} /> View Track
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
