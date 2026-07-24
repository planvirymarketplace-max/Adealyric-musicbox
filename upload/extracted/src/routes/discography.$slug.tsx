import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { PageShell } from "@/components/SiteChrome";
import { RELEASES } from "@/lib/catalog";

export const Route = createFileRoute("/discography/$slug")({
  loader: ({ params }) => {
    const release = RELEASES.find((r) => r.slug === params.slug);
    if (!release) throw notFound();
    return release;
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.title} — Adea Lyric` },
          { name: "description", content: loaderData.story },
          { property: "og:title", content: `${loaderData.title} — Adea Lyric` },
          { property: "og:description", content: loaderData.story },
          { property: "og:image", content: loaderData.cover },
          { name: "twitter:image", content: loaderData.cover },
        ]
      : [{ title: "Release — Adea Lyric" }, { name: "robots", content: "noindex" }],
  }),
  component: ReleaseDetail,
  notFoundComponent: () => (
    <PageShell>
      <div className="grid min-h-[60vh] place-items-center px-6 text-center">
        <div>
          <div className="text-eyebrow text-ash">404</div>
          <h1 className="mt-4 text-display text-6xl text-bone">Release not found</h1>
          <Link
            to="/discography"
            className="mt-8 inline-block text-eyebrow text-bone underline-offset-8 hover:underline"
          >
            Back to discography
          </Link>
        </div>
      </div>
    </PageShell>
  ),
});

function ReleaseDetail() {
  const r = Route.useLoaderData();
  const idx = RELEASES.findIndex((x) => x.slug === r.slug);
  const prev = RELEASES[idx - 1];
  const next = RELEASES[idx + 1];

  return (
    <PageShell>
      {/* Hero */}
      <section className="relative min-h-[90svh] overflow-hidden">
        <img
          src={r.bgImage}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-40 grayscale"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/60 via-ink/40 to-ink" />

        <div className="relative z-10 mx-auto grid max-w-[1600px] grid-cols-1 items-end gap-16 px-6 pb-16 pt-40 md:grid-cols-12 md:px-12 md:pb-24 md:pt-56">
          <div className="md:col-span-5">
            <div className="relative aspect-square overflow-hidden border border-border shadow-2xl">
              <img src={r.cover} alt={r.title} className="h-full w-full object-cover" />
            </div>
          </div>
          <div className="md:col-span-7">
            <Link to="/discography" className="text-eyebrow text-ash hover:text-bone">
              ← Discography
            </Link>
            <div className="mt-6 flex items-center gap-6 text-eyebrow text-ash">
              <span>{r.type}</span>
              <span>·</span>
              <span>{r.year}</span>
              <span>·</span>
              <span>{r.runtime}</span>
            </div>
            <h1 className="mt-6 text-display text-[clamp(3.5rem,12vw,14rem)] leading-none text-bone animate-reveal">
              {r.title}
            </h1>
            <p className="mt-8 max-w-xl text-xl text-bone/80">{r.story}</p>
            <div className="mt-10 flex flex-wrap gap-3">
              <button className="inline-flex items-center gap-3 border border-bone bg-bone px-8 py-4 text-eyebrow text-ink transition-all hover:bg-transparent hover:text-bone">
                <PlayIcon /> Play
              </button>
              <button className="inline-flex items-center gap-3 border border-border px-8 py-4 text-eyebrow text-bone transition-all hover:border-bone">
                Spotify ↗
              </button>
              <button className="inline-flex items-center gap-3 border border-border px-8 py-4 text-eyebrow text-bone transition-all hover:border-bone">
                Apple Music ↗
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Tracklist */}
      <section className="relative bg-ink px-6 py-24 md:px-12 md:py-32">
        <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-16 md:grid-cols-12">
          <div className="md:col-span-4">
            <div className="text-eyebrow text-ash">Tracklist</div>
            <h2 className="mt-6 text-display text-6xl text-bone">
              Every bar,
              <br />
              <span className="italic text-ash">in order.</span>
            </h2>
            <p className="mt-6 text-bone/60">{r.credits}</p>
          </div>
          <ul className="md:col-span-8">
            {r.tracks.map((t: { n: number; title: string; length: string; feat?: string }) => (
              <li
                key={t.n}
                className="group flex items-center justify-between gap-8 border-t border-border py-6 last:border-b"
              >
                <div className="flex items-center gap-6 md:gap-10">
                  <span className="text-eyebrow w-8 text-ash">{String(t.n).padStart(2, "0")}</span>
                  <button className="grid h-10 w-10 place-items-center border border-border text-bone opacity-0 transition-all group-hover:opacity-100 group-hover:border-bone">
                    <PlayIcon className="h-3 w-3" />
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

      {/* Prev / Next */}
      <section className="grid grid-cols-1 border-t border-border md:grid-cols-2">
        {prev ? (
          <Link
            to="/discography/$slug"
            params={{ slug: prev.slug }}
            className="group relative flex flex-col justify-between gap-6 border-b border-border p-8 transition-colors hover:bg-mist md:border-b-0 md:border-r md:p-12"
          >
            <div className="text-eyebrow text-ash">← Previous</div>
            <div>
              <div className="text-eyebrow text-ash">
                {prev.year} · {prev.type}
              </div>
              <div className="mt-3 text-display text-4xl text-bone md:text-6xl">{prev.title}</div>
            </div>
          </Link>
        ) : (
          <div className="hidden md:block" />
        )}
        {next ? (
          <Link
            to="/discography/$slug"
            params={{ slug: next.slug }}
            className="group relative flex flex-col items-end justify-between gap-6 p-8 transition-colors hover:bg-mist md:p-12"
          >
            <div className="text-eyebrow text-ash">Next →</div>
            <div className="text-right">
              <div className="text-eyebrow text-ash">
                {next.year} · {next.type}
              </div>
              <div className="mt-3 text-display text-4xl text-bone md:text-6xl">{next.title}</div>
            </div>
          </Link>
        ) : (
          <div className="hidden md:block" />
        )}
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
