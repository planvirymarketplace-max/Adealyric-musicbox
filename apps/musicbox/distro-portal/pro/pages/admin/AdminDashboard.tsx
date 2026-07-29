'use client';

import { useState } from 'react';
import { useProAuth } from '@/lib/auth';
import { Inbox, Music, DollarSign, TrendingUp, Activity, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge, StatusBadge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/States';
import { formatCents, timeAgo } from '@/lib/format';
import { mockPortalRequests, mockCatalogSongs, mockSpendEntries, mockPortalUsers } from '@/lib/mock-data';

const REQUEST_TYPE_COLORS: Record<string, 'blue' | 'purple' | 'teal' | 'amber' | 'pink'> = {
  booking: 'blue', sync: 'purple', collab: 'teal', purchase: 'amber', custom_write: 'pink',
};

export default function AdminDashboard() {
  const { portalUser } = useProAuth();
  if (!portalUser) return null;

  const requests = mockPortalRequests;
  const newRequests7d = requests.filter((r) => r.status === 'pending' || r.status === 'submitted').length;
  const openBookings = requests.filter((r) => r.type === 'booking' && !['completed', 'cancelled'].includes(r.status)).length;
  const catalogSize = mockCatalogSongs.length;
  const revenue30d = mockSpendEntries.filter((s) => s.direction === 'revenue').reduce((sum, s) => sum + s.amount, 0);
  const pipelineValue = requests.filter((r) => r.type === 'booking' && !['completed', 'cancelled'].includes(r.status)).reduce((sum, r) => sum + ((r.payload as Record<string, unknown>)?.estimatedValue as number ?? 0), 0);

  const stats = [
    { label: 'New Requests (7d)', value: newRequests7d, icon: <Inbox size={20} />, hint: 'Recent' },
    { label: 'Open Bookings', value: openBookings, icon: <Activity size={20} />, hint: 'Active' },
    { label: 'Catalog Size', value: catalogSize, icon: <Music size={20} />, hint: 'Total songs' },
    { label: 'Revenue (30d)', value: formatCents(revenue30d), icon: <DollarSign size={20} />, hint: 'Last 30 days' },
    { label: 'Pipeline Value', value: formatCents(pipelineValue), icon: <TrendingUp size={20} />, hint: 'Open estimates' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-white">Admin Dashboard</h1><p className="mt-1 text-sm text-white/50">Welcome back{portalUser?.display_name ? `, ${portalUser.display_name}` : ''}. Here&apos;s your portal overview.</p></div>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        {stats.map((s) => (
          <div key={s.label} className="bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="flex items-start justify-between"><div className="min-w-0"><p className="text-xs font-medium text-white/50 truncate">{s.label}</p><p className="mt-2 text-xl font-semibold text-white">{s.value}</p><p className="mt-1 text-xs text-white/30">{s.hint}</p></div><div className="text-white/30 flex-shrink-0">{s.icon}</div></div>
          </div>
        ))}
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4"><Activity size={18} className="text-white/50" /><h2 className="text-sm font-semibold text-white">Recent Activity</h2></div>
        {requests.length === 0 ? <EmptyState title="No recent activity" /> : (
          <div className="space-y-1">
            {requests.slice(0, 10).map((req) => {
              const user = mockPortalUsers.find((u) => u.id === req.user_id);
              return (
                <div key={req.id} className="flex items-center justify-between gap-3 py-2.5 border-b border-white/5 last:border-0">
                  <div className="flex items-center gap-3 min-w-0">
                    <Badge color={REQUEST_TYPE_COLORS[req.type] ?? 'gray'} size="sm">{req.type.replace(/_/g, ' ')}</Badge>
                    <div className="min-w-0"><p className="text-sm font-medium text-white truncate">{user?.display_name ?? user?.email ?? 'Unknown'}</p><p className="text-xs text-white/40 truncate">{((req.payload as Record<string, unknown>)?.usageType as string) ?? ((req.payload as Record<string, unknown>)?.eventName as string) ?? req.type}</p></div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0"><StatusBadge status={req.status} /><span className="text-xs text-white/30 hidden sm:inline">{timeAgo(req.created_at)}</span></div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
