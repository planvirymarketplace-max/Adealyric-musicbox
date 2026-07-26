"use client";

import { useState, useMemo, useCallback } from "react";
import { useAppStore } from "@/lib/store";
import { PlatformIcon } from "./SiteChrome";
import {
  SHOP_ALBUMS,
  ALL_PRODUCTS,
  CATEGORY_TREE,
  getLeafCategories,
  SIZE_OPTIONS,
  CATEGORY_SIZE_TYPE,
  enrichProduct,
  type ShopProduct,
  type ShopAlbum,
  type EnrichedProduct,
  type ShopCategory,
  type SizeType,
} from "@/lib/catalog";
import {
  Play,
  Plus,
  X,
  ArrowLeft,
  ArrowRight,
  ShoppingBag,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

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
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
      />
      <div className="relative bg-white text-black w-full max-w-2xl mx-4 p-8 sm:p-12 border border-black/10">
        <button
          onClick={() => onOpenChange(false)}
          className="absolute top-4 right-4 text-black/30 hover:text-black cursor-pointer"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>
        <div className="text-center">
          <p className="text-[10px] uppercase tracking-[0.3em] text-black/30">
            Stream Now
          </p>
          <h3 className="mt-3 text-2xl sm:text-3xl font-medium">{title}</h3>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {STREAM_PLATFORMS.map((p) => (
            <a
              key={p.key}
              href="#"
              onClick={(e) => e.preventDefault()}
              className="group/plt flex items-center gap-3 border border-black/10 px-4 py-4 hover:border-black/40 hover:bg-black/5 transition-all cursor-pointer"
            >
              <PlatformIcon name={p.key} className="h-4 w-4 text-black/40 group-hover/plt:text-black shrink-0" />
              <span className="text-[11px] uppercase tracking-[0.15em] text-black/40 group-hover/plt:text-black">
                {p.label}
              </span>
              <Play className="ml-auto h-3.5 w-3.5 text-black/15 group-hover/plt:text-black opacity-0 group-hover/plt:opacity-100 transition-opacity shrink-0" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   PRODUCT CARD
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
      <div className="relative aspect-square overflow-hidden bg-[#f0f0f0]">
        {product.image ? (
          <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <ShoppingBag className="h-8 w-8 text-black/10" />
          </div>
        )}
        {available && onQuickAdd && (
          <button
            onClick={(e) => { e.stopPropagation(); onQuickAdd(); }}
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
      <div className="mt-3">
        <p className="text-[12px] font-medium uppercase tracking-wide text-black/80 leading-tight line-clamp-1">
          {product.name}
        </p>
        <div className="mt-1 flex items-center gap-3">
          <span className={`text-sm ${available ? "text-black" : "text-black/30"}`}>
            {available ? `$${product.price}.00` : "Sold Out"}
          </span>
        </div>
        {product.colors.length > 0 && (
          <div className="mt-2 flex gap-1.5">
            {product.colors.map((c) => (
              <span key={c.hex} className="block h-3 w-3 rounded-full border border-black/10" style={{ backgroundColor: c.hex }} title={c.name} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   SHOP PAGE — 3 paths: Albums | Collections | Shop All
   ═══════════════════════════════════════════════════ */

type ShopPath = "albums" | "collections" | "shop-all";

function ShopNav({
  active,
  onChange,
  cartCount,
}: {
  active: ShopPath;
  onChange: (p: ShopPath) => void;
  cartCount: number;
}) {
  const tabs: { label: string; key: ShopPath }[] = [
    { label: "Albums", key: "albums" },
    { label: "Collections", key: "collections" },
    { label: "Shop All", key: "shop-all" },
  ];
  return (
    <div className="flex items-center justify-between border-b border-black/10">
      <div className="flex items-center gap-8">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => onChange(t.key)}
            className={`relative pb-3 text-[12px] font-medium uppercase tracking-[0.15em] transition-colors cursor-pointer ${
              active === t.key
                ? "text-black border-b-2 border-black"
                : "text-black/40 hover:text-black/70 border-b-2 border-transparent"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <span className="text-[11px] text-black/30">Cart ({cartCount})</span>
    </div>
  );
}

/* ─── Albums View ─── */
function AlbumsView({ onAlbumClick }: { onAlbumClick: (a: ShopAlbum) => void }) {
  return (
    <div className="mt-10">
      <p className="text-[11px] text-black/30 mb-8">{SHOP_ALBUMS.length} albums</p>
      <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        {SHOP_ALBUMS.map((album) => (
          <div key={album.slug} className="group cursor-pointer" onClick={() => onAlbumClick(album)}>
            <div className="relative aspect-square overflow-hidden bg-[#f0f0f0]">
              {album.cover ? (
                <img src={album.cover} alt={album.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <ShoppingBag className="h-10 w-10 text-black/10" />
                </div>
              )}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
            </div>
            <div className="mt-4">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-black">{album.title}</h3>
              <p className="mt-1 text-[11px] text-black/40 uppercase tracking-wider">{album.releaseDate}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Collections View (placeholder) ─── */
function CollectionsView() {
  return (
    <div className="mt-20 flex flex-col items-center justify-center py-20">
      <p className="text-display text-3xl text-black/15">Collections</p>
      <p className="mt-4 text-sm text-black/30">Special runs and collaborations coming soon.</p>
    </div>
  );
}

/* ─── Category Sidebar ─── */
function CategorySidebar({
  selected,
  onChange,
}: {
  selected: ShopCategory[] | null;
  onChange: (cats: ShopCategory[] | null) => void;
}) {
  const [openNodes, setOpenNodes] = useState<Set<string>>(new Set());

  const toggle = (slug: string) => {
    setOpenNodes((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  };

  const handleLeaf = (cats: ShopCategory[]) => {
    onChange(cats);
  };

  const handleClear = () => {
    onChange(null);
  };

  function renderNode(node: { label: string; slug: string; categories?: ShopCategory[]; children?: any[] }, depth: number) {
    const hasChildren = node.children && node.children.length > 0;
    const isOpen = openNodes.has(node.slug);
    const isLeaf = !!node.categories;

    return (
      <div key={node.slug}>
        <button
          onClick={() => {
            if (isLeaf) handleLeaf(node.categories!);
            else if (hasChildren) toggle(node.slug);
          }}
          className={`w-full flex items-center justify-between py-2 text-left text-[12px] tracking-wide cursor-pointer transition-colors hover:text-black ${
            isLeaf && selected && JSON.stringify(selected) === JSON.stringify(node.categories)
              ? "text-black font-medium"
              : "text-black/50"
          }`}
          style={{ paddingLeft: `${depth * 16}px` }}
        >
          <span>{node.label}</span>
          {hasChildren && (
            <ChevronDown className={`h-3 w-3 transition-transform ${isOpen ? "rotate-180" : ""}`} />
          )}
        </button>
        {hasChildren && isOpen && (
          <div>
            {node.children.map((child: any) => renderNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <p className="text-[10px] uppercase tracking-[0.2em] text-black/30">Categories</p>
        {selected && (
          <button onClick={handleClear} className="text-[10px] uppercase tracking-wider text-black/30 hover:text-black cursor-pointer underline">
            Clear
          </button>
        )}
      </div>
      {CATEGORY_TREE.map((node) => renderNode(node, 0))}
    </div>
  );
}

/* ─── Size Filter (contextual) ─── */
const SIZE_LABELS: Record<string, string> = {
  clothing: "Clothing Size",
  waist: "Waist Size",
  shoe: "Shoe Size",
  hat: "Hat Size",
  drinkware: "Size",
  "one-size": "",
  none: "",
};

function SizeFilter({
  categories,
  selected,
  onChange,
}: {
  categories: ShopCategory[] | null;
  selected: string | null;
  onChange: (size: string | null) => void;
}) {
  /* Determine which size type applies based on selected categories */
  let activeSizeType: SizeType = "none";
  if (categories) {
    const types = new Set(categories.map((c) => CATEGORY_SIZE_TYPE[c] ?? "none"));
    if (types.size === 1) {
      activeSizeType = [...types][0];
    } else {
      /* Mixed types — default to clothing */
      activeSizeType = "clothing";
    }
  }

  const options = SIZE_OPTIONS[activeSizeType];
  const label = SIZE_LABELS[activeSizeType];
  if (!options || options.length === 0 || !label) return null;

  return (
    <div className="mt-6">
      <p className="text-[10px] uppercase tracking-[0.2em] text-black/30 mb-3">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((s) => (
          <button
            key={s}
            onClick={() => onChange(selected === s ? null : s)}
            className={`px-3 py-1.5 text-[11px] uppercase tracking-wider border transition-all cursor-pointer ${
              selected === s
                ? "bg-black text-white border-black"
                : "bg-white text-black/50 border-black/15 hover:border-black/40"
            }`}
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─── Shop All View ─── */
function ShopAllView({
  onSelectProduct,
  onQuickAdd,
}: {
  onSelectProduct: (p: ShopProduct) => void;
  onQuickAdd: () => void;
}) {
  const [selectedCats, setSelectedCats] = useState<ShopCategory[] | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let list = ALL_PRODUCTS;
    if (selectedCats) {
      list = list.filter((p) => selectedCats.includes(p.category));
    }
    if (selectedSize) {
      list = list.filter((p) => p.sizes.includes(selectedSize));
    }
    return list;
  }, [selectedCats, selectedSize]);

  return (
    <div className="mt-8 grid grid-cols-1 gap-12 md:grid-cols-4 lg:grid-cols-5">
      {/* Sidebar */}
      <div className="md:col-span-1">
        <CategorySidebar selected={selectedCats} onChange={setSelectedCats} />
        <SizeFilter categories={selectedCats} selected={selectedSize} onChange={setSelectedSize} />
      </div>

      {/* Product Grid */}
      <div className="md:col-span-3 lg:col-span-4">
        <p className="mb-4 text-[11px] text-black/30">
          {filtered.length} product{filtered.length !== 1 ? "s" : ""}
        </p>
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:gap-x-6">
          {filtered.map((p) => (
            <ProductCard
              key={p.slug}
              product={p}
              onSelect={() => onSelectProduct(p)}
              onQuickAdd={onQuickAdd}
            />
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="mt-20 text-center">
            <p className="text-sm text-black/30">No products match your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   SHOP PAGE
   ═══════════════════════════════════════════════════ */

export function ShopPage() {
  const { setDetailSlug, addToCart, cartCount } = useAppStore();
  const [shopPath, setShopPath] = useState<ShopPath>("albums");

  const openAlbum = useCallback(
    (album: ShopAlbum) => {
      setDetailSlug(album.slug, "album");
    },
    [setDetailSlug]
  );

  const openProduct = useCallback(
    (p: ShopProduct) => {
      setDetailSlug(p.slug, "product");
    },
    [setDetailSlug]
  );

  const handleQuickAdd = useCallback(() => {
    addToCart();
  }, [addToCart]);

  return (
    <section className="min-h-screen bg-white px-6 pt-36 pb-20 md:px-12 md:pt-48 md:pb-28">
      <div className="mx-auto max-w-[1400px]">
        <p className="text-[10px] uppercase tracking-[0.25em] text-black/30">06 — Shop</p>
        <h1 className="mt-6 text-display text-[clamp(3rem,8vw,8rem)] leading-[0.85] text-black">
          Shop.
        </h1>

        <div className="mt-12">
          <ShopNav active={shopPath} onChange={setShopPath} cartCount={cartCount} />

          {shopPath === "albums" && <AlbumsView onAlbumClick={openAlbum} />}
          {shopPath === "collections" && <CollectionsView />}
          {shopPath === "shop-all" && (
            <ShopAllView onSelectProduct={openProduct} onQuickAdd={handleQuickAdd} />
          )}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   ALBUM DETAIL PAGE
   ═══════════════════════════════════════════════════ */

export function AlbumDetailPage() {
  const { detailSlug, setDetailSlug, addToCart, setActiveTab } = useAppStore();
  const [streamOpen, setStreamOpen] = useState(false);
  const [streamTitle, setStreamTitle] = useState("");

  const album = useMemo(() => SHOP_ALBUMS.find((a) => a.slug === detailSlug), [detailSlug]);

  const openProduct = useCallback((p: ShopProduct) => { setDetailSlug(p.slug, "product"); }, [setDetailSlug]);
  const handleQuickAdd = useCallback(() => { addToCart(); }, [addToCart]);
  const openStream = useCallback((title: string) => { setStreamTitle(title); setStreamOpen(true); }, []);

  if (!album) {
    return <div className="flex min-h-screen items-center justify-center bg-white"><p className="text-sm text-black/40">Album not found.</p></div>;
  }

  const digitalPrice = 12;
  const vinylProduct = album.merch.find((m) => m.category === "Vinyl");
  const availableCount = album.merch.filter((m) => m.stock > 0).length;

  return (
    <>
      <section className="min-h-screen bg-white px-6 pt-36 pb-20 md:px-12 md:pt-48 md:pb-28">
        <div className="mx-auto max-w-[1400px]">
          {/* Back button */}
          <button
            onClick={() => { setDetailSlug(null, null); setActiveTab("shop"); }}
            className="mb-10 flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-black/30 hover:text-black transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Shop
          </button>

          {/* Two-column hero */}
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-16">
            <div className="relative aspect-square overflow-hidden bg-[#f0f0f0]">
              {album.cover ? (
                <img src={album.cover} alt={album.title} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-black/10">
                  <ShoppingBag className="h-16 w-16" />
                </div>
              )}
            </div>
            <div className="flex flex-col justify-center">
              <p className="text-[10px] uppercase tracking-[0.3em] text-black/30">Collection</p>
              <h1 className="mt-4 text-display text-[clamp(2.5rem,6vw,5.5rem)] leading-[0.9] text-black">
                {album.title}
              </h1>
              <p className="mt-3 text-[12px] uppercase tracking-[0.15em] text-black/40">
                {album.releaseDate} · {album.duration}
              </p>
              <p className="mt-6 max-w-md text-base leading-relaxed text-black/60">{album.description}</p>
              {album.quote && (
                <p className="mt-4 text-sm italic text-black/30">&ldquo;{album.quote}&rdquo;</p>
              )}
            </div>
          </div>

          {/* ── Action Rows ── */}
          <div className="mt-12 max-w-xl flex flex-col gap-4">
            {/* Stream Album */}
            <button
              onClick={() => openStream(album.title + " — Album")}
              className="w-full flex items-center gap-4 border border-black/10 rounded-md px-5 py-6 bg-white cursor-pointer"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-black text-white">
                <Play className="h-5 w-5 ml-0.5" />
              </span>
              <div className="flex-1 text-left">
                <p className="text-[13px] text-black/15">Stream Album</p>
                <p className="mt-0.5 text-[14px] font-medium text-black">All platforms</p>
              </div>
              <ArrowRight className="h-4 w-4 text-black" />
            </button>

            {/* Stream Single */}
            {album.singleTitle && (
              <button
                onClick={() => openStream(album.singleTitle! + " — Single")}
                className="w-full flex items-center gap-4 border border-black/10 rounded-md px-5 py-6 bg-white cursor-pointer"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-black text-white">
                  <Play className="h-5 w-5 ml-0.5" />
                </span>
                <div className="flex-1 text-left">
                  <p className="text-[13px] text-black/15">Stream Single</p>
                  <p className="mt-0.5 text-[14px] font-medium text-black">{album.singleTitle}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-black" />
              </button>
            )}

            {/* Add to Cart — Digital */}
            <button
              onClick={() => addToCart()}
              className="w-full flex items-center gap-4 border border-black/10 rounded-md px-5 py-6 bg-white cursor-pointer"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-black text-white">
                <Plus className="h-5 w-5" />
              </span>
              <div className="flex-1 text-left">
                <p className="text-[13px] text-black/15">Add to Cart — Digital</p>
                <p className="mt-0.5 text-[14px] font-medium text-black">Digital download</p>
              </div>
              <span className="text-[14px] text-black/15 tabular-nums">${digitalPrice}.00</span>
            </button>

            {/* Add to Cart — Vinyl */}
            <button
              onClick={() => addToCart()}
              disabled={!vinylProduct || vinylProduct.stock === 0}
              className={`w-full flex items-center gap-4 border rounded-md px-5 py-6 ${
                vinylProduct && vinylProduct.stock > 0
                  ? "border-black/10 bg-white cursor-pointer"
                  : "border-black/5 bg-black/[0.01] opacity-40 cursor-not-allowed"
              }`}
            >
              <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${
                vinylProduct && vinylProduct.stock > 0
                  ? "bg-black text-white"
                  : "bg-black/8 text-black/25"
              }`}>
                <Plus className="h-5 w-5" />
              </span>
              <div className="flex-1 text-left">
                <p className={`text-[13px] ${vinylProduct && vinylProduct.stock > 0 ? "text-black/15" : "text-black/10"}`}>
                  Add to Cart — Vinyl
                </p>
                <p className={`mt-0.5 text-[14px] font-medium ${vinylProduct && vinylProduct.stock > 0 ? "text-black" : "text-black/30"}`}>
                  {vinylProduct && vinylProduct.stock > 0 ? "180g heavyweight vinyl" : "Currently unavailable"}
                </p>
              </div>
              {vinylProduct && vinylProduct.stock > 0 ? (
                <span className="text-[14px] text-black/15 tabular-nums">${vinylProduct.price}.00</span>
              ) : (
                <span className="text-[11px] uppercase tracking-widest text-black/20">Sold Out</span>
              )}
            </button>

            {/* Availability */}
            <p className="pt-1 text-[11px] text-black/25">
              {availableCount} of {album.merch.length} items available
            </p>
          </div>

          {/* ── Merch Grid ── */}
          <div className="mt-20">
            <p className="text-[10px] uppercase tracking-[0.2em] text-black/30">
              {album.title} — Merchandise
            </p>
            <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:gap-x-6">
              {album.merch.map((p) => (
                <ProductCard
                  key={p.slug}
                  product={p}
                  onSelect={() => openProduct(p)}
                  onQuickAdd={handleQuickAdd}
                />
              ))}
            </div>
          </div>

          {/* ── Video Grid ── */}
          <div className="mt-20">
            <p className="text-[10px] uppercase tracking-[0.2em] text-black/30">Visuals</p>
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="relative aspect-video overflow-hidden bg-[#f0f0f0]">
                  <div className="flex h-full w-full items-center justify-center text-[11px] uppercase tracking-widest text-black/15">
                    Video {i}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <StreamingOverlay open={streamOpen} onOpenChange={setStreamOpen} title={streamTitle} />
    </>
  );
}

/* ═══════════════════════════════════════════════════
   PRODUCT DETAIL PAGE
   ═══════════════════════════════════════════════════ */

export function ProductDetailPage() {
  const { detailSlug, setDetailSlug, addToCart, setActiveTab } = useAppStore();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [notifyEmail, setNotifyEmail] = useState("");
  const [notifySent, setNotifySent] = useState(false);

  const product = useMemo(() => ALL_PRODUCTS.find((p) => p.slug === detailSlug), [detailSlug]);
  const available = product ? product.stock > 0 : false;
  const enriched = product ? enrichProduct(product as ShopProduct) : null;

  const related = useMemo(() => {
    if (!product) return [];
    return ALL_PRODUCTS.filter((p) => p.albumSlug === product.albumSlug && p.slug !== product.slug).slice(0, 4);
  }, [product]);

  const openRelated = useCallback((p: EnrichedProduct) => {
    setDetailSlug(p.slug, "product");
    setSelectedSize(null);
    setNotifySent(false);
  }, [setDetailSlug]);

  const handleAddToCart = useCallback(() => { if (available) addToCart(); }, [available, addToCart]);
  const handleNotify = useCallback(() => { if (notifyEmail) setNotifySent(true); }, [notifyEmail]);

  if (!product || !enriched) {
    return <div className="flex min-h-screen items-center justify-center bg-white"><p className="text-sm text-black/40">Product not found.</p></div>;
  }

  return (
    <section className="min-h-screen bg-white px-6 pt-36 pb-20 md:px-12 md:pt-48 md:pb-28">
      <div className="mx-auto max-w-[1400px]">
        <button
          onClick={() => {
            const parentAlbum = SHOP_ALBUMS.find((a) => a.slug === product.albumSlug);
            if (parentAlbum) { setDetailSlug(parentAlbum.slug, "album"); }
            else { setDetailSlug(null, null); setActiveTab("shop"); }
          }}
          className="mb-10 flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-black/30 hover:text-black transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-16">
          {/* Left: Image */}
          <div>
            <div className="relative aspect-square overflow-hidden bg-[#f0f0f0]">
              {product.image ? (
                <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <ShoppingBag className="h-12 w-12 text-black/10" />
                </div>
              )}
              {!available && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/70">
                  <span className="text-[11px] font-medium uppercase tracking-widest text-black/40">Sold Out</span>
                </div>
              )}
            </div>
            {product.colors.length > 0 && (
              <div className="mt-4 flex items-center gap-3">
                <span className="text-[10px] uppercase tracking-[0.2em] text-black/30">Color</span>
                {product.colors.map((c) => (
                  <span key={c.hex} className="block h-5 w-5 rounded-full border-2 border-black/10 cursor-pointer hover:border-black/40 transition-colors" style={{ backgroundColor: c.hex }} title={c.name} />
                ))}
              </div>
            )}
          </div>

          {/* Right: Info */}
          <div className="flex flex-col">
            <p className="text-[10px] uppercase tracking-[0.3em] text-black/30">{product.category}</p>
            <h1 className="mt-3 text-display text-[clamp(2rem,5vw,4.5rem)] leading-[0.9] text-black">{product.name}</h1>
            <p className="mt-4 text-2xl font-light">{available ? `$${product.price}.00` : "Sold Out"}</p>
            {enriched.availability === "Low Stock" && <p className="mt-1 text-[11px] text-black/40">Low Stock — only {product.stock} left</p>}
            <p className="mt-4 text-[12px] font-medium uppercase tracking-[0.2em] text-black/40">{product.albumTitle} Collection</p>
            <p className="mt-4 text-sm leading-relaxed text-black/60">{product.description}</p>

            {/* Contextual Size Selector */}
            {enriched.sizes.length > 0 && (
              <div className="mt-8">
                <p className="mb-3 text-[10px] uppercase tracking-[0.2em] text-black/40">Size</p>
                <div className="flex flex-wrap gap-2">
                  {enriched.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`h-10 min-w-[48px] px-4 text-[12px] uppercase tracking-wider border transition-all cursor-pointer ${
                        selectedSize === s ? "bg-black text-white border-black" : "bg-white text-black/60 border-black/15 hover:border-black/40"
                      }`}
                    >{s}</button>
                  ))}
                </div>
              </div>
            )}

            {/* Add to Cart / Notify Me */}
            <div className="mt-8">
              {available ? (
                <button onClick={handleAddToCart} className="w-full bg-black py-4 text-[12px] uppercase tracking-[0.2em] text-white hover:bg-black/80 transition-colors cursor-pointer">
                  Add to Cart
                </button>
              ) : notifySent ? (
                <div className="border border-black/10 py-4 text-center text-[12px] text-black/50">You&apos;ll be notified when available.</div>
              ) : (
                <div className="flex gap-2">
                  <input type="email" placeholder="Email for notification" value={notifyEmail} onChange={(e) => setNotifyEmail(e.target.value)} className="flex-1 border border-black/15 px-4 py-3 text-[12px] placeholder:text-black/25 focus:outline-none focus:border-black/40" />
                  <button onClick={handleNotify} className="bg-black px-6 py-3 text-[12px] uppercase tracking-[0.15em] text-white hover:bg-black/80 transition-colors cursor-pointer">Notify Me</button>
                </div>
              )}
            </div>

            <div className="mt-6 border-t border-black/5 pt-6">
              <p className="text-[11px] text-black/30">Free shipping on orders over $100. Ships in 3–5 business days. 30-day returns.</p>
            </div>
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <div className="mt-20">
            <p className="mb-8 text-[10px] uppercase tracking-[0.2em] text-black/30">From the same collection</p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:gap-x-6">
              {related.map((p) => (
                <ProductCard key={p.slug} product={p} onSelect={() => openRelated(p)} onQuickAdd={() => addToCart()} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
