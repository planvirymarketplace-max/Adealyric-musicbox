'use client';

import { useState } from 'react';
import { Card, StatCard } from '@/components/ui/Card';
import { Badge, StatusBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { PageHeader } from '@/components/layout/PageHeader';
import { EmptyState } from '@/components/ui/States';
import { toast } from '@/components/ui/Toast';
import {
  DollarSign, BarChart3, PieChart, FileText, TrendingUp, CheckCircle2,
  AlertTriangle, Clock, Users, Music, Globe, Receipt, Handshake,
  ChevronDown, ChevronRight, ArrowUpRight, Info
} from 'lucide-react';

// ── Format helper ──
const fmtCents = (cents: number) => `$${(cents / 100).toFixed(2)}`;

// ── MOCK DATA ──

// 6 royalty statements (covering 6 DSPs)
const MOCK_ROYALTY_STATEMENTS = [
  { id: 'rs-1', dsp_source: 'Spotify', period: '2025-05', total_streams: 2450000, total_revenue_cents: 14700000, status: 'finalized', generated_at: '2025-06-01', paid_at: '' },
  { id: 'rs-2', dsp_source: 'Apple Music', period: '2025-05', total_streams: 1200000, total_revenue_cents: 10800000, status: 'paid', generated_at: '2025-06-01', paid_at: '2025-06-15' },
  { id: 'rs-3', dsp_source: 'Amazon Music', period: '2025-05', total_streams: 850000, total_revenue_cents: 5950000, status: 'finalized', generated_at: '2025-06-01', paid_at: '' },
  { id: 'rs-4', dsp_source: 'YouTube Music', period: '2025-05', total_streams: 3200000, total_revenue_cents: 6400000, status: 'draft', generated_at: '2025-06-05', paid_at: '' },
  { id: 'rs-5', dsp_source: 'Pandora', period: '2025-04', total_streams: 450000, total_revenue_cents: 3150000, status: 'paid', generated_at: '2025-05-01', paid_at: '2025-05-20' },
  { id: 'rs-6', dsp_source: 'TikTok', period: '2025-05', total_streams: 1500000, total_revenue_cents: 3000000, status: 'draft', generated_at: '2025-06-05', paid_at: '' },
];

// Revenue by DSP (derived from statements)
const DSP_REVENUE_DATA = MOCK_ROYALTY_STATEMENTS.map(st => ({
  dsp: st.dsp_source,
  streams: st.total_streams,
  revenue_cents: st.total_revenue_cents,
  per_stream: st.total_revenue_cents / st.total_streams,
}));

// Split breakdown per track (Section 14: master vs composition income)
const MOCK_SPLIT_BREAKDOWNS = [
  {
    track: 'Midnight Echoes — Sunset Drive',
    master_income_cents: 420000,
    composition_income_cents: 180000,
    master_splits: { Label: 60, Artist: 30, Producer: 5, Session_Musicians: 5 },
    composition_splits: { Writer: 50, Publisher: 50 },
  },
  {
    track: 'Neon Dreams — Title Track',
    master_income_cents: 350000,
    composition_income_cents: 150000,
    master_splits: { Label: 70, Artist: 20, Producer: 5, Session_Musicians: 5 },
    composition_splits: { Writer: 50, Producer_Co_Writing: 25, Publisher: 25 },
  },
  {
    track: 'Golden Hour',
    master_income_cents: 280000,
    composition_income_cents: 120000,
    master_splits: { Label: 50, Artist: 40, Producer: 5, Session_Musicians: 5 },
    composition_splits: { Writer: 50, Publisher: 50 },
  },
];

// Overlooked streams (Section 15)
const MOCK_OVERLOOKED_STREAMS = [
  { stream_type: 'Neighboring Rights Revenue', description: 'Revenue from public performance via PROs — not included in DSP statements', estimated_annual_cents: 120000, status: 'Not tracked' },
  { stream_type: 'Session Musicians', description: 'Union scale + residual payments per AFM/SAG agreements', estimated_annual_cents: 45000, status: 'Partially tracked' },
  { stream_type: 'Sampling Fees', description: 'License fees owed when samples are used in derivative works', estimated_annual_cents: 30000, status: 'Not tracked' },
  { stream_type: 'Content ID / UGC Revenue', description: 'Revenue from YouTube Content ID, TikTok Creator Program, Instagram Reels', estimated_annual_cents: 180000, status: 'Underreported' },
  { stream_type: 'Mechanical License Revenue', description: 'Physical + digital mechanical royalties (CDs, downloads, interactive streams)', estimated_annual_cents: 95000, status: 'Partially tracked' },
];

export function AdminRoyaltyPage() {
  const [activeTab, setActiveTab] = useState<'statements' | 'splits' | 'overlooked'>('statements');
  const [selectedTrack, setSelectedTrack] = useState<string>('');

  // Computed totals
  const totalStreams = MOCK_ROYALTY_STATEMENTS.reduce((s, r) => s + r.total_streams, 0);
  const totalRevenue = MOCK_ROYALTY_STATEMENTS.reduce((s, r) => s + r.total_revenue_cents, 0);

  const draftStatements = MOCK_ROYALTY_STATEMENTS.filter(s => s.status === 'draft').length;
  const finalizedStatements = MOCK_ROYALTY_STATEMENTS.filter(s => s.status === 'finalized').length;
  const paidStatements = MOCK_ROYALTY_STATEMENTS.filter(s => s.status === 'paid').length;

  const overlookedTotal = MOCK_OVERLOOKED_STREAMS.reduce((s, o) => s + o.estimated_annual_cents, 0);

  const tabs = [
    { key: 'statements', label: 'Statements', icon: <FileText size={16} /> },
    { key: 'splits', label: 'Split Breakdown', icon: <PieChart size={16} /> },
    { key: 'overlooked', label: 'Overlooked Streams', icon: <AlertTriangle size={16} /> },
  ];

  const split = selectedTrack ? MOCK_SPLIT_BREAKDOWNS.find(s => s.track === selectedTrack) : null;

  return (
    <div>
      <PageHeader title="Royalty Oversight" description="Royalty statements, revenue tracking, split breakdowns, and overlooked income streams." actions={
        <Button variant="secondary" size="sm" onClick={() => toast('info', 'Statement generation coming soon')}>
          <Receipt size={14} /> Generate Statement
        </Button>
      } />

      {/* Summary stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Streams" value={totalStreams.toLocaleString()} icon={<BarChart3 size={28} />} />
        <StatCard label="Total Revenue" value={fmtCents(totalRevenue)} icon={<DollarSign size={28} />} />
        <StatCard label="DSPs Reporting" value={DSP_REVENUE_DATA.length} icon={<Globe size={28} />} />
        <StatCard label="Overlooked Revenue" value={fmtCents(overlookedTotal)} icon={<AlertTriangle size={28} />} trend="Estimated annual" />
      </div>

      {/* Revenue by DSP cards */}
      <Card className="p-5 mb-6">
        <h3 className="font-semibold text-neutral-900 mb-4">Revenue by DSP</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {DSP_REVENUE_DATA.map(data => (
            <div key={data.dsp} className="p-4 rounded-lg bg-neutral-50 border border-neutral-200">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-neutral-900">{data.dsp}</p>
                <Badge color="gray" size="sm">{data.streams.toLocaleString()} streams</Badge>
              </div>
              <p className="text-xl font-semibold text-neutral-900">{fmtCents(data.revenue_cents)}</p>
              <div className="mt-2 h-2 bg-neutral-200 rounded-full overflow-hidden">
                <div
                  className="h-2 bg-neutral-600 rounded-full"
                  style={{ width: `${(data.revenue_cents / totalRevenue) * 100}%` }}
                />
              </div>
              <p className="text-xs text-neutral-500 mt-1">Per-stream rate: {fmtCents(Math.round(data.per_stream * 100))}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Statement status overview */}
      <Card className="p-5 mb-6">
        <h3 className="font-semibold text-neutral-900 mb-4">Statement Status Overview</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-neutral-50 border border-neutral-200">
            <p className="text-xs font-medium text-neutral-400 uppercase">Draft</p>
            <p className="text-xl font-semibold text-neutral-900">{draftStatements}</p>
            <p className="text-xs text-neutral-500 mt-1">Awaiting review</p>
          </div>
          <div className="p-4 rounded-lg bg-neutral-50 border border-neutral-200">
            <p className="text-xs font-medium text-neutral-400 uppercase">Finalized</p>
            <p className="text-xl font-semibold text-neutral-900">{finalizedStatements}</p>
            <p className="text-xs text-neutral-500 mt-1">Ready for payment</p>
          </div>
          <div className="p-4 rounded-lg bg-neutral-50 border border-neutral-200">
            <p className="text-xs font-medium text-neutral-400 uppercase">Paid</p>
            <p className="text-xl font-semibold text-neutral-900">{paidStatements}</p>
            <p className="text-xs text-neutral-500 mt-1">Payment completed</p>
          </div>
        </div>
      </Card>

      {/* Tab nav */}
      <div className="flex items-center gap-2 mb-6 border-b border-neutral-200">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.key
                ? 'border-neutral-900 text-neutral-900'
                : 'border-transparent text-neutral-500 hover:text-neutral-700'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Statements Tab ── */}
      {activeTab === 'statements' && (
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-neutral-900">Royalty Statements</h3>
            <p className="text-sm text-neutral-500">{MOCK_ROYALTY_STATEMENTS.length} statements</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-200">
                  <th className="text-left py-2 px-3 font-medium text-neutral-500">Period</th>
                  <th className="text-left py-2 px-3 font-medium text-neutral-500">DSP Source</th>
                  <th className="text-left py-2 px-3 font-medium text-neutral-500">Streams</th>
                  <th className="text-left py-2 px-3 font-medium text-neutral-500">Revenue</th>
                  <th className="text-left py-2 px-3 font-medium text-neutral-500">Status</th>
                  <th className="text-left py-2 px-3 font-medium text-neutral-500">Generated</th>
                  <th className="text-left py-2 px-3 font-medium text-neutral-500">Paid</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_ROYALTY_STATEMENTS.map(st => (
                  <tr key={st.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                    <td className="py-2 px-3 font-medium text-neutral-900">{st.period}</td>
                    <td className="py-2 px-3 text-neutral-600">{st.dsp_source}</td>
                    <td className="py-2 px-3 text-neutral-900">{st.total_streams.toLocaleString()}</td>
                    <td className="py-2 px-3 text-neutral-900 font-semibold">{fmtCents(st.total_revenue_cents)}</td>
                    <td className="py-2 px-3">
                      <Badge color={st.status === 'paid' ? 'green' : st.status === 'finalized' ? 'teal' : 'gray'}>
                        {st.status}
                      </Badge>
                    </td>
                    <td className="py-2 px-3 text-neutral-500">{st.generated_at}</td>
                    <td className="py-2 px-3 text-neutral-500">{st.paid_at || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* ── Split Breakdown Tab ── */}
      {activeTab === 'splits' && (
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-neutral-900">Split Breakdown (Per Section 14)</h3>
            <select
              value={selectedTrack}
              onChange={e => setSelectedTrack(e.target.value)}
              className="text-sm bg-white border border-neutral-200 rounded-lg px-3 py-1.5"
            >
              <option value="">Select a track</option>
              {MOCK_SPLIT_BREAKDOWNS.map(s => <option key={s.track} value={s.track}>{s.track}</option>)}
            </select>
          </div>

          {!split ? (
            <EmptyState
              icon={<PieChart size={32} />}
              title="Select a track"
              description="Choose a track to view its master vs. composition income split breakdown."
            />
          ) : (
            <div className="space-y-4">
              {/* Income overview */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-neutral-50 border border-neutral-200">
                  <p className="text-xs font-medium text-neutral-400 uppercase mb-1">Master Income</p>
                  <p className="text-xl font-semibold text-neutral-900">{fmtCents(split.master_income_cents)}</p>
                  <p className="text-xs text-neutral-500 mt-1">Revenue from sound recording rights</p>
                </div>
                <div className="p-4 rounded-lg bg-neutral-50 border border-neutral-200">
                  <p className="text-xs font-medium text-neutral-400 uppercase mb-1">Composition Income</p>
                  <p className="text-xl font-semibold text-neutral-900">{fmtCents(split.composition_income_cents)}</p>
                  <p className="text-xs text-neutral-500 mt-1">Revenue from songwriting/publishing rights</p>
                </div>
              </div>

              {/* Master splits */}
              <div className="p-4 rounded-lg bg-neutral-50 border border-neutral-200">
                <p className="text-sm font-semibold text-neutral-900 mb-3">Master Income Splits</p>
                <p className="text-xs text-neutral-500 mb-2">Label: 50-70% · Artist: 15-50% · Producer: 1-5% · Session Musicians: residuals</p>
                <div className="space-y-2">
                  {Object.entries(split.master_splits).map(([role, pct]) => (
                    <div key={role} className="flex items-center gap-3">
                      <p className="text-sm text-neutral-700 w-28 shrink-0">{role.replace('_', ' ')}</p>
                      <div className="flex-1 h-3 bg-neutral-200 rounded-full overflow-hidden">
                        <div className="h-3 bg-neutral-700 rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                      <p className="text-sm font-medium text-neutral-900 w-12 text-right">{pct}%</p>
                      <p className="text-xs text-neutral-500 w-20 text-right">{fmtCents(Math.round(split.master_income_cents * pct / 100))}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Composition splits */}
              <div className="p-4 rounded-lg bg-neutral-50 border border-neutral-200">
                <p className="text-sm font-semibold text-neutral-900 mb-3">Composition Income Splits</p>
                <p className="text-xs text-neutral-500 mb-2">Writer: 50% · Publisher: 50% (or Producer co-writing: 25%)</p>
                <div className="space-y-2">
                  {Object.entries(split.composition_splits).map(([role, pct]) => (
                    <div key={role} className="flex items-center gap-3">
                      <p className="text-sm text-neutral-700 w-28 shrink-0">{role.replace('_', ' ')}</p>
                      <div className="flex-1 h-3 bg-neutral-200 rounded-full overflow-hidden">
                        <div className="h-3 bg-neutral-500 rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                      <p className="text-sm font-medium text-neutral-900 w-12 text-right">{pct}%</p>
                      <p className="text-xs text-neutral-500 w-20 text-right">{fmtCents(Math.round(split.composition_income_cents * pct / 100))}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </Card>
      )}

      {/* ── Overlooked Streams Tab (Section 15) ── */}
      {activeTab === 'overlooked' && (
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-neutral-900">Overlooked Income Streams (Section 15)</h3>
            <div className="flex items-center gap-2">
              <Badge color="amber" size="md">Estimated: {fmtCents(overlookedTotal)} annual</Badge>
            </div>
          </div>

          <div className="mb-4 p-3 rounded-lg bg-amber-50 border border-amber-200">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle size={16} className="text-amber-600" />
              <p className="text-sm font-medium text-amber-800">Revenue Gap Detected</p>
            </div>
            <p className="text-xs text-amber-700">
              These income streams are typically NOT included in DSP royalty statements. Combined estimated annual value:
              <span className="font-semibold"> {fmtCents(overlookedTotal)}</span>
            </p>
          </div>

          <div className="space-y-3">
            {MOCK_OVERLOOKED_STREAMS.map(stream => (
              <div key={stream.stream_type} className="p-4 rounded-lg bg-neutral-50 border border-neutral-200">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-neutral-900 text-sm">{stream.stream_type}</p>
                  <div className="flex items-center gap-2">
                    <Badge
                      color={stream.status === 'Not tracked' ? 'red' : stream.status === 'Underreported' ? 'amber' : 'gray'}
                      size="sm"
                    >
                      {stream.status}
                    </Badge>
                    <p className="text-sm font-semibold text-neutral-900">{fmtCents(stream.estimated_annual_cents)}</p>
                  </div>
                </div>
                <p className="text-xs text-neutral-600">{stream.description}</p>
              </div>
            ))}
          </div>

          {/* Totals summary */}
          <div className="mt-4 p-4 rounded-lg bg-neutral-900 text-white">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Total Overlooked Revenue (Estimated Annual)</p>
              <p className="text-xl font-bold">{fmtCents(overlookedTotal)}</p>
            </div>
            <p className="text-xs text-neutral-400 mt-1">
              This revenue should be tracked alongside DSP royalty statements for complete financial oversight.
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}
