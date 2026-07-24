import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageShell, PageIntro } from "@/components/SiteChrome";
import { PRODUCTS } from "@/lib/catalog";

const TYPES = ["All", "Vinyl", "CD", "Apparel", "Print"] as const;
const SORTS = ["Featured", "Price ↑", "Price ↓", "New"] as const;

export const Route = createFileRoute("/shop/")({
  head: () => ({
    meta: [
      { title: "Shop — Adea Lyric" },
      {
        name: "description",
        content:
          "Vinyl, cassettes, apparel and signed prints from Adea Lyric. Limited editions, direct from West Philly.",
      },
      { property: "og:title", content: "Shop — Adea Lyric" },
      { property: "og:description", content: "Limited editions, direct from West Philly." },
    ],
  }),
  component: ShopPage,
});

function ShopPage() {
  const [type, setType] = useState<(typeof TYPES)[number]>("All");
  const [sort, setSort] = useState<(typeof SORTS)[number]>("Featured");
  const [cols, setCols] = useState<2 | 3 | 4>(3);

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
    <PageShell>
      <PageIntro
        eyebrow="The Shop"
        title="Objects,"
        italic="in editions."
        sub="Every item is numbered, limited, and pulled straight from the studio. Ships worldwide."
      />

      {/* Controls */}
      <section className="sticky top-[73px] z-20 border-y border-border bg-ink/80 px-6 backdrop-blur-md md:px-12">
        <div className="mx-auto flex max-w-[1600px] flex-col justify-between gap-4 py-4 md:flex-row md:items-center">
          <div className="flex flex-wrap gap-2">
            {TYPES.map((t) => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={`flex items-center gap-2 border px-4 py-2 text-eyebrow transition-all ${
                  type === t
                    ? "border-bone bg-bone text-ink"
                    : "border-border text-bone/70 hover:border-bone hover:text-bone"
                }`}
              >
                {t}
                <span className="opacity-60">{counts.get(t) ?? 0}</span>
              </button>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-eyebrow text-ash">Sort</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as (typeof SORTS)[number])}
                className="border border-border bg-ink px-3 py-2 text-eyebrow text-bone focus:border-bone focus:outline-none"
              >
                {SORTS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div className="hidden items-center gap-1 border border-border md:flex">
              {[2, 3, 4].map((n) => (
                <button
                  key={n}
                  onClick={() => setCols(n as 2 | 3 | 4)}
                  className={`px-3 py-2 text-eyebrow ${cols === n ? "bg-bone text-ink" : "text-bone/70 hover:text-bone"}`}
                >
                  {n}×
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="px-6 py-16 md:px-12 md:py-24">
        <div
          className={`mx-auto grid max-w-[1600px] gap-4 md:gap-8 ${
            cols === 2
              ? "grid-cols-1 md:grid-cols-2"
              : cols === 3
                ? "grid-cols-2 md:grid-cols-3"
                : "grid-cols-2 md:grid-cols-4"
          }`}
        >
          {items.map((p) => (
            <Link
              key={p.slug}
              to="/shop/$slug"
              params={{ slug: p.slug }}
              className="group relative block"
            >
              <div className="relative aspect-square overflow-hidden border border-border bg-mist">
                <img
                  src={p.image}
                  alt={p.name}
                  className="absolute inset-0 h-full w-full object-cover grayscale transition-all duration-[1200ms] group-hover:scale-105 group-hover:grayscale-0"
                />
                <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4">
                  <span className="text-eyebrow bg-ink/60 px-2 py-1 text-bone backdrop-blur-sm">
                    {p.type}
                  </span>
                  {p.edition && (
                    <span className="text-eyebrow bg-ink/60 px-2 py-1 text-bone backdrop-blur-sm">
                      {p.edition}
                    </span>
                  )}
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
            </Link>
          ))}
        </div>

        {items.length === 0 && (
          <div className="py-24 text-center text-ash">No items in this category.</div>
        )}
      </section>
    </PageShell>
  );
}
