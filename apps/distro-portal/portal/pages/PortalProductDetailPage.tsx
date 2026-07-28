'use client';

import { useState } from 'react';
import { ShoppingBag, ArrowLeft, ArrowRight, ChevronDown, ChevronUp, Plus } from 'lucide-react';
import { formatCents } from '@/lib/format';
import { getProductById, getPublishedProducts, CATEGORY_MAP, FAMILY_LABELS } from '@/lib/product-catalog';
import { useCommerceStore } from '@/lib/commerce-store';
import type { CatalogProduct, ProductFamily } from '@/lib/commerce-store';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Link, useRouter } from '@/lib/router';
import { toast } from '@/components/ui/Toast';

const BADGE_COLORS: Record<string, string> = {
  NEW: 'green',
  BESTSELLER: 'amber',
  TRENDING: 'blue',
  LIMITED: 'purple',
};

export default function PortalProductDetailPage({ productId: propProductId }: { productId?: string }) {
  const { path } = useRouter();
  const { addToCart } = useCommerceStore();

  // Extract product ID from URL if not passed as prop
  const productId = propProductId ?? path.split('/portal/shop/')[1]?.split('/')[0] ?? '';
  const product = getProductById(productId);

  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  // Block fans from viewing BlankApparel products (admin-only stock reference)
  if (product && product.productFamily === 'BlankApparel') {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center">
        <ShoppingBag size={48} className="text-neutral-200 mx-auto mb-4" />
        <p className="text-neutral-400">This product is not available for purchase</p>
        <Link to="/portal/shop" className="inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-900 mt-4">
          <ArrowLeft size={16} /> Back to Shop
        </Link>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center">
        <ShoppingBag size={48} className="text-neutral-200 mx-auto mb-4" />
        <p className="text-neutral-400">Product not found</p>
        <Link to="/portal/shop" className="inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-900 mt-4">
          <ArrowLeft size={16} /> Back to Shop
        </Link>
      </div>
    );
  }

  // Set defaults
  const defaultSize = product.availableSizes.length > 0 ? product.availableSizes[0] : '';
  const defaultColor = product.availableColors.length > 0 ? product.availableColors[0].name : '';
  const currentSize = selectedSize || defaultSize;
  const currentColor = selectedColor || defaultColor;

  // Related products (same family, different category)
  const relatedProducts = getPublishedProducts()
    .filter((p) => p.productFamily === product.productFamily && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    addToCart(product, currentSize, currentColor, 1);
    toast('success', `Added ${product.name} to cart`);
  };

  const hasSizeGuide = product.sizeGuide && Object.keys(product.sizeGuide).length > 0;

  return (
    <div className="max-w-5xl mx-auto py-8">
      <Link to="/portal/shop" className="inline-flex items-center gap-1 text-sm text-neutral-500 hover:text-neutral-900 mb-6">
        <ArrowLeft size={16} /> Back to Shop
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image area */}
        <div>
          <div className="aspect-square bg-neutral-100 rounded-xl overflow-hidden">
            {product.images.length > 0 ? (
              <img src={product.images[activeImageIdx]} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <ShoppingBag size={64} className="text-neutral-300" />
              </div>
            )}
          </div>

          {/* Image thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-2 mt-3">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImageIdx(i)}
                  className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                    i === activeImageIdx ? 'border-neutral-900' : 'border-neutral-200 hover:border-neutral-400'
                  }`}
                >
                  <img src={img} alt={`${product.name} view ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product info */}
        <div>
          {/* Badges */}
          {product.badges.length > 0 && (
            <div className="flex items-center gap-1.5 mb-3">
              {product.badges.map((badge) => (
                <Badge key={badge} color={BADGE_COLORS[badge] ?? 'gray'}>{badge}</Badge>
              ))}
            </div>
          )}

          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 mb-2">{product.name}</h1>

          {/* Meta info */}
          <div className="flex items-center gap-2 mb-4">
            <Badge color="gray">{FAMILY_LABELS[product.productFamily]}</Badge>
            <Badge color="gray">{product.category.replace('POD_', '').replace('_', ' ')}</Badge>
            {product.sku && <span className="text-xs text-neutral-400">SKU: {product.sku}</span>}
          </div>

          <p className="text-neutral-600 leading-relaxed mb-6">{product.description}</p>

          {/* Fabric / Material */}
          {product.fabric && (
            <p className="text-sm text-neutral-500 mb-2"><span className="font-medium text-neutral-700">Fabric:</span> {product.fabric}</p>
          )}
          {product.material && (
            <p className="text-sm text-neutral-500 mb-2"><span className="font-medium text-neutral-700">Material:</span> {product.material}</p>
          )}
          {product.dimensions && (
            <p className="text-sm text-neutral-500 mb-2"><span className="font-medium text-neutral-700">Dimensions:</span> {product.dimensions}</p>
          )}

          {/* Concern tags (beauty) */}
          {product.concernTags && product.concernTags.length > 0 && (
            <div className="mb-4">
              <p className="text-xs font-semibold text-neutral-700 mb-1">Concerns & Ingredients</p>
              <div className="flex flex-wrap gap-1.5">
                {product.concernTags.map((tag) => (
                  <Badge key={tag} color="blue" className="text-xs">{tag}</Badge>
                ))}
              </div>
            </div>
          )}

          {/* Price */}
          <div className="mb-6">
            <span className="text-3xl font-bold text-neutral-900">{formatCents(product.retailPriceCents)}</span>
            {product.wholesalePriceCents > 0 && (
              <span className="text-sm text-neutral-400 ml-2">Wholesale: {formatCents(product.wholesalePriceCents)}</span>
            )}
          </div>

          {/* Size selector */}
          {product.availableSizes.length > 0 && product.productFamily !== 'Beauty' && product.productFamily !== 'Bags' && (
            <div className="mb-4">
              <label className="text-xs font-semibold text-neutral-900 mb-2 block">Size</label>
              <div className="flex flex-wrap gap-1.5">
                {product.availableSizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      currentSize === size ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>

              {/* Size guide toggle */}
              {hasSizeGuide && (
                <button
                  onClick={() => setSizeGuideOpen(!sizeGuideOpen)}
                  className="text-xs text-neutral-500 hover:text-neutral-900 flex items-center gap-1 mt-2"
                >
                  {sizeGuideOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  Size Guide
                </button>
              )}

              {/* Size guide table */}
              {sizeGuideOpen && hasSizeGuide && (
                <div className="mt-3 border border-neutral-200 rounded-lg overflow-hidden">
                  <table className="w-full text-xs">
                    <thead className="bg-neutral-50 border-b border-neutral-200">
                      <tr>
                        <th className="px-3 py-2 text-left font-semibold text-neutral-900">Size</th>
                        {Object.keys(product.sizeGuide[Object.keys(product.sizeGuide)[0]] ?? {}).map((measurement) => (
                          <th key={measurement} className="px-3 py-2 text-left font-semibold text-neutral-900 capitalize">{measurement}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                      {Object.entries(product.sizeGuide).map(([size, measurements]) => (
                        <tr key={size} className="hover:bg-neutral-50">
                          <td className="px-3 py-2 font-medium text-neutral-900">{size}</td>
                          {Object.entries(measurements as Record<string, string>).map(([key, value]) => (
                            <td key={key} className="px-3 py-2 text-neutral-600">{value}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Color selector */}
          {product.availableColors.length > 0 && (
            <div className="mb-4">
              <label className="text-xs font-semibold text-neutral-900 mb-2 block">Color</label>
              <div className="flex flex-wrap gap-1.5">
                {product.availableColors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color.name)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      currentColor === color.name ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                    }`}
                  >
                    <span className="w-4 h-4 rounded-full border border-neutral-300" style={{ backgroundColor: color.hex }} />
                    {color.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Inventory */}
          <div className="flex items-center gap-2 mb-4">
            {product.inventoryCount > 20 ? (
              <Badge color="green">In Stock</Badge>
            ) : product.inventoryCount > 0 ? (
              <Badge color="amber">Only {product.inventoryCount} left</Badge>
            ) : (
              <Badge color="red">Sold Out</Badge>
            )}
          </div>

          {/* Add to Cart */}
          <Button
            variant="primary"
            className="w-full bg-neutral-900 text-white hover:bg-neutral-700 flex items-center justify-center gap-2"
            onClick={handleAddToCart}
            disabled={product.inventoryCount === 0}
          >
            <Plus size={16} /> Add to Cart · {formatCents(product.retailPriceCents)}
          </Button>
        </div>
      </div>

      {/* Related products */}
      {relatedProducts.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-bold text-neutral-900 mb-4">You might also like</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {relatedProducts.map((p) => (
              <Link key={p.id} to={`/portal/shop/${p.id}`} className="group rounded-xl overflow-hidden bg-white border border-neutral-200 hover:border-neutral-300 transition-colors">
                <div className="aspect-square bg-neutral-100 overflow-hidden">
                  {p.images[0] ? (
                    <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center"><ShoppingBag size={24} className="text-neutral-300" /></div>
                  )}
                </div>
                <div className="p-3">
                  <p className="text-sm font-semibold text-neutral-900 truncate">{p.name}</p>
                  <p className="text-lg font-bold text-neutral-900 mt-1">{formatCents(p.retailPriceCents)}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
