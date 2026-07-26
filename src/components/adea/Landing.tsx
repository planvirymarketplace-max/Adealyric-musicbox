"use client";

import { useEffect, useRef, useState } from "react";
import { useAppStore } from "@/lib/store";
import { LetterToMyFans } from "./LetterToMyFans";
import { HomeBanner } from "./HomeBanner";

const heroBg = "/hero-muted.png";

const timelineVideos = [
  "/Screen Recording 2026-07-24 034249.mp4",
  "/Screen Recording 2026-07-24 034528.mp4",
  "/Screen Recording 2026-07-24 035242.mp4",
  "/Screen Recording 2026-07-24 035616.mp4",
  "/Screen Recording 2026-07-24 035951.mp4",
];

/* ---- Icons ---- */
function PlayIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

/* ---- Reveal Hook ---- */
function useReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setShown(true), {
      threshold: 0.15,
    });
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return { ref, shown };
}

/* ---- Hero ---- */
function Hero() {
  const [t, setT] = useState(0);
  const { setActiveTab } = useAppStore();
  useEffect(() => {
    const on = () => setT(window.scrollY);
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <section id="top" className="relative min-h-[100svh] w-full overflow-hidden grain">
      <div className="absolute inset-0">
        <img
          src={heroBg}
          alt="Adea Lyric — Hero"
          className="absolute inset-0 h-full w-full object-cover opacity-40 saturate-0"
          style={{ transform: `translateY(${t * 0.3}px) scale(${1 + t * 0.0004})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/60 via-ink/40 to-ink" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-transparent to-ink/60" />
      </div>
      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-[1600px] flex-col justify-end px-6 pb-16 pt-40 md:px-12 md:pb-24">
        <div className="text-eyebrow animate-rise text-ash">Vol. I — The Sound of West Philly</div>
        <h1 className="mt-8 text-display text-bone">
          <span className="block animate-reveal text-[clamp(4rem,16vw,18rem)]">SHE IS</span>
          <span
            className="-mt-4 block animate-reveal italic text-[clamp(4rem,16vw,18rem)] text-ash"
            style={{ animationDelay: "0.2s" }}
          >
            the sound.
          </span>
        </h1>
        <div className="mt-12 grid grid-cols-1 items-end gap-10 md:grid-cols-3">
          <p
            className="animate-rise text-lg leading-relaxed text-bone/80 md:col-span-1"
            style={{ animationDelay: "0.5s" }}
          >
            Since 2017, Adea has refused to compromise — raw, soulful, unapologetic, rooted in the
            culture that raised her.
          </p>
          <div className="hidden md:block" />
          <div
            className="flex animate-rise items-center gap-4 md:justify-end"
            style={{ animationDelay: "0.7s" }}
          >
            <button
              onClick={() => setActiveTab("discography")}
              className="group inline-flex items-center gap-4 border border-bone px-8 py-4 text-eyebrow text-bone transition-all hover:bg-bone hover:text-ink cursor-pointer"
            >
              <PlayIcon />
              <span>Play Latest</span>
            </button>
          </div>
        </div>
      </div>
      <div className="absolute bottom-8 left-6 z-10 hidden flex-col items-center gap-4 md:flex md:left-12">
        <div className="text-eyebrow rotate-90 text-ash" style={{ writingMode: "vertical-rl" }}>
          Scroll
        </div>
        <div className="h-24 w-px bg-gradient-to-b from-ash to-transparent" />
      </div>
      <div className="grain-overlay" />
    </section>
  );
}

/* ---- Marquee ---- */
function Marquee() {
  const words = ["SOUL", "•", "RAW", "•", "WEST PHILLY", "•", "UNAPOLOGETIC", "•", "ADEA LYRIC", "•"];
  return (
    <div className="relative overflow-hidden border-y border-border bg-ink py-10">
      <div className="marquee-track flex w-max whitespace-nowrap">
        {[...Array(2)].map((_, k) => (
          <div key={k} className="flex items-center gap-16 pr-16">
            {words.map((w, i) => (
              <span key={`${k}-${i}`} className="text-display text-[clamp(3rem,8vw,8rem)] text-bone">{w}</span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---- Flip Card for bento grid ---- */
const NAME_CARDS = [
  { letter: "A", word: "Authentic", desc: "Unfiltered. Unapologetic. Real." },
  { letter: "D", word: "Determined", desc: "Built through discipline and purpose." },
  { letter: "E", word: "Expressive", desc: "Every lyric tells a story." },
  { letter: "A", word: "Artistry", desc: "Singer. Songwriter. Producer." },
  { letter: "L", word: "Legacy", desc: "Creating music that outlives trends." },
  { letter: "Y", word: "Yang", desc: "Strength, balance, and creative energy." },
  { letter: "R", word: "Resilient", desc: "Rising stronger through every challenge." },
  { letter: "I", word: "Independent", desc: "Creating on her own terms." },
  { letter: "C", word: "Culture", desc: "The unmistakable sound of West Philadelphia." },
];

const CARD_LAYOUT = [
  { colSpan: 2, rowSpan: 2 },
  { colSpan: 1, rowSpan: 1 },
  { colSpan: 1, rowSpan: 1 },
  { colSpan: 1, rowSpan: 1 },
  { colSpan: 2, rowSpan: 1 },
  { colSpan: 1, rowSpan: 1 },
  { colSpan: 1, rowSpan: 1 },
  { colSpan: 1, rowSpan: 1 },
  { colSpan: 3, rowSpan: 1 },
];

function FlipCard({ card, layout, index }: { card: (typeof NAME_CARDS)[0]; layout: (typeof CARD_LAYOUT)[0]; index: number }) {
  const delay = index * 0.4;
  return (
    <div
      className={`flip-card bento-float-item border border-ink/10 ${layout.colSpan === 2 ? "md:col-span-2" : ""} ${layout.colSpan === 3 ? "col-span-2 md:col-span-3" : ""} ${layout.rowSpan === 2 ? "md:row-span-2" : ""}`}
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="flip-inner">
        <div className="flip-front flex items-center justify-center bg-ink">
          <span className="text-display text-[clamp(3rem,10vw,8rem)] leading-none select-none text-bone">{card.letter}</span>
        </div>
        <div className="flip-back flex flex-col items-center justify-center bg-white px-4 py-4">
          <span className="text-display text-[clamp(1.5rem,4vw,3rem)] leading-none text-ink">{card.word}</span>
          <p className={`mt-2 text-center leading-snug text-ink/50 ${layout.colSpan >= 2 ? "text-sm max-w-sm" : "text-xs max-w-[140px]"}`}>{card.desc}</p>
        </div>
      </div>
    </div>
  );
}

/* ---- Bio Section ---- */
function BioSection() {
  const { ref, shown } = useReveal<HTMLDivElement>();
  const { setActiveTab } = useAppStore();
  return (
    <section id="bio" ref={ref} className="relative bg-white px-6 py-32 md:px-12 md:py-48">
      <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-12 md:grid-cols-12 md:gap-16">
        <div className="md:col-span-4">
          <div className="sticky top-32">
            <div className="text-eyebrow text-ink/40">01 — Bio</div>
            <h2 className={`mt-6 text-display text-[clamp(5rem,13vw,16rem)] leading-[0.85] text-ink transition-all duration-1000 ${shown ? "opacity-100" : "opacity-0 translate-y-8"}`}>
              heart and
              <br />
              <span className="text-yellow-400">soul.</span>
            </h2>
          </div>
        </div>
        <div className={`md:col-span-7 md:col-start-6 transition-all duration-1000 ${shown ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <div className="grid auto-rows-[180px] grid-cols-2 gap-3 md:auto-rows-[200px] md:grid-cols-3 md:gap-4">
            {NAME_CARDS.map((card, i) => (
              <FlipCard key={card.word} card={card} layout={CARD_LAYOUT[i]} index={i} />
            ))}
          </div>
          <div className="mt-10">
            <button onClick={() => setActiveTab("bio")} className="inline-flex items-center gap-4 text-eyebrow text-ink cursor-pointer">
              <span className="block h-px w-16 bg-ink" />
              Read the full story
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---- Discography Path (video timeline) ---- */
function StepRow({ step, left, index, total }: {
  step: { year: string; title: string; note: string; video: string; slug: string };
  left: boolean;
  index: number;
  total: number;
}) {
  const { ref, shown } = useReveal<HTMLDivElement>();
  const vidRef = useRef<HTMLVideoElement>(null);
  const { setActiveTab, setDetailSlug } = useAppStore();
  const gradeOpacity = 0.35 + (index / (total - 1)) * 0.65;
  return (
    <div ref={ref} className="relative grid grid-cols-1 gap-8 py-16 md:grid-cols-2 md:py-24">
      <div className={`${left ? "md:order-1" : "md:order-2"}`}>
        <div
          className={`relative aspect-[4/5] w-full overflow-hidden border border-border transition-all duration-1000 ${
            shown ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16"
          }`}
          onMouseEnter={() => vidRef.current?.play()}
          onMouseLeave={() => { vidRef.current?.pause(); vidRef.current!.currentTime = 0; }}
        >
          <video
            ref={vidRef}
            muted
            loop
            playsInline
            preload="metadata"
            className="h-full w-full object-cover"
            style={{ opacity: gradeOpacity, filter: `grayscale(1) contrast(${1 + index * 0.05})` }}
          >
            <source src={step.video} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-tr from-ink via-ink/30 to-transparent" />
          <div className="absolute bottom-8 left-8 text-display text-6xl text-bone md:text-8xl">
            {step.year}
          </div>
        </div>
      </div>
      <div className={`${left ? "md:order-2" : "md:order-1"} flex items-center`}>
        <div className={`transition-all delay-200 duration-1000 ${shown ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <div className="text-eyebrow text-ash">Step 0{index + 1} / 0{total}</div>
          <h3 className="mt-6 text-display text-[clamp(2.5rem,5vw,5rem)] text-bone">{step.title}</h3>
          <p className="mt-6 max-w-md text-lg text-bone/70">{step.note}</p>
          <div className="mt-8 flex items-center gap-4">
            <span className="block h-px w-16 bg-bone" />
            <button
              onClick={() => { setActiveTab("discography"); setDetailSlug(step.slug, "release"); }}
              className="text-eyebrow text-bone transition-opacity hover:opacity-70 cursor-pointer"
            >
              Detail
            </button>
          </div>
        </div>
      </div>
      <div className="absolute left-0 top-24 hidden h-4 w-4 -translate-x-1/2 rotate-45 border border-bone bg-ink md:left-1/2 md:block" />
    </div>
  );
}

function DiscographyPath() {
  const steps = [
    { year: "2017", title: "Debut", note: "West Philly emerges.", video: timelineVideos[0], slug: "debut-2017" },
    { year: "2019", title: "Underground", note: "Building the culture.", video: timelineVideos[1], slug: "west-philly" },
    { year: "2021", title: "West Philly", note: "The mixtape that defined a block.", video: timelineVideos[2], slug: "west-philly" },
    { year: "2023", title: "The Lyric EP", note: "Refusing every trend.", video: timelineVideos[3], slug: "the-lyric-ep" },
    { year: "2024", title: "F**K Boi", note: "Unapologetic. Undeniable.", video: timelineVideos[4], slug: "fk-boi" },
  ];
  return (
    <section id="discography" className="relative overflow-hidden bg-ink px-6 py-32 md:px-12 md:py-48">
      <div className="mx-auto max-w-[1600px]">
        <div className="text-eyebrow text-ash">03 — Discography</div>
        <h2 className="mt-6 text-display text-[clamp(3rem,7vw,7rem)] text-bone">
          A stepped path <span className="italic text-ash">of progression.</span>
        </h2>
        <div className="relative mt-24">
          <div className="absolute left-0 top-0 h-full w-px bg-gradient-to-b from-transparent via-border to-transparent md:left-1/2" />
          {steps.map((s, i) => (
            <StepRow key={i} step={s} left={i % 2 === 0} index={i} total={steps.length} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---- Newsletter ---- */
function Newsletter() {
  return (
    <section id="tour" className="relative overflow-hidden bg-bone px-6 py-32 text-ink md:px-12 md:py-48">
      <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-16 md:grid-cols-12">
        <div className="md:col-span-7">
          <div className="text-eyebrow text-ink/60">04 — Direct Line</div>
          <h2 className="mt-6 text-display text-[clamp(3rem,9vw,10rem)] text-ink">
            First tickets.
            <br />
            <span className="italic">First drops.</span>
          </h2>
        </div>
        <form className="md:col-span-5 md:pt-16" onSubmit={(e) => e.preventDefault()}>
          <label className="text-eyebrow text-ink/60">Enter your email</label>
          <div className="mt-4 flex border-b border-ink pb-4">
            <input type="email" placeholder="you@somewhere.com" className="flex-1 bg-transparent text-2xl text-ink placeholder:text-ink/30 focus:outline-none" />
            <button className="text-eyebrow text-ink transition-opacity hover:opacity-60 cursor-pointer">Subscribe →</button>
          </div>
          <p className="mt-4 text-sm text-ink/60">No spam. Only the sound.</p>
        </form>
      </div>
    </section>
  );
}

export function Landing() {
  return (
    <>
      <Hero />
      <HomeBanner />
      <Marquee />
      <BioSection />
      <LetterToMyFans />
      <DiscographyPath />
      <Newsletter />
    </>
  );
}
