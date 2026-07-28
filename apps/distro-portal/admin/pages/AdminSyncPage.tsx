'use client';

import { useState } from 'react';
import { Card, StatCard } from '@/components/ui/Card';
import { Badge, StatusBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { PageHeader } from '@/components/layout/PageHeader';
import { EmptyState } from '@/components/ui/States';
import { toast } from '@/components/ui/Toast';
import {
  Handshake, FileText, DollarSign, CheckCircle2, Clock, AlertTriangle,
  Users, Music, Shield, ArrowUpRight, Search, Filter, Eye,
  ChevronDown, ChevronRight, PenLine, ScrollText, BarChart3
} from 'lucide-react';

// ── Format helper ──
const fmtCents = (cents: number) => `$${(cents / 100).toFixed(2)}`;

// ── MOCK DATA ──

// Sync Deal Room lifecycle stages (per Section 7.4)
const DEAL_ROOM_STAGES = [
  'Request', 'Private Workspace', 'Review', 'Approve', 'Negotiate', 'Contract', 'Sign', 'Invoice', 'Deliver', 'Usage Tracking', 'Royalty Tracking',
];

// 4 Deal Room cards
const MOCK_DEAL_ROOMS = [
  {
    id: 'dr-1',
    track: 'Midnight Echoes — Track 1 "Sunset Drive"',
    licensee: 'Netflix Studios',
    stage: 'Contract',
    request_status: 'Active',
    negotiated_terms: 'Worldwide sync for 1-year TV series usage, exclusive to Netflix Original productions',
    contract_state: 'Signed',
    fee_cents: 250000,
    created_at: '2025-05-01',
  },
  {
    id: 'dr-2',
    track: 'Neon Dreams — Title Track',
    licensee: 'Adidas Global Marketing',
    stage: 'Negotiate',
    request_status: 'In Progress',
    negotiated_terms: 'Global commercial sync — 6-month digital campaign, non-exclusive',
    contract_state: 'Draft',
    fee_cents: 180000,
    created_at: '2025-05-15',
  },
  {
    id: 'dr-3',
    track: 'Golden Hour — Full Track',
    licensee: 'Warner Bros Pictures',
    stage: 'Review',
    request_status: 'Under Review',
    negotiated_terms: 'Feature film sync — theatrical + streaming, worldwide, 3-year term',
    contract_state: 'None',
    fee_cents: 500000,
    created_at: '2025-06-01',
  },
  {
    id: 'dr-4',
    track: 'Midnight Echoes — Track 3 "Echoes"',
    licensee: 'Indie Game Studio',
    stage: 'Request',
    request_status: 'New',
    negotiated_terms: 'Pending — video game sync, digital distribution only',
    contract_state: 'None',
    fee_cents: 75000,
    created_at: '2025-06-10',
  },
];

// License history table
const MOCK_LICENSE_HISTORY = [
  { id: 'lh-1', track: 'Sunset Drive', licensee: 'Netflix Studios', terms: 'TV series sync, 1-year worldwide', fee_cents: 250000, invoice_status: 'Paid', usage_record: '3 episodes aired', date: '2025-05-20' },
  { id: 'lh-2', track: 'Neon Dreams', licensee: 'Nike Europe', terms: 'Commercial, 6-month EU campaign', fee_cents: 120000, invoice_status: 'Paid', usage_record: '2 commercials aired', date: '2024-11-15' },
  { id: 'lh-3', track: 'Golden Hour', licensee: 'ABC Television', terms: 'Background music, US broadcast, 1-year', fee_cents: 85000, invoice_status: 'Finalized', usage_record: 'Pending tracking', date: '2025-02-01' },
  { id: 'lh-4', track: 'Sunset Drive', licensee: 'Ubisoft Entertainment', terms: 'Video game sync, worldwide digital', fee_cents: 200000, invoice_status: 'Draft', usage_record: 'Game in development', date: '2025-04-10' },
  { id: 'lh-5', track: 'Echoes', licensee: 'Hulu Originals', terms: 'Streaming series background, worldwide', fee_cents: 65000, invoice_status: 'Paid', usage_record: '1 season aired', date: '2024-08-20' },
];

// Catalog sync readiness
const MOCK_CATALOG_READINESS = [
  { id: 'tr-1', title: 'Sunset Drive', cleared: true, clearance_type: 'One-stop', issues: '' },
  { id: 'tr-2', title: 'Neon Dreams', cleared: false, clearance_type: 'Co-clearance', issues: 'Producer holds 40% sync rights — must negotiate separately' },
  { id: 'tr-3', title: 'Golden Hour', cleared: false, clearance_type: 'Rights conflict', issues: 'Co-writer disputes ownership — legal review in progress' },
  { id: 'tr-4', title: 'Echoes', cleared: true, clearance_type: 'One-stop', issues: '' },
  { id: 'tr-5', title: 'Midnight Pulse', cleared: true, clearance_type: 'One-stop', issues: '' },
  { id: 'tr-6', title: 'Afterglow', cleared: false, clearance_type: 'Co-clearance', issues: 'Publisher holds 50% — requires publisher clearance letter' },
  { id: 'tr-7', title: 'Horizon Line', cleared: true, clearance_type: 'One-stop', issues: '' },
  { id: 'tr-8', title: 'City Lights', cleared: false, clearance_type: 'Co-clearance', issues: 'Mechanical rights not cleared for sync derivative' },
];

export function AdminSyncPage() {
  const [activeTab, setActiveTab] = useState<'dealrooms' | 'history' | 'readiness'>('dealrooms');
  const [searchQuery, setSearchQuery] = useState('');

  // Stats
  const clearedCount = MOCK_CATALOG_READINESS.filter(t => t.cleared).length;
  const needClearanceCount = MOCK_CATALOG_READINESS.filter(t => !t.cleared).length;
  const totalCatalog = MOCK_CATALOG_READINESS.length;

  const activeDealRooms = MOCK_DEAL_ROOMS.filter(dr => dr.request_status === 'Active').length;
  const inProgress = MOCK_DEAL_ROOMS.filter(dr => dr.request_status === 'In Progress' || dr.request_status === 'Under Review').length;
  const newRequests = MOCK_DEAL_ROOMS.filter(dr => dr.request_status === 'New').length;

  const totalSyncRevenue = MOCK_LICENSE_HISTORY.reduce((s, l) => s + l.fee_cents, 0);

  const tabs = [
    { key: 'dealrooms', label: 'Deal Rooms', icon: <Handshake size={16} /> },
    { key: 'history', label: 'License History', icon: <ScrollText size={16} /> },
    { key: 'readiness', label: 'Catalog Readiness', icon: <Shield size={16} /> },
  ];

  // Filtered readiness data
  const filteredReadiness = searchQuery
    ? MOCK_CATALOG_READINESS.filter(t => t.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : MOCK_CATALOG_READINESS;

  // Stage badge color mapping
  const stageColor = (stage: string) => {
    if (stage === 'Contract' || stage === 'Sign') return 'green';
    if (stage === 'Negotiate') return 'teal';
    if (stage === 'Review' || stage === 'Approve') return 'amber';
    if (stage === 'Request' || stage === 'Private Workspace') return 'gray';
    if (stage === 'Invoice' || stage === 'Deliver') return 'blue';
    if (stage === 'Usage Tracking' || stage === 'Royalty Tracking') return 'purple';
    return 'gray';
  };

  return (
    <div>
      <PageHeader title="Sync Licensing Oversight" description="Manage sync Deal Rooms, license history, and catalog clearance status." actions={
        <Button variant="secondary" size="sm" onClick={() => toast('info', 'New Deal Room creation coming soon')}>
          <Handshake size={14} /> New Deal Room
        </Button>
      } />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <StatCard label="Open Deal Rooms" value={MOCK_DEAL_ROOMS.length} icon={<Handshake size={28} />} />
        <StatCard label="Active / In Progress" value={activeDealRooms + inProgress} icon={<Clock size={28} />} />
        <StatCard label="New Requests" value={newRequests} icon={<FileText size={28} />} />
        <StatCard label="Total Sync Revenue" value={fmtCents(totalSyncRevenue)} icon={<DollarSign size={28} />} />
        <StatCard label="Tracks Cleared" value={`${clearedCount}/${totalCatalog}`} icon={<CheckCircle2 size={28} />} />
      </div>

      {/* Deal Room lifecycle progress bar */}
      <Card className="p-5 mb-6">
        <h3 className="font-semibold text-neutral-900 mb-3">Deal Room Lifecycle (Section 7.4)</h3>
        <div className="flex items-center gap-1 overflow-x-auto pb-2">
          {DEAL_ROOM_STAGES.map((stage, i) => (
            <div key={stage} className="flex items-center">
              <div className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
                MOCK_DEAL_ROOMS.some(dr => dr.stage === stage)
                  ? 'bg-neutral-900 text-white'
                  : 'bg-neutral-100 text-neutral-500'
              }`}>
                {stage}
              </div>
              {i < DEAL_ROOM_STAGES.length - 1 && (
                <ArrowUpRight size={12} className="text-neutral-300 mx-1" />
              )}
            </div>
          ))}
        </div>
        <p className="text-xs text-neutral-500 mt-2">
          Highlighted stages have active Deal Rooms. Each Deal Room progresses through the lifecycle sequentially.
        </p>
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

      {/* ── Deal Rooms Tab ── */}
      {activeTab === 'dealrooms' && (
        <div className="space-y-4">
          {MOCK_DEAL_ROOMS.map(dr => (
            <Card key={dr.id} className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-neutral-200 to-neutral-300 flex items-center justify-center">
                    <Music size={16} className="text-neutral-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-neutral-900">{dr.track}</p>
                    <p className="text-xs text-neutral-500">Created {dr.created_at} · Deal Room {dr.id}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge color={stageColor(dr.stage)} size="md">{dr.stage}</Badge>
                  <StatusBadge status={dr.request_status.toLowerCase().replace(' ', '_')} />
                </div>
              </div>

              {/* Detail grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
                <div className="p-3 rounded-lg bg-neutral-50 border border-neutral-200">
                  <p className="text-xs text-neutral-500 mb-1">Licensee</p>
                  <p className="text-sm font-medium text-neutral-900">{dr.licensee}</p>
                </div>
                <div className="p-3 rounded-lg bg-neutral-50 border border-neutral-200">
                  <p className="text-xs text-neutral-500 mb-1">Negotiated Terms</p>
                  <p className="text-sm text-neutral-700">{dr.negotiated_terms}</p>
                </div>
                <div className="p-3 rounded-lg bg-neutral-50 border border-neutral-200">
                  <p className="text-xs text-neutral-500 mb-1">Contract State</p>
                  <Badge color={dr.contract_state === 'Signed' ? 'green' : dr.contract_state === 'Draft' ? 'amber' : 'gray'}>
                    {dr.contract_state === 'None' ? 'No contract yet' : dr.contract_state}
                  </Badge>
                </div>
                <div className="p-3 rounded-lg bg-neutral-50 border border-neutral-200">
                  <p className="text-xs text-neutral-500 mb-1">Fee</p>
                  <p className="text-lg font-semibold text-neutral-900">{fmtCents(dr.fee_cents)}</p>
                </div>
              </div>

              {/* Lifecycle progress for this deal */}
              <div className="flex items-center gap-1 mt-2">
                {DEAL_ROOM_STAGES.map((stage, i) => {
                  const stageIndex = DEAL_ROOM_STAGES.indexOf(dr.stage);
                  const isReached = i <= stageIndex;
                  const isCurrent = stage === dr.stage;
                  return (
                    <div key={stage} className={`px-2 py-1 rounded text-xs ${
                      isCurrent ? 'bg-neutral-900 text-white font-semibold' :
                      isReached ? 'bg-neutral-200 text-neutral-700' :
                      'bg-neutral-50 text-neutral-400'
                    }`}>
                      {stage}
                    </div>
                  );
                })}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* ── License History Tab ── */}
      {activeTab === 'history' && (
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-neutral-900">License History</h3>
            <p className="text-sm text-neutral-500">{MOCK_LICENSE_HISTORY.length} records</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-200">
                  <th className="text-left py-2 px-3 font-medium text-neutral-500">Track</th>
                  <th className="text-left py-2 px-3 font-medium text-neutral-500">Licensee</th>
                  <th className="text-left py-2 px-3 font-medium text-neutral-500">Terms</th>
                  <th className="text-left py-2 px-3 font-medium text-neutral-500">Fee</th>
                  <th className="text-left py-2 px-3 font-medium text-neutral-500">Invoice Status</th>
                  <th className="text-left py-2 px-3 font-medium text-neutral-500">Usage Record</th>
                  <th className="text-left py-2 px-3 font-medium text-neutral-500">Date</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_LICENSE_HISTORY.map(lh => (
                  <tr key={lh.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                    <td className="py-2 px-3 font-medium text-neutral-900">{lh.track}</td>
                    <td className="py-2 px-3 text-neutral-600">{lh.licensee}</td>
                    <td className="py-2 px-3 text-neutral-600 text-xs max-w-xs">{lh.terms}</td>
                    <td className="py-2 px-3 text-neutral-900 font-semibold">{fmtCents(lh.fee_cents)}</td>
                    <td className="py-2 px-3">
                      <Badge
                        color={lh.invoice_status === 'Paid' ? 'green' : lh.invoice_status === 'Finalized' ? 'teal' : 'gray'}
                      >
                        {lh.invoice_status}
                      </Badge>
                    </td>
                    <td className="py-2 px-3 text-neutral-500 text-xs">{lh.usage_record}</td>
                    <td className="py-2 px-3 text-neutral-500">{lh.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* ── Catalog Readiness Tab ── */}
      {activeTab === 'readiness' && (
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-neutral-900">Catalog Sync Readiness</h3>
            <div className="flex items-center gap-2">
              <Badge color="green" size="md">{clearedCount} cleared</Badge>
              <Badge color="amber" size="md">{needClearanceCount} need clearance</Badge>
            </div>
          </div>

          {/* Search */}
          <div className="flex items-center gap-3 mb-4">
            <div className="relative flex-1 max-w-sm">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                placeholder="Search tracks…"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-neutral-200 rounded-lg focus:outline-none focus:border-neutral-400"
              />
            </div>
          </div>

          {/* Readiness progress bar */}
          <div className="mb-4">
            <div className="h-3 bg-neutral-200 rounded-full overflow-hidden">
              <div className="h-3 bg-green-500 rounded-full" style={{ width: `${(clearedCount / totalCatalog) * 100}%` }} />
            </div>
            <p className="text-xs text-neutral-500 mt-1">{Math.round((clearedCount / totalCatalog) * 100)}% of catalog cleared for sync</p>
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredReadiness.map(track => (
              <div key={track.id} className={`p-3 rounded-lg border ${
                track.cleared ? 'bg-green-50 border-green-200' :
                track.clearance_type === 'Rights conflict' ? 'bg-red-50 border-red-200' :
                'bg-amber-50 border-amber-200'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Music size={16} className={track.cleared ? 'text-green-600' : 'text-amber-600'} />
                    <p className="font-medium text-neutral-900 text-sm">{track.title}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      color={track.cleared ? 'green' : track.clearance_type === 'Rights conflict' ? 'red' : 'amber'}
                      size="sm"
                    >
                      {track.clearance_type}
                    </Badge>
                    {track.cleared && <CheckCircle2 size={14} className="text-green-500" />}
                    {!track.cleared && <AlertTriangle size={14} className="text-amber-500" />}
                  </div>
                </div>
                {!track.cleared && track.issues && (
                  <p className="text-xs text-neutral-600 mt-1 ml-6">{track.issues}</p>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
