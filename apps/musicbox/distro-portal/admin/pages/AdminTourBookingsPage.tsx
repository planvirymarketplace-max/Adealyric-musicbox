'use client';

import { useState } from 'react';
import { Card, StatCard } from '@/components/ui/Card';
import { Badge, StatusBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { PageHeader } from '@/components/layout/PageHeader';
import { toast } from '@/components/ui/Toast';
import {
  Inbox, MessageSquare, Send, CheckCircle2, DollarSign, Flag,
  CalendarDays, MapPin, Building2, Users, Clock, Plus, List,
  Columns3, ChevronRight, ExternalLink, Phone, Mail, FileText,
  ArrowRight
} from 'lucide-react';

// ── Types ──
type BookingStatus = 'new_inquiry' | 'contacted' | 'offer_sent' | 'confirmed' | 'deposit_paid' | 'completed';

interface BookingRequest {
  id: string;
  artist: string;
  venue: string;
  city: string;
  date: string;
  fee: string;
  feeCents: number;
  status: BookingStatus;
  promoter: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  notes: string;
}

// ── Mock Data: 8 booking requests across different stages ──
const INITIAL_BOOKINGS: BookingRequest[] = [
  { id: 'bk-1', artist: 'Adea Lyric', venue: 'The Fillmore', city: 'San Francisco, CA', date: '2026-04-18', fee: '$15,000', feeCents: 1500000, status: 'new_inquiry', promoter: 'Live Nation West', contactName: 'Sarah Chen', contactEmail: 'schen@livenation.com', contactPhone: '(415) 555-1234', notes: 'Initial inquiry for SF stop on spring tour. Awaiting artist availability confirmation.' },
  { id: 'bk-2', artist: 'Adea Lyric', venue: 'Greek Theatre', city: 'Los Angeles, CA', date: '2026-05-02', fee: '$45,000', feeCents: 4500000, status: 'new_inquiry', promoter: 'AEG Presents', contactName: 'Mike Rodriguez', contactEmail: 'mrodriguez@aeg.com', contactPhone: '(310) 555-5678', notes: 'Large outdoor show proposal. Need to coordinate with merch team for venue restrictions.' },
  { id: 'bk-3', artist: 'Marcus Cole', venue: 'Terminal 5', city: 'New York, NY', date: '2026-04-25', fee: '$20,000', feeCents: 2000000, status: 'contacted', promoter: 'Independence Productions', contactName: 'Lisa Park', contactEmail: 'lisa@indeprod.com', contactPhone: '(212) 555-9012', notes: 'Jazz crossover night. Interested in 2-set format. Reached out — awaiting response.' },
  { id: 'bk-4', artist: 'Marcus Cole', venue: 'Blue Note', city: 'New York, NY', date: '2026-03-08', fee: '$5,000', feeCents: 500000, status: 'offer_sent', promoter: 'Blue Note NYC', contactName: 'Jazz Booking Desk', contactEmail: 'booking@bluenotejazz.com', contactPhone: '(212) 555-3456', notes: 'Counter offer sent: $7,500 + 2 nights instead of 1. Promoter reviewing revised terms.' },
  { id: 'bk-5', artist: 'The Velvet Strings', venue: 'The Troubadour', city: 'Los Angeles, CA', date: '2026-03-15', fee: '$8,000', feeCents: 800000, status: 'offer_sent', promoter: 'Troubadour Booking', contactName: 'Booking Team', contactEmail: 'booking@troubadour.com', contactPhone: '(310) 555-7890', notes: 'Offer sent with added sound & lighting package. Fee bumped to $9,500 total.' },
  { id: 'bk-6', artist: 'Adea Lyric', venue: 'SFJAZZ Center', city: 'San Francisco, CA', date: '2026-04-12', fee: '$6,000', feeCents: 600000, status: 'confirmed', promoter: 'SFJAZZ', contactName: 'Programming Dept', contactEmail: 'prog@sfjazz.org', contactPhone: '(415) 555-2345', notes: 'Confirmed for trio night. Contract signed by both parties.' },
  { id: 'bk-7', artist: 'Adea Lyric', venue: 'Greek Theatre', city: 'Los Angeles, CA', date: '2026-03-28', fee: '$40,000', feeCents: 4000000, status: 'deposit_paid', promoter: 'LA Concert Group', contactName: 'James White', contactEmail: 'jwhite@laconcert.com', contactPhone: '(323) 555-6789', notes: 'Spring festival slot confirmed. Deposit of $10,000 received. Sound check at 4pm, doors at 6pm.' },
  { id: 'bk-8', artist: 'Marcus Cole', venue: 'House of Blues', city: 'Chicago, IL', date: '2026-02-14', fee: '$12,000', feeCents: 1200000, status: 'completed', promoter: 'HOB Chicago', contactName: 'Booking Dept', contactEmail: 'booking@hobchicago.com', contactPhone: '(312) 555-1122', notes: 'Valentine\'s jazz night. Full payment received. Post-event report available.' },
];

// ── Pipeline stages ──
const PIPELINE_STAGES: { key: BookingStatus; label: string; icon: typeof Inbox; color: string; bgColor: string; borderColor: string; badgeColor: 'gray' | 'blue' | 'amber' | 'teal' | 'green' | 'purple' }[] = [
  { key: 'new_inquiry', label: 'New Inquiry', icon: Inbox, color: 'text-blue-600', bgColor: 'bg-blue-50', borderColor: 'border-blue-200', badgeColor: 'blue' },
  { key: 'contacted', label: 'Contacted', icon: MessageSquare, color: 'text-amber-600', bgColor: 'bg-amber-50', borderColor: 'border-amber-200', badgeColor: 'amber' },
  { key: 'offer_sent', label: 'Offer Sent', icon: Send, color: 'text-purple-600', bgColor: 'bg-purple-50', borderColor: 'border-purple-200', badgeColor: 'purple' },
  { key: 'confirmed', label: 'Confirmed', icon: CheckCircle2, color: 'text-teal-600', bgColor: 'bg-teal-50', borderColor: 'border-teal-200', badgeColor: 'teal' },
  { key: 'deposit_paid', label: 'Deposit Paid', icon: DollarSign, color: 'text-green-600', bgColor: 'bg-green-50', borderColor: 'border-green-200', badgeColor: 'green' },
  { key: 'completed', label: 'Completed', icon: Flag, color: 'text-neutral-500', bgColor: 'bg-neutral-50', borderColor: 'border-neutral-200', badgeColor: 'gray' },
];

// Stage index for advancement
const STAGE_ORDER: BookingStatus[] = ['new_inquiry', 'contacted', 'offer_sent', 'confirmed', 'deposit_paid', 'completed'];

function getNextStage(current: BookingStatus): BookingStatus | null {
  const idx = STAGE_ORDER.indexOf(current);
  if (idx < STAGE_ORDER.length - 1) return STAGE_ORDER[idx + 1];
  return null;
}

export function AdminTourBookingsPage() {
  const [bookings, setBookings] = useState<BookingRequest[]>(INITIAL_BOOKINGS);
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedBooking, setSelectedBooking] = useState<string | null>(null);

  // ── Stats ──
  const totalFee = bookings.reduce((sum, b) => sum + b.feeCents, 0);
  const newInquiries = bookings.filter(b => b.status === 'new_inquiry').length;
  const confirmed = bookings.filter(b => b.status === 'confirmed').length;
  const depositPaid = bookings.filter(b => b.status === 'deposit_paid').length;

  // ── Handlers ──
  const handleAdvanceStage = (bookingId: string) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return;
    const nextStage = getNextStage(booking.status);
    if (!nextStage) return;

    const nextLabel = PIPELINE_STAGES.find(s => s.key === nextStage)?.label ?? nextStage;
    setBookings(prev => prev.map(b =>
      b.id === bookingId ? { ...b, status: nextStage } : b
    ));
    toast('success', `${booking.artist} @ ${booking.venue} → ${nextLabel}`);
  };

  const filteredBookings = filterStatus === 'all'
    ? bookings
    : bookings.filter(b => b.status === filterStatus);

  return (
    <div>
      <PageHeader
        title="Booking Requests"
        description="Per IA §23.7 & §16: Booking pipeline — New Inquiry → Contacted → Offer Sent → Confirmed → Deposit Paid → Completed. Per IA §23.7 includes Contract Builder and Online Payments."
        actions={
          <>
            <Button variant="secondary" size="sm" onClick={() => setViewMode(viewMode === 'kanban' ? 'table' : 'kanban')}>
              {viewMode === 'kanban' ? <List size={16} /> : <Columns3 size={16} />}
              {viewMode === 'kanban' ? 'Table View' : 'Kanban View'}
            </Button>
            <Button variant="primary" size="sm" onClick={() => toast('info', 'New booking request form coming soon')}>
              <Plus size={16} /> New Request
            </Button>
          </>
        }
      />

      {/* ── Stats ── */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Pipeline Value" value={`$${(totalFee / 100).toLocaleString()}`} icon={<DollarSign size={28} />} />
        <StatCard label="New Inquiries" value={newInquiries} icon={<Inbox size={28} />} trend="Needs response" />
        <StatCard label="Confirmed" value={confirmed} icon={<CheckCircle2 size={28} />} trend="Contract ready" />
        <StatCard label="Deposit Paid" value={depositPaid} icon={<DollarSign size={28} />} trend="Production can start" />
      </div>

      {/* ── Pipeline progress bar ── */}
      <Card className="p-5 mb-6">
        <h3 className="font-semibold text-neutral-900 mb-3">Pipeline Progress</h3>
        <div className="flex items-center gap-0 mb-4">
          {PIPELINE_STAGES.map((stage, i) => {
            const count = bookings.filter(b => b.status === stage.key).length;
            return (
              <div key={stage.key} className="flex-1 flex flex-col items-center">
                {/* Connection line */}
                <div className="flex items-center w-full mb-2">
                  <div className={`flex-1 h-2 rounded-l-full ${i === 0 ? 'bg-transparent' : count > 0 ? stage.bgColor : 'bg-neutral-100'}`} />
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${count > 0 ? stage.bgColor : 'bg-neutral-100'} ${stage.borderColor} border-2`}>
                    <stage.icon size={16} className={count > 0 ? stage.color : 'text-neutral-400'} />
                  </div>
                  <div className={`flex-1 h-2 rounded-r-full ${i === PIPELINE_STAGES.length - 1 ? 'bg-transparent' : count > 0 ? stage.bgColor : 'bg-neutral-100'}`} />
                </div>
                <p className="text-xs font-medium text-neutral-700">{stage.label}</p>
                <Badge color={stage.badgeColor} size="sm">{count}</Badge>
              </div>
            );
          })}
        </div>
      </Card>

      {/* ── Filter ── */}
      <Card className="p-4 mb-6">
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium text-neutral-500">Filter by status:</span>
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="bg-white border border-neutral-200 rounded-lg px-3 py-1.5 text-sm"
          >
            <option value="all">All Stages</option>
            {PIPELINE_STAGES.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
          </select>
          {filterStatus !== 'all' && (
            <Badge color="blue" size="sm">
              {PIPELINE_STAGES.find(s => s.key === filterStatus)?.label}: {filteredBookings.length} bookings
            </Badge>
          )}
        </div>
      </Card>

      {/* ── Kanban View ── */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {PIPELINE_STAGES.map(stage => {
            const stageBookings = filteredBookings.filter(b => b.status === stage.key);
            return (
              <div key={stage.key} className={`rounded-xl ${stage.bgColor} border ${stage.borderColor} p-4`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <stage.icon size={16} className={stage.color} />
                    <h3 className="text-sm font-semibold text-neutral-900">{stage.label}</h3>
                  </div>
                  <Badge color={stage.badgeColor} size="sm">{stageBookings.length}</Badge>
                </div>

                <div className="space-y-3 max-h-[500px] overflow-y-auto">
                  {stageBookings.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-xs text-neutral-400">No bookings in this stage</p>
                    </div>
                  ) : (
                    stageBookings.map(booking => (
                      <Card key={booking.id} className="p-4 cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelectedBooking(selectedBooking === booking.id ? null : booking.id)}>
                        {/* Header */}
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-sm font-semibold text-neutral-900 truncate">{booking.artist}</h4>
                          <Badge color={stage.badgeColor} size="sm">{booking.fee}</Badge>
                        </div>

                        {/* Venue info */}
                        <div className="text-xs text-neutral-600 mb-2">
                          <span className="flex items-center gap-1"><Building2 size={12} /> {booking.venue}</span>
                          <span className="flex items-center gap-1 ml-2"><MapPin size={12} /> {booking.city}</span>
                        </div>

                        {/* Date */}
                        <div className="flex items-center gap-1 text-xs text-neutral-500 mb-2">
                          <CalendarDays size={12} />
                          <span>{booking.date}</span>
                        </div>

                        {/* Promoter */}
                        <div className="flex items-center gap-1 text-xs text-neutral-500 mb-2">
                          <Users size={12} />
                          <span>{booking.promoter}</span>
                        </div>

                        {/* Expandable details */}
                        {selectedBooking === booking.id && (
                          <div className="mt-3 pt-3 border-t border-neutral-200 space-y-2">
                            <p className="text-xs text-neutral-600">{booking.notes}</p>
                            <div className="space-y-1 text-xs text-neutral-600">
                              <span className="flex items-center gap-1"><Phone size={10} /> {booking.contactName} — {booking.contactPhone}</span>
                              <span className="flex items-center gap-1"><Mail size={10} /> {booking.contactEmail}</span>
                            </div>
                            {/* Advance button */}
                            {getNextStage(booking.status) && (
                              <Button variant="primary" size="sm" className="mt-2 w-full" onClick={(e) => { e.stopPropagation(); handleAdvanceStage(booking.id); }}>
                                <ArrowRight size={14} /> Advance to {PIPELINE_STAGES.find(s => s.key === getNextStage(booking.status))?.label}
                              </Button>
                            )}
                          </div>
                        )}

                        {/* Quick advance (collapsed) */}
                        {selectedBooking !== booking.id && getNextStage(booking.status) && (
                          <button
                            className="mt-2 flex items-center gap-1 text-xs text-neutral-500 hover:text-neutral-700 transition-colors"
                            onClick={(e) => { e.stopPropagation(); handleAdvanceStage(booking.id); }}
                          >
                            <ChevronRight size={12} />
                            Advance → {PIPELINE_STAGES.find(s => s.key === getNextStage(booking.status))?.label}
                          </button>
                        )}
                      </Card>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Table View ── */}
      {viewMode === 'table' && (
        <Card className="p-5">
          <h3 className="font-semibold text-neutral-900 mb-4">
            Booking Requests ({filteredBookings.length})
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50">
                  <th className="text-left py-3 px-4 font-medium text-neutral-500">Artist</th>
                  <th className="text-left py-3 px-4 font-medium text-neutral-500">Venue</th>
                  <th className="text-left py-3 px-4 font-medium text-neutral-500">City</th>
                  <th className="text-left py-3 px-4 font-medium text-neutral-500">Date</th>
                  <th className="text-left py-3 px-4 font-medium text-neutral-500">Fee</th>
                  <th className="text-left py-3 px-4 font-medium text-neutral-500">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-neutral-500">Promoter</th>
                  <th className="text-left py-3 px-4 font-medium text-neutral-500">Contact</th>
                  <th className="text-left py-3 px-4 font-medium text-neutral-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredBookings.map(booking => {
                  const stageConfig = PIPELINE_STAGES.find(s => s.key === booking.status);
                  const nextStage = getNextStage(booking.status);
                  const nextLabel = nextStage ? PIPELINE_STAGES.find(s => s.key === nextStage)?.label : null;
                  return (
                    <tr key={booking.id} className="hover:bg-neutral-50 transition-colors">
                      <td className="py-3 px-4 font-medium text-neutral-900">{booking.artist}</td>
                      <td className="py-3 px-4 text-neutral-600">
                        <span className="flex items-center gap-1"><Building2 size={12} className="text-neutral-400" /> {booking.venue}</span>
                      </td>
                      <td className="py-3 px-4 text-neutral-600">{booking.city}</td>
                      <td className="py-3 px-4 text-neutral-600">{booking.date}</td>
                      <td className="py-3 px-4 font-semibold text-neutral-900">{booking.fee}</td>
                      <td className="py-3 px-4">
                        <Badge color={stageConfig?.badgeColor ?? 'gray'}>{stageConfig?.label ?? booking.status}</Badge>
                      </td>
                      <td className="py-3 px-4 text-neutral-600">{booking.promoter}</td>
                      <td className="py-3 px-4 text-xs text-neutral-500">
                        <span>{booking.contactName}</span>
                        <br />
                        <span>{booking.contactEmail}</span>
                      </td>
                      <td className="py-3 px-4">
                        {nextStage ? (
                          <Button variant="ghost" size="sm" onClick={() => handleAdvanceStage(booking.id)}>
                            <ArrowRight size={14} /> {nextLabel}
                          </Button>
                        ) : (
                          <Badge color="gray" size="sm">Final</Badge>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* ── IA §23.7 Deep Dive Reference ── */}
          <div className="mt-6 pt-6 border-t border-neutral-200">
            <div className="flex items-center gap-2 mb-3">
              <FileText size={16} className="text-neutral-400" />
              <h4 className="font-semibold text-neutral-900 text-sm">Tour Studio Deep Dive (IA §23.7)</h4>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                { label: 'Contract Builder', desc: 'Template library, e-signature, one-click from confirmed booking', color: 'teal' },
                { label: 'Online Payments', desc: 'Deposit & settlement tracking per booking', color: 'green' },
                { label: 'Smart Holds Calendar', desc: 'Offer sheet with hold dates visualization', color: 'amber' },
                { label: 'Tour Analytics', desc: 'Dates by status, tracked artists, show forecasting', color: 'blue' },
                { label: 'Artist Itinerary', desc: 'Travel/flight synced to Google Calendar', color: 'purple' },
                { label: 'Team Management', desc: 'Assign bookings to crew members', color: 'gray' },
              ].map(feature => (
                <div key={feature.label} className="p-3 rounded-lg bg-neutral-50 border border-neutral-200">
                  <Badge color={feature.color as any} size="sm">{feature.label}</Badge>
                  <p className="text-xs text-neutral-600 mt-2">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
