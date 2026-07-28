'use client';

import { useState } from 'react';
import { Search, ShoppingBag, Filter, X, ChevronDown, Star, Sparkles, ArrowRight, Wallet, ShoppingBag as CartIcon, Music as MusicIcon } from 'lucide-react';
import { formatCents } from '@/lib/format';
import { useCommerceStore } from '@/lib/commerce-store';
import { getPublishedProducts, FAN_CATEGORY_MAP } from '@/lib/product-catalog';
import type { CatalogProduct, ProductFamily } from '@/lib/commerce-store';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Form';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Link } from '@/lib/router';
import { toast } from '@/components/ui/Toast';

// Fan-facing categories (NOT "BlankApparel" / "PrintOnDemand")
type FanCategory = 'Music' | 'Apparel' | 'Beauty' | 'Bags';

const FAN_CATEGORY_KEYS: FanCategory[] = ['Music', 'Apparel', 'Beauty', 'Bags'];

const FAN_CATEGORY_LABELS: Record<FanCategory, string> = {
  Music: 'Music & Audio',
  Apparel: 'Apparel & Merch',
  Beauty: 'Beauty & Wellness',
  Bags: 'Bags & Accessories',
};

const FAN_CATEGORY_ICONS: Record<FanCategory, React.ReactNode> = {
  Music: <MusicIcon size={16} />,
  Apparel: <ShoppingBag size={16} />,
  Beauty: <Star size={16} />,
  Bags: <Sparkles size={16} />,
};

// Map internal ProductFamily → fan-facing FanCategory (BlankApparel/PrintOnDemand are NEVER shown to fans)
const FAMILY_TO_FAN_CATEGORY: Record<ProductFamily, FanCategory> = {
  BlankApparel: 'Apparel', // filtered out by getPublishedProducts()
  PrintOnDemand: 'Apparel', // filtered out by getPublishedProducts()
  Music: 'Music',
  FinishedMerch: 'Apparel',
  Beauty: 'Beauty',
  Bags: 'Bags',
};

const BADGE_COLORS: Record<string, string> = {
  NEW: 'green',
  BESTSELLER: 'amber',
  TRENDING: 'blue',
  LIMITED: 'purple',
};

export default function PortalShopPageNew() {
  const { addToCart, wallet, cartItemCount } = useCommerceStore();
  const allProducts = getPublishedProducts();
  const itemCount = cartItemCount();

  // Filter state
  const [activeCategory, setActiveCategory] = useState<FanCategory>('Apparel');
  const [activeSubCategory, setActiveSubCategory] = useState<string>('all');
  const [activeSizes, setActiveSizes] = useState<string[]>([]);
  const [activeBadges, setActiveBadges] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);

  // Quick add-to-cart modal
  const [quickAddProduct, setQuickAddProduct] = useState<CatalogProduct | null>(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');

  // Map product to fan-facing category
  const getFanCategory = (p: CatalogProduct): FanCategory => FAMILY_TO_FAN_CATEGORY[p.productFamily] ?? 'Apparel';

  // Filter products by fan-facing category
  const filtered = allProducts.filter((p) => {
    if (getFanCategory(p) !== activeCategory) return false;
    if (activeSubCategory !== 'all' && p.category !== activeSubCategory) return false;
    if (activeSizes.length > 0 && !p.availableSizes.some((s) => activeSizes.includes(s))) return false;
    if (activeBadges.length > 0 && !p.badges.some((b) => activeBadges.includes(b))) return false;
    if (p.retailPriceCents < priceRange[0] || p.retailPriceCents > priceRange[1]) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || (p.sku?.toLowerCase().includes(q) ?? false);
    }
    return true;
  });

  // Get subcategories for the current fan-facing category
  const subCategoriesForCategory = FAN_CATEGORY_MAP[activeCategory] ?? [];

  const handleQuickAdd = () => {
    if (!quickAddProduct) return;
    const size = selectedSize || (quickAddProduct.availableSizes.length > 0 ? quickAddProduct.availableSizes[0] : '');
    const color = selectedColor || (quickAddProduct.availableColors.length > 0 ? quickAddProduct.availableColors[0].name : '');
    addToCart(quickAddProduct, size, color, 1);
    toast('success', `Added ${quickAddProduct.name} to cart`);
    setQuickAddProduct(null);
    setSelectedSize('');
    setSelectedColor('');
  };

  const toggleSize = (size: string) => {
    setActiveSizes((prev) => prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]);
  };

  const toggleBadge = (badge: string) => {
    setActiveBadges((prev) => prev.includes(badge) ? prev.filter((b) => b !== badge) : [...prev, badge]);
  };

  const allBadgeOptions = ['NEW', 'BESTSELLER', 'TRENDING', 'LIMITED'];

  const showSizeFilters = activeCategory === 'Apparel';

  return (
    <div className="py-8">
      {/* Unified search bar at top */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-neutral-900 mb-4">Shop</h1>
        <div className="relative max-w-2xl">
          <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            placeholder="Search merch, accessories, beauty..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 text-sm bg-white border border-neutral-200 rounded-xl focus:outline-none focus:border-neutral-400 focus:ring-2 focus:ring-neutral-100 transition-colors"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600">
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Category tabs */}
      <div className="flex items-center gap-2 mb-6">
        {FAN_CATEGORY_KEYS.map((cat) => (
          <button
            key={cat}
            onClick={() => { setActiveCategory(cat); setActiveSubCategory('all'); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeCategory === cat
                ? 'bg-neutral-900 text-white'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 hover:text-neutral-900'
            }`}
          >
            {FAN_CATEGORY_ICONS[cat]} {FAN_CATEGORY_LABELS[cat]}
          </button>
        ))}
      </div>

      <div className="flex gap-6">
        {/* Left sidebar — filters */}
        <aside className="hidden lg:block w-56 flex-shrink-0">
          <div className="bg-white border border-neutral-200 rounded-xl p-4 space-y-5 sticky top-24">
            {/* Subcategory filters */}
            {subCategoriesForCategory.length > 1 && (
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2 block">Type</label>
                <div className="space-y-0.5">
                  <button
                    onClick={() => setActiveSubCategory('all')}
                    className={`px-3 py-1.5 rounded-lg text-sm w-full text-left transition-colors ${
                      activeSubCategory === 'all' ? 'bg-neutral-100 text-neutral-900 font-medium' : 'text-neutral-500 hover:bg-neutral-50'
                    }`}
                  >
                    All
                  </button>
                  {subCategoriesForCategory.map((sub) => (
                    <button
                      key={sub}
                      onClick={() => setActiveSubCategory(sub)}
                      className={`px-3 py-1.5 rounded-lg text-sm w-full text-left transition-colors ${
                        activeSubCategory === sub ? 'bg-neutral-100 text-neutral-900 font-medium' : 'text-neutral-500 hover:bg-neutral-50'
                      }`}
                    >
                      {sub}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size filters (Apparel only) */}
            {showSizeFilters && (
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2 block">Size</label>
                <div className="flex flex-wrap gap-1.5">
                  {['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'].map((size) => (
                    <button
                      key={size}
                      onClick={() => toggleSize(size)}
                      className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                        activeSizes.includes(size) ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Badge filters */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2 block">Tag</label>
              <div className="flex flex-wrap gap-1.5">
                {allBadgeOptions.map((badge) => (
                  <button
                    key={badge}
                    onClick={() => toggleBadge(badge)}
                    className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                      activeBadges.includes(badge) ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                    }`}
                  >
                    {badge}
                  </button>
                ))}
              </div>
            </div>

            {/* Price range */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2 block">Price</label>
              <div className="flex items-center gap-2">
                <select
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                  className="text-xs bg-neutral-100 border border-neutral-200 rounded px-2 py-1.5"
                >
                  <option value={0}>$0</option>
                  <option value={1000}>$10</option>
                  <option value={2000}>$20</option>
                  <option value={3000}>$30</option>
                  <option value={5000}>$50</option>
                </select>
                <span className="text-xs text-neutral-400">—</span>
                <select
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                  className="text-xs bg-neutral-100 border border-neutral-200 rounded px-2 py-1.5"
                >
                  <option value={2000}>$20</option>
                  <option value={5000}>$50</option>
                  <option value={8000}>$80</option>
                  <option value={10000}>$100</option>
                </select>
              </div>
            </div>

            {/* Clear filters */}
            <button
              onClick={() => { setActiveSubCategory('all'); setActiveSizes([]); setActiveBadges([]); setSearchQuery(''); setPriceRange([0, 10000]); }}
              className="text-xs text-neutral-400 hover:text-neutral-900 transition-colors"
            >
              Clear all filters
            </button>
          </div>
        </aside>

        {/* Product grid */}
        <div className="flex-1">
          {/* Results count */}
          <p className="text-sm text-neutral-400 mb-4">{filtered.length} items in {FAN_CATEGORY_LABELS[activeCategory]}</p>

          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <ShoppingBag size={48} className="text-neutral-200 mx-auto mb-4" />
              <p className="text-neutral-400">No products found with current filters</p>
              <button onClick={() => { setActiveSubCategory('all'); setActiveSizes([]); setActiveBadges([]); setSearchQuery(''); }} className="text-sm text-neutral-600 hover:text-neutral-900 mt-2">
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {filtered.map((product) => (
                <div key={product.id} className="group rounded-xl overflow-hidden bg-white border border-neutral-200 hover:border-neutral-300 transition-colors">
                  {/* Image */}
                  <Link to={`/portal/shop/${product.id}`}>
                    <div className="aspect-square bg-neutral-100 overflow-hidden">
                      {product.images[0] ? (
                        <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ShoppingBag size={32} className="text-neutral-300" />
                        </div>
                      )}
                    </div>
                  </Link>

                  {/* Info */}
                  <div className="p-3">
                    <Link to={`/portal/shop/${product.id}`} className="text-sm font-semibold text-neutral-900 hover:text-neutral-700 truncate block">
                      {product.name}
                    </Link>
                    <p className="text-xs text-neutral-400 mt-0.5">{product.category.replace('POD_', '').replace('_', ' ')}</p>

                    {/* Badges */}
                    {product.badges.length > 0 && (
                      <div className="flex items-center gap-1 mt-1.5">
                        {product.badges.map((badge) => (
                          <Badge key={badge} color={BADGE_COLORS[badge] ?? 'gray'} className="text-xs">{badge}</Badge>
                        ))}
                      </div>
                    )}

                    {/* Price + Quick add */}
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-lg font-bold text-neutral-900">{formatCents(product.retailPriceCents)}</span>
                      <button
                        onClick={() => {
                          setQuickAddProduct(product);
                          setSelectedSize(product.availableSizes[0] ?? '');
                          setSelectedColor(product.availableColors[0]?.name ?? '');
                        }}
                        className="px-3 py-1.5 rounded-lg bg-neutral-900 text-white text-xs font-medium hover:bg-neutral-700 transition-colors"
                      >
                        Add
                      </button>
                    </div>

                    {/* Size availability hint */}
                    {product.availableSizes.length > 0 && activeCategory === 'Apparel' && (
                      <p className="text-xs text-neutral-400 mt-1">{product.availableSizes.join(' · ')}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Second sidebar — Cart & Wallet summary */}
        <aside className="hidden xl:block w-48 flex-shrink-0">
          <div className="space-y-4 sticky top-24">
            {/* Wallet card */}
            <Link to="/portal/wallet">
              <Card className="p-4 hover:border-neutral-300 transition-colors cursor-pointer">
                <div className="flex items-center gap-2 mb-2">
                  <Wallet size={16} className="text-emerald-600" />
                  <span className="text-xs font-semibold text-neutral-900">Wallet</span>
                </div>
                <p className="text-lg font-bold text-neutral-900">{formatCents(wallet.balanceCents)}</p>
                <p className="text-xs text-neutral-400 mt-1">Available balance</p>
              </Card>
            </Link>

            {/* Cart card */}
            <Link to="/portal/cart">
              <Card className="p-4 hover:border-neutral-300 transition-colors cursor-pointer">
                <div className="flex items-center gap-2 mb-2">
                  <CartIcon size={16} className="text-neutral-600" />
                  <span className="text-xs font-semibold text-neutral-900">Cart</span>
                  {itemCount > 0 && (
                    <span className="ml-auto text-xs bg-emerald-600 text-white px-1.5 py-0.5 rounded-full font-bold">
                      {itemCount}
                    </span>
                  )}
                </div>
                {itemCount > 0 ? (
                  <p className="text-sm font-medium text-neutral-900">{itemCount} item(s)</p>
                ) : (
                  <p className="text-xs text-neutral-400">Your cart is empty</p>
                )}
              </Card>
            </Link>

            {/* Quick links */}
            <div className="bg-white border border-neutral-200 rounded-xl p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-3">Quick Links</p>
              <div className="space-y-2">
                <Link to="/portal/orders" className="text-xs text-neutral-600 hover:text-neutral-900 flex items-center gap-2">
                  <ShoppingBag size={12} /> Order History
                </Link>
                <Link to="/portal/wallet" className="text-xs text-neutral-600 hover:text-neutral-900 flex items-center gap-2">
                  <Wallet size={12} /> Top Up Wallet
                </Link>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Mobile filter toggle */}
      <div className="lg:hidden mt-4">
        <button
          onClick={() => {
            // On mobile, we'll show filters inline by toggling a state
          }}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-neutral-100 text-neutral-700 text-sm font-medium"
        >
          <Filter size={16} /> Filters
        </button>
      </div>

      {/* Quick Add-to-Cart Modal */}
      {quickAddProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30" onClick={() => setQuickAddProduct(null)} />
          <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden">
            {/* Product image */}
            <div className="aspect-video bg-neutral-100 overflow-hidden">
              {quickAddProduct.images[0] ? (
                <img src={quickAddProduct.images[0]} alt={quickAddProduct.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ShoppingBag size={40} className="text-neutral-300" />
                </div>
              )}
            </div>

            <div className="p-5 space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-neutral-900">{quickAddProduct.name}</h3>
                <p className="text-sm text-neutral-500 mt-1">{formatCents(quickAddProduct.retailPriceCents)}</p>
              </div>

              {/* Size selector */}
              {quickAddProduct.availableSizes.length > 0 && getFanCategory(quickAddProduct) === 'Apparel' && (
                <div>
                  <label className="text-xs font-semibold text-neutral-900 mb-2 block">Size</label>
                  <div className="flex flex-wrap gap-1.5">
                    {quickAddProduct.availableSizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                          selectedSize === size ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Color selector */}
              {quickAddProduct.availableColors.length > 0 && (
                <div>
                  <label className="text-xs font-semibold text-neutral-900 mb-2 block">Color</label>
                  <div className="flex flex-wrap gap-1.5">
                    {quickAddProduct.availableColors.map((color) => (
                      <button
                        key={color.name}
                        onClick={() => setSelectedColor(color.name)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                          selectedColor === color.name ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                        }`}
                      >
                        <span className="w-4 h-4 rounded-full" style={{ backgroundColor: color.hex }} />
                        {color.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3">
                <Button variant="primary" className="flex-1 bg-neutral-900 text-white hover:bg-neutral-700" onClick={handleQuickAdd}>
                  Add to Cart
                </Button>
                <Button variant="outline" onClick={() => setQuickAddProduct(null)}>
                  Cancel
                </Button>
              </div>

              <Link to={`/portal/shop/${quickAddProduct.id}`} className="text-xs text-neutral-500 hover:text-neutral-900 flex items-center gap-1">
                View full details <ArrowRight size={12} />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
