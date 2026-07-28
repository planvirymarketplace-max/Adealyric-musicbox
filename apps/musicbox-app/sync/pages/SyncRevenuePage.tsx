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
  DollarSign, TrendingUp, CheckCircle2, Clock, AlertTriangle,
  ChevronDown, ChevronUp, BarChart3, PieChart, Receipt, User, Building2
} from 'lucide-react';

// ─── Mock Data ────────────────────────────────────────────────────────────────

type PaymentStatus = 'pending' | 'processing' | 'paid';

interface QuarterlyRevenue {
  quarter: string;
  label: string;
  total_cents: number;
  film_cents: number;
  tv_cents: number;
  ad_cents: number;
  game_cents: number;
  trailer_cents: number;
  deal_count: number;
}

interface RoyaltySplit {
  id: string;
  deal_id: string;
  song_title: string;
  licensee: string;
  total_fee_cents: number;
  splits: { holder: string; role: string; percentage: number; amount_cents: number }[];
  payment_status: PaymentStatus;
  payment_date: string | null;
  created_at: string;
}

interface PaymentRecord {
  id: string;
  recipient: string;
  amount_cents: number;
  status: PaymentStatus;
  reference: string;
  deal_id: string;
  created_at: string;
  processed_at: string | null;
}

const MOCK_QUARTERLY_REVENUE: QuarterlyRevenue[] = [
  {
    quarter: 'Q1 2026',
    label: 'Jan – Mar 2026',
    total_cents: 4850000,
    film_cents: 2250000,
    tv_cents: 850000,
    ad_cents: 1200000,
    game_cents: 350000,
    trailer_cents: 200000,
    deal_count: 8,
  },
  {
    quarter: 'Q4 2025',
    label: 'Oct – Dec 2025',
    total_cents: 3720000,
    film_cents: 1800000,
    tv_cents: 620000,
    ad_cents: 800000,
    game_cents: 200000,
    trailer_cents: 300000,
    deal_count: 6,
  },
  {
    quarter: 'Q3 2025',
    label: 'Jul – Sep 2025',
    total_cents: 2980000,
    film_cents: 1200000,
    tv_cents: 480000,
    ad_cents: 750000,
    game_cents: 450000,
    trailer_cents: 100000,
    deal_count: 5,
  },
  {
    quarter: 'Q2 2025',
    label: 'Apr – Jun 2025',
    total_cents: 2150000,
    film_cents: 900000,
    tv_cents: 350000,
    ad_cents: 500000,
    game_cents: 250000,
    trailer_cents: 150000,
    deal_count: 4,
  },
];

const MOCK_ROYALTY_SPLITS: RoyaltySplit[] = [
  {
    id: 'roy-001',
    deal_id: 'deal-003',
    song_title: 'Golden Horizon',
    licensee: 'Nike Global Marketing',
    total_fee_cents: 500000,
    splits: [
      { holder: 'The Wanderers (Artist)', role: 'Artist', percentage: 50, amount_cents: 250000 },
      { holder: 'BigWave Records', role: 'Master Owner', percentage: 25, amount_cents: 125000 },
      { holder: 'Harmony House Publishing', role: 'Publisher', percentage: 15, amount_cents: 75000 },
      { holder: 'Sync Agent Commission', role: 'Agent', percentage: 10, amount_cents: 50000 },
    ],
    payment_status: 'paid',
    payment_date: '2025-12-15T10:00:00Z',
    created_at: '2025-11-20T16:00:00Z',
  },
  {
    id: 'roy-002',
    deal_id: 'deal-004',
    song_title: 'Neon Dreams',
    licensee: 'Ubisoft Entertainment',
    total_fee_cents: 450000,
    splits: [
      { holder: 'Synthwave Runners (Artist)', role: 'Artist', percentage: 45, amount_cents: 202500 },
      { holder: 'Ubisoft Music', role: 'Master Owner', percentage: 25, amount_cents: 112500 },
      { holder: 'EA Publishing Co.', role: 'Publisher', percentage: 20, amount_cents: 90000 },
      { holder: 'Sync Agent Commission', role: 'Agent', percentage: 10, amount_cents: 45000 },
    ],
    payment_status: 'paid',
    payment_date: '2025-10-30T08:00:00Z',
    created_at: '2025-09-15T10:00:00Z',
  },
  {
    id: 'roy-003',
    deal_id: 'deal-001',
    song_title: 'Midnight Skyline',
    licensee: 'Warner Bros. Pictures',
    total_fee_cents: 750000,
    splits: [
      { holder: 'Nova Collective (Artist)', role: 'Artist', percentage: 50, amount_cents: 375000 },
      { holder: 'IndieStar Records', role: 'Master + Publisher', percentage: 40, amount_cents: 300000 },
      { holder: 'Sync Agent Commission', role: 'Agent', percentage: 10, amount_cents: 75000 },
    ],
    payment_status: 'pending',
    payment_date: null,
    created_at: '2025-12-28T14:30:00Z',
  },
  {
    id: 'roy-004',
    deal_id: 'deal-002',
    song_title: 'Electric Pulse',
    licensee: 'HBO Productions',
    total_fee_cents: 320000,
    splits: [
      { holder: 'DJ Flux (Artist)', role: 'Artist', percentage: 50, amount_cents: 160000 },
      { holder: 'Flux Music Group', role: 'Master + Publisher + Sync', percentage: 40, amount_cents: 128000 },
      { holder: 'Sync Agent Commission', role: 'Agent', percentage: 10, amount_cents: 32000 },
    ],
    payment_status: 'pending',
    payment_date: null,
    created_at: '2025-12-15T12:00:00Z',
  },
  {
    id: 'roy-005',
    deal_id: 'deal-005',
    song_title: 'Ocean Breeze',
    licensee: 'Paramount Pictures',
    total_fee_cents: 200000,
    splits: [
      { holder: 'Coral Reef Band (Artist)', role: 'Artist', percentage: 50, amount_cents: 100000 },
      { holder: 'Tidal Sound', role: 'Master Owner', percentage: 25, amount_cents: 50000 },
      { holder: 'Oceanic Publishing', role: 'Publisher', percentage: 15, amount_cents: 30000 },
      { holder: 'Sync Agent Commission', role: 'Agent', percentage: 10, amount_cents: 20000 },
    ],
    payment_status: 'processing',
    payment_date: null,
    created_at: '2025-12-20T09:00:00Z',
  },
  {
    id: 'roy-006',
    deal_id: 'deal-006',
    song_title: 'Fading Light',
    licensee: 'Amazon Studios',
    total_fee_cents: 280000,
    splits: [
      { holder: 'Ember & Ash (Artist)', role: 'Artist', percentage: 50, amount_cents: 140000 },
      { holder: 'Shadow Label Group', role: 'Master Owner', percentage: 25, amount_cents: 70000 },
      { holder: 'Dark Ink Publishing', role: 'Publisher', percentage: 15, amount_cents: 42000 },
      { holder: 'Sync Agent Commission', role: 'Agent', percentage: 10, amount_cents: 28000 },
    ],
    payment_status: 'pending',
    payment_date: null,
    created_at: '2026-01-02T08:00:00Z',
  },
  {
    id: 'roy-007',
    deal_id: 'deal-007',
    song_title: 'Thunder Road',
    licensee: 'Ford Motor Company',
    total_fee_cents: 380000,
    splits: [
      { holder: 'Highway Echo (Artist)', role: 'Artist', percentage: 45, amount_cents: 171000 },
      { holder: 'MajorCorp Music', role: 'Master Owner', percentage: 30, amount_cents: 114000 },
      { holder: 'Global Hits Publishing', role: 'Publisher', percentage: 15, amount_cents: 57000 },
      { holder: 'Sync Agent Commission', role: 'Agent', percentage: 10, amount_cents: 38000 },
    ],
    payment_status: 'processing',
    payment_date: null,
    created_at: '2026-01-08T14:00:00Z',
  },
  {
    id: 'roy-008',
    deal_id: 'deal-009',
    song_title: 'Solar Flare',
    licensee: 'Bright Matter Studios (Self-licensed)',
    total_fee_cents: 150000,
    splits: [
      { holder: 'Bright Matter Studios', role: 'All Rights', percentage: 90, amount_cents: 135000 },
      { holder: 'Sync Agent Commission', role: 'Agent', percentage: 10, amount_cents: 15000 },
    ],
    payment_status: 'paid',
    payment_date: '2026-02-28T10:00:00Z',
    created_at: '2026-02-25T08:00:00Z',
  },
];

const MOCK_PAYMENTS: PaymentRecord[] = [
  { id: 'pay-001', recipient: 'The Wanderers', amount_cents: 250000, status: 'paid', reference: 'INV-2025-NK-001', deal_id: 'deal-003', created_at: '2025-12-01T10:00:00Z', processed_at: '2025-12-15T10:00:00Z' },
  { id: 'pay-002', recipient: 'BigWave Records', amount_cents: 125000, status: 'paid', reference: 'INV-2025-NK-002', deal_id: 'deal-003', created_at: '2025-12-01T10:00:00Z', processed_at: '2025-12-15T10:00:00Z' },
  { id: 'pay-003', recipient: 'Harmony House Publishing', amount_cents: 75000, status: 'paid', reference: 'INV-2025-NK-003', deal_id: 'deal-003', created_at: '2025-12-01T10:00:00Z', processed_at: '2025-12-15T10:00:00Z' },
  { id: 'pay-004', recipient: 'Synthwave Runners', amount_cents: 202500, status: 'paid', reference: 'INV-2025-UB-001', deal_id: 'deal-004', created_at: '2025-10-01T08:00:00Z', processed_at: '2025-10-30T08:00:00Z' },
  { id: 'pay-005', recipient: 'Coral Reef Band', amount_cents: 100000, status: 'processing', reference: 'INV-2026-PM-001', deal_id: 'deal-005', created_at: '2026-01-10T09:00:00Z', processed_at: null },
  { id: 'pay-006', recipient: 'Nova Collective', amount_cents: 375000, status: 'pending', reference: 'INV-2026-WB-001', deal_id: 'deal-001', created_at: '2026-02-01T10:00:00Z', processed_at: null },
  { id: 'pay-007', recipient: 'Ember & Ash', amount_cents: 140000, status: 'pending', reference: 'INV-2026-AM-001', deal_id: 'deal-006', created_at: '2026-02-05T08:00:00Z', processed_at: null },
  { id: 'pay-008', recipient: 'Highway Echo', amount_cents: 171000, status: 'processing', reference: 'INV-2026-FD-001', deal_id: 'deal-007', created_at: '2026-02-10T14:00:00Z', processed_at: null },
];

const PAYMENT_STATUS_CONFIG: Record<PaymentStatus, { icon: React.ReactNode; color: string }> = {
  pending: { icon: <Clock size={14} className="text-amber-600" />, color: 'bg-amber-50 border-amber-200 text-amber-700' },
  processing: { icon: <DollarSign size={14} className="text-blue-600" />, color: 'bg-blue-50 border-blue-200 text-blue-700' },
  paid: { icon: <CheckCircle2 size={14} className="text-green-600" />, color: 'bg-green-50 border-green-200 text-green-700' },
};

const USAGE_COLORS: Record<string, string> = {
  film: 'bg-teal-500',
  tv: 'bg-purple-500',
  ad: 'bg-amber-500',
  game: 'bg-green-500',
  trailer: 'bg-rose-500',
};

// ─── Page Component ───────────────────────────────────────────────────────────

export function SyncRevenuePage() {
  const { navigate } = useRouter();
  const [expandedSplit, setExpandedSplit] = useState<string | null>(null);
  const [paymentFilter, setPaymentFilter] = useState<PaymentStatus | 'all'>('all');

  const totalYtdRevenue = MOCK_QUARTERLY_REVENUE.reduce((s, q) => s + q.total_cents, 0);
  const paidSplits = MOCK_ROYALTY_SPLITS.filter(s => s.payment_status === 'paid');
  const pendingSplits = MOCK_ROYALTY_SPLITS.filter(s => s.payment_status === 'pending');
  const processingSplits = MOCK_ROYALTY_SPLITS.filter(s => s.payment_status === 'processing');

  const totalPaidOut = paidSplits.reduce((s, r) => s + r.total_fee_cents, 0);
  const totalPending = (pendingSplits.reduce((s, r) => s + r.total_fee_cents, 0)) + (processingSplits.reduce((s, r) => s + r.total_fee_cents, 0));

  const filteredPayments = paymentFilter === 'all'
    ? MOCK_PAYMENTS
    : MOCK_PAYMENTS.filter(p => p.status === paymentFilter);

  // Find max quarter for bar chart scaling
  const maxQuarterCents = Math.max(...MOCK_QUARTERLY_REVENUE.map(q => q.total_cents));

  return (
    <div>
      <PageHeader
        title="Revenue & Royalty"
        description="Track sync licensing revenue by quarter, manage royalty splits per deal, and monitor payment status."
        actions={
          <Button variant="secondary" size="sm"><Receipt size={14} /> Export Statement</Button>
        }
      />

      {/* Stats overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="YTD Revenue" value={formatCents(totalYtdRevenue)} icon={<DollarSign size={28} />} trend="All sync licensing income" />
        <StatCard label="Paid Out" value={formatCents(totalPaidOut)} icon={<CheckCircle2 size={28} />} />
        <StatCard label="Pending Payment" value={formatCents(totalPending)} icon={<Clock size={28} />} />
        <StatCard label="Active Splits" value={MOCK_ROYALTY_SPLITS.length} icon={<PieChart size={28} />} />
      </div>

      {/* Revenue Bar Chart */}
      <Card className="p-5 mb-6">
        <h3 className="font-semibold text-neutral-900 mb-4">Quarterly Revenue Breakdown</h3>
        <div className="space-y-4">
          {MOCK_QUARTERLY_REVENUE.map(q => {
            const barWidth = Math.max(8, (q.total_cents / maxQuarterCents) * 100);
            return (
              <div key={q.quarter}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-neutral-900">{q.quarter}</p>
                    <p className="text-xs text-neutral-500">{q.label}</p>
                  </div>
                  <p className="text-sm font-semibold text-neutral-900">{formatCents(q.total_cents)}</p>
                </div>
                {/* Stacked bar */}
                <div className="h-8 rounded-lg bg-neutral-100 overflow-hidden flex" style={{ width: '100%' }}>
                  {['film', 'tv', 'ad', 'game', 'trailer'].map(type => {
                    const cents = q[`${type}_cents` as keyof QuarterlyRevenue] as number;
                    const width = Math.max(0, (cents / maxQuarterCents) * 100);
                    if (width === 0) return null;
                    return (
                      <div
                        key={type}
                        className={`${USAGE_COLORS[type]} h-full flex items-center justify-center text-xs text-white font-medium`}
                        style={{ width: `${width}%`, minWidth: width > 0 ? '2rem' : '0' }}
                      >
                        {width > 8 ? type.charAt(0).toUpperCase() : ''}
                      </div>
                    );
                  })}
                </div>
                {/* Sub-labels */}
                <div className="flex items-center gap-4 mt-1">
                  {['film', 'tv', 'ad', 'game', 'trailer'].map(type => {
                    const cents = q[`${type}_cents` as keyof QuarterlyRevenue] as number;
                    return (
                      <div key={type} className="flex items-center gap-1 text-xs text-neutral-500">
                        <div className={`w-2 h-2 rounded-full ${USAGE_COLORS[type]}`} />
                        <span className="capitalize">{type}: {formatCents(cents)}</span>
                      </div>
                    );
                  })}
                </div>
                <p className="text-xs text-neutral-400 mt-1">{q.deal_count} deals</p>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Royalty Splits */}
      <h2 className="text-lg font-semibold text-neutral-900 mb-4">Royalty Split Details</h2>
      <div className="space-y-3 mb-6">
        {MOCK_ROYALTY_SPLITS.map(split => {
          const isExpanded = expandedSplit === split.id;
          const pConfig = PAYMENT_STATUS_CONFIG[split.payment_status];
          return (
            <Card key={split.id} className="p-4">
              {/* Header */}
              <div className="flex items-center justify-between cursor-pointer" onClick={() => setExpandedSplit(isExpanded ? null : split.id)}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-neutral-200 to-neutral-300 flex items-center justify-center">
                    <PieChart size={16} className="text-neutral-500" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-neutral-900">{split.song_title}</p>
                    <p className="text-xs text-neutral-500">{split.licensee} · {formatCents(split.total_fee_cents)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-medium text-xs border ${pConfig.color}`}>
                    {pConfig.icon} {split.payment_status}
                  </span>
                  <button className="text-neutral-400">
                    {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>
                </div>
              </div>

              {/* Quick split overview */}
              <div className="flex items-center gap-1 mt-3">
                {split.splits.map(s => {
                  const widthPct = s.percentage;
                  const roleColor = s.role === 'Artist' ? 'bg-teal-500' :
                    s.role === 'Agent' ? 'bg-neutral-400' :
                    s.role === 'Master Owner' || s.role === 'Master + Publisher' || s.role === 'Master + Publisher + Sync' || s.role === 'All Rights' ? 'bg-purple-500' :
                    'bg-amber-500';
                  return (
                    <div
                      key={s.holder}
                      className={`${roleColor} h-6 rounded flex items-center justify-center text-xs text-white font-medium`}
                      style={{ width: `${widthPct}%`, minWidth: '2rem' }}
                    >
                      {widthPct >= 15 ? `${widthPct}%` : ''}
                    </div>
                  );
                })}
              </div>

              {/* Expanded: Full split details */}
              {isExpanded && (
                <div className="mt-4 pt-4 border-t border-neutral-200">
                  <p className="text-xs font-semibold uppercase text-neutral-400 mb-3">Split Breakdown</p>
                  <div className="space-y-2">
                    {split.splits.map(s => (
                      <div key={s.holder} className="flex items-center justify-between p-3 rounded-lg bg-neutral-50">
                        <div className="flex items-center gap-2">
                          {s.role === 'Artist' ? <User size={14} className="text-neutral-400" /> : <Building2 size={14} className="text-neutral-400" />}
                          <div>
                            <p className="text-sm font-medium text-neutral-900">{s.holder}</p>
                            <p className="text-xs text-neutral-500">{s.role}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge color="gray" size="sm">{s.percentage}%</Badge>
                          <p className="text-sm font-semibold text-neutral-900">{formatCents(s.amount_cents)}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Payment info */}
                  <div className="mt-3 p-3 rounded-lg bg-neutral-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-neutral-400">Total Deal Fee</p>
                        <p className="text-sm font-semibold text-neutral-900">{formatCents(split.total_fee_cents)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-neutral-400">Payment Status</p>
                        <p className="text-sm font-medium flex items-center gap-1">
                          {pConfig.icon} <span className="capitalize">{split.payment_status}</span>
                        </p>
                      </div>
                      {split.payment_date && (
                        <div>
                          <p className="text-xs text-neutral-400">Paid On</p>
                          <p className="text-sm text-neutral-900">{formatDate(split.payment_date)}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  {split.payment_status === 'pending' && (
                    <div className="flex items-center gap-2 mt-3">
                      <Button variant="primary" size="sm"><DollarSign size={14} /> Initiate Payment</Button>
                      <Button variant="ghost" size="sm"><Receipt size={14} /> Generate Invoice</Button>
                    </div>
                  )}
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* Payment Tracking */}
      <h2 className="text-lg font-semibold text-neutral-900 mb-4">Payment Tracking</h2>

      <div className="flex items-center gap-3 mb-4">
        <select
          value={paymentFilter}
          onChange={e => setPaymentFilter(e.target.value as PaymentStatus | 'all')}
          className="text-sm bg-white border border-neutral-200 rounded-lg px-3 py-1.5"
        >
          <option value="all">All Payment Statuses</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="paid">Paid</option>
        </select>
        <p className="text-sm text-neutral-500">{filteredPayments.length} payments</p>
      </div>

      {/* Payment status cards */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {(['pending', 'processing', 'paid'] as PaymentStatus[]).map(status => {
          const config = PAYMENT_STATUS_CONFIG[status];
          const count = MOCK_PAYMENTS.filter(p => p.status === status).length;
          const total = MOCK_PAYMENTS.filter(p => p.status === status).reduce((s, p) => s + p.amount_cents, 0);
          return (
            <Card
              key={status}
              className={`p-3 cursor-pointer transition-colors border ${config.color} ${paymentFilter === status ? 'ring-2 ring-neutral-900' : ''}`}
              onClick={() => setPaymentFilter(paymentFilter === status ? 'all' : status)}
            >
              <div className="flex items-center gap-2 mb-1">{config.icon}<p className="text-xs font-medium capitalize">{status}</p></div>
              <p className="text-lg font-semibold text-neutral-900">{count}</p>
              <p className="text-xs text-neutral-500">{formatCents(total)}</p>
            </Card>
          );
        })}
      </div>

      <Card className="p-5">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-200">
                <th className="text-left py-2 px-3 font-medium text-neutral-500">Recipient</th>
                <th className="text-left py-2 px-3 font-medium text-neutral-500">Amount</th>
                <th className="text-left py-2 px-3 font-medium text-neutral-500">Reference</th>
                <th className="text-left py-2 px-3 font-medium text-neutral-500">Deal</th>
                <th className="text-left py-2 px-3 font-medium text-neutral-500">Status</th>
                <th className="text-left py-2 px-3 font-medium text-neutral-500">Created</th>
                <th className="text-left py-2 px-3 font-medium text-neutral-500">Processed</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map(payment => {
                const config = PAYMENT_STATUS_CONFIG[payment.status];
                return (
                  <tr key={payment.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                    <td className="py-2 px-3 font-medium text-neutral-900">{payment.recipient}</td>
                    <td className="py-2 px-3 text-neutral-900 font-semibold">{formatCents(payment.amount_cents)}</td>
                    <td className="py-2 px-3 text-neutral-600">{payment.reference}</td>
                    <td className="py-2 px-3"><Badge color="gray" size="sm">{payment.deal_id}</Badge></td>
                    <td className="py-2 px-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-medium text-xs border ${config.color}`}>
                        {config.icon} {payment.status}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-neutral-500">{formatDate(payment.created_at)}</td>
                    <td className="py-2 px-3 text-neutral-500">{payment.processed_at ? formatDate(payment.processed_at) : '—'}</td>
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
