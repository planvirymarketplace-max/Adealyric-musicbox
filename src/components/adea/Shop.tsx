"use client";

import { useState, useMemo } from "react";
import { PageShell } from "./SiteChrome";
import { useAppStore } from "@/lib/store";
import { ALBUMS, type AlbumMerchProduct } from "@/lib/catalog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Plus, ChevronLeft, ChevronRight, Play } from "lucide-react";

/* ─────────────────────────────────────────────
   CONSTANTS
   ───────────────────────────────────────────── */

const COLLECTIONS = ["All Albums", "Apparel", "Accessories", "Vinyl", "Digital"];

const STREAMING_SERVICES = [
  { key: "spotify", label: "Spotify" },
  { key: "appleMusic", label: "Apple Music" },
  { key: "tiktok", label: "TikTok" },
  { key: "instagram", label: "Instagram" },
  { key: "amazonMusic", label: "Amazon Music" },
  { key: "youtube", label: "YouTube" },
  { key: "tidal", label: "Tidal" },
  { key: "pandora", label: "Pandora" },
];

/* ─────────────────────────────────────────────
   STREAMING MODAL
   ───────────────────────────────────────────── */

function StreamingModal({
  open,
  onOpenChange,
  title,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title: string;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white text-[#1A1A1A] sm:max-w-md rounded-none p-0 gap-0">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="text-lg font-normal tracking-wide uppercase">
            Stream — {title}
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            Choose your preferred platform
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-0 px-6 pb-6">
          {STREAMING_SERVICES.map((s) => (
            <a
              key={s.key}
              href="#"
              onClick={(e) => e.preventDefault()}
              className="flex items-center gap-3 border border-[#E5E5E5] px-4 py-3 text-sm text-[#1A1A1A] transition-colors hover:bg-[#F5F5F5] cursor-pointer"
            >
              <span className="text-base">●</span>
              {s.label}
            </a>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ─────────────────────────────────────────────
   HELPERS
   ───────────────────────────────────────────── */

function PlaceholderImage({ label = "Image", className = "" }: { label?: string; className?: string }) {
  return (
    <div
      className={`flex items-center justify-center bg-[#F5F5F5] text-gray-400 text-xs uppercase tracking-widest select-none ${className}`}
    >
      {label}
    </div>
  );
}

function MerchCard({ product, onSelect }: { product: AlbumMerchProduct; onSelect: () => void }) {
  return (
    <div
      className="group cursor-pointer"
      onClick={onSelect}
    >
      <div className="relative aspect-square bg-[#F5F5F5]">
        <PlaceholderImage label={product.category} className="absolute inset-0" />
        {/* Quick add button */}
        {product.available && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              product.onSelect?.();
            }}
            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-[#1A1A1A] text-white opacity-0 transition-opacity group-hover:opacity-100 cursor-pointer"
            aria-label="Quick add to cart"
          >
            <Plus className="h-4 w-4" />
          </button>
        )}
        {/* Sold out overlay */}
        {!product.available && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#F5F5F5]/80">
            <span className="text-xs uppercase tracking-widest text-gray-400">Sold out</span>
          </div>
        )}
      </div>
      <div className="mt-3">
        <p className="text-xs uppercase tracking-wide text-[#1A1A1A] truncate">{product.name}</p>
        <p className={`mt-1 text-xs ${product.available ? "text-[#1A1A1A]" : "text-gray-400"}`}>
          {product.available ? `$${product.price}.00` : "SOLD OUT"}
        </p>
      </div>
    </div>
  );
}

function ActionRow({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center justify-between border-t border-[#E5E5E5] py-4 text-sm text-[#1A1A1A] transition-colors hover:bg-[#FAFAFA] cursor-pointer"
    >
      <span>{label}</span>
      <span className="text-[#1A1A1A]">●</span>
    </button>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="pb-4 mb-8 text-center">
      <h2 className="text-sm uppercase tracking-widest text-[#1A1A1A] pb-4 border-b border-[#E5E5E5]">
        {title}
      </h2>
    </div>
  );
}

/* ─────────────────────────────────────────────
   SHOP PAGE
   ───────────────────────────────────────────── */

export function ShopPage() {
  const { setDetailSlug, addToCart } = useAppStore();
  const [activeCollection, setActiveCollection] = useState("All Albums");

  return (
    <div className="min-h-screen bg-white text-[#1A1A1A]">
      {/* Header */}
      <div className="px-6 pt-28 pb-8 md:px-12 md:pt-36 md:pb-12 max-w-[1600px] mx-auto">
        <h1 className="text-4xl md:text-6xl font-light tracking-tight">Shop</h1>
        <p className="mt-4 text-sm text-gray-500 max-w-md">
          Official Adea Lyric merchandise, vinyl, and digital releases. Everything ships worldwide.
        </p>
      </div>

      {/* Collections row */}
      <div className="border-b border-[#E5E5E5]">
        <div className="px-6 md:px-12 max-w-[1600px] mx-auto">
          <div className="flex gap-0 overflow-x-auto">
            {COLLECTIONS.map((c) => (
              <button
                key={c}
                onClick={() => setActiveCollection(c)}
                className={`shrink-0 px-5 py-4 text-xs uppercase tracking-widest transition-colors cursor-pointer ${
                  activeCollection === c
                    ? "text-[#1A1A1A] border-b-2 border-[#1A1A1A]"
                    : "text-gray-400 hover:text-[#1A1A1A]"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Album Grid */}
      <div className="px-6 py-12 md:px-12 md:py-16 max-w-[1600px] mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {ALBUMS.map((album) => (
            <div
              key={album.slug}
              className="group cursor-pointer"
              onClick={() => setDetailSlug(album.slug, "album")}
            >
              <div className="relative aspect-square bg-[#F5F5F5] overflow-hidden">
                <PlaceholderImage label="Album Art" className="absolute inset-0 transition-transform duration-500 group-hover:scale-105" />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart();
                  }}
                  className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-[#1A1A1A] text-white opacity-0 transition-opacity group-hover:opacity-100 cursor-pointer"
                  aria-label="Quick add to cart"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-3">
                <p className="text-sm font-medium text-[#1A1A1A]">{album.title}</p>
                <p className="mt-1 text-xs text-gray-400">{album.releaseDate}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Merch Row */}
      <div className="border-t border-[#E5E5E5]">
        <div className="px-6 pt-12 pb-4 md:px-12">
          <div className="mb-8 text-center">
            <h2 className="text-sm uppercase tracking-widest text-[#1A1A1A] pb-4 border-b border-[#E5E5E5]">
              Featured Merch
            </h2>
          </div>
        </div>
        <div className="px-6 pb-12 md:px-12 max-w-[1600px] mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {/* Show first merch item from each album */}
            {ALBUMS.slice(0, 4).map((album) =>
              album.merch.slice(0, 2).map((product) => (
                <div key={product.slug} className="group cursor-pointer">
                  <div className="relative aspect-square bg-[#F5F5F5]">
                    <PlaceholderImage label={product.category} className="absolute inset-0" />
                    {!product.available && (
                      <div className="absolute inset-0 flex items-center justify-center bg-white/60">
                        <span className="text-[10px] uppercase tracking-widest text-gray-400">Sold out</span>
                      </div>
                    )}
                    {product.available && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart();
                        }}
                        className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-[#1A1A1A] text-white opacity-0 transition-opacity group-hover:opacity-100 cursor-pointer"
                        aria-label="Quick add"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                  <div className="mt-2">
                    <p className="text-[10px] uppercase tracking-wider text-[#1A1A1A] truncate">{product.name}</p>
                    <p className={`mt-0.5 text-[10px] ${product.available ? "text-[#1A1A1A]" : "text-gray-400"}`}>
                      {product.available ? `$${product.price}.00` : "SOLD OUT"}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   ALBUM DETAIL PAGE
   ───────────────────────────────────────────── */

export function AlbumDetailPage() {
  const { detailSlug, setDetailSlug, addToCart } = useAppStore();
  const album = ALBUMS.find((a) => a.slug === detailSlug);
  const [streamOpen, setStreamOpen] = useState(false);
  const [streamTitle, setStreamTitle] = useState("");
  const [imgIdx, setImgIdx] = useState(0);

  if (!album) return null;

  const totalImgs = 2;

  const openStream = (label: string) => {
    setStreamTitle(label);
    setStreamOpen(true);
  };

  const addDigital = () => {
    addToCart();
  };

  const addVinyl = () => {
    addToCart();
  };

  return (
    <PageShell>
      <div className="min-h-screen bg-white text-[#1A1A1A]">
        {/* Hero */}
        <section className="px-6 pt-28 md:px-12 md:pt-36">
          <div className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
            {/* Left: Album art */}
            <div>
              <button
                onClick={() => setDetailSlug(null, null)}
                className="text-xs text-gray-400 hover:text-[#1A1A1A] cursor-pointer uppercase tracking-widest mb-6 inline-block"
              >
                ← Back to Shop
              </button>
              <div className="relative aspect-square bg-[#F5F5F5]">
                <PlaceholderImage label="Album Art" className="absolute inset-0" />
                {/* Nav arrows */}
                <button
                  onClick={() => setImgIdx((p) => (p > 0 ? p - 1 : totalImgs - 1))}
                  className="absolute left-3 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center bg-white border border-[#E5E5E5] text-[#1A1A1A] hover:bg-[#F5F5F5] cursor-pointer"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setImgIdx((p) => (p < totalImgs - 1 ? p + 1 : 0))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center bg-white border border-[#E5E5E5] text-[#1A1A1A] hover:bg-[#F5F5F5] cursor-pointer"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
                {/* Counter */}
                <span className="absolute left-3 bottom-3 text-xs text-gray-400">
                  {imgIdx + 1}/{totalImgs}
                </span>
              </div>
            </div>

            {/* Right: Info */}
            <div className="flex flex-col justify-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight leading-tight">
                {album.title}
              </h1>
              <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
                <span>{album.releaseDate}</span>
                <span>·</span>
                <span>{album.duration}</span>
              </div>

              {/* Artist note */}
              <p className="mt-8 text-xs uppercase tracking-widest text-gray-500 leading-relaxed">
                {album.description}
              </p>

              {/* Quote */}
              <blockquote className="mt-6 pl-4 border-l-2 border-[#1A1A1A] text-sm italic text-[#1A1A1A]/70">
                {album.quote}
              </blockquote>

              {/* Action rows */}
              <div className="mt-10">
                <ActionRow label="Stream Album" onClick={() => openStream(album.title)} />
                {album.singleTitle && (
                  <ActionRow
                    label={`Stream Single — ${album.singleTitle}`}
                    onClick={() => openStream(album.singleTitle)}
                  />
                )}
                <ActionRow
                  label="Add to Cart (Digital)"
                  onClick={addDigital}
                />
                <ActionRow
                  label="Add to Cart (Vinyl)"
                  onClick={addVinyl}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Associated Merch */}
        <section className="px-6 py-16 md:px-12">
          <div className="max-w-[1600px] mx-auto">
            <SectionHeader title={`${album.title} Merch`} />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {album.merch.map((product) => (
                <div key={product.slug} className="group cursor-pointer" onClick={() => setDetailSlug(product.slug, "product")}>
                  <div className="relative aspect-square bg-[#F5F5F5]">
                    <PlaceholderImage label={product.category} className="absolute inset-0" />
                    {!product.available && (
                      <div className="absolute inset-0 flex items-center justify-center bg-white/60">
                        <span className="text-xs uppercase tracking-widest text-gray-400">Sold out</span>
                      </div>
                    )}
                    {product.available && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart();
                        }}
                        className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-[#1A1A1A] text-white opacity-0 transition-opacity group-hover:opacity-100 cursor-pointer"
                        aria-label="Quick add to cart"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  <div className="mt-3">
                    <p className="text-xs uppercase tracking-wide text-[#1A1A1A] truncate">{product.name}</p>
                    <p className={`mt-1 text-xs ${product.available ? "text-[#1A1A1A]" : "text-gray-400"}`}>
                      {product.available ? `$${product.price}.00` : "SOLD OUT"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Video Section */}
        <section className="px-6 py-16 md:px-12 border-t border-[#E5E5E5]">
          <div className="max-w-[1600px] mx-auto">
            <SectionHeader title="Videos" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="relative aspect-video bg-[#F5F5F5] flex items-center justify-center group cursor-pointer">
                  <PlaceholderImage label={`Video ${n}`} className="absolute inset-0" />
                  <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-[#1A1A1A]/80 text-white opacity-0 transition-opacity group-hover:opacity-100 cursor-pointer">
                    <Play className="h-5 w-5 ml-0.5" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* Streaming Modal */}
      <StreamingModal
        open={streamOpen}
        onOpenChange={setStreamOpen}
        title={streamTitle}
      />
    </PageShell>
  );
}

/* ─────────────────────────────────────────────
   PRODUCT DETAIL PAGE
   ───────────────────────────────────────────── */

export function ProductDetailPage() {
  const { detailSlug, setDetailSlug, addToCart } = useAppStore();
  const [imgIdx, setImgIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [added, setAdded] = useState(false);

  // Find the product across all albums
  const allProducts = useMemo(() => {
    const products: (AlbumMerchProduct & { albumSlug: string; albumTitle: string })[] = [];
    ALBUMS.forEach((album) => {
      album.merch.forEach((p) => {
        products.push({ ...p, albumSlug: album.slug, albumTitle: album.title });
      });
    });
    return products;
  }, []);

  const product = allProducts.find((p) => p.slug === detailSlug);

  // Related products: same album, excluding current
  const related = useMemo(() => {
    if (!product) return [];
    return allProducts.filter((p) => p.slug !== product.slug).slice(0, 4);
  }, [product, allProducts]);

  if (!product) return null;

  const totalImgs = 3;
  const hasSizes = product.sizes && product.sizes.length > 0;

  // Auto-select first size when product changes
  if (hasSizes && !selectedSize) {
    const firstAvailable = product.sizes[0];
    setSelectedSize(firstAvailable);
  }

  const handleAdd = () => {
    setAdded(true);
    addToCart();
    setTimeout(() => setAdded(false), 1500);
  };

  const goBack = () => {
    // Go back to the album if we came from one
    if (product.albumSlug) {
      setDetailSlug(product.albumSlug, "album");
    } else {
      setDetailSlug(null, null);
    }
  };

  return (
    <PageShell>
      <div className="min-h-screen bg-white text-[#1A1A1A]">
        {/* Hero */}
        <section className="px-6 pt-28 md:px-12 md:pt-36">
          <div className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
            {/* Left: Product images */}
            <div>
              <button
                onClick={goBack}
                className="text-xs text-gray-400 hover:text-[#1A1A1A] cursor-pointer uppercase tracking-widest mb-6 inline-block"
              >
                ← Back
              </button>
              <div className="relative aspect-square bg-[#F5F5F5]">
                <PlaceholderImage label={product.name} className="absolute inset-0" />
                {/* Nav arrows */}
                <button
                  onClick={() => setImgIdx((p) => (p > 0 ? p - 1 : totalImgs - 1))}
                  className="absolute left-3 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center bg-white border border-[#E5E5E5] text-[#1A1A1A] hover:bg-[#F5F5F5] cursor-pointer"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setImgIdx((p) => (p < totalImgs - 1 ? p + 1 : 0))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center bg-white border border-[#E5E5E5] text-[#1A1A1A] hover:bg-[#F5F5F5] cursor-pointer"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
                {/* Counter */}
                <span className="absolute left-3 bottom-3 text-xs text-gray-400">
                  {imgIdx + 1}/{totalImgs}
                </span>
              </div>
            </div>

            {/* Right: Product info */}
            <div className="flex flex-col justify-center">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-light uppercase tracking-wide">
                {product.name}
              </h1>

              <p className="mt-4 text-2xl text-[#1A1A1A]">
                {product.available ? `$${product.price}.00` : <span className="text-gray-400">SOLD OUT</span>}
              </p>

              <p className="mt-6 text-sm text-gray-500 leading-relaxed max-w-md">
                Official Adea Lyric merchandise. Designed in West Philadelphia. High-quality print on premium materials.
              </p>

              {/* Size Guide */}
              <button className="mt-4 text-xs underline text-gray-500 hover:text-[#1A1A1A] cursor-pointer text-left">
                Size Guide
              </button>

              {/* Size selector */}
              {hasSizes && (
                <div className="mt-8">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Size</span>
                    {selectedSize && <span className="text-[#1A1A1A]">●</span>}
                  </div>
                  <div className="mt-2">
                    {product.sizes.map((size) => {
                      const isSelected = selectedSize === size;
                      const isAvailable = product.available;
                      return (
                        <button
                          key={size}
                          onClick={() => isAvailable && setSelectedSize(size)}
                          disabled={!isAvailable}
                          className={`flex w-full items-center justify-between border-b border-[#E5E5E5] py-3 text-sm cursor-pointer transition-colors ${
                            !isAvailable
                              ? "text-gray-300 cursor-not-allowed"
                              : isSelected
                                ? "text-[#1A1A1A]"
                                : "text-gray-500 hover:text-[#1A1A1A]"
                          }`}
                        >
                          <span>{size}</span>
                          <span className={isAvailable ? "text-[#1A1A1A]" : "text-gray-300"}>
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
                className={`mt-8 w-full py-4 text-sm uppercase tracking-widest transition-colors cursor-pointer ${
                  added
                    ? "bg-[#1A1A1A] text-white"
                    : product.available
                      ? "bg-[#1A1A1A] text-white hover:bg-[#333]"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                {added
                  ? "Added to Cart"
                  : product.available
                    ? "Add to Cart"
                    : "Sold Out"}
              </button>

              {/* Shipping info */}
              <div className="mt-8 grid grid-cols-2 gap-4 text-xs text-gray-400">
                <div className="border-t border-[#E5E5E5] pt-3">
                  <span className="block text-gray-500">Ships</span>
                  <span className="mt-1 block">3–5 business days</span>
                </div>
                <div className="border-t border-[#E5E5E5] pt-3">
                  <span className="block text-gray-500">Returns</span>
                  <span className="mt-1 block">30 days</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Related Products */}
        <section className="px-6 py-16 md:px-12 border-t border-[#E5E5E5]">
          <div className="max-w-[1600px] mx-auto">
            <div className="mb-8 text-center">
              <h2 className="text-sm uppercase tracking-widest text-[#1A1A1A] pb-4 border-b border-[#E5E5E5]">
                Related Products
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {related.map((r) => (
                <div
                  key={r.slug}
                  className="group cursor-pointer"
                  onClick={() => {
                    setDetailSlug(r.slug, "product");
                    setImgIdx(0);
                    setSelectedSize(null);
                    setAdded(false);
                  }}
                >
                  <div className="relative aspect-square bg-[#F5F5F5]">
                    <PlaceholderImage label={r.category} className="absolute inset-0" />
                    {!r.available && (
                      <div className="absolute inset-0 flex items-center justify-center bg-white/60">
                        <span className="text-xs uppercase tracking-widest text-gray-400">Sold out</span>
                      </div>
                    )}
                    {r.available && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart();
                        }}
                        className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-[#1A1A1A] text-white opacity-0 transition-opacity group-hover:opacity-100 cursor-pointer"
                        aria-label="Quick add to cart"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  <div className="mt-3">
                    <p className="text-xs uppercase tracking-wide text-[#1A1A1A] truncate">{r.name}</p>
                    <p className={`mt-1 text-xs ${r.available ? "text-[#1A1A1A]" : "text-gray-400"}`}>
                      {r.available ? `$${r.price}.00` : "SOLD OUT"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </PageShell>
  );
}
