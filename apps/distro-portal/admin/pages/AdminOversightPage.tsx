'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Shield, Send, Handshake, DollarSign, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

const tabs = [
  { id: 'rights', label: 'Rights', icon: Shield },
  { id: 'distribution', label: 'Distribution', icon: Send },
  { id: 'sync', label: 'Sync', icon: Handshake },
  { id: 'royalty', label: 'Royalty', icon: DollarSign },
] as const;

type TabId = typeof tabs[number]['id'];

// ─── Mock data per section ───
const MOCK_RIGHTS = [
  { release: 'Midnight Echoes', status: 'Cleared', owner: 'Your Label LLC', territory: 'Worldwide', expires: '2028-01-01', type: 'Master' },
  { release: 'Midnight Echoes', status: 'Cleared', owner: 'Sync Publishing Co.', territory: 'Worldwide', expires: '2028-01-01', type: 'Publishing' },
  { release: 'Neon Dreams', status: 'Pending clearance', owner: 'Your Label LLC', territory: 'US, UK', expires: '2027-06-15', type: 'Master' },
  { release: 'Neon Dreams', status: 'Partial', owner: 'Various Publishers', territory: 'US only', expires: '2026-12-31', type: 'Publishing' },
  { release: 'Golden Hour', status: 'Cleared', owner: 'Your Label LLC', territory: 'Worldwide', expires: '2029-03-01', type: 'Master' },
  { release: 'Golden Hour', status: 'Cleared', owner: 'One-Stop Admin', territory: 'Worldwide', expires: '2029-03-01', type: 'Publishing' },
  { release: 'Urban Pulse', status: 'Conflict', owner: 'Your Label LLC', territory: 'Worldwide', expires: '2027-09-01', type: 'Master' },
  { release: 'Urban Pulse', status: 'Split conflict', owner: 'Two publishers', territory: 'US, EU', expires: '2026-08-15', type: 'Publishing' },
];

const MOCK_DISTRIBUTION = [
  { release: 'Midnight Echoes', dsp: 'Spotify', status: 'Live', date: '2026-03-15', errors: 0 },
  { release: 'Midnight Echoes', dsp: 'Apple Music', status: 'Live', date: '2026-03-15', errors: 0 },
  { release: 'Midnight Echoes', dsp: 'Amazon Music', status: 'Live', date: '2026-03-16', errors: 0 },
  { release: 'Midnight Echoes', dsp: 'TikTok', status: 'Pending', date: '2026-03-20', errors: 0 },
  { release: 'Neon Dreams', dsp: 'Spotify', status: 'Live', date: '2026-01-10', errors: 0 },
  { release: 'Neon Dreams', dsp: 'Apple Music', status: 'Rejected', date: '2026-01-10', errors: 2 },
  { release: 'Neon Dreams', dsp: 'Amazon Music', status: 'Live', date: '2026-01-11', errors: 0 },
  { release: 'Neon Dreams', dsp: 'YouTube Content ID', status: 'Pending review', date: '', errors: 0 },
  { release: 'Golden Hour', dsp: 'Spotify', status: 'Live', date: '2026-06-01', errors: 0 },
  { release: 'Golden Hour', dsp: 'Apple Music', status: 'Live', date: '2026-06-01', errors: 0 },
];

const MOCK_SYNC = [
  { track: 'Midnight Echoes', stage: 'Negotiation', licensee: 'Netflix', use: 'Film soundtrack', fee: '$15,000', date: '2026-07-01' },
  { track: 'Golden Hour', stage: 'Contract signed', licensee: 'Nike', use: 'Commercial ad', fee: '$25,000', date: '2026-06-15' },
  { track: 'Neon Dreams', stage: 'Awaiting approval', licensee: 'EA Games', use: 'Game trailer', fee: '$8,000', date: '2026-07-10' },
  { track: 'Urban Pulse', stage: 'Invoice sent', licensee: 'HBO', use: 'TV series', fee: '$10,000', date: '2026-05-20' },
];

const MOCK_ROYALTY = [
  { period: 'June 2026', gross: '$42,350.00', artistPct: '45%', artistShare: '$19,057.50', producerPct: '10%', producerShare: '$4,235.00', songwriterPct: '25%', songwriterShare: '$10,587.50', publisherPct: '20%', publisherShare: '$8,470.00' },
  { period: 'May 2026', gross: '$38,120.00', artistPct: '45%', artistShare: '$17,154.00', producerPct: '10%', producerShare: '$3,812.00', songwriterPct: '25%', songwriterShare: '$9,530.00', publisherPct: '20%', publisherShare: '$7,624.00' },
  { period: 'April 2026', gross: '$35,900.00', artistPct: '45%', artistShare: '$16,155.00', producerPct: '10%', producerShare: '$3,590.00', songwriterPct: '25%', songwriterShare: '$8,975.00', publisherPct: '20%', publisherShare: '$7,180.00' },
];

const statusColors: Record<string, string> = {
  Cleared: 'bg-green-100 text-green-700',
  Pending: 'bg-amber-100 text-amber-700',
  'Pending clearance': 'bg-amber-100 text-amber-700',
  Partial: 'bg-blue-100 text-blue-700',
  Conflict: 'bg-red-100 text-red-700',
  'Split conflict': 'bg-red-100 text-red-700',
  Live: 'bg-green-100 text-green-700',
  Rejected: 'bg-red-100 text-red-700',
  'Pending review': 'bg-amber-100 text-amber-700',
  'Awaiting approval': 'bg-amber-100 text-amber-700',
  Negotiation: 'bg-blue-100 text-blue-700',
  'Contract signed': 'bg-green-100 text-green-700',
  'Invoice sent': 'bg-blue-100 text-blue-700',
};

export function AdminOversightPage() {
  const [activeTab, setActiveTab] = useState<TabId>('rights');

  return (
    <div>
      <PageHeader
        title="Oversight: Rights · Distribution · Sync · Royalty"
        description="Condensed oversight views per OS — enough to answer 'is anything broken' without leaving the Admin Panel. Drill into any section for full working detail in the Industry & Sync Portal."
      />

      {/* Tab bar */}
      <div className="flex gap-1 border-b border-neutral-200 mb-6">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                isActive ? 'border-neutral-900 text-neutral-900' : 'border-transparent text-neutral-500 hover:text-neutral-700'
              }`}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ─── Rights ─── */}
      {activeTab === 'rights' && (
        <div>
          {/* Summary cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl border border-neutral-200 p-4">
              <div className="flex items-center gap-2 mb-1"><CheckCircle size={16} className="text-green-500" /><span className="text-xs font-medium text-neutral-500">Cleared</span></div>
              <p className="text-2xl font-bold text-neutral-900">3</p>
            </div>
            <div className="bg-white rounded-xl border border-neutral-200 p-4">
              <div className="flex items-center gap-2 mb-1"><AlertTriangle size={16} className="text-amber-500" /><span className="text-xs font-medium text-neutral-500">Pending</span></div>
              <p className="text-2xl font-bold text-neutral-900">2</p>
            </div>
            <div className="bg-white rounded-xl border border-neutral-200 p-4">
              <div className="flex items-center gap-2 mb-1"><AlertTriangle size={16} className="text-blue-500" /><span className="text-xs font-medium text-neutral-500">Partial</span></div>
              <p className="text-2xl font-bold text-neutral-900">1</p>
            </div>
            <div className="bg-white rounded-xl border border-neutral-200 p-4">
              <div className="flex items-center gap-2 mb-1"><XCircle size={16} className="text-red-500" /><span className="text-xs font-medium text-neutral-500">Conflicts</span></div>
              <p className="text-2xl font-bold text-neutral-900">2</p>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl border border-neutral-200 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50">
                  <th className="px-4 py-3 text-left font-medium text-neutral-500">Release</th>
                  <th className="px-4 py-3 text-left font-medium text-neutral-500">Type</th>
                  <th className="px-4 py-3 text-left font-medium text-neutral-500">Status</th>
                  <th className="px-4 py-3 text-left font-medium text-neutral-500">Owner</th>
                  <th className="px-4 py-3 text-left font-medium text-neutral-500">Territory</th>
                  <th className="px-4 py-3 text-left font-medium text-neutral-500">Expires</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_RIGHTS.map((r, i) => (
                  <tr key={i} className="border-b border-neutral-100 hover:bg-neutral-50">
                    <td className="px-4 py-3 font-medium text-neutral-900">{r.release}</td>
                    <td className="px-4 py-3 text-neutral-600">{r.type}</td>
                    <td className="px-4 py-3"><span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[r.status] || 'bg-neutral-100 text-neutral-600'}`}>{r.status}</span></td>
                    <td className="px-4 py-3 text-neutral-600">{r.owner}</td>
                    <td className="px-4 py-3 text-neutral-600">{r.territory}</td>
                    <td className="px-4 py-3 text-neutral-600">{r.expires}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─── Distribution ─── */}
      {activeTab === 'distribution' && (
        <div>
          {/* Summary cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl border border-neutral-200 p-4">
              <div className="flex items-center gap-2 mb-1"><CheckCircle size={16} className="text-green-500" /><span className="text-xs font-medium text-neutral-500">Live</span></div>
              <p className="text-2xl font-bold text-neutral-900">6</p>
            </div>
            <div className="bg-white rounded-xl border border-neutral-200 p-4">
              <div className="flex items-center gap-2 mb-1"><AlertTriangle size={16} className="text-amber-500" /><span className="text-xs font-medium text-neutral-500">Pending</span></div>
              <p className="text-2xl font-bold text-neutral-900">2</p>
            </div>
            <div className="bg-white rounded-xl border border-neutral-200 p-4">
              <div className="flex items-center gap-2 mb-1"><XCircle size={16} className="text-red-500" /><span className="text-xs font-medium text-neutral-500">Rejected</span></div>
              <p className="text-2xl font-bold text-neutral-900">1</p>
            </div>
            <div className="bg-white rounded-xl border border-neutral-200 p-4">
              <div className="flex items-center gap-2 mb-1"><AlertTriangle size={16} className="text-amber-500" /><span className="text-xs font-medium text-neutral-500">Store Errors</span></div>
              <p className="text-2xl font-bold text-neutral-900">2</p>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl border border-neutral-200 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50">
                  <th className="px-4 py-3 text-left font-medium text-neutral-500">Release</th>
                  <th className="px-4 py-3 text-left font-medium text-neutral-500">DSP</th>
                  <th className="px-4 py-3 text-left font-medium text-neutral-500">Status</th>
                  <th className="px-4 py-3 text-left font-medium text-neutral-500">Delivery Date</th>
                  <th className="px-4 py-3 text-left font-medium text-neutral-500">Errors</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_DISTRIBUTION.map((d, i) => (
                  <tr key={i} className="border-b border-neutral-100 hover:bg-neutral-50">
                    <td className="px-4 py-3 font-medium text-neutral-900">{d.release}</td>
                    <td className="px-4 py-3 text-neutral-600">{d.dsp}</td>
                    <td className="px-4 py-3"><span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[d.status] || 'bg-neutral-100 text-neutral-600'}`}>{d.status}</span></td>
                    <td className="px-4 py-3 text-neutral-600">{d.date || '—'}</td>
                    <td className="px-4 py-3 text-neutral-600">{d.errors > 0 ? <span className="text-red-600 font-medium">{d.errors}</span> : '0'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─── Sync ─── */}
      {activeTab === 'sync' && (
        <div>
          {/* Summary cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl border border-neutral-200 p-4">
              <div className="flex items-center gap-2 mb-1"><Handshake size={16} className="text-blue-500" /><span className="text-xs font-medium text-neutral-500">Open Deal Rooms</span></div>
              <p className="text-2xl font-bold text-neutral-900">4</p>
            </div>
            <div className="bg-white rounded-xl border border-neutral-200 p-4">
              <div className="flex items-center gap-2 mb-1"><CheckCircle size={16} className="text-green-500" /><span className="text-xs font-medium text-neutral-500">Signed</span></div>
              <p className="text-2xl font-bold text-neutral-900">1</p>
            </div>
            <div className="bg-white rounded-xl border border-neutral-200 p-4">
              <div className="flex items-center gap-2 mb-1"><DollarSign size={16} className="text-green-500" /><span className="text-xs font-medium text-neutral-500">Pipeline Value</span></div>
              <p className="text-2xl font-bold text-neutral-900">$58K</p>
            </div>
            <div className="bg-white rounded-xl border border-neutral-200 p-4">
              <div className="flex items-center gap-2 mb-1"><AlertTriangle size={16} className="text-amber-500" /><span className="text-xs font-medium text-neutral-500">Awaiting Action</span></div>
              <p className="text-2xl font-bold text-neutral-900">2</p>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl border border-neutral-200 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50">
                  <th className="px-4 py-3 text-left font-medium text-neutral-500">Track</th>
                  <th className="px-4 py-3 text-left font-medium text-neutral-500">Stage</th>
                  <th className="px-4 py-3 text-left font-medium text-neutral-500">Licensee</th>
                  <th className="px-4 py-3 text-left font-medium text-neutral-500">Use</th>
                  <th className="px-4 py-3 text-left font-medium text-neutral-500">Fee</th>
                  <th className="px-4 py-3 text-left font-medium text-neutral-500">Date</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_SYNC.map((s, i) => (
                  <tr key={i} className="border-b border-neutral-100 hover:bg-neutral-50">
                    <td className="px-4 py-3 font-medium text-neutral-900">{s.track}</td>
                    <td className="px-4 py-3"><span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[s.stage] || 'bg-neutral-100 text-neutral-600'}`}>{s.stage}</span></td>
                    <td className="px-4 py-3 text-neutral-600">{s.licensee}</td>
                    <td className="px-4 py-3 text-neutral-600">{s.use}</td>
                    <td className="px-4 py-3 font-medium text-neutral-900">{s.fee}</td>
                    <td className="px-4 py-3 text-neutral-600">{s.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─── Royalty ─── */}
      {activeTab === 'royalty' && (
        <div>
          {/* Summary cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-xl border border-neutral-200 p-4">
              <div className="flex items-center gap-2 mb-1"><DollarSign size={16} className="text-green-500" /><span className="text-xs font-medium text-neutral-500">Latest Statement</span></div>
              <p className="text-2xl font-bold text-neutral-900">$42,350</p>
              <p className="text-xs text-neutral-500">June 2026</p>
            </div>
            <div className="bg-white rounded-xl border border-neutral-200 p-4">
              <div className="flex items-center gap-2 mb-1"><CheckCircle size={16} className="text-green-500" /><span className="text-xs font-medium text-neutral-500">Paid Out</span></div>
              <p className="text-2xl font-bold text-neutral-900">4 participants</p>
              <p className="text-xs text-neutral-500">All splits settled</p>
            </div>
            <div className="bg-white rounded-xl border border-neutral-200 p-4">
              <div className="flex items-center gap-2 mb-1"><AlertTriangle size={16} className="text-amber-500" /><span className="text-xs font-medium text-neutral-500">Pending</span></div>
              <p className="text-2xl font-bold text-neutral-900">0</p>
              <p className="text-xs text-neutral-500">No unsettled splits</p>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl border border-neutral-200 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50">
                  <th className="px-4 py-3 text-left font-medium text-neutral-500">Period</th>
                  <th className="px-4 py-3 text-left font-medium text-neutral-500">Gross</th>
                  <th className="px-4 py-3 text-left font-medium text-neutral-500">Artist (45%)</th>
                  <th className="px-4 py-3 text-left font-medium text-neutral-500">Producer (10%)</th>
                  <th className="px-4 py-3 text-left font-medium text-neutral-500">Songwriter (25%)</th>
                  <th className="px-4 py-3 text-left font-medium text-neutral-500">Publisher (20%)</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_ROYALTY.map((r, i) => (
                  <tr key={i} className="border-b border-neutral-100 hover:bg-neutral-50">
                    <td className="px-4 py-3 font-medium text-neutral-900">{r.period}</td>
                    <td className="px-4 py-3 font-medium text-neutral-900">{r.gross}</td>
                    <td className="px-4 py-3 text-neutral-600">{r.artistShare}</td>
                    <td className="px-4 py-3 text-neutral-600">{r.producerShare}</td>
                    <td className="px-4 py-3 text-neutral-600">{r.songwriterShare}</td>
                    <td className="px-4 py-3 text-neutral-600">{r.publisherShare}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
