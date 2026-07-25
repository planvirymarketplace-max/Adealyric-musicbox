"use client";

import { useEffect, useState } from "react";
import { useAppStore } from "@/lib/store";
import { PageShell } from "./SiteChrome";

/* ---- Off Page ---- */
export function OffPage() {
  const { setActiveTab } = useAppStore();
  return (
    <PageShell>
      <section className="flex min-h-screen w-full flex-col">
        {/* Two-column full-bleed */}
        <div className="flex flex-1 flex-col md:flex-row">
          {/* Left — Headline */}
          <div className="flex flex-1 items-center justify-center bg-ink px-8 py-20 md:px-16">
            <div className="max-w-xl">
              <h1 className="text-display text-[clamp(3rem,8vw,9rem)] leading-[0.9] text-bone">
                West Philly
                <br />
                <span className="italic text-ash">in every</span>
                <br />
                note.
              </h1>
              <p className="mt-8 max-w-md text-lg leading-relaxed text-bone/70">
                Soul isn't a genre — it's where she's from.
                Adea Lyric carries the weight of every block, every corner,
                every late-night session that built the sound.
              </p>
              <div className="mt-10 flex items-center gap-4">
                <span className="block h-px w-16 bg-bone/30" />
                <span className="text-eyebrow text-ash">The Sound of West Philly</span>
              </div>
            </div>
          </div>

          {/* Right — Off Box */}
          <div className="flex flex-1 items-center justify-center bg-white px-8 py-20 md:px-16">
            <div className="w-full max-w-md">
              <div className="text-eyebrow text-ink/40">Exclusive</div>
              <h2 className="mt-4 text-display text-3xl text-ink md:text-4xl">
                Get off-the-record
                <br />
                <span className="italic text-ink/50">access.</span>
              </h2>
              <p className="mt-6 text-base leading-relaxed text-ink/60">
                Unreleased tracks, behind-the-scenes content, and first look at everything
                before it drops. Only for the inner circle.
              </p>
              <div className="mt-8">
                <label className="text-eyebrow text-ink/40">Your email</label>
                <div className="mt-3 flex border-b border-ink pb-4">
                  <input
                    type="email"
                    placeholder="you@somewhere.com"
                    className="flex-1 bg-transparent text-lg text-ink placeholder:text-ink/30 focus:outline-none"
                  />
                  <button className="text-eyebrow text-ink transition-opacity hover:opacity-60 cursor-pointer">
                    Join →
                  </button>
                </div>
              </div>
              <div className="mt-12 border-t border-ink/10 pt-6">
                <p className="text-sm text-ink/40">
                  If you are a sync agent,{' '}
                  <button
                    onClick={() => setActiveTab("login")}
                    className="text-ink underline underline-offset-4 transition-colors hover:text-ink/60 cursor-pointer"
                  >
                    click here to log in
                  </button>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

/* ---- Login Page ---- */
export function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, setActiveTab, isAuthenticated, isAdmin } = useAppStore();

  useEffect(() => {
    if (isAuthenticated && isAdmin) setActiveTab("admin");
  }, [isAuthenticated, isAdmin, setActiveTab]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setTimeout(() => {
      const success = login(username, password);
      setLoading(false);
      if (success) {
        setActiveTab("admin");
      } else {
        setError("Invalid credentials. Please try again.");
      }
    }, 500);
  };

  if (isAuthenticated && isAdmin) return null;

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-ink px-6">
      <div className="w-full max-w-sm">
        <div className="text-center">
          <div className="text-eyebrow text-ash">Adea Lyric</div>
          <h1 className="mt-6 text-display text-3xl text-bone">
            Sign in
          </h1>
          <p className="mt-3 text-sm text-ash">
            Sync agents & admin portal
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-10">
          <div className="space-y-6">
            <div>
              <label className="text-eyebrow text-ash">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-2 w-full border-b border-bone/20 bg-transparent px-0 py-3 text-bone placeholder:text-ash/30 focus:border-bone focus:outline-none"
                placeholder="Enter username"
                required
              />
            </div>
            <div>
              <label className="text-eyebrow text-ash">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 w-full border-b border-bone/20 bg-transparent px-0 py-3 text-bone placeholder:text-ash/30 focus:border-bone focus:outline-none"
                placeholder="Enter password"
                required
              />
            </div>
          </div>

          {error && (
            <p className="mt-6 text-center text-sm text-red-400">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-8 w-full border border-bone py-4 text-eyebrow text-bone transition-all hover:bg-bone hover:text-ink disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button
            onClick={() => setActiveTab("off")}
            className="text-sm text-ash transition-colors hover:text-bone cursor-pointer"
          >
            ← Back to Off Page
          </button>
        </div>
      </div>
    </div>
  );
}
