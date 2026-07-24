import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PageShell, PageIntro } from "@/components/SiteChrome";
import { RELEASES } from "@/lib/catalog";

export const Route = createFileRoute("/music")({
  head: () => ({
    meta: [
      { title: "Music — Adea Lyric" },
      {
        name: "description",
        content:
          "Stream, download, or take home a physical copy. Continuous player, full catalog, direct links.",
      },
      { property: "og:title", content: "Music — Adea Lyric" },
      { property: "og:description", content: "Continuous listening. Full catalog." },
    ],
  }),
  component: MusicPage,
});

function MusicPage() {
  const all = RELEASES.flatMap((r) => r.tracks.map((t) => ({ ...t, release: r })));
  const [current, setCurrent] = useState(0);
  const [playing, setPlaying] = useState(false);
  const t = all[current];

  return (
    <PageShell>
      <PageIntro
        eyebrow="Music"
        title="Continuous,"
        italic="uninterrupted."
        sub="The full catalog, in a single player."
      />

      <section className="px-6 pb-24 md:px-12">
        <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-16 md:grid-cols-12">
          {/* Now playing */}
          <div className="md:col-span-5">
            <div className="sticky top-32">
              <div className="relative aspect-square overflow-hidden border border-border">
                <img
                  src={t.release.cover}
                  alt={t.release.title}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent" />
                <button
                  onClick={() => setPlaying((v) => !v)}
                  className="absolute inset-0 grid place-items-center"
                >
                  <span className="grid h-24 w-24 place-items-center border border-bone/60 bg-ink/40 text-bone backdrop-blur-sm transition-all hover:scale-110 hover:bg-bone hover:text-ink">
                    {playing ? <PauseIcon /> : <PlayIcon className="h-8 w-8" />}
                  </span>
                </button>
              </div>
              <div className="mt-6 text-eyebrow text-ash">
                {t.release.type} · {t.release.year}
              </div>
              <h2 className="mt-2 text-display text-4xl text-bone md:text-5xl">{t.title}</h2>
              <Link
                to="/discography/$slug"
                params={{ slug: t.release.slug }}
                className="mt-2 inline-block text-bone/70 hover:text-bone"
              >
                from <span className="italic">{t.release.title}</span>
              </Link>

              {/* Scrubber */}
              <div className="mt-8 flex items-center gap-4 text-eyebrow text-ash">
                <span>0:00</span>
                <div className="relative h-px flex-1 bg-border">
                  <div
                    className={`absolute inset-y-0 left-0 bg-bone transition-all duration-1000 ${playing ? "w-1/3" : "w-0"}`}
                  />
                </div>
                <span>{t.length}</span>
              </div>

              <div className="mt-6 flex gap-2">
                <button
                  onClick={() => setCurrent((c) => Math.max(0, c - 1))}
                  className="grid h-12 w-12 place-items-center border border-border text-bone hover:border-bone"
                >
                  ‹
                </button>
                <button
                  onClick={() => setPlaying((v) => !v)}
                  className="grid h-12 w-12 place-items-center border border-bone bg-bone text-ink"
                >
                  {playing ? "❚❚" : "▶"}
                </button>
                <button
                  onClick={() => setCurrent((c) => Math.min(all.length - 1, c + 1))}
                  className="grid h-12 w-12 place-items-center border border-border text-bone hover:border-bone"
                >
                  ›
                </button>
              </div>
            </div>
          </div>

          {/* Queue */}
          <div className="md:col-span-7">
            <div className="text-eyebrow mb-4 text-ash">Queue · {all.length} tracks</div>
            <ul>
              {all.map((tr, i) => {
                const active = i === current;
                return (
                  <li key={`${tr.release.slug}-${tr.n}`}>
                    <button
                      onClick={() => {
                        setCurrent(i);
                        setPlaying(true);
                      }}
                      className={`group flex w-full items-center justify-between gap-6 border-t border-border py-4 text-left last:border-b transition-colors ${active ? "text-bone" : "text-bone/60 hover:text-bone"}`}
                    >
                      <div className="flex items-center gap-6">
                        <span className="text-eyebrow w-6 text-ash">
                          {active && playing ? "♪" : String(i + 1).padStart(2, "0")}
                        </span>
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

function PlayIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}
function PauseIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-8 w-8" fill="currentColor" aria-hidden>
      <path d="M6 5h4v14H6zM14 5h4v14h-4z" />
    </svg>
  );
}
