'use client';

import { useState } from 'react';
import { toast } from '@/components/ui/Toast';
import { Button } from '@/components/ui/Button';
import { Field, Input, Textarea, Select } from '@/components/ui/Form';

export default function WriterSubmit() {
  const [form, setForm] = useState({ title: '', link: '', notes: '', type: 'demo' });
  const [loading, setLoading] = useState(false);

  const submit = () => {
    if (!form.title) { toast('error', 'Title is required'); return; }
    setLoading(true);
    setTimeout(() => { setLoading(false); toast('success', 'Pitch submitted!'); }, 1000);
  };

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-white">Submit a Demo / Pitch</h1><p className="mt-1 text-sm text-white/50">Send your music for review</p></div>
      <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-4">
        <Field label="Title" required><Input value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} className="bg-neutral-900 border-white/10 text-white" /></Field>
        <Field label="Type"><Select value={form.type} onChange={(e) => setForm({...form, type: e.target.value})} className="bg-neutral-900 border-white/10 text-white"><option value="demo">Demo</option><option value="co-write">Co-write proposal</option><option value="beat">Beat for sale</option><option value="unsolicited">Unsolicited pitch</option></Select></Field>
        <Field label="Link (Drive, Dropbox, etc.)"><Input value={form.link} onChange={(e) => setForm({...form, link: e.target.value})} className="bg-neutral-900 border-white/10 text-white" /></Field>
        <Field label="Notes"><Textarea value={form.notes} onChange={(e) => setForm({...form, notes: e.target.value})} className="bg-neutral-900 border-white/10 text-white" rows={3} /></Field>
        <Button variant="primary" className="bg-white text-neutral-900 hover:bg-white/90" onClick={submit} disabled={loading}>{loading ? 'Submitting…' : 'Submit Pitch'}</Button>
      </div>
    </div>
  );
}
