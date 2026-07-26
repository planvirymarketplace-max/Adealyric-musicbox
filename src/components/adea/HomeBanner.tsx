"use client";

import { useEffect, useState, useCallback, useRef } from "react";

type Banner = {
  id: string;
  title: string;
  subtitle: string | null;
  imageUrl: string | null;
  ctaText: string | null;
  ctaLink: string | null;
  position: string;
  published: boolean;
  sortOrder: number;
};

export function HomeBanner() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [active, setActive] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/banners?published=true", { cache: "no-store" });
      if (!res.ok) return;
      const data = await res.json();
      setBanners(Array.isArray(data.banners) ? data.banners : []);
    } catch {
      setBanners([]);
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    if (banners.length <= 1) return;
    timerRef.current = setInterval(() => {
      setActive((p) => (p + 1) % banners.length);
    }, 5000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [banners.length]);

  useEffect(() => {
    if (active > banners.length - 1) setActive(0);
  }, [banners.length, active]);

  if (!loaded || banners.length === 0) return null;

  return (
    <section aria-label="Featured banners" className="relative w-full h-[60vh] min-h-[320px] overflow-hidden bg-ink">
      {banners.map((b, i) => (
        <div
          key={b.id}
          aria-hidden={i !== active}
          className={`absolute inset-0 transition-opacity duration-1000 ${i === active ? "opacity-100 z-10" : "opacity-0 z-0"}`}
        >
          {b.imageUrl ? (
            <img src={b.imageUrl} alt={b.title} className="absolute inset-0 h-full w-full object-cover" />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-mist to-ink" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-ink/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-ink/70 via-transparent to-ink/40" />
          <div className="absolute inset-0 z-10 flex items-end">
            <div className="mx-auto w-full max-w-[1600px] px-6 pb-16 md:px-12 md:pb-20">
              <div className="max-w-2xl">
                {b.subtitle && <p className="text-eyebrow text-ash mb-4">{b.subtitle}</p>}
                <h2 className="text-display text-bone text-[clamp(2rem,5vw,4.5rem)] leading-[0.95]">{b.title}</h2>
                {b.ctaText && (
                  <a
                    href={b.ctaLink || "#"}
                    target={b.ctaLink?.startsWith("http") ? "_blank" : undefined}
                    rel={b.ctaLink?.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="mt-8 inline-flex items-center gap-3 border border-bone px-6 py-3 text-eyebrow text-bone transition-all hover:bg-bone hover:text-ink cursor-pointer"
                  >
                    <span>{b.ctaText}</span>
                    <span>→</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
      {banners.length > 1 && (
        <div className="absolute bottom-6 left-0 right-0 z-20 flex items-center justify-center gap-2">
          {banners.map((b, i) => (
            <button
              key={b.id}
              type="button"
              aria-label={`Banner ${i + 1}: ${b.title}`}
              onClick={() => setActive(i)}
              className={`h-2 rounded-full transition-all duration-500 cursor-pointer ${i === active ? "w-8 bg-bone" : "w-2 bg-bone/40 hover:bg-bone/70"}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
