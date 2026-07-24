"use client";

import { useEffect, useRef, useState } from "react";

type Props = { onEnter: () => void };

function rand(seed: number) {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

const SHARDS = Array.from({ length: 48 }, (_, i) => {
  const angle = (i / 48) * Math.PI * 2;
  const dist = 20 + rand(i * 6) * 60;
  return {
    id: i,
    cx: 50 + Math.cos(angle) * (10 + rand(i * 6 + 1) * 8),
    cy: 50 + Math.sin(angle) * (10 + rand(i * 6 + 2) * 8),
    tx: Math.cos(angle) * dist,
    rot: (rand(i * 6 + 3) - 0.5) * 720,
    size: 8 + rand(i * 6 + 4) * 22,
    delay: rand(i * 6 + 5) * 0.15,
  };
});

const DROPS = Array.from({ length: 90 }, (_, i) => ({
  left: rand(i * 5) * 100,
  duration: 0.6 + rand(i * 5 + 1) * 1.2,
  delay: rand(i * 5 + 2) * 2,
  height: 40 + rand(i * 5 + 3) * 90,
  opacity: 0.15 + rand(i * 5 + 4) * 0.5,
}));

export function EntryGate({ onEnter }: Props) {
  const [shattering, setShattering] = useState(false);
  const [gone, setGone] = useState(false);
  const [cursor, setCursor] = useState({ x: 50, y: 50 });

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const trigger = () => {
    if (shattering) return;
    setShattering(true);
    setTimeout(() => setGone(true), 1400);
    setTimeout(() => onEnter(), 1600);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") trigger();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  if (gone) return null;

  return (
    <div
      className="fixed inset-0 z-[100] overflow-hidden bg-ink text-bone"
      onMouseMove={(e) => {
        setCursor({
          x: (e.clientX / window.innerWidth) * 100,
          y: (e.clientY / window.innerHeight) * 100,
        });
      }}
    >
      {/* Rain layer */}
      <div className="pointer-events-none absolute inset-0">
        {DROPS.map((d, i) => (
          <span
            key={i}
            className="absolute top-0 block w-px animate-rain bg-gradient-to-b from-transparent via-bone to-transparent"
            style={{
              left: `${d.left}%`,
              height: `${d.height}px`,
              animationDuration: `${d.duration}s`,
              animationDelay: `${d.delay}s`,
              opacity: d.opacity,
            }}
          />
        ))}
      </div>

      {/* Spotlight following cursor */}
      <div
        className="pointer-events-none absolute inset-0 opacity-70 transition-opacity duration-500"
        style={{
          background: `radial-gradient(600px circle at ${cursor.x}% ${cursor.y}%, oklch(0.25 0 0 / 0.9), transparent 60%)`,
          opacity: shattering ? 0 : 0.7,
        }}
      />

      {/* Center content */}
      <div
        className={`relative z-10 flex h-full flex-col items-center justify-center transition-all duration-700 ${shattering ? "scale-110 opacity-0" : "opacity-100"}`}
      >
        <div className="text-eyebrow text-ash animate-flicker">Est. West Philadelphia — MMXVII</div>
        <h1 className="text-display mt-6 text-center text-[clamp(4rem,18vw,20rem)] leading-none">
          <span className="block italic">Adea</span>
          <span className="-mt-6 block font-display font-black tracking-tighter">LYRIC</span>
        </h1>
        <div className="text-eyebrow mt-8 text-ash">Soul · Raw · Unapologetic</div>

        <button
          onClick={trigger}
          className="group mt-16 flex items-center gap-4 text-eyebrow text-bone transition-all hover:gap-8 cursor-pointer"
          aria-label="Enter site"
        >
          <span className="block h-px w-16 bg-bone transition-all group-hover:w-24" />
          <span>Enter</span>
          <span className="block h-px w-16 bg-bone transition-all group-hover:w-24" />
        </button>
      </div>

      {/* Shatter overlay */}
      {shattering && (
        <div className="pointer-events-none absolute inset-0 z-20">
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="absolute inset-0 h-full w-full"
          >
            <defs>
              <radialGradient id="crack" cx="50%" cy="50%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.9)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0)" />
              </radialGradient>
            </defs>
            {Array.from({ length: 24 }, (_, i) => {
              const a = (i / 24) * Math.PI * 2;
              const x2 = 50 + Math.cos(a) * 80;
              const y2 = 50 + Math.sin(a) * 80;
              const mx = 50 + Math.cos(a) * 20 + (rand(i * 2 + 100) - 0.5) * 6;
              const my = 50 + Math.sin(a) * 20 + (rand(i * 2 + 101) - 0.5) * 6;
              return (
                <path
                  key={i}
                  d={`M50 50 L${mx} ${my} L${x2} ${y2}`}
                  stroke="rgba(255,255,255,0.6)"
                  strokeWidth="0.08"
                  fill="none"
                  style={{ animation: `reveal-mask 0.4s ${i * 0.008}s both` }}
                />
              );
            })}
          </svg>
          {SHARDS.map((s) => (
            <span
              key={s.id}
              className="absolute block animate-shard bg-bone/90"
              style={{
                left: `${s.cx}%`,
                top: `${s.cy}%`,
                width: `${s.size}px`,
                height: `${s.size * 1.6}px`,
                clipPath: "polygon(20% 0%, 100% 30%, 80% 100%, 0% 70%)",
                ["--tx" as string]: `${s.tx}vw`,
                ["--rot" as string]: `${s.rot}deg`,
                animationDelay: `${s.delay}s`,
                boxShadow: "0 0 20px rgba(255,255,255,0.4)",
              }}
            />
          ))}
          {/* White flash */}
          <div
            className="absolute inset-0 bg-bone"
            style={{ animation: "flicker 0.2s 2 alternate" }}
          />
        </div>
      )}

      <div className="grain-overlay" />
    </div>
  );
}
