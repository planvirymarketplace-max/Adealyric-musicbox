"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

type Block =
  | { kind: "p"; text: string }
  | { kind: "break" }
  | { kind: "sign"; text: string };

const BLOCKS: Block[] = [
  { kind: "p", text: "To everyone who has ever pressed play, who has sat alone with my voice in their ears, or shouted a lyric back at me from a crowded room — thank you. To those who have been here since the first uncertain note, and to those just now finding their way to my door, I see you. I'm grateful for you. But even that word feels too small, too final, when what I mean is something still unfolding — something that continues to open me, piece by piece." },
  { kind: "p", text: "You are not just listeners. You are the reason I listen. You are why I sit at the piano at three in the morning when my hands are tired, my mind is clouded, and my heart feels heavy. You are why I stay when it would be easier to walk away. Why I return to a single line again and again until it finally breathes. Why I dig deeper than comfort allows to find something true enough to give." },
  { kind: "p", text: "Music has never been a career to me. It is not a title, or a way to pass time. It is the language I had before I had words for my own pain. It is the thread I have followed through every dark corridor of my life — the same thread that led me to you. I did not choose it because it was easy. I chose it because it was the only thing that ever made sense." },
  { kind: "p", text: "With that choice came a weight I am still learning to carry. Not a burden, but a responsibility. A knowing that what I create can live inside you — becoming part of your memories, your late nights, your heartbreaks, your joy. That is not something I take lightly." },
  { kind: "p", text: "This craft has taught me that inspiration may visit, but discipline stays. It has taught me to show up when I feel empty, to write through silence and compose through noise. It has asked me to be honest about who I am, even when that truth is uncomfortable. To sit with failure long enough to learn from it instead of letting it define me. To begin again, over and over, trusting that something meaningful will come." },
  { kind: "p", text: "And still, for everything it asks of me, music gives back more than I can measure. It lets me reach you across any distance. It lets me hold your hand through a song when I cannot be there in person. It gives voice to what I have been too afraid to say, transforming it into something we can carry together, something bearable, even beautiful." },
  { kind: "p", text: "That is the miracle I return to. The quiet truth I remind myself of before every stage: I am not performing for you. I am offering myself to you. Standing there, open and unguarded, saying — this is who I am. Take what you need." },
  { kind: "p", text: "I know the world will try to make this exchange feel small. It will push for speed, for sameness, for whatever shines brightest in the moment. It will offer shortcuts and call them success. But I have chosen something deeper than that. I will protect the integrity of my art from the pressure to be relevant, from the pull of easy approval, and from my own ego when it tells me I've done enough. It hasn't. My best is not fixed. It grows, stretches, and surprises me. And I will keep reaching for it." },
  { kind: "p", text: "I will remember where I come from — the people who raised me, the places that shaped me, the struggles that sharpened me. I will carry my community with me — not as a symbol, but as a living presence. Their stories will live in my verses. Their strength in my choruses. Their hope in every rhythm. I stand on foundations built by those who gave more than they had, and I will honor that by lifting others as I climb — opening doors and leaving them open." },
  { kind: "p", text: "And I will be honest with you, even when honesty is difficult. I will share my doubts, my fears, my failures — not because I have answers, but because I know you carry your own. I will not pretend to be above you. I am beside you. Walking the same uncertain road, asking the same questions, trying to make sense of it all." },
  { kind: "p", text: "So today, I offer this not as performance, but as promise — a covenant in the only language I know how to speak truthfully:" },
  { kind: "p", text: "I will give you my best, especially when it is hardest to do so." },
  { kind: "p", text: "I will remain a student for as long as I am able — learning, evolving, listening." },
  { kind: "p", text: "I will risk being misunderstood if it means being real. I will risk failure if it means I have tried fully." },
  { kind: "p", text: "I will protect every note, every lyric, and every silence between them from becoming hollow." },
  { kind: "p", text: "I will choose authenticity over approval, purpose over noise, again and again." },
  { kind: "p", text: "I will carry my community with me and leave this art form better than I found it." },
  { kind: "p", text: "And when the day comes that I can no longer make this music, I hope what remains is worthy of your trust. I hope the songs stand as something lasting — evidence of what we shared, of what we felt, of what it meant to be here, alive, at the same time." },
  { kind: "p", text: "I hope you know that I gave everything I had. That I never stopped caring. Never stopped trying. Never stopped believing that this — what we create together — matters." },
  { kind: "p", text: "This is my oath." },
  { kind: "p", text: "To the music. To the craft. To the gift I was given. To every soul who has found themselves in these songs." },
  { kind: "p", text: "I will honor it with every note, every word, every silence — for as long as I am given breath." },
  { kind: "break" },
  { kind: "p", text: "With gratitude," },
  { kind: "sign", text: "Adea Lyric" },
];

const BEAT = 12;
const RANGES = (() => {
  const out: { start: number; end: number; len: number }[] = [];
  let cursor = 0;
  for (const b of BLOCKS) {
    const len = b.kind === "break" ? BEAT : b.text.length;
    out.push({ start: cursor, end: cursor + len, len });
    cursor += len;
  }
  return { ranges: out, total: cursor };
})();

export function LetterToMyFans() {
  // Single ref wrapping the ENTIRE letter area (header + parchment + scroll space)
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(0);
  const currentRef = useRef(0);
  const mouseBonusRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  // Load Google Fonts
  useEffect(() => {
    const id = "letter-fonts";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=IM+Fell+English:ital@0;1&family=Special+Elite&display=swap";
    document.head.appendChild(link);
  }, []);

  useLayoutEffect(() => {
    const computeScrollTarget = () => {
      const el = wrapperRef.current;
      if (!el) return 0;
      const rect = el.getBoundingClientRect();
      const elHeight = el.scrollHeight;
      const viewable = window.innerHeight;
      // How far through the wrapper the user has scrolled (0..1)
      const scrolled = Math.max(
        0,
        Math.min(1, -rect.top / (elHeight - viewable))
      );
      return scrolled * RANGES.total;
    };

    const tick = () => {
      const scrollTarget = computeScrollTarget();
      const target = Math.max(
        scrollTarget + mouseBonusRef.current,
        currentRef.current
      );
      const delta = target - currentRef.current;
      if (Math.abs(delta) > 0.25) {
        currentRef.current += delta * 0.12;
        const next = Math.floor(currentRef.current);
        setRevealed((prev) => (prev !== next ? next : prev));
      } else if (currentRef.current !== target) {
        currentRef.current = target;
        setRevealed(Math.floor(target));
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    let lastX = 0;
    let lastY = 0;
    let primed = false;
    const onMouseMove = (e: MouseEvent) => {
      if (!primed) {
        lastX = e.clientX;
        lastY = e.clientY;
        primed = true;
        return;
      }
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;
      const dist = Math.hypot(dx, dy);
      mouseBonusRef.current = Math.min(
        mouseBonusRef.current + dist / 22,
        RANGES.total
      );
    };
    window.addEventListener("mousemove", onMouseMove, { passive: true });

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="relative bg-white"
      style={{ minHeight: "100vh" }}
    >
      {/* Header — white bg, dark text */}
      <div className="px-6 pt-24 pb-12 md:px-12 md:pt-32 md:pb-16">
        <div className="mx-auto max-w-3xl text-center">
          <div className="letter-header-eyebrow">02 — Letter</div>
          <h2 className="letter-heading mt-6">
            A Letter to My{" "}
            <span className="italic">Fans.</span>
          </h2>
          <p className="letter-sub mt-6">
            Scroll to read. Every word typed in real time — a covenant from
            Adea to the people who make the music matter.
          </p>
        </div>
      </div>

      {/* White parchment letter */}
      <div className="px-4 sm:px-8 md:px-0">
        <style>{letterStyles}</style>

        <div className="letter-frame">
          <article className="letter-sheet relative mx-auto max-w-3xl px-6 pt-20 pb-24 sm:px-16 sm:pt-24">
            <header className="mb-14 text-center">
              <p className="text-[10px] uppercase tracking-[0.5em] opacity-60">
                Philadelphia · PA
              </p>
              <h3 className="letter-title mt-5 text-4xl sm:text-5xl">
                A Letter to My Fans
              </h3>
              <div className="mt-6 flex items-center justify-center gap-3 text-xs opacity-70">
                <span className="h-px w-10 bg-current" />
                <span className="tracking-[0.3em] uppercase">
                  from Adea Lyric
                </span>
                <span className="h-px w-10 bg-current" />
              </div>
              <p className="scroll-hint mt-12 text-[10px] uppercase tracking-[0.4em] opacity-60">
                scroll ↓ to read
              </p>
            </header>

            <div className="letter-body">
              {BLOCKS.map((block, i) => (
                <BlockView
                  key={i}
                  block={block}
                  range={RANGES.ranges[i]}
                  revealed={revealed}
                />
              ))}
            </div>

            <footer className="mt-20 border-t border-current/20 pt-6 text-center text-[10px] uppercase tracking-[0.45em] opacity-60">
              Made in Philly · With love
            </footer>
          </article>
        </div>

        {/* Extra scroll space so user can reveal the full letter */}
        <div aria-hidden className="h-[60vh]" />
      </div>
    </div>
  );
}

function BlockView({
  block,
  range,
  revealed,
}: {
  block: Block;
  range: { start: number; end: number; len: number };
  revealed: number;
}) {
  const local = Math.max(0, Math.min(range.len, revealed - range.start));
  const isActive = revealed >= range.start && revealed < range.end;

  if (block.kind === "break") {
    return (
      <div
        className="my-8 flex items-center justify-center gap-3 text-xs opacity-50"
        style={{ opacity: revealed >= range.end ? 0.5 : isActive ? 0.35 : 0.15 }}
      >
        <span className="h-px w-8 bg-current" />
        <span>❦</span>
        <span className="h-px w-8 bg-current" />
      </div>
    );
  }

  const text = block.text;
  const shown = text.slice(0, local);
  const hidden = text.slice(local);

  const cls =
    block.kind === "sign"
      ? "signature mt-4 text-3xl sm:text-4xl"
      : "letter-p text-base sm:text-lg";

  return (
    <p className={cls} data-active={isActive || undefined}>
      <span>{shown}</span>
      {isActive && (
        <span className="typewriter-caret" aria-hidden>
          ▍
        </span>
      )}
      <span aria-hidden className="ghost">
        {hidden}
      </span>
    </p>
  );
}

const letterStyles = `
  .letter-header-eyebrow {
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    color: rgba(0,0,0,0.3);
  }
  .letter-heading {
    font-family: 'IM Fell English', serif;
    font-size: clamp(2.5rem, 7vw, 5.5rem);
    line-height: 0.95;
    color: #1a1a1a;
    letter-spacing: -0.01em;
  }
  .letter-sub {
    font-size: 1rem;
    line-height: 1.7;
    color: rgba(0,0,0,0.5);
    max-width: 32rem;
    margin-left: auto;
    margin-right: auto;
  }

  .letter-frame { position: relative; }

  .letter-sheet {
    background-color: #f8f7f4;
    background-image:
      radial-gradient(circle at 8% 12%, rgba(0,0,0,0.04), transparent 42%),
      radial-gradient(circle at 92% 82%, rgba(0,0,0,0.05), transparent 46%),
      radial-gradient(circle at 50% 55%, rgba(255,255,255,0.08), transparent 70%),
      repeating-linear-gradient(38deg, rgba(0,0,0,0.02) 0 2px, transparent 2px 7px),
      repeating-linear-gradient(-52deg, rgba(0,0,0,0.015) 0 1px, transparent 1px 9px);
    box-shadow:
      inset 0 0 80px rgba(0,0,0,0.06),
      inset 0 0 220px rgba(0,0,0,0.03),
      0 20px 60px rgba(0,0,0,0.08),
      0 4px 12px rgba(0,0,0,0.04);
    border: 1px solid rgba(0,0,0,0.08);
    border-radius: 2px;
    color: #1a1a1a;
    font-family: 'Special Elite', 'Courier New', ui-monospace, monospace;
  }
  .letter-sheet::before,
  .letter-sheet::after {
    content: "";
    position: absolute; left: 0; right: 0;
    height: 40px; pointer-events: none;
    background:
      radial-gradient(ellipse 60% 100% at 20% 100%, rgba(0,0,0,0.04), transparent 65%),
      radial-gradient(ellipse 70% 100% at 75% 100%, rgba(0,0,0,0.03), transparent 65%);
  }
  .letter-sheet::before { top: 0; transform: scaleY(-1); }
  .letter-sheet::after  { bottom: 0; }

  .letter-title {
    font-family: 'IM Fell English', 'Special Elite', serif;
    font-weight: 400;
    letter-spacing: 0.01em;
    color: #1a1a1a;
  }
  .signature {
    font-family: 'IM Fell English', serif;
    font-style: italic;
  }

  .letter-body .letter-p {
    line-height: 1.95;
    letter-spacing: 0.005em;
    margin: 0 0 1.6rem 0;
    text-shadow: 0 0 1px rgba(0,0,0,0.12);
  }
  .letter-body .letter-p .ghost,
  .letter-body .signature .ghost {
    opacity: 0;
  }

  .typewriter-caret {
    display: inline-block;
    margin: 0 1px;
    color: #1a1a1a;
    animation: caret-blink 0.85s steps(1) infinite;
  }
  @keyframes caret-blink {
    0%, 49% { opacity: 1; }
    50%, 100% { opacity: 0; }
  }

  .scroll-hint { animation: hint-bounce 2.2s ease-in-out infinite; }
  @keyframes hint-bounce {
    0%, 100% { transform: translateY(0); opacity: 0.6; }
    50%      { transform: translateY(6px); opacity: 1; }
  }
`;
