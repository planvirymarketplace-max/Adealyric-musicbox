'use client';

import { useState } from 'react';
import { Card, StatCard } from '@/components/ui/Card';
import { Badge, StatusBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { PageHeader } from '@/components/layout/PageHeader';
import { EmptyState } from '@/components/ui/States';
import { toast } from '@/components/ui/Toast';
import {
  Shield, CheckCircle2, AlertTriangle, FileText, Music, Users, Send, Handshake,
  DollarSign, BarChart3, Plug, Disc3, Clock, XCircle, Radio, Eye, Globe,
  ChevronDown, ChevronRight, ArrowUpRight, PieChart, TrendingUp
} from 'lucide-react';

// ── Format helpers ──
const fmtCents = (cents: number) => `$${(cents / 100).toFixed(2)}`;

// ── MOCK DATA ──

// 3 releases with different rights statuses
const MOCK_RELEASES = [
  {
    id: 'rel-1',
    title: 'Midnight Echoes',
    type: 'Album',
    status: 'released',
    genre: 'R&B/Soul',
  },
  {
    id: 'rel-2',
    title: 'Neon Dreams',
    type: 'EP',
    status: 'released',
    genre: 'Electronic',
  },
  {
    id: 'rel-3',
    title: 'Golden Hour',
    type: 'Single',
    status: 'pending_release',
    genre: 'Pop',
  },
];

// 5 rights records per release (15 total)
const MOCK_RIGHTS: {
  id: string; release_id: string; rights_type: string; owner: string;
  territory: string; ownership_pct: number; expiration: string;
  license_ref: string; notes: string;
}[] = [
  // Midnight Echoes — one-stop clearance (sync rights 100% + "one-stop")
  { id: 'r1-master', release_id: 'rel-1', rights_type: 'master', owner: 'Echo Label LLC', territory: 'Worldwide', ownership_pct: 100, expiration: '2027-12-31', license_ref: 'ML-001', notes: 'Full master ownership' },
  { id: 'r1-pub', release_id: 'rel-1', rights_type: 'publishing', owner: 'Echo Publishing', territory: 'Worldwide', ownership_pct: 100, expiration: '2027-12-31', license_ref: 'PL-001', notes: 'Full publishing rights' },
  { id: 'r1-neigh', release_id: 'rel-1', rights_type: 'neighboring', owner: 'Echo Label LLC', territory: 'US, EU, UK', ownership_pct: 100, expiration: 'None', license_ref: 'NL-001', notes: 'Neighboring rights via PRO' },
  { id: 'r1-mech', release_id: 'rel-1', rights_type: 'mechanical', owner: 'HFA', territory: 'US', ownership_pct: 100, expiration: 'None', license_ref: 'MCL-001', notes: 'Mechanical license via HFA' },
  { id: 'r1-sync', release_id: 'rel-1', rights_type: 'sync', owner: 'Echo Label LLC', territory: 'Worldwide', ownership_pct: 100, expiration: '2027-12-31', license_ref: 'SL-001', notes: 'One-stop sync clearance' },

  // Neon Dreams — co-clearance needed (sync rights only 60%)
  { id: 'r2-master', release_id: 'rel-2', rights_type: 'master', owner: 'Neon Records', territory: 'Worldwide', ownership_pct: 75, expiration: '2026-06-30', license_ref: 'ML-002', notes: 'Co-owned with producer (25%)' },
  { id: 'r2-pub', release_id: 'rel-2', rights_type: 'publishing', owner: 'Neon Publishing Co', territory: 'Worldwide', ownership_pct: 50, expiration: '2026-06-30', license_ref: 'PL-002', notes: 'Split publishing with co-writer' },
  { id: 'r2-neigh', release_id: 'rel-2', rights_type: 'neighboring', owner: 'Neon Records', territory: 'US, EU', ownership_pct: 75, expiration: 'None', license_ref: 'NL-002', notes: 'Partial neighboring rights' },
  { id: 'r2-mech', release_id: 'rel-2', rights_type: 'mechanical', owner: 'HFA', territory: 'US', ownership_pct: 50, expiration: 'None', license_ref: 'MCL-002', notes: 'Co-mechanical license needed' },
  { id: 'r2-sync', release_id: 'rel-2', rights_type: 'sync', owner: 'Neon Records', territory: 'Worldwide', ownership_pct: 60, expiration: '2026-06-30', license_ref: 'SL-002', notes: 'Co-clearance required — producer holds 40%' },

  // Golden Hour — rights conflict (sync rights disputed)
  { id: 'r3-master', release_id: 'rel-3', rights_type: 'master', owner: 'Golden Sound Inc', territory: 'Worldwide', ownership_pct: 100, expiration: '2028-01-01', license_ref: 'ML-003', notes: 'Full master ownership' },
  { id: 'r3-pub', release_id: 'rel-3', rights_type: 'publishing', owner: 'Golden Publishing', territory: 'US', ownership_pct: 40, expiration: '2028-01-01', license_ref: 'PL-003', notes: 'Disputed — co-writer claims 60%' },
  { id: 'r3-neigh', release_id: 'rel-3', rights_type: 'neighboring', owner: 'Golden Sound Inc', territory: 'US', ownership_pct: 100, expiration: 'None', license_ref: 'NL-003', notes: 'Neighboring rights clear' },
  { id: 'r3-mech', release_id: 'rel-3', rights_type: 'mechanical', owner: 'HFA', territory: 'US', ownership_pct: 40, expiration: 'None', license_ref: 'MCL-003', notes: 'Partial — co-writer mechanical not cleared' },
  { id: 'r3-sync', release_id: 'rel-3', rights_type: 'sync', owner: 'Golden Sound Inc', territory: 'US', ownership_pct: 40, expiration: '2028-01-01', license_ref: 'SL-003', notes: 'Rights conflict — co-writer disputes sync ownership' },
];

// 6 DSP adapters
const MOCK_DSP_ADAPTERS = [
  { id: 'dsp-1', name: 'Spotify', delivery_format: 'DDEX ERN/XML', auth_type: 'OAuth', status: 'active', last_delivery_at: '2025-06-12', total_releases_delivered: 12 },
  { id: 'dsp-2', name: 'Apple Music', delivery_format: 'DDEX ERN/XML', auth_type: 'OAuth', status: 'active', last_delivery_at: '2025-06-10', total_releases_delivered: 12 },
  { id: 'dsp-3', name: 'Amazon Music', delivery_format: 'DDEX ERN/XML', auth_type: 'API Key', status: 'active', last_delivery_at: '2025-06-08', total_releases_delivered: 10 },
  { id: 'dsp-4', name: 'YouTube Music', delivery_format: 'API', auth_type: 'OAuth', status: 'active', last_delivery_at: '2025-06-05', total_releases_delivered: 8 },
  { id: 'dsp-5', name: 'TikTok', delivery_format: 'API', auth_type: 'API Key', status: 'pending_approval', last_delivery_at: '', total_releases_delivered: 0 },
  { id: 'dsp-6', name: 'Pandora', delivery_format: 'DDEX ERN/XML', auth_type: 'SFTP', status: 'active', last_delivery_at: '2025-05-20', total_releases_delivered: 6 },
];

// 8 delivery records
const MOCK_DELIVERIES = [
  { id: 'd-1', release_id: 'rel-1', dsp_adapter_id: 'dsp-1', release_title: 'Midnight Echoes', dsp_name: 'Spotify', status: 'delivered', submitted_at: '2025-06-01', confirmed_at: '2025-06-03', error_message: '' },
  { id: 'd-2', release_id: 'rel-1', dsp_adapter_id: 'dsp-2', release_title: 'Midnight Echoes', dsp_name: 'Apple Music', status: 'accepted', submitted_at: '2025-06-01', confirmed_at: '2025-06-04', error_message: '' },
  { id: 'd-3', release_id: 'rel-1', dsp_adapter_id: 'dsp-3', release_title: 'Midnight Echoes', dsp_name: 'Amazon Music', status: 'delivered', submitted_at: '2025-06-02', confirmed_at: '2025-06-05', error_message: '' },
  { id: 'd-4', release_id: 'rel-2', dsp_adapter_id: 'dsp-1', release_title: 'Neon Dreams', dsp_name: 'Spotify', status: 'pending', submitted_at: '2025-06-10', confirmed_at: '', error_message: '' },
  { id: 'd-5', release_id: 'rel-2', dsp_adapter_id: 'dsp-4', release_title: 'Neon Dreams', dsp_name: 'YouTube Music', status: 'rejected', submitted_at: '2025-06-10', confirmed_at: '', error_message: 'Metadata validation failed: missing ISRC' },
  { id: 'd-6', release_id: 'rel-2', dsp_adapter_id: 'dsp-2', release_title: 'Neon Dreams', dsp_name: 'Apple Music', status: 'processing', submitted_at: '2025-06-11', confirmed_at: '', error_message: '' },
  { id: 'd-7', release_id: 'rel-3', dsp_adapter_id: 'dsp-1', release_title: 'Golden Hour', dsp_name: 'Spotify', status: 'pending', submitted_at: '2025-06-14', confirmed_at: '', error_message: '' },
  { id: 'd-8', release_id: 'rel-3', dsp_adapter_id: 'dsp-6', release_title: 'Golden Hour', dsp_name: 'Pandora', status: 'rejected', submitted_at: '2025-06-14', confirmed_at: '', error_message: 'Artwork resolution below 3000x3000 minimum' },
];

// 4 sync Deal Rooms
const MOCK_DEAL_ROOMS = [
  { id: 'dr-1', track: 'Midnight Echoes - Track 1', licensee: 'Netflix Studios', stage: 'Contract', fee_cents: 250000, negotiated_terms: 'Worldwide sync for 1-year TV series usage', contract_state: 'Signed', request_status: 'Active' },
  { id: 'dr-2', track: 'Neon Dreams - Title Track', licensee: 'Adidas Global', stage: 'Negotiate', fee_cents: 180000, negotiated_terms: 'Global commercial sync — 6-month campaign', contract_state: 'Draft', request_status: 'In Progress' },
  { id: 'dr-3', track: 'Golden Hour - Full Track', licensee: 'Warner Bros Pictures', stage: 'Review', fee_cents: 500000, negotiated_terms: 'Feature film sync — theatrical + streaming', contract_state: 'None', request_status: 'Under Review' },
  { id: 'dr-4', track: 'Midnight Echoes - Track 3', licensee: 'Independent Game Studio', stage: 'Request', fee_cents: 75000, negotiated_terms: 'Pending — video game sync usage', contract_state: 'None', request_status: 'New' },
];

// 6 royalty statements
const MOCK_ROYALTY_STATEMENTS = [
  { id: 'rs-1', dsp_source: 'Spotify', period: '2025-05', total_streams: 245000, total_revenue_cents: 1470000, status: 'finalized', generated_at: '2025-06-01', paid_at: '' },
  { id: 'rs-2', dsp_source: 'Apple Music', period: '2025-05', total_streams: 120000, total_revenue_cents: 1080000, status: 'paid', generated_at: '2025-06-01', paid_at: '2025-06-15' },
  { id: 'rs-3', dsp_source: 'Amazon Music', period: '2025-05', total_streams: 85000, total_revenue_cents: 595000, status: 'finalized', generated_at: '2025-06-01', paid_at: '' },
  { id: 'rs-4', dsp_source: 'YouTube Music', period: '2025-05', total_streams: 320000, total_revenue_cents: 640000, status: 'draft', generated_at: '2025-06-05', paid_at: '' },
  { id: 'rs-5', dsp_source: 'Pandora', period: '2025-04', total_streams: 45000, total_revenue_cents: 315000, status: 'paid', generated_at: '2025-05-01', paid_at: '2025-05-20' },
  { id: 'rs-6', dsp_source: 'TikTok', period: '2025-05', total_streams: 150000, total_revenue_cents: 300000, status: 'draft', generated_at: '2025-06-05', paid_at: '' },
];

// Split breakdown per track
const MOCK_SPLIT_BREAKDOWNS = [
  { track: 'Midnight Echoes - Track 1', Producer: 10, Writer: 25, Artist: 40, Label: 25 },
  { track: 'Neon Dreams - Title Track', Producer: 15, Writer: 20, Artist: 35, Label: 30 },
  { track: 'Golden Hour', Producer: 5, Writer: 30, Artist: 45, Label: 20 },
];

// ── Section toggle state ──
type SectionKey = 'rights' | 'distribution' | 'sync' | 'royalty' | 'analytics';

export function AdminRightsPage() {
  const [expandedSections, setExpandedSections] = useState<Record<SectionKey, boolean>>({
    rights: true, distribution: true, sync: false, royalty: false, analytics: false,
  });
  const [filterType, setFilterType] = useState('all');

  const toggleSection = (key: SectionKey) =>
    setExpandedSections(prev => ({ ...prev, [key]: !prev[key] }));

  // ── Computed stats ──
  // Rights: clearance status per release
  const releaseClearance = MOCK_RELEASES.map(rel => {
    const rights = MOCK_RIGHTS.filter(r => r.release_id === rel.id);
    const syncRight = rights.find(r => r.rights_type === 'sync');
    const isOneStop = syncRight?.ownership_pct === 100 && syncRight?.notes.toLowerCase().includes('one-stop');
    const hasConflict = rights.some(r => r.notes.toLowerCase().includes('conflict') || r.notes.toLowerCase().includes('disputed'));
    return { release: rel, rights, isOneStop, hasConflict };
  });

  const oneStopCount = releaseClearance.filter(r => r.isOneStop).length;
  const coClearanceCount = releaseClearance.filter(r => !r.isOneStop && !r.hasConflict).length;
  const conflictCount = releaseClearance.filter(r => r.hasConflict).length;

  // Distribution: queue summary
  const queueSummary = {
    pending: MOCK_DELIVERIES.filter(d => d.status === 'pending').length,
    delivered: MOCK_DELIVERIES.filter(d => d.status === 'delivered').length,
    accepted: MOCK_DELIVERIES.filter(d => d.status === 'accepted').length,
    rejected: MOCK_DELIVERIES.filter(d => d.status === 'rejected').length,
    processing: MOCK_DELIVERIES.filter(d => d.status === 'processing').length,
  };
  const rejectionCount = queueSummary.rejected;

  // Sync: deal room stage counts
  const dealRoomStages = MOCK_DEAL_ROOMS.reduce((acc, dr) => {
    acc[dr.stage] = (acc[dr.stage] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Royalty: totals
  const totalStreams = MOCK_ROYALTY_STATEMENTS.reduce((s, r) => s + r.total_streams, 0);
  const totalRevenue = MOCK_ROYALTY_STATEMENTS.reduce((s, r) => s + r.total_revenue_cents, 0);
  const draftStatements = MOCK_ROYALTY_STATEMENTS.filter(s => s.status === 'draft').length;
  const finalizedStatements = MOCK_ROYALTY_STATEMENTS.filter(s => s.status === 'finalized').length;
  const paidStatements = MOCK_ROYALTY_STATEMENTS.filter(s => s.status === 'paid').length;

  // Analytics: cross-catalog KPIs
  const avgPerStream = totalRevenue / totalStreams;

  const RIGHTS_TYPES = ['all', 'master', 'publishing', 'neighboring', 'mechanical', 'sync'];

  const rightsTypeColor = (type: string) =>
    type === 'master' ? 'teal' : type === 'publishing' ? 'purple' : type === 'sync' ? 'green' : type === 'mechanical' ? 'blue' : type === 'neighboring' ? 'amber' : 'gray';

  return (
    <div>
      <PageHeader title="Oversight Dashboard" description="Rights · Distribution · Sync · Royalty · Analytics — condensed summary to answer 'Is anything broken?'" actions={
        <Button variant="secondary" size="sm" onClick={() => toast('info', 'Full refresh coming soon')}>
          <Eye size={14} /> Refresh All
        </Button>
      } />

      {/* ── Top-level stats ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <StatCard label="One-Stop Clearance" value={oneStopCount} icon={<CheckCircle2 size={28} />} trend="Rights OK" />
        <StatCard label="Co-Clearance Needed" value={coClearanceCount} icon={<AlertTriangle size={28} />} trend="Action required" />
        <StatCard label="Rights Conflicts" value={conflictCount} icon={<XCircle size={28} />} trend="⚠ Blocked" />
        <StatCard label="DSP Rejections" value={rejectionCount} icon={<XCircle size={28} />} trend="Fix needed" />
        <StatCard label="Total Revenue" value={fmtCents(totalRevenue)} icon={<DollarSign size={28} />} />
      </div>

      {/* ── RIGHTS SECTION ── */}
      <Card className="mb-6">
        <button
          onClick={() => toggleSection('rights')}
          className="flex items-center justify-between w-full p-5 text-left"
        >
          <div className="flex items-center gap-3">
            <Shield size={20} className="text-neutral-500" />
            <h2 className="font-semibold text-neutral-900">Rights & Ownership</h2>
            <Badge color="green" size="md">{oneStopCount} one-stop</Badge>
            <Badge color="amber" size="md">{coClearanceCount} co-clearance</Badge>
            {conflictCount > 0 && <Badge color="red" size="md">{conflictCount} conflict</Badge>}
          </div>
          <span className="text-neutral-400">
            {expandedSections.rights ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
          </span>
        </button>

        {expandedSections.rights && (
          <div className="px-5 pb-5">
            {/* Filter */}
            <div className="flex items-center gap-3 mb-4">
              <FileText size={16} className="text-neutral-400" />
              <select
                value={filterType}
                onChange={e => setFilterType(e.target.value)}
                className="text-sm bg-white border border-neutral-200 rounded-lg px-3 py-1.5"
              >
                {RIGHTS_TYPES.map(t => <option key={t} value={t}>{t === 'all' ? 'All Rights Types' : t}</option>)}
              </select>
              {filterType !== 'all' && (
                <Button variant="ghost" size="sm" onClick={() => setFilterType('all')}>Clear filter</Button>
              )}
            </div>

            {/* Per-release rights cards */}
            <div className="space-y-4">
              {releaseClearance.map(({ release, rights, isOneStop, hasConflict }) => {
                const filtered = filterType === 'all' ? rights : rights.filter(r => r.rights_type === filterType);
                if (filtered.length === 0) return null;

                return (
                  <div key={release.id} className="p-4 rounded-lg bg-neutral-50 border border-neutral-200">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neutral-200 to-neutral-300 flex items-center justify-center">
                          <Music size={14} className="text-neutral-500" />
                        </div>
                        <div>
                          <p className="font-semibold text-neutral-900">{release.title}</p>
                          <p className="text-xs text-neutral-500">{release.genre} · {release.type}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {isOneStop && <Badge color="green" size="md">One-Stop Clearance</Badge>}
                        {!isOneStop && !hasConflict && <Badge color="amber" size="md">Co-Clearance Required</Badge>}
                        {hasConflict && <Badge color="red" size="md">Rights Conflict</Badge>}
                        <Badge color="gray" size="sm">{filtered.length} records</Badge>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-neutral-300">
                            <th className="text-left py-1.5 px-2 font-medium text-neutral-500 text-xs">Type</th>
                            <th className="text-left py-1.5 px-2 font-medium text-neutral-500 text-xs">Owner</th>
                            <th className="text-left py-1.5 px-2 font-medium text-neutral-500 text-xs">Territory</th>
                            <th className="text-left py-1.5 px-2 font-medium text-neutral-500 text-xs">Ownership %</th>
                            <th className="text-left py-1.5 px-2 font-medium text-neutral-500 text-xs">Expiration</th>
                            <th className="text-left py-1.5 px-2 font-medium text-neutral-500 text-xs">License Ref</th>
                            <th className="text-left py-1.5 px-2 font-medium text-neutral-500 text-xs">Notes</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filtered.map(r => (
                            <tr key={r.id} className="border-b border-neutral-200">
                              <td className="py-1.5 px-2"><Badge color={rightsTypeColor(r.rights_type)} size="sm">{r.rights_type}</Badge></td>
                              <td className="py-1.5 px-2 text-neutral-900 font-medium">{r.owner}</td>
                              <td className="py-1.5 px-2 text-neutral-600">{r.territory}</td>
                              <td className="py-1.5 px-2 text-neutral-900 font-medium">{r.ownership_pct}%</td>
                              <td className="py-1.5 px-2 text-neutral-500">{r.expiration}</td>
                              <td className="py-1.5 px-2"><Badge color="gray" size="sm">{r.license_ref}</Badge></td>
                              <td className="py-1.5 px-2 text-neutral-500 text-xs max-w-xs truncate">{r.notes}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </Card>

      {/* ── DISTRIBUTION SECTION ── */}
      <Card className="mb-6">
        <button
          onClick={() => toggleSection('distribution')}
          className="flex items-center justify-between w-full p-5 text-left"
        >
          <div className="flex items-center gap-3">
            <Send size={20} className="text-neutral-500" />
            <h2 className="font-semibold text-neutral-900">Distribution</h2>
            <Badge color="green" size="md">{queueSummary.accepted + queueSummary.delivered} delivered</Badge>
            {rejectionCount > 0 && <Badge color="red" size="md">{rejectionCount} rejected</Badge>}
            <Badge color="amber" size="md">{queueSummary.pending + queueSummary.processing} in progress</Badge>
          </div>
          <span className="text-neutral-400">
            {expandedSections.distribution ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
          </span>
        </button>

        {expandedSections.distribution && (
          <div className="px-5 pb-5 space-y-4">
            {/* DSP adapters mini table */}
            <div>
              <h3 className="text-sm font-semibold text-neutral-900 mb-2">DSP Adapters</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-neutral-200">
                      <th className="text-left py-1.5 px-2 font-medium text-neutral-500 text-xs">DSP</th>
                      <th className="text-left py-1.5 px-2 font-medium text-neutral-500 text-xs">Format</th>
                      <th className="text-left py-1.5 px-2 font-medium text-neutral-500 text-xs">Auth</th>
                      <th className="text-left py-1.5 px-2 font-medium text-neutral-500 text-xs">Status</th>
                      <th className="text-left py-1.5 px-2 font-medium text-neutral-500 text-xs">Last Delivery</th>
                      <th className="text-left py-1.5 px-2 font-medium text-neutral-500 text-xs">Delivered</th>
                    </tr>
                  </thead>
                  <tbody>
                    {MOCK_DSP_ADAPTERS.map(dsp => (
                      <tr key={dsp.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                        <td className="py-1.5 px-2">
                          <div className="flex items-center gap-2">
                            <Plug size={14} className="text-neutral-400" />
                            <span className="font-medium text-neutral-900">{dsp.name}</span>
                          </div>
                        </td>
                        <td className="py-1.5 px-2 text-neutral-600 text-xs">{dsp.delivery_format}</td>
                        <td className="py-1.5 px-2"><Badge color="gray" size="sm">{dsp.auth_type}</Badge></td>
                        <td className="py-1.5 px-2">
                          <Badge color={dsp.status === 'active' ? 'green' : dsp.status === 'pending_approval' ? 'amber' : 'gray'}>
                            {dsp.status}
                          </Badge>
                        </td>
                        <td className="py-1.5 px-2 text-neutral-500 text-xs">{dsp.last_delivery_at || 'Never'}</td>
                        <td className="py-1.5 px-2 text-neutral-900 font-medium">{dsp.total_releases_delivered}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Delivery records mini table */}
            <div>
              <h3 className="text-sm font-semibold text-neutral-900 mb-2">Recent Deliveries</h3>
              <div className="overflow-x-auto max-h-48 overflow-y-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-neutral-200">
                      <th className="text-left py-1.5 px-2 font-medium text-neutral-500 text-xs">Release</th>
                      <th className="text-left py-1.5 px-2 font-medium text-neutral-500 text-xs">DSP</th>
                      <th className="text-left py-1.5 px-2 font-medium text-neutral-500 text-xs">Status</th>
                      <th className="text-left py-1.5 px-2 font-medium text-neutral-500 text-xs">Submitted</th>
                      <th className="text-left py-1.5 px-2 font-medium text-neutral-500 text-xs">Error</th>
                    </tr>
                  </thead>
                  <tbody>
                    {MOCK_DELIVERIES.map(dr => (
                      <tr key={dr.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                        <td className="py-1.5 px-2">
                          <div className="flex items-center gap-1.5">
                            <Disc3 size={12} className="text-neutral-400" />
                            <span className="font-medium text-neutral-900 text-xs">{dr.release_title}</span>
                          </div>
                        </td>
                        <td className="py-1.5 px-2 text-neutral-600 text-xs">{dr.dsp_name}</td>
                        <td className="py-1.5 px-2">
                          <Badge
                            color={dr.status === 'accepted' ? 'green' : dr.status === 'rejected' ? 'red' : dr.status === 'pending' ? 'amber' : 'teal'}
                            size="sm"
                          >
                            {dr.status}
                          </Badge>
                        </td>
                        <td className="py-1.5 px-2 text-neutral-500 text-xs">{dr.submitted_at}</td>
                        <td className="py-1.5 px-2">
                          {dr.error_message ? (
                            <div className="flex items-center gap-1">
                              <AlertTriangle size={12} className="text-red-500" />
                              <span className="text-xs text-red-600 truncate max-w-[180px]">{dr.error_message}</span>
                            </div>
                          ) : <span className="text-neutral-400 text-xs">—</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* ── SYNC SECTION ── */}
      <Card className="mb-6">
        <button
          onClick={() => toggleSection('sync')}
          className="flex items-center justify-between w-full p-5 text-left"
        >
          <div className="flex items-center gap-3">
            <Handshake size={20} className="text-neutral-500" />
            <h2 className="font-semibold text-neutral-900">Sync Licensing</h2>
            <Badge color="blue" size="md">{MOCK_DEAL_ROOMS.length} Deal Rooms</Badge>
            {Object.entries(dealRoomStages).map(([stage, count]) => (
              <Badge key={stage} color="gray" size="sm">{stage}: {count}</Badge>
            ))}
          </div>
          <span className="text-neutral-400">
            {expandedSections.sync ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
          </span>
        </button>

        {expandedSections.sync && (
          <div className="px-5 pb-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {MOCK_DEAL_ROOMS.map(dr => (
                <div key={dr.id} className="p-3 rounded-lg bg-neutral-50 border border-neutral-200">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-neutral-900 text-sm">{dr.track}</p>
                    <Badge
                      color={dr.stage === 'Contract' ? 'green' : dr.stage === 'Negotiate' ? 'teal' : dr.stage === 'Review' ? 'amber' : 'gray'}
                      size="sm"
                    >
                      {dr.stage}
                    </Badge>
                  </div>
                  <p className="text-xs text-neutral-500 mb-1">Licensee: <span className="text-neutral-900">{dr.licensee}</span></p>
                  <p className="text-xs text-neutral-500 mb-1">Terms: <span className="text-neutral-700">{dr.negotiated_terms}</span></p>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-neutral-900">{fmtCents(dr.fee_cents)}</p>
                    <Badge color={dr.contract_state === 'Signed' ? 'green' : dr.contract_state === 'Draft' ? 'amber' : 'gray'} size="sm">
                      {dr.contract_state === 'None' ? 'No contract' : dr.contract_state}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* ── ROYALTY SECTION ── */}
      <Card className="mb-6">
        <button
          onClick={() => toggleSection('royalty')}
          className="flex items-center justify-between w-full p-5 text-left"
        >
          <div className="flex items-center gap-3">
            <DollarSign size={20} className="text-neutral-500" />
            <h2 className="font-semibold text-neutral-900">Royalty Engine</h2>
            <Badge color="gray" size="md">{totalStreams.toLocaleString()} streams</Badge>
            <Badge color="green" size="md">{fmtCents(totalRevenue)}</Badge>
            <Badge color="amber" size="sm">{draftStatements} draft</Badge>
          </div>
          <span className="text-neutral-400">
            {expandedSections.royalty ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
          </span>
        </button>

        {expandedSections.royalty && (
          <div className="px-5 pb-5 space-y-4">
            {/* Statements mini table */}
            <div className="overflow-x-auto max-h-48 overflow-y-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-neutral-200">
                    <th className="text-left py-1.5 px-2 font-medium text-neutral-500 text-xs">Period</th>
                    <th className="text-left py-1.5 px-2 font-medium text-neutral-500 text-xs">DSP</th>
                    <th className="text-left py-1.5 px-2 font-medium text-neutral-500 text-xs">Streams</th>
                    <th className="text-left py-1.5 px-2 font-medium text-neutral-500 text-xs">Revenue</th>
                    <th className="text-left py-1.5 px-2 font-medium text-neutral-500 text-xs">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_ROYALTY_STATEMENTS.map(st => (
                    <tr key={st.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                      <td className="py-1.5 px-2 font-medium text-neutral-900 text-xs">{st.period}</td>
                      <td className="py-1.5 px-2 text-neutral-600 text-xs">{st.dsp_source}</td>
                      <td className="py-1.5 px-2 text-neutral-900 text-xs">{st.total_streams.toLocaleString()}</td>
                      <td className="py-1.5 px-2 text-neutral-900 font-semibold text-xs">{fmtCents(st.total_revenue_cents)}</td>
                      <td className="py-1.5 px-2">
                        <Badge color={st.status === 'paid' ? 'green' : st.status === 'finalized' ? 'teal' : 'gray'} size="sm">
                          {st.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Split breakdown */}
            <div>
              <h3 className="text-sm font-semibold text-neutral-900 mb-2">Split Breakdown</h3>
              <div className="space-y-2">
                {MOCK_SPLIT_BREAKDOWNS.map((split, i) => (
                  <div key={i} className="p-3 rounded-lg bg-neutral-50 border border-neutral-200">
                    <p className="text-xs font-medium text-neutral-900 mb-2">{split.track}</p>
                    <div className="flex items-center gap-2">
                      {Object.entries(split).filter(([k]) => k !== 'track').map(([role, pct]) => (
                        <div key={role} className="flex-1">
                          <p className="text-xs text-neutral-500">{role}</p>
                          <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
                            <div className="h-2 bg-neutral-600 rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                          <p className="text-xs text-neutral-700 font-medium">{pct}%</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* ── ANALYTICS SECTION ── */}
      <Card className="mb-6">
        <button
          onClick={() => toggleSection('analytics')}
          className="flex items-center justify-between w-full p-5 text-left"
        >
          <div className="flex items-center gap-3">
            <BarChart3 size={20} className="text-neutral-500" />
            <h2 className="font-semibold text-neutral-900">Analytics KPI Snapshot</h2>
          </div>
          <span className="text-neutral-400">
            {expandedSections.analytics ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
          </span>
        </button>

        {expandedSections.analytics && (
          <div className="px-5 pb-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <StatCard label="Total Streams" value={totalStreams.toLocaleString()} icon={<BarChart3 size={24} />} />
              <StatCard label="Total Revenue" value={fmtCents(totalRevenue)} icon={<DollarSign size={24} />} />
              <StatCard label="Avg Per-Stream Rate" value={fmtCents(Math.round(avgPerStream * 100))} icon={<TrendingUp size={24} />} />
              <StatCard label="DSPs Reporting" value={MOCK_DSP_ADAPTERS.filter(d => d.status === 'active').length} icon={<Globe size={24} />} />
            </div>

            {/* Revenue by DSP mini */}
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-2">
              {MOCK_ROYALTY_STATEMENTS.map(st => (
                <div key={st.id} className="p-2 rounded-lg bg-neutral-50 border border-neutral-200">
                  <p className="text-xs font-medium text-neutral-900">{st.dsp_source}</p>
                  <p className="text-lg font-semibold text-neutral-900">{fmtCents(st.total_revenue_cents)}</p>
                  <p className="text-xs text-neutral-500">{st.total_streams.toLocaleString()} streams</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
