'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, StatCard } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Field, Input, Textarea, Select } from '@/components/ui/Form';
import { toast } from '@/components/ui/Toast';
import {
  Plus, Save, Edit3, Trash2, Megaphone, Eye, EyeOff,
  ToggleLeft, ToggleRight, ExternalLink, CalendarDays, Filter
} from 'lucide-react';

// ── Target Pages Options ──
const TARGET_PAGES = ['Home', 'Discography', 'Tour', 'Shop', 'Bio', 'Booking'] as const;
type TargetPage = typeof TARGET_PAGES[number];

// ── Placement Options ──
const PLACEMENTS = ['hero', 'sidebar', 'footer'] as const;
type Placement = typeof PLACEMENTS[number];

// ── Banner Type ──
interface BannerData {
  id: number;
  message: string;
  linkUrl: string;
  startDate: string;
  endDate: string;
  placement: Placement;
  target_pages: TargetPage[];
  active: boolean;
}

// ── Page chip color mapping ──
const pageChipColors: Record<TargetPage, { bg: string; text: string }> = {
  Home:         { bg: 'bg-emerald-100', text: 'text-emerald-700' },
  Discography:  { bg: 'bg-violet-100', text: 'text-violet-700' },
  Tour:         { bg: 'bg-amber-100',  text: 'text-amber-700' },
  Shop:         { bg: 'bg-teal-100',   text: 'text-teal-700' },
  Bio:          { bg: 'bg-pink-100',   text: 'text-pink-700' },
  Booking:      { bg: 'bg-sky-100',    text: 'text-sky-700' },
};

const placementBadgeColors: Record<Placement, 'blue' | 'gray' | 'purple'> = {
  hero:    'blue',
  sidebar: 'gray',
  footer:  'purple',
};

// ── Mock Data: 5 banners with varied target_pages ──
const INITIAL_BANNERS: BannerData[] = [
  {
    id: 1,
    message: 'New album "Midnight Echoes" — out now! Stream everywhere.',
    linkUrl: '/releases/midnight-echoes',
    startDate: '2025-03-14',
    endDate: '2025-04-14',
    placement: 'hero',
    target_pages: ['Home', 'Discography', 'Shop'],
    active: true,
  },
  {
    id: 2,
    message: 'Summer Tour 2025 tickets on sale this Friday.',
    linkUrl: '/tour/2025',
    startDate: '2025-03-10',
    endDate: '2025-03-17',
    placement: 'hero',
    target_pages: ['Home', 'Tour', 'Booking'],
    active: true,
  },
  {
    id: 3,
    message: 'Fan Club members get 20% off all merch this week.',
    linkUrl: '/shop',
    startDate: '2025-03-01',
    endDate: '2025-03-08',
    placement: 'sidebar',
    target_pages: ['Shop', 'Bio'],
    active: false,
  },
  {
    id: 4,
    message: 'Sign up for exclusive early access to Kai Horizon EP.',
    linkUrl: '/fan-club',
    startDate: '2025-03-18',
    endDate: '2025-03-25',
    placement: 'footer',
    target_pages: ['Home', 'Discography'],
    active: true,
  },
  {
    id: 5,
    message: 'Vinyl restock alert — limited edition pressings available now.',
    linkUrl: '/shop/vinyl',
    startDate: '2025-03-22',
    endDate: '2025-04-22',
    placement: 'sidebar',
    target_pages: ['Home', 'Shop', 'Discography'],
    active: false,
  },
];

export function AdminCmsBannersPage() {
  const [banners, setBanners] = useState<BannerData[]>(INITIAL_BANNERS);
  const [showModal, setShowModal] = useState(false);
  const [editingBanner, setEditingBanner] = useState<BannerData | null>(null);

  // ── Form state ──
  const [formMessage, setFormMessage] = useState('');
  const [formLink, setFormLink] = useState('');
  const [formStart, setFormStart] = useState('');
  const [formEnd, setFormEnd] = useState('');
  const [formPlacement, setFormPlacement] = useState<Placement>('hero');
  const [formTargetPages, setFormTargetPages] = useState<TargetPage[]>([]);

  // ── Reset form ──
  const resetForm = () => {
    setFormMessage('');
    setFormLink('');
    setFormStart('');
    setFormEnd('');
    setFormPlacement('hero');
    setFormTargetPages([]);
    setEditingBanner(null);
  };

  // ── Open new banner modal ──
  const openNewModal = () => {
    resetForm();
    setShowModal(true);
  };

  // ── Open edit modal ──
  const openEditModal = (banner: BannerData) => {
    setEditingBanner(banner);
    setFormMessage(banner.message);
    setFormLink(banner.linkUrl);
    setFormStart(banner.startDate);
    setFormEnd(banner.endDate);
    setFormPlacement(banner.placement);
    setFormTargetPages([...banner.target_pages]);
    setShowModal(true);
  };

  // ── Toggle active ──
  const toggleActive = (id: number) => {
    setBanners(prev => prev.map(b =>
      b.id === id ? { ...b, active: !b.active } : b
    ));
    const banner = banners.find(b => b.id === id);
    if (banner) {
      toast(banner.active ? 'info' : 'success', banner.active ? 'Banner deactivated' : 'Banner activated ✓');
    }
  };

  // ── Create / Update banner ──
  const handleSave = () => {
    if (!formMessage.trim()) {
      toast('error', 'Message text is required');
      return;
    }
    if (formTargetPages.length === 0) {
      toast('error', 'Select at least one target page');
      return;
    }

    if (editingBanner) {
      setBanners(prev => prev.map(b =>
        b.id === editingBanner.id
          ? {
              ...b,
              message: formMessage,
              linkUrl: formLink,
              startDate: formStart,
              endDate: formEnd,
              placement: formPlacement,
              target_pages: formTargetPages,
            }
          : b
      ));
      toast('success', 'Banner updated ✓');
    } else {
      const newBanner: BannerData = {
        id: Date.now(),
        message: formMessage,
        linkUrl: formLink,
        startDate: formStart,
        endDate: formEnd,
        placement: formPlacement,
        target_pages: formTargetPages,
        active: true,
      };
      setBanners(prev => [...prev, newBanner]);
      toast('success', 'Banner created ✓');
    }
    setShowModal(false);
    resetForm();
  };

  // ── Delete banner ──
  const handleDelete = (id: number) => {
    setBanners(prev => prev.filter(b => b.id !== id));
    toast('success', 'Banner deleted');
  };

  // ── Toggle target page in form ──
  const toggleTargetPage = (page: TargetPage) => {
    setFormTargetPages(prev =>
      prev.includes(page) ? prev.filter(p => p !== page) : [...prev, page]
    );
  };

  // ── Stats ──
  const activeBanners = banners.filter(b => b.active).length;
  const totalBanners = banners.length;
  const uniquePages = new Set(banners.filter(b => b.active).flatMap(b => b.target_pages));

  return (
    <div>
      <PageHeader
        title="Announcements & Banners"
        description="Manage promotional banners and site announcements with page-scoped targeting (IA §14)"
        actions={
          <Button variant="primary" size="sm" onClick={openNewModal}>
            <Plus size={16} /> New Banner
          </Button>
        }
      />

      {/* ── Summary stats ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard
          label="Active Banners"
          value={activeBanners}
          icon={<Megaphone size={28} />}
          trend={`${totalBanners} total`}
        />
        <StatCard
          label="Pages with Banners"
          value={uniquePages.size}
          icon={<Eye size={28} />}
          trend="of 6 front-end pages"
        />
        <StatCard
          label="Hero Placement"
          value={banners.filter(b => b.active && b.placement === 'hero').length}
          icon={<Filter size={28} />}
          trend="Most prominent"
        />
      </div>

      {/* ── Banner List Table ── */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-100 bg-neutral-50/60">
                <th className="text-left px-4 py-3 font-medium text-neutral-500">Message</th>
                <th className="text-left px-4 py-3 font-medium text-neutral-500">Link Target</th>
                <th className="text-left px-4 py-3 font-medium text-neutral-500">Placement</th>
                <th className="text-left px-4 py-3 font-medium text-neutral-500">Start — End</th>
                <th className="text-left px-4 py-3 font-medium text-neutral-500">Target Pages</th>
                <th className="text-center px-4 py-3 font-medium text-neutral-500">Active</th>
                <th className="text-right px-4 py-3 font-medium text-neutral-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {banners.map(b => (
                <tr
                  key={b.id}
                  className={`border-b border-neutral-50 transition-colors ${
                    !b.active ? 'opacity-60' : 'hover:bg-neutral-50/50'
                  }`}
                >
                  {/* Message */}
                  <td className="px-4 py-3 font-medium text-neutral-900 max-w-[280px]">
                    <div className="truncate">{b.message}</div>
                  </td>

                  {/* Link Target */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 text-neutral-500 text-xs font-mono">
                      <ExternalLink size={12} />
                      <span className="truncate max-w-[120px]">{b.linkUrl}</span>
                    </div>
                  </td>

                  {/* Placement */}
                  <td className="px-4 py-3">
                    <Badge color={placementBadgeColors[b.placement]} size="sm">
                      {b.placement}
                    </Badge>
                  </td>

                  {/* Date Range */}
                  <td className="px-4 py-3 text-neutral-500 text-xs whitespace-nowrap">
                    <CalendarDays size={12} className="inline mr-1" />
                    {b.startDate} — {b.endDate}
                  </td>

                  {/* Target Pages — page-tag chips */}
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1.5">
                      {b.target_pages.map(page => (
                        <span
                          key={page}
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${pageChipColors[page].bg} ${pageChipColors[page].text}`}
                        >
                          {page}
                        </span>
                      ))}
                    </div>
                  </td>

                  {/* On/Off Toggle */}
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => toggleActive(b.id)}
                      className={`inline-flex items-center gap-1.5 text-xs font-medium transition-all rounded-lg px-3 py-1.5 ${
                        b.active
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200'
                      }`}
                    >
                      {b.active ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                      {b.active ? 'ON' : 'OFF'}
                    </button>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="sm" onClick={() => openEditModal(b)}>
                        <Edit3 size={14} />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(b.id)}>
                        <Trash2 size={14} className="text-red-500" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* ── Active Banner Detail Cards ── */}
      <Card className="p-5 mt-6">
        <div className="flex items-center gap-2 mb-4">
          <Eye size={16} className="text-green-500" />
          <h3 className="font-semibold text-neutral-900">Live Banners — Page Coverage</h3>
          <Badge color="green" size="sm">{activeBanners} active</Badge>
        </div>
        <p className="text-xs text-neutral-500 mb-4">
          Per IA §14: Each banner shows which front-end pages it targets via page-tag chips.
          Toggle ON/OFF to activate/deactivate without deleting.
        </p>
        <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
          {banners.filter(b => b.active).map(b => (
            <div
              key={b.id}
              className={`p-4 rounded-lg border transition-all ${
                b.placement === 'hero'
                  ? 'bg-blue-50/30 border-blue-200'
                  : b.placement === 'sidebar'
                    ? 'bg-neutral-50 border-neutral-200'
                    : 'bg-purple-50/30 border-purple-200'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <p className="font-semibold text-neutral-900 text-sm">{b.message}</p>
                    <Badge color={placementBadgeColors[b.placement]} size="sm">{b.placement}</Badge>
                    {b.active && <Badge color="green" size="sm">Live ✓</Badge>}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-neutral-600 mb-2">
                    <span className="flex items-center gap-1"><ExternalLink size={12} /> {b.linkUrl}</span>
                    <span className="flex items-center gap-1"><CalendarDays size={12} /> {b.startDate} → {b.endDate}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {TARGET_PAGES.map(page => (
                      <span
                        key={page}
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                          b.target_pages.includes(page)
                            ? `${pageChipColors[page].bg} ${pageChipColors[page].text}`
                            : 'bg-neutral-50 text-neutral-300'
                        }`}
                      >
                        {page}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col items-center gap-2 shrink-0">
                  <button
                    onClick={() => toggleActive(b.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                      b.active
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : 'bg-neutral-900 text-white hover:bg-neutral-800'
                    }`}
                  >
                    {b.active ? <Eye size={16} /> : <EyeOff size={16} />}
                    {b.active ? 'Active' : 'Inactive'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* ── New / Edit Banner Modal ── */}
      <Modal
        open={showModal}
        onClose={() => { setShowModal(false); resetForm(); }}
        title={editingBanner ? 'Edit Banner' : 'New Banner'}
        size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => { setShowModal(false); resetForm(); }}>Cancel</Button>
            <Button variant="primary" onClick={handleSave}>
              <Save size={14} /> {editingBanner ? 'Update' : 'Create'}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Field label="Message Text" required>
            <Textarea
              value={formMessage}
              onChange={e => setFormMessage(e.target.value)}
              placeholder="Banner announcement message..."
              rows={2}
            />
          </Field>

          <Field label="Link URL" hint="Internal path like /tour/2025 or full URL">
            <Input
              value={formLink}
              onChange={e => setFormLink(e.target.value)}
              placeholder="/path or https://..."
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Start Date" required>
              <Input
                type="date"
                value={formStart}
                onChange={e => setFormStart(e.target.value)}
              />
            </Field>
            <Field label="End Date" required>
              <Input
                type="date"
                value={formEnd}
                onChange={e => setFormEnd(e.target.value)}
              />
            </Field>
          </div>

          <Field label="Placement" required>
            <Select
              value={formPlacement}
              onChange={e => setFormPlacement(e.target.value as Placement)}
            >
              <option value="hero">Hero — Full-width top banner</option>
              <option value="sidebar">Sidebar — Side panel strip</option>
              <option value="footer">Footer — Bottom announcement bar</option>
            </Select>
          </Field>

          <Field label="Target Pages" required hint="Select which front-end pages this banner appears on (IA §14: page-scoped targeting)">
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mt-1">
              {TARGET_PAGES.map(page => {
                const isSelected = formTargetPages.includes(page);
                return (
                  <button
                    key={page}
                    type="button"
                    onClick={() => toggleTargetPage(page)}
                    className={`flex items-center justify-center px-3 py-2 rounded-lg text-sm font-medium transition-all border ${
                      isSelected
                        ? `${pageChipColors[page].bg} ${pageChipColors[page].text} border-current shadow-sm`
                        : 'bg-white text-neutral-400 border-neutral-200 hover:border-neutral-300 hover:text-neutral-500'
                    }`}
                  >
                    {isSelected && <Eye size={14} className="mr-1" />}
                    {page}
                  </button>
                );
              })}
            </div>
            {formTargetPages.length === 0 && (
              <p className="text-xs text-red-500 mt-1">At least one target page is required</p>
            )}
          </Field>
        </div>
      </Modal>
    </div>
  );
}
