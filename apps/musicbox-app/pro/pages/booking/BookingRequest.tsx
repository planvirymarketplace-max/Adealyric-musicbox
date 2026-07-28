'use client';

import { useState } from 'react';
import { toast } from '@/components/ui/Toast';
import { Button } from '@/components/ui/Button';
import { Field, Input, Textarea, Select } from '@/components/ui/Form';

export default function BookingRequest() {
  const [form, setForm] = useState({ eventName: '', venue: '', city: '', date: '', eventType: 'club', budget: '', message: '' });
  const [loading, setLoading] = useState(false);

  const submit = () => {
    if (!form.eventName || !form.date) { toast('error', 'Event name and date are required'); return; }
    setLoading(true);
    setTimeout(() => { setLoading(false); toast('success', 'Booking request submitted!'); }, 1000);
  };

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-white">Submit Booking Request</h1><p className="mt-1 text-sm text-white/50">Request a booking for your event</p></div>
      <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-4">
        <Field label="Event Name" required><Input value={form.eventName} onChange={(e) => setForm({...form, eventName: e.target.value})} className="bg-neutral-900 border-white/10 text-white" /></Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Venue"><Input value={form.venue} onChange={(e) => setForm({...form, venue: e.target.value})} className="bg-neutral-900 border-white/10 text-white" /></Field>
          <Field label="City"><Input value={form.city} onChange={(e) => setForm({...form, city: e.target.value})} className="bg-neutral-900 border-white/10 text-white" /></Field>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Event Date" required><Input type="date" value={form.date} onChange={(e) => setForm({...form, date: e.target.value})} className="bg-neutral-900 border-white/10 text-white" /></Field>
          <Field label="Event Type"><Select value={form.eventType} onChange={(e) => setForm({...form, eventType: e.target.value})} className="bg-neutral-900 border-white/10 text-white"><option value="club">Club</option><option value="festival">Festival</option><option value="corporate">Corporate</option><option value="lounge">Lounge</option></Select></Field>
        </div>
        <Field label="Budget (USD)"><Input type="number" value={form.budget} onChange={(e) => setForm({...form, budget: e.target.value})} className="bg-neutral-900 border-white/10 text-white" /></Field>
        <Field label="Message"><Textarea value={form.message} onChange={(e) => setForm({...form, message: e.target.value})} className="bg-neutral-900 border-white/10 text-white" rows={3} /></Field>
        <Button variant="primary" className="bg-white text-neutral-900 hover:bg-white/90" onClick={submit} disabled={loading}>{loading ? 'Submitting…' : 'Submit Request'}</Button>
      </div>
    </div>
  );
}
