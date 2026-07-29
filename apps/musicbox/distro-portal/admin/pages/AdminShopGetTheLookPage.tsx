'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/States';
import { toast } from '@/components/ui/Toast';
import { Link } from '@/lib/router';
import {
  Sparkles, Plus, Shirt, Scissors, Footprints, ShoppingBag, Edit3, Eye, EyeOff,
  Search, Image as ImageIcon, Star, ChevronRight, Layers
} from 'lucide-react';

// ── MOCK DATA ──

// IA Section 10.2: Slot assignments — Top, Bottom, Bag, Hair (hair_wig), Shoes (footwear)
type LookSlot = 'top' | 'bottom' | 'bag' | 'hair' | 'shoes' | 'outerwear' | 'accessory';

interface LookComponent {
  slot: LookSlot;
  product_id: string;
  product_name: string;
  product_type: string;
  price_cents: number;
  in_stock: number;
}

interface LookData {
  id: string;
  name: string;
  components: LookComponent[];
  combined_price_cents: number;
  min_stock: number;
  published: boolean;
  featured: boolean;
  created_at: string;
}

const SLOT_LABELS: Record<LookSlot, string> = {
  top: 'Top',
  bottom: 'Bottom',
  bag: 'Bag',
  hair: 'Hair / Wig',
  shoes: 'Shoes',
  outerwear: 'Outerwear',
  accessory: 'Accessory',
};

const SLOT_ICONS: Record<LookSlot, React.ReactNode> = {
  top: <Shirt size={14} />,
  bottom: <Shirt size={14} />,
  bag: <ShoppingBag size={14} />,
  hair: <Scissors size={14} />,
  shoes: <Footprints size={14} />,
  outerwear: <Layers size={14} />,
  accessory: <Star size={14} />,
};

const SLOT_COLORS: Record<LookSlot, string> = {
  top: 'purple',
  bottom: 'teal',
  bag: 'gray',
  hair: 'amber',
  shoes: 'blue',
  outerwear: 'pink',
  accessory: 'green',
};

const MOCK_LOOKS: LookData[] = [
  {
    id: 'look-1',
    name: 'Midnight Velvet Set',
    components: [
      { slot: 'top', product_id: 'prod-3', product_name: 'Neon Dreams Crop Top', product_type: 'pod_apparel', price_cents: 2999, in_stock: 80 },
      { slot: 'bottom', product_id: 'prod-15', product_name: 'Golden Era Sweatpants', product_type: 'pod_apparel', price_cents: 4499, in_stock: 55 },
      { slot: 'bag', product_id: 'prod-8', product_name: 'Mini Crossbody Clutch', product_type: 'bag_accessory', price_cents: 4499, in_stock: 25 },
      { slot: 'hair', product_id: 'prod-9', product_name: 'Velvet Cascade Wig', product_type: 'hair_wig', price_cents: 5999, in_stock: 12 },
      { slot: 'shoes', product_id: 'prod-12', product_name: 'Platform Stiletto Boots', product_type: 'footwear', price_cents: 8999, in_stock: 18 },
    ],
    combined_price_cents: 26995,
    min_stock: 12,
    published: true,
    featured: true,
    created_at: '2025-04-15',
  },
  {
    id: 'look-2',
    name: 'Era Glitter Ensemble',
    components: [
      { slot: 'top', product_id: 'prod-2', product_name: 'Midnight Echoes Hoodie', product_type: 'pod_apparel', price_cents: 6499, in_stock: 45 },
      { slot: 'bottom', product_id: 'prod-15', product_name: 'Golden Era Sweatpants', product_type: 'pod_apparel', price_cents: 4499, in_stock: 55 },
      { slot: 'hair', product_id: 'prod-10', product_name: 'Neon Pixie Cut Wig', product_type: 'hair_wig', price_cents: 4499, in_stock: 8 },
      { slot: 'shoes', product_id: 'prod-13', product_name: 'Glitter Sneakers', product_type: 'footwear', price_cents: 5499, in_stock: 35 },
      { slot: 'bag', product_id: 'prod-7', product_name: 'Luna Vegas Signature Tote', product_type: 'bag_accessory', price_cents: 1999, in_stock: 60 },
    ],
    combined_price_cents: 22895,
    min_stock: 8,
    published: false,
    featured: false,
    created_at: '2025-05-10',
  },
  {
    id: 'look-3',
    name: 'Stage Performance Look',
    components: [
      { slot: 'top', product_id: 'prod-1', product_name: 'Luna Vegas Logo Tee', product_type: 'pod_apparel', price_cents: 3499, in_stock: 120 },
      { slot: 'bottom', product_id: 'prod-3', product_name: 'Neon Dreams Crop Top', product_type: 'pod_apparel', price_cents: 2999, in_stock: 80 },
      { slot: 'hair', product_id: 'prod-11', product_name: 'Stage Queen Hair Piece', product_type: 'hair_wig', price_cents: 7999, in_stock: 5 },
      { slot: 'shoes', product_id: 'prod-12', product_name: 'Platform Stiletto Boots', product_type: 'footwear', price_cents: 8999, in_stock: 18 },
    ],
    combined_price_cents: 23496,
    min_stock: 5,
    published: true,
    featured: false,
    created_at: '2025-06-01',
  },
  {
    id: 'look-4',
    name: 'Casual Day Walk',
    components: [
      { slot: 'top', product_id: 'prod-1', product_name: 'Luna Vegas Logo Tee', product_type: 'pod_apparel', price_cents: 3499, in_stock: 120 },
      { slot: 'bottom', product_id: 'prod-15', product_name: 'Golden Era Sweatpants', product_type: 'pod_apparel', price_cents: 4499, in_stock: 55 },
      { slot: 'shoes', product_id: 'prod-13', product_name: 'Glitter Sneakers', product_type: 'footwear', price_cents: 5499, in_stock: 35 },
      { slot: 'bag', product_id: 'prod-7', product_name: 'Luna Vegas Signature Tote', product_type: 'bag_accessory', price_cents: 1999, in_stock: 60 },
    ],
    combined_price_cents: 15396,
    min_stock: 35,
    published: true,
    featured: false,
    created_at: '2025-06-20',
  },
];

// ── Format helper ──
const fmtCents = (cents: number) => `$${(cents / 100).toFixed(2)}`;

export function AdminShopGetTheLookPage() {
  const [search, setSearch] = useState('');
  const [publishedFilter, setPublishedFilter] = useState<string>('all');

  const filtered = MOCK_LOOKS.filter(l => {
    if (publishedFilter !== 'all') {
      if (publishedFilter === 'published' && !l.published) return false;
      if (publishedFilter === 'draft' && l.published) return false;
    }
    if (search) {
      const q = search.toLowerCase();
      return l.name.toLowerCase().includes(q) ||
        l.components.some(c => c.product_name.toLowerCase().includes(q));
    }
    return true;
  });

  const publishedCount = MOCK_LOOKS.filter(l => l.published).length;
  const draftCount = MOCK_LOOKS.filter(l => !l.published).length;
  const featuredCount = MOCK_LOOKS.filter(l => l.featured).length;
  const totalComponents = MOCK_LOOKS.reduce((s, l) => s + l.components.length, 0);

  return (
    <div>
      <PageHeader
        title="Shop — Get the Look"
        description="Full outfit bundles — hair/wig, top, bottom, shoes, bag. A Look is a bundle view, not a duplicate of the inventory. Fans see these on the Shop page under the Get the Look tab."
        actions={
          <Link to="/admin/shop/new-look">
            <Button variant="primary" size="sm">
              <Plus size={14} /> New Look
            </Button>
          </Link>
        }
      />

      {/* Summary stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center">
              <Sparkles size={20} className="text-neutral-400" />
            </div>
            <div>
              <p className="text-xs text-neutral-400">Looks</p>
              <p className="text-xl font-bold text-neutral-900">{MOCK_LOOKS.length}</p>
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
            <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
              <Star size={20} className="text-purple-500" />
            </div>
            <div>
              <p className="text-xs text-neutral-400">Featured</p>
              <p className="text-xl font-bold text-purple-700">{featuredCount}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center">
              <Layers size={20} className="text-neutral-400" />
            </div>
            <div>
              <p className="text-xs text-neutral-400">Component Products</p>
              <p className="text-xl font-bold text-neutral-900">{totalComponents}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* IA Section 10.2 note */}
      <Card className="p-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
            <Sparkles size={16} className="text-amber-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-neutral-900">How Get the Look works</p>
            <p className="text-xs text-neutral-500 mt-0.5">
              Each Look is a bundle view combining Top + Bottom + optional Bag, Hair/Wig, Shoes, and Outerwear slots. Component products remain independently purchasable under Shop All. Publishing a Look creates one new SKU — price is the sum of component prices, stock is the minimum in-stock quantity across components.
            </p>
          </div>
        </div>
      </Card>

      {/* Filters */}
      <Card className="p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              placeholder="Search looks or component products..."
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

      {/* Looks card grid */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<Sparkles size={32} />}
          title="No looks found"
          description="Try adjusting your search or filter, or create a new look."
          action={
            <Link to="/admin/shop/new-look">
              <Button variant="primary" size="sm">
                <Plus size={14} /> New Look
              </Button>
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(look => (
            <Card className="p-5" key={look.id}>
              {/* Look image placeholder */}
              <div className="w-full h-44 rounded-lg bg-neutral-100 flex items-center justify-center mb-4 overflow-hidden relative">
                <div className="flex flex-col items-center gap-2">
                  <Sparkles size={32} className="text-neutral-300" />
                  <span className="text-xs font-bold text-neutral-400">{look.name}</span>
                </div>
                {/* Featured badge overlay */}
                {look.featured && (
                  <div className="absolute top-2 right-2">
                    <Badge color="purple" size="sm">Featured</Badge>
                  </div>
                )}
              </div>

              {/* Look name */}
              <h3 className="text-sm font-semibold text-neutral-900 mb-2">{look.name}</h3>

              {/* Component items — slot layout (IA Section 10.2 tile-picker reference) */}
              <div className="space-y-1.5 mb-3">
                {look.components.map(comp => (
                  <div key={comp.slot} className="flex items-center gap-2 p-2 rounded-lg bg-neutral-50 border border-neutral-100">
                    <div className={`w-6 h-6 rounded flex items-center justify-center flex-shrink-0 ${
                      SLOT_COLORS[comp.slot] === 'purple' ? 'bg-purple-100 text-purple-600' :
                      SLOT_COLORS[comp.slot] === 'teal' ? 'bg-teal-100 text-teal-600' :
                      SLOT_COLORS[comp.slot] === 'amber' ? 'bg-amber-100 text-amber-600' :
                      SLOT_COLORS[comp.slot] === 'blue' ? 'bg-blue-100 text-blue-600' :
                      SLOT_COLORS[comp.slot] === 'pink' ? 'bg-pink-100 text-pink-600' :
                      SLOT_COLORS[comp.slot] === 'green' ? 'bg-green-100 text-green-600' :
                      'bg-neutral-100 text-neutral-600'
                    }`}>
                      {SLOT_ICONS[comp.slot]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-neutral-900 truncate">{comp.product_name}</p>
                      <p className="text-xs text-neutral-400">{SLOT_LABELS[comp.slot]} · {comp.product_type}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-xs font-medium text-neutral-900">{fmtCents(comp.price_cents)}</p>
                      {comp.in_stock <= 10 && comp.in_stock > 0 && (
                        <p className="text-xs text-amber-600">Low: {comp.in_stock}</p>
                      )}
                      {comp.in_stock === 0 && (
                        <p className="text-xs text-red-600">Sold out</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Combined price & stock */}
              <div className="flex items-center justify-between py-2 border-t border-neutral-100">
                <div>
                  <p className="text-xs text-neutral-400 uppercase font-medium">Combined Price</p>
                  <p className="text-lg font-bold text-neutral-900">{fmtCents(look.combined_price_cents)}</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-400 uppercase font-medium">Min Stock</p>
                  {look.min_stock > 20 ? (
                    <p className="text-lg font-bold text-green-700">{look.min_stock}</p>
                  ) : look.min_stock > 0 ? (
                    <p className="text-lg font-bold text-amber-600">{look.min_stock}</p>
                  ) : (
                    <p className="text-lg font-bold text-red-600">0</p>
                  )}
                </div>
              </div>

              {/* Status & Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-neutral-100">
                <Badge color={look.published ? 'green' : 'amber'} size="sm">
                  {look.published ? 'Published' : 'Draft'}
                </Badge>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toast('info', `Edit Look "${look.name}" coming soon`)}
                  >
                    <Edit3 size={14} /> Edit
                  </Button>
                  {look.published ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toast('info', `Unpublish Look "${look.name}" coming soon`)}
                    >
                      <EyeOff size={14} /> Unpublish
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toast('success', `Published Look "${look.name}" to fan shop`)}
                    >
                      <Eye size={14} /> Publish
                    </Button>
                  )}
                </div>
              </div>

              {/* Footer */}
              <p className="text-xs text-neutral-400 mt-3">Created {look.created_at}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
