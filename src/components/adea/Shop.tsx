"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { PageShell } from "./SiteChrome";
import { useAppStore } from "@/lib/store";
import {
  SHOP_ALBUMS,
  ALL_PRODUCTS,
  ALL_CATEGORIES,
  SHOP_TABS,
  type ShopProduct,
  type ShopAlbum,
} from "@/lib/catalog";
import { Play, Plus, X, ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";

/* ═══════════════════════════════════════════════════
   STREAMING OVERLAY
   ═══════════════════════════════════════════════════ */

const STREAM_PLATFORMS = [
  { key: "spotify", label: "Spotify" },
  { key: "appleMusic", label: "Apple Music" },
  { key: "tiktok", label: "TikTok" },
  { key: "instagram", label: "Instagram" },
  { key: "amazonMusic", label: "Amazon Music" },
  { key: "youtube", label: "YouTube" },
  { key: "tidal", label: "Tidal" },
  { key: "pandora", label: "Pandora" },
];

function StreamingOverlay({
  open,
  onOpenChange,
  title,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title: string;
}) {
  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-300 ${
        open
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="absolute inset-0 bg-black/60" onClick={() => onOpenChange(false)} />
      <div className="relative bg-black text-white rounded-sm w-full max-w-lg mx-4 p-10">
        <button
          onClick={() => onOpenChange(false)}
          className="absolute top-4 right-4 text-white/50 hover:text-white cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>
        <h2 className="text-center text-xs uppercase tracking-[0.25em] text-white/40">
          Stream Now
        </h2>
        <h3 className="mt-4 text-center text-3xl font-light">{title}</h3>
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {STREAM_PLATFORMS.map((p) => (
            <a
              key={p.key}
              href="#"
              onClick={(e) => e.preventDefault()}
              className="flex flex-col items-center gap-2 border border-white/10 px-3 py-5 text-center hover:border-white/30 hover:bg-white/5 transition-all cursor-pointer"
            >
              <Play className="h-5 w-5 text-white/40" />
              <span className="text-[10px] uppercase tracking-[0.2em] text-white/60">
                {p.label}
              </span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   PRODUCT CARD (grid item)
   ═══════════════════════════════════════════════════ */

function ProductCard({
  product,
  onSelect,
  onQuickAdd,
}: {
  product: ShopProduct;
  onSelect: () => void;
  onQuickAdd?: () => void;
}) {
  const available = product.stock > 0;
  return (
    <div className="group cursor-pointer" onClick={onSelect}>
      {/* Image area */}
      <div className="relative aspect-square overflow-hidden bg-[#f0f0f0]">
        {available && onQuickAdd && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickAdd();
            }}
            className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center border border-black/10 bg-white opacity-0 transition-opacity duration-200 group-hover:opacity-100 cursor-pointer hover:bg-black hover:text-white"
            aria-label="Quick add"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        )}
        {!available && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/70">
            <span className="text-[11px] font-medium uppercase tracking-widest text-black/40">
              Sold Out
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="mt-3">
        <p className="text-[13px] font-medium uppercase tracking-wide text-black leading-tight">
          {product.name}
        </p>
        <div className="mt-1.5 flex items-center gap-3">
          <span
            className={`text-sm ${available ? "text-black" : "text-black/30"}`}
          >
            {available ? `$${product.price}.00` : "Sold Out"}
          </span>
          {available && onQuickAdd && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onQuickAdd();
              }}
              className="flex h-6 w-6 items-center justify-center border border-black/20 text-black/60 hover:bg-black hover:text-white hover:border-black transition-colors cursor-pointer"
              aria-label="Add to cart"
            >
              <Plus className="h-3 w-3" />
            </button>
          )}
        </div>
        {/* Color swatches */}
        {product.colors.length > 0 && (
          <div className="mt-2 flex gap-1.5">
            {product.colors.map((c) => (
              <span
                key={c.hex}
                className="block h-3.5 w-3.5 rounded-full border border-black/10"
                style={{ backgroundColor: c.hex }}
                title={c.name}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   IMAGE GALLERY
   ═══════════════════════════════════════════════════ */

function ImageGallery({
  total,
  label,
  bgClass = "bg-[#f0f0f0]",
}: {
  total: number;
  label: string;
  bgClass?: string;
}) {
  const [idx, setIdx] = useState(0);
  return (
    <div className={`relative aspect-square overflow-hidden ${bgClass}`}>
      <div className="flex h-full w-full items-center justify-center text-sm text-black/20">
        {label}
      </div>
      {total > 1 && (
        <>
          <button
            onClick={() => setIdx((p) => (p > 0 ? p - 1 : total - 1))}
            className="absolute left-3 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center bg-white/80 border border-black/5 hover:bg-white transition-colors cursor-pointer"
            aria-label="Previous"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => setIdx((p) => (p < total - 1 ? p + 1 : 0))}
            className="absolute right-3 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center bg-white/80 border border-black/5 hover:bg-white transition-colors cursor-pointer"
            aria-label="Next"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          <span className="absolute left-3 bottom-3 text-[11px] text-black/30">
            {idx + 1}/{total}
          </span>
        </>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   SHOP MAIN PAGE
   ═══════════════════════════════════════════════════ */

export function ShopPage() {
  const { cartCount, setDetailSlug, addToCart } = useAppStore();
  const [activeTab, setActiveTab] = useState(0); // index into SHOP_TABS
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [colorFilter, setColorFilter] = useState<string | null>(null);

  const tabLabel = SHOP_TABS[activeTab];
  const selectedAlbum =
    activeTab > 0 ? SHOP_ALBUMS[activeTab - 1] : null;

  // Products for the current tab
  const products = useMemo(() => {
    let list: ShopProduct[] = selectedAlbum
      ? selectedAlbum.merch
      : ALL_PRODUCTS;

    if (categoryFilter) {
      list = list.filter((p) => p.category === categoryFilter);
    }
    if (colorFilter) {
      list = list.filter((p) =>
        p.colors.some((c) => c.name.toLowerCase() === colorFilter)
      );
    }
    return list;
  }, [selectedAlbum, categoryFilter, colorFilter]);

  // Count available
  const availableCount = useMemo(
    () => products.filter((p) => p.stock > 0).length,
    [products]
  );

  // All unique color names across current products
  const availableColors = useMemo(() => {
    const names = new Set<string>();
    const baseList = selectedAlbum
      ? selectedAlbum.merch
      : ALL_PRODUCTS;
    baseList.forEach((p) =>
      p.colors.forEach((c) => names.add(c.name.toLowerCase()))
    );
    return [...names].sort();
  }, [selectedAlbum]);

  const resetFilters = () => {
    setCategoryFilter(null);
    setColorFilter(null);
  };

  const handleTabChange = (idx: number) => {
    setActiveTab(idx);
    resetFilters();
  };

  return (
    <PageShell>
      <div className="min-h-screen bg-white text-black">
        {/* Top bar: tabs + cart */}
        <nav className="border-b border-black/10">
          <div className="mx-auto max-w-[1400px] px-6">
            <div className="flex items-center justify-between">
              {/* Tabs */}
              <div className="flex gap-0 overflow-x-auto scrollbar-hide">
                {SHOP_TABS.map((tab, i) => (
                  <button
                    key={tab}
                    onClick={() => handleTabChange(i)}
                    className={`shrink-0 px-4 py-4 text-[12px] uppercase tracking-[0.15em] transition-colors cursor-pointer border-b-2 -mb-px ${
                      activeTab === i
                        ? "text-black border-black"
                        : "text-black/30 border-transparent hover:text-black/60"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Cart */}
              <button className="shrink-0 px-4 py-4 text-[12px] uppercase tracking-[0.15em] text-black/40 hover:text-black transition-colors cursor-pointer">
                Cart ({cartCount})
              </button>
            </div>
          </div>
        </nav>

        {/* Featured album header (when on an album tab) */}
        {selectedAlbum && (
          <section className="border-b border-black/10">
            <div className="mx-auto max-w-[1400px] px-6 py-12 md:py-16">
              <div className="grid grid-cols-1 gap-10 md:gap-16 md:grid-cols-2">
                {/* Album art gallery */}
                <ImageGallery
                  total={2}
                  label={selectedAlbum.title}
                />

                {/* Album info */}
                <div className="flex flex-col justify-center">
                  <h1 className="text-3xl font-bold uppercase tracking-tight md:text-4xl">
                    {selectedAlbum.title}
                  </h1>
                  <div className="mt-3 flex items-center gap-3 text-[13px] text-black/40">
                    <span>{selectedAlbum.releaseDate}</span>
                    <span>·</span>
                    <span>{selectedAlbum.duration}</span>
                  </div>

                  <p className="mt-6 text-sm leading-relaxed text-black/50 max-w-md">
                    {selectedAlbum.description}
                  </p>

                  {selectedAlbum.quote && (
                    <blockquote className="mt-4 border-l-2 border-black/10 pl-4 text-sm italic text-black/40">
                      {selectedAlbum.quote}
                    </blockquote>
                  )}

                  {/* Action list */}
                  <div className="mt-8">
                    <ActionButton
                      icon={<Play className="h-3.5 w-3.5" />}
                      label="Stream"
                      albumTitle={selectedAlbum.title}
                    />
                    <ActionButton
                      icon={<Plus className="h-3.5 w-3.5" />}
                      label="Add to Cart (Digital)"
                    />
                    <ActionButton
                      icon={<Plus className="h-3.5 w-3.5" />}
                      label="Add to Cart (Vinyl)"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Filters + product grid */}
        <section className="px-6 py-12 md:py-16">
          <div className="mx-auto max-w-[1400px]">
            {/* Section header + filters */}
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="text-[11px] font-medium uppercase tracking-[0.2em] text-black/30">
                  {selectedAlbum ? selectedAlbum.title : "All Merchandise"}
                </h2>
                <p className="mt-1 text-[12px] text-black/30">
                  {products.length} product{products.length !== 1 ? "s" : ""}{" "}
                  · {availableCount} available
                </p>
              </div>

              {/* Category filter pills */}
              <div className="flex flex-wrap gap-2">
                {/* Category dropdown */}
                <select
                  value={categoryFilter ?? ""}
                  onChange={(e) =>
                    setCategoryFilter(e.target.value || null)
                  }
                  className="appearance-none border border-black/15 px-3 py-2 text-[12px] uppercase tracking-wider bg-white text-black/70 cursor-pointer hover:border-black/40 transition-colors pr-8"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23000' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 8px center",
                  }}
                >
                  <option value="">Category</option>
                  {ALL_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>

                {/* Color filter pills */}
                {availableColors.map((c) => (
                  <button
                    key={c}
                    onClick={() => setColorFilter(colorFilter === c ? null : c)}
                    className={`px-3 py-2 text-[12px] uppercase tracking-wider border transition-colors cursor-pointer ${
                      colorFilter === c
                        ? "border-black bg-black text-white"
                        : "border-black/15 text-black/50 hover:border-black/40"
                    }`}
                  >
                    {c}
                  </button>
                ))}

                {/* Clear filters */}
                {(categoryFilter || colorFilter) && (
                  <button
                    onClick={resetFilters}
                    className="px-3 py-2 text-[12px] uppercase tracking-wider text-black/30 underline underline-offset-2 hover:text-black/60 transition-colors cursor-pointer"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Product grid */}
            {products.length > 0 ? (
              <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
                {products.map((p) => (
                  <ProductCard
                    key={p.slug}
                    product={p}
                    onSelect={() => setDetailSlug(p.slug, "product")}
                    onQuickAdd={p.stock > 0 ? () => addToCart() : undefined}
                  />
                ))}
              </div>
            ) : (
              <div className="mt-20 flex flex-col items-center justify-center py-20 text-center">
                <p className="text-[13px] uppercase tracking-widest text-black/20">
                  No products found
                </p>
                <button
                  onClick={resetFilters}
                  className="mt-4 text-[12px] uppercase tracking-wider underline underline-offset-2 text-black/40 hover:text-black/60 cursor-pointer"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Newsletter footer */}
        <footer className="border-t border-black/10 mt-8">
          <div className="mx-auto max-w-[1400px] px-6 py-16 grid grid-cols-1 gap-10 md:grid-cols-3 md:py-20">
            <div>
              <h3 className="text-[12px] font-medium uppercase tracking-[0.2em]">
                Subscribe
              </h3>
              <p className="mt-3 text-[13px] leading-relaxed text-black/40">
                Receive email updates about launches, new product info,
                exclusive access, and more.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <h3 className="text-[12px] font-medium uppercase tracking-[0.2em]">
                Legal
              </h3>
              <a href="#" className="text-[13px] text-black/40 hover:text-black/70 transition-colors">
                Terms &amp; Conditions
              </a>
              <a href="#" className="text-[13px] text-black/40 hover:text-black/70 transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-[13px] text-black/40 hover:text-black/70 transition-colors">
                FAQs
              </a>
            </div>
            <div className="flex flex-col gap-3">
              <h3 className="text-[12px] font-medium uppercase tracking-[0.2em]">
                Social
              </h3>
              <a href="#" className="text-[13px] text-black/40 hover:text-black/70 transition-colors">
                Instagram
              </a>
              <a href="#" className="text-[13px] text-black/40 hover:text-black/70 transition-colors">
                Twitter
              </a>
              <a href="#" className="text-[13px] text-black/40 hover:text-black/70 transition-colors">
                TikTok
              </a>
            </div>
          </div>
        </footer>
      </div>
    </PageShell>
  );
}

/* ── Action button in album header ── */
function ActionButton({
  icon,
  label,
  albumTitle,
}: {
  icon: React.ReactNode;
  label: string;
  albumTitle?: string;
}) {
  const { addToCart } = useAppStore();
  const [streamOpen, setStreamOpen] = useState(false);

  if (label === "Stream" && albumTitle) {
    return (
      <>
        <button
          onClick={() => setStreamOpen(true)}
          className="group flex w-full items-center gap-3 border-t border-black/10 py-3.5 text-left hover:bg-black/[0.02] transition-colors cursor-pointer"
        >
          <span className="text-black/30 group-hover:text-black/60 transition-colors">
            {icon}
          </span>
          <span className="text-[13px] text-black/50 group-hover:text-black/80 transition-colors">
            {label}
          </span>
        </button>
        <StreamingOverlay
          open={streamOpen}
          onOpenChange={setStreamOpen}
          title={albumTitle}
        />
      </>
    );
  }

  return (
    <button
      onClick={() => addToCart()}
      className="group flex w-full items-center gap-3 border-t border-black/10 py-3.5 text-left hover:bg-black/[0.02] transition-colors cursor-pointer"
    >
      <span className="text-black/30 group-hover:text-black/60 transition-colors">
        {icon}
      </span>
      <span className="text-[13px] text-black/50 group-hover:text-black/80 transition-colors">
        {label}
      </span>
    </button>
  );
}

/* ═══════════════════════════════════════════════════
   ALBUM DETAIL PAGE
   When clicking an album cover from the shop, show album + merch.
   ═══════════════════════════════════════════════════ */

export function AlbumDetailPage() {
  const { detailSlug, setDetailSlug, addToCart } = useAppStore();
  const [streamOpen, setStreamOpen] = useState(false);

  const album = SHOP_ALBUMS.find((a) => a.slug === detailSlug);

  if (!album) return null;

  return (
    <PageShell>
      <div className="min-h-screen bg-white text-black">
        {/* Back link */}
        <div className="border-b border-black/10">
          <div className="mx-auto max-w-[1400px] px-6 py-4">
            <button
              onClick={() => setDetailSlug(null, null)}
              className="group flex items-center gap-2 text-[12px] uppercase tracking-[0.15em] text-black/30 hover:text-black transition-colors cursor-pointer"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Shop</span>
            </button>
          </div>
        </div>

        {/* Album header */}
        <section className="border-b border-black/10">
          <div className="mx-auto max-w-[1400px] px-6 py-12 md:py-16">
            <div className="grid grid-cols-1 gap-10 md:gap-16 md:grid-cols-2">
              <ImageGallery total={2} label={album.title} />
              <div className="flex flex-col justify-center">
                <h1 className="text-3xl font-bold uppercase tracking-tight md:text-4xl">
                  {album.title}
                </h1>
                <div className="mt-3 flex items-center gap-3 text-[13px] text-black/40">
                  <span>{album.releaseDate}</span>
                  <span>·</span>
                  <span>{album.duration}</span>
                </div>
                <p className="mt-6 text-sm leading-relaxed text-black/50 max-w-md">
                  {album.description}
                </p>
                {album.quote && (
                  <blockquote className="mt-4 border-l-2 border-black/10 pl-4 text-sm italic text-black/40">
                    {album.quote}
                  </blockquote>
                )}
                <div className="mt-8">
                  <button
                    onClick={() => setStreamOpen(true)}
                    className="group flex w-full items-center gap-3 border-t border-black/10 py-3.5 text-left hover:bg-black/[0.02] transition-colors cursor-pointer"
                  >
                    <Play className="h-3.5 w-3.5 text-black/30 group-hover:text-black/60" />
                    <span className="text-[13px] text-black/50 group-hover:text-black/80">Stream Album</span>
                  </button>
                  <button
                    onClick={() => addToCart()}
                    className="group flex w-full items-center gap-3 border-t border-black/10 py-3.5 text-left hover:bg-black/[0.02] transition-colors cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5 text-black/30 group-hover:text-black/60" />
                    <span className="text-[13px] text-black/50 group-hover:text-black/80">Add to Cart — Digital Album</span>
                  </button>
                  <button
                    onClick={() => addToCart()}
                    className="group flex w-full items-center gap-3 border-t border-black/10 py-3.5 text-left hover:bg-black/[0.02] transition-colors cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5 text-black/30 group-hover:text-black/60" />
                    <span className="text-[13px] text-black/50 group-hover:text-black/80">Add to Cart — Vinyl</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Merch grid */}
        <section className="px-6 py-12 md:py-16">
          <div className="mx-auto max-w-[1400px]">
            <h2 className="text-[11px] font-medium uppercase tracking-[0.2em] text-black/30">
              {album.title} Merch
            </h2>
            <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
              {album.merch.map((p) => (
                <ProductCard
                  key={p.slug}
                  product={p}
                  onSelect={() => setDetailSlug(p.slug, "product")}
                  onQuickAdd={p.stock > 0 ? () => addToCart() : undefined}
                />
              ))}
            </div>
          </div>
        </section>

        <StreamingOverlay
          open={streamOpen}
          onOpenChange={setStreamOpen}
          title={album.title}
        />
      </div>
    </PageShell>
  );
}

/* ═══════════════════════════════════════════════════
   PRODUCT DETAIL PAGE
   ═══════════════════════════════════════════════════ */

export function ProductDetailPage() {
  const { detailSlug, setDetailSlug, addToCart } = useAppStore();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [added, setAdded] = useState(false);
  const [notifyEmail, setNotifyEmail] = useState("");
  const [notified, setNotified] = useState(false);

  const product = ALL_PRODUCTS.find((p) => p.slug === detailSlug);

  // Related: same album, different product, limit 4
  const related = useMemo(() => {
    if (!product) return [];
    return ALL_PRODUCTS.filter(
      (p) => p.slug !== product.slug && p.albumSlug === product.albumSlug
    ).slice(0, 4);
  }, [product]);

  // Reset state when product changes
  useEffect(() => {
    setSelectedSize(null);
    setSelectedColor(null);
    setAdded(false);
    setNotifyEmail("");
    setNotified(false);
  }, [detailSlug]);

  if (!product) return null;

  const available = product.stock > 0;
  const hasSizes = product.sizes.length > 0;
  const hasColors = product.colors.length > 0;

  const handleAdd = () => {
    setAdded(true);
    addToCart();
    setTimeout(() => setAdded(false), 1500);
  };

  const handleNotify = () => {
    if (notifyEmail.trim()) {
      setNotified(true);
      setNotifyEmail("");
    }
  };

  return (
    <PageShell>
      <div className="min-h-screen bg-white text-black">
        {/* Back link */}
        <div className="border-b border-black/10">
          <div className="mx-auto max-w-[1400px] px-6 py-4">
            <button
              onClick={() => setDetailSlug(null, null)}
              className="group flex items-center gap-2 text-[12px] uppercase tracking-[0.15em] text-black/30 hover:text-black transition-colors cursor-pointer"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Shop</span>
            </button>
          </div>
        </div>

        {/* Product detail */}
        <section>
          <div className="mx-auto max-w-[1400px] px-6 py-10 md:py-16">
            <div className="grid grid-cols-1 gap-10 md:gap-16 md:grid-cols-2">
              {/* Image gallery */}
              <ImageGallery total={3} label={product.name} />

              {/* Product info */}
              <div className="flex flex-col">
                <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-black/30">
                  {product.category}
                </p>
                <h1 className="mt-3 text-3xl font-bold uppercase tracking-tight md:text-4xl">
                  {product.name}
                </h1>

                <p className="mt-4 text-2xl">
                  {available ? `$${product.price}.00` : "Sold Out"}
                </p>

                <p className="mt-6 text-[13px] leading-relaxed text-black/50 max-w-md">
                  {product.description}
                </p>

                {/* Size guide link */}
                {hasSizes && (
                  <button className="mt-4 text-[12px] underline underline-offset-2 text-black/30 hover:text-black/60 transition-colors cursor-pointer text-left">
                    Size Guide
                  </button>
                )}

                {/* Divider */}
                <div className="my-6 border-t border-black/10" />

                {/* Size selector */}
                {hasSizes && (
                  <div>
                    <div className="flex items-center justify-between text-[12px] uppercase tracking-[0.15em] text-black/40">
                      <span>Size</span>
                      {selectedSize && (
                        <span className="text-black">{selectedSize}</span>
                      )}
                    </div>
                    <div className="mt-2">
                      {product.sizes.map((size) => {
                        const isSelected = selectedSize === size;
                        return (
                          <button
                            key={size}
                            onClick={() => available && setSelectedSize(size)}
                            disabled={!available}
                            className={`flex w-full items-center justify-between border-t border-black/10 py-3 text-[13px] cursor-pointer transition-colors ${
                              !available
                                ? "text-black/20 cursor-not-allowed"
                                : isSelected
                                  ? "text-black"
                                  : "text-black/50 hover:text-black"
                            }`}
                          >
                            <span>{size}</span>
                            <span
                              className={
                                available
                                  ? "text-black"
                                  : "text-black/20"
                              }
                            >
                              {isSelected && available ? "●" : "○"}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Color selector */}
                {hasColors && (
                  <div className="mt-6">
                    <div className="text-[12px] uppercase tracking-[0.15em] text-black/40">
                      {selectedColor || "Color"}
                    </div>
                    <div className="mt-3 flex gap-2.5">
                      {product.colors.map((c) => (
                        <button
                          key={c.hex}
                          onClick={() =>
                            available && setSelectedColor(c.name)
                          }
                          disabled={!available}
                          className={`h-8 w-8 rounded-full border-2 transition-all cursor-pointer ${
                            selectedColor === c.name
                              ? "border-black scale-110"
                              : "border-black/10 hover:border-black/30"
                          } ${!available ? "opacity-30 cursor-not-allowed" : ""}`}
                          style={{ backgroundColor: c.hex }}
                          title={c.name}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Availability */}
                <div className="mt-6 text-[12px] text-black/40">
                  {available
                    ? `${product.stock} in stock`
                    : "Sold Out"}
                </div>

                {/* Add to Cart */}
                <button
                  onClick={handleAdd}
                  disabled={!available}
                  className={`mt-6 w-full py-4 text-[12px] font-medium uppercase tracking-[0.2em] transition-all duration-200 cursor-pointer ${
                    added
                      ? "bg-black text-white"
                      : available
                        ? "bg-black text-white hover:bg-black/80"
                        : "bg-black/5 text-black/20 cursor-not-allowed"
                  }`}
                >
                  {added
                    ? "Added to Cart"
                    : available
                      ? "Add to Cart"
                      : "Sold Out"}
                </button>

                {/* Notify Me for sold out */}
                {!available && (
                  <div className="mt-6">
                    <p className="text-[12px] text-black/30 mb-3">
                      This item is currently unavailable.
                    </p>
                    {notified ? (
                      <p className="text-[12px] text-black/50">
                        You&apos;ll be notified when back in stock.
                      </p>
                    ) : (
                      <div className="flex gap-2">
                        <input
                          type="email"
                          placeholder="Email address"
                          value={notifyEmail}
                          onChange={(e) => setNotifyEmail(e.target.value)}
                          className="flex-1 border border-black/15 bg-white px-3 py-2.5 text-[13px] text-black placeholder:text-black/20 outline-none focus:border-black/40 transition-colors"
                        />
                        <button
                          onClick={handleNotify}
                          className="px-5 py-2.5 text-[12px] font-medium uppercase tracking-[0.15em] bg-black text-white hover:bg-black/80 transition-colors cursor-pointer"
                        >
                          Submit
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Shipping info */}
                <div className="mt-8 grid grid-cols-2 gap-6">
                  <div className="border-t border-black/10 pt-3">
                    <span className="text-[11px] uppercase tracking-[0.15em] text-black/30">
                      Ships
                    </span>
                    <p className="mt-1 text-[13px] text-black/60">
                      3–5 business days
                    </p>
                  </div>
                  <div className="border-t border-black/10 pt-3">
                    <span className="text-[11px] uppercase tracking-[0.15em] text-black/30">
                      Returns
                    </span>
                    <p className="mt-1 text-[13px] text-black/60">
                      30 days
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Related Products */}
        {related.length > 0 && (
          <section className="border-t border-black/10">
            <div className="mx-auto max-w-[1400px] px-6 py-12 md:py-16">
              <h2 className="text-[11px] font-medium uppercase tracking-[0.2em] text-black/30 text-center">
                Related Products
              </h2>
              <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
                {related.map((r) => (
                  <ProductCard
                    key={r.slug}
                    product={r}
                    onSelect={() => setDetailSlug(r.slug, "product")}
                    onQuickAdd={
                      r.stock > 0 ? () => addToCart() : undefined
                    }
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Footer */}
        <footer className="border-t border-black/10">
          <div className="mx-auto max-w-[1400px] px-6 py-12 text-center text-[11px] text-black/30 uppercase tracking-[0.15em]">
            © {new Date().getFullYear()} Adea Lyric. All rights reserved.
          </div>
        </footer>
      </div>
    </PageShell>
  );
}
