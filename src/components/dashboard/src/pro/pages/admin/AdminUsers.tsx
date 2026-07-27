'use client';

import { useState, useEffect } from 'react';
import { Badge, StatusBadge } from '@/components/ui/Badge';
import { formatDate } from '@/lib/format';
import { getAllUsers, updateUserStatus, type PortalUser } from '@/lib/auth';
import { toast } from '@/components/ui/Toast';
import { CheckCircle2, Ban, Clock, XCircle, UserCheck, Shield } from 'lucide-react';

const ROLE_COLORS: Record<string, 'blue' | 'purple' | 'teal' | 'amber' | 'pink'> = { label: 'purple', booking: 'blue', writer: 'teal', admin: 'amber' };

export default function AdminUsers() {
  const [users, setUsers] = useState<Record<string, PortalUser>>({});

  const refreshUsers = () => {
    setUsers(getAllUsers());
  };

  useEffect(() => { refreshUsers(); }, []);

  const handleAction = (email: string, newStatus: PortalUser['status']) => {
    const result = updateUserStatus(email, newStatus);
    if (result) {
      toast('success', `${email} → ${newStatus}`);
      refreshUsers();
    } else {
      toast('error', 'Failed to update user status');
    }
  };

  const userList = Object.values(users).sort((a, b) => {
    // Sort pending first (most urgent for admin to action)
    const statusOrder: Record<string, number> = { pending: 0, approved: 1, suspended: 2, rejected: 3 };
    return (statusOrder[a.status] ?? 99) - (statusOrder[b.status] ?? 99);
  });

  const pendingCount = userList.filter(u => u.status === 'pending').length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Users & Roles</h1>
        <p className="mt-1 text-sm text-white/50">Manage portal users and their access</p>
        {pendingCount > 0 && (
          <div className="mt-3 flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-500/20 border border-amber-500/30">
            <Clock size={16} className="text-amber-400" />
            <span className="text-sm text-amber-300 font-medium">{pendingCount} pending approval</span>
          </div>
        )}
      </div>

      {/* Stats summary */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Approved', count: userList.filter(u => u.status === 'approved').length, color: 'text-emerald-400', icon: <CheckCircle2 size={16} /> },
          { label: 'Pending', count: userList.filter(u => u.status === 'pending').length, color: 'text-amber-400', icon: <Clock size={16} /> },
          { label: 'Suspended', count: userList.filter(u => u.status === 'suspended').length, color: 'text-red-400', icon: <Ban size={16} /> },
          { label: 'Rejected', count: userList.filter(u => u.status === 'rejected').length, color: 'text-neutral-400', icon: <XCircle size={16} /> },
        ].map(s => (
          <div key={s.label} className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center gap-3">
            <div className={s.color}>{s.icon}</div>
            <div>
              <p className="text-xs text-white/40">{s.label}</p>
              <p className={`text-lg font-bold ${s.color}`}>{s.count}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        {userList.map((u) => (
          <div key={u.id} className="bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neutral-600 to-neutral-800 flex items-center justify-center text-sm font-medium text-white">
                  {(u.display_name ?? u.email).charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{u.display_name ?? u.email}</p>
                  <p className="text-xs text-white/40">{u.org_name ?? 'No org'} · {u.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge color={ROLE_COLORS[u.role] ?? 'gray'}>{u.role}</Badge>
                <StatusBadge status={u.status} />
              </div>
            </div>

            {/* Action buttons — only show for non-approved users */}
            {u.status !== 'approved' && (
              <div className="flex gap-2 mt-2 pt-2 border-t border-white/5">
                {u.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleAction(u.email, 'approved')}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-600/80 hover:bg-emerald-600 text-white transition-colors"
                    >
                      <UserCheck size={14} /> Approve
                    </button>
                    <button
                      onClick={() => handleAction(u.email, 'rejected')}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-neutral-600/80 hover:bg-neutral-600 text-white transition-colors"
                    >
                      <XCircle size={14} /> Reject
                    </button>
                  </>
                )}
                {u.status === 'suspended' && (
                  <button
                    onClick={() => handleAction(u.email, 'approved')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-600/80 hover:bg-emerald-600 text-white transition-colors"
                  >
                    <UserCheck size={14} /> Reinstate
                  </button>
                )}
                {u.status === 'approved' && (
                  <button
                    onClick={() => handleAction(u.email, 'suspended')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-red-600/80 hover:bg-red-600 text-white transition-colors"
                  >
                    <Ban size={14} /> Suspend
                  </button>
                )}
                {u.status === 'rejected' && (
                  <button
                    onClick={() => handleAction(u.email, 'approved')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-600/80 hover:bg-emerald-600 text-white transition-colors"
                  >
                    <UserCheck size={14} /> Re-approve
                  </button>
                )}
              </div>
            )}

            {/* Suspend button for approved users */}
            {u.status === 'approved' && u.role !== 'admin' && (
              <div className="flex gap-2 mt-2 pt-2 border-t border-white/5">
                <button
                  onClick={() => handleAction(u.email, 'suspended')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-red-600/30 hover:bg-red-600/50 text-red-300 transition-colors"
                >
                  <Ban size={14} /> Suspend
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
