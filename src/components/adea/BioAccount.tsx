"use client";

import { PageIntro } from "./SiteChrome";

const philly1 = "/philly-1.jpg";
const philly2 = "/philly-2.jpg";
const philly3 = "/philly-3.jpg";

export function BioPage() {
  return (
    <>
      <PageIntro eyebrow="The Artist" title="Adea Lyric," italic="in her own key." dark />
      <section className="bg-white px-6 pb-24 md:px-12">
        <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-16 md:grid-cols-12">
          <div className="space-y-8 text-xl leading-relaxed text-black/70 md:col-span-7">
            <p>
              Since stepping into the public spotlight in 2017, Adea has remained true to her
              artistry, refusing to compromise her sound or vision.
            </p>
            <p>
              She isn&apos;t following trends — she&apos;s <span className="italic text-black">defining</span>{" "}
              them. Her music is raw, soulful, unapologetic, and rooted in the culture that raised
              her.
            </p>
            <p className="text-display text-4xl leading-tight text-black md:text-6xl">
              Adea Lyric isn&apos;t chasing a sound.{" "}
              <span className="italic text-black/40">She is the sound of West Philly.</span>
            </p>
          </div>
          <aside className="md:col-span-4 md:col-start-9">
            <div className="grid grid-cols-2 gap-4">
              {[["Since", "2017"], ["Home", "W. Philly"], ["Releases", "5+"], ["Label", "Indie"]].map(([k, v]) => (
                <div key={k} className="border border-black/10 p-6">
                  <div className="text-eyebrow text-black/30">{k}</div>
                  <div className="mt-2 text-display text-3xl text-black">{v}</div>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </section>
      <section className="grid grid-cols-1 gap-1 bg-black/5 md:grid-cols-3">
        {[philly1, philly2, philly3].map((src, i) => (
          <div key={i} className="relative aspect-[4/5] overflow-hidden">
            <img src={src} alt="" className="h-full w-full object-cover grayscale" />
          </div>
        ))}
      </section>
    </>
  );
}

export function AccountPage() {
  return (
    <>
      <PageIntro eyebrow="Fan Portal" title="Sign in." />
      <section className="px-6 pb-32 md:px-12">
        <div className="mx-auto max-w-md">
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="text-eyebrow text-ash">Email</label>
              <input type="email" className="mt-2 w-full border-b border-border bg-transparent py-3 text-bone focus:border-bone focus:outline-none" />
            </div>
            <div>
              <label className="text-eyebrow text-ash">Password</label>
              <input type="password" className="mt-2 w-full border-b border-border bg-transparent py-3 text-bone focus:border-bone focus:outline-none" />
            </div>
            <button className="flex w-full items-center justify-between border border-bone px-6 py-4 text-eyebrow text-bone transition-all hover:bg-bone hover:text-ink cursor-pointer">
              <span>Sign in</span>
              <span>→</span>
            </button>
            <p className="text-center text-sm text-ash">Fan portal coming online soon.</p>
          </form>
        </div>
      </section>
    </>
  );
}
