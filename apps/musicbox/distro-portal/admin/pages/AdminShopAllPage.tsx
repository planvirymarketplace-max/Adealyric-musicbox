'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/States';
import { toast } from '@/components/ui/Toast';
import {
  Package, ShoppingBag, Search, Edit3, Eye, EyeOff, Shirt, Star, Sparkles,
  Watch, Scissors, Footprints, Image as ImageIcon, Plus, Filter
} from 'lucide-react';

// ── MOCK DATA ──

// IA Section 10.1: Product types include hair_wig and footwear as first-class types
type ProductType = 'blank_apparel' | 'pod_apparel' | 'beauty' | 'bag_accessory' | 'hair_wig' | 'footwear';

interface ProductData {
  id: string;
  name: string;
  product_type: ProductType;
  sku: string;
  price_cents: number;
  inventory_count: number;
  published: boolean;
  has_images: boolean;
  description: string;
}

const PRODUCT_TYPE_LABELS: Record<ProductType, string> = {
  blank_apparel: 'Blank Apparel',
  pod_apparel: 'Print-on-Demand Apparel',
  beauty: 'Beauty & Wellness',
  bag_accessory: 'Bag & Accessory',
  hair_wig: 'Hair & Wig',
  footwear: 'Footwear',
};

const PRODUCT_TYPE_ICONS: Record<ProductType, React.ReactNode> = {
  blank_apparel: <Shirt size={14} />,
  pod_apparel: <Shirt size={14} />,
  beauty: <Star size={14} />,
  bag_accessory: <ShoppingBag size={14} />,
  hair_wig: <Scissors size={14} />,
  footwear: <Footprints size={14} />,
};

const PRODUCT_TYPE_COLORS: Record<ProductType, 'blue' | 'gray' | 'purple' | 'green' | 'amber' | 'red' | 'teal' | 'pink'> = {
  blank_apparel: 'gray',
  pod_apparel: 'purple',
  beauty: 'pink',
  bag_accessory: 'teal',
  hair_wig: 'amber',
  footwear: 'blue',
};

const MOCK_PRODUCTS: ProductData[] = [
  { id: 'prod-1', name: 'Luna Vegas Logo Tee', product_type: 'pod_apparel', sku: 'LV-TEE-001', price_cents: 3499, inventory_count: 120, published: true, has_images: true, description: 'Classic black tee with Luna Vegas logo print' },
  { id: 'prod-2', name: 'Midnight Echoes Hoodie', product_type: 'pod_apparel', sku: 'LV-HOO-002', price_cents: 6499, inventory_count: 45, published: true, has_images: true, description: 'Heavy-weight hoodie with album artwork' },
  { id: 'prod-3', name: 'Neon Dreams Crop Top', product_type: 'pod_apparel', sku: 'LV-CRO-003', price_cents: 2999, inventory_count: 80, published: true, has_images: true, description: 'Cropped tank top with neon print design' },
  { id: 'prod-4', name: 'Unisex Heavy Cotton Tee', product_type: 'blank_apparel', sku: 'BL-TEE-001', price_cents: 2499, inventory_count: 200, published: false, has_images: false, description: 'Blank heavyweight cotton tee for custom orders' },
  { id: 'prod-5', name: 'Velvet Lip Kit', product_type: 'beauty', sku: 'VL-LIP-001', price_cents: 3999, inventory_count: 30, published: true, has_images: true, description: '3-piece lip kit inspired by Midnight Echoes album' },
  { id: 'prod-6', name: 'Golden Hour Highlighter', product_type: 'beauty', sku: 'VL-HLT-002', price_cents: 2499, inventory_count: 15, published: true, has_images: true, description: 'Shimmer highlighter palette' },
  { id: 'prod-7', name: 'Luna Vegas Signature Tote', product_type: 'bag_accessory', sku: 'LV-TOT-001', price_cents: 1999, inventory_count: 60, published: true, has_images: true, description: 'Canvas tote bag with signature print' },
  { id: 'prod-8', name: 'Mini Crossbody Clutch', product_type: 'bag_accessory', sku: 'LV-CLU-002', price_cents: 4499, inventory_count: 25, published: true, has_images: true, description: 'Leather crossbody clutch with metal hardware' },
  { id: 'prod-9', name: 'Velvet Cascade Wig', product_type: 'hair_wig', sku: 'HV-WIG-001', price_cents: 5999, inventory_count: 12, published: true, has_images: true, description: 'Long flowing wig in midnight black with velvet texture' },
  { id: 'prod-10', name: 'Neon Pixie Cut Wig', product_type: 'hair_wig', sku: 'HV-WIG-002', price_cents: 4499, inventory_count: 8, published: true, has_images: true, description: 'Short pixie-cut wig with neon color streaks' },
  { id: 'prod-11', name: 'Stage Queen Hair Piece', product_type: 'hair_wig', sku: 'HV-HRP-003', price_cents: 7999, inventory_count: 5, published: false, has_images: false, description: 'Full-volume performance hairpiece with crown volume' },
  { id: 'prod-12', name: 'Platform Stiletto Boots', product_type: 'footwear', sku: 'FW-BOT-001', price_cents: 8999, inventory_count: 18, published: true, has_images: true, description: '6-inch platform stiletto boots in black patent leather' },
  { id: 'prod-13', name: 'Glitter Sneakers', product_type: 'footwear', sku: 'FW-SNK-002', price_cents: 5499, inventory_count: 35, published: true, has_images: true, description: 'High-top sneakers with glitter overlay' },
  { id: 'prod-14', name: 'Eclipse Slip-Ons', product_type: 'footwear', sku: 'FW-SLP-003', price_cents: 3999, inventory_count: 0, published: false, has_images: false, description: 'Casual slip-on shoes with Eclipse album theme' },
  { id: 'prod-15', name: 'Golden Era Sweatpants', product_type: 'pod_apparel', sku: 'LV-SWP-004', price_cents: 4499, inventory_count: 55, published: true, has_images: true, description: 'Relaxed-fit sweatpants with Golden Era print' },
];

// ── Format helper ──
const fmtCents = (cents: number) => `$${(cents / 100).toFixed(2)}`;

export function AdminShopAllPage() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [publishedFilter, setPublishedFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  const filtered = MOCK_PRODUCTS.filter(p => {
    if (typeFilter !== 'all' && p.product_type !== typeFilter) return false;
    if (publishedFilter !== 'all') {
      if (publishedFilter === 'published' && !p.published) return false;
      if (publishedFilter === 'draft' && p.published) return false;
    }
    if (search) {
      const q = search.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
    }
    return true;
  });

  const publishedCount = MOCK_PRODUCTS.filter(p => p.published).length;
  const draftCount = MOCK_PRODUCTS.filter(p => !p.published).length;
  const noImagesCount = MOCK_PRODUCTS.filter(p => !p.has_images).length;
  const lowStockCount = MOCK_PRODUCTS.filter(p => p.inventory_count > 0 && p.inventory_count <= 10).length;

  const allProductTypes: ProductType[] = ['blank_apparel', 'pod_apparel', 'beauty', 'bag_accessory', 'hair_wig', 'footwear'];

  return (
    <div>
      <PageHeader
        title="Shop — Shop All"
        description="Full product catalog with all product types including hair_wig and footwear. Fans see these on the Shop page under the Shop All tab."
        actions={
          <Button
            variant="primary"
            size="sm"
            onClick={() => toast('info', 'Add Product wizard coming soon')}
          >
            <Plus size={14} /> Add Product
          </Button>
        }
      />

      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-6">
        <Card className="p-4">
          <p className="text-xs text-neutral-400">Total SKUs</p>
          <p className="text-xl font-bold text-neutral-900">{MOCK_PRODUCTS.length}</p>
        </Card>
        <Card className="p-4 border-l-4 border-l-emerald-500">
          <p className="text-xs text-neutral-400">Published</p>
          <p className="text-xl font-bold text-emerald-700">{publishedCount}</p>
        </Card>
        <Card className="p-4 border-l-4 border-l-neutral-400">
          <p className="text-xs text-neutral-400">Drafts</p>
          <p className="text-xl font-bold text-neutral-600">{draftCount}</p>
        </Card>
        <Card className="p-4 border-l-4 border-l-red-500">
          <p className="text-xs text-neutral-400">Missing Images</p>
          <p className="text-xl font-bold text-red-600">{noImagesCount}</p>
          {noImagesCount > 0 && <p className="text-xs text-red-400 mt-1">Fans need images!</p>}
        </Card>
        <Card className="p-4 border-l-4 border-l-amber-500">
          <p className="text-xs text-neutral-400">Low Stock</p>
          <p className="text-xl font-bold text-amber-600">{lowStockCount}</p>
          <p className="text-xs text-amber-400 mt-1">≤ 10 units</p>
        </Card>
      </div>

      {/* Product type quick-select cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        {allProductTypes.map(pt => {
          const count = MOCK_PRODUCTS.filter(p => p.product_type === pt).length;
          const published = MOCK_PRODUCTS.filter(p => p.product_type === pt && p.published).length;
          return (
            <button
              key={pt}
              onClick={() => setTypeFilter(typeFilter === pt ? 'all' : pt)}
              className={`p-3 rounded-xl border transition-colors text-left ${
                typeFilter === pt
                  ? 'bg-neutral-900 text-white border-neutral-900'
                  : 'bg-white text-neutral-900 border-neutral-200 hover:border-neutral-300'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className={typeFilter === pt ? 'text-white' : 'text-neutral-400'}>
                  {PRODUCT_TYPE_ICONS[pt]}
                </span>
                <span className="text-sm font-medium">{PRODUCT_TYPE_LABELS[pt]}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs ${typeFilter === pt ? 'text-neutral-300' : 'text-neutral-500'}`}>{count} items</span>
                <span className={`text-xs ${typeFilter === pt ? 'text-neutral-400' : 'text-green-500'}`}>{published} pub</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Filters & view toggle */}
      <Card className="p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <div className="relative flex-1 max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              placeholder="Search by name, SKU..."
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
            <option value="all">All Product Types</option>
            {allProductTypes.map(pt => (
              <option key={pt} value={pt}>{PRODUCT_TYPE_LABELS[pt]}</option>
            ))}
          </select>
          <select
            value={publishedFilter}
            onChange={e => setPublishedFilter(e.target.value)}
            className="bg-white border border-neutral-200 text-neutral-900 rounded-lg px-3 py-2 text-sm"
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
          <div className="flex items-center gap-1 border border-neutral-200 rounded-lg p-1">
            <button
              onClick={() => setViewMode('table')}
              className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                viewMode === 'table' ? 'bg-neutral-900 text-white' : 'text-neutral-500 hover:bg-neutral-100'
              }`}
            >
              Table
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                viewMode === 'grid' ? 'bg-neutral-900 text-white' : 'text-neutral-500 hover:bg-neutral-100'
              }`}
            >
              Grid
            </button>
          </div>
        </div>
      </Card>

      {/* ── TABLE VIEW ── */}
      {viewMode === 'table' && (
        <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-neutral-50 border-b border-neutral-200">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-neutral-900">Product</th>
                  <th className="px-4 py-3 text-left font-semibold text-neutral-900">Type</th>
                  <th className="px-4 py-3 text-left font-semibold text-neutral-900">SKU</th>
                  <th className="px-4 py-3 text-left font-semibold text-neutral-900">Price</th>
                  <th className="px-4 py-3 text-left font-semibold text-neutral-900">Inventory</th>
                  <th className="px-4 py-3 text-left font-semibold text-neutral-900">Images</th>
                  <th className="px-4 py-3 text-left font-semibold text-neutral-900">Status</th>
                  <th className="px-4 py-3 text-left font-semibold text-neutral-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filtered.map(product => (
                  <tr key={product.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-neutral-100 flex items-center justify-center flex-shrink-0">
                          {product.has_images ? (
                            <ImageIcon size={14} className="text-neutral-400" />
                          ) : (
                            <ImageIcon size={14} className="text-red-400" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-neutral-900 truncate">{product.name}</p>
                          <p className="text-xs text-neutral-500 truncate">{product.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge color={PRODUCT_TYPE_COLORS[product.product_type]}>
                        {PRODUCT_TYPE_ICONS[product.product_type]} {PRODUCT_TYPE_LABELS[product.product_type]}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-neutral-500">{product.sku}</td>
                    <td className="px-4 py-3 font-medium text-neutral-900">{fmtCents(product.price_cents)}</td>
                    <td className="px-4 py-3">
                      {product.inventory_count > 20 ? (
                        <Badge color="green" size="sm">{product.inventory_count}</Badge>
                      ) : product.inventory_count > 0 ? (
                        <Badge color="amber" size="sm">{product.inventory_count}</Badge>
                      ) : (
                        <Badge color="red" size="sm">Sold out</Badge>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {product.has_images ? (
                        <Badge color="green" size="sm">Yes</Badge>
                      ) : (
                        <Badge color="red" size="sm">Missing</Badge>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {product.published ? (
                        <Badge color="green" size="sm">Published</Badge>
                      ) : (
                        <Badge color="amber" size="sm">Draft</Badge>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toast('info', `Edit product "${product.name}" coming soon`)}
                        >
                          <Edit3 size={14} /> Edit
                        </Button>
                        {product.published ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toast('info', `Unpublish "${product.name}" coming soon`)}
                          >
                            <EyeOff size={14} />
                          </Button>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toast('success', `Published "${product.name}" to fan shop`)}
                          >
                            <Eye size={14} />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <EmptyState
              icon={<Package size={32} />}
              title="No products found"
              description="Try adjusting your search or filter."
            />
          )}
        </div>
      )}

      {/* ── GRID VIEW ── */}
      {viewMode === 'grid' && (
        filtered.length === 0 ? (
          <EmptyState
            icon={<Package size={32} />}
            title="No products found"
            description="Try adjusting your search or filter."
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map(product => (
              <Card className="p-4" key={product.id}>
                {/* Image placeholder */}
                <div className="w-full h-32 rounded-lg bg-neutral-100 flex items-center justify-center mb-3">
                  {product.has_images ? (
                    <ImageIcon size={28} className="text-neutral-300" />
                  ) : (
                    <div className="text-center">
                      <ImageIcon size={28} className="text-red-300" />
                      <p className="text-xs text-red-400 mt-1">No images</p>
                    </div>
                  )}
                </div>

                {/* Product info */}
                <h4 className="text-sm font-semibold text-neutral-900 mb-1 truncate">{product.name}</h4>
                <p className="text-xs text-neutral-500 mb-2 line-clamp-1">{product.description}</p>

                {/* Type badge */}
                <div className="flex items-center gap-2 mb-2">
                  <Badge color={PRODUCT_TYPE_COLORS[product.product_type]} size="sm">
                    {PRODUCT_TYPE_LABELS[product.product_type]}
                  </Badge>
                  <span className="text-xs text-neutral-400">{product.sku}</span>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-bold text-neutral-900">{fmtCents(product.price_cents)}</span>
                  <div className="flex items-center gap-1.5">
                    {product.inventory_count > 20 ? (
                      <Badge color="green" size="sm">{product.inventory_count} in stock</Badge>
                    ) : product.inventory_count > 0 ? (
                      <Badge color="amber" size="sm">{product.inventory_count} low</Badge>
                    ) : (
                      <Badge color="red" size="sm">Sold out</Badge>
                    )}
                  </div>
                </div>

                {/* Status & Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-neutral-100">
                  <Badge color={product.published ? 'green' : 'amber'} size="sm">
                    {product.published ? 'Published' : 'Draft'}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toast('info', `Edit product "${product.name}" coming soon`)}
                  >
                    <Edit3 size={14} /> Edit
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )
      )}
    </div>
  );
}
