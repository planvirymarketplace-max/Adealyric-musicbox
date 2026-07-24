"use client";

import { useEffect, useState } from "react";

type Props = { onEnter: () => void; onLogin: () => void };

function rand(seed: number) {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

const SHARDS = Array.from({ length: 48 }, (_, i) => {
  const angle = (i / 48) * Math.PI * 2;
  const dist = Math.round((20 + rand(i * 6) * 60) * 100) / 100;
  return {
    id: i,
    cx: Math.round((50 + Math.cos(angle) * (10 + rand(i * 6 + 1) * 8)) * 100) / 100,
    cy: Math.round((50 + Math.sin(angle) * (10 + rand(i * 6 + 2) * 8)) * 100) / 100,
    tx: Math.round(Math.cos(angle) * dist * 100) / 100,
    rot: Math.round((rand(i * 6 + 3) - 0.5) * 720 * 100) / 100,
    size: Math.round((8 + rand(i * 6 + 4) * 22) * 10) / 10,
    delay: Math.round(rand(i * 6 + 5) * 0.15 * 1000) / 1000,
  };
});

const DROPS = Array.from({ length: 90 }, (_, i) => ({
  left: Math.round(rand(i * 5) * 10000) / 100,
  duration: Math.round((0.6 + rand(i * 5 + 1) * 1.2) * 1000) / 1000,
  delay: Math.round(rand(i * 5 + 2) * 2000) / 1000,
  height: Math.round((40 + rand(i * 5 + 3) * 90) * 10) / 10,
  opacity: Math.round((0.15 + rand(i * 5 + 4) * 0.5) * 1000) / 1000,
}));

export function EntryGate({ onEnter, onLogin }: Props) {
  const [shattering, setShattering] = useState(false);
  const [gone, setGone] = useState(false);

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
    <div className="fixed inset-0 z-[100] overflow-hidden bg-ink text-bone">
      {/* Rain layer */}
      <div className="pointer-events-none absolute inset-0">
        {DROPS.map((d, i) => (
          <span
            key={i}
            className="absolute top-0 block w-px animate-rain bg-gradient-to-b from-transparent via-bone/40 to-transparent"
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

      {/* Center content */}
      <div
        className={`relative z-10 flex h-full flex-col items-center justify-center transition-all duration-700 ${shattering ? "scale-110 opacity-0" : "opacity-100"}`}
      >
        <div className="text-eyebrow text-ash/60 animate-flicker">Est. West Philadelphia — MMXVII</div>

        {/* Main logo area: text + silhouette */}
        <div className="relative mt-8 flex items-center justify-center gap-2 sm:gap-4 md:gap-6">
          {/* ADEA text */}
          <h1 className="text-display text-center text-[clamp(3.5rem,14vw,16rem)] leading-none">
            <span className="block italic">Adea</span>
            <span className="-mt-4 block font-display font-black tracking-tighter">LYRIC</span>
          </h1>

          {/* Silhouette */}
          <svg
            viewBox="0 0 120 340"
            fill="currentColor"
            className="h-[clamp(4rem,16vw,18rem)] w-auto text-bone/80"
            aria-hidden="true"
          >
            <path d="M60 8C53.4 8 48 13.4 48 20C48 26.6 53.4 32 60 32C66.6 32 72 26.6 72 20C72 13.4 66.6 8 60 8Z
              M70 36C67 35 63 34 60 34C57 34 53 35 50 36L42 68L48 70L54 50L54 110L44 112L44 124L56 124L56 200L50 260L48 300L60 304L72 300L70 260L64 200L64 124L76 124L76 112L66 110L66 50L72 70L78 68Z" />
          </svg>
        </div>

        <div className="text-eyebrow mt-6 text-ash/50">Soul · Raw · Unapologetic</div>

        {/* Buttons row */}
        <div className="mt-10 flex items-center gap-4">
          <button
            onClick={trigger}
            className="group relative flex h-11 w-28 items-center justify-center border border-bone/40 text-eyebrow text-bone/90 transition-all duration-300 hover:border-bone/80 hover:text-bone cursor-pointer"
            aria-label="Enter site"
          >
            <span className="tracking-[0.3em]">ENTER</span>
          </button>
          <button
            onClick={onLogin}
            className="group relative flex h-11 w-28 items-center justify-center border border-bone/40 text-eyebrow text-bone/90 transition-all duration-300 hover:border-bone/80 hover:text-bone cursor-pointer"
            aria-label="Login"
          >
            <span className="tracking-[0.3em]">LOGIN</span>
          </button>
        </div>
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
