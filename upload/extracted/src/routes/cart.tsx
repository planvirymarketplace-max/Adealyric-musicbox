import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell, PageIntro } from "@/components/SiteChrome";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Cart — Adea Lyric" },
      { name: "description", content: "Your cart." },
      { property: "og:title", content: "Cart — Adea Lyric" },
      { property: "og:description", content: "Your cart." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  return (
    <PageShell>
      <PageIntro eyebrow="Cart" title="Nothing here" italic="yet." />
      <section className="px-6 pb-32 md:px-12">
        <div className="mx-auto max-w-[1600px]">
          <div className="border border-border p-12 text-center">
            <p className="text-bone/70">
              Your cart is empty. Add something from the shop to get started.
            </p>
            <Link
              to="/shop"
              className="mt-8 inline-flex items-center gap-4 border border-bone px-8 py-4 text-eyebrow text-bone transition-all hover:bg-bone hover:text-ink"
            >
              Browse Shop →
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
