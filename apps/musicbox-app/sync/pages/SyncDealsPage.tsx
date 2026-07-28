'use client';

import { useState } from 'react';
import { useRouter } from '@/lib/router';
import { formatCents, formatDate } from '@/lib/format';
import { Card, StatCard } from '@/components/ui/Card';
import { Badge, StatusBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { PageHeader } from '@/components/layout/PageHeader';
import { EmptyState } from '@/components/ui/States';
import {
  Handshake, DollarSign, Clock, CheckCircle2, ChevronDown, ChevronUp,
  ArrowUpRight, Film, Tv, Gamepad2, Megaphone, MessageSquare, User, MapPin, CalendarDays
} from 'lucide-react';

// ─── Mock Data ────────────────────────────────────────────────────────────────

interface SyncDeal {
  id: string;
  song_title: string;
  licensee: string;
  usage_type: 'film' | 'tv' | 'ad' | 'game' | 'trailer';
  proposed_fee_cents: number;
  territory: string;
  term_length: string;
  status: 'negotiating' | 'proposed' | 'accepted' | 'completed' | 'declined' | 'countered';
  created_at: string;
  updated_at: string;
  negotiation_timeline: { date: string; event: string; detail: string; by: string }[];
}

const MOCK_DEALS: SyncDeal[] = [
  {
    id: 'deal-001',
    song_title: 'Midnight Skyline',
    licensee: 'Warner Bros. Pictures',
    usage_type: 'film',
    proposed_fee_cents: 750000,
    territory: 'Worldwide',
    term_length: '5 years',
    status: 'negotiating',
    created_at: '2025-11-02T10:00:00Z',
    updated_at: '2025-12-28T14:30:00Z',
    negotiation_timeline: [
      { date: '2025-11-02', event: 'Request Received', detail: 'Initial sync request for feature film "Neon Horizons"', by: 'Warner Bros.' },
      { date: '2025-11-08', event: 'Fee Proposed', detail: '$7,500 proposed for worldwide film sync, 5-year term', by: 'Sync Agent' },
      { date: '2025-11-15', event: 'Counter Offer', detail: 'Warner Bros. counters at $5,000, requests 3-year term', by: 'Warner Bros.' },
      { date: '2025-12-01', event: 'Re-counter', detail: '$6,500 with 5-year term, territory restricted to NA + EU', by: 'Sync Agent' },
      { date: '2025-12-28', event: 'Under Discussion', detail: 'Negotiation ongoing — awaiting licensee response on latest terms', by: 'Warner Bros.' },
    ],
  },
  {
    id: 'deal-002',
    song_title: 'Electric Pulse',
    licensee: 'HBO Productions',
    usage_type: 'tv',
    proposed_fee_cents: 320000,
    territory: 'North America',
    term_length: '3 years',
    status: 'proposed',
    created_at: '2025-12-10T08:00:00Z',
    updated_at: '2025-12-15T12:00:00Z',
    negotiation_timeline: [
      { date: '2025-12-10', event: 'Request Received', detail: 'TV series "City Lights" episode 4 background usage', by: 'HBO' },
      { date: '2025-12-15', event: 'Fee Proposed', detail: '$3,200 for NA TV sync, 3-year term, background use only', by: 'Sync Agent' },
    ],
  },
  {
    id: 'deal-003',
    song_title: 'Golden Horizon',
    licensee: 'Nike Global Marketing',
    usage_type: 'ad',
    proposed_fee_cents: 500000,
    territory: 'Worldwide',
    term_length: '2 years',
    status: 'accepted',
    created_at: '2025-10-15T09:00:00Z',
    updated_at: '2025-11-20T16:00:00Z',
    negotiation_timeline: [
      { date: '2025-10-15', event: 'Request Received', detail: 'Nike "Run Beyond" global campaign — 30s spot', by: 'Nike' },
      { date: '2025-10-20', event: 'Fee Proposed', detail: '$5,000 worldwide, 2-year ad campaign term', by: 'Sync Agent' },
      { date: '2025-10-28', event: 'Negotiation', detail: 'Nike requests 1-year term at $4,000', by: 'Nike' },
      { date: '2025-11-05', event: 'Agreement Reached', detail: '$5,000 for 2-year worldwide term accepted', by: 'Both Parties' },
      { date: '2025-11-20', event: 'Deal Signed', detail: 'License agreement executed and countersigned', by: 'Legal Team' },
    ],
  },
  {
    id: 'deal-004',
    song_title: 'Neon Dreams',
    licensee: 'Ubisoft Entertainment',
    usage_type: 'game',
    proposed_fee_cents: 450000,
    territory: 'Worldwide',
    term_length: 'Perpetual',
    status: 'completed',
    created_at: '2025-08-01T07:00:00Z',
    updated_at: '2025-09-30T10:00:00Z',
    negotiation_timeline: [
      { date: '2025-08-01', event: 'Request Received', detail: 'Ubisoft "Cyber Run 2" in-game soundtrack usage', by: 'Ubisoft' },
      { date: '2025-08-10', event: 'Fee Proposed', detail: '$4,500 perpetual worldwide game sync', by: 'Sync Agent' },
      { date: '2025-08-18', event: 'Accepted', detail: 'Ubisoft accepts proposed terms', by: 'Ubisoft' },
      { date: '2025-08-25', event: 'Contract Signed', detail: 'Agreement executed', by: 'Legal Team' },
      { date: '2025-09-30', event: 'Assets Delivered', detail: 'Stems and master delivered, deal marked completed', by: 'Operations' },
    ],
  },
  {
    id: 'deal-005',
    song_title: 'Ocean Breeze',
    licensee: 'Paramount Pictures',
    usage_type: 'trailer',
    proposed_fee_cents: 200000,
    territory: 'North America',
    term_length: '1 year',
    status: 'countered',
    created_at: '2025-12-05T11:00:00Z',
    updated_at: '2025-12-20T09:00:00Z',
    negotiation_timeline: [
      { date: '2025-12-05', event: 'Request Received', detail: 'Trailer for "Deep Blue" — theatrical trailer usage', by: 'Paramount' },
      { date: '2025-12-10', event: 'Fee Proposed', detail: '$2,000 NA trailer, 1-year term', by: 'Sync Agent' },
      { date: '2025-12-20', event: 'Counter Offer', detail: 'Paramount offers $1,200, 6-month term', by: 'Paramount' },
    ],
  },
  {
    id: 'deal-006',
    song_title: 'Fading Light',
    licensee: 'Amazon Studios',
    usage_type: 'tv',
    proposed_fee_cents: 280000,
    territory: 'Worldwide',
    term_length: '3 years',
    status: 'negotiating',
    created_at: '2025-12-18T13:00:00Z',
    updated_at: '2026-01-02T08:00:00Z',
    negotiation_timeline: [
      { date: '2025-12-18', event: 'Request Received', detail: 'Amazon original series "Last Signal" — opening theme', by: 'Amazon' },
      { date: '2025-12-22', event: 'Fee Proposed', detail: '$2,800 worldwide, 3-year TV series term', by: 'Sync Agent' },
      { date: '2026-01-02', event: 'Under Discussion', detail: 'Amazon reviewing terms — requesting featured use clause', by: 'Amazon' },
    ],
  },
  {
    id: 'deal-007',
    song_title: 'Thunder Road',
    licensee: 'Ford Motor Company',
    usage_type: 'ad',
    proposed_fee_cents: 380000,
    territory: 'North America + Europe',
    term_length: '1 year',
    status: 'proposed',
    created_at: '2026-01-05T10:00:00Z',
    updated_at: '2026-01-08T14:00:00Z',
    negotiation_timeline: [
      { date: '2026-01-05', event: 'Request Received', detail: 'Ford "Drive Forward" 2026 campaign — 15s + 30s spots', by: 'Ford' },
      { date: '2026-01-08', event: 'Fee Proposed', detail: '$3,800 NA + EU, 1-year ad term, multiple spot lengths', by: 'Sync Agent' },
    ],
  },
  {
    id: 'deal-008',
    song_title: 'Velvet Night',
    licensee: 'Disney Studios',
    usage_type: 'film',
    proposed_fee_cents: 600000,
    territory: 'Worldwide',
    term_length: '10 years',
    status: 'declined',
    created_at: '2025-09-01T08:00:00Z',
    updated_at: '2025-10-15T11:00:00Z',
    negotiation_timeline: [
      { date: '2025-09-01', event: 'Request Received', detail: 'Disney animated feature "Starlight" — musical sequence', by: 'Disney' },
      { date: '2025-09-10', event: 'Fee Proposed', detail: '$6,000 worldwide, 10-year film term', by: 'Sync Agent' },
      { date: '2025-09-20', event: 'Counter Offer', detail: 'Disney offers $3,500, 7-year term', by: 'Disney' },
      { date: '2025-10-01', event: 'Terms Rejected', detail: 'Minimum fee threshold not met — declined by rights holders', by: 'Sync Agent' },
      { date: '2025-10-15', event: 'Deal Closed', detail: 'Negotiation ended — no agreement reached', by: 'Both Parties' },
    ],
  },
];

const USAGE_TYPE_ICONS: Record<string, React.ReactNode> = {
  film: <Film size={16} />,
  tv: <Tv size={16} />,
  ad: <Megaphone size={16} />,
  game: <Gamepad2 size={16} />,
  trailer: <Megaphone size={16} />,
};

const STATUS_FILTER_OPTIONS = ['all', 'negotiating', 'proposed', 'accepted', 'completed', 'countered', 'declined'];

// ─── Page Component ───────────────────────────────────────────────────────────

export function SyncDealsPage() {
  const { navigate } = useRouter();
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedDeal, setExpandedDeal] = useState<string | null>(null);

  const filteredDeals = statusFilter === 'all'
    ? MOCK_DEALS
    : MOCK_DEALS.filter(d => d.status === statusFilter);

  const stats = {
    negotiating: MOCK_DEALS.filter(d => d.status === 'negotiating').length,
    proposed: MOCK_DEALS.filter(d => d.status === 'proposed').length,
    accepted: MOCK_DEALS.filter(d => d.status === 'accepted').length,
    completed: MOCK_DEALS.filter(d => d.status === 'completed').length,
    countered: MOCK_DEALS.filter(d => d.status === 'countered').length,
    declined: MOCK_DEALS.filter(d => d.status === 'declined').length,
  };

  const totalPipelineValue = MOCK_DEALS
    .filter(d => ['negotiating', 'proposed', 'countered', 'accepted'].includes(d.status))
    .reduce((sum, d) => sum + d.proposed_fee_cents, 0);

  const completedRevenue = MOCK_DEALS
    .filter(d => d.status === 'completed')
    .reduce((sum, d) => sum + d.proposed_fee_cents, 0);

  return (
    <div>
      <PageHeader
        title="Deals & Negotiations"
        description="Track active deal negotiations, fee proposals, and completed sync licensing agreements."
      />

      {/* Stats overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Pipeline Value" value={formatCents(totalPipelineValue)} icon={<DollarSign size={28} />} trend="Active negotiations" />
        <StatCard label="Completed Revenue" value={formatCents(completedRevenue)} icon={<CheckCircle2 size={28} />} />
        <StatCard label="Active Negotiations" value={stats.negotiating + stats.countered} icon={<Handshake size={28} />} />
        <StatCard label="Pending Proposals" value={stats.proposed + stats.accepted} icon={<Clock size={28} />} />
      </div>

      {/* Status filter tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 mb-6">
        {STATUS_FILTER_OPTIONS.slice(1).map(s => (
          <Card
            key={s}
            className={`p-3 cursor-pointer transition-colors ${statusFilter === s ? 'ring-2 ring-neutral-900' : ''}`}
            onClick={() => setStatusFilter(s)}
          >
            <p className="text-xs font-medium text-neutral-500 capitalize">{s.replace(/_/g, ' ')}</p>
            <p className="text-lg font-semibold text-neutral-900">{stats[s as keyof typeof stats]}</p>
          </Card>
        ))}
      </div>

      {/* Filter bar */}
      <div className="flex items-center gap-3 mb-4">
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="text-sm bg-white border border-neutral-200 rounded-lg px-3 py-1.5"
        >
          {STATUS_FILTER_OPTIONS.map(s => (
            <option key={s} value={s}>
              {s === 'all' ? 'All Statuses' : s.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </option>
          ))}
        </select>
        <p className="text-sm text-neutral-500">{filteredDeals.length} deals</p>
        {statusFilter !== 'all' && (
          <Button variant="ghost" size="sm" onClick={() => setStatusFilter('all')}>Clear filter</Button>
        )}
      </div>

      {/* Deal cards */}
      {filteredDeals.length === 0 ? (
        <Card className="p-8">
          <EmptyState icon={<Handshake size={32} />} title="No deals found" description="Adjust the filter or wait for new deal requests to arrive." />
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredDeals.map(deal => {
            const isExpanded = expandedDeal === deal.id;
            return (
              <Card key={deal.id} className="p-5">
                {/* Header */}
                <div className="flex items-center justify-between cursor-pointer" onClick={() => setExpandedDeal(isExpanded ? null : deal.id)}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-neutral-200 to-neutral-300 flex items-center justify-center text-neutral-600">
                      {USAGE_TYPE_ICONS[deal.usage_type] ?? <Film size={16} />}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-neutral-900">{deal.song_title}</p>
                      <p className="text-xs text-neutral-500">
                        {deal.licensee} · {deal.usage_type} · {deal.territory}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={deal.status} />
                    <Badge color="teal">{formatCents(deal.proposed_fee_cents)}</Badge>
                    <button className="text-neutral-400">
                      {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>
                  </div>
                </div>

                {/* Quick info row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
                  <div className="p-2 rounded-lg bg-neutral-50">
                    <p className="text-xs text-neutral-400">Usage</p>
                    <p className="text-sm text-neutral-900 capitalize flex items-center gap-1">{USAGE_TYPE_ICONS[deal.usage_type]} {deal.usage_type}</p>
                  </div>
                  <div className="p-2 rounded-lg bg-neutral-50">
                    <p className="text-xs text-neutral-400">Term</p>
                    <p className="text-sm text-neutral-900">{deal.term_length}</p>
                  </div>
                  <div className="p-2 rounded-lg bg-neutral-50">
                    <p className="text-xs text-neutral-400">Territory</p>
                    <p className="text-sm text-neutral-900 flex items-center gap-1"><MapPin size={12} /> {deal.territory}</p>
                  </div>
                  <div className="p-2 rounded-lg bg-neutral-50">
                    <p className="text-xs text-neutral-400">Last Updated</p>
                    <p className="text-sm text-neutral-900">{formatDate(deal.updated_at)}</p>
                  </div>
                </div>

                {/* Expanded: Negotiation Timeline */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-neutral-200">
                    <p className="text-xs font-semibold uppercase text-neutral-400 mb-3">Negotiation Timeline</p>
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {deal.negotiation_timeline.map((entry, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <div className="flex flex-col items-center">
                            <div className={`w-3 h-3 rounded-full ${
                              idx === deal.negotiation_timeline.length - 1
                                ? 'bg-neutral-900 ring-2 ring-neutral-300'
                                : 'bg-neutral-300'
                            }`} />
                            {idx < deal.negotiation_timeline.length - 1 && (
                              <div className="w-0.5 h-6 bg-neutral-200" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-medium text-neutral-900">{entry.event}</p>
                              <Badge color="gray" size="sm">{formatDate(entry.date)}</Badge>
                            </div>
                            <p className="text-xs text-neutral-500 mt-0.5">{entry.detail}</p>
                            <p className="text-xs text-neutral-400 mt-0.5 flex items-center gap-1"><User size={10} /> {entry.by}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Action buttons */}
                    {['negotiating', 'proposed', 'countered'].includes(deal.status) && (
                      <div className="flex items-center gap-2 mt-4 pt-3 border-t border-neutral-100">
                        {deal.status === 'negotiating' && <Button variant="primary" size="sm">Send Counter Offer</Button>}
                        {deal.status === 'proposed' && <Button variant="primary" size="sm">Accept Terms</Button>}
                        {deal.status === 'countered' && <Button variant="primary" size="sm">Accept Counter</Button>}
                        <Button variant="secondary" size="sm">Request Revision</Button>
                        <Button variant="ghost" size="sm" onClick={() => navigate('/sync/messages')}>
                          <MessageSquare size={14} /> Message Licensee
                        </Button>
                        <Button variant="danger" size="sm">Decline</Button>
                      </div>
                    )}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {/* Deal History summary */}
      <Card className="p-5 mt-6">
        <h3 className="font-semibold text-neutral-900 mb-4">Deal History Summary</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-200">
                <th className="text-left py-2 px-3 font-medium text-neutral-500">Song</th>
                <th className="text-left py-2 px-3 font-medium text-neutral-500">Licensee</th>
                <th className="text-left py-2 px-3 font-medium text-neutral-500">Type</th>
                <th className="text-left py-2 px-3 font-medium text-neutral-500">Fee</th>
                <th className="text-left py-2 px-3 font-medium text-neutral-500">Status</th>
                <th className="text-left py-2 px-3 font-medium text-neutral-500">Created</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_DEALS.map(deal => (
                <tr key={deal.id} className="border-b border-neutral-100 hover:bg-neutral-50 cursor-pointer" onClick={() => setExpandedDeal(deal.id)}>
                  <td className="py-2 px-3 font-medium text-neutral-900">{deal.song_title}</td>
                  <td className="py-2 px-3 text-neutral-600">{deal.licensee}</td>
                  <td className="py-2 px-3"><Badge color="gray" size="sm">{deal.usage_type}</Badge></td>
                  <td className="py-2 px-3 text-neutral-900">{formatCents(deal.proposed_fee_cents)}</td>
                  <td className="py-2 px-3"><StatusBadge status={deal.status} /></td>
                  <td className="py-2 px-3 text-neutral-500">{formatDate(deal.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
