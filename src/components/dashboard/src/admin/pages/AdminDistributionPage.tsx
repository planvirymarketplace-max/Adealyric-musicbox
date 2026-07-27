'use client';

import { useState } from 'react';
import { Card, StatCard } from '@/components/ui/Card';
import { Badge, StatusBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { PageHeader } from '@/components/layout/PageHeader';
import { EmptyState } from '@/components/ui/States';
import { toast } from '@/components/ui/Toast';
import {
  Plug, Send, CheckCircle2, XCircle, Clock, AlertTriangle, Radio, Disc3,
  ArrowUpRight, RefreshCw, FileText, Wrench, Truck, ExternalLink
} from 'lucide-react';

// ── MOCK DATA ──

// 6 DSP adapters (including TooLost V1 per Section 8.4)
const MOCK_DSP_ADAPTERS = [
  { id: 'dsp-1', name: 'Spotify', delivery_format: 'DDEX ERN/XML', auth_type: 'OAuth', status: 'active', last_delivery_at: '2025-06-12', total_releases_delivered: 12 },
  { id: 'dsp-2', name: 'Apple Music', delivery_format: 'DDEX ERN/XML', auth_type: 'OAuth', status: 'active', last_delivery_at: '2025-06-10', total_releases_delivered: 12 },
  { id: 'dsp-3', name: 'Amazon Music', delivery_format: 'DDEX ERN/XML', auth_type: 'API Key', status: 'active', last_delivery_at: '2025-06-08', total_releases_delivered: 10 },
  { id: 'dsp-4', name: 'YouTube Music', delivery_format: 'API', auth_type: 'OAuth', status: 'active', last_delivery_at: '2025-06-05', total_releases_delivered: 8 },
  { id: 'dsp-5', name: 'TikTok', delivery_format: 'API', auth_type: 'API Key', status: 'pending_approval', last_delivery_at: '', total_releases_delivered: 0 },
  { id: 'dsp-6', name: 'Pandora', delivery_format: 'DDEX ERN/XML', auth_type: 'SFTP', status: 'active', last_delivery_at: '2025-05-20', total_releases_delivered: 6 },
];

// TooLost V1 partner (Section 8.4)
const TOOLOST_V1_ADAPTER = {
  id: 'dsp-toolost',
  name: 'TooLost V1',
  delivery_format: 'DDEX ERN/XML',
  auth_type: 'API Key',
  status: 'active',
  last_delivery_at: '2025-06-14',
  total_releases_delivered: 3,
  partner_info: 'Direct integration via TooLost API v1 — catalog sync + delivery pipeline',
};

// 8 delivery records
const MOCK_DELIVERIES = [
  { id: 'd-1', release_title: 'Midnight Echoes', dsp_name: 'Spotify', status: 'delivered', submitted_at: '2025-06-01', confirmed_at: '2025-06-03', error_message: '' },
  { id: 'd-2', release_title: 'Midnight Echoes', dsp_name: 'Apple Music', status: 'accepted', submitted_at: '2025-06-01', confirmed_at: '2025-06-04', error_message: '' },
  { id: 'd-3', release_title: 'Midnight Echoes', dsp_name: 'Amazon Music', status: 'delivered', submitted_at: '2025-06-02', confirmed_at: '2025-06-05', error_message: '' },
  { id: 'd-4', release_title: 'Neon Dreams', dsp_name: 'Spotify', status: 'pending', submitted_at: '2025-06-10', confirmed_at: '', error_message: '' },
  { id: 'd-5', release_title: 'Neon Dreams', dsp_name: 'YouTube Music', status: 'rejected', submitted_at: '2025-06-10', confirmed_at: '', error_message: 'Metadata validation failed: missing ISRC code on track 2' },
  { id: 'd-6', release_title: 'Neon Dreams', dsp_name: 'Apple Music', status: 'processing', submitted_at: '2025-06-11', confirmed_at: '', error_message: '' },
  { id: 'd-7', release_title: 'Golden Hour', dsp_name: 'Spotify', status: 'pending', submitted_at: '2025-06-14', confirmed_at: '', error_message: '' },
  { id: 'd-8', release_title: 'Golden Hour', dsp_name: 'Pandora', status: 'rejected', submitted_at: '2025-06-14', confirmed_at: '', error_message: 'Artwork resolution below 3000×3000 minimum requirement' },
];

// 3 store correction records
const MOCK_STORE_CORRECTIONS = [
  { id: 'sc-1', type: 'Metadata mismatch', affected_dsp: 'Spotify', submitted_date: '2025-06-05', resolution_status: 'Resolved', description: 'Track 3 title was incorrectly listed as "Untitled" — corrected to "Shadows"' },
  { id: 'sc-2', type: 'Artwork update', affected_dsp: 'Apple Music', submitted_date: '2025-06-08', resolution_status: 'Pending', description: 'Updated cover art with corrected credits text — awaiting DSP confirmation' },
  { id: 'sc-3', type: 'Territory restriction', affected_dsp: 'Amazon Music', submitted_date: '2025-06-12', resolution_status: 'In Progress', description: 'Release incorrectly available in EU territories — needs geo-restriction to US only' },
];

export function AdminDistributionPage() {
  const [activeTab, setActiveTab] = useState<'adapters' | 'deliveries' | 'corrections'>('adapters');

  // Delivery queue summary
  const queueSummary = {
    pending: MOCK_DELIVERIES.filter(d => d.status === 'pending').length,
    delivered: MOCK_DELIVERIES.filter(d => d.status === 'delivered').length,
    accepted: MOCK_DELIVERIES.filter(d => d.status === 'accepted').length,
    rejected: MOCK_DELIVERIES.filter(d => d.status === 'rejected').length,
    processing: MOCK_DELIVERIES.filter(d => d.status === 'processing').length,
  };

  const allAdapters = [...MOCK_DSP_ADAPTERS, TOOLOST_V1_ADAPTER];

  const tabs = [
    { key: 'adapters', label: 'DSP Adapters', icon: <Plug size={16} /> },
    { key: 'deliveries', label: 'Delivery Records', icon: <Send size={16} /> },
    { key: 'corrections', label: 'Store Corrections', icon: <Wrench size={16} /> },
  ];

  return (
    <div>
      <PageHeader title="Distribution Engine" description="Manage DSP adapters, delivery records, and distribution pipeline." actions={
        <Button variant="primary" size="sm" onClick={() => toast('info', 'Delivery trigger coming soon')}>
          <Send size={14} /> Trigger Delivery
        </Button>
      } />

      {/* Queue summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <StatCard label="Pending" value={queueSummary.pending} icon={<Clock size={28} />} />
        <StatCard label="Delivered" value={queueSummary.delivered} icon={<Send size={28} />} />
        <StatCard label="Accepted" value={queueSummary.accepted} icon={<CheckCircle2 size={28} />} />
        <StatCard label="Rejected" value={queueSummary.rejected} icon={<XCircle size={28} />} />
        <StatCard label="Processing" value={queueSummary.processing} icon={<Radio size={28} />} />
      </div>

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

      {/* ── DSP Adapters Tab ── */}
      {activeTab === 'adapters' && (
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-neutral-900">DSP Adapters</h3>
            <p className="text-sm text-neutral-500">{allAdapters.length} adapters</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-200">
                  <th className="text-left py-2 px-3 font-medium text-neutral-500">DSP</th>
                  <th className="text-left py-2 px-3 font-medium text-neutral-500">Delivery Format</th>
                  <th className="text-left py-2 px-3 font-medium text-neutral-500">Auth Type</th>
                  <th className="text-left py-2 px-3 font-medium text-neutral-500">Status</th>
                  <th className="text-left py-2 px-3 font-medium text-neutral-500">Last Delivery</th>
                  <th className="text-left py-2 px-3 font-medium text-neutral-500">Releases Delivered</th>
                </tr>
              </thead>
              <tbody>
                {allAdapters.map(dsp => (
                  <tr key={dsp.id} className={`border-b border-neutral-100 hover:bg-neutral-50 ${dsp.id === 'dsp-toolost' ? 'bg-teal-50/50' : ''}`}>
                    <td className="py-2 px-3">
                      <div className="flex items-center gap-2">
                        <Plug size={16} className="text-neutral-400" />
                        <span className="font-medium text-neutral-900">{dsp.name}</span>
                        {dsp.id === 'dsp-toolost' && <Badge color="teal" size="sm">V1 Partner</Badge>}
                      </div>
                    </td>
                    <td className="py-2 px-3 text-neutral-600">{dsp.delivery_format}</td>
                    <td className="py-2 px-3"><Badge color="gray" size="sm">{dsp.auth_type}</Badge></td>
                    <td className="py-2 px-3">
                      <Badge
                        color={dsp.status === 'active' ? 'green' : dsp.status === 'pending_approval' ? 'amber' : 'gray'}
                      >
                        {dsp.status}
                      </Badge>
                    </td>
                    <td className="py-2 px-3 text-neutral-500">{dsp.last_delivery_at || 'Never'}</td>
                    <td className="py-2 px-3 text-neutral-900 font-medium">{dsp.total_releases_delivered}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* TooLost V1 partner info */}
          <div className="mt-4 p-4 rounded-lg bg-teal-50 border border-teal-200">
            <div className="flex items-center gap-2 mb-2">
              <ExternalLink size={16} className="text-teal-600" />
              <p className="font-semibold text-teal-800 text-sm">TooLost V1 Partner Integration</p>
            </div>
            <p className="text-sm text-teal-700">{TOOLOST_V1_ADAPTER.partner_info}</p>
            <div className="mt-2 flex items-center gap-3">
              <Badge color="teal">Active</Badge>
              <Badge color="gray" size="sm">DDEX ERN/XML</Badge>
              <Badge color="gray" size="sm">API Key Auth</Badge>
              <p className="text-xs text-teal-600">Last delivery: {TOOLOST_V1_ADAPTER.last_delivery_at}</p>
            </div>
          </div>
        </Card>
      )}

      {/* ── Delivery Records Tab ── */}
      {activeTab === 'deliveries' && (
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-neutral-900">Delivery Records</h3>
            <p className="text-sm text-neutral-500">{MOCK_DELIVERIES.length} records</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-200">
                  <th className="text-left py-2 px-3 font-medium text-neutral-500">Release</th>
                  <th className="text-left py-2 px-3 font-medium text-neutral-500">DSP</th>
                  <th className="text-left py-2 px-3 font-medium text-neutral-500">Status</th>
                  <th className="text-left py-2 px-3 font-medium text-neutral-500">Submitted</th>
                  <th className="text-left py-2 px-3 font-medium text-neutral-500">Confirmed</th>
                  <th className="text-left py-2 px-3 font-medium text-neutral-500">Errors</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_DELIVERIES.map(dr => (
                  <tr key={dr.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                    <td className="py-2 px-3">
                      <div className="flex items-center gap-2">
                        <Disc3 size={14} className="text-neutral-400" />
                        <span className="font-medium text-neutral-900">{dr.release_title}</span>
                      </div>
                    </td>
                    <td className="py-2 px-3 text-neutral-600">{dr.dsp_name}</td>
                    <td className="py-2 px-3">
                      <Badge
                        color={dr.status === 'accepted' ? 'green' : dr.status === 'rejected' ? 'red' : dr.status === 'pending' ? 'amber' : dr.status === 'processing' ? 'blue' : 'teal'}
                      >
                        {dr.status}
                      </Badge>
                    </td>
                    <td className="py-2 px-3 text-neutral-500">{dr.submitted_at}</td>
                    <td className="py-2 px-3 text-neutral-500">{dr.confirmed_at || '—'}</td>
                    <td className="py-2 px-3">
                      {dr.error_message ? (
                        <div className="flex items-center gap-1">
                          <AlertTriangle size={14} className="text-red-500" />
                          <span className="text-xs text-red-600">{dr.error_message}</span>
                        </div>
                      ) : (
                        <span className="text-neutral-400">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* ── Store Corrections Tab ── */}
      {activeTab === 'corrections' && (
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-neutral-900">Store Corrections</h3>
            <p className="text-sm text-neutral-500">{MOCK_STORE_CORRECTIONS.length} corrections</p>
          </div>
          <div className="space-y-3">
            {MOCK_STORE_CORRECTIONS.map(sc => (
              <div key={sc.id} className="p-4 rounded-lg bg-neutral-50 border border-neutral-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Wrench size={16} className="text-neutral-400" />
                    <p className="font-medium text-neutral-900 text-sm">{sc.type}</p>
                    <Badge color="gray" size="sm">{sc.affected_dsp}</Badge>
                  </div>
                  <Badge
                    color={sc.resolution_status === 'Resolved' ? 'green' : sc.resolution_status === 'In Progress' ? 'amber' : 'blue'}
                  >
                    {sc.resolution_status}
                  </Badge>
                </div>
                <p className="text-sm text-neutral-600 mb-1">{sc.description}</p>
                <p className="text-xs text-neutral-400">Submitted: {sc.submitted_date}</p>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
