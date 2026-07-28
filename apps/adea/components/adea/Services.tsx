"use client";

import { SiteHeader, SiteFooter, PageIntro } from "./SiteChrome";

const SERVICES_HERO = "/News-Gallery/Hero/studio.jpg";

const VOCAL_COACHING_IMAGE = "/News-Gallery/Gallery/studio.jpg";
const SONGWRITING_IMAGE = "/News-Gallery/Gallery/Stage Performancepng.png";

export function ServicesPage() {
  return (
    <>
      {/* ===== SECTION 1 — Hero with background image ===== */}
      <section className="relative flex min-h-[60svh] items-end overflow-hidden bg-ink md:min-h-[70svh]">
        <img
          src={SERVICES_HERO}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-60"
          aria-hidden
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
        <div className="relative z-10 mx-auto w-full max-w-[1600px] px-6 pb-16 pt-40 md:px-12 md:pb-24 md:pt-56">
          <div className="text-eyebrow text-ash">Services — Offerings</div>
          <h1 className="mt-6 text-display text-[clamp(3.5rem,11vw,12rem)] leading-none text-bone">
            Work with
            <span className="block italic text-ash">Adea</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-bone/70">
            Vocal coaching, songwriting, and creative collaboration. Elevate your sound with West Philly's finest.
          </p>
        </div>
      </section>

      {/* ===== SECTION 2 — Vocal Coaching ===== */}
      <section className="bg-white px-6 py-20 md:px-12 md:py-32">
        <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-16 md:grid-cols-12">
          <div className="md:col-span-5">
            <div className="relative aspect-[4/5] overflow-hidden border border-black/10">
              <img
                src={VOCAL_COACHING_IMAGE}
                alt=""
                className="h-full w-full object-cover grayscale opacity-80"
              />
            </div>
          </div>
          <div className="md:col-span-7 flex flex-col justify-center">
            <div className="text-eyebrow mb-4 text-black">Vocal Coaching</div>
            <h2 className="text-display text-4xl text-black md:text-6xl">
              Find your <span className="italic text-black">voice.</span>
            </h2>
            <p className="mt-6 max-w-lg text-base text-black">
              Private vocal coaching sessions tailored to your unique sound. From technique to performance, unlock your full potential with personalized guidance.
            </p>
            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-px w-8 bg-black" />
                <span className="text-sm text-black">Technique & Breath Control</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-px w-8 bg-black" />
                <span className="text-sm text-black">Performance Coaching</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-px w-8 bg-black" />
                <span className="text-sm text-black">Studio Recording Prep</span>
              </div>
            </div>
            <a
              href="/booking"
              className="mt-10 inline-flex items-center gap-3 border border-black bg-black px-8 py-4 text-eyebrow text-white transition-all hover:bg-transparent hover:text-black cursor-pointer"
            >
              Book a Session →
            </a>
          </div>
        </div>
      </section>

      {/* ===== SECTION 3 — Songwriting ===== */}
      <section className="bg-white px-6 py-20 md:px-12 md:py-32 border-t border-black/10">
        <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-16 md:grid-cols-12">
          <div className="md:col-span-7 flex flex-col justify-center order-2 md:order-1">
            <div className="text-eyebrow mb-4 text-black">Songwriting</div>
            <h2 className="text-display text-4xl text-black md:text-6xl">
              Craft your <span className="italic text-black">story.</span>
            </h2>
            <p className="mt-6 max-w-lg text-base text-black">
              Collaborative songwriting sessions that bring your vision to life. From concept to final production, work together to create music that speaks.
            </p>
            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-px w-8 bg-black" />
                <span className="text-sm text-black">Lyric Development</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-px w-8 bg-black" />
                <span className="text-sm text-black">Melody & Composition</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-px w-8 bg-black" />
                <span className="text-sm text-black">Full Production Collaboration</span>
              </div>
            </div>
            <a
              href="/booking"
              className="mt-10 inline-flex items-center gap-3 border border-black bg-black px-8 py-4 text-eyebrow text-white transition-all hover:bg-transparent hover:text-black cursor-pointer"
            >
              Start Writing →
            </a>
          </div>
          <div className="md:col-span-5 order-1 md:order-2">
            <div className="relative aspect-[4/5] overflow-hidden border border-black/10">
              <img
                src={SONGWRITING_IMAGE}
                alt=""
                className="h-full w-full object-cover grayscale opacity-80"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ===== SECTION 4 — CTA ===== */}
      <section className="relative bg-ink px-6 py-16 md:px-12 md:py-20">
        <div className="mx-auto flex max-w-[1600px] flex-col items-center justify-between gap-6 md:flex-row">
          <div>
            <h3 className="text-display text-3xl text-bone md:text-5xl">Ready to Create?</h3>
            <p className="mt-2 text-ash">Let's make something extraordinary together.</p>
          </div>
          <a
            href="/booking"
            className="inline-flex items-center gap-3 border border-bone px-8 py-4 text-eyebrow text-bone transition-all hover:bg-bone hover:text-ink cursor-pointer"
          >
            Book Now →
          </a>
        </div>
      </section>
    </>
  );
}
