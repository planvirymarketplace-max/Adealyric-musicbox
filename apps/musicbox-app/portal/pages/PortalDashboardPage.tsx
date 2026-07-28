'use client';

import { useRouter } from '@/lib/router';
import { usePortalAuth } from '@/lib/auth';
import { Ticket, Heart, Mail, MapPin } from 'lucide-react';
import { formatCents, formatDate, formatDateTime } from '@/lib/format';
import { StatusBadge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { mockTicketOrders, mockTicketEvents, mockTicketTiers, mockFanProfiles } from '@/lib/mock-data';

export default function PortalDashboardPage() {
  const { user } = usePortalAuth();
  const { navigate } = useRouter();

  if (!user) { navigate('/portal/login'); return null; }

  const profile = mockFanProfiles.find((p) => p.user_id === user.id);

  const orders = mockTicketOrders.filter((o) => o.user_id === user.id || o.fan_email === user.email).map((o) => ({
    ...o,
    event: mockTicketEvents.find((e) => e.id === o.event_id),
    tier: mockTicketTiers.find((t) => t.id === o.tier_id),
  }));

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-3xl font-bold text-white mb-6">My Dashboard</h1>

      {/* Profile summary */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-5 mb-6">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-neutral-600 to-neutral-800 flex items-center justify-center text-white text-xl font-medium">
            {(profile?.display_name ?? profile?.email ?? user.email).charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-lg font-semibold text-white">{profile?.display_name ?? 'Fan'}</p>
            <p className="text-sm text-white/50 flex items-center gap-1"><Mail size={12} /> {profile?.email ?? user.email}</p>
            {(profile?.city || profile?.state) && <p className="text-sm text-white/50 flex items-center gap-1 mt-0.5"><MapPin size={12} /> {profile?.city}{profile?.city && profile?.state ? ', ' : ''}{profile?.state}</p>}
          </div>
        </div>
      </div>

      {/* Tickets */}
      <h2 className="text-xl font-semibold text-white mb-3 flex items-center gap-2"><Ticket size={20} /> My Tickets</h2>
      {orders.length === 0 ? (
        <Card className="p-6 bg-white/5 border-white/10">
          <p className="text-white/30 text-center py-4">No tickets yet. <button onClick={() => navigate('/portal/events')} className="text-white/50 hover:text-white underline">Browse events</button></p>
        </Card>
      ) : (
        <div className="space-y-3 mb-8">
          {orders.map((o) => (
            <div key={o.id} className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-white">{o.event?.title ?? 'Event'}</p>
                <p className="text-xs text-white/50">{formatDate(o.event?.event_date)} · {o.tier?.name ?? 'Ticket'} × {o.quantity}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-white">{formatCents(o.total_cents)}</p>
                <StatusBadge status={o.status} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Favorites placeholder */}
      <h2 className="text-xl font-semibold text-white mb-3 flex items-center gap-2"><Heart size={20} /> Favorites</h2>
      <Card className="p-6 bg-white/5 border-white/10">
        <p className="text-white/30 text-center py-4">No favorites yet. <button onClick={() => navigate('/portal/events')} className="text-white/50 hover:text-white underline">Browse events</button></p>
      </Card>
    </div>
  );
}
