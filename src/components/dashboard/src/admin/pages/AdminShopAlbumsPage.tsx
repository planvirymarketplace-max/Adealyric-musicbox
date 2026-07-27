'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/States';
import { toast } from '@/components/ui/Toast';
import {
  Disc3, Music, ShoppingBag, Plus, Link2, Edit3, Eye, EyeOff, Search, ChevronDown, Package
} from 'lucide-react';

// ── MOCK DATA ──

interface AlbumMerch {
  id: string;
  title: string;
  type: string;
  cover_placeholder: string;
  merch_items: {
    total: number;
    published: number;
    draft: number;
  };
  published_status: 'published' | 'partial' | 'draft';
  release_date: string;
}

const MOCK_ALBUMS: AlbumMerch[] = [
  {
    id: 'album-1',
    title: 'Midnight Echoes',
    type: 'album',
    cover_placeholder: 'ME',
    merch_items: { total: 6, published: 4, draft: 2 },
    published_status: 'partial',
    release_date: '2025-03-15',
  },
  {
    id: 'album-2',
    title: 'Neon Dreams',
    type: 'album',
    cover_placeholder: 'ND',
    merch_items: { total: 8, published: 8, draft: 0 },
    published_status: 'published',
    release_date: '2025-01-20',
  },
  {
    id: 'album-3',
    title: 'Golden Hour',
    type: 'single',
    cover_placeholder: 'GH',
    merch_items: { total: 3, published: 0, draft: 3 },
    published_status: 'draft',
    release_date: '2025-06-01',
  },
  {
    id: 'album-4',
    title: 'Velvet Sunset',
    type: 'ep',
    cover_placeholder: 'VS',
    merch_items: { total: 5, published: 5, draft: 0 },
    published_status: 'published',
    release_date: '2024-11-10',
  },
  {
    id: 'album-5',
    title: 'Eclipse',
    type: 'album',
    cover_placeholder: 'EC',
    merch_items: { total: 0, published: 0, draft: 0 },
    published_status: 'draft',
    release_date: '2025-08-22',
  },
];

// ── Color helpers ──
const statusColor = (status: string) =>
  status === 'published' ? 'green' : status === 'partial' ? 'amber' : 'gray';

const statusLabel = (status: string) =>
  status === 'published' ? 'All Published' : status === 'partial' ? 'Partial' : 'Draft';

export function AdminShopAlbumsPage() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const filtered = MOCK_ALBUMS.filter(a => {
    if (typeFilter !== 'all' && a.type !== typeFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return a.title.toLowerCase().includes(q);
    }
    return true;
  });

  const totalMerch = MOCK_ALBUMS.reduce((s, a) => s + a.merch_items.total, 0);
  const totalPublished = MOCK_ALBUMS.reduce((s, a) => s + a.merch_items.published, 0);
  const albumsNoMerch = MOCK_ALBUMS.filter(a => a.merch_items.total === 0).length;

  return (
    <div>
      <PageHeader
        title="Shop — Albums"
        description="Merch associated with each album release. Fans see these on the Shop page under the Albums tab."
        actions={
          <Button
            variant="primary"
            size="sm"
            onClick={() => toast('info', 'Link Merch to Album wizard coming soon')}
          >
            <Link2 size={14} /> Link Merch to Album
          </Button>
        }
      />

      {/* Summary stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center">
              <Disc3 size={20} className="text-neutral-400" />
            </div>
            <div>
              <p className="text-xs text-neutral-400">Albums & Releases</p>
              <p className="text-xl font-bold text-neutral-900">{MOCK_ALBUMS.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center">
              <ShoppingBag size={20} className="text-neutral-400" />
            </div>
            <div>
              <p className="text-xs text-neutral-400">Total Merch Items</p>
              <p className="text-xl font-bold text-neutral-900">{totalMerch}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
              <Eye size={20} className="text-green-500" />
            </div>
            <div>
              <p className="text-xs text-neutral-400">Published to Fans</p>
              <p className="text-xl font-bold text-green-700">{totalPublished}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
              <Package size={20} className="text-red-400" />
            </div>
            <div>
              <p className="text-xs text-neutral-400">No Merch Linked</p>
              <p className="text-xl font-bold text-red-600">{albumsNoMerch}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              placeholder="Search albums..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-neutral-200 rounded-lg focus:outline-none focus:border-neutral-400"
            />
          </div>
          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            className="bg-white border border-neutral-200 text-neutral-900 rounded-lg px-3 py-2 text-sm"
          >
            <option value="all">All Release Types</option>
            <option value="album">Album</option>
            <option value="ep">EP</option>
            <option value="single">Single</option>
          </select>
        </div>
      </Card>

      {/* Album table */}
      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-neutral-50 border-b border-neutral-200">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-neutral-900">Album</th>
                <th className="px-4 py-3 text-left font-semibold text-neutral-900">Type</th>
                <th className="px-4 py-3 text-left font-semibold text-neutral-900">Release Date</th>
                <th className="px-4 py-3 text-left font-semibold text-neutral-900">Merch Items</th>
                <th className="px-4 py-3 text-left font-semibold text-neutral-900">Published Status</th>
                <th className="px-4 py-3 text-left font-semibold text-neutral-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filtered.map(album => (
                <tr key={album.id} className="hover:bg-neutral-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-neutral-400">{album.cover_placeholder}</span>
                      </div>
                      <div>
                        <p className="font-medium text-neutral-900">{album.title}</p>
                        {album.merch_items.total === 0 && (
                          <p className="text-xs text-red-400 mt-0.5">No merch linked yet</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge color="gray" size="sm">{album.type}</Badge>
                  </td>
                  <td className="px-4 py-3 text-neutral-500">{album.release_date}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-neutral-900">{album.merch_items.total}</span>
                      <span className="text-neutral-400">items</span>
                      {album.merch_items.total > 0 && (
                        <div className="flex items-center gap-1 text-xs text-neutral-500">
                          ({album.merch_items.published} published · {album.merch_items.draft} draft)
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge color={statusColor(album.published_status)}>
                      {statusLabel(album.published_status)}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toast('info', `Edit merch for "${album.title}" coming soon`)}
                      >
                        <Edit3 size={14} /> Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toast('info', `Add merch to "${album.title}" coming soon`)}
                      >
                        <Plus size={14} /> Add Merch
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <EmptyState
            icon={<Disc3 size={32} />}
            title="No albums found"
            description="Try adjusting your search or filter."
          />
        )}
      </div>
    </div>
  );
}
