import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";

const NAV = [
  { label: "Music", to: "/music" },
  { label: "Discography", to: "/discography" },
  { label: "Shop", to: "/shop" },
  { label: "Tour", to: "/tour" },
  { label: "Booking", to: "/booking" },
  { label: "Bio", to: "/bio" },
  { label: "Account", to: "/account" },
] as const;

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 20);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  useEffect(() => {
    setMenu(false);
  }, [path]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-40 transition-all duration-500 ${
          scrolled || path.length > 1
            ? "border-b border-border bg-ink/80 backdrop-blur-xl"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-6 py-5 md:px-12">
          <Link to="/" className="text-eyebrow text-bone">
            Adea<span className="mx-2 text-ash">/</span>Lyric
          </Link>
          <nav className="hidden items-center gap-10 md:flex">
            {NAV.map((n) => {
              const active = path === n.to || path.startsWith(n.to + "/");
              return (
                <Link
                  key={n.to}
                  to={n.to}
                  className="group relative text-eyebrow text-bone/70 transition-colors hover:text-bone"
                >
                  {n.label}
                  <span
                    className={`absolute -bottom-1 left-0 h-px bg-bone transition-all duration-500 ${
                      active ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </Link>
              );
            })}
          </nav>
          <div className="flex items-center gap-6">
            <Link to="/cart" className="hidden text-eyebrow text-bone md:inline-flex">
              Cart / 0
            </Link>
            <button
              className="grid h-10 w-10 place-items-center border border-border md:hidden"
              onClick={() => setMenu((v) => !v)}
              aria-label="Menu"
            >
              <div className="flex flex-col gap-1.5">
                <span
                  className={`block h-px w-5 bg-bone transition-transform ${menu ? "translate-y-1 rotate-45" : ""}`}
                />
                <span
                  className={`block h-px w-5 bg-bone transition-transform ${menu ? "-translate-y-1 -rotate-45" : ""}`}
                />
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <div
        className={`fixed inset-0 z-30 bg-ink transition-all duration-500 md:hidden ${menu ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      >
        <nav className="flex h-full flex-col justify-center gap-8 px-8">
          {NAV.map((n, i) => (
            <Link
              key={n.to}
              to={n.to}
              className="text-display text-6xl text-bone"
              style={{ transitionDelay: `${i * 50}ms` }}
            >
              {n.label}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}

export function SiteFooter() {
  return (
    <footer className="relative bg-ink px-6 py-16 md:px-12">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-10 border-t border-border pt-10 md:flex-row md:items-end md:justify-between">
        <div>
          <Link to="/" className="text-display text-6xl text-bone md:text-8xl">
            Adea Lyric
          </Link>
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
      <div className="mx-auto mt-10 flex max-w-[1600px] flex-col justify-between gap-2 text-xs text-ash md:flex-row">
        <span>© {new Date().getFullYear()} Adea Lyric. All rights reserved.</span>
        <span>Sound of West Philly.</span>
      </div>
    </footer>
  );
}

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen w-full bg-ink text-bone">
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
    </div>
  );
}

export function PageIntro({
  eyebrow,
  title,
  italic,
  sub,
}: {
  eyebrow: string;
  title: string;
  italic?: string;
  sub?: string;
}) {
  return (
    <section className="relative px-6 pb-16 pt-40 md:px-12 md:pb-24 md:pt-56">
      <div className="mx-auto max-w-[1600px]">
        <div className="text-eyebrow text-ash">{eyebrow}</div>
        <h1 className="mt-6 text-display text-[clamp(3.5rem,11vw,12rem)] text-bone">
          {title}
          {italic && <span className="block italic text-ash">{italic}</span>}
        </h1>
        {sub && <p className="mt-8 max-w-xl text-lg text-bone/70">{sub}</p>}
      </div>
    </section>
  );
}
