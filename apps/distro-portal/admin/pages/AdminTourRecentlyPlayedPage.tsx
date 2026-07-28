'use client';

import { useState } from 'react';
import { Card, StatCard } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { PageHeader } from '@/components/layout/PageHeader';
import { toast } from '@/components/ui/Toast';
import {
  CheckCircle2, XCircle, ArrowUpRight, MapPin, Building2, CalendarDays,
  Clock, Music, Eye, EyeOff, Play, Ban, TrendingUp
} from 'lucide-react';

// ── Types ──
type ThreeStateStatus = 'play' | 'not_play' | 'coming_up';

interface CompletedEvent {
  id: string;
  name: string;
  artist: string;
  city: string;
  venue: string;
  date: string;
  time: string;
  setLength: string;
  attendance: number;
  status: ThreeStateStatus;
}

// ── Mock Data: 6 completed events with different states ──
const INITIAL_COMPLETED: CompletedEvent[] = [
  { id: 'ce-1', name: 'Midnight Echoes — Opening Night', artist: 'Adea Lyric', city: 'Philadelphia, PA', venue: 'The Fillmore Philly', date: 'Feb 10, 2026', time: '8:00 PM', setLength: '90 min', attendance: 1150, status: 'play' },
  { id: 'ce-2', name: 'Jazz Nights Winter', artist: 'Marcus Cole', city: 'New York, NY', venue: 'Blue Note', date: 'Feb 18, 2026', time: '7:30 PM', setLength: '2 sets, 60 min each', attendance: 245, status: 'play' },
  { id: 'ce-3', name: 'Velvet Strings Acoustic', artist: 'The Velvet Strings', city: 'Los Angeles, CA', venue: 'The Troubadour', date: 'Feb 22, 2026', time: '8:00 PM', setLength: '45 min', attendance: 380, status: 'not_play' },
  { id: 'ce-4', name: 'Spring Festival Warmup', artist: 'Adea Lyric', city: 'Chicago, IL', venue: 'House of Blues', date: 'Jan 28, 2026', time: '9:00 PM', setLength: '75 min', attendance: 900, status: 'play' },
  { id: 'ce-5', name: 'Marcus Cole Holiday Jazz', artist: 'Marcus Cole', city: 'Boston, MA', venue: 'Scullers Jazz Club', date: 'Dec 22, 2025', time: '7:00 PM', setLength: '2 sets, 50 min each', attendance: 180, status: 'not_play' },
  { id: 'ce-6', name: 'Luna Vega Debut Show', artist: 'Luna Vega', city: 'Austin, TX', venue: "Antone's Nightclub", date: 'Mar 1, 2026', time: '10:00 PM', setLength: '60 min', attendance: 520, status: 'coming_up' },
];

// ── State config ──
const STATE_CONFIG: Record<ThreeStateStatus, { color: string; bg: string; border: string; badgeColor: 'green' | 'gray' | 'blue'; label: string; icon: typeof CheckCircle2; description: string }> = {
  play: {
    color: 'text-green-700',
    bg: 'bg-green-50',
    border: 'border-green-200',
    badgeColor: 'green',
    label: 'Play ✓',
    icon: CheckCircle2,
    description: 'Visible on public Recently Played section',
  },
  not_play: {
    color: 'text-neutral-500',
    bg: 'bg-neutral-50',
    border: 'border-neutral-200',
    badgeColor: 'gray',
    label: 'Not Play',
    icon: XCircle,
    description: 'Record stays in admin — not shown publicly',
  },
  coming_up: {
    color: 'text-blue-700',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    badgeColor: 'blue',
    label: 'Coming Up ↑',
    icon: ArrowUpRight,
    description: 'Moves event back to Upcoming calendar',
  },
};

export function AdminTourRecentlyPlayedPage() {
  const [completedEvents, setCompletedEvents] = useState<CompletedEvent[]>(INITIAL_COMPLETED);

  // ── Stats ──
  const playCount = completedEvents.filter(e => e.status === 'play').length;
  const notPlayCount = completedEvents.filter(e => e.status === 'not_play').length;
  const comingUpCount = completedEvents.filter(e => e.status === 'coming_up').length;

  // ── Handler ──
  const handleStatusChange = (eventId: string, newStatus: ThreeStateStatus) => {
    const ev = completedEvents.find(e => e.id === eventId);
    setCompletedEvents(prev => prev.map(e =>
      e.id === eventId ? { ...e, status: newStatus } : e
    ));

    if (newStatus === 'play') {
      toast('success', `${ev?.city} — ${ev?.venue} set to Play — visible on fan website Recently Played ✓`);
    } else if (newStatus === 'not_play') {
      toast('info', `${ev?.city} — ${ev?.venue} set to Not Play — hidden from public, kept in admin`);
    } else if (newStatus === 'coming_up') {
      toast('info', `${ev?.city} — ${ev?.venue} moved back to Upcoming calendar`);
    }
  };

  return (
    <div>
      <PageHeader
        title="Recently Played"
        description="Per IA §11.2: Completed tour events with three-state control. Only 'Play' events render on the public Recently Played section. 'Coming Up' moves events back to the upcoming calendar."
        actions={
          <Badge color="green" size="md">{playCount} events on fan site</Badge>
        }
      />

      {/* ── Stats ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard
          label="Play (Published)"
          value={playCount}
          icon={<Play size={28} />}
          trend="Visible on fan site Recently Played"
        />
        <StatCard
          label="Not Play (Hidden)"
          value={notPlayCount}
          icon={<Ban size={28} />}
          trend="Record kept in admin, not shown publicly"
        />
        <StatCard
          label="Coming Up (Re-queued)"
          value={comingUpCount}
          icon={<TrendingUp size={28} />}
          trend="Moved back to upcoming calendar"
        />
      </div>

      {/* ── Explanation card ── */}
      <Card className="p-5 mb-6">
        <h3 className="font-semibold text-neutral-900 mb-3">Three-State Control Explained</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {Object.entries(STATE_CONFIG).map(([key, cfg]) => {
            const Icon = cfg.icon;
            return (
              <div key={key} className={`p-4 rounded-lg ${cfg.bg} border ${cfg.border}`}>
                <div className="flex items-center gap-2 mb-2">
                  <Icon size={16} className={cfg.color} />
                  <p className={`font-semibold text-sm ${cfg.color}`}>{cfg.label}</p>
                </div>
                <p className="text-xs text-neutral-600">{cfg.description}</p>
              </div>
            );
          })}
        </div>
      </Card>

      {/* ── Event list ── */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-neutral-900">Completed Tour Events ({completedEvents.length})</h3>
          <div className="flex items-center gap-2">
            <Badge color="green" size="sm">{playCount} Play</Badge>
            <Badge color="gray" size="sm">{notPlayCount} Not Play</Badge>
            <Badge color="blue" size="sm">{comingUpCount} Coming Up</Badge>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50">
                <th className="text-left py-3 px-4 font-medium text-neutral-500">Event</th>
                <th className="text-left py-3 px-4 font-medium text-neutral-500">Artist</th>
                <th className="text-left py-3 px-4 font-medium text-neutral-500">City</th>
                <th className="text-left py-3 px-4 font-medium text-neutral-500">Venue</th>
                <th className="text-left py-3 px-4 font-medium text-neutral-500">Date</th>
                <th className="text-left py-3 px-4 font-medium text-neutral-500">Attendance</th>
                <th className="text-left py-3 px-4 font-medium text-neutral-500">Current Status</th>
                <th className="text-left py-3 px-4 font-medium text-neutral-500">Set Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {completedEvents.map(ev => {
                const cfg = STATE_CONFIG[ev.status];
                const Icon = cfg.icon;
                return (
                  <tr key={ev.id} className={`${cfg.bg} hover:opacity-90 transition-colors`}>
                    <td className="py-3 px-4 font-medium text-neutral-900">{ev.name}</td>
                    <td className="py-3 px-4 text-neutral-600">{ev.artist}</td>
                    <td className="py-3 px-4">
                      <span className="flex items-center gap-1 text-neutral-600">
                        <MapPin size={12} className="text-neutral-400" /> {ev.city}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="flex items-center gap-1 text-neutral-600">
                        <Building2 size={12} className="text-neutral-400" /> {ev.venue}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="flex items-center gap-1 text-neutral-600">
                        <CalendarDays size={12} className="text-neutral-400" /> {ev.date}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-neutral-600">{ev.attendance.toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <Icon size={14} className={cfg.color} />
                        <Badge color={cfg.badgeColor} size="sm">{cfg.label}</Badge>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {/* Three-state radio-style toggle */}
                      <div className="flex items-center gap-1">
                        {(['play', 'not_play', 'coming_up'] as ThreeStateStatus[]).map(state => {
                          const stateCfg = STATE_CONFIG[state];
                          const StateIcon = stateCfg.icon;
                          const isActive = ev.status === state;
                          return (
                            <button
                              key={state}
                              onClick={() => handleStatusChange(ev.id, state)}
                              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                                isActive
                                  ? `${stateCfg.bg} ${stateCfg.border} ${stateCfg.color} border ring-1 ring-current`
                                  : 'bg-neutral-50 text-neutral-400 border border-transparent hover:bg-neutral-100 hover:text-neutral-600'
                              }`}
                              title={stateCfg.description}
                            >
                              <StateIcon size={12} />
                              {state === 'play' ? 'Play' : state === 'not_play' ? 'Not Play' : 'Coming Up'}
                            </button>
                          );
                        })}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* ── Public preview ── */}
        <div className="mt-6 pt-6 border-t border-neutral-200">
          <div className="flex items-center gap-2 mb-3">
            <Eye size={16} className="text-green-500" />
            <h4 className="font-semibold text-neutral-900">Public Recently Played Preview</h4>
            <Badge color="green" size="sm">{playCount} events visible</Badge>
          </div>
          <p className="text-xs text-neutral-500 mb-4">
            This is what fans will see on the public Tour page's Recently Played section. Only events set to <strong>Play</strong> are shown.
          </p>
          {playCount === 0 ? (
            <div className="p-8 text-center rounded-lg bg-neutral-50 border border-neutral-200">
              <EyeOff size={24} className="text-neutral-300 mx-auto mb-2" />
              <p className="text-sm text-neutral-500">No events currently set to Play</p>
              <p className="text-xs text-neutral-400">Set completed events to "Play" to make them visible on the fan website.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {completedEvents.filter(e => e.status === 'play').map(ev => (
                <div key={ev.id} className="p-4 rounded-lg bg-green-50 border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Music size={14} className="text-green-600" />
                    <p className="font-medium text-green-800 text-sm">{ev.artist}</p>
                  </div>
                  <p className="text-xs text-green-700 mb-1">{ev.name}</p>
                  <div className="flex items-center gap-3 text-xs text-green-600">
                    <span className="flex items-center gap-1"><MapPin size={10} /> {ev.city}</span>
                    <span className="flex items-center gap-1"><Building2 size={10} /> {ev.venue}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-green-600 mt-1">
                    <span className="flex items-center gap-1"><CalendarDays size={10} /> {ev.date}</span>
                    <span className="flex items-center gap-1"><Clock size={10} /> {ev.time}</span>
                  </div>
                  <p className="text-xs text-green-600 mt-2">Attendance: {ev.attendance.toLocaleString()}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
