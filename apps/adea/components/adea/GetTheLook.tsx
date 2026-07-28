"use client";

export function GetTheLookPage() {
  return (
    <>
      {/* DARK HERO */}
      <section className="relative flex min-h-[50svh] items-end overflow-hidden bg-ink md:min-h-[60svh]">
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-ink/30" />
        <div className="relative z-10 mx-auto w-full max-w-[1600px] px-6 pb-16 pt-40 md:px-12 md:pb-24 md:pt-56">
          <div className="text-eyebrow text-ash">Style — Get the Look</div>
          <h1 className="mt-6 text-display text-[clamp(3.5rem,11vw,12rem)] leading-none text-bone">
            Get the Look.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-bone/70">
            Adea&apos;s style, curated. Every piece worn on stage, in press, and on the streets of West Philly.
          </p>
        </div>
      </section>

      {/* WHITE CONTENT — Coming Soon */}
      <section className="relative bg-white px-6 py-24 md:px-12 md:py-32">
        <div className="mx-auto max-w-[1600px]">
          <div className="text-eyebrow mb-4 text-black">01 — Looks</div>
          <h2 className="text-display text-4xl text-black md:text-6xl">
            Coming soon.
          </h2>
          <p className="mt-6 max-w-lg text-base text-black">
            Styled looks from every era. Shop the exact pieces Adea wears — from stage outfits to everyday Philly style.
          </p>

          {/* Placeholder grid */}
          <div className="mt-16 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="relative aspect-[3/4] overflow-hidden border border-black/10 bg-[#f0f0f0]">
                <div className="flex h-full w-full items-center justify-center text-[11px] uppercase tracking-widest text-black/15">
                  Look {i}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
