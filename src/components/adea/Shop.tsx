"use client";

import { useState, useMemo, useCallback } from "react";
import { useAppStore } from "@/lib/store";
import { PlatformIcon } from "./SiteChrome";
import {
  SHOP_ALBUMS,
  ALL_PRODUCTS,
  SHOP_TABS,
  PRODUCT_GROUPS,
  type ShopProduct,
  type ShopAlbum,
} from "@/lib/catalog";
import {
  Play,
  Plus,
  X,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
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
      <div className="relative bg-ink text-bone w-full max-w-2xl mx-4 p-8 sm:p-12 border border-border">
        <button
          onClick={() => onOpenChange(false)}
          className="absolute top-4 right-4 text-ash hover:text-bone cursor-pointer"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>
        <div className="text-center">
          <p className="text-[10px] uppercase tracking-[0.3em] text-ash">
            Stream Now
          </p>
          <h3 className="mt-3 text-2xl sm:text-3xl text-bone">{title}</h3>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {STREAM_PLATFORMS.map((p) => (
            <a
              key={p.key}
              href="#"
              onClick={(e) => e.preventDefault()}
              className="group/plt flex items-center gap-3 border border-border px-4 py-4 hover:border-bone/40 hover:bg-bone/5 transition-all cursor-pointer"
            >
              <PlatformIcon name={p.key} className="h-4 w-4 text-ash group-hover/plt:text-bone shrink-0" />
              <span className="text-[11px] uppercase tracking-[0.15em] text-ash group-hover/plt:text-bone">
                {p.label}
              </span>
              <Play className="ml-auto h-3.5 w-3.5 text-ash/40 group-hover/plt:text-bone opacity-0 group-hover/plt:opacity-100 transition-opacity shrink-0" />
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
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <ShoppingBag className="h-8 w-8 text-black/10" />
          </div>
        )}
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
      <div className="mt-3">
        <p className="text-[12px] font-medium uppercase tracking-wide text-black/80 leading-tight line-clamp-1">
          {product.name}
        </p>
        <div className="mt-1 flex items-center gap-3">
          <span className={`text-sm ${available ? "text-black" : "text-black/30"}`}>
            {available ? `$${product.price}.00` : "Sold Out"}
          </span>
          {available && product.sizes.length > 0 && (
            <span className="text-[10px] text-black/30">
              {product.sizes.join(" / ")}
            </span>
          )}
        </div>
        {product.colors.length > 0 && (
          <div className="mt-2 flex gap-1.5">
            {product.colors.map((c) => (
              <span
                key={c.hex}
                className="block h-3 w-3 rounded-full border border-black/10"
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
   ALBUM COLLECTION CARD
   ═══════════════════════════════════════════════════ */

function AlbumCard({
  album,
  onSelect,
}: {
  album: ShopAlbum;
  onSelect: () => void;
}) {
  return (
    <div
      className="group cursor-pointer"
      onClick={onSelect}
    >
      <div className="relative aspect-square overflow-hidden bg-[#f0f0f0]">
        {album.cover ? (
          <img
            src={album.cover}
            alt={album.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <ShoppingBag className="h-10 w-10 text-black/10" />
          </div>
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
      </div>
      <div className="mt-4">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-black">
          {album.title}
        </h3>
        <p className="mt-1 text-[11px] text-black/40 uppercase tracking-wider">
          {album.releaseDate}
        </p>
        <p className="mt-2 text-[12px] text-black/60 line-clamp-2 leading-relaxed">
          {album.description}
        </p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   DARK HEADER (shared)
   ═══════════════════════════════════════════════════ */

function ShopDarkHeader({
  eyebrow,
  title,
  italic,
}: {
  eyebrow: string;
  title: string;
  italic?: string;
}) {
  return (
    <section className="relative bg-ink px-6 pb-20 pt-40 md:px-12 md:pb-28 md:pt-56">
      <div className="mx-auto max-w-[1600px]">
        <p className="text-[10px] uppercase tracking-[0.25em] text-ash">
          {eyebrow}
        </p>
        <h1 className="mt-6 text-display text-[clamp(4rem,14vw,14rem)] leading-[0.9] text-bone">
          {title}
          {italic && (
            <span className="block italic text-ash">{italic}</span>
          )}
        </h1>
      </div>
      {/* Gradient transition to white */}
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   SHOP PAGE
   ═══════════════════════════════════════════════════ */

export function ShopPage() {
  const { setDetailSlug } = useAppStore();
  const [shopTab, setShopTab] = useState(SHOP_TABS[0]);
  const [activeGroup, setActiveGroup] = useState(PRODUCT_GROUPS[0]);
  const [activeColor, setActiveColor] = useState<string | null>(null);
  const { addToCart } = useAppStore();

  /* All unique colors */
  const allColors = useMemo(() => {
    const map = new Map<string, string>();
    for (const p of ALL_PRODUCTS) {
      for (const c of p.colors) {
        if (!map.has(c.name)) map.set(c.name, c.hex);
      }
    }
    return Array.from(map.entries()).map(([name, hex]) => ({ name, hex }));
  }, []);

  /* Filter products */
  const filtered = useMemo(() => {
    let list = ALL_PRODUCTS;
    if (activeGroup.categories) {
      list = list.filter((p) =>
        activeGroup.categories!.includes(p.category)
      );
    }
    if (activeColor) {
      list = list.filter((p) =>
        p.colors.some((c) => c.name === activeColor)
      );
    }
    return list;
  }, [activeGroup, activeColor]);

  const availableCount = filtered.filter((p) => p.stock > 0).length;

  const openProduct = useCallback(
    (p: ShopProduct) => {
      setDetailSlug(p.slug, "product");
    },
    [setDetailSlug]
  );

  const openAlbum = useCallback(
    (album: ShopAlbum) => {
      setDetailSlug(album.slug, "album");
    },
    [setDetailSlug]
  );

  const handleQuickAdd = useCallback(() => {
    addToCart();
  }, [addToCart]);

  return (
    <>
      <ShopDarkHeader eyebrow="06 — Shop" title="Shop." />

      <section className="bg-white px-6 py-12 md:px-12 md:py-16">
        <div className="mx-auto max-w-[1400px]">
          {/* Tab bar */}
          <div className="flex items-center gap-8 border-b border-black/10 pb-0">
            {SHOP_TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setShopTab(tab)}
                className={`relative pb-3 text-[12px] font-medium uppercase tracking-[0.15em] transition-colors cursor-pointer ${
                  shopTab === tab
                    ? "text-black border-b-2 border-black"
                    : "text-black/40 hover:text-black/70"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {shopTab === "Shop All" && (
            <div className="mt-10">
              {/* Group filter pills */}
              <div className="flex flex-wrap items-center gap-2">
                {PRODUCT_GROUPS.map((g) => {
                  const isActive =
                    activeGroup.label === g.label;
                  return (
                    <button
                      key={g.label}
                      onClick={() => setActiveGroup(g)}
                      className={`px-4 py-2 text-[11px] uppercase tracking-[0.15em] border transition-all cursor-pointer ${
                        isActive
                          ? "bg-black text-white border-black"
                          : "bg-white text-black/60 border-black/15 hover:border-black/40"
                      }`}
                    >
                      {g.label}
                    </button>
                  );
                })}

                {/* Color filter pills */}
                {allColors.length > 0 && (
                  <span className="mx-2 h-5 w-px bg-black/10" />
                )}
                {allColors.map((c) => (
                  <button
                    key={c.name}
                    onClick={() =>
                      setActiveColor((prev) =>
                        prev === c.name ? null : c.name
                      )
                    }
                    className={`flex items-center gap-1.5 px-3 py-2 text-[10px] uppercase tracking-wider border transition-all cursor-pointer ${
                      activeColor === c.name
                        ? "border-black bg-black/5"
                        : "border-transparent hover:border-black/20"
                    }`}
                    title={c.name}
                  >
                    <span
                      className="block h-3 w-3 rounded-full border border-black/10"
                      style={{ backgroundColor: c.hex }}
                    />
                    <span className="text-black/50">{c.name}</span>
                  </button>
                ))}

                {/* Clear filter */}
                {(activeGroup.label !== "All" || activeColor) && (
                  <button
                    onClick={() => {
                      setActiveGroup(PRODUCT_GROUPS[0]);
                      setActiveColor(null);
                    }}
                    className="ml-2 text-[10px] uppercase tracking-wider text-black/30 hover:text-black/60 underline cursor-pointer"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Count */}
              <p className="mt-4 text-[11px] text-black/30">
                {filtered.length} product
                {filtered.length !== 1 ? "s" : ""} ·{" "}
                {availableCount} available
              </p>

              {/* Product grid */}
              <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:gap-x-6">
                {filtered.map((p) => (
                  <ProductCard
                    key={p.slug}
                    product={p}
                    onSelect={() => openProduct(p)}
                    onQuickAdd={handleQuickAdd}
                  />
                ))}
              </div>

              {filtered.length === 0 && (
                <div className="mt-20 text-center">
                  <p className="text-sm text-black/30">
                    No products match your filters.
                  </p>
                </div>
              )}
            </div>
          )}

          {shopTab === "Collections" && (
            <div className="mt-10">
              <p className="text-[11px] text-black/30 mb-8">
                {SHOP_ALBUMS.length} collections
              </p>
              <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
                {SHOP_ALBUMS.map((album) => (
                  <AlbumCard
                    key={album.slug}
                    album={album}
                    onSelect={() => openAlbum(album)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

/* ═══════════════════════════════════════════════════
   ALBUM DETAIL PAGE
   ═══════════════════════════════════════════════════ */

export function AlbumDetailPage() {
  const { detailSlug, setDetailSlug, addToCart, setActiveTab } =
    useAppStore();
  const [streamOpen, setStreamOpen] = useState(false);
  const [streamTitle, setStreamTitle] = useState("");

  const album = useMemo(
    () => SHOP_ALBUMS.find((a) => a.slug === detailSlug),
    [detailSlug]
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

  const openStream = useCallback((title: string) => {
    setStreamTitle(title);
    setStreamOpen(true);
  }, []);

  if (!album) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <p className="text-sm text-black/40">Album not found.</p>
      </div>
    );
  }

  const digitalPrice = 12;
  const vinylProduct = album.merch.find((m) => m.category === "Vinyl");

  return (
    <>
      {/* ── Dark hero ── */}
      <section className="relative bg-ink px-6 pb-16 pt-36 md:px-12 md:pb-20 md:pt-48">
        <div className="mx-auto max-w-[1400px]">
          {/* Back button */}
          <button
            onClick={() => {
              setDetailSlug(null, null);
              setActiveTab("shop");
            }}
            className="mb-10 flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-ash hover:text-bone transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Shop
          </button>

          {/* Two-column hero */}
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-16">
            {/* Left: album image */}
            <div className="relative aspect-square overflow-hidden bg-white/5">
              {album.cover ? (
                <img
                  src={album.cover}
                  alt={album.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-ash/20">
                  <ShoppingBag className="h-16 w-16" />
                </div>
              )}
            </div>

            {/* Right: album info */}
            <div className="flex flex-col justify-center">
              <p className="text-[10px] uppercase tracking-[0.3em] text-ash">
                Collection
              </p>
              <h1 className="mt-4 text-display text-[clamp(2.5rem,6vw,5.5rem)] leading-[0.9] text-bone">
                {album.title}
              </h1>
              <p className="mt-3 text-[12px] uppercase tracking-[0.15em] text-ash">
                {album.releaseDate} · {album.duration}
              </p>
              <p className="mt-6 max-w-md text-base leading-relaxed text-bone/70">
                {album.description}
              </p>
              {album.quote && (
                <p className="mt-4 text-sm italic text-ash">
                  &ldquo;{album.quote}&rdquo;
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Gradient transition to white */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* ── Action rows ── */}
      <section className="bg-white px-6 py-12 md:px-12 md:py-16">
        <div className="mx-auto max-w-[1400px]">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
            {/* Stream Album */}
            <button
              onClick={() => openStream(album.title + " — Album")}
              className="group flex items-center gap-4 border border-black/10 px-5 py-4 hover:border-black hover:bg-black hover:text-white transition-all cursor-pointer text-left"
            >
              <Play className="h-4 w-4 shrink-0" />
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] opacity-50">
                  Stream
                </p>
                <p className="text-[13px] font-medium">Album</p>
              </div>
            </button>

            {/* Stream Single */}
            {album.singleTitle && (
              <button
                onClick={() =>
                  openStream(album.singleTitle! + " — Single")
                }
                className="group flex items-center gap-4 border border-black/10 px-5 py-4 hover:border-black hover:bg-black hover:text-white transition-all cursor-pointer text-left"
              >
                <Play className="h-4 w-4 shrink-0" />
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] opacity-50">
                    Stream Single
                  </p>
                  <p className="text-[13px] font-medium">
                    {album.singleTitle}
                  </p>
                </div>
              </button>
            )}

            {/* Add Digital */}
            <button
              onClick={() => addToCart()}
              className="group flex items-center gap-4 border border-black/10 px-5 py-4 hover:border-black hover:bg-black hover:text-white transition-all cursor-pointer text-left"
            >
              <Plus className="h-4 w-4 shrink-0" />
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] opacity-50">
                  Add to Cart
                </p>
                <p className="text-[13px] font-medium">
                  Digital &mdash; ${digitalPrice}.00
                </p>
              </div>
            </button>

            {/* Add Vinyl */}
            <button
              onClick={() => addToCart()}
              disabled={!vinylProduct || vinylProduct.stock === 0}
              className={`group flex items-center gap-4 border border-black/10 px-5 py-4 transition-all cursor-pointer text-left ${
                vinylProduct && vinylProduct.stock > 0
                  ? "hover:border-black hover:bg-black hover:text-white"
                  : "opacity-40 cursor-not-allowed"
              }`}
            >
              <Plus className="h-4 w-4 shrink-0" />
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] opacity-50">
                  Add to Cart
                </p>
                <p className="text-[13px] font-medium">
                  Vinyl
                  {vinylProduct
                    ? ` — $${vinylProduct.price}.00`
                    : " — Sold Out"}
                </p>
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* ── Associated Merch (4×2 grid) ── */}
      <section className="bg-white px-6 pb-12 md:px-12 md:pb-16">
        <div className="mx-auto max-w-[1400px]">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-black/30">
                Merchandise
              </p>
              <p className="mt-1 text-[12px] text-black/50">
                {album.merch.length} items ·{" "}
                {album.merch.filter((m) => m.stock > 0).length} available
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:gap-x-6">
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
      </section>

      {/* ── Video grid (2×2) ── */}
      <section className="bg-white px-6 pb-20 md:px-12 md:pb-28">
        <div className="mx-auto max-w-[1400px]">
          <p className="mb-8 text-[10px] uppercase tracking-[0.2em] text-black/30">
            Visuals
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="relative aspect-video overflow-hidden bg-[#f0f0f0]"
              >
                <div className="flex h-full w-full items-center justify-center text-[11px] uppercase tracking-widest text-black/15">
                  Video {i}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <StreamingOverlay
        open={streamOpen}
        onOpenChange={setStreamOpen}
        title={streamTitle}
      />
    </>
  );
}

/* ═══════════════════════════════════════════════════
   PRODUCT DETAIL PAGE
   ═══════════════════════════════════════════════════ */

export function ProductDetailPage() {
  const { detailSlug, setDetailSlug, addToCart, setActiveTab } =
    useAppStore();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [notifyEmail, setNotifyEmail] = useState("");
  const [notifySent, setNotifySent] = useState(false);

  const product = useMemo(
    () => ALL_PRODUCTS.find((p) => p.slug === detailSlug),
    [detailSlug]
  );

  const available = product ? product.stock > 0 : false;

  /* Related products: same album, different product */
  const related = useMemo(() => {
    if (!product) return [];
    return ALL_PRODUCTS.filter(
      (p) =>
        p.albumSlug === product.albumSlug && p.slug !== product.slug
    ).slice(0, 4);
  }, [product]);

  const openRelated = useCallback(
    (p: ShopProduct) => {
      setDetailSlug(p.slug, "product");
      setSelectedSize(null);
      setNotifySent(false);
    },
    [setDetailSlug]
  );

  const handleAddToCart = useCallback(() => {
    if (available) {
      addToCart();
    }
  }, [available, addToCart]);

  const handleNotify = useCallback(() => {
    if (notifyEmail) {
      setNotifySent(true);
    }
  }, [notifyEmail]);

  if (!product) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <p className="text-sm text-black/40">Product not found.</p>
      </div>
    );
  }

  return (
    <>
      {/* Dark header */}
      <section className="relative bg-ink px-6 pb-16 pt-36 md:px-12 md:pb-20 md:pt-48">
        <div className="mx-auto max-w-[1400px]">
          <button
            onClick={() => {
              /* Go back to the album page if we came from one, otherwise shop */
              const parentAlbum = SHOP_ALBUMS.find(
                (a) => a.slug === product.albumSlug
              );
              if (parentAlbum) {
                setDetailSlug(parentAlbum.slug, "album");
              } else {
                setDetailSlug(null, null);
                setActiveTab("shop");
              }
            }}
            className="mb-10 flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-ash hover:text-bone transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          <p className="text-[10px] uppercase tracking-[0.3em] text-ash">
            {product.category}
          </p>
          <h1 className="mt-4 text-display text-[clamp(2rem,5vw,4.5rem)] leading-[0.9] text-bone">
            {product.name}
          </h1>
        </div>
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* White body */}
      <section className="bg-white px-6 pb-20 md:px-12 md:pb-28">
        <div className="mx-auto max-w-[1400px]">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-16">
            {/* Left: Image gallery */}
            <div>
              <div className="relative aspect-square overflow-hidden bg-[#f0f0f0]">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <ShoppingBag className="h-12 w-12 text-black/10" />
                  </div>
                )}
                {!available && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/70">
                    <span className="text-[11px] font-medium uppercase tracking-widest text-black/40">
                      Sold Out
                    </span>
                  </div>
                )}
              </div>

              {/* Color swatches */}
              {product.colors.length > 0 && (
                <div className="mt-4 flex items-center gap-3">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-black/30">
                    Color
                  </span>
                  {product.colors.map((c) => (
                    <span
                      key={c.hex}
                      className="block h-5 w-5 rounded-full border-2 border-black/10 cursor-pointer hover:border-black/40 transition-colors"
                      style={{ backgroundColor: c.hex }}
                      title={c.name}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Right: Info */}
            <div className="flex flex-col">
              <p className="text-2xl font-light">
                {available ? `$${product.price}.00` : "Sold Out"}
              </p>
              {available && product.stock < 20 && (
                <p className="mt-1 text-[11px] text-black/40">
                  Only {product.stock} left
                </p>
              )}

              <p className="mt-6 text-[12px] font-medium uppercase tracking-[0.2em] text-black/40">
                {product.albumTitle} Collection
              </p>

              <p className="mt-4 text-sm leading-relaxed text-black/70">
                {product.description}
              </p>

              {/* Size selector */}
              {product.sizes.length > 0 && (
                <div className="mt-8">
                  <p className="mb-3 text-[10px] uppercase tracking-[0.2em] text-black/40">
                    Size
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((s) => (
                      <button
                        key={s}
                        onClick={() => setSelectedSize(s)}
                        className={`h-10 min-w-[48px] px-4 text-[12px] uppercase tracking-wider border transition-all cursor-pointer ${
                          selectedSize === s
                            ? "bg-black text-white border-black"
                            : "bg-white text-black/60 border-black/15 hover:border-black/40"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Add to Cart / Notify Me */}
              <div className="mt-8">
                {available ? (
                  <button
                    onClick={handleAddToCart}
                    className="w-full bg-black py-4 text-[12px] uppercase tracking-[0.2em] text-white hover:bg-black/80 transition-colors cursor-pointer"
                  >
                    Add to Cart
                  </button>
                ) : notifySent ? (
                  <div className="border border-black/10 py-4 text-center text-[12px] text-black/50">
                    You&apos;ll be notified when available.
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="email"
                      placeholder="Email for notification"
                      value={notifyEmail}
                      onChange={(e) => setNotifyEmail(e.target.value)}
                      className="flex-1 border border-black/15 px-4 py-3 text-[12px] placeholder:text-black/25 focus:outline-none focus:border-black/40"
                    />
                    <button
                      onClick={handleNotify}
                      className="bg-black px-6 py-3 text-[12px] uppercase tracking-[0.15em] text-white hover:bg-black/80 transition-colors cursor-pointer"
                    >
                      Notify Me
                    </button>
                  </div>
                )}
              </div>

              {/* Shipping info */}
              <div className="mt-6 border-t border-black/5 pt-6">
                <p className="text-[11px] text-black/30">
                  Free shipping on orders over $100. Ships in 3–5 business
                  days. 30-day returns.
                </p>
              </div>
            </div>
          </div>

          {/* Related products */}
          {related.length > 0 && (
            <div className="mt-20">
              <p className="mb-8 text-[10px] uppercase tracking-[0.2em] text-black/30">
                From the same collection
              </p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:gap-x-6">
                {related.map((p) => (
                  <ProductCard
                    key={p.slug}
                    product={p}
                    onSelect={() => openRelated(p)}
                    onQuickAdd={() => addToCart()}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
