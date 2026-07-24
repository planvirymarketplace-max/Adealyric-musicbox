import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
const fkboiAsset = "/fkboi.jpg";
const cantnobodyAsset = "/cantnobody.webp";
const philly1 = "/philly-1.jpg";
const philly2 = "/philly-2.jpg";
const philly3 = "/philly-3.jpg";

const NAV = [
  { label: "Music", href: "/music" },
  { label: "Discography", href: "/discography" },
  { label: "Tour", href: "/tour" },
  { label: "Booking", href: "/booking" },
  { label: "Shop", href: "/shop" },
  { label: "Bio", href: "/bio" },
];

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

function Header() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-ink/70 backdrop-blur-xl border-b border-border" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-[1600px] items-center justify-between px-6 py-5 md:px-12">
        <Link to="/" className="text-eyebrow text-bone">
          Adea<span className="mx-2 text-ash">/</span>Lyric
        </Link>
        <nav className="hidden items-center gap-10 md:flex">
          {NAV.map((n) => (
            <Link
              key={n.href}
              to={n.href}
              className="group relative text-eyebrow text-bone/80 transition-colors hover:text-bone"
            >
              {n.label}
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-bone transition-all duration-500 group-hover:w-full" />
            </Link>
          ))}
        </nav>
        <Link to="/music" className="group flex items-center gap-3 text-eyebrow text-bone">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-bone opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-bone" />
          </span>
          Listen
        </Link>
      </div>
    </header>
  );
}

function Hero() {
  const [t, setT] = useState(0);
  useEffect(() => {
    const on = () => setT(window.scrollY);
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <section id="top" className="relative min-h-[100svh] w-full overflow-hidden grain">
      {/* Background image collage */}
      <div className="absolute inset-0">
        <img
          src={fkboiAsset}
          alt="Adea Lyric — F**K BOI cover"
          className="absolute inset-0 h-full w-full object-cover opacity-40 saturate-0"
          style={{ transform: `translateY(${t * 0.3}px) scale(${1 + t * 0.0004})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/60 via-ink/40 to-ink" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-transparent to-ink/60" />
      </div>
      {/* Massive type */}
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
            <Link
              to="/music"
              className="group inline-flex items-center gap-4 border border-bone px-8 py-4 text-eyebrow text-bone transition-all hover:bg-bone hover:text-ink"
            >
              <PlayIcon />
              <span>Play Latest</span>
            </Link>
          </div>
        </div>
      </div>
      {/* Side scroll indicator */}
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

function Marquee() {
  const words = [
    "SOUL",
    "•",
    "RAW",
    "•",
    "WEST PHILLY",
    "•",
    "UNAPOLOGETIC",
    "•",
    "ADEA LYRIC",
    "•",
  ];
  return (
    <div className="relative overflow-hidden border-y border-border bg-ink py-10">
      <div className="marquee-track flex w-max whitespace-nowrap">
        {[...Array(2)].map((_, k) => (
          <div key={k} className="flex items-center gap-16 pr-16">
            {words.map((w, i) => (
              <span
                key={`${k}-${i}`}
                className="text-display text-[clamp(3rem,8vw,8rem)] text-bone"
              >
                {w}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function Bio() {
  const { ref, shown } = useReveal<HTMLDivElement>();
  return (
    <section id="bio" ref={ref} className="relative bg-ink px-6 py-32 md:px-12 md:py-48">
      <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-16 md:grid-cols-12">
        <div className="md:col-span-4">
          <div className="sticky top-32">
            <div className="text-eyebrow text-ash">01 — Bio</div>
            <h2
              className={`mt-6 text-display text-[clamp(3rem,7vw,7rem)] text-bone transition-all duration-1000 ${
                shown ? "opacity-100" : "opacity-0 translate-y-8"
              }`}
            >
              Not chasing
              <br />
              <span className="italic text-ash">a sound.</span>
            </h2>
          </div>
        </div>
        <div className="space-y-8 text-lg leading-relaxed text-bone/80 md:col-span-7 md:col-start-6">
          <p
            className={`transition-all duration-1000 ${
              shown ? "opacity-100" : "opacity-0 translate-y-8"
            }`}
          >
            Since stepping into the public spotlight in 2017, Adea has remained true to her artistry
            — refusing to compromise her sound or vision.
          </p>
          <p
            className={`transition-all delay-200 duration-1000 ${
              shown ? "opacity-100" : "opacity-0 translate-y-8"
            }`}
          >
            She isn't following trends. She's <span className="text-bone italic">defining</span>{" "}
            them. Her music is raw, soulful, unapologetic, and rooted in the culture that raised
            her.
          </p>
          <p
            className={`text-display text-[clamp(2rem,4vw,4rem)] leading-tight text-bone transition-all delay-500 duration-1000 ${
              shown ? "opacity-100" : "opacity-0 translate-y-8"
            }`}
          >
            Adea Lyric isn't chasing a sound.{" "}
            <span className="italic text-ash">She is the sound of West Philly.</span>
          </p>
          <div className="pt-4">
            <Link to="/bio" className="inline-flex items-center gap-4 text-eyebrow text-bone">
              <span className="block h-px w-16 bg-bone" />
              Read the full story
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function SlidingCards() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [i, setI] = useState(0);
  const cards = [
    { src: fkboiAsset, title: "F**K Boi", year: "2024", type: "Single", slug: "fk-boi" },
    {
      src: cantnobodyAsset,
      title: "Can't Nobody",
      year: "2022",
      type: "Single",
      slug: "cant-nobody",
    },
    { src: philly3, title: "The Lyric EP", year: "2023", type: "EP", slug: "the-lyric-ep" },
    { src: philly2, title: "West Philly", year: "2021", type: "Mixtape", slug: "west-philly" },
  ];
  const scroll = (dir: number) => {
    const next = Math.max(0, Math.min(cards.length - 1, i + dir));
    setI(next);
    trackRef.current?.scrollTo({
      left: next * (trackRef.current.clientWidth * 0.72),
      behavior: "smooth",
    });
  };
  return (
    <section id="music" className="relative bg-ink py-32 md:py-48">
      <div className="mx-auto max-w-[1600px] px-6 md:px-12">
        <div className="mb-16 flex items-end justify-between">
          <div>
            <div className="text-eyebrow text-ash">02 — Catalog</div>
            <h2 className="mt-6 text-display text-[clamp(3rem,7vw,7rem)] text-bone">Now Playing</h2>
          </div>
          <div className="hidden gap-3 md:flex">
            <button
              onClick={() => scroll(-1)}
              className="grid h-14 w-14 place-items-center border border-border text-bone transition-all hover:bg-bone hover:text-ink"
            >
              <ArrowIcon className="rotate-180" />
            </button>
            <button
              onClick={() => scroll(1)}
              className="grid h-14 w-14 place-items-center border border-border text-bone transition-all hover:bg-bone hover:text-ink"
            >
              <ArrowIcon />
            </button>
          </div>
        </div>
      </div>
      <div
        ref={trackRef}
        className="scrollbar-none flex snap-x snap-mandatory gap-6 overflow-x-auto px-6 pb-8 md:gap-10 md:px-12"
        style={{ scrollbarWidth: "none" }}
      >
        {cards.map((c, idx) => (
          <Link
            key={idx}
            to="/discography/$slug"
            params={{ slug: c.slug }}
            className="group relative aspect-[3/4] w-[72vw] shrink-0 snap-start overflow-hidden border border-border bg-mist md:w-[36vw] lg:w-[28vw]"
          >
            <img
              src={c.src}
              alt={c.title}
              className="absolute inset-0 h-full w-full object-cover grayscale transition-all duration-[1200ms] group-hover:scale-105 group-hover:grayscale-0"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent opacity-90" />
            <div className="absolute inset-0 flex flex-col justify-between p-8">
              <div className="flex items-center justify-between">
                <span className="text-eyebrow text-bone">{c.type}</span>
                <span className="text-eyebrow text-bone">{c.year}</span>
              </div>
              <div>
                <h3 className="text-display text-4xl text-bone md:text-6xl">{c.title}</h3>
                <div className="mt-6 flex items-center gap-3 text-eyebrow text-bone opacity-0 translate-y-2 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0">
                  <PlayIcon className="h-3 w-3" />
                  <span>Stream</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
        <div className="w-6 shrink-0 md:w-12" />
      </div>
    </section>
  );
}

function DiscographyPath() {
  const steps = [
    {
      year: "2017",
      title: "Debut",
      note: "West Philly emerges.",
      img: philly1,
      slug: "debut-2017",
    },
    {
      year: "2019",
      title: "Underground",
      note: "Building the culture.",
      img: philly3,
      slug: "west-philly",
    },
    {
      year: "2021",
      title: "West Philly",
      note: "The mixtape that defined a block.",
      img: philly2,
      slug: "west-philly",
    },
    {
      year: "2023",
      title: "The Lyric EP",
      note: "Refusing every trend.",
      img: philly1,
      slug: "the-lyric-ep",
    },
    {
      year: "2024",
      title: "F**K Boi",
      note: "Unapologetic. Undeniable.",
      img: philly3,
      slug: "fk-boi",
    },
  ];
  return (
    <section
      id="discography"
      className="relative overflow-hidden bg-ink px-6 py-32 md:px-12 md:py-48"
    >
      <div className="mx-auto max-w-[1600px]">
        <div className="text-eyebrow text-ash">03 — Discography</div>
        <h2 className="mt-6 text-display text-[clamp(3rem,7vw,7rem)] text-bone">
          A stepped path <span className="italic text-ash">of progression.</span>
        </h2>
        <div className="relative mt-24">
          {/* Vertical center line */}
          <div className="absolute left-0 top-0 h-full w-px bg-gradient-to-b from-transparent via-border to-transparent md:left-1/2" />
          {steps.map((s, i) => {
            const left = i % 2 === 0;
            return <StepRow key={i} step={s} left={left} index={i} total={steps.length} />;
          })}
        </div>
      </div>
    </section>
  );
}

function StepRow({
  step,
  left,
  index,
  total,
}: {
  step: { year: string; title: string; note: string; img: string; slug: string };
  left: boolean;
  index: number;
  total: number;
}) {
  const { ref, shown } = useReveal<HTMLDivElement>();
  // Progressive fade — earlier = less opaque
  const gradeOpacity = 0.35 + (index / (total - 1)) * 0.65;
  return (
    <div ref={ref} className="relative grid grid-cols-1 gap-8 py-16 md:grid-cols-2 md:py-24">
      <div className={`${left ? "md:order-1" : "md:order-2"}`}>
        <div
          className={`relative aspect-[4/5] w-full overflow-hidden border border-border transition-all duration-1000 ${
            shown ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16"
          }`}
        >
          <img
            src={step.img}
            alt={step.title}
            className="h-full w-full object-cover"
            style={{ opacity: gradeOpacity, filter: `grayscale(1) contrast(${1 + index * 0.05})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-ink via-ink/30 to-transparent" />
          <div className="absolute bottom-8 left-8 text-display text-6xl text-bone md:text-8xl">
            {step.year}
          </div>
        </div>
      </div>
      <div className={`${left ? "md:order-2" : "md:order-1"} flex items-center`}>
        <div
          className={`transition-all delay-200 duration-1000 ${
            shown ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="text-eyebrow text-ash">
            Step 0{index + 1} / 0{total}
          </div>
          <h3 className="mt-6 text-display text-[clamp(2.5rem,5vw,5rem)] text-bone">
            {step.title}
          </h3>
          <p className="mt-6 max-w-md text-lg text-bone/70">{step.note}</p>
          <div className="mt-8 flex items-center gap-4">
            <span className="block h-px w-16 bg-bone" />
            <Link
              to="/discography/$slug"
              params={{ slug: step.slug }}
              className="text-eyebrow text-bone transition-opacity hover:opacity-70"
            >
              Detail
            </Link>
          </div>
        </div>
      </div>
      {/* Node */}
      <div className="absolute left-0 top-24 hidden h-4 w-4 -translate-x-1/2 rotate-45 border border-bone bg-ink md:left-1/2 md:block" />
    </div>
  );
}

function Video() {
  return (
    <section className="relative bg-ink px-6 py-32 md:px-12 md:py-48">
      <div className="mx-auto max-w-[1600px]">
        <div className="text-eyebrow text-ash">04 — Visual</div>
        <h2 className="mt-6 text-display text-[clamp(3rem,7vw,7rem)] text-bone">In motion.</h2>
        <div className="mt-16 grid grid-cols-1 gap-10 md:grid-cols-5">
          <div className="relative aspect-video overflow-hidden border border-border md:col-span-3">
            <video
              autoPlay
              muted
              loop
              playsInline
              poster={fkboiAsset}
              className="h-full w-full object-cover grayscale"
            >
              <source
                src="https://cdn.coverr.co/videos/coverr-a-woman-singing-in-a-recording-studio-4949/1080p.mp4"
                type="video/mp4"
              />
            </video>
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent" />
            <div className="absolute bottom-6 left-6 text-eyebrow text-bone">
              Live Session — West Philly, 2024
            </div>
          </div>
          <div className="flex flex-col justify-between md:col-span-2">
            <p className="text-2xl leading-tight text-bone md:text-3xl">
              A recording booth, a heavy chain, and a voice that refuses to fold.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-6 text-bone">
              <Stat k="Since" v="2017" />
              <Stat k="Home" v="West Philly" />
              <Stat k="Genre" v="Neo-Soul" />
              <Stat k="Label" v="Independent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ k, v }: { k: string; v: string }) {
  return (
    <div className="border-t border-border pt-4">
      <div className="text-eyebrow text-ash">{k}</div>
      <div className="mt-2 text-display text-2xl text-bone md:text-3xl">{v}</div>
    </div>
  );
}

function Newsletter() {
  return (
    <section
      id="tour"
      className="relative overflow-hidden bg-bone px-6 py-32 text-ink md:px-12 md:py-48"
    >
      <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-16 md:grid-cols-12">
        <div className="md:col-span-7">
          <div className="text-eyebrow text-ink/60">05 — Direct Line</div>
          <h2 className="mt-6 text-display text-[clamp(3rem,9vw,10rem)] text-ink">
            First tickets.
            <br />
            <span className="italic">First drops.</span>
          </h2>
        </div>
        <form className="md:col-span-5 md:pt-16" onSubmit={(e) => e.preventDefault()}>
          <label className="text-eyebrow text-ink/60">Enter your email</label>{" "}
          <div className="mt-4 flex border-b border-ink pb-4">
            <input
              type="email"
              placeholder="you@somewhere.com"
              className="flex-1 bg-transparent text-2xl text-ink placeholder:text-ink/30 focus:outline-none"
            />
            <button className="text-eyebrow text-ink transition-opacity hover:opacity-60">
              Subscribe →
            </button>
          </div>
          <p className="mt-4 text-sm text-ink/60">No spam. Only the sound.</p>
        </form>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer id="shop" className="relative bg-ink px-6 py-16 md:px-12">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-10 border-t border-border pt-10 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="text-display text-6xl text-bone md:text-8xl">Adea Lyric</div>
          <div className="text-eyebrow mt-4 text-ash">West Philadelphia · Est. 2017</div>
        </div>
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {["Spotify", "Apple Music", "Instagram", "YouTube"].map((l) => (
            <a
              key={l}
              href="#"
              className="text-eyebrow text-bone/70 transition-colors hover:text-bone"
            >
              {l}
            </a>
          ))}
        </div>
      </div>
      <div className="mx-auto mt-10 flex max-w-[1600px] justify-between text-xs text-ash">
        <span>© {new Date().getFullYear()} Adea Lyric. All rights reserved.</span>
        <span>Sound of West Philly.</span>
      </div>
    </footer>
  );
}

/* Icons */
function PlayIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M8 5v14l11-7z" />
    </svg>
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

export function Landing() {
  return (
    <div className="relative w-full bg-ink text-bone">
      <Hero />
      <Marquee />
      <Bio />
      <SlidingCards />
      <DiscographyPath />
      <Video />
      <Newsletter />
    </div>
  );
}
