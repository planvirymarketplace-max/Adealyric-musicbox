'use client';

import { useRouter } from '@/lib/router';
import { usePortalAuth } from '@/lib/auth';
import { Award, TrendingUp, ShoppingBag, Ticket, Star } from 'lucide-react';
import { formatCents, formatDate, formatDateTime } from '@/lib/format';
import { StatusBadge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { mockLoyalty, mockLoyaltyTransactions, mockShopOrders, mockTicketOrders } from '@/lib/mock-data';

const TIER_COLORS: Record<string, string> = {
  fan: 'from-neutral-600 to-neutral-800',
  silver: 'from-gray-400 to-gray-600',
  gold: 'from-amber-400 to-amber-600',
  platinum: 'from-cyan-300 to-cyan-500',
};

const TIER_THRESHOLDS = [
  { tier: 'fan', min: 0, label: 'Fan', color: 'text-white/40' },
  { tier: 'silver', min: 500, label: 'Silver', color: 'text-gray-300' },
  { tier: 'gold', min: 2000, label: 'Gold', color: 'text-amber-400' },
  { tier: 'platinum', min: 5000, label: 'Platinum', color: 'text-cyan-400' },
];

export default function PortalLoyaltyPage() {
  const { user } = usePortalAuth();
  const { navigate } = useRouter();

  if (!user) { navigate('/portal/login'); return null; }

  const loyalty = mockLoyalty;
  const tier = loyalty?.tier ?? 'fan';
  const points = loyalty?.total_points ?? 0;
  const lifetimeSpend = loyalty?.lifetime_spend ?? 0;

  const nextTier = TIER_THRESHOLDS.find((t) => t.min > points);
  const currentTierMin = TIER_THRESHOLDS.find((t) => t.min <= points)?.min ?? 0;
  const progress = nextTier ? ((points - currentTierMin) / (nextTier.min - currentTierMin)) * 100 : 100;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-3xl font-bold text-white mb-6">My Account</h1>

      {/* Loyalty card */}
      <div className={`relative rounded-2xl p-6 mb-6 bg-gradient-to-br ${TIER_COLORS[tier]} overflow-hidden`}>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-12 translate-x-12" />
        <div className="relative">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-xs uppercase tracking-wider text-white/60">Loyalty Tier</p>
              <p className="text-2xl font-bold text-white capitalize">{tier}</p>
            </div>
            <Award size={32} className="text-white/40" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-white/60">Total Points</p>
              <p className="text-xl font-bold text-white">{points.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-white/60">Lifetime Spend</p>
              <p className="text-xl font-bold text-white">{formatCents(Math.round(lifetimeSpend * 100))}</p>
            </div>
          </div>
          {nextTier && (
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs text-white/60 mb-1">
                <span>Progress to {nextTier.label}</span>
                <span>{points} / {nextTier.min}</span>
              </div>
              <div className="h-2 bg-black/20 rounded-full overflow-hidden">
                <div className="h-full bg-white/80 rounded-full transition-all" style={{ width: `${Math.min(progress, 100)}%` }} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card className="p-4 bg-white/5 border-white/10">
          <ShoppingBag size={20} className="text-white/30 mb-2" />
          <p className="text-2xl font-bold text-white">{mockShopOrders.length}</p>
          <p className="text-xs text-white/40">Shop Orders</p>
        </Card>
        <Card className="p-4 bg-white/5 border-white/10">
          <Ticket size={20} className="text-white/30 mb-2" />
          <p className="text-2xl font-bold text-white">{mockTicketOrders.length}</p>
          <p className="text-xs text-white/40">Ticket Orders</p>
        </Card>
        <Card className="p-4 bg-white/5 border-white/10">
          <TrendingUp size={20} className="text-white/30 mb-2" />
          <p className="text-2xl font-bold text-white">{mockLoyaltyTransactions.length}</p>
          <p className="text-xs text-white/40">Points Activity</p>
        </Card>
      </div>

      {/* Shop Orders */}
      <h2 className="text-xl font-semibold text-white mb-3 flex items-center gap-2"><ShoppingBag size={20} /> Shop Orders</h2>
      {mockShopOrders.length === 0 ? (
        <Card className="p-4 bg-white/5 border-white/10 mb-6"><p className="text-white/30 text-center py-2">No shop orders yet. <button onClick={() => navigate('/portal/shop')} className="text-white/50 hover:text-white underline">Browse the shop</button></p></Card>
      ) : (
        <div className="space-y-2 mb-6">
          {mockShopOrders.map((o) => (
            <div key={o.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
              <div>
                <p className="text-sm font-medium text-white">Order #{o.id.slice(0, 8)}</p>
                <p className="text-xs text-white/40">{formatDateTime(o.created_at)}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-white">{formatCents(Math.round(o.total_amount * 100))}</p>
                <StatusBadge status={o.status} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Points History */}
      <h2 className="text-xl font-semibold text-white mb-3 flex items-center gap-2"><Star size={20} /> Points History</h2>
      {mockLoyaltyTransactions.length === 0 ? (
        <Card className="p-4 bg-white/5 border-white/10"><p className="text-white/30 text-center py-2">No points activity yet</p></Card>
      ) : (
        <div className="space-y-2">
          {mockLoyaltyTransactions.map((tx) => (
            <div key={tx.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
              <div>
                <p className="text-sm text-white">{tx.reason}</p>
                <p className="text-xs text-white/40">{formatDate(tx.created_at)}</p>
              </div>
              <p className={`text-sm font-medium ${tx.direction === 'earned' ? 'text-green-400' : 'text-red-400'}`}>
                {tx.direction === 'earned' ? '+' : '−'}{tx.points}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
