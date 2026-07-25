"use client";

import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { PageShell, PlatformIcon } from "./SiteChrome";
import { useAppStore } from "@/lib/store";
import { ALBUMS, type Album, type AlbumMerchProduct } from "@/lib/catalog";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";
import { Play, Plus, X, ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";

/* ═══════════════════════════════════════════════════
   CONSTANTS
   ═══════════════════════════════════════════════════ */

const FOOTER_PLATFORMS = [
  { key: "spotify", label: "Spotify" },
  { key: "appleMusic", label: "Apple Music" },
  { key: "tiktok", label: "TikTok" },
  { key: "instagram", label: "Instagram" },
  { key: "amazonMusic", label: "Amazon Music" },
  { key: "youtube", label: "YouTube" },
  { key: "tidal", label: "Tidal" },
  { key: "pandora", label: "Pandora" },
];

const COLLECTIONS = ["All Albums", "Apparel", "Accessories", "Vinyl", "Digital"];
const CATEGORIES = [
  "All",
  "Clothes",
  "Product",
  "Cups",
  "Mugs",
  "Bottle Openers",
  "Hats",
];

/* ═══════════════════════════════════════════════════
   HOOKS
   ═══════════════════════════════════════════════════ */

function useReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(
      ([e]) => e.isIntersecting && setShown(true),
      { threshold: 0.08 }
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return { ref, shown };
}

/* ═══════════════════════════════════════════════════
   STREAMING OVERLAY
   Full-bleed dark overlay — same platform icons as footer.
   ═══════════════════════════════════════════════════ */

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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="fixed inset-0 z-50 flex max-w-none h-screen w-screen flex-col items-center justify-center border-none bg-ink p-6 text-bone rounded-none sm:p-12 overflow-y-auto grain"
      >
        <DialogHeader className="sr-only">
          <DialogTitle>{"Stream — " + title}</DialogTitle>
          <DialogDescription>
            Choose your preferred streaming platform
          </DialogDescription>
        </DialogHeader>

        {/* Grain overlay */}
        <div className="grain-overlay" />

        {/* Close button */}
        <button
          onClick={() => onOpenChange(false)}
          className="absolute top-6 right-6 z-10 flex h-10 w-10 items-center justify-center border border-bone/20 text-bone/60 transition-colors hover:border-bone hover:text-bone cursor-pointer"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header */}
        <div className="relative z-10 text-center">
          <div className="text-eyebrow text-ash">Stream Now</div>
          <h2 className="font-display text-[clamp(2rem,7vw,5.5rem)] leading-[0.9] text-bone mt-4">
            {title}
          </h2>
        </div>

        {/* Play indicator */}
        <div className="relative z-10 mt-8 flex h-16 w-16 items-center justify-center rounded-full border border-bone/20">
          <Play className="h-6 w-6 ml-0.5 text-bone" />
        </div>

        {/* Platform grid — matches footer exactly */}
        <div className="relative z-10 mt-10 grid w-full max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4">
          {FOOTER_PLATFORMS.map((p) => (
            <a
              key={p.key}
              href="#"
              onClick={(e) => e.preventDefault()}
              className="group flex flex-col items-center gap-2.5 border border-bone/10 px-3 py-5 text-center transition-all hover:border-bone/30 hover:bg-bone/5 cursor-pointer"
            >
              <PlatformIcon
                name={p.key}
                className="h-5 w-5 text-bone/40 transition-colors group-hover:text-bone"
              />
              <span className="text-[10px] uppercase tracking-[0.2em] text-bone/60 group-hover:text-bone transition-colors">
                {p.label}
              </span>
            </a>
          ))}
        </div>

        <p className="relative z-10 mt-10 text-xs text-ash/50">
          Select a platform to continue listening
        </p>
      </DialogContent>
    </Dialog>
  );
}

/* ═══════════════════════════════════════════════════
   SHARED COMPONENTS
   ═══════════════════════════════════════════════════ */

/** Merch card used in grids across shop/album/product pages */
function MerchCard({
  product,
  onSelect,
  onQuickAdd,
  showAlbum,
}: {
  product: AlbumMerchProduct & { albumTitle?: string };
  onSelect: () => void;
  onQuickAdd?: () => void;
  showAlbum?: boolean;
}) {
  return (
    <div className="group cursor-pointer" onClick={onSelect}>
      <div className="relative aspect-square overflow-hidden border border-ink/5 bg-ink/[0.03]">
        {product.available && onQuickAdd && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickAdd();
            }}
            className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center bg-ink text-bone opacity-0 transition-all duration-300 group-hover:opacity-100 cursor-pointer"
            aria-label="Quick add to cart"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        )}
        {!product.available && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60">
            <span className="text-eyebrow text-ink/30">Sold Out</span>
          </div>
        )}
      </div>
      <div className="mt-3 flex flex-col gap-1">
        <p className="text-eyebrow text-ink leading-tight" style={{display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden"}}>{product.name}</p>
        {showAlbum && product.albumTitle && (
          <p className="text-[11px] text-ink/40 leading-tight">{product.albumTitle}</p>
        )}
        <p
          className={`text-sm mt-1 ${product.available ? "text-ink" : "text-ink/30"}`}
        >
          {product.available ? `$${product.price}.00` : "Sold Out"}
        </p>
      </div>
    </div>
  );
}

/** Section label — consistent with Landing.tsx eyebrow style */
function SectionLabel({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`text-eyebrow text-ink/30 pb-4 border-b border-ink/10 mb-10 ${className}`}
    >
      {children}
    </div>
  );
}

/** Action row — typographic list item for stream/cart actions */
function ActionRow({
  icon: Icon,
  label,
  onClick,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="group flex w-full items-center gap-3 border-t border-ink/10 py-3.5 text-left transition-colors hover:bg-ink/[0.03] cursor-pointer"
    >
      <Icon className="h-3.5 w-3.5 text-ink/40 group-hover:text-ink transition-colors" />
      <span className="text-sm text-ink/60 group-hover:text-ink transition-colors">
        {label}
      </span>
    </button>
  );
}

/* ═══════════════════════════════════════════════════
   SHOP PAGE
   Dark header → gradient transition → white editorial body.
   ═══════════════════════════════════════════════════ */

export function ShopPage() {
  const { setDetailSlug, addToCart } = useAppStore();
  const [activeTab, setActiveTab] = useState("All");

  // Flatten all merch with album context
  const allMerch = useMemo(() => {
    const list: (AlbumMerchProduct & { albumTitle: string })[] = [];
    ALBUMS.forEach((album) => {
      album.merch.forEach((p) => {
        list.push({ ...p, albumTitle: album.title });
      });
    });
    return list;
  }, []);

  // Map collection names to categories
  const CATEGORY_MAP: Record<string, string[]> = {
    "All": [],
    "Albums": [],
    "Apparel": ["Clothes"],
    "Accessories": ["Hats", "Bottle Openers"],
    "Vinyl": ["Product"],
    "Digital": ["Cups", "Mugs"],
  };

  const filtered = useMemo(() => {
    if (activeTab === "Albums") return null;
    if (activeTab === "All") return allMerch;
    const cats = CATEGORY_MAP[activeTab] ?? [];
    return allMerch.filter((p) => cats.includes(p.category));
  }, [activeTab, allMerch]);

  const COLLECTIONS = ["All", "Albums", "Apparel", "Accessories", "Vinyl", "Digital"];

  return (
    <>
      {/* ─── DARK HEADER ─── */}
      <section className="relative bg-ink grain px-6 pt-40 pb-16 md:px-12 md:pt-56 md:pb-20">
        <div className="grain-overlay" />
        <div className="relative z-10 mx-auto max-w-[1600px]">
          <div className="text-eyebrow text-ash">05 — Shop</div>
          <h1 className="mt-6 text-display text-[clamp(4rem,14vw,16rem)] leading-[0.85] text-bone">
            SHOP
          </h1>
          <p className="mt-8 max-w-md text-base leading-relaxed text-ash">
            Official Adea Lyric merchandise, vinyl, and digital releases.
          </p>
        </div>
      </section>

      {/* ─── GRADIENT TRANSITION ─── */}
      <div className="h-24 bg-gradient-to-b from-ink via-ink/40 to-white md:h-32" />

      {/* ─── BODY ─── */}
      <div className="bg-white text-ink">
        {/* Collection tabs */}
        <nav className="border-b border-ink/10">
          <div className="mx-auto max-w-[1600px] px-6 md:px-12">
            <div className="flex gap-0 overflow-x-auto">
              {COLLECTIONS.map((c) => (
                <button
                  key={c}
                  onClick={() => setActiveTab(c)}
                  className={`shrink-0 px-5 py-4 text-eyebrow transition-colors cursor-pointer ${
                    activeTab === c
                      ? "text-ink border-b-2 border-ink"
                      : "text-ink/30 hover:text-ink/60"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </nav>

        {/* ─── ALBUMS TAB ─── */}
        {activeTab === "Albums" && (
          <section className="px-6 py-16 md:px-12 md:py-20">
            <div className="mx-auto max-w-[1600px]">
              <SectionLabel>Albums</SectionLabel>
              <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
                {ALBUMS.map((album) => (
                  <button
                    key={album.slug}
                    onClick={() => setDetailSlug(album.slug, "album")}
                    className="group cursor-pointer text-left"
                  >
                    <div className="relative aspect-square overflow-hidden border border-ink/5 bg-ink/[0.03]">
                      {album.cover ? (
                        <img
                          src={album.cover}
                          alt={album.title}
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-eyebrow text-ink/20">
                          Album Art
                        </div>
                      )}
                      <div className="absolute inset-0 bg-ink/0 transition-colors duration-300 group-hover:bg-ink/10" />
                    </div>
                    <div className="mt-4">
                      <h3 className="font-display text-2xl leading-tight text-ink md:text-3xl">
                        {album.title}
                      </h3>
                      <div className="mt-2 flex items-center gap-3 text-eyebrow text-ink/40">
                        <span>{album.releaseDate}</span>
                        <span className="text-ink/20">·</span>
                        <span>{album.duration}</span>
                      </div>
                      <p className="mt-3 text-sm leading-relaxed text-ink/50 line-clamp-2">
                        {album.description}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ─── PRODUCT TABS (All, Apparel, Accessories, Vinyl, Digital) ─── */
        {activeTab !== "Albums" && filtered && (
          <section className="px-6 py-16 md:px-12 md:py-20">
            <div className="mx-auto max-w-[1600px]">
              <SectionLabel>{activeTab === "All" ? "All Merchandise" : activeTab}</SectionLabel>
              <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
                {filtered.map((product) => (
                  <MerchCard
                    key={product.slug}
                    product={product}
                    showAlbum
                    onSelect={() => setDetailSlug(product.slug, "product")}
                    onQuickAdd={product.available ? () => addToCart() : undefined}
                  />
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </>
  );
}

/* ─── ALBUM BLOCK (used in ShopPage) ─── */
function AlbumBlock({
  album,
  even,
  onStream,
}: {
  album: Album;
  even: boolean;
  onStream: (title: string) => void;
}) {
  const { setDetailSlug, addToCart } = useAppStore();
  const { ref, shown } = useReveal<HTMLDivElement>();

  return (
    <section
      ref={ref}
      className={`border-b border-ink/10 px-6 py-10 md:px-12 md:py-14 transition-all duration-700 ${shown ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
    >
      <div className="mx-auto max-w-[1600px]">
        <div
          className={`grid grid-cols-1 gap-10 md:gap-16 ${
            even ? "md:grid-cols-[1.2fr_1fr]" : "md:grid-cols-[1fr_1.2fr]"
          }`}
        >
          {/* Album art */}
          <div
            className={`${!even ? "md:order-2" : ""}`}
          >
            <div
              className="group cursor-pointer relative aspect-square overflow-hidden bg-ink/5"
              onClick={() => setDetailSlug(album.slug, "album")}
            >
              {album.cover ? (
                <img
                  src={album.cover}
                  alt={album.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-eyebrow text-ink/20">
                  Album Art
                </div>
              )}
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-ink/0 transition-colors duration-300 group-hover:bg-ink/10" />
            </div>
          </div>

          {/* Album info + actions */}
          <div
            className={`flex flex-col justify-center ${!even ? "md:order-1" : ""}`}
          >
            <h2 className="font-display text-3xl leading-[0.9] text-ink md:text-5xl lg:text-6xl">
              {album.title}
            </h2>
            <div className="mt-3 flex items-center gap-3 text-eyebrow text-ink/40">
              <span>{album.releaseDate}</span>
              <span className="text-ink/20">·</span>
              <span>{album.duration}</span>
            </div>

            <p className="mt-6 text-sm leading-relaxed text-ink/50 max-w-md">
              {album.description}
            </p>

            {album.quote && (
              <blockquote className="mt-4 border-l-2 border-ink/15 pl-4 text-sm italic text-ink/40">
                {album.quote}
              </blockquote>
            )}

            {/* Action rows */}
            <div className="mt-8">
              <ActionRow
                icon={Play}
                label="Stream Album"
                onClick={() => onStream(album.title)}
              />
              {album.singleTitle && (
                <ActionRow
                  icon={Play}
                  label={`Stream Single — ${album.singleTitle}`}
                  onClick={() => onStream(album.singleTitle)}
                />
              )}
              <ActionRow
                icon={Plus}
                label="Add to Cart — Digital Album"
                onClick={() => addToCart()}
              />
              <ActionRow
                icon={Plus}
                label="Add to Cart — Vinyl"
                onClick={() => addToCart()}
              />
              <div className="border-t border-ink/10" />
            </div>
          </div>
        </div>

        {/* Merch thumbnails row */}
        <div className="mt-12 grid grid-cols-4 gap-4 md:mt-16 md:grid-cols-8">
          {album.merch.slice(0, 8).map((product) => (
            <MerchCard
              key={product.slug}
              product={product}
              onSelect={() => setDetailSlug(product.slug, "product")}
              onQuickAdd={
                product.available
                  ? () => addToCart()
                  : undefined
              }
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   ALBUM DETAIL PAGE
   Two-column hero → actions → 4×2 merch → 2×2 video.
   ═══════════════════════════════════════════════════ */

export function AlbumDetailPage() {
  const { detailSlug, setDetailSlug, addToCart } = useAppStore();
  const album = ALBUMS.find((a) => a.slug === detailSlug);
  const [streamOpen, setStreamOpen] = useState(false);
  const [streamTitle, setStreamTitle] = useState("");

  const openStream = useCallback((title: string) => {
    setStreamTitle(title);
    setStreamOpen(true);
  }, []);

  if (!album) return null;

  return (
    <PageShell>
      {/* Dark header inside the album detail */}
      <section className="relative bg-ink grain px-6 pt-36 pb-24 md:px-12 md:pt-44 md:pb-32">
        <div className="grain-overlay" />
        <div className="relative z-10 mx-auto max-w-[1600px]">
          <button
            onClick={() => setDetailSlug(null, null)}
            className="group flex items-center gap-2 text-eyebrow text-ash hover:text-bone transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
            <span>Back to Shop</span>
          </button>

          <div className="mt-12 grid grid-cols-1 gap-10 md:gap-16 md:grid-cols-[1.2fr_1fr]">
            {/* Album art */}
            <div className="relative aspect-square overflow-hidden bg-bone/5">
              {album.cover ? (
                <img
                  src={album.cover}
                  alt={album.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-eyebrow text-bone/20">
                  Album Art
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex flex-col justify-center">
              <div className="text-eyebrow text-ash">Album</div>
              <h1 className="mt-4 font-display text-4xl leading-[0.9] text-bone md:text-6xl lg:text-7xl">
                {album.title}
              </h1>
              <div className="mt-3 flex items-center gap-3 text-eyebrow text-ash">
                <span>{album.releaseDate}</span>
                <span className="text-bone/20">·</span>
                <span>{album.duration}</span>
              </div>

              <p className="mt-8 text-sm leading-relaxed text-ash/80 max-w-md">
                {album.description}
              </p>

              {album.quote && (
                <blockquote className="mt-5 border-l-2 border-bone/20 pl-4 text-sm italic text-bone/50">
                  {album.quote}
                </blockquote>
              )}

              {/* Action rows */}
              <div className="mt-10">
                <ActionRowDark
                  icon={Play}
                  label="Stream Album"
                  onClick={() => openStream(album.title)}
                />
                {album.singleTitle && (
                  <ActionRowDark
                    icon={Play}
                    label={`Stream Single — ${album.singleTitle}`}
                    onClick={() => openStream(album.singleTitle)}
                  />
                )}
                <ActionRowDark
                  icon={Plus}
                  label="Add to Cart — Digital Album"
                  onClick={() => addToCart()}
                />
                <ActionRowDark
                  icon={Plus}
                  label="Add to Cart — Vinyl"
                  onClick={() => addToCart()}
                />
                <div className="border-t border-bone/10" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Transition */}
      <div className="h-20 bg-gradient-to-b from-ink via-ink/40 to-white md:h-28" />

      {/* White body — merch + videos */}
      <div className="bg-white text-ink">
        {/* Merch grid 4×2 */}
        <section className="px-6 py-20 md:px-12 md:py-28">
          <div className="mx-auto max-w-[1600px]">
            <SectionLabel>{album.title} Merch</SectionLabel>
            <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
              {album.merch.map((product) => (
                <MerchCard
                  key={product.slug}
                  product={product}
                  onSelect={() =>
                    setDetailSlug(product.slug, "product")
                  }
                  onQuickAdd={
                    product.available
                      ? () => addToCart()
                      : undefined
                  }
                />
              ))}
            </div>
          </div>
        </section>

        {/* Video grid 2×2 */}
        <section className="border-t border-ink/10 px-6 py-20 md:px-12 md:py-28">
          <div className="mx-auto max-w-[1600px]">
            <SectionLabel>Videos</SectionLabel>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {[1, 2, 3, 4].map((n) => (
                <div
                  key={n}
                  className="group relative aspect-video cursor-pointer overflow-hidden bg-ink/5"
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-ink/80 text-bone opacity-0 transition-all duration-300 group-hover:opacity-100">
                      <Play className="h-5 w-5 ml-0.5" />
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <span className="text-eyebrow text-ink/40">Video {n}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* Streaming Overlay */}
      <StreamingOverlay
        open={streamOpen}
        onOpenChange={setStreamOpen}
        title={streamTitle}
      />
    </PageShell>
  );
}

/** Dark variant of action row for use on ink backgrounds */
function ActionRowDark({
  icon: Icon,
  label,
  onClick,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="group flex w-full items-center gap-3 border-t border-bone/10 py-3.5 text-left transition-colors hover:bg-bone/5 cursor-pointer"
    >
      <Icon className="h-3.5 w-3.5 text-ash group-hover:text-bone transition-colors" />
      <span className="text-sm text-ash/70 group-hover:text-bone transition-colors">
        {label}
      </span>
    </button>
  );
}

/* ═══════════════════════════════════════════════════
   PRODUCT DETAIL PAGE
   Two-column hero → sizes → cart/notify → related.
   ═══════════════════════════════════════════════════ */

export function ProductDetailPage() {
  const { detailSlug, setDetailSlug, addToCart } = useAppStore();
  const [imgIdx, setImgIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [added, setAdded] = useState(false);
  const [notifyEmail, setNotifyEmail] = useState("");
  const [notified, setNotified] = useState(false);

  // Find product across all albums
  const allProducts = useMemo(() => {
    const products: (AlbumMerchProduct & {
      albumSlug: string;
      albumTitle: string;
    })[] = [];
    ALBUMS.forEach((album) => {
      album.merch.forEach((p) => {
        products.push({
          ...p,
          albumSlug: album.slug,
          albumTitle: album.title,
        });
      });
    });
    return products;
  }, []);

  const product = allProducts.find((p) => p.slug === detailSlug);

  // Related: same album, different product
  const related = useMemo(() => {
    if (!product) return [];
    return allProducts
      .filter((p) => p.slug !== product.slug && p.albumSlug === product.albumSlug)
      .slice(0, 4);
  }, [product, allProducts]);

  // Reset state when product changes
  useEffect(() => {
    setImgIdx(0);
    setSelectedSize(null);
    setAdded(false);
    setNotifyEmail("");
    setNotified(false);
  }, [detailSlug]);

  if (!product) return null;

  const hasSizes = product.sizes && product.sizes.length > 0;
  const totalImgs = 3;

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

  const goBack = () => {
    if (product.albumSlug) {
      setDetailSlug(product.albumSlug, "album");
    } else {
      setDetailSlug(null, null);
    }
  };

  return (
    <PageShell>
      {/* Dark header */}
      <section className="relative bg-ink grain px-6 pt-36 pb-24 md:px-12 md:pt-44 md:pb-32">
        <div className="grain-overlay" />
        <div className="relative z-10 mx-auto max-w-[1600px]">
          <button
            onClick={goBack}
            className="group flex items-center gap-2 text-eyebrow text-ash hover:text-bone transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
            <span>Back</span>
          </button>

          <div className="mt-12 grid grid-cols-1 gap-10 md:gap-16 md:grid-cols-2">
            {/* Product image */}
            <div>
              <div className="relative aspect-square overflow-hidden bg-bone/5">
                <div className="flex h-full w-full items-center justify-center text-eyebrow text-bone/20">
                  {product.name}
                </div>
                {/* Nav arrows */}
                <button
                  onClick={() =>
                    setImgIdx((p) => (p > 0 ? p - 1 : totalImgs - 1))
                  }
                  className="absolute left-3 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center bg-ink/60 border border-bone/10 text-bone/60 hover:text-bone hover:bg-ink/80 transition-colors cursor-pointer"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={() =>
                    setImgIdx((p) => (p < totalImgs - 1 ? p + 1 : 0))
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center bg-ink/60 border border-bone/10 text-bone/60 hover:text-bone hover:bg-ink/80 transition-colors cursor-pointer"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
                {/* Counter */}
                <span className="absolute left-3 bottom-3 text-eyebrow text-bone/30">
                  {imgIdx + 1}/{totalImgs}
                </span>
              </div>
            </div>

            {/* Product info */}
            <div className="flex flex-col justify-center">
              <div className="text-eyebrow text-ash">{product.category}</div>
              <h1 className="mt-4 font-display text-3xl leading-[0.9] text-bone md:text-5xl">
                {product.name}
              </h1>

              <p className="mt-4 text-2xl text-bone">
                {product.available ? (
                  `$${product.price}.00`
                ) : (
                  <span className="text-ash">Sold Out</span>
                )}
              </p>

              <p className="mt-6 text-sm leading-relaxed text-ash/70 max-w-md">
                Official Adea Lyric merchandise. Designed in West Philadelphia.
                High-quality print on premium materials.
              </p>

              {/* Size guide link */}
              {hasSizes && (
                <button className="mt-4 text-xs underline text-ash/50 hover:text-bone transition-colors cursor-pointer text-left">
                  Size Guide
                </button>
              )}

              {/* Size selector */}
              {hasSizes && (
                <div className="mt-8">
                  <div className="flex items-center justify-between text-eyebrow text-ash">
                    <span>Size</span>
                    {selectedSize && (
                      <span className="text-bone">{selectedSize}</span>
                    )}
                  </div>
                  <div className="mt-2">
                    {product.sizes.map((size) => {
                      const isSelected = selectedSize === size;
                      const isAvailable = product.available;
                      return (
                        <button
                          key={size}
                          onClick={() =>
                            isAvailable && setSelectedSize(size)
                          }
                          disabled={!isAvailable}
                          className={`flex w-full items-center justify-between border-t border-bone/10 py-3 text-sm cursor-pointer transition-colors ${
                            !isAvailable
                              ? "text-bone/20 cursor-not-allowed"
                              : isSelected
                                ? "text-bone"
                                : "text-ash/60 hover:text-bone"
                          }`}
                        >
                          <span>{size}</span>
                          <span
                            className={
                              isAvailable
                                ? "text-bone"
                                : "text-bone/20"
                            }
                          >
                            {isAvailable ? "●" : "○"}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Add to cart */}
              <button
                onClick={handleAdd}
                disabled={!product.available}
                className={`mt-8 w-full py-4 text-eyebrow transition-all duration-300 cursor-pointer ${
                  added
                    ? "bg-bone text-ink"
                    : product.available
                      ? "bg-bone text-ink hover:bg-bone/90"
                      : "bg-bone/10 text-bone/30 cursor-not-allowed"
                }`}
              >
                {added
                  ? "Added to Cart"
                  : product.available
                    ? "Add to Cart"
                    : "Sold Out"}
              </button>

              {/* Notify me */}
              {!product.available && (
                <div className="mt-6">
                  <p className="text-xs text-ash/50 mb-3">
                    This item is currently unavailable.
                  </p>
                  {notified ? (
                    <p className="text-xs text-bone/60">
                      You&apos;ll be notified when this item is back in stock.
                    </p>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="email"
                        placeholder="your@email.com"
                        value={notifyEmail}
                        onChange={(e) => setNotifyEmail(e.target.value)}
                        className="flex-1 border border-bone/20 bg-transparent px-3 py-2.5 text-sm text-bone placeholder:text-bone/20 outline-none focus:border-bone/40 transition-colors"
                      />
                      <button
                        onClick={handleNotify}
                        className="px-5 py-2.5 text-eyebrow bg-bone text-ink hover:bg-bone/90 transition-colors cursor-pointer"
                      >
                        Notify Me
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Shipping info */}
              <div className="mt-8 grid grid-cols-2 gap-6 text-xs text-ash/40">
                <div className="border-t border-bone/10 pt-3">
                  <span className="block text-ash/60">Ships</span>
                  <span className="mt-1 block">3–5 business days</span>
                </div>
                <div className="border-t border-bone/10 pt-3">
                  <span className="block text-ash/60">Returns</span>
                  <span className="mt-1 block">30 days</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Transition */}
      <div className="h-20 bg-gradient-to-b from-ink via-ink/40 to-white md:h-28" />

      {/* White body — related products */}
      <div className="bg-white text-ink">
        {related.length > 0 && (
          <section className="px-6 py-20 md:px-12 md:py-28">
            <div className="mx-auto max-w-[1600px]">
              <SectionLabel>Related Products</SectionLabel>
              <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
                {related.map((r) => (
                  <MerchCard
                    key={r.slug}
                    product={r}
                    onSelect={() => setDetailSlug(r.slug, "product")}
                    onQuickAdd={
                      r.available ? () => addToCart() : undefined
                    }
                  />
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </PageShell>
  );
}
