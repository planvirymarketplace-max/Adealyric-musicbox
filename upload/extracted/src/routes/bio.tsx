import { createFileRoute } from "@tanstack/react-router";
import { PageShell, PageIntro } from "@/components/SiteChrome";
const philly1 = "/philly-1.jpg";
const philly2 = "/philly-2.jpg";
const philly3 = "/philly-3.jpg";

export const Route = createFileRoute("/bio")({
  head: () => ({
    meta: [
      { title: "Bio — Adea Lyric" },
      {
        name: "description",
        content:
          "The story of Adea Lyric — a soul artist defining the sound of West Philadelphia since 2017.",
      },
      { property: "og:title", content: "Bio — Adea Lyric" },
      { property: "og:description", content: "Raw, soulful, unapologetic. The story so far." },
    ],
  }),
  component: BioPage,
});

function BioPage() {
  return (
    <PageShell>
      <PageIntro eyebrow="The Artist" title="Adea Lyric," italic="in her own key." />

      <section className="px-6 pb-24 md:px-12">
        <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-16 md:grid-cols-12">
          <div className="space-y-8 text-xl leading-relaxed text-bone/80 md:col-span-7">
            <p>
              Since stepping into the public spotlight in 2017, Adea has remained true to her
              artistry, refusing to compromise her sound or vision.
            </p>
            <p>
              She isn't following trends — she's <span className="italic text-bone">defining</span>{" "}
              them. Her music is raw, soulful, unapologetic, and rooted in the culture that raised
              her.
            </p>
            <p className="text-display text-4xl leading-tight text-bone md:text-6xl">
              Adea Lyric isn't chasing a sound.{" "}
              <span className="italic text-ash">She is the sound of West Philly.</span>
            </p>
          </div>
          <aside className="md:col-span-4 md:col-start-9">
            <div className="grid grid-cols-2 gap-4">
              {[
                ["Since", "2017"],
                ["Home", "W. Philly"],
                ["Releases", "5+"],
                ["Label", "Indie"],
              ].map(([k, v]) => (
                <div key={k} className="border border-border p-6">
                  <div className="text-eyebrow text-ash">{k}</div>
                  <div className="mt-2 text-display text-3xl text-bone">{v}</div>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-1 bg-border md:grid-cols-3">
        {[philly1, philly2, philly3].map((src, i) => (
          <div key={i} className="relative aspect-[4/5] overflow-hidden bg-ink">
            <img src={src} alt="" className="h-full w-full object-cover grayscale" />
          </div>
        ))}
      </section>
    </PageShell>
  );
}
