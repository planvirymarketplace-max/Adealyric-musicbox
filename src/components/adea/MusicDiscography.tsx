"use client";

import { useMemo, useState } from "react";
import { SiteHeader, SiteFooter, PageIntro } from "./SiteChrome";
import { useAppStore } from "@/lib/store";
import { RELEASES, TOUR, type ReleaseType } from "@/lib/catalog";

const TYPES: ("All" | ReleaseType)[] = ["All", "Album", "EP", "Single", "Mixtape"];
const DISCO_HERO = "/discography-hero.jpg";

function ArrowIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

/* =====================================================================
   COMBINED DISCOGRAPHY PAGE  (Discography releases + Music player)
   ===================================================================== */

export function DiscographyPage() {
  const [filter, setFilter] = useState<"All" | ReleaseType>("All");
  const [view, setView] = useState<"path" | "grid">("path");
  const [hover, setHover] = useState<string | null>(null);
  const { setDetailSlug, setActiveTab } = useAppStore();

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

  /* ---- music player state ---- */
  const allTracks = useMemo(() => RELEASES.flatMap((r) => r.tracks.map((t) => ({ ...t, release: r }))), []);
  const [current, setCurrent] = useState(0);
  const [playing, setPlaying] = useState(false);
  const track = allTracks[current];

  return (
    <>
      {/* ===== SECTION 1 — Hero with background image ===== */}
      <section className="relative flex min-h-[60svh] items-end overflow-hidden md:min-h-[70svh]">
        <img
          src={DISCO_HERO}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-40 grayscale"
          aria-hidden
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-ink/30" />
        <div className="relative z-10 mx-auto w-full max-w-[1600px] px-6 pb-16 pt-40 md:px-12 md:pb-24 md:pt-56">
          <div className="text-eyebrow text-ash">Volume — Discography</div>
          <h1 className="mt-6 text-display text-[clamp(3.5rem,11vw,12rem)] leading-none text-bone">
            The Ledger,
            <span className="block italic text-ash">year by year.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-bone/70">
            Every release, in the order the world got to hear it.
          </p>
        </div>
      </section>

      {/* ===== SECTION 1b — Filters + Release List ===== */}
      <section className="relative z-10 border-b border-black/10 bg-white px-6 md:px-12">
        <div className="mx-auto flex max-w-[1600px] flex-col justify-between gap-6 py-6 md:flex-row md:items-center">
          <div className="flex flex-wrap items-center gap-2">
            {TYPES.map((t) => (
              <button key={t} onClick={() => setFilter(t)} className={`group flex items-center gap-2 border px-4 py-2 text-eyebrow transition-all cursor-pointer ${filter === t ? "border-black bg-black text-white" : "border-black/15 text-black/50 hover:border-black hover:text-black"}`}>
                {t}
                <span className="opacity-60">{counts.get(t) ?? 0}</span>
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-eyebrow text-black/30">View</span>
            <button onClick={() => setView("path")} className={`border px-4 py-2 text-eyebrow transition-all cursor-pointer ${view === "path" ? "border-black bg-black text-white" : "border-black/15 text-black/50 hover:border-black hover:text-black"}`}>Path</button>
            <button onClick={() => setView("grid")} className={`border px-4 py-2 text-eyebrow transition-all cursor-pointer ${view === "grid" ? "border-black bg-black text-white" : "border-black/15 text-black/50 hover:border-black hover:text-black"}`}>Grid</button>
          </div>
        </div>
      </section>

      {view === "path" ? (
        <section className="relative z-10 bg-white px-6 py-20 md:px-12 md:py-32">
          <div className="mx-auto max-w-[1600px]">
            <ul className="divide-y divide-black/10 border-y border-black/10">
              {filtered.map((r, i) => {
                const isActive = active?.slug === r.slug;
                return (
                  <li key={r.slug} onMouseEnter={() => setHover(r.slug)} className="group relative">
                    <button
                      onClick={() => setDetailSlug(r.slug, "release")}
                      className="relative flex w-full items-center justify-between gap-8 py-6 md:py-10 text-left cursor-pointer"
                    >
                      <div className="flex items-baseline gap-6 md:gap-12">
                        <span className="text-eyebrow w-14 text-black/30 md:w-20">{String(i + 1).padStart(2, "0")}</span>
                        <span className="text-eyebrow hidden text-black/30 md:inline-block md:w-32">{r.type}</span>
                        <h3 className={`text-display text-[clamp(2.5rem,7vw,7rem)] leading-none transition-all duration-500 ${isActive ? "translate-x-4 text-black" : "text-black/40 group-hover:text-black"}`}>{r.title}</h3>
                      </div>
                      <div className="flex items-center gap-4 md:gap-8">
                        <span className="text-eyebrow text-black/30">{r.year}</span>
                        <span className="hidden text-eyebrow text-black/30 md:inline">{r.runtime}</span>
                        <button
                          onClick={(e) => { e.stopPropagation(); setActiveTab("shop"); }}
                          className="hidden md:inline-flex items-center gap-2 text-eyebrow text-black/30 hover:text-black transition-colors cursor-pointer"
                        >Buy ↗</button>
                        <span className={`grid h-12 w-12 place-items-center border border-black/10 transition-all duration-500 ${isActive ? "rotate-45 border-black bg-black text-white" : "text-black/40"}`}>
                          <ArrowIcon />
                        </span>
                      </div>
                      <div className={`pointer-events-none absolute right-[15%] top-1/2 hidden aspect-[3/4] w-56 -translate-y-1/2 overflow-hidden border border-black/10 shadow-2xl transition-all duration-500 md:block ${isActive ? "opacity-100 scale-100" : "opacity-0 scale-90"}`}>
                        <img src={r.cover} alt="" className="h-full w-full object-cover" />
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
            {filtered.length === 0 && <div className="py-24 text-center text-black/30">No releases in this format yet.</div>}
          </div>
        </section>
      ) : (
        <section className="relative z-10 bg-white px-6 py-20 md:px-12 md:py-32">
          <div className="mx-auto grid max-w-[1600px] grid-cols-2 gap-4 md:grid-cols-3 md:gap-8 lg:grid-cols-4">
            {filtered.map((r) => (
              <button key={r.slug} onClick={() => setDetailSlug(r.slug, "release")} className="group relative block aspect-square overflow-hidden border border-black/10 cursor-pointer">
                <img src={r.cover} alt={r.title} className="absolute inset-0 h-full w-full object-cover transition-all duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                <div className="absolute inset-0 flex flex-col justify-between p-5">
                  <div className="flex items-center justify-between">
                    <span className="text-eyebrow text-white">{r.type}</span>
                    <span className="text-eyebrow text-white">{r.year}</span>
                  </div>
                  <div>
                    <h3 className="text-display text-2xl text-white md:text-3xl">{r.title}</h3>
                    <div className="mt-2 text-eyebrow text-white/60">{r.runtime}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* ===== SECTION 2 — Music Player ===== */}
      <section className="border-t border-black/10 bg-white px-6 py-20 md:px-12 md:py-32">
        <div className="mx-auto max-w-[1600px]">
          <div className="text-eyebrow mb-4 text-black/30">02 — Player</div>
          <h2 className="text-display text-4xl text-black md:text-6xl">
            Continuous, <span className="italic text-black/40">uninterrupted.</span>
          </h2>
          <p className="mt-4 max-w-lg text-base text-black/50">The full catalog, in a single player. Every track from every release.</p>
        </div>
      </section>

      <section className="bg-white px-6 pb-32 md:px-12">
        <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-16 md:grid-cols-12">
          <div className="md:col-span-5">
            <div className="sticky top-32">
              <div className="relative aspect-square overflow-hidden border border-black/10">
                <img src={track.release.cover} alt={track.release.title} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <button onClick={() => setPlaying((v) => !v)} className="absolute inset-0 grid place-items-center cursor-pointer">
                  <span className="grid h-24 w-24 place-items-center border border-white/60 bg-black/40 text-white backdrop-blur-sm transition-all hover:scale-110 hover:bg-white hover:text-black">
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
              <div className="mt-6 text-eyebrow text-black/30">{track.release.type} · {track.release.year}</div>
              <h3 className="mt-2 text-display text-4xl text-black md:text-5xl">{track.title}</h3>
              <button
                onClick={() => { setDetailSlug(track.release.slug, "release"); }}
                className="mt-2 inline-block text-black/50 hover:text-black cursor-pointer"
              >
                from <span className="italic">{track.release.title}</span>
              </button>
              <div className="mt-8 flex items-center gap-4 text-eyebrow text-black/30">
                <span>0:00</span>
                <div className="relative h-px flex-1 bg-black/10">
                  <div className={`absolute inset-y-0 left-0 bg-black transition-all duration-1000 ${playing ? "w-1/3" : "w-0"}`} />
                </div>
                <span>{track.length}</span>
              </div>
              <div className="mt-6 flex gap-2">
                <button onClick={() => setCurrent((c) => Math.max(0, c - 1))} className="grid h-12 w-12 place-items-center border border-black/10 text-black/50 hover:border-black cursor-pointer">‹</button>
                <button onClick={() => setPlaying((v) => !v)} className="grid h-12 w-12 place-items-center border border-black bg-black text-white cursor-pointer">{playing ? "❚❚" : "▶"}</button>
                <button onClick={() => setCurrent((c) => Math.min(allTracks.length - 1, c + 1))} className="grid h-12 w-12 place-items-center border border-black/10 text-black/50 hover:border-black cursor-pointer">›</button>
              </div>
            </div>
          </div>
          <div className="md:col-span-7">
            <div className="text-eyebrow mb-4 text-black/30">Queue · {allTracks.length} tracks</div>
            <ul>
              {allTracks.map((tr, i) => {
                const isActive = i === current;
                return (
                  <li key={`${tr.release.slug}-${tr.n}`}>
                    <button
                      onClick={() => { setCurrent(i); setPlaying(true); }}
                      className={`group flex w-full items-center justify-between gap-6 border-t border-black/10 py-4 text-left last:border-b transition-colors ${isActive ? "text-black" : "text-black/40 hover:text-black"} cursor-pointer`}
                    >
                      <div className="flex items-center gap-6">
                        <span className="text-eyebrow w-6 text-black/30">{isActive && playing ? "♪" : String(i + 1).padStart(2, "0")}</span>
                        <div>
                          <div className="text-display text-xl md:text-2xl">{tr.title}</div>
                          <div className="text-eyebrow mt-1 text-black/30">{tr.release.title}</div>
                        </div>
                      </div>
                      <span className="text-eyebrow text-black/30">{tr.length}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}

/* =====================================================================
   RELEASE DETAIL PAGE  (keeps its own PageShell)
   ===================================================================== */

export function ReleaseDetailPage() {
  const { detailSlug, setDetailSlug, setActiveTab } = useAppStore();
  const r = RELEASES.find((x) => x.slug === detailSlug);
  if (!r) return null;
  const idx = RELEASES.findIndex((x) => x.slug === r.slug);
  const prev = RELEASES[idx - 1];
  const next = RELEASES[idx + 1];

  const goToShop = () => { setDetailSlug(null, null); setActiveTab("shop"); };

  return (
    <>
      <SiteHeader />
      {/* DARK HERO */}
      <section className="relative min-h-[80svh] overflow-hidden bg-ink text-bone">
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
              <button onClick={goToShop} className="inline-flex items-center gap-3 border border-bone bg-bone px-8 py-4 text-eyebrow text-ink transition-all hover:bg-transparent hover:text-bone cursor-pointer">
                Buy Now
              </button>
              <button className="inline-flex items-center gap-3 border border-border px-8 py-4 text-eyebrow text-bone transition-all hover:border-bone cursor-pointer">Spotify ↗</button>
              <button className="inline-flex items-center gap-3 border border-border px-8 py-4 text-eyebrow text-bone transition-all hover:border-bone cursor-pointer">Apple Music ↗</button>
            </div>
          </div>
        </div>
      </section>
      {/* WHITE CONTENT — Tracklist */}
      <section className="relative bg-white text-black px-6 py-24 md:px-12 md:py-32">
        <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-16 md:grid-cols-12">
          <div className="md:col-span-4">
            <div className="text-eyebrow text-black/30">Tracklist</div>
            <h2 className="mt-6 text-display text-6xl text-black">Every bar,<br /><span className="italic text-black/40">in order.</span></h2>
            <p className="mt-6 text-black/50">{r.credits}</p>
          </div>
          <ul className="md:col-span-8">
            {r.tracks.map((t) => (
              <li key={t.n} className="group flex items-center justify-between gap-8 border-t border-black/10 py-6 last:border-b">
                <div className="flex items-center gap-6 md:gap-10">
                  <span className="text-eyebrow w-8 text-black/30">{String(t.n).padStart(2, "0")}</span>
                  <button className="grid h-10 w-10 place-items-center border border-black/10 text-black/30 opacity-0 transition-all group-hover:opacity-100 group-hover:border-black cursor-pointer">
                    <svg viewBox="0 0 24 24" className="h-3 w-3" fill="currentColor" aria-hidden><path d="M8 5v14l11-7z" /></svg>
                  </button>
                  <div>
                    <div className="text-display text-2xl text-black md:text-3xl">{t.title}</div>
                    {t.feat && <div className="text-eyebrow mt-1 text-black/30">feat. {t.feat}</div>}
                  </div>
                </div>
                <span className="text-eyebrow text-black/30">{t.length}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
      {/* WHITE CONTENT — Prev/Next */}
      <section className="grid grid-cols-1 border-t border-black/10 bg-white md:grid-cols-2">
        {prev ? (
          <button onClick={() => setDetailSlug(prev.slug, "release")} className="group relative flex flex-col justify-between gap-6 border-b border-black/10 p-8 transition-colors hover:bg-black/[0.02] md:border-b-0 md:border-r md:p-12 cursor-pointer text-left">
            <div className="text-eyebrow text-black/30">← Previous</div>
            <div>
              <div className="text-eyebrow text-black/30">{prev.year} · {prev.type}</div>
              <div className="mt-3 text-display text-4xl text-black md:text-6xl">{prev.title}</div>
            </div>
          </button>
        ) : <div className="hidden md:block" />}
        {next ? (
          <button onClick={() => setDetailSlug(next.slug, "release")} className="group relative flex flex-col items-end justify-between gap-6 p-8 transition-colors hover:bg-black/[0.02] md:p-12 cursor-pointer text-right">
            <div className="text-eyebrow text-black/30">Next →</div>
            <div className="text-right">
              <div className="text-eyebrow text-black/30">{next.year} · {next.type}</div>
              <div className="mt-3 text-display text-4xl text-black md:text-6xl">{next.title}</div>
            </div>
          </button>
        ) : <div className="hidden md:block" />}
      </section>
      <SiteFooter />
    </>
  );
}

/* =====================================================================
   TOUR PAGE
   =====================================================================*/

export function TourPage() {
  const { setActiveTab } = useAppStore();
  return (
    <>
      <PageIntro eyebrow="On the road" title="Tour," italic="live." sub="Direct ticket purchase. Calendar links. Automated map at every stop." dark />
      <section className="bg-white px-6 pb-12 md:px-12">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between">
          <p className="text-[11px] text-black">{TOUR.length} dates</p>
        </div>
      </section>
      <section className="bg-white px-6 pb-24 md:px-12">
        <div className="mx-auto max-w-[1600px]">
          <ul className="divide-y divide-black/10 border-y border-black/10">
            {TOUR.map((d: { date: string; city: string; venue: string; status: string }, i: number) => {
              const sold = d.status === "Sold Out";
              return (
                <li key={i} className="group grid grid-cols-1 items-center gap-4 py-8 md:grid-cols-12 md:py-12">
                  <div className="text-display text-4xl text-black md:col-span-2 md:text-6xl">{d.date}</div>
                  <div className="md:col-span-4">
                    <div className="text-display text-2xl text-black md:text-4xl">{d.city}</div>
                    <div className="text-eyebrow mt-1 text-black/30">{d.venue}</div>
                  </div>
                  <div className="md:col-span-3">
                    <span className={`text-eyebrow ${sold ? "text-black/20" : d.status === "Low" ? "text-black" : "text-black/50"}`}>{d.status}</span>
                  </div>
                  <div className="md:col-span-3 md:text-right">
                    <button disabled={sold} className={`inline-flex items-center gap-3 border px-6 py-3 text-eyebrow transition-all cursor-pointer ${sold ? "cursor-not-allowed border-black/10 text-black/20" : "border-black text-black hover:bg-black hover:text-white"}`}>
                      {sold ? "Sold Out" : "Tickets →"}
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* Recently Played */}
      <section className="border-t border-black/10 bg-white px-6 py-20 md:px-12 md:py-32">
        <div className="mx-auto max-w-[1600px]">
          <div className="text-eyebrow mb-4 text-black/30">Recently Played</div>
          <h2 className="text-display text-4xl text-black md:text-6xl">
            What you&apos;ve been <span className="italic text-black/40">listening to.</span>
          </h2>
          <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {RELEASES.slice(0, 4).map((r) => (
              <div key={r.slug} className="group cursor-pointer">
                <div className="relative aspect-square overflow-hidden border border-black/10">
                  <img src={r.cover} alt={r.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
                <div className="mt-3">
                  <h3 className="text-sm font-semibold text-black">{r.title}</h3>
                  <p className="text-[11px] text-black/30 uppercase tracking-wider">{r.year} · {r.type}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Book Adea Banner — above footer */}
      <section className="relative bg-ink px-6 py-16 md:px-12 md:py-20">
        <div className="mx-auto flex max-w-[1600px] flex-col items-center justify-between gap-6 md:flex-row">
          <div>
            <h3 className="text-display text-3xl text-bone md:text-5xl">Book Adea</h3>
            <p className="mt-2 text-ash">Vocal coaching, live sessions, and private events.</p>
          </div>
          <button onClick={() => setActiveTab("booking")} className="inline-flex items-center gap-3 border border-bone px-8 py-4 text-eyebrow text-bone transition-all hover:bg-bone hover:text-ink cursor-pointer">
            Book Now →
          </button>
        </div>
      </section>
    </>
  );
}
