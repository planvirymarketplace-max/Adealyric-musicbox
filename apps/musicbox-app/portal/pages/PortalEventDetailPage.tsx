'use client';

import { useState } from 'react';
import { useRouter } from '@/lib/router';
import { Calendar, MapPin, Clock, ArrowLeft, Ticket as TicketIcon, AlertCircle } from 'lucide-react';
import { formatCents, formatDate } from '@/lib/format';
import { toast } from '@/components/ui/Toast';
import { Button } from '@/components/ui/Button';
import { Field, Input, Select } from '@/components/ui/Form';
import { mockTicketEvents, mockTicketTiers } from '@/lib/mock-data';

export default function PortalEventDetailPage() {
  const { path, navigate } = useRouter();
  const id = path.split('/').pop() ?? '';

  const event = mockTicketEvents.find((e) => e.id === id);
  const tiers = mockTicketTiers.filter((t) => t.event_id === id);

  const [selectedTier, setSelectedTier] = useState<string>(tiers.length > 0 ? tiers[0].id : '');
  const [quantity, setQuantity] = useState(1);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [purchasing, setPurchasing] = useState(false);

  if (!event) return <div className="max-w-2xl mx-auto py-20 text-center"><AlertCircle size={48} className="text-white/10 mx-auto mb-4" /><p className="text-white/30">Event not found</p></div>;

  const purchase = () => {
    if (!selectedTier) { toast('error', 'Select a ticket tier'); return; }
    if (!email) { toast('error', 'Email is required'); return; }
    setPurchasing(true);
    setTimeout(() => {
      setPurchasing(false);
      toast('success', `${quantity} ticket(s) purchased! Check your email.`);
      navigate('/portal/dashboard');
    }, 1000);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <button onClick={() => navigate('/portal/events')} className="inline-flex items-center gap-1 text-sm text-white/40 hover:text-white mb-4"><ArrowLeft size={16} /> All Events</button>

      <h1 className="text-3xl font-bold text-white mb-3">{event.title}</h1>
      <div className="space-y-1 text-white/60 mb-6">
        <p className="flex items-center gap-2"><Calendar size={16} /> {formatDate(event.event_date)}</p>
        <p className="flex items-center gap-2"><MapPin size={16} /> {event.venue_name}{event.address ? ` — ${event.address}` : ''}</p>
        {event.door_time && <p className="flex items-center gap-2"><Clock size={16} /> Doors at {event.door_time}{event.show_time ? ` · Show at ${event.show_time}` : ''}</p>}
        {event.age_restriction && <p className="text-white/40">{event.age_restriction}</p>}
      </div>

      {event.description && <p className="text-white/70 mb-8 whitespace-pre-wrap">{event.description}</p>}

      {/* Ticket purchase */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2"><TicketIcon size={20} /> Get Tickets</h2>

        {tiers.length === 0 ? (
          <p className="text-white/40 text-center py-4">Tickets coming soon</p>
        ) : (
          <div className="space-y-4">
            <Field label="Ticket Tier">
              <Select value={selectedTier} onChange={(e) => setSelectedTier(e.target.value)} className="bg-neutral-900 border-white/10 text-white">
                {tiers.map((t) => (
                  <option key={t.id} value={t.id} disabled={t.sold_count >= t.quantity}>
                    {t.name} — {formatCents(t.price_cents)} {t.sold_count >= t.quantity ? '(Sold Out)' : `(${t.quantity - t.sold_count} left)`}
                  </option>
                ))}
              </Select>
            </Field>

            <Field label="Quantity">
              <Input type="number" min={1} max={10} value={quantity} onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))} className="bg-neutral-900 border-white/10 text-white" />
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Name"><Input value={name} onChange={(e) => setName(e.target.value)} className="bg-neutral-900 border-white/10 text-white" /></Field>
              <Field label="Email" required><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-neutral-900 border-white/10 text-white" /></Field>
            </div>

            {selectedTier && (
              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <span className="text-white/60">Total: <span className="text-xl font-bold text-white">{formatCents((tiers.find((t) => t.id === selectedTier)?.price_cents ?? 0) * quantity)}</span></span>
                <Button variant="primary" onClick={purchase} disabled={purchasing}>{purchasing ? 'Processing…' : 'Buy Tickets'}</Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
