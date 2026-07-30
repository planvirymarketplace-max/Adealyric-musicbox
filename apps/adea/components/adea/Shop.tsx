"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
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
  type CategoryNode,
} from "@/lib/catalog";
import {
  Play,
  Plus,
  X,
  ArrowLeft,
  ShoppingBag,
  ChevronDown,
  Menu,
} from "lucide-react";

/* ═══════════════════════════════════════════════════
   STREAMING OVERLAY — horizontal scroll
   ═══════════════════════════════════════ */

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

const SCROLL_PLATFORMS = [...STREAM_PLATFORMS, ...STREAM_PLATFORMS, ...STREAM_PLATFORMS, ...STREAM_PLATFORMS];

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
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => onOpenChange(false)} />
      <div className="relative w-full max-w-3xl mx-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-white/40">Stream Now</p>
            <h3 className="mt-1 text-xl font-medium text-white">{title}</h3>
          </div>
          <button onClick={() => onOpenChange(false)} className="flex h-9 w-9 items-center justify-center border border-white/10 text-white/40 hover:text-white hover:border-white/30 transition-colors cursor-pointer" aria-label="Close">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="relative overflow-hidden rounded-lg border border-white/10 bg-white/5 backdrop-blur-md">
          <div className="py-6 overflow-x-auto scrollbar-hide">
            <div className="flex w-max items-center gap-0">
              {SCROLL_PLATFORMS.map((p, i) => (
                <a key={`${p.key}-${i}`} href="#" onClick={(e) => e.preventDefault()} className="flex shrink-0 items-center gap-3 px-6 py-3 hover:bg-white/5 transition-colors cursor-pointer">
                  <PlatformIcon name={p.key} className="h-5 w-5 text-white/40" />
                  <span className="whitespace-nowrap text-sm tracking-wide text-white/60">{p.label}</span>
                  <span className="ml-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                    <Play className="h-3.5 w-3.5 ml-0.5 text-white/60" />
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   PRODUCT CARD
   ═══════════════════════════════════════ */

function ProductCard({ product, onSelect, onQuickAdd }: { product: ShopProduct; onSelect: () => void; onQuickAdd?: () => void }) {
  const available = product.stock > 0;
  return (
    <div className="group cursor-pointer" onClick={onSelect}>
      <div className="relative aspect-square overflow-hidden bg-[#f0f0f0]">
        {product.image ? (
          <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center"><ShoppingBag className="h-8 w-8 text-black/10" /></div>
        )}
        {available && onQuickAdd && (
          <button onClick={(e) => { e.stopPropagation(); onQuickAdd(); }} className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center border border-black/10 bg-white opacity-0 transition-opacity duration-200 group-hover:opacity-100 cursor-pointer hover:bg-black hover:text-white" aria-label="Quick add">
            <Plus className="h-3.5 w-3.5" />
          </button>
        )}
        {!available && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/70">
            <span className="text-[11px] font-medium uppercase tracking-widest text-black">Sold Out</span>
          </div>
        )}
      </div>
      <div className="mt-3">
        <p className="text-[12px] font-medium uppercase tracking-wide text-black/80 leading-tight line-clamp-1">{product.name}</p>
        <div className="mt-1 flex items-center gap-3">
          <span className={`text-sm ${available ? "text-black" : "text-black"}`}>{available ? `$${product.price}.00` : "Sold Out"}</span>
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
   CATEGORY SIDEBAR — shared across all shop pages
   ═══════════════════════════════════════════════════ */

function CategorySidebar({
  selected,
  onChange,
  onNavigate,
}: {
  selected: ShopCategory[] | null;
  onChange: (cats: ShopCategory[] | null) => void;
  onNavigate?: () => void;
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

  function renderNode(node: CategoryNode, depth: number) {
    const hasChildren = node.children && node.children.length > 0;
    const isOpen = openNodes.has(node.slug);
    const isLeaf = !!node.categories;

    return (
      <div key={node.slug}>
        <button
          onClick={() => {
            if (isLeaf) {
              onChange(node.categories!);
              onNavigate?.();
            } else if (hasChildren) toggle(node.slug);
          }}
          className={`w-full flex items-center justify-between py-1.5 text-left text-[11px] tracking-wide cursor-pointer transition-colors hover:text-black ${
            isLeaf && selected && JSON.stringify(selected) === JSON.stringify(node.categories)
              ? "text-black font-medium"
              : "text-black"
          }`}
          style={{ paddingLeft: `${depth * 14}px` }}
        >
          <span>{node.label}</span>
          {hasChildren && (
            <ChevronDown className={`h-3 w-3 transition-transform flex-shrink-0 ${isOpen ? "rotate-180" : ""}`} />
          )}
        </button>
        {hasChildren && isOpen && (
          <div>{node.children.map((child: CategoryNode) => renderNode(child, depth + 1))}</div>
        )}
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <p className="text-[10px] uppercase tracking-[0.2em] text-black">Categories</p>
        {selected && (
          <button onClick={() => onChange(null)} className="text-[10px] uppercase tracking-wider text-black hover:text-black cursor-pointer underline">Clear</button>
        )}
      </div>
      {CATEGORY_TREE.map((node) => renderNode(node, 0))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   SIZE FILTER
   ═══════════════════════════════════════ */

const SIZE_LABELS: Record<string, string> = {
  clothing: "Clothing Size",
  waist: "Waist Size",
  shoe: "Shoe Size",
  hat: "Hat Size",
  drinkware: "Size",
  "one-size": "",
  none: "",
};

function SizeFilter({ categories, selected, onChange }: { categories: ShopCategory[] | null; selected: string | null; onChange: (size: string | null) => void }) {
  let activeSizeType: SizeType = "none";
  if (categories) {
    const types = new Set(categories.map((c) => CATEGORY_SIZE_TYPE[c] ?? "none"));
    if (types.size === 1) activeSizeType = [...types][0];
    else activeSizeType = "clothing";
  }

  const options = SIZE_OPTIONS[activeSizeType];
  const label = SIZE_LABELS[activeSizeType];
  if (!options || options.length === 0 || !label) return null;

  return (
    <div className="mt-6">
      <p className="text-[10px] uppercase tracking-[0.2em] text-black mb-3">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((s) => (
          <button key={s} onClick={() => onChange(selected === s ? null : s)} className={`px-3 py-1.5 text-[11px] uppercase tracking-wider border transition-all cursor-pointer ${selected === s ? "bg-black text-white border-black" : "bg-white text-black border-black/15 hover:border-black/40"}`}>{s}</button>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   SHOP PAGE — 3 paths: Albums | Collections | Shop All
   ═══════════════════════════════════════════════════ */

type ShopPath = "albums" | "collections" | "shop-all";

function ShopNav({ active, onChange, cartCount }: { active: ShopPath; onChange: (p: ShopPath) => void; cartCount: number }) {
  const tabs: { label: string; key: ShopPath }[] = [
    { label: "Albums", key: "albums" },
    { label: "Collections", key: "collections" },
    { label: "Shop All", key: "shop-all" },
  ];
  return (
    <div className="flex items-center justify-between border-b border-black/10">
      <div className="flex items-center gap-8">
        {tabs.map((t) => (
          <button key={t.key} onClick={() => onChange(t.key)} className={`relative pb-3 text-[12px] font-medium uppercase tracking-[0.15em] transition-colors cursor-pointer ${active === t.key ? "text-black border-b-2 border-black" : "text-black hover:text-black/70 border-b-2 border-transparent"}`}>
            {t.label}
          </button>
        ))}
      </div>
      <span className="text-[11px] text-black">Cart ({cartCount})</span>
    </div>
  );
}

/* ─── Albums View ─── */
function AlbumsView({ onAlbumClick }: { onAlbumClick: (a: ShopAlbum) => void }) {
  return (
    <div className="mt-10">
      <p className="text-[11px] text-black mb-8">{SHOP_ALBUMS.length} albums</p>
      <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        {SHOP_ALBUMS.map((album) => (
          <div key={album.slug} className="group cursor-pointer" onClick={() => onAlbumClick(album)}>
            <div className="relative aspect-square overflow-hidden bg-[#f0f0f0]">
              {album.cover ? (
                <img src={album.cover} alt={album.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
              ) : (
                <div className="flex h-full w-full items-center justify-center"><ShoppingBag className="h-10 w-10 text-black/10" /></div>
              )}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
            </div>
            <div className="mt-4">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-black">{album.title}</h3>
              <p className="mt-1 text-[11px] text-black uppercase tracking-wider">{album.releaseDate}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


/* --- Collections View --- */
function CollectionsView(_props: { selectedCats: ShopCategory[] | null; onCategoryChange: (c: ShopCategory[] | null) => void }) {
  return (
    <div className="mt-10">
      <div className="mb-16">
        <p className="text-[10px] uppercase tracking-[0.25em] text-black/40 mb-2">Collection</p>
        <h2 className="text-display text-[clamp(2rem,5vw,4.5rem)] leading-[0.9] text-black">Get the Look.</h2>
        <p className="mt-4 max-w-lg text-sm text-black">
          Adea&apos;s style, curated. Every piece worn on stage, in press, and on the streets of West Philly.
        </p>
        <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="group cursor-pointer">
              <div className="relative aspect-[3/4] overflow-hidden border border-black/10 bg-[#f0f0f0]">
                <div className="flex h-full w-full items-center justify-center text-[11px] uppercase tracking-widest text-black/15">
                  Look {i}
                </div>
              </div>
              <p className="mt-3 text-[12px] font-medium uppercase tracking-wide text-black/80 line-clamp-1">Look {i}</p>
              <p className="mt-1 text-[11px] text-black/50">Coming soon</p>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-black/10 pt-16">
        <p className="text-display text-3xl text-black/15">More collections coming soon.</p>
        <p className="mt-4 text-sm text-black">Special runs and collaborations.</p>
      </div>
    </div>
  );
}

/* ─── Shop All View ─── */
function ShopAllView({ onSelectProduct, onQuickAdd }: { onSelectProduct: (p: ShopProduct) => void; onQuickAdd: () => void }) {
  const [selectedCats, setSelectedCats] = useState<ShopCategory[] | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let list = ALL_PRODUCTS;
    if (selectedCats) list = list.filter((p) => selectedCats.includes(p.category));
    if (selectedSize) list = list.filter((p) => p.sizes.includes(selectedSize));
    return list;
  }, [selectedCats, selectedSize]);

  return (
    <div className="mt-8 grid grid-cols-1 gap-12 md:grid-cols-[220px_1fr]">
      <div>
        <CategorySidebar selected={selectedCats} onChange={setSelectedCats} />
        <SizeFilter categories={selectedCats} selected={selectedSize} onChange={setSelectedSize} />
      </div>
      <div>
        <p className="mb-4 text-[11px] text-black">{filtered.length} product{filtered.length !== 1 ? "s" : ""}</p>
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
          {filtered.map((p) => (
            <ProductCard key={p.slug} product={p} onSelect={() => onSelectProduct(p)} onQuickAdd={onQuickAdd} />
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="mt-20 text-center"><p className="text-sm text-black">No products match your filters.</p></div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   SHOP PAGE
   ═══════════════════════════════════════════════════ */

export function ShopPage() {
  const router = useRouter();
  const { addToCart, cartCount, shopSubPath } = useAppStore();
  const [shopPath, setShopPath] = useState<ShopPath>((shopSubPath as ShopPath) || "albums");

  // Sync local state with store when shopSubPath changes (e.g. from breadcrumb)
  useEffect(() => {
    if (shopSubPath && shopSubPath !== shopPath) {
      setShopPath(shopSubPath as ShopPath);
    }
  }, [shopSubPath]);

  const openAlbum = useCallback((album: ShopAlbum) => { router.push(`/shop/${album.slug}`); }, [router]);
  const openProduct = useCallback((p: ShopProduct) => { router.push(`/shop/${p.slug}`); }, [router]);
  const handleQuickAdd = useCallback(() => { addToCart(); }, [addToCart]);

  return (
    <section className="min-h-screen bg-white px-6 pt-36 pb-20 md:px-12 md:pt-48 md:pb-28">
      <div className="mx-auto max-w-[1400px]">
        <p className="text-[10px] uppercase tracking-[0.25em] text-black">06 — Shop</p>
        <h1 className="mt-6 text-display text-[clamp(3rem,8vw,8rem)] leading-[0.85] text-black">Shop.</h1>
        <div className="mt-12">
          <ShopNav active={shopPath} onChange={setShopPath} cartCount={cartCount} />
          {shopPath === "albums" && <AlbumsView onAlbumClick={openAlbum} />}
          {shopPath === "collections" && <CollectionsView selectedCats={null} onCategoryChange={() => {}} />}
          {shopPath === "shop-all" && <ShopAllView onSelectProduct={openProduct} onQuickAdd={handleQuickAdd} />}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   ALBUM DETAIL PAGE — exact mockup match
   ═══════════════════════════════════════════════════ */

function AlbumActionList({ album, onStream, onAddToCart }: { album: ShopAlbum; onStream: (title: string) => void; onAddToCart: () => void }) {
  const vinylProduct = album.merch.find((m) => m.category === "Vinyl");
  const digitalPrice = 12;

  const actions: { label: string; disabled?: boolean; onClick: () => void }[] = [
    { label: "Stream", onClick: () => onStream(album.title + " — Album") },
    { label: "Add to Cart (Digital)", onClick: onAddToCart },
    {
      label: "Add to Cart (Vinyl)",
      disabled: !vinylProduct || vinylProduct.stock <= 0,
      onClick: onAddToCart,
    },
  ];

  return (
    <div className="border-t border-black/15">
      {actions.map((action, i) => (
        <button
          key={i}
          onClick={action.onClick}
          disabled={action.disabled}
          className={`w-full flex items-center justify-between py-5 border-b border-black/15 transition-colors cursor-pointer ${
            action.disabled ? "opacity-30 cursor-not-allowed" : "hover:bg-black/[0.02]"
          }`}
        >
          <span className="text-[15px] font-normal text-black">{action.label}</span>
          <span className="flex h-[18px] w-[18px] shrink-0 rounded-full bg-black" />
        </button>
      ))}
    </div>
  );
}

export function AlbumDetailPage({ slug }: { slug?: string }) {
  const router = useRouter();
  const { detailSlug, setDetailSlug, addToCart, setActiveTab, setShopSubPath } = useAppStore();
  const [streamOpen, setStreamOpen] = useState(false);
  const [streamTitle, setStreamTitle] = useState("");
  const [sidebarCats, setSidebarCats] = useState<ShopCategory[] | null>(null);

  const activeSlug = slug || detailSlug;
  const album = useMemo(() => SHOP_ALBUMS.find((a) => a.slug === activeSlug), [activeSlug]);

  const openProduct = useCallback((p: ShopProduct) => { router.push(`/shop/${p.slug}`); }, [router]);
  const handleQuickAdd = useCallback(() => { addToCart(); }, [addToCart]);
  const openStream = useCallback((title: string) => { setStreamTitle(title); setStreamOpen(true); }, []);

  if (!album) {
    return <div className="flex min-h-screen items-center justify-center bg-white"><p className="text-sm text-black">Album not found.</p></div>;
  }

  return (
    <>
      <section className="min-h-screen bg-white px-4 pt-32 pb-20 md:px-8 md:pt-44 md:pb-28">
        <div className="mx-auto max-w-[1400px]">
          {/* Top nav links */}
          <div className="mb-8 flex items-center gap-6">
            <button onClick={() => { router.push("/shop"); }} className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-black hover:text-black transition-colors cursor-pointer">
              <ArrowLeft className="h-4 w-4" />
              Shop
            </button>
            <button onClick={() => { router.push("/shop"); }} className="text-[11px] uppercase tracking-[0.2em] text-black hover:text-black transition-colors cursor-pointer">
              Shop All
            </button>
            <button onClick={() => { router.push("/shop"); }} className="text-[11px] uppercase tracking-[0.2em] text-black hover:text-black transition-colors cursor-pointer">
              Collections
            </button>
          </div>

          {/* Main layout: Sidebar | Image | Content */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-[180px_1fr_1fr] md:gap-0 md:items-start">
            {/* ── Category Sidebar ── */}
            <div className="hidden md:block pr-8 border-r border-black/10">
              <CategorySidebar selected={sidebarCats} onChange={setSidebarCats} onNavigate={() => { setDetailSlug(null, null); setActiveTab("shop"); }} />
            </div>

            {/* ── LEFT: Album Art on gray background ── */}
            <div className="relative flex items-center justify-center bg-[#f4f4f4] min-h-[400px] md:min-h-0 md:h-auto">
              <div className="w-full max-w-[90%] py-8 flex items-center justify-center">
                <div className="w-full aspect-square overflow-hidden shadow-lg" style={{ transform: "rotate(-2deg)" }}>
                  {album.cover ? (
                    <img src={album.cover} alt={album.title} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-black/5"><ShoppingBag className="h-16 w-16 text-black/10" /></div>
                  )}
                </div>
              </div>
              {/* Scroll indicator on far left edge */}
              <div className="absolute left-1 top-1/2 -translate-y-1/2 flex flex-col items-center gap-2">
                <Menu className="h-3.5 w-3.5 text-black/25" />
                <div className="w-[4px] h-24 bg-black/10 rounded-full relative">
                  <div className="absolute bottom-0 w-full h-6 bg-black/40 rounded-full" />
                </div>
              </div>
            </div>

            {/* ── RIGHT: Title, date, duration, note, quote, actions ── */}
            <div className="flex flex-col justify-start py-0 md:pl-12 md:py-0">
              <h1 className="text-[clamp(1.8rem,4vw,3rem)] font-semibold leading-[1.15] tracking-tight text-black">
                {album.title}
              </h1>
              <p className="mt-2 text-[clamp(1rem,2vw,1.35rem)] font-normal text-black">{album.releaseDate}</p>
              <p className="mt-1 text-[clamp(1rem,2vw,1.35rem)] font-normal text-black">{album.duration}</p>

              {/* Note from the artist */}
              <p className="mt-5 text-[12px] italic text-black">A note from the artist:</p>
              <p className="mt-2 text-[12px] leading-[1.5] uppercase font-medium tracking-wide text-black line-clamp-3">
                {album.description}
              </p>
              <p className="mt-3 text-[12px] uppercase tracking-wide font-medium text-black">ADEA LYRIC</p>

              {/* Quote */}
              {album.quote && (
                <p className="mt-3 text-[13px] leading-[1.4] text-black italic">
                  &ldquo;{album.quote}&rdquo;
                </p>
              )}

              {/* ── Action List (vertical, with black circles) ── */}
              <div className="mt-auto pt-6">
                <AlbumActionList album={album} onStream={openStream} onAddToCart={() => addToCart()} />
              </div>
            </div>
          </div>

          {/* ── Merch Grid ── */}
          <div className="mt-20">
            <p className="text-[10px] uppercase tracking-[0.2em] text-black">
              {album.title} — Merchandise
            </p>
            <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 lg:gap-x-6">
              {album.merch.map((p) => (
                <ProductCard key={p.slug} product={p} onSelect={() => openProduct(p)} onQuickAdd={handleQuickAdd} />
              ))}
            </div>
          </div>

          {/* ── Video Grid ── */}
          <div className="mt-20">
            <p className="text-[10px] uppercase tracking-[0.2em] text-black">Visuals</p>
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

export function ProductDetailPage({ slug }: { slug?: string }) {
  const router = useRouter();
  const { detailSlug, setDetailSlug, addToCart, setActiveTab, setShopSubPath } = useAppStore();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [notifyEmail, setNotifyEmail] = useState("");
  const [notifySent, setNotifySent] = useState(false);
  const [sidebarCats, setSidebarCats] = useState<ShopCategory[] | null>(null);

  const activeSlug = slug || detailSlug;
  const product = useMemo(() => ALL_PRODUCTS.find((p) => p.slug === activeSlug), [activeSlug]);
  const available = product ? product.stock > 0 : false;
  const enriched = product ? enrichProduct(product as ShopProduct) : null;

  const related = useMemo(() => {
    if (!product) return [];
    return ALL_PRODUCTS.filter((p) => p.albumSlug === product.albumSlug && p.slug !== product.slug).slice(0, 4);
  }, [product]);

  const openRelated = useCallback((p: EnrichedProduct) => {
    router.push(`/shop/${p.slug}`);
    setSelectedSize(null);
    setNotifySent(false);
  }, [router]);

  const handleAddToCart = useCallback(() => { if (available) addToCart(); }, [available, addToCart]);
  const handleNotify = useCallback(() => { if (notifyEmail) setNotifySent(true); }, [notifyEmail]);

  if (!product || !enriched) {
    return <div className="flex min-h-screen items-center justify-center bg-white"><p className="text-sm text-black">Product not found.</p></div>;
  }

  return (
    <section className="min-h-screen bg-white px-4 pt-32 pb-20 md:px-8 md:pt-44 md:pb-28">
      <div className="mx-auto max-w-[1400px]">
        {/* Back + nav */}
        <div className="mb-8 flex items-center gap-6">
          <button
            onClick={() => {
              const parentAlbum = SHOP_ALBUMS.find((a) => a.slug === product.albumSlug);
              if (parentAlbum) { router.push(`/shop/${parentAlbum.slug}`); }
              else { router.push("/shop"); }
            }}
            className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-black hover:text-black transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          <button onClick={() => { router.push("/shop"); }} className="text-[11px] uppercase tracking-[0.2em] text-black hover:text-black transition-colors cursor-pointer">Shop All</button>
          <button onClick={() => { router.push("/shop"); }} className="text-[11px] uppercase tracking-[0.2em] text-black hover:text-black transition-colors cursor-pointer">Collections</button>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-[180px_1fr_1fr] md:gap-0">
          {/* Category Sidebar */}
          <div className="hidden md:block pr-8 border-r border-black/10">
            <CategorySidebar selected={sidebarCats} onChange={setSidebarCats} onNavigate={() => { setDetailSlug(null, null); setActiveTab("shop"); }} />
          </div>

          {/* Image */}
          <div className="relative aspect-square overflow-hidden bg-[#f4f4f4]">
            {product.image ? (
              <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center"><ShoppingBag className="h-12 w-12 text-black/10" /></div>
            )}
            {!available && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/70">
                <span className="text-[11px] font-medium uppercase tracking-widest text-black">Sold Out</span>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col md:pl-12">
            <p className="text-[10px] uppercase tracking-[0.3em] text-black">{product.category}</p>
            <h1 className="mt-3 text-display text-[clamp(2rem,5vw,4.5rem)] leading-[0.9] text-black">{product.name}</h1>
            <p className="mt-4 text-2xl font-light">{available ? `$${product.price}.00` : "Sold Out"}</p>
            {enriched.availability === "Low Stock" && <p className="mt-1 text-[11px] text-black">Low Stock — only {product.stock} left</p>}
            <p className="mt-4 text-[12px] font-medium uppercase tracking-[0.2em] text-black">{product.albumTitle} Collection</p>
            <p className="mt-4 text-sm leading-relaxed text-black">{product.description}</p>

            {/* Size Selector */}
            {enriched.sizes.length > 0 && (
              <div className="mt-8">
                <p className="mb-3 text-[10px] uppercase tracking-[0.2em] text-black">Size</p>
                <div className="flex flex-wrap gap-2">
                  {enriched.sizes.map((s) => (
                    <button key={s} onClick={() => setSelectedSize(s)} className={`h-10 min-w-[48px] px-4 text-[12px] uppercase tracking-wider border transition-all cursor-pointer ${selectedSize === s ? "bg-black text-white border-black" : "bg-white text-black border-black/15 hover:border-black/40"}`}>{s}</button>
                  ))}
                </div>
              </div>
            )}

            {/* Add to Cart / Notify */}
            <div className="mt-8">
              {available ? (
                <button onClick={handleAddToCart} className="w-full bg-black py-4 text-[12px] uppercase tracking-[0.2em] text-white hover:bg-black/80 transition-colors cursor-pointer">Add to Cart</button>
              ) : notifySent ? (
                <div className="border border-black/10 py-4 text-center text-[12px] text-black">You&apos;ll be notified when available.</div>
              ) : (
                <div className="flex gap-2">
                  <input type="email" placeholder="Email for notification" value={notifyEmail} onChange={(e) => setNotifyEmail(e.target.value)} className="flex-1 border border-black/15 px-4 py-3 text-[12px] placeholder:text-black/25 focus:outline-none focus:border-black/40" />
                  <button onClick={handleNotify} className="bg-black px-6 py-3 text-[12px] uppercase tracking-[0.15em] text-white hover:bg-black/80 transition-colors cursor-pointer">Notify Me</button>
                </div>
              )}
            </div>

            <div className="mt-6 border-t border-black/5 pt-6">
              <p className="text-[11px] text-black">Free shipping on orders over $100. Ships in 3–5 business days. 30-day returns.</p>
            </div>
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <div className="mt-20">
            <p className="mb-8 text-[10px] uppercase tracking-[0.2em] text-black">From the same collection</p>
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
