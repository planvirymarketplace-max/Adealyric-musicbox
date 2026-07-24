import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageShell, PageIntro } from "@/components/SiteChrome";
import { RELEASES, type ReleaseType } from "@/lib/catalog";

const TYPES: ("All" | ReleaseType)[] = ["All", "Album", "EP", "Single", "Mixtape"];

export const Route = createFileRoute("/discography/")({
  head: () => ({
    meta: [
      { title: "Discography — Adea Lyric" },
      {
        name: "description",
        content:
          "Explore every release from Adea Lyric — albums, EPs, singles, and mixtapes. A stepped path of progression from West Philly.",
      },
      { property: "og:title", content: "Discography — Adea Lyric" },
      {
        property: "og:description",
        content: "Every album, EP, single and mixtape. A stepped path of progression.",
      },
    ],
  }),
  component: DiscographyPage,
});

function DiscographyPage() {
  const [filter, setFilter] = useState<"All" | ReleaseType>("All");
  const [view, setView] = useState<"path" | "grid">("path");
  const [hover, setHover] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const list = filter === "All" ? RELEASES : RELEASES.filter((r) => r.type === filter);
    return [...list].sort((a, b) => b.year - a.year);
  }, [filter]);

  const counts = useMemo(() => {
    const m = new Map<string, number>();
    RELEASES.forEach((r) => m.set(r.type, (m.get(r.type) ?? 0) + 1));
    m.set("All", RELEASES.length);
    return m;
  }, []);

  const active = filtered.find((r) => r.slug === hover) ?? filtered[0];

  return (
    <PageShell>
      <PageIntro
        eyebrow="Volume — Discography"
        title="The Ledger,"
        italic="year by year."
        sub="Every release, in the order the world got to hear it. Filter by format, or walk the path."
      />

      {/* Ambient hero image driven by hover */}
      <div className="pointer-events-none fixed inset-0 z-0 opacity-30">
        {filtered.map((r) => (
          <img
            key={r.slug}
            src={r.bgImage}
            alt=""
            className={`absolute inset-0 h-full w-full object-cover grayscale transition-opacity duration-700 ${active?.slug === r.slug ? "opacity-100" : "opacity-0"}`}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-ink via-ink/80 to-ink" />
      </div>

      {/* Controls */}
      <section className="relative z-10 border-y border-border bg-ink/70 px-6 backdrop-blur-md md:px-12">
        <div className="mx-auto flex max-w-[1600px] flex-col justify-between gap-6 py-6 md:flex-row md:items-center">
          <div className="flex flex-wrap items-center gap-2">
            {TYPES.map((t) => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={`group flex items-center gap-2 border px-4 py-2 text-eyebrow transition-all ${
                  filter === t
                    ? "border-bone bg-bone text-ink"
                    : "border-border text-bone/70 hover:border-bone hover:text-bone"
                }`}
              >
                {t}
                <span className="opacity-60">{counts.get(t) ?? 0}</span>
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-eyebrow text-ash">View</span>
            <button
              onClick={() => setView("path")}
              className={`border px-4 py-2 text-eyebrow transition-all ${view === "path" ? "border-bone bg-bone text-ink" : "border-border text-bone/70 hover:text-bone"}`}
            >
              Path
            </button>
            <button
              onClick={() => setView("grid")}
              className={`border px-4 py-2 text-eyebrow transition-all ${view === "grid" ? "border-bone bg-bone text-ink" : "border-border text-bone/70 hover:text-bone"}`}
            >
              Grid
            </button>
          </div>
        </div>
      </section>

      {view === "path" ? (
        <section className="relative z-10 px-6 py-20 md:px-12 md:py-32">
          <div className="mx-auto max-w-[1600px]">
            <ul className="divide-y divide-border border-y border-border">
              {filtered.map((r, i) => {
                const isActive = active?.slug === r.slug;
                return (
                  <li key={r.slug} onMouseEnter={() => setHover(r.slug)} className="group relative">
                    <Link
                      to="/discography/$slug"
                      params={{ slug: r.slug }}
                      className="relative flex items-center justify-between gap-8 py-6 md:py-10"
                    >
                      <div className="flex items-baseline gap-6 md:gap-12">
                        <span className="text-eyebrow w-14 text-ash md:w-20">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="text-eyebrow hidden text-ash md:inline-block md:w-32">
                          {r.type}
                        </span>
                        <h3
                          className={`text-display text-[clamp(2.5rem,7vw,7rem)] leading-none transition-all duration-500 ${
                            isActive
                              ? "translate-x-4 text-bone"
                              : "text-bone/60 group-hover:text-bone"
                          }`}
                        >
                          {r.title}
                        </h3>
                      </div>
                      <div className="flex items-center gap-4 md:gap-8">
                        <span className="text-eyebrow text-ash">{r.year}</span>
                        <span className="hidden text-eyebrow text-ash md:inline">{r.runtime}</span>
                        <span
                          className={`grid h-12 w-12 place-items-center border border-border transition-all duration-500 ${
                            isActive ? "rotate-45 border-bone bg-bone text-ink" : "text-bone"
                          }`}
                        >
                          <ArrowIcon />
                        </span>
                      </div>

                      {/* Floating cover preview on hover — desktop only */}
                      <div
                        className={`pointer-events-none absolute right-[15%] top-1/2 hidden aspect-[3/4] w-56 -translate-y-1/2 overflow-hidden border border-border shadow-2xl transition-all duration-500 md:block ${
                          isActive ? "opacity-100 scale-100" : "opacity-0 scale-90"
                        }`}
                      >
                        <img
                          src={r.cover}
                          alt=""
                          className="h-full w-full object-cover grayscale"
                        />
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>

            {filtered.length === 0 && (
              <div className="py-24 text-center text-ash">No releases in this format yet.</div>
            )}
          </div>
        </section>
      ) : (
        <section className="relative z-10 px-6 py-20 md:px-12 md:py-32">
          <div className="mx-auto grid max-w-[1600px] grid-cols-2 gap-4 md:grid-cols-3 md:gap-8 lg:grid-cols-4">
            {filtered.map((r) => (
              <Link
                key={r.slug}
                to="/discography/$slug"
                params={{ slug: r.slug }}
                className="group relative block aspect-square overflow-hidden border border-border"
              >
                <img
                  src={r.cover}
                  alt={r.title}
                  className="absolute inset-0 h-full w-full object-cover grayscale transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />
                <div className="absolute inset-0 flex flex-col justify-between p-5">
                  <div className="flex items-center justify-between">
                    <span className="text-eyebrow text-bone">{r.type}</span>
                    <span className="text-eyebrow text-bone">{r.year}</span>
                  </div>
                  <div>
                    <h3 className="text-display text-2xl text-bone md:text-3xl">{r.title}</h3>
                    <div className="mt-2 text-eyebrow text-bone/60">{r.runtime}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </PageShell>
  );
}

function ArrowIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

// Detail route uses shared notFound helper if slug missing
void notFound;
