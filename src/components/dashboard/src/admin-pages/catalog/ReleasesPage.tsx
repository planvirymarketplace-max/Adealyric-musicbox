'use client';

import { useState } from 'react';
import { useRouter } from '@/lib/router';
import { Disc3, Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge, StatusBadge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Field, Input, Select } from '@/components/ui/Form';
import { toast } from '@/components/ui/Toast';
import { PageHeader } from '@/components/layout/PageHeader';
import { formatDate, formatCents } from '@/lib/format';
import { mockReleases, mockArtists } from '@/lib/mock-data';

export default function ReleasesPage() {
  const { navigate } = useRouter();
  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState({ title: '', type: 'single', artist_id: '', release_date: '', status: 'draft', genre: '', price: '', is_free: false, explicit: false });
  const [saving, setSaving] = useState(false);

  const save = () => {
    if (!form.title) { toast('error', 'Title is required'); return; }
    setSaving(true);
    setTimeout(() => { setSaving(false); toast('success', 'Release created!'); setCreateOpen(false); }, 500);
  };

  return (
    <div>
      <PageHeader title="Music — Albums & Tracks" description="Manage your catalog" actions={<Button variant="primary" onClick={() => setCreateOpen(true)}><Plus size={16} /> New Album</Button>} />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockReleases.map((r) => (
          <button key={r.id} onClick={() => navigate(`/admin/music/albums/${r.id}`)}>
            <Card className="p-5 hover:shadow-md transition-shadow cursor-pointer h-full">
              <div className="flex items-start gap-3">
                <div className="w-14 h-14 rounded-lg bg-neutral-100 flex items-center justify-center flex-shrink-0"><Disc3 size={28} className="text-neutral-400" /></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-neutral-900 truncate">{r.title}</p>
                  <p className="text-xs text-neutral-500 capitalize">{r.type} · {formatDate(r.release_date)}</p>
                  <div className="flex items-center gap-1.5 mt-2 flex-wrap"><StatusBadge status={r.status} />{r.is_free && <Badge color="green">Free</Badge>}{!r.is_free && r.price_cents > 0 && <Badge color="blue">{formatCents(r.price_cents)}</Badge>}{r.explicit && <Badge color="red">E</Badge>}</div>
                </div>
              </div>
            </Card>
          </button>
        ))}
      </div>
      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="New Release" size="lg" footer={<><Button onClick={() => setCreateOpen(false)}>Cancel</Button><Button variant="primary" onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Create Release'}</Button></>}>
        <div className="space-y-4">
          <Field label="Title" required><Input value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} autoFocus /></Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Type"><Select value={form.type} onChange={(e) => setForm({...form, type: e.target.value})}><option value="single">Single</option><option value="ep">EP</option><option value="album">Album</option></Select></Field>
            <Field label="Artist"><Select value={form.artist_id} onChange={(e) => setForm({...form, artist_id: e.target.value})}><option value="">—</option>{mockArtists.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}</Select></Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Release Date"><Input type="date" value={form.release_date} onChange={(e) => setForm({...form, release_date: e.target.value})} /></Field>
            <Field label="Genre"><Input value={form.genre} onChange={(e) => setForm({...form, genre: e.target.value})} /></Field>
          </div>
          <Field label="Status"><Select value={form.status} onChange={(e) => setForm({...form, status: e.target.value})}><option value="draft">Draft</option><option value="submitted">Submitted</option><option value="live">Live</option><option value="delisted">Delisted</option></Select></Field>
          <Field label="Price (USD)"><Input type="number" value={form.price} onChange={(e) => setForm({...form, price: e.target.value})} disabled={form.is_free} /></Field>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-sm text-neutral-700"><input type="checkbox" checked={form.is_free} onChange={(e) => setForm({...form, is_free: e.target.checked})} /> Free release</label>
            <label className="flex items-center gap-2 text-sm text-neutral-700"><input type="checkbox" checked={form.explicit} onChange={(e) => setForm({...form, explicit: e.target.checked})} /> Explicit</label>
          </div>
        </div>
      </Modal>
    </div>
  );
}
