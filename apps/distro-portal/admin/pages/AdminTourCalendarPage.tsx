'use client';

import { useState } from 'react';
import { Card, StatCard } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { PageHeader } from '@/components/layout/PageHeader';
import { toast } from '@/components/ui/Toast';
import {
  CalendarDays, ChevronLeft, ChevronRight, Plus, Eye, EyeOff,
  MapPin, Clock, Building2, CheckCircle2, List, LayoutGrid,
  AlertTriangle, Image as ImageIcon, ToggleLeft, ToggleRight
} from 'lucide-react';

// ── Types ──
interface TourEvent {
  id: string;
  name: string;
  artist: string;
  city: string;
  venue: string;
  venueAddress: string;
  venueImage: string | null;
  date: string;
  time: string;
  status: 'confirmed' | 'hold' | 'cancelled';
  publishedToTour: boolean;
  isPast: boolean;
  completed: boolean;
}

// ── Mock Data: 10 events spanning current + next month, some past ──
const INITIAL_EVENTS: TourEvent[] = [
  // Past events (for Mark Complete)
  { id: 'ev-1', name: 'Midnight Echoes — Opening Night', artist: 'Adea Lyric', city: 'Philadelphia, PA', venue: 'The Fillmore Philly', venueAddress: '29 W College Ave, Philadelphia, PA 19144', venueImage: 'https://placehold.co/400x250/222/fff?text=Fillmore+Philly', date: '2026-02-10', time: '8:00 PM', status: 'confirmed', publishedToTour: false, isPast: true, completed: false },
  { id: 'ev-2', name: 'Jazz Nights Winter', artist: 'Marcus Cole', city: 'New York, NY', venue: 'Blue Note', venueAddress: '131 W 3rd St, New York, NY 10012', venueImage: 'https://placehold.co/400x250/222/fff?text=Blue+Note', date: '2026-02-18', time: '7:30 PM', status: 'confirmed', publishedToTour: false, isPast: true, completed: false },
  { id: 'ev-3', name: 'Velvet Strings Acoustic', artist: 'The Velvet Strings', city: 'Los Angeles, CA', venue: 'The Troubadour', venueAddress: '268 Santa Monica Blvd, Los Angeles, CA 90046', venueImage: null, date: '2026-02-22', time: '8:00 PM', status: 'confirmed', publishedToTour: false, isPast: true, completed: false },
  // Current month events
  { id: 'ev-4', name: 'Midnight Echoes Tour', artist: 'Adea Lyric', city: 'San Francisco, CA', venue: 'The Fillmore', venueAddress: '1805 Geary Blvd, San Francisco, CA 94115', venueImage: 'https://placehold.co/400x250/222/fff?text=The+Fillmore', date: '2026-03-14', time: '8:00 PM', status: 'confirmed', publishedToTour: true, isPast: false, completed: false },
  { id: 'ev-5', name: 'Urban Frequencies Preview', artist: 'Adea Lyric', city: 'New York, NY', venue: 'Terminal 5', venueAddress: '610 W 56th St, New York, NY 10019', venueImage: 'https://placehold.co/400x250/222/fff?text=Terminal+5', date: '2026-03-22', time: '9:00 PM', status: 'confirmed', publishedToTour: true, isPast: false, completed: false },
  { id: 'ev-6', name: 'Jazz Nights Series', artist: 'Marcus Cole', city: 'New York, NY', venue: 'Blue Note', venueAddress: '131 W 3rd St, New York, NY 10012', venueImage: 'https://placehold.co/400x250/222/fff?text=Blue+Note', date: '2026-03-08', time: '7:30 PM', status: 'confirmed', publishedToTour: false, isPast: false, completed: false },
  { id: 'ev-7', name: 'Spring Festival', artist: 'Adea Lyric', city: 'Los Angeles, CA', venue: 'Greek Theatre', venueAddress: '2700 N Vermont Ave, Los Angeles, CA 90027', venueImage: 'https://placehold.co/400x250/222/fff?text=Greek+Theatre', date: '2026-03-28', time: '7:00 PM', status: 'hold', publishedToTour: false, isPast: false, completed: false },
  // Next month events
  { id: 'ev-8', name: 'Neon Dreams Release Party', artist: 'Adea Lyric', city: 'New York, NY', venue: 'Webster Hall', venueAddress: '125 E 11th St, New York, NY 10003', venueImage: 'https://placehold.co/400x250/222/fff?text=Webster+Hall', date: '2026-04-01', time: '10:00 PM', status: 'cancelled', publishedToTour: false, isPast: false, completed: false },
  { id: 'ev-9', name: 'Marcus Cole Trio Night', artist: 'Marcus Cole', city: 'San Francisco, CA', venue: 'SFJAZZ Center', venueAddress: '201 Franklin St, San Francisco, CA 94102', venueImage: 'https://placehold.co/400x250/222/fff?text=SFJAZZ', date: '2026-04-12', time: '8:00 PM', status: 'confirmed', publishedToTour: true, isPast: false, completed: false },
  { id: 'ev-10', name: 'Luna Vega Showcase', artist: 'Luna Vega', city: 'Los Angeles, CA', venue: 'The Roxy', venueAddress: '9009 Sunset Blvd, Los Angeles, CA 90069', venueImage: null, date: '2026-04-05', time: '9:00 PM', status: 'hold', publishedToTour: false, isPast: false, completed: false },
];

// ── Required fields for publish ──
const REQUIRED_PUBLISH_FIELDS = ['city', 'date', 'time', 'venue', 'venueAddress', 'venueImage'] as const;

function canPublish(ev: TourEvent): boolean {
  return REQUIRED_PUBLISH_FIELDS.every(field => {
    const val = ev[field];
    return val !== null && val !== '' && val !== undefined;
  });
}

function missingFields(ev: TourEvent): string[] {
  return REQUIRED_PUBLISH_FIELDS.filter(field => {
    const val = ev[field];
    return val === null || val === '' || val === undefined;
  }).map(f => f === 'venue' ? 'venue name' : f === 'venueImage' ? 'venue image' : f);
}

export function AdminTourCalendarPage() {
  const [events, setEvents] = useState<TourEvent[]>(INITIAL_EVENTS);
  const [currentMonth, setCurrentMonth] = useState(2); // March (0-indexed)
  const [currentYear, setCurrentYear] = useState(2026);
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  // ── Calendar logic ──
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();

  const monthEvents = events.filter(e => {
    const d = new Date(e.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear && !e.completed;
  });

  const calendarDays: (number | null)[] = [];
  for (let i = 0; i < firstDayOfWeek; i++) calendarDays.push(null);
  for (let d = 1; d <= daysInMonth; d++) calendarDays.push(d);
  while (calendarDays.length % 7 !== 0) calendarDays.push(null);

  const prevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(currentYear - 1); }
    else setCurrentMonth(currentMonth - 1);
  };
  const nextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(currentYear + 1); }
    else setCurrentMonth(currentMonth + 1);
  };

  // ── Stats ──
  const upcomingCount = events.filter(e => !e.isPast && !e.completed).length;
  const pastCount = events.filter(e => e.isPast && !e.completed).length;
  const publishedCount = events.filter(e => e.publishedToTour).length;

  // ── Handlers ──
  const handleTogglePublish = (eventId: string) => {
    const ev = events.find(e => e.id === eventId);
    if (!ev) return;

    if (!ev.publishedToTour && !canPublish(ev)) {
      const missing = missingFields(ev);
      toast('error', `Cannot publish — missing: ${missing.join(', ')}`);
      return;
    }

    setEvents(prev => prev.map(e =>
      e.id === eventId ? { ...e, publishedToTour: !e.publishedToTour } : e
    ));
    toast(ev.publishedToTour ? 'info' : 'success', ev.publishedToTour ? 'Unpublished from Tour Page' : 'Published to Tour Page ✓');
  };

  const handleMarkComplete = (eventId: string) => {
    setEvents(prev => prev.map(e =>
      e.id === eventId ? { ...e, completed: true, publishedToTour: false } : e
    ));
    const ev = events.find(e => e.id === eventId);
    toast('success', `${ev?.city} — ${ev?.venue} moved to Recently Played`);
  };

  const statusConfig: Record<string, { color: 'green' | 'amber' | 'red'; label: string }> = {
    confirmed: { color: 'green', label: 'Confirmed' },
    hold: { color: 'amber', label: 'Hold' },
    cancelled: { color: 'red', label: 'Cancelled' },
  };

  return (
    <div>
      <PageHeader
        title="Tour Calendar"
        description="Calendar view with Publish to Tour Page toggle per event. Past events can be marked complete and moved to Recently Played."
        actions={
          <>
            <Button variant="secondary" size="sm" onClick={() => setViewMode(viewMode === 'calendar' ? 'list' : 'calendar')}>
              {viewMode === 'calendar' ? <List size={16} /> : <LayoutGrid size={16} />}
              {viewMode === 'calendar' ? 'List View' : 'Calendar View'}
            </Button>
            <Button variant="primary" size="sm" onClick={() => toast('info', 'New Tour Date form coming soon')}>
              <Plus size={16} /> New Tour Date
            </Button>
          </>
        }
      />

      {/* ── Stats ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard label="Upcoming Events" value={upcomingCount} icon={<CalendarDays size={28} />} trend="Active calendar dates" />
        <StatCard label="Past / Uncompleted" value={pastCount} icon={<Clock size={28} />} trend="Ready for Mark Complete" />
        <StatCard label="Published to Tour" value={publishedCount} icon={<Eye size={28} />} trend="Visible on fan site" />
      </div>

      {/* ── Past Events Section (Mark Complete) ── */}
      {events.filter(e => e.isPast && !e.completed).length > 0 && (
        <Card className="p-5 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle size={16} className="text-amber-500" />
            <h3 className="font-semibold text-neutral-900">Past Events — Mark Complete</h3>
            <Badge color="amber" size="sm">{events.filter(e => e.isPast && !e.completed).length} uncompleted</Badge>
          </div>
          <p className="text-xs text-neutral-500 mb-4">
            These events have passed their date. Click <strong>Mark Complete</strong> to move them into the Recently Played queue where you can set their Play / Not Play / Coming Up status.
          </p>
          <div className="space-y-3">
            {events.filter(e => e.isPast && !e.completed).map(ev => {
              const missing = missingFields(ev);
              return (
                <div key={ev.id} className="flex items-center justify-between p-4 rounded-lg bg-amber-50 border border-amber-200">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-neutral-900 text-sm">{ev.name}</p>
                      <Badge color={statusConfig[ev.status]?.color ?? 'gray'} size="sm">{statusConfig[ev.status]?.label ?? ev.status}</Badge>
                      {missing.length > 0 && (
                        <Badge color="red" size="sm">Missing: {missing.join(', ')}</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-xs text-neutral-600">
                      <span className="flex items-center gap-1"><MapPin size={12} /> {ev.city}</span>
                      <span className="flex items-center gap-1"><Building2 size={12} /> {ev.venue}</span>
                      <span>{ev.date} · {ev.time}</span>
                    </div>
                  </div>
                  <Button variant="primary" size="sm" onClick={() => handleMarkComplete(ev.id)}>
                    <CheckCircle2 size={14} /> Mark Complete
                  </Button>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* ── Calendar View ── */}
      {viewMode === 'calendar' && (
        <Card className="p-5">
          {/* Month navigation */}
          <div className="flex items-center justify-between mb-4">
            <Button variant="ghost" size="sm" onClick={prevMonth}><ChevronLeft size={16} /></Button>
            <h3 className="text-lg font-semibold text-neutral-900">{monthNames[currentMonth]} {currentYear}</h3>
            <Button variant="ghost" size="sm" onClick={nextMonth}><ChevronRight size={16} /></Button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 gap-1 mb-1">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-xs font-medium text-neutral-400 py-2">{day}</div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, i) => {
              const dayEvents = day
                ? monthEvents.filter(e => new Date(e.date).getDate() === day)
                : [];
              return (
                <div
                  key={i}
                  className={`min-h-[90px] p-2 rounded-lg border transition-colors ${
                    day ? 'bg-white border-neutral-200 hover:border-neutral-300' : 'bg-neutral-50 border-transparent'
                  } ${day && dayEvents.length > 0 ? 'border-neutral-300' : ''}`}
                >
                  {day && (
                    <>
                      <p className="text-xs font-medium text-neutral-500 mb-1">{day}</p>
                      <div className="space-y-1">
                        {dayEvents.map(ev => (
                          <div
                            key={ev.id}
                            className={`p-1.5 rounded text-xs cursor-pointer transition-all ${
                              ev.publishedToTour
                                ? 'bg-green-100 border border-green-300 text-green-800'
                                : ev.status === 'cancelled'
                                  ? 'bg-red-50 border border-red-200 text-red-700'
                                  : ev.status === 'hold'
                                    ? 'bg-amber-50 border border-amber-200 text-amber-800'
                                    : 'bg-neutral-50 border border-neutral-200 text-neutral-700'
                            }`}
                          >
                            <p className="font-medium truncate">{ev.artist}</p>
                            <p className="truncate">{ev.city}</p>
                            <p className="truncate text-[10px]">{ev.time}</p>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* ── List View ── */}
      {viewMode === 'list' && (
        <Card className="p-5">
          <h3 className="font-semibold text-neutral-900 mb-4">
            Tour Events — {monthNames[currentMonth]} {currentYear}
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-200">
                  <th className="text-left py-2 px-3 font-medium text-neutral-500">Event</th>
                  <th className="text-left py-2 px-3 font-medium text-neutral-500">Artist</th>
                  <th className="text-left py-2 px-3 font-medium text-neutral-500">City</th>
                  <th className="text-left py-2 px-3 font-medium text-neutral-500">Venue</th>
                  <th className="text-left py-2 px-3 font-medium text-neutral-500">Date</th>
                  <th className="text-left py-2 px-3 font-medium text-neutral-500">Time</th>
                  <th className="text-left py-2 px-3 font-medium text-neutral-500">Status</th>
                  <th className="text-left py-2 px-3 font-medium text-neutral-500">Publish</th>
                </tr>
              </thead>
              <tbody>
                {events.filter(e => !e.completed).map(ev => {
                  const canBePublished = canPublish(ev);
                  const missing = missingFields(ev);
                  return (
                    <tr key={ev.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                      <td className="py-2 px-3 font-medium text-neutral-900">{ev.name}</td>
                      <td className="py-2 px-3 text-neutral-600">{ev.artist}</td>
                      <td className="py-2 px-3 text-neutral-600">{ev.city}</td>
                      <td className="py-2 px-3 text-neutral-600">{ev.venue}</td>
                      <td className="py-2 px-3 text-neutral-600">{ev.date}</td>
                      <td className="py-2 px-3 text-neutral-600">{ev.time}</td>
                      <td className="py-2 px-3">
                        <Badge color={statusConfig[ev.status]?.color ?? 'gray'}>
                          {statusConfig[ev.status]?.label ?? ev.status}
                        </Badge>
                      </td>
                      <td className="py-2 px-3">
                        <button
                          onClick={() => handleTogglePublish(ev.id)}
                          disabled={!canBePublished && !ev.publishedToTour}
                          className={`flex items-center gap-1.5 text-xs font-medium transition-all rounded-lg px-3 py-1.5 ${
                            ev.publishedToTour
                              ? 'bg-green-100 text-green-700 hover:bg-green-200'
                              : canBePublished
                                ? 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200'
                                : 'bg-neutral-50 text-neutral-300 cursor-not-allowed'
                          }`}
                          title={!canBePublished && !ev.publishedToTour ? `Missing: ${missing.join(', ')}` : ''}
                        >
                          {ev.publishedToTour ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                          {ev.publishedToTour ? 'ON' : 'OFF'}
                        </button>
                        {!canBePublished && !ev.publishedToTour && (
                          <p className="text-[10px] text-red-500 mt-0.5">Missing: {missing.join(', ')}</p>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* ── Event Detail Cards with Publish Toggle ── */}
      <Card className="p-5">
        <h3 className="font-semibold text-neutral-900 mb-2">All Upcoming Events — Publish Control</h3>
        <p className="text-xs text-neutral-500 mb-4">
          Per IA §11.1: Toggle <strong>Publish to Tour Page</strong> to make an event visible on the public Tour page.
          Required fields before toggling ON: city, date, time, venue name, venue address, venue image.
        </p>
        <div className="space-y-3 max-h-[500px] overflow-y-auto">
          {events.filter(e => !e.isPast && !e.completed).map(ev => {
            const canBePublished = canPublish(ev);
            const missing = missingFields(ev);
            return (
              <div key={ev.id} className={`p-4 rounded-lg border transition-all ${
                ev.publishedToTour
                  ? 'bg-green-50 border-green-200'
                  : ev.status === 'cancelled'
                    ? 'bg-red-50 border-red-200'
                    : 'bg-white border-neutral-200'
              }`}>
                <div className="flex items-start justify-between gap-4">
                  {/* Left: event info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <p className="font-semibold text-neutral-900">{ev.name}</p>
                      <Badge color={statusConfig[ev.status]?.color ?? 'gray'} size="sm">{statusConfig[ev.status]?.label ?? ev.status}</Badge>
                      {ev.publishedToTour && <Badge color="green" size="sm">Published ✓</Badge>}
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1 text-sm text-neutral-600">
                      <span className="flex items-center gap-1"><MapPin size={14} className="text-neutral-400" /> {ev.city}</span>
                      <span className="flex items-center gap-1"><Building2 size={14} className="text-neutral-400" /> {ev.venue}</span>
                      <span className="flex items-center gap-1"><Clock size={14} className="text-neutral-400" /> {ev.time}</span>
                      <span className="flex items-center gap-1"><CalendarDays size={14} className="text-neutral-400" /> {ev.date}</span>
                      <span className="text-xs">{ev.venueAddress}</span>
                      <span className="flex items-center gap-1">
                        {ev.venueImage ? <ImageIcon size={14} className="text-green-500" /> : <ImageIcon size={14} className="text-red-400" />}
                        <span className={ev.venueImage ? 'text-green-600' : 'text-red-500'}>{ev.venueImage ? 'Image ✓' : 'No image'}</span>
                      </span>
                    </div>
                    {!canBePublished && !ev.publishedToTour && (
                      <div className="mt-2 p-2 rounded bg-red-50 border border-red-200">
                        <p className="text-xs text-red-600 font-medium">
                          Cannot publish — missing: {missing.join(', ')}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Right: publish toggle */}
                  <div className="flex flex-col items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleTogglePublish(ev.id)}
                      disabled={!canBePublished && !ev.publishedToTour}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                        ev.publishedToTour
                          ? 'bg-green-600 text-white hover:bg-green-700'
                          : canBePublished
                            ? 'bg-neutral-900 text-white hover:bg-neutral-800'
                            : 'bg-neutral-100 text-neutral-300 cursor-not-allowed'
                      }`}
                      title={!canBePublished && !ev.publishedToTour ? `Missing: ${missing.join(', ')}` : ''}
                    >
                      {ev.publishedToTour ? <Eye size={16} /> : <EyeOff size={16} />}
                      {ev.publishedToTour ? 'Published' : 'Publish'}
                    </button>
                    {ev.publishedToTour && (
                      <span className="text-xs text-green-600 font-medium">Visible on Tour Page</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
