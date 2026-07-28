'use client';

import { useState } from 'react';
import { useRouter } from '@/lib/router';
import { useSyncRequests, useSyncSearch } from '@/hooks/queries';
import { formatCents, formatDate, formatDateTime } from '@/lib/format';
import { Card, StatCard } from '@/components/ui/Card';
import { Badge, StatusBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { PageHeader } from '@/components/layout/PageHeader';
import { mockCatalogSongs, mockSyncLicenseRequests } from '@/lib/mock-data';
import { ensureArray } from '@/lib/ensure-array';
import { FileText, Clock, CheckCircle2, AlertTriangle, Ban, ArrowUpRight, ChevronDown, ChevronUp, Filter } from 'lucide-react';
import type { SyncLicenseRequest } from '@/types/database';

const STATUS_OPTIONS = ['all', 'submitted', 'under_review', 'cleared', 'approved', 'countered', 'declined', 'completed'];

const workflowSteps = [
  { key: 'submitted', label: 'Submitted', icon: <FileText size={14} /> },
  { key: 'under_review', label: 'Under Review', icon: <Clock size={14} /> },
  { key: 'cleared', label: 'Cleared', icon: <CheckCircle2 size={14} /> },
  { key: 'approved', label: 'Approved', icon: <CheckCircle2 size={14} /> },
  { key: 'completed', label: 'Completed', icon: <CheckCircle2 size={14} /> },
];

function getWorkflowProgress(status: string): number {
  const idx = workflowSteps.findIndex(s => s.key === status);
  if (status === 'countered') return 2; // between under_review and cleared
  if (status === 'declined') return -1;
  return idx >= 0 ? idx : 0;
}

export function SyncLicenseRequestsPage() {
  const { navigate } = useRouter();
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [adminView, setAdminView] = useState(true);

  const catalogQuery = useSyncSearch();
  const requestsQuery = useSyncRequests();

  const catalog = ensureArray(catalogQuery.data, mockCatalogSongs);
  const requests = ensureArray(requestsQuery.data, mockSyncLicenseRequests);

  const filteredRequests = statusFilter === 'all'
    ? requests
    : requests.filter(r => r.status === statusFilter);

  const counts = {
    submitted: requests.filter(r => r.status === 'submitted').length,
    under_review: requests.filter(r => r.status === 'under_review').length,
    cleared: requests.filter(r => r.status === 'cleared').length,
    approved: requests.filter(r => r.status === 'approved').length,
    countered: requests.filter(r => r.status === 'countered').length,
    declined: requests.filter(r => r.status === 'declined').length,
    completed: requests.filter(r => r.status === 'completed').length,
  };

  return (
    <div>
      <PageHeader
        title="License Requests"
        description="Manage sync license requests — review, approve, counter, or decline."
        actions={
          <div className="flex items-center gap-2">
            <Button variant={adminView ? 'primary' : 'secondary'} size="sm" onClick={() => setAdminView(true)}>Admin View</Button>
            <Button variant={!adminView ? 'primary' : 'secondary'} size="sm" onClick={() => setAdminView(false)}>Requester View</Button>
          </div>
        }
      />

      {/* Status summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 mb-6">
        {STATUS_OPTIONS.slice(1).map(s => (
          <Card key={s} className={`p-3 cursor-pointer transition-colors ${statusFilter === s ? 'ring-2 ring-neutral-900' : ''}`} onClick={() => setStatusFilter(s)}>
            <p className="text-xs font-medium text-neutral-500 capitalize">{s.replace(/_/g, ' ')}</p>
            <p className="text-lg font-semibold text-neutral-900">{counts[s as keyof typeof counts]}</p>
          </Card>
        ))}
      </div>

      {/* Filter bar */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-neutral-400" />
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="text-sm bg-white border border-neutral-200 rounded-lg px-3 py-1.5"
          >
            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s === 'all' ? 'All Statuses' : s.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</option>)}
          </select>
        </div>
        <p className="text-sm text-neutral-500">{filteredRequests.length} requests</p>
        {statusFilter !== 'all' && (
          <Button variant="ghost" size="sm" onClick={() => setStatusFilter('all')}>Clear filter</Button>
        )}
      </div>

      {/* Request list */}
      <div className="space-y-3">
        {filteredRequests.length === 0 ? (
          <Card className="p-8">
            <div className="flex flex-col items-center text-center">
              <FileText size={32} className="text-neutral-300 mb-3" />
              <p className="text-sm font-medium text-neutral-900">No requests found</p>
            </div>
          </Card>
        ) : (
          filteredRequests.map(req => {
            const song = catalog.find(s => s.id === req.catalog_song_id);
            const isExpanded = expandedId === req.id;
            const progress = getWorkflowProgress(req.status);
            return (
              <Card key={req.id} className="p-4">
                {/* Header row */}
                <div className="flex items-center justify-between cursor-pointer" onClick={() => setExpandedId(isExpanded ? null : req.id)}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-neutral-200 to-neutral-300 flex items-center justify-center">
                      <FileText size={16} className="text-neutral-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-neutral-900">{song?.title ?? 'Unknown Track'}</p>
                      <p className="text-xs text-neutral-500">
                        {req.requester_name} · {req.requester_org ?? 'No org'} · {req.usage_type} · {req.territory}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={req.status} />
                    {req.fee_cents && <Badge color="teal">{formatCents(req.fee_cents)}</Badge>}
                    <button className="text-neutral-400">
                      {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>
                  </div>
                </div>

                {/* Expanded details */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-neutral-200 space-y-4">
                    {/* Clearance workflow timeline */}
                    <div>
                      <p className="text-xs font-semibold uppercase text-neutral-400 mb-2">Clearance Workflow</p>
                      <div className="flex items-center gap-1">
                        {workflowSteps.map((step, idx) => {
                          const reached = progress >= idx;
                          const current = req.status === step.key;
                          return (
                            <div key={step.key} className="flex items-center gap-1">
                              <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                                current ? 'bg-neutral-900 text-white' :
                                reached ? 'bg-green-100 text-green-700' :
                                'bg-neutral-100 text-neutral-400'
                              }`}>
                                {step.icon} {step.label}
                              </div>
                              {idx < workflowSteps.length - 1 && (
                                <div className={`w-4 h-0.5 ${reached ? 'bg-green-300' : 'bg-neutral-200'}`} />
                              )}
                            </div>
                          );
                        })}
                        {req.status === 'countered' && (
                          <div className="flex items-center gap-1 ml-1">
                            <div className="w-4 h-0.5 bg-amber-300" />
                            <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                              <AlertTriangle size={14} /> Countered
                            </div>
                          </div>
                        )}
                        {req.status === 'declined' && (
                          <div className="flex items-center gap-1 ml-1">
                            <div className="w-4 h-0.5 bg-red-300" />
                            <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                              <Ban size={14} /> Declined
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Request details grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                      <div className="p-3 rounded-lg bg-neutral-50">
                        <p className="text-xs text-neutral-400">Usage Type</p>
                        <p className="text-sm text-neutral-900 capitalize">{req.usage_type}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-neutral-50">
                        <p className="text-xs text-neutral-400">Territory</p>
                        <p className="text-sm text-neutral-900">{req.territory}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-neutral-50">
                        <p className="text-xs text-neutral-400">Term</p>
                        <p className="text-sm text-neutral-900">{req.term_months} months</p>
                      </div>
                      <div className="p-3 rounded-lg bg-neutral-50">
                        <p className="text-xs text-neutral-400">Media</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {req.media.map(m => <Badge key={m} color="gray" size="sm">{m}</Badge>)}
                        </div>
                      </div>
                      <div className="p-3 rounded-lg bg-neutral-50">
                        <p className="text-xs text-neutral-400">Budget Range</p>
                        <p className="text-sm text-neutral-900">{req.budget_range ?? '—'}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-neutral-50">
                        <p className="text-xs text-neutral-400">Fee</p>
                        <p className="text-sm text-neutral-900">{req.fee_cents ? formatCents(req.fee_cents) : 'Pending'}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-neutral-50">
                        <p className="text-xs text-neutral-400">Requester Email</p>
                        <p className="text-sm text-neutral-900">{req.requester_email}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-neutral-50">
                        <p className="text-xs text-neutral-400">Submitted</p>
                        <p className="text-sm text-neutral-900">{formatDate(req.created_at)}</p>
                      </div>
                    </div>

                    {/* Notes */}
                    {req.notes && (
                      <div className="p-3 rounded-lg bg-neutral-50">
                        <p className="text-xs text-neutral-400 mb-1">Notes</p>
                        <p className="text-sm text-neutral-900">{req.notes}</p>
                      </div>
                    )}

                    {/* Admin actions */}
                    {adminView && ['submitted', 'under_review', 'cleared', 'countered'].includes(req.status) && (
                      <div className="flex items-center gap-2 pt-2">
                        {req.status === 'submitted' && <Button variant="primary" size="sm">Move to Review</Button>}
                        {req.status === 'under_review' && <Button variant="primary" size="sm">Clear for Sync</Button>}
                        {req.status === 'cleared' && <Button variant="primary" size="sm">Approve License</Button>}
                        {req.status === 'countered' && <Button variant="primary" size="sm">Accept Counter</Button>}
                        {['submitted', 'under_review', 'cleared'].includes(req.status) && <Button variant="secondary" size="sm">Counter Offer</Button>}
                        <Button variant="danger" size="sm">Decline</Button>
                        <Button variant="ghost" size="sm" onClick={() => navigate(`/sync/track/${req.catalog_song_id}`)}>
                          <ArrowUpRight size={14} /> View Track
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
