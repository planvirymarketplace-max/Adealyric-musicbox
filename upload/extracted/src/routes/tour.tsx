import { createFileRoute } from "@tanstack/react-router";
import { PageShell, PageIntro } from "@/components/SiteChrome";
import { TOUR } from "@/lib/catalog";

export const Route = createFileRoute("/tour")({
  head: () => ({
    meta: [
      { title: "Tour — Adea Lyric" },
      {
        name: "description",
        content: "Every date, every venue. Get tickets for the current Adea Lyric tour.",
      },
      { property: "og:title", content: "Tour — Adea Lyric" },
      { property: "og:description", content: "Every date. Every venue. Direct tickets." },
    ],
  }),
  component: TourPage,
});

function TourPage() {
  return (
    <PageShell>
      <PageIntro
        eyebrow="On the road"
        title="Tour,"
        italic="live."
        sub="Direct ticket purchase. Calendar links. Automated map at every stop."
      />

      <section className="px-6 pb-24 md:px-12">
        <div className="mx-auto max-w-[1600px]">
          <ul className="divide-y divide-border border-y border-border">
            {TOUR.map((d, i) => {
              const sold = d.status === "Sold Out";
              return (
                <li
                  key={i}
                  className="group grid grid-cols-1 items-center gap-4 py-8 md:grid-cols-12 md:py-12"
                >
                  <div className="text-display text-4xl text-bone md:col-span-2 md:text-6xl">
                    {d.date}
                  </div>
                  <div className="md:col-span-4">
                    <div className="text-display text-2xl text-bone md:text-4xl">{d.city}</div>
                    <div className="text-eyebrow mt-1 text-ash">{d.venue}</div>
                  </div>
                  <div className="md:col-span-3">
                    <span
                      className={`text-eyebrow ${sold ? "text-ash" : d.status === "Low" ? "text-bone" : "text-bone/70"}`}
                    >
                      {d.status}
                    </span>
                  </div>
                  <div className="md:col-span-3 md:text-right">
                    <button
                      disabled={sold}
                      className={`inline-flex items-center gap-3 border px-6 py-3 text-eyebrow transition-all ${
                        sold
                          ? "cursor-not-allowed border-border text-ash"
                          : "border-bone text-bone hover:bg-bone hover:text-ink"
                      }`}
                    >
                      {sold ? "Sold Out" : "Tickets →"}
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </PageShell>
  );
}
