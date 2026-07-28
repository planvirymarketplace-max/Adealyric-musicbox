'use client';

import { useState } from 'react';
import { ShoppingBag, Search, Edit3, Eye, EyeOff, Plus, Package, Image as ImageIcon, DollarSign, Ruler, Upload, CheckCircle2, XCircle, Shield } from 'lucide-react';
import { formatCents } from '@/lib/format';
import { getAllProducts, CATEGORY_MAP, FAMILY_LABELS } from '@/lib/product-catalog';
import type { CatalogProduct, ProductFamily } from '@/lib/commerce-store';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge, StatusBadge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Form';
import { Link } from '@/lib/router';
import { toast } from '@/components/ui/Toast';

// Admin-facing production method labels (fans never see these)
const PRODUCTION_METHOD_LABELS: Record<ProductFamily, string> = {
  BlankApparel: 'Stock Apparel',
  PrintOnDemand: 'Artist-Designed Apparel',
  Beauty: 'Beauty & Wellness',
  Bags: 'Bags & Accessories',
};

const BADGE_COLORS: Record<string, string> = {
  NEW: 'green',
  BESTSELLER: 'amber',
  TRENDING: 'blue',
  LIMITED: 'purple',
};

export default function AdminProductCatalogPage() {
  const [search, setSearch] = useState('');
  const [familyFilter, setFamilyFilter] = useState<string>('all');
  const [publishedFilter, setPublishedFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [imageFilter, setImageFilter] = useState<string>('all'); // has images / no images

  const allProducts = getAllProducts();

  // Apply filters
  const filtered = allProducts.filter((p) => {
    if (familyFilter !== 'all' && p.productFamily !== familyFilter) return false;
    if (publishedFilter !== 'all' && (publishedFilter === 'published' ? !p.isPublished : p.isPublished)) return false;
    if (categoryFilter !== 'all' && p.category !== categoryFilter) return false;
    if (imageFilter === 'has_images' && p.images.length === 0) return false;
    if (imageFilter === 'no_images' && p.images.length > 0) return false;
    if (search) {
      const q = search.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.sku?.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
    }
    return true;
  });

  // Get categories for selected family
  const categoriesForFamily = familyFilter !== 'all' ? (CATEGORY_MAP[familyFilter as ProductFamily]?.categories ?? []) : [];

  // Publish/unpublish handler (mock — will be connected to real API)
  const handleTogglePublish = (product: CatalogProduct) => {
    const newState = !product.isPublished;
    toast(newState ? 'success' : 'info', newState ? `Published "${product.name}" to fan shop` : `Unpublished "${product.name}" from fan shop`);
    // In production this would call the API
  };

  // Stats
  const publishedCount = allProducts.filter(p => p.isPublished).length;
  const draftCount = allProducts.filter(p => !p.isPublished).length;
  const missingImagesCount = allProducts.filter(p => p.images.length === 0).length;
  const missingSizeGuideCount = allProducts.filter(p => Object.keys(p.sizeGuide).length === 0 && p.productFamily !== 'Beauty' && p.productFamily !== 'Bags').length;

  return (
    <div>
      <PageHeader
        title="Merch Product Manager"
        description="Publish products with images, pricing, and size guides to the fan shop"
        actions={
          <Link to="/admin/shop/catalog/new">
            <Button variant="primary" className="flex items-center gap-2 bg-neutral-900 text-white hover:bg-neutral-700">
              <Plus size={16} /> Add Product
            </Button>
          </Link>
        }
      />

      {/* Publishing status overview */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-6">
        <Card className="p-4 border-l-4 border-l-emerald-500">
          <p className="text-xs text-neutral-400">Published to Fans</p>
          <p className="text-xl font-bold text-emerald-700">{publishedCount}</p>
        </Card>
        <Card className="p-4 border-l-4 border-l-neutral-400">
          <p className="text-xs text-neutral-400">Drafts (Hidden)</p>
          <p className="text-xl font-bold text-neutral-600">{draftCount}</p>
        </Card>
        <Card className="p-4 border-l-4 border-l-red-500">
          <p className="text-xs text-neutral-400">Missing Images</p>
          <p className="text-xl font-bold text-red-600">{missingImagesCount}</p>
          {missingImagesCount > 0 && <p className="text-xs text-red-400 mt-1">Fans need images to buy!</p>}
        </Card>
        <Card className="p-4 border-l-4 border-l-amber-500">
          <p className="text-xs text-neutral-400">Missing Size Guide</p>
          <p className="text-xl font-bold text-amber-600">{missingSizeGuideCount}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-neutral-400">Total SKUs</p>
          <p className="text-xl font-bold text-neutral-900">{allProducts.length}</p>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <Input placeholder="Search by name, SKU…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 bg-white border-neutral-200 text-neutral-900" />
          </div>
          <select
            value={familyFilter}
            onChange={(e) => { setFamilyFilter(e.target.value); setCategoryFilter('all'); }}
            className="bg-white border border-neutral-200 text-neutral-900 rounded-lg px-3 py-2 text-sm"
          >
            <option value="all">All Product Types</option>
            <option value="BlankApparel">Stock Apparel</option>
            <option value="PrintOnDemand">Artist-Designed Apparel</option>
            <option value="Beauty">Beauty & Wellness</option>
            <option value="Bags">Bags & Accessories</option>
          </select>
          {categoriesForFamily.length > 0 && (
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-white border border-neutral-200 text-neutral-900 rounded-lg px-3 py-2 text-sm"
            >
              <option value="all">All Categories</option>
              {categoriesForFamily.map((cat) => (
                <option key={cat.name} value={cat.name}>{cat.name.replace('POD_', '').replace('_', ' ')}</option>
              ))}
            </select>
          )}
          <select
            value={publishedFilter}
            onChange={(e) => setPublishedFilter(e.target.value)}
            className="bg-white border border-neutral-200 text-neutral-900 rounded-lg px-3 py-2 text-sm"
          >
            <option value="all">All Status</option>
            <option value="published">Published to Fan Shop</option>
            <option value="draft">Draft (Hidden)</option>
          </select>
          <select
            value={imageFilter}
            onChange={(e) => setImageFilter(e.target.value)}
            className="bg-white border border-neutral-200 text-neutral-900 rounded-lg px-3 py-2 text-sm"
          >
            <option value="all">All Images</option>
            <option value="has_images">Has Images</option>
            <option value="no_images">Missing Images</option>
          </select>
        </div>
      </Card>

      {/* Product table */}
      <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-neutral-50 border-b border-neutral-200">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-neutral-900">Product</th>
                <th className="px-4 py-3 text-left font-semibold text-neutral-900">Production</th>
                <th className="px-4 py-3 text-left font-semibold text-neutral-900">Category</th>
                <th className="px-4 py-3 text-left font-semibold text-neutral-900">SKU</th>
                <th className="px-4 py-3 text-left font-semibold text-neutral-900">Retail Price</th>
                <th className="px-4 py-3 text-left font-semibold text-neutral-900">Images</th>
                <th className="px-4 py-3 text-left font-semibold text-neutral-900">Size Guide</th>
                <th className="px-4 py-3 text-left font-semibold text-neutral-900">Inventory</th>
                <th className="px-4 py-3 text-left font-semibold text-neutral-900">Fan Shop</th>
                <th className="px-4 py-3 text-left font-semibold text-neutral-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filtered.map((product) => (
                <tr key={product.id} className="hover:bg-neutral-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-neutral-100 overflow-hidden flex-shrink-0">
                        {product.images[0] ? (
                          <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center"><ImageIcon size={16} className="text-red-400" /></div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-neutral-900 truncate">{product.name}</p>
                        {product.badges.length > 0 && (
                          <div className="flex items-center gap-1 mt-0.5">
                            {product.badges.map((b) => (
                              <Badge key={b} color={BADGE_COLORS[b] ?? 'gray'} className="text-xs">{b}</Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-neutral-600 text-xs">{PRODUCTION_METHOD_LABELS[product.productFamily]}</td>
                  <td className="px-4 py-3 text-neutral-600">{product.category.replace('POD_', '').replace('_', ' ')}</td>
                  <td className="px-4 py-3 text-neutral-500">{product.sku ?? '—'}</td>
                  <td className="px-4 py-3">
                    <span className="font-medium text-neutral-900">{formatCents(product.retailPriceCents)}</span>
                    {product.wholesalePriceCents > 0 && (
                      <span className="text-xs text-neutral-400 ml-1">WS: {formatCents(product.wholesalePriceCents)}</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {product.images.length > 0 ? (
                      <Badge color="green">{product.images.length} img</Badge>
                    ) : (
                      <Badge color="red">0 img</Badge>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {(product.productFamily === 'Beauty' || product.productFamily === 'Bags') ? (
                      <Badge color="gray">N/A</Badge>
                    ) : Object.keys(product.sizeGuide).length > 0 ? (
                      <Badge color="green">Yes</Badge>
                    ) : (
                      <Badge color="amber">Missing</Badge>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {product.inventoryCount > 20 ? <Badge color="green">{product.inventoryCount}</Badge> : product.inventoryCount > 0 ? <Badge color="amber">{product.inventoryCount}</Badge> : <Badge color="red">0</Badge>}
                  </td>
                  <td className="px-4 py-3">
                    {product.productFamily === 'BlankApparel' ? (
                      <span className="flex items-center gap-1 text-xs font-medium text-amber-600">
                        <Shield size={14} /> Admin Only
                      </span>
                    ) : (
                      <button
                        onClick={() => handleTogglePublish(product)}
                        className={`flex items-center gap-1 text-xs font-medium transition-colors ${
                          product.isPublished ? 'text-emerald-600 hover:text-emerald-700' : 'text-neutral-400 hover:text-neutral-600'
                        }`}
                      >
                        {product.isPublished ? <><Eye size={14} /> Visible</> : <><EyeOff size={14} /> Hidden</>}
                      </button>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Link to={`/admin/shop/catalog/${product.id}`} className="p-1.5 rounded-lg hover:bg-neutral-200 text-neutral-500 transition-colors" title="Edit product">
                        <Edit3 size={14} />
                      </Link>
                      {product.images.length === 0 && (
                        <button className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 transition-colors" title="Upload images">
                          <Upload size={14} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12">
            <Package size={32} className="text-neutral-200 mx-auto mb-3" />
            <p className="text-neutral-400">No products found</p>
          </div>
        )}
      </div>
    </div>
  );
}
