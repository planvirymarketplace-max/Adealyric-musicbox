"use client";

import { useMemo, useState } from "react";
import { PageShell, PageIntro } from "./SiteChrome";
import { useAppStore } from "@/lib/store";
import { RELEASES, TOUR, type ReleaseType } from "@/lib/catalog";

const TYPES: ("All" | ReleaseType)[] = ["All", "Album", "EP", "Single", "Mixtape"];

function ArrowIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function MusicPage() {
  const all = RELEASES.flatMap((r) => r.tracks.map((t) => ({ ...t, release: r })));
  const [current, setCurrent] = useState(0);
  const [playing, setPlaying] = useState(false);
  const { setActiveTab, setDetailSlug } = useAppStore();
  const t = all[current];

  return (
    <PageShell>
      <PageIntro eyebrow="Music" title="Continuous," italic="uninterrupted." sub="The full catalog, in a single player." />
      <section className="px-6 pb-24 md:px-12">
        <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-16 md:grid-cols-12">
          <div className="md:col-span-5">
            <div className="sticky top-32">
              <div className="relative aspect-square overflow-hidden border border-border">
                <img src={t.release.cover} alt={t.release.title} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent" />
                <button onClick={() => setPlaying((v) => !v)} className="absolute inset-0 grid place-items-center cursor-pointer">
                  <span className="grid h-24 w-24 place-items-center border border-bone/60 bg-ink/40 text-bone backdrop-blur-sm transition-all hover:scale-110 hover:bg-bone hover:text-ink">
                    {playing ? (
                      <svg viewBox="0 0 24 24" className="h-8 w-8" fill="currentColor" aria-hidden>
                        <path d="M6 5h4v14H6zM14 5h4v14h-4z" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" className="h-8 w-8" fill="currentColor" aria-hidden>
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    )}
                  </span>
                </button>
              </div>
              <div className="mt-6 text-eyebrow text-ash">{t.release.type} · {t.release.year}</div>
              <h2 className="mt-2 text-display text-4xl text-bone md:text-5xl">{t.title}</h2>
              <button
                onClick={() => { setActiveTab("discography"); setDetailSlug(t.release.slug, "release"); }}
                className="mt-2 inline-block text-bone/70 hover:text-bone cursor-pointer"
              >
                from <span className="italic">{t.release.title}</span>
              </button>
              <div className="mt-8 flex items-center gap-4 text-eyebrow text-ash">
                <span>0:00</span>
                <div className="relative h-px flex-1 bg-border">
                  <div className={`absolute inset-y-0 left-0 bg-bone transition-all duration-1000 ${playing ? "w-1/3" : "w-0"}`} />
                </div>
                <span>{t.length}</span>
              </div>
              <div className="mt-6 flex gap-2">
                <button onClick={() => setCurrent((c) => Math.max(0, c - 1))} className="grid h-12 w-12 place-items-center border border-border text-bone hover:border-bone cursor-pointer">‹</button>
                <button onClick={() => setPlaying((v) => !v)} className="grid h-12 w-12 place-items-center border border-bone bg-bone text-ink cursor-pointer">{playing ? "❚❚" : "▶"}</button>
                <button onClick={() => setCurrent((c) => Math.min(all.length - 1, c + 1))} className="grid h-12 w-12 place-items-center border border-border text-bone hover:border-bone cursor-pointer">›</button>
              </div>
            </div>
          </div>
          <div className="md:col-span-7">
            <div className="text-eyebrow mb-4 text-ash">Queue · {all.length} tracks</div>
            <ul>
              {all.map((tr, i) => {
                const active = i === current;
                return (
                  <li key={`${tr.release.slug}-${tr.n}`}>
                    <button
                      onClick={() => { setCurrent(i); setPlaying(true); }}
                      className={`group flex w-full items-center justify-between gap-6 border-t border-border py-4 text-left last:border-b transition-colors ${active ? "text-bone" : "text-bone/60 hover:text-bone"} cursor-pointer`}
                    >
                      <div className="flex items-center gap-6">
                        <span className="text-eyebrow w-6 text-ash">{active && playing ? "♪" : String(i + 1).padStart(2, "0")}</span>
                        <div>
                          <div className="text-display text-xl md:text-2xl">{tr.title}</div>
                          <div className="text-eyebrow mt-1 text-ash">{tr.release.title}</div>
                        </div>
                      </div>
                      <span className="text-eyebrow text-ash">{tr.length}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

export function DiscographyPage() {
  const [filter, setFilter] = useState<"All" | ReleaseType>("All");
  const [view, setView] = useState<"path" | "grid">("path");
  const [hover, setHover] = useState<string | null>(null);
  const { setDetailSlug } = useAppStore();

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
      <PageIntro eyebrow="Volume — Discography" title="The Ledger," italic="year by year." sub="Every release, in the order the world got to hear it." />
      <div className="pointer-events-none fixed inset-0 z-0 opacity-30">
        {filtered.map((r) => (
          <img key={r.slug} src={r.bgImage} alt="" className={`absolute inset-0 h-full w-full object-cover grayscale transition-opacity duration-700 ${active?.slug === r.slug ? "opacity-100" : "opacity-0"}`} />
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-ink via-ink/80 to-ink" />
      </div>
      <section className="relative z-10 border-y border-border bg-ink/70 px-6 backdrop-blur-md md:px-12">
        <div className="mx-auto flex max-w-[1600px] flex-col justify-between gap-6 py-6 md:flex-row md:items-center">
          <div className="flex flex-wrap items-center gap-2">
            {TYPES.map((t) => (
              <button key={t} onClick={() => setFilter(t)} className={`group flex items-center gap-2 border px-4 py-2 text-eyebrow transition-all cursor-pointer ${filter === t ? "border-bone bg-bone text-ink" : "border-border text-bone/70 hover:border-bone hover:text-bone"}`}>
                {t}
                <span className="opacity-60">{counts.get(t) ?? 0}</span>
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-eyebrow text-ash">View</span>
            <button onClick={() => setView("path")} className={`border px-4 py-2 text-eyebrow transition-all cursor-pointer ${view === "path" ? "border-bone bg-bone text-ink" : "border-border text-bone/70 hover:text-bone"}`}>Path</button>
            <button onClick={() => setView("grid")} className={`border px-4 py-2 text-eyebrow transition-all cursor-pointer ${view === "grid" ? "border-bone bg-bone text-ink" : "border-border text-bone/70 hover:text-bone"}`}>Grid</button>
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
                    <button
                      onClick={() => setDetailSlug(r.slug, "release")}
                      className="relative flex w-full items-center justify-between gap-8 py-6 md:py-10 text-left cursor-pointer"
                    >
                      <div className="flex items-baseline gap-6 md:gap-12">
                        <span className="text-eyebrow w-14 text-ash md:w-20">{String(i + 1).padStart(2, "0")}</span>
                        <span className="text-eyebrow hidden text-ash md:inline-block md:w-32">{r.type}</span>
                        <h3 className={`text-display text-[clamp(2.5rem,7vw,7rem)] leading-none transition-all duration-500 ${isActive ? "translate-x-4 text-bone" : "text-bone/60 group-hover:text-bone"}`}>{r.title}</h3>
                      </div>
                      <div className="flex items-center gap-4 md:gap-8">
                        <span className="text-eyebrow text-ash">{r.year}</span>
                        <span className="hidden text-eyebrow text-ash md:inline">{r.runtime}</span>
                        <span className={`grid h-12 w-12 place-items-center border border-border transition-all duration-500 ${isActive ? "rotate-45 border-bone bg-bone text-ink" : "text-bone"}`}>
                          <ArrowIcon />
                        </span>
                      </div>
                      <div className={`pointer-events-none absolute right-[15%] top-1/2 hidden aspect-[3/4] w-56 -translate-y-1/2 overflow-hidden border border-border shadow-2xl transition-all duration-500 md:block ${isActive ? "opacity-100 scale-100" : "opacity-0 scale-90"}`}>
                        <img src={r.cover} alt="" className="h-full w-full object-cover grayscale" />
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
            {filtered.length === 0 && <div className="py-24 text-center text-ash">No releases in this format yet.</div>}
          </div>
        </section>
      ) : (
        <section className="relative z-10 px-6 py-20 md:px-12 md:py-32">
          <div className="mx-auto grid max-w-[1600px] grid-cols-2 gap-4 md:grid-cols-3 md:gap-8 lg:grid-cols-4">
            {filtered.map((r) => (
              <button key={r.slug} onClick={() => setDetailSlug(r.slug, "release")} className="group relative block aspect-square overflow-hidden border border-border cursor-pointer">
                <img src={r.cover} alt={r.title} className="absolute inset-0 h-full w-full object-cover grayscale transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0" />
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
              </button>
            ))}
          </div>
        </section>
      )}
    </PageShell>
  );
}

export function ReleaseDetailPage() {
  const { detailSlug, setDetailSlug } = useAppStore();
  const r = RELEASES.find((x) => x.slug === detailSlug);
  if (!r) return null;
  const idx = RELEASES.findIndex((x) => x.slug === r.slug);
  const prev = RELEASES[idx - 1];
  const next = RELEASES[idx + 1];

  return (
    <PageShell>
      <section className="relative min-h-[90svh] overflow-hidden">
        <img src={r.bgImage} alt="" className="absolute inset-0 h-full w-full object-cover opacity-40 grayscale" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/60 via-ink/40 to-ink" />
        <div className="relative z-10 mx-auto grid max-w-[1600px] grid-cols-1 items-end gap-16 px-6 pb-16 pt-40 md:grid-cols-12 md:px-12 md:pb-24 md:pt-56">
          <div className="md:col-span-5">
            <div className="relative aspect-square overflow-hidden border border-border shadow-2xl">
              <img src={r.cover} alt={r.title} className="h-full w-full object-cover" />
            </div>
          </div>
          <div className="md:col-span-7">
            <button onClick={() => setDetailSlug(null, null)} className="text-eyebrow text-ash hover:text-bone cursor-pointer">
              ← Discography
            </button>
            <div className="mt-6 flex items-center gap-6 text-eyebrow text-ash">
              <span>{r.type}</span><span>·</span><span>{r.year}</span><span>·</span><span>{r.runtime}</span>
            </div>
            <h1 className="mt-6 text-display text-[clamp(3.5rem,12vw,14rem)] leading-none text-bone animate-reveal">{r.title}</h1>
            <p className="mt-8 max-w-xl text-xl text-bone/80">{r.story}</p>
            <div className="mt-10 flex flex-wrap gap-3">
              <button className="inline-flex items-center gap-3 border border-bone bg-bone px-8 py-4 text-eyebrow text-ink transition-all hover:bg-transparent hover:text-bone cursor-pointer">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden><path d="M8 5v14l11-7z" /></svg>
                Play
              </button>
              <button className="inline-flex items-center gap-3 border border-border px-8 py-4 text-eyebrow text-bone transition-all hover:border-bone cursor-pointer">Spotify ↗</button>
              <button className="inline-flex items-center gap-3 border border-border px-8 py-4 text-eyebrow text-bone transition-all hover:border-bone cursor-pointer">Apple Music ↗</button>
            </div>
          </div>
        </div>
      </section>
      <section className="relative bg-ink px-6 py-24 md:px-12 md:py-32">
        <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-16 md:grid-cols-12">
          <div className="md:col-span-4">
            <div className="text-eyebrow text-ash">Tracklist</div>
            <h2 className="mt-6 text-display text-6xl text-bone">Every bar,<br /><span className="italic text-ash">in order.</span></h2>
            <p className="mt-6 text-bone/60">{r.credits}</p>
          </div>
          <ul className="md:col-span-8">
            {r.tracks.map((t) => (
              <li key={t.n} className="group flex items-center justify-between gap-8 border-t border-border py-6 last:border-b">
                <div className="flex items-center gap-6 md:gap-10">
                  <span className="text-eyebrow w-8 text-ash">{String(t.n).padStart(2, "0")}</span>
                  <button className="grid h-10 w-10 place-items-center border border-border text-bone opacity-0 transition-all group-hover:opacity-100 group-hover:border-bone cursor-pointer">
                    <svg viewBox="0 0 24 24" className="h-3 w-3" fill="currentColor" aria-hidden><path d="M8 5v14l11-7z" /></svg>
                  </button>
                  <div>
                    <div className="text-display text-2xl text-bone md:text-3xl">{t.title}</div>
                    {t.feat && <div className="text-eyebrow mt-1 text-ash">feat. {t.feat}</div>}
                  </div>
                </div>
                <span className="text-eyebrow text-ash">{t.length}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section className="grid grid-cols-1 border-t border-border md:grid-cols-2">
        {prev ? (
          <button onClick={() => setDetailSlug(prev.slug, "release")} className="group relative flex flex-col justify-between gap-6 border-b border-border p-8 transition-colors hover:bg-mist md:border-b-0 md:border-r md:p-12 cursor-pointer text-left">
            <div className="text-eyebrow text-ash">← Previous</div>
            <div>
              <div className="text-eyebrow text-ash">{prev.year} · {prev.type}</div>
              <div className="mt-3 text-display text-4xl text-bone md:text-6xl">{prev.title}</div>
            </div>
          </button>
        ) : <div className="hidden md:block" />}
        {next ? (
          <button onClick={() => setDetailSlug(next.slug, "release")} className="group relative flex flex-col items-end justify-between gap-6 p-8 transition-colors hover:bg-mist md:p-12 cursor-pointer text-right">
            <div className="text-eyebrow text-ash">Next →</div>
            <div className="text-right">
              <div className="text-eyebrow text-ash">{next.year} · {next.type}</div>
              <div className="mt-3 text-display text-4xl text-bone md:text-6xl">{next.title}</div>
            </div>
          </button>
        ) : <div className="hidden md:block" />}
      </section>
    </PageShell>
  );
}

export function TourPage() {
  return (
    <PageShell>
      <PageIntro eyebrow="On the road" title="Tour," italic="live." sub="Direct ticket purchase. Calendar links. Automated map at every stop." />
      <section className="px-6 pb-24 md:px-12">
        <div className="mx-auto max-w-[1600px]">
          <ul className="divide-y divide-border border-y border-border">
            {TOUR.map((d: { date: string; city: string; venue: string; status: string }, i: number) => {
              const sold = d.status === "Sold Out";
              return (
                <li key={i} className="group grid grid-cols-1 items-center gap-4 py-8 md:grid-cols-12 md:py-12">
                  <div className="text-display text-4xl text-bone md:col-span-2 md:text-6xl">{d.date}</div>
                  <div className="md:col-span-4">
                    <div className="text-display text-2xl text-bone md:text-4xl">{d.city}</div>
                    <div className="text-eyebrow mt-1 text-ash">{d.venue}</div>
                  </div>
                  <div className="md:col-span-3">
                    <span className={`text-eyebrow ${sold ? "text-ash" : d.status === "Low" ? "text-bone" : "text-bone/70"}`}>{d.status}</span>
                  </div>
                  <div className="md:col-span-3 md:text-right">
                    <button disabled={sold} className={`inline-flex items-center gap-3 border px-6 py-3 text-eyebrow transition-all cursor-pointer ${sold ? "cursor-not-allowed border-border text-ash" : "border-bone text-bone hover:bg-bone hover:text-ink"}`}>
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
