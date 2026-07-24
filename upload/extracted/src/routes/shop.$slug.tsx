import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { PageShell } from "@/components/SiteChrome";
import { PRODUCTS } from "@/lib/catalog";

export const Route = createFileRoute("/shop/$slug")({
  loader: ({ params }) => {
    const item = PRODUCTS.find((p) => p.slug === params.slug);
    if (!item) throw notFound();
    return item;
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.name} — Adea Lyric Shop` },
          { name: "description", content: loaderData.description },
          { property: "og:title", content: `${loaderData.name} — Adea Lyric Shop` },
          { property: "og:description", content: loaderData.description },
          { property: "og:image", content: loaderData.image },
          { name: "twitter:image", content: loaderData.image },
        ]
      : [{ title: "Item — Adea Lyric Shop" }, { name: "robots", content: "noindex" }],
  }),
  component: ProductDetail,
  notFoundComponent: () => (
    <PageShell>
      <div className="grid min-h-[60vh] place-items-center px-6 text-center">
        <div>
          <div className="text-eyebrow text-ash">404</div>
          <h1 className="mt-4 text-display text-6xl text-bone">Item not found</h1>
          <Link to="/shop" className="mt-8 inline-block text-eyebrow text-bone">
            ← Back to shop
          </Link>
        </div>
      </div>
    </PageShell>
  ),
});

function ProductDetail() {
  const p = Route.useLoaderData();
  const [size, setSize] = useState<string | null>(p.sizes?.[0] ?? null);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const related = PRODUCTS.filter((x) => x.slug !== p.slug).slice(0, 4);

  const add = () => {
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <PageShell>
      <section className="relative min-h-[100svh] px-6 pt-32 md:px-12 md:pt-40">
        <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-12 md:grid-cols-2 md:gap-20">
          {/* Image column — sticky */}
          <div className="relative">
            <div className="sticky top-32 aspect-square overflow-hidden border border-border bg-mist">
              <img src={p.image} alt={p.name} className="h-full w-full object-cover grayscale" />
              <div className="absolute left-4 top-4 flex flex-col gap-2">
                <span className="text-eyebrow bg-ink/60 px-2 py-1 text-bone backdrop-blur-sm">
                  {p.type}
                </span>
                {p.edition && (
                  <span className="text-eyebrow bg-ink/60 px-2 py-1 text-bone backdrop-blur-sm">
                    {p.edition}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Info column */}
          <div className="pb-24 md:py-16">
            <Link to="/shop" className="text-eyebrow text-ash hover:text-bone">
              ← Shop
            </Link>
            <h1 className="mt-6 text-display text-[clamp(3rem,7vw,7rem)] leading-none text-bone">
              {p.name}
            </h1>
            <div className="mt-6 text-display text-3xl text-bone">${p.price.toFixed(2)}</div>
            <p className="mt-8 max-w-md text-lg text-bone/80">{p.description}</p>

            {p.sizes && (
              <div className="mt-10">
                <div className="text-eyebrow text-ash">Size</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {p.sizes.map((s: string) => (
                    <button
                      key={s}
                      onClick={() => setSize(s)}
                      className={`grid h-14 min-w-14 place-items-center border px-4 text-eyebrow transition-all ${
                        size === s
                          ? "border-bone bg-bone text-ink"
                          : "border-border text-bone/70 hover:border-bone"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-10">
              <div className="text-eyebrow text-ash">Quantity</div>
              <div className="mt-3 inline-flex items-center border border-border">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="grid h-12 w-12 place-items-center text-bone hover:bg-mist"
                >
                  −
                </button>
                <span className="w-12 text-center text-bone">{qty}</span>
                <button
                  onClick={() => setQty(qty + 1)}
                  className="grid h-12 w-12 place-items-center text-bone hover:bg-mist"
                >
                  +
                </button>
              </div>
            </div>

            <button
              onClick={add}
              className={`mt-10 flex w-full items-center justify-between border border-bone px-8 py-6 text-eyebrow transition-all ${
                added ? "bg-bone text-ink" : "bg-transparent text-bone hover:bg-bone hover:text-ink"
              }`}
            >
              <span>{added ? "Added to cart" : "Add to cart"}</span>
              <span className="text-display text-xl">${(p.price * qty).toFixed(2)}</span>
            </button>

            {/* Shipping meta */}
            <dl className="mt-12 grid grid-cols-2 gap-6">
              {[
                ["Ships", "Within 3 days"],
                ["Free over", "$100"],
                ["Returns", "30 days"],
                ["From", "West Philly"],
              ].map(([k, v]) => (
                <div key={k} className="border-t border-border pt-3">
                  <dt className="text-eyebrow text-ash">{k}</dt>
                  <dd className="mt-1 text-bone">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* Related */}
      <section className="border-t border-border px-6 py-24 md:px-12">
        <div className="mx-auto max-w-[1600px]">
          <div className="mb-10 flex items-end justify-between">
            <h2 className="text-display text-4xl text-bone md:text-6xl">More Objects</h2>
            <Link to="/shop" className="text-eyebrow text-bone">
              All →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-8">
            {related.map((r) => (
              <Link key={r.slug} to="/shop/$slug" params={{ slug: r.slug }} className="group">
                <div className="relative aspect-square overflow-hidden border border-border">
                  <img
                    src={r.image}
                    alt={r.name}
                    className="h-full w-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0"
                  />
                </div>
                <div className="mt-3 flex items-baseline justify-between gap-2">
                  <span className="text-bone">{r.name}</span>
                  <span className="text-eyebrow text-ash">${r.price}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
