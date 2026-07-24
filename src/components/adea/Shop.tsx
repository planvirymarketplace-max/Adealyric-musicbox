"use client";

import { useMemo, useState } from "react";
import { PageShell, PageIntro } from "./SiteChrome";
import { useAppStore } from "@/lib/store";
import { PRODUCTS } from "@/lib/catalog";

const TYPES = ["All", "Vinyl", "CD", "Apparel", "Print"] as const;
const SORTS = ["Featured", "Price ↑", "Price ↓", "New"] as const;

export function ShopPage() {
  const [type, setType] = useState<(typeof TYPES)[number]>("All");
  const [sort, setSort] = useState<(typeof SORTS)[number]>("Featured");
  const [cols, setCols] = useState<2 | 3 | 4>(3);
  const { setDetailSlug } = useAppStore();

  const items = useMemo(() => {
    let list = type === "All" ? PRODUCTS : PRODUCTS.filter((p) => p.type === type);
    if (sort === "Price ↑") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "Price ↓") list = [...list].sort((a, b) => b.price - a.price);
    return list;
  }, [type, sort]);

  const counts = useMemo(() => {
    const m = new Map<string, number>();
    PRODUCTS.forEach((p) => m.set(p.type, (m.get(p.type) ?? 0) + 1));
    m.set("All", PRODUCTS.length);
    return m;
  }, []);

  return (
    <>
      <PageIntro eyebrow="The Shop" title="Objects," italic="in editions." sub="Every item is numbered, limited, and pulled straight from the studio. Ships worldwide." />
      <section className="sticky top-[73px] z-20 border-y border-border bg-ink/80 px-6 backdrop-blur-md md:px-12">
        <div className="mx-auto flex max-w-[1600px] flex-col justify-between gap-4 py-4 md:flex-row md:items-center">
          <div className="flex flex-wrap gap-2">
            {TYPES.map((t) => (
              <button key={t} onClick={() => setType(t)} className={`flex items-center gap-2 border px-4 py-2 text-eyebrow transition-all cursor-pointer ${type === t ? "border-bone bg-bone text-ink" : "border-border text-bone/70 hover:border-bone hover:text-bone"}`}>
                {t}
                <span className="opacity-60">{counts.get(t) ?? 0}</span>
              </button>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-eyebrow text-ash">Sort</span>
              <select value={sort} onChange={(e) => setSort(e.target.value as (typeof SORTS)[number])} className="border border-border bg-ink px-3 py-2 text-eyebrow text-bone focus:border-bone focus:outline-none">
                {SORTS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="hidden items-center gap-1 border border-border md:flex">
              {[2, 3, 4].map((n) => (
                <button key={n} onClick={() => setCols(n as 2 | 3 | 4)} className={`px-3 py-2 text-eyebrow cursor-pointer ${cols === n ? "bg-bone text-ink" : "text-bone/70 hover:text-bone"}`}>{n}×</button>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="px-6 py-16 md:px-12 md:py-24">
        <div className={`mx-auto grid max-w-[1600px] gap-4 md:gap-8 ${cols === 2 ? "grid-cols-1 md:grid-cols-2" : cols === 3 ? "grid-cols-2 md:grid-cols-3" : "grid-cols-2 md:grid-cols-4"}`}>
          {items.map((p) => (
            <button key={p.slug} onClick={() => setDetailSlug(p.slug, "product")} className="group relative block cursor-pointer text-left">
              <div className="relative aspect-square overflow-hidden border border-border bg-mist">
                <img src={p.image} alt={p.name} className="absolute inset-0 h-full w-full object-cover grayscale transition-all duration-[1200ms] group-hover:scale-105 group-hover:grayscale-0" />
                <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4">
                  <span className="text-eyebrow bg-ink/60 px-2 py-1 text-bone backdrop-blur-sm">{p.type}</span>
                  {p.edition && <span className="text-eyebrow bg-ink/60 px-2 py-1 text-bone backdrop-blur-sm">{p.edition}</span>}
                </div>
                <div className="absolute inset-x-0 bottom-0 flex translate-y-full items-center justify-between bg-bone p-4 text-ink transition-transform duration-500 group-hover:translate-y-0">
                  <span className="text-eyebrow">Quick Add</span>
                  <span className="text-eyebrow">+</span>
                </div>
              </div>
              <div className="mt-4 flex items-baseline justify-between gap-4">
                <h3 className="text-display text-xl text-bone md:text-2xl">{p.name}</h3>
                <span className="text-eyebrow shrink-0 text-bone">${p.price}</span>
              </div>
              <div className="mt-1 text-eyebrow text-ash">{p.category}</div>
            </button>
          ))}
        </div>
        {items.length === 0 && <div className="py-24 text-center text-ash">No items in this category.</div>}
      </section>
    </>
  );
}

export function ProductDetailPage() {
  const { detailSlug, setDetailSlug, addToCart } = useAppStore();
  const p = PRODUCTS.find((x) => x.slug === detailSlug);
  const [size, setSize] = useState<string | null>(p?.sizes?.[0] ?? null);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  if (!p) return null;
  const related = PRODUCTS.filter((x) => x.slug !== p.slug).slice(0, 4);

  const add = () => {
    setAdded(true);
    addToCart();
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <PageShell>
      <section className="relative min-h-[100svh] px-6 pt-32 md:px-12 md:pt-40">
        <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-12 md:grid-cols-2 md:gap-20">
          <div className="relative">
            <div className="sticky top-32 aspect-square overflow-hidden border border-border bg-mist">
              <img src={p.image} alt={p.name} className="h-full w-full object-cover grayscale" />
              <div className="absolute left-4 top-4 flex flex-col gap-2">
                <span className="text-eyebrow bg-ink/60 px-2 py-1 text-bone backdrop-blur-sm">{p.type}</span>
                {p.edition && <span className="text-eyebrow bg-ink/60 px-2 py-1 text-bone backdrop-blur-sm">{p.edition}</span>}
              </div>
            </div>
          </div>
          <div className="pb-24 md:py-16">
            <button onClick={() => setDetailSlug(null, null)} className="text-eyebrow text-ash hover:text-bone cursor-pointer">← Shop</button>
            <h1 className="mt-6 text-display text-[clamp(3rem,7vw,7rem)] leading-none text-bone">{p.name}</h1>
            <div className="mt-6 text-display text-3xl text-bone">${p.price.toFixed(2)}</div>
            <p className="mt-8 max-w-md text-lg text-bone/80">{p.description}</p>
            {p.sizes && (
              <div className="mt-10">
                <div className="text-eyebrow text-ash">Size</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {p.sizes.map((s: string) => (
                    <button key={s} onClick={() => setSize(s)} className={`grid h-14 min-w-14 place-items-center border px-4 text-eyebrow transition-all cursor-pointer ${size === s ? "border-bone bg-bone text-ink" : "border-border text-bone/70 hover:border-bone"}`}>{s}</button>
                  ))}
                </div>
              </div>
            )}
            <div className="mt-10">
              <div className="text-eyebrow text-ash">Quantity</div>
              <div className="mt-3 inline-flex items-center border border-border">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="grid h-12 w-12 place-items-center text-bone hover:bg-mist cursor-pointer">−</button>
                <span className="w-12 text-center text-bone">{qty}</span>
                <button onClick={() => setQty(qty + 1)} className="grid h-12 w-12 place-items-center text-bone hover:bg-mist cursor-pointer">+</button>
              </div>
            </div>
            <button
              onClick={add}
              className={`mt-10 flex w-full items-center justify-between border border-bone px-8 py-6 text-eyebrow transition-all cursor-pointer ${added ? "bg-bone text-ink" : "bg-transparent text-bone hover:bg-bone hover:text-ink"}`}
            >
              <span>{added ? "Added to cart" : "Add to cart"}</span>
              <span className="text-display text-xl">${(p.price * qty).toFixed(2)}</span>
            </button>
            <dl className="mt-12 grid grid-cols-2 gap-6">
              {[["Ships", "Within 3 days"], ["Free over", "$100"], ["Returns", "30 days"], ["From", "West Philly"]].map(([k, v]) => (
                <div key={k} className="border-t border-border pt-3">
                  <dt className="text-eyebrow text-ash">{k}</dt>
                  <dd className="mt-1 text-bone">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>
      <section className="border-t border-border px-6 py-24 md:px-12">
        <div className="mx-auto max-w-[1600px]">
          <div className="mb-10 flex items-end justify-between">
            <h2 className="text-display text-4xl text-bone md:text-6xl">More Objects</h2>
            <button onClick={() => setDetailSlug(null, null)} className="text-eyebrow text-bone cursor-pointer">All →</button>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-8">
            {related.map((r) => (
              <button key={r.slug} onClick={() => { setDetailSlug(r.slug, "product"); setSize(r.sizes?.[0] ?? null); setQty(1); }} className="group cursor-pointer text-left">
                <div className="relative aspect-square overflow-hidden border border-border">
                  <img src={r.image} alt={r.name} className="h-full w-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0" />
                </div>
                <div className="mt-3 flex items-baseline justify-between gap-2">
                  <span className="text-bone">{r.name}</span>
                  <span className="text-eyebrow text-ash">${r.price}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
