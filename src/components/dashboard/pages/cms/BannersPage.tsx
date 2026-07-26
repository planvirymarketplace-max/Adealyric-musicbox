"use client";

import { useEffect, useState, useCallback } from 'react';
import { LayoutTemplate, Plus, Trash2, Edit, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/dashboard/ui/Button';
import { Card } from '@/components/dashboard/ui/Card';
import { Badge } from '@/components/dashboard/ui/Badge';
import { LoadingState, EmptyState } from '@/components/dashboard/ui/States';
import { PageHeader } from '@/components/dashboard/layout/PageHeader';
import { Modal } from '@/components/dashboard/ui/Modal';
import { Field, Input, Select } from '@/components/dashboard/ui/Form';
import { toast } from '@/components/dashboard/ui/Toast';

type Banner = {
  id: string;
  title: string;
  subtitle: string | null;
  imageUrl: string | null;
  ctaText: string | null;
  ctaLink: string | null;
  position: string;
  published: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

const POSITIONS = [
  { value: 'hero', label: 'Hero (top of page)' },
  { value: 'promo', label: 'Promo strip' },
  { value: 'letter', label: 'Letter section' },
];

export default function BannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<Banner | null>(null);

  const fetchBanners = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/banners');
      const data = await res.json();
      setBanners(data.banners ?? []);
    } catch { setBanners([]); }
    setLoading(false);
  }, []);

  useEffect(() => { fetchBanners(); }, [fetchBanners]);

  const togglePublish = async (b: Banner) => {
    await fetch(`/api/banners/${b.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ published: !b.published }),
    });
    fetchBanners();
    toast('success', b.published ? 'Unpublished' : 'Published');
  };

  const del = async (b: Banner) => {
    if (!confirm(`Delete banner "${b.title}"?`)) return;
    await fetch(`/api/banners/${b.id}`, { method: 'DELETE' });
    fetchBanners();
    toast('success', 'Banner deleted');
  };

  return (
    <div>
      <PageHeader title="Banners" description="Promotional banners on the homepage — tour dates, flyers, ticket links" actions={<Button variant="primary" onClick={() => setCreateOpen(true)}><Plus size={16} /> New Banner</Button>} />
      {loading ? <LoadingState /> : banners.length === 0 ? (
        <Card className="p-6"><EmptyState icon={<LayoutTemplate size={48} />} title="No banners yet" description="Create banners to promote events on your homepage" action={<Button variant="primary" onClick={() => setCreateOpen(true)}><Plus size={16} /> New Banner</Button>} /></Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {banners.map((b) => (
            <Card key={b.id} className="p-0 overflow-hidden">
              {b.imageUrl && <img src={b.imageUrl} alt={b.title} className="w-full h-40 object-cover" />}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-sm font-semibold text-neutral-900">{b.title}</p>
                    {b.subtitle && <p className="text-xs text-neutral-500 mt-0.5">{b.subtitle}</p>}
                  </div>
                  {b.published ? <Badge color="green">Published</Badge> : <Badge color="gray">Draft</Badge>}
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <Badge color="blue">{POSITIONS.find((p) => p.value === b.position)?.label ?? b.position}</Badge>
                  {b.ctaText && <span className="text-xs text-neutral-500">CTA: {b.ctaText}</span>}
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost" onClick={() => setEditing(b)}><Edit size={14} /></Button>
                  <Button size="sm" variant="ghost" onClick={() => togglePublish(b)}>{b.published ? <EyeOff size={14} /> : <Eye size={14} />}</Button>
                  <Button size="sm" variant="ghost" onClick={() => del(b)}><Trash2 size={14} className="text-red-500" /></Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
      <BannerModal open={createOpen || editing !== null} banner={editing} onClose={() => { setCreateOpen(false); setEditing(null); }} onSaved={fetchBanners} />
    </div>
  );
}

function BannerModal({ open, banner, onClose, onSaved }: { open: boolean; banner: Banner | null; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState({ title: '', subtitle: '', imageUrl: '', ctaText: '', ctaLink: '', position: 'hero', published: false, sortOrder: 0 });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (banner) setForm({ title: banner.title, subtitle: banner.subtitle ?? '', imageUrl: banner.imageUrl ?? '', ctaText: banner.ctaText ?? '', ctaLink: banner.ctaLink ?? '', position: banner.position, published: banner.published, sortOrder: banner.sortOrder });
    else setForm({ title: '', subtitle: '', imageUrl: '', ctaText: '', ctaLink: '', position: 'hero', published: false, sortOrder: 0 });
  }, [banner, open]);

  const save = async () => {
    if (!form.title) { toast('error', 'Title is required'); return; }
    setSaving(true);
    try {
      if (banner) {
        await fetch(`/api/banners/${banner.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
      } else {
        await fetch('/api/banners', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
      }
      toast('success', 'Banner saved');
      onClose(); onSaved();
    } catch { toast('error', 'Failed to save'); }
    setSaving(false);
  };

  return (
    <Modal open={open} onClose={onClose} title={banner ? 'Edit Banner' : 'New Banner'} size="lg" footer={<><Button onClick={onClose}>Cancel</Button><Button variant="primary" onClick={save} disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button></>}>
      <div className="space-y-4">
        <Field label="Title" required><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></Field>
        <Field label="Subtitle"><Input value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} /></Field>
        <Field label="Image URL"><Input value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} placeholder="https://images.pexels.com/..." /></Field>
        {form.imageUrl && <img src={form.imageUrl} alt="Preview" className="w-full h-32 object-cover rounded-lg" />}
        <div className="grid grid-cols-2 gap-4">
          <Field label="CTA Text"><Input value={form.ctaText} onChange={(e) => setForm({ ...form, ctaText: e.target.value })} placeholder="Get Tickets" /></Field>
          <Field label="CTA Link"><Input value={form.ctaLink} onChange={(e) => setForm({ ...form, ctaLink: e.target.value })} placeholder="https://..." /></Field>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Position"><Select value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })}>{POSITIONS.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}</Select></Field>
          <Field label="Sort Order"><Input type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })} /></Field>
        </div>
        <label className="flex items-center gap-2 text-sm text-neutral-700"><input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} /> Publish to homepage</label>
      </div>
    </Modal>
  );
}
