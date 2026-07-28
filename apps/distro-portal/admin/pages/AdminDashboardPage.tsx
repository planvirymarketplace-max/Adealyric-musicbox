'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, StatCard } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { toast } from '@/components/ui/Toast';
import { useRouter } from '@/lib/router';
import { formatCents, timeAgo } from '@/lib/format';
import {
  DollarSign, Play, ShoppingBag, Disc3, CalendarDays, Handshake,
  AlertTriangle, FileText, Ban, Clock, Shield, Scissors,
  Coins, UserPlus, TrendingUp, TrendingDown, ArrowUpRight,
  Plus, Megaphone, Music, Package, Newspaper,
  CheckCircle2, XCircle, AlertCircle, Info, Zap, Activity,
  ExternalLink, Eye
} from 'lucide-react';

// ── KPI Data (IA §3.2: "how are we doing" layer) ──
interface KpiTile {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  trend: string;
  trendDirection: 'up' | 'down' | 'neutral';
  trendColor: string;
}

const KPI_TILES: KpiTile[] = [
  {
    label: 'Total Revenue',
    value: '$284,520',
    icon: <DollarSign size={28} />,
    trend: '+12.4% vs last month',
    trendDirection: 'up',
    trendColor: 'text-green-600',
  },
  {
    label: 'Streams',
    value: '2.4M',
    icon: <Play size={28} />,
    trend: '+8.7% vs last month',
    trendDirection: 'up',
    trendColor: 'text-green-600',
  },
  {
    label: 'Shop Revenue',
    value: '$48,320',
    icon: <ShoppingBag size={28} />,
    trend: '-2.1% vs last month',
    trendDirection: 'down',
    trendColor: 'text-red-500',
  },
  {
    label: 'Active Releases',
    value: 7,
    icon: <Disc3 size={28} />,
    trend: '2 pending distribution',
    trendDirection: 'neutral',
    trendColor: 'text-neutral-500',
  },
  {
    label: 'Upcoming Tour Dates',
    value: 12,
    icon: <CalendarDays size={28} />,
    trend: 'Next: Mar 14 — SF Fillmore',
    trendDirection: 'neutral',
    trendColor: 'text-neutral-500',
  },
  {
    label: 'Pending Sync Requests',
    value: 5,
    icon: <Handshake size={28} />,
    trend: '3 awaiting clearance',
    trendDirection: 'neutral',
    trendColor: 'text-amber-600',
  },
];

// ── Action Cards (IA §28: "what do I need to do" layer) ──
interface ActionCardData {
  label: string;
  count: number;
  icon: React.ReactNode;
  colorClass: string;       // bg color for icon container
  borderClass: string;      // border color for card
  textColor: string;        // text color for count
  route: string;            // click-through route
  description: string;
}

const ACTION_CARDS: ActionCardData[] = [
  {
    label: 'Needs Approval',
    count: 3,
    icon: <CheckCircle2 size={20} />,
    colorClass: 'bg-amber-100',
    borderClass: 'border-amber-200',
    textColor: 'text-amber-700',
    route: '/admin/distribution/queue',
    description: 'Releases awaiting approval before delivery',
  },
  {
    label: 'Metadata Errors',
    count: 7,
    icon: <AlertTriangle size={20} />,
    colorClass: 'bg-red-100',
    borderClass: 'border-red-200',
    textColor: 'text-red-700',
    route: '/admin/validation',
    description: 'Tracks/releases with validation failures',
  },
  {
    label: 'DSP Rejections',
    count: 2,
    icon: <Ban size={20} />,
    colorClass: 'bg-red-100',
    borderClass: 'border-red-200',
    textColor: 'text-red-700',
    route: '/admin/distribution',
    description: 'Deliveries rejected by DSPs — need re-delivery',
  },
  {
    label: 'Sync Requests',
    count: 5,
    icon: <Handshake size={20} />,
    colorClass: 'bg-teal-100',
    borderClass: 'border-teal-200',
    textColor: 'text-teal-700',
    route: '/admin/sync',
    description: 'Incoming sync licensing requests',
  },
  {
    label: 'Contracts Waiting',
    count: 4,
    icon: <FileText size={20} />,
    colorClass: 'bg-violet-100',
    borderClass: 'border-violet-200',
    textColor: 'text-violet-700',
    route: '/admin/artists/contracts',
    description: 'Unsigned contracts requiring action',
  },
  {
    label: 'Split Conflicts',
    count: 2,
    icon: <Scissors size={20} />,
    colorClass: 'bg-amber-100',
    borderClass: 'border-amber-200',
    textColor: 'text-amber-700',
    route: '/admin/rights/splits',
    description: 'Ownership splits with conflicting claims',
  },
  {
    label: 'Royalties Ready',
    count: 8,
    icon: <Coins size={20} />,
    colorClass: 'bg-green-100',
    borderClass: 'border-green-200',
    textColor: 'text-green-700',
    route: '/admin/royalty',
    description: 'Royalty statements ready for review/publish',
  },
  {
    label: 'Artists Awaiting Onboarding',
    count: 1,
    icon: <UserPlus size={20} />,
    colorClass: 'bg-sky-100',
    borderClass: 'border-sky-200',
    textColor: 'text-sky-700',
    route: '/admin/artists/onboarding',
    description: 'New artists needing onboarding completion',
  },
];

// ── Activity Feed (IA §3.2: single prioritized feed) ──
interface FeedEvent {
  id: string;
  type: 'error' | 'warning' | 'success' | 'info' | 'action';
  icon: React.ReactNode;
  message: string;
  detail?: string;
  timestamp: string;
  route?: string;
}

const FEED_EVENTS: FeedEvent[] = [
  {
    id: 'fe-1',
    type: 'error',
    icon: <XCircle size={16} className="text-red-500" />,
    message: 'Distribution failed: Midnight Echoes → Apple Music',
    detail: 'Metadata validation error — ISRC code mismatch on track 3',
    timestamp: '2025-03-12T14:32:00',
    route: '/admin/distribution',
  },
  {
    id: 'fe-2',
    type: 'warning',
    icon: <AlertTriangle size={16} className="text-amber-500" />,
    message: 'Low inventory: Midnight Echoes vinyl',
    detail: 'Only 18 units remaining — reorder threshold is 50',
    timestamp: '2025-03-12T11:05:00',
    route: '/admin/shop/inventory',
  },
  {
    id: 'fe-3',
    type: 'action',
    icon: <Handshake size={16} className="text-teal-500" />,
    message: 'Sync request from Netflix',
    detail: 'Licensing inquiry for "Electric Dusk" — TV series placement',
    timestamp: '2025-03-12T09:20:00',
    route: '/admin/sync',
  },
  {
    id: 'fe-4',
    type: 'success',
    icon: <CheckCircle2 size={16} className="text-green-500" />,
    message: 'Artist accepted invite: Luna Vega → A&R Workspace',
    detail: 'Onboarding checklist sent',
    timestamp: '2025-03-12T08:45:00',
    route: '/admin/artists/onboarding',
  },
  {
    id: 'fe-5',
    type: 'error',
    icon: <Ban size={16} className="text-red-500" />,
    message: 'DSP rejection: Neon Waves → Spotify',
    detail: 'Artwork resolution below minimum — needs 3000×3000px',
    timestamp: '2025-03-11T22:15:00',
    route: '/admin/distribution',
  },
  {
    id: 'fe-6',
    type: 'info',
    icon: <Info size={16} className="text-blue-500" />,
    message: 'Expiring license: Kai Horizon sync deal',
    detail: 'License expires Apr 1 — 19 days remaining',
    timestamp: '2025-03-11T18:30:00',
    route: '/admin/licensing',
  },
  {
    id: 'fe-7',
    type: 'warning',
    icon: <AlertCircle size={16} className="text-amber-500" />,
    message: 'Split conflict: Track "Velvet Sunrise"',
    detail: 'Two conflicting ownership claims — producer vs. songwriter',
    timestamp: '2025-03-11T16:00:00',
    route: '/admin/rights/splits',
  },
  {
    id: 'fe-8',
    type: 'success',
    icon: <Coins size={16} className="text-green-500" />,
    message: 'Royalty statement ready: Q1 2025',
    detail: '8 statements ready for artist review and publishing',
    timestamp: '2025-03-11T12:00:00',
    route: '/admin/royalty',
  },
  {
    id: 'fe-9',
    type: 'action',
    icon: <Shield size={16} className="text-violet-500" />,
    message: 'Contract awaiting signature: Marcus Cole',
    detail: 'Exclusive recording agreement — sent Mar 8, no response',
    timestamp: '2025-03-10T14:00:00',
    route: '/admin/artists/contracts',
  },
  {
    id: 'fe-10',
    type: 'info',
    icon: <Zap size={16} className="text-blue-500" />,
    message: 'New tour inquiry: Greek Theatre, Los Angeles',
    detail: 'Hold request for Apr 28 — $12k guarantee',
    timestamp: '2025-03-10T10:30:00',
    route: '/admin/tour/bookings',
  },
  {
    id: 'fe-11',
    type: 'success',
    icon: <Activity size={16} className="text-green-500" />,
    message: 'Distribution delivered: Luna Vega → Amazon Music',
    detail: 'All 12 tracks accepted and live',
    timestamp: '2025-03-09T20:00:00',
    route: '/admin/distribution',
  },
  {
    id: 'fe-12',
    type: 'warning',
    icon: <AlertTriangle size={16} className="text-amber-500" />,
    message: 'Metadata error: Neon Waves — missing UPC',
    detail: 'Release-level UPC code is blank — blocks distribution',
    timestamp: '2025-03-09T15:20:00',
    route: '/admin/validation',
  },
];

const typeBgColors: Record<string, string> = {
  error:   'bg-red-50',
  warning: 'bg-amber-50',
  success: 'bg-green-50',
  info:    'bg-blue-50',
  action:  'bg-teal-50',
};

// ── Quick Actions ──
const QUICK_ACTIONS = [
  { label: 'New Release', icon: <Music size={16} />, route: '/admin/discography/new-release', color: 'bg-violet-100 text-violet-700' },
  { label: 'New Blog Post', icon: <Newspaper size={16} />, route: '/admin/cms/blog', color: 'bg-emerald-100 text-emerald-700' },
  { label: 'New Tour Date', icon: <CalendarDays size={16} />, route: '/admin/tour/new-tour-date', color: 'bg-amber-100 text-amber-700' },
  { label: 'New Product', icon: <Package size={16} />, route: '/admin/shop/catalog/new', color: 'bg-teal-100 text-teal-700' },
];

export function AdminDashboardPage() {
  const { navigate } = useRouter();
  const [feedFilter, setFeedFilter] = useState<string>('all');

  const filteredFeed = feedFilter === 'all'
    ? FEED_EVENTS
    : FEED_EVENTS.filter(e => e.type === feedFilter);

  const totalActions = ACTION_CARDS.reduce((sum, c) => sum + c.count, 0);

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Single landing screen — what needs attention today (IA §3.2 + §28)"
        actions={
          <div className="flex items-center gap-2">
            <Badge color="amber" size="md">{totalActions} actions needed</Badge>
          </div>
        }
      />

      {/* ══════════════════════════════════════════════════════════════
          LAYER 1: KPI TILES — "how are we doing"
          IA §3.2: Cross-portal KPI summary
      ══════════════════════════════════════════════════════════════ */}
      <div className="mb-2">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={16} className="text-green-500" />
          <h2 className="text-sm font-semibold text-neutral-900 uppercase tracking-wide">Performance Metrics</h2>
          <span className="text-xs text-neutral-400">— how are we doing</span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {KPI_TILES.map(kpi => (
          <Card key={kpi.label} className="p-4">
            <div className="flex items-start justify-between mb-1">
              <div className="text-neutral-300">{kpi.icon}</div>
              <div className={`flex items-center gap-0.5 text-xs font-medium ${
                kpi.trendDirection === 'up' ? 'text-green-600'
                  : kpi.trendDirection === 'down' ? 'text-red-500'
                  : 'text-neutral-500'
              }`}>
                {kpi.trendDirection === 'up' && <TrendingUp size={12} />}
                {kpi.trendDirection === 'down' && <TrendingDown size={12} />}
                {kpi.trendDirection === 'neutral' && <Activity size={12} />}
              </div>
            </div>
            <p className="text-2xl font-bold text-neutral-900">{kpi.value}</p>
            <p className="text-xs text-neutral-500 mt-0.5">{kpi.label}</p>
            <p className={`text-[10px] mt-1 ${kpi.trendColor}`}>{kpi.trend}</p>
          </Card>
        ))}
      </div>

      {/* ══════════════════════════════════════════════════════════════
          LAYER 2: ACTION CARDS — "what do I need to do"
          IA §28: Dashboard Action Cards — things needing a decision
      ══════════════════════════════════════════════════════════════ */}
      <div className="mb-2">
        <div className="flex items-center gap-2 mb-4">
          <Zap size={16} className="text-amber-500" />
          <h2 className="text-sm font-semibold text-neutral-900 uppercase tracking-wide">Action Items</h2>
          <span className="text-xs text-neutral-400">— what do I need to do</span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
        {ACTION_CARDS.map(card => (
          <Card
            key={card.label}
            className={`p-4 cursor-pointer hover:shadow-md transition-shadow border ${card.borderClass}`}
            onClick={() => navigate(card.route)}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${card.colorClass}`}>
                {card.icon}
              </div>
              <div>
                <p className="text-xs text-neutral-500">{card.label}</p>
                <p className={`text-xl font-bold ${card.textColor}`}>{card.count}</p>
              </div>
            </div>
            <p className="text-xs text-neutral-600 mb-3">{card.description}</p>
            <div className="flex items-center gap-1 text-xs font-medium text-neutral-400 hover:text-neutral-600 transition-colors">
              <ArrowUpRight size={12} />
              <span>View list</span>
            </div>
          </Card>
        ))}
      </div>

      {/* ══════════════════════════════════════════════════════════════
          LAYER 3: ACTIVITY FEED — single prioritized feed
          IA §3.2: "not separate feeds per module so nothing gets buried"
      ══════════════════════════════════════════════════════════════ */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Activity size={16} className="text-neutral-500" />
            <h3 className="font-semibold text-neutral-900">Activity Feed</h3>
            <Badge color="gray" size="sm">{FEED_EVENTS.length} events</Badge>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={feedFilter}
              onChange={e => setFeedFilter(e.target.value)}
              className="bg-white border border-neutral-200 text-neutral-700 rounded-lg px-2 py-1 text-xs"
            >
              <option value="all">All types</option>
              <option value="error">Errors</option>
              <option value="warning">Warnings</option>
              <option value="action">Action needed</option>
              <option value="success">Completed</option>
              <option value="info">Info</option>
            </select>
          </div>
        </div>

        <p className="text-xs text-neutral-500 mb-4">
          Per IA §3.2: Single prioritized feed — errors and action items at the top, successes and info below.
          Nothing requiring action gets buried in a separate module feed.
        </p>

        <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
          {filteredFeed.map(event => (
            <button
              key={event.id}
              onClick={() => event.route && navigate(event.route)}
              className={`flex items-start gap-3 p-3 rounded-lg border border-neutral-100 w-full text-left transition-all hover:shadow-sm ${typeBgColors[event.type]}`}
            >
              {/* Icon */}
              <div className="flex-shrink-0 mt-0.5">{event.icon}</div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-neutral-900">{event.message}</p>
                {event.detail && (
                  <p className="text-xs text-neutral-500 mt-0.5 truncate">{event.detail}</p>
                )}
              </div>

              {/* Timestamp + link */}
              <div className="flex-shrink-0 flex flex-col items-end gap-1">
                <span className="text-xs text-neutral-400 whitespace-nowrap">{timeAgo(event.timestamp)}</span>
                {event.route && (
                  <span className="text-xs text-neutral-400 flex items-center gap-0.5">
                    <ArrowUpRight size={10} />
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>

        {filteredFeed.length === 0 && (
          <div className="flex items-center justify-center py-8 text-neutral-400 text-sm">
            No events matching this filter
          </div>
        )}
      </Card>

      {/* ══════════════════════════════════════════════════════════════
          LAYER 4: QUICK ACTIONS — IA §3.2
      ══════════════════════════════════════════════════════════════ */}
      <div className="mt-6">
        <div className="flex items-center gap-2 mb-4">
          <Plus size={16} className="text-neutral-500" />
          <h2 className="text-sm font-semibold text-neutral-900 uppercase tracking-wide">Quick Actions</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {QUICK_ACTIONS.map(action => (
            <Card
              key={action.label}
              className="p-4 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => navigate(action.route)}
            >
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${action.color}`}>
                  {action.icon}
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-900">{action.label}</p>
                  <p className="text-xs text-neutral-400">Create new</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
