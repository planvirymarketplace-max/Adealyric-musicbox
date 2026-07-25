"use client";

import { useEffect, useRef, useState } from "react";
import { useAppStore, type TabId } from "@/lib/store";

const NAV: { label: string; id: TabId }[] = [
  { label: "Home", id: "home" },
  { label: "Discography", id: "discography" },
  { label: "Tour", id: "tour" },
  { label: "Booking", id: "booking" },
  { label: "Shop", id: "shop" },
  { label: "Bio", id: "bio" },
  { label: "Account", id: "account" },
];

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  const { activeTab, setActiveTab, cartCount } = useAppStore();

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 20);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  const prevTab = useRef(activeTab);
  useEffect(() => {
    if (prevTab.current !== activeTab) {
      setMenu(false);
      prevTab.current = activeTab;
    }
  }, [activeTab]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-40 transition-all duration-500 ${
          scrolled || activeTab !== "home"
            ? "border-b border-border bg-ink/80 backdrop-blur-xl"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-6 py-5 md:px-12">
          <button onClick={() => setActiveTab("home")} className="text-eyebrow text-bone cursor-pointer">
            Adea<span className="mx-2 text-ash">/</span>Lyric
          </button>
          <nav className="hidden items-center gap-10 md:flex">
            {NAV.map((n) => {
              const active = activeTab === n.id;
              return (
                <button key={n.id} onClick={() => setActiveTab(n.id)} className={`group relative text-eyebrow text-bone/70 transition-colors hover:text-bone cursor-pointer`}>
                  {n.label}
                  <span className={`absolute -bottom-1 left-0 h-px bg-bone transition-all duration-500 ${active ? "w-full" : "w-0 group-hover:w-full"}`} />
                </button>
              );
            })}
          </nav>
          <div className="flex items-center gap-6">
            <button onClick={() => setActiveTab("account")} className="hidden text-eyebrow text-bone md:inline-flex cursor-pointer">
              Cart / {cartCount}
            </button>
            <button className="grid h-10 w-10 place-items-center border border-border md:hidden cursor-pointer" onClick={() => setMenu((v) => !v)} aria-label="Menu">
              <div className="flex flex-col gap-1.5">
                <span className={`block h-px w-5 bg-bone transition-transform ${menu ? "translate-y-1 rotate-45" : ""}`} />
                <span className={`block h-px w-5 bg-bone transition-transform ${menu ? "-translate-y-1 -rotate-45" : ""}`} />
              </div>
            </button>
          </div>
        </div>
      </header>

      <div className={`fixed inset-0 z-30 bg-ink transition-all duration-500 md:hidden ${menu ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
        <nav className="flex h-full flex-col justify-center gap-8 px-8">
          {NAV.map((n, i) => (
            <button key={n.id} onClick={() => { setActiveTab(n.id); setMenu(false); }} className="text-display text-6xl text-bone cursor-pointer text-left" style={{ transitionDelay: `${i * 50}ms` }}>{n.label}</button>
          ))}
        </nav>
      </div>
    </>
  );
}

/* ---- Platform Icons ---- */
export function PlatformIcon({ name, className = "h-5 w-5" }: { name: string; className?: string }) {
  const icons: Record<string, React.ReactNode> = {
    spotify: <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" /></svg>,
    appleMusic: <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden><path d="M23.994 6.124a9.23 9.23 0 00-.24-2.19c-.317-1.31-1.062-2.31-2.18-3.043A5.022 5.022 0 0019.7.165a10.16 10.16 0 00-1.564-.073C17.2.06 16.26.038 15.32.02 13.953-.01 12.586.002 11.22.002 9.853.002 8.486-.01 7.12.02 6.18.038 5.24.06 4.3.088c-.44.013-.88.044-1.316.094C2.45.261 1.58.6.887 1.232.295 1.77 0 2.43 0 3.236c0 .626.01 1.252.02 1.878.01.757.024 1.514.022 2.27-.003 1.247.01 2.494.022 3.741.006.63.014 1.26.01 1.89-.006 1.15.017 2.299.083 3.447.036.617.165 1.218.406 1.791.453 1.093 1.228 1.878 2.287 2.38a5.39 5.39 0 002.23.494c.95.036 1.9.065 2.85.075 1.257.013 2.515.005 3.772.002 1.518-.003 3.036.004 4.553-.01.627-.006 1.253-.04 1.877-.085a5.663 5.663 0 002.396-.734c.92-.558 1.547-1.366 1.86-2.396.186-.607.262-1.235.283-1.87.024-.74.033-1.48.037-2.22.008-1.488.003-2.976-.001-4.463-.002-.857-.014-1.715-.02-2.572-.003-.477-.011-.954-.008-1.431.005-.793-.008-1.586-.026-2.378a10.357 10.357 0 00-.063-1.103zm-7.027 8.688c0 .283-.037.567-.125.838-.29.914-.98 1.518-1.87 1.724-.296.068-.6.095-.902.095-1.74.004-3.48.003-5.22.003-1.367 0-2.734-.002-4.1.003a5.05 5.05 0 01-.872-.073c-.903-.157-1.613-.69-2.006-1.527a2.856 2.856 0 01-.247-1.23V10.13c0-.248.025-.497.088-.738.31-1.17 1.124-1.824 2.28-2.032.28-.05.566-.068.852-.068 1.69-.004 3.38-.003 5.07-.003 1.4 0 2.8.002 4.2-.003.34.003.678.035 1.01.118.94.237 1.58.806 1.923 1.718.123.322.178.66.178 1.003v4.69z" /></svg>,
    tiktok: <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" /></svg>,
    instagram: <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden><path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678a6.162 6.162 0 100 12.324 6.162 6.162 0 100-12.324zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405a1.441 1.441 0 11-2.88 0 1.441 1.441 0 012.88 0z" /></svg>,
    amazonMusic: <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden><path d="M.045 18.02c.072-.116.187-.124.348-.022 3.636 2.11 7.594 3.166 11.876 3.166 2.853 0 5.67-.528 8.45-1.583l.315-.141c.277-.124.556-.048.836.225.282.27.297.549.048.835a1.594 1.594 0 01-.393.36c-2.7 1.628-5.667 2.44-8.893 2.44-3.09 0-5.928-.743-8.513-2.233C2.572 20.564.855 19.47.275 18.276a.528.528 0 01-.23-.256zm18.348-2.054c.072-.116.187-.124.348-.022.486.286.914.653 1.28 1.1.368.447.635.926.802 1.438.167.512.183 1.003.048 1.474-.135.471-.405.83-.81 1.078-.405.247-.856.363-1.354.346-.498-.017-.948-.17-1.35-.46-.402-.29-.667-.665-.795-1.127-.128-.461-.096-.94.096-1.435.191-.494.51-.902.956-1.224.445-.322.96-.527 1.543-.614.1-.015.187.004.258.056.07.052.086.12.046.203-.04.084-.115.135-.226.154-.856.164-1.525.531-2.008 1.103-.483.571-.635 1.2-.456 1.886.18.685.6 1.18 1.263 1.485.662.305 1.358.31 2.086.017.729-.294 1.168-.796 1.317-1.506.149-.71.045-1.394-.313-2.054-.357-.66-.855-1.193-1.493-1.596a.28.28 0 01-.1-.12.144.144 0 01.01-.142z" /></svg>,
    youtube: <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>,
    tidal: <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden><path d="M12.012 3.992L8.008 7.996 12.012 12l4.004-4.004zM4.004 7.996L0 12l4.004 4.004L8.008 12zm16.016 0L16.016 12l4.004 4.004L24.024 12zM12.012 12.008L8.008 16.012l4.004 4.004 4.004-4.004z" /></svg>,
    pandora: <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm-1.25 17.292c0 .518-.09.962-.27 1.332-.18.37-.432.662-.756.876a3.21 3.21 0 01-1.116.486 6.376 6.376 0 01-1.38.144c-.504 0-.978-.054-1.422-.162a4.363 4.363 0 01-1.152-.504l.612-1.278c.264.168.558.3.882.396.324.096.642.144.954.144.408 0 .732-.084.972-.252.24-.168.36-.42.36-.756v-8.82h1.314v8.394h.002zm6.732-1.746c0 .9-.168 1.662-.504 2.286-.336.624-.81 1.098-1.422 1.422-.612.324-1.338.486-2.178.486-.336 0-.672-.03-1.008-.09a5.406 5.406 0 01-.972-.282l.468-1.224c.228.108.474.198.738.27.264.072.534.108.81.108.528 0 .96-.126 1.296-.378.336-.252.582-.606.738-1.062.156-.456.234-.99.234-1.602V6.388h1.8v8.7l.002.458z" /></svg>,
  };
  return <>{icons[name] ?? null}</>;
}

const FOOTER_LINKS = [
  { heading: "Music", links: [{ label: "Discography", action: "discography" as TabId }, { label: "Latest Release", action: "discography" as TabId }, { label: "Streaming", external: true }] },
  { heading: "Shop", links: [{ label: "Merchandise", action: "shop" as TabId }, { label: "Vinyl & CDs", action: "shop" as TabId }, { label: "Checkout", action: "account" as TabId }] },
  { heading: "Connect", links: [{ label: "Tour Dates", action: "tour" as TabId }, { label: "Fan Portal", action: "account" as TabId }, { label: "Newsletter", action: "home" as TabId }] },
  { heading: "Industry", links: [{ label: "Sync Agents", external: true }, { label: "Writers Room", external: true }] },
];

const PLATFORMS = [
  { key: "spotify", label: "Spotify" },
  { key: "appleMusic", label: "Apple Music" },
  { key: "tiktok", label: "TikTok" },
  { key: "instagram", label: "Instagram" },
  { key: "amazonMusic", label: "Amazon Music" },
  { key: "youtube", label: "YouTube" },
  { key: "tidal", label: "Tidal" },
  { key: "pandora", label: "Pandora" },
];

const ALL_PLATFORMS = [...PLATFORMS, ...PLATFORMS, ...PLATFORMS, ...PLATFORMS];

export function SiteFooter() {
  const { setActiveTab } = useAppStore();
  const go = (action?: TabId) => { if (action) setActiveTab(action); };

  return (
    <footer className="relative bg-ink px-6 pt-20 pb-10 md:px-12 md:pt-28 md:pb-12">
      <div className="mx-auto max-w-[1600px]">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-16">
          <div className="md:col-span-5">
            <button onClick={() => go("home")} className="text-display text-5xl leading-none text-bone md:text-7xl cursor-pointer text-left">Adea Lyric</button>
            <p className="mt-6 max-w-md text-base leading-relaxed text-ash">The sound of West Philly. Singer, songwriter, and producer creating every record from the soul.</p>
          </div>
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-4 md:col-span-7">
            {FOOTER_LINKS.map((col) => (
              <div key={col.heading}>
                <div className="text-eyebrow mb-5 text-bone/50">{col.heading}</div>
                <ul className="flex flex-col gap-3">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <button onClick={() => go(link.action)} className="text-sm text-bone/70 transition-colors hover:text-bone cursor-pointer text-left">{link.label}</button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-16 border-t border-border md:mt-20" />
        <div className="mt-10 flex flex-col gap-8 md:mt-12">
          <div className="relative overflow-hidden py-2">
            <div className="footer-marquee-track flex w-max items-center gap-8">
              {ALL_PLATFORMS.map((p, i) => (
                <a key={`${p.key}-${i}`} href="#" onClick={(e) => e.preventDefault()} className="flex shrink-0 items-center gap-2 text-ash/60 transition-colors hover:text-bone" aria-label={p.label}>
                  <PlatformIcon name={p.key} className="h-4 w-4" />
                  <span className="whitespace-nowrap text-xs tracking-wide">{p.label}</span>
                </a>
              ))}
            </div>
          </div>
          <div className="flex flex-col items-start gap-1 text-xs text-ash/60 md:items-end md:text-right">
            <span>{"© "}{new Date().getFullYear()} Adea Lyric. All rights reserved.</span>
            <span>West Philadelphia · Est. 2017</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen w-full bg-ink text-bone">
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
    </div>
  );
}

export function PageIntro({ eyebrow, title, italic, sub }: { eyebrow: string; title: string; italic?: string; sub?: string }) {
  return (
    <section className="relative px-6 pb-16 pt-40 md:px-12 md:pb-24 md:pt-56">
      <div className="mx-auto max-w-[1600px]">
        <div className="text-eyebrow text-ash">{eyebrow}</div>
        <h1 className="mt-6 text-display text-[clamp(3.5rem,11vw,12rem)] text-bone">{title}{italic && <span className="block italic text-ash">{italic}</span>}</h1>
        {sub && <p className="mt-8 max-w-xl text-lg text-bone/70">{sub}</p>}
      </div>
    </section>
  );
}
