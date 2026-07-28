'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/States';
import { toast } from '@/components/ui/Toast';
import {
  Layers, Plus, Handshake, Star, Edit3, Eye, EyeOff, Search, ShoppingBag, Image as ImageIcon
} from 'lucide-react';

// ── MOCK DATA ──

interface CollectionData {
  id: string;
  name: string;
  collab_partner: string | null;
  description: string;
  items_count: number;
  cover_placeholder: string;
  published: boolean;
  featured: boolean;
  created_at: string;
}

const MOCK_COLLECTIONS: CollectionData[] = [
  {
    id: 'col-1',
    name: 'Stella Nova Collab',
    collab_partner: 'Stella Nova Fashion House',
    description: 'Elevated streetwear meets luxury — Stella Nova brings their signature silhouettes to the Luna Vegas universe.',
    items_count: 6,
    cover_placeholder: 'SN',
    published: true,
    featured: true,
    created_at: '2025-04-01',
  },
  {
    id: 'col-2',
    name: 'Luna Vegas Signature Line',
    collab_partner: null,
    description: 'The official Luna Vegas signature collection — every piece designed by the artist herself.',
    items_count: 8,
    cover_placeholder: 'LV',
    published: true,
    featured: false,
    created_at: '2025-02-15',
  },
  {
    id: 'col-3',
    name: 'Velvet Luxe Beauty',
    collab_partner: 'Velvet Luxe Cosmetics',
    description: 'A curated beauty line from Velvet Luxe — lip kits, highlighters, and fragrances inspired by Midnight Echoes.',
    items_count: 4,
    cover_placeholder: 'VL',
    published: false,
    featured: false,
    created_at: '2025-05-20',
  },
  {
    id: 'col-4',
    name: 'Drag Queen Essentials',
    collab_partner: 'House of Dion',
    description: 'Performance-ready wigs, heels, and statement pieces — a collaboration with drag icon House of Dion.',
    items_count: 5,
    cover_placeholder: 'DQ',
    published: false,
    featured: false,
    created_at: '2025-06-10',
  },
];

export function AdminShopCollectionsPage() {
  const [search, setSearch] = useState('');
  const [publishedFilter, setPublishedFilter] = useState<string>('all');

  const filtered = MOCK_COLLECTIONS.filter(c => {
    if (publishedFilter !== 'all') {
      if (publishedFilter === 'published' && !c.published) return false;
      if (publishedFilter === 'draft' && c.published) return false;
    }
    if (search) {
      const q = search.toLowerCase();
      const matchName = c.name.toLowerCase().includes(q);
      const matchPartner = c.collab_partner?.toLowerCase().includes(q) ?? false;
      return matchName || matchPartner;
    }
    return true;
  });

  const publishedCount = MOCK_COLLECTIONS.filter(c => c.published).length;
  const collabCount = MOCK_COLLECTIONS.filter(c => c.collab_partner !== null).length;
  const totalItems = MOCK_COLLECTIONS.reduce((s, c) => s + c.items_count, 0);

  return (
    <div>
      <PageHeader
        title="Shop — Collections"
        description="Curated brand collaborations and signature lines. Fans see these on the Shop page under the Collections tab."
        actions={
          <Button
            variant="primary"
            size="sm"
            onClick={() => toast('info', 'New Collection form coming soon')}
          >
            <Plus size={14} /> New Collection
          </Button>
        }
      />

      {/* Summary stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center">
              <Layers size={20} className="text-neutral-400" />
            </div>
            <div>
              <p className="text-xs text-neutral-400">Collections</p>
              <p className="text-xl font-bold text-neutral-900">{MOCK_COLLECTIONS.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center">
              <Handshake size={20} className="text-teal-500" />
            </div>
            <div>
              <p className="text-xs text-neutral-400">Brand Collabs</p>
              <p className="text-xl font-bold text-teal-700">{collabCount}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
              <Eye size={20} className="text-green-500" />
            </div>
            <div>
              <p className="text-xs text-neutral-400">Published</p>
              <p className="text-xl font-bold text-green-700">{publishedCount}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center">
              <ShoppingBag size={20} className="text-neutral-400" />
            </div>
            <div>
              <p className="text-xs text-neutral-400">Total Items</p>
              <p className="text-xl font-bold text-neutral-900">{totalItems}</p>
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
              placeholder="Search collections or partners..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-neutral-200 rounded-lg focus:outline-none focus:border-neutral-400"
            />
          </div>
          <select
            value={publishedFilter}
            onChange={e => setPublishedFilter(e.target.value)}
            className="bg-white border border-neutral-200 text-neutral-900 rounded-lg px-3 py-2 text-sm"
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </Card>

      {/* Collections card grid */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<Layers size={32} />}
          title="No collections found"
          description="Try adjusting your search or filter, or create a new collection."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(collection => (
            <Card className="p-5" key={collection.id}>
              {/* Cover image placeholder */}
              <div className="w-full h-40 rounded-lg bg-neutral-100 flex items-center justify-center mb-4 overflow-hidden">
                <div className="flex flex-col items-center gap-2">
                  <ImageIcon size={32} className="text-neutral-300" />
                  <span className="text-xs font-bold text-neutral-400">{collection.cover_placeholder}</span>
                </div>
              </div>

              {/* Collection name */}
              <h3 className="text-sm font-semibold text-neutral-900 mb-1">{collection.name}</h3>

              {/* Collab partner — prominently displayed */}
              {collection.collab_partner ? (
                <div className="flex items-center gap-1.5 mb-2">
                  <Handshake size={14} className="text-teal-500" />
                  <span className="text-xs font-medium text-teal-700">{collection.collab_partner}</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 mb-2">
                  <Star size={14} className="text-neutral-400" />
                  <span className="text-xs text-neutral-500">Signature Line</span>
                </div>
              )}

              {/* Description */}
              <p className="text-xs text-neutral-600 mb-3 line-clamp-2">{collection.description}</p>

              {/* Stats row */}
              <div className="flex items-center gap-3 mb-3">
                <Badge color="gray" size="sm">{collection.items_count} items</Badge>
                <Badge color={collection.published ? 'green' : 'amber'} size="sm">
                  {collection.published ? 'Published' : 'Draft'}
                </Badge>
                {collection.featured && <Badge color="purple" size="sm">Featured</Badge>}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-neutral-100">
                <p className="text-xs text-neutral-400">Created {collection.created_at}</p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toast('info', `Edit collection "${collection.name}" coming soon`)}
                  >
                    <Edit3 size={14} /> Edit
                  </Button>
                  {collection.published ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toast('info', `Unpublish "${collection.name}" coming soon`)}
                    >
                      <EyeOff size={14} /> Unpublish
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toast('success', `Published "${collection.name}" to fan shop`)}
                    >
                      <Eye size={14} /> Publish
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
