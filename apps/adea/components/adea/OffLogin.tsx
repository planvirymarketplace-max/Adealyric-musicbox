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

/* ---- Login Page — Two-column editorial ---- */
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
    <div className="flex min-h-screen w-full flex-col md:flex-row">
      {/* Left — Dark editorial panel */}
      <div className="flex flex-1 items-center justify-center bg-ink px-8 py-20 md:px-16">
        <div className="max-w-xl">
          <div className="text-eyebrow text-ash">Admin</div>
          <h1 className="mt-6 text-display text-[clamp(3rem,8vw,9rem)] leading-[0.9] text-bone">
            Behind the
            <br />
            <span className="italic text-ash">sound.</span>
          </h1>
          <p className="mt-8 max-w-md text-lg leading-relaxed text-bone/70">
            Sync agents, catalog managers, and the inner team.
            This is where the business of the music lives.
          </p>
          <div className="mt-10 flex items-center gap-4">
            <span className="block h-px w-16 bg-bone/30" />
            <span className="text-eyebrow text-ash">Adea Lyric — Admin</span>
          </div>
        </div>
      </div>

      {/* Right — White login form */}
      <div className="flex flex-1 items-center justify-center bg-white px-8 py-20 md:px-16">
        <div className="w-full max-w-md">
          <div className="text-eyebrow text-ink/40">Secure Access</div>
          <h2 className="mt-4 text-display text-3xl text-ink md:text-4xl">
            Sign in
            <br />
            <span className="italic text-ink/50">to continue.</span>
          </h2>
          <p className="mt-6 text-base leading-relaxed text-ink/60">
            Enter your credentials to access the admin dashboard.
          </p>

          <form onSubmit={handleSubmit} className="mt-10">
            <div className="space-y-6">
              <div>
                <label className="text-eyebrow text-ink/40">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="mt-2 w-full border-b border-ink/20 bg-transparent px-0 py-3 text-lg text-ink placeholder:text-ink/30 focus:border-ink focus:outline-none"
                  placeholder="Enter username"
                  required
                />
              </div>
              <div>
                <label className="text-eyebrow text-ink/40">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-2 w-full border-b border-ink/20 bg-transparent px-0 py-3 text-lg text-ink placeholder:text-ink/30 focus:border-ink focus:outline-none"
                  placeholder="Enter password"
                  required
                />
              </div>
            </div>

            {error && (
              <p className="mt-6 text-sm text-red-500">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-8 w-full border border-ink bg-ink py-4 text-eyebrow text-bone transition-all hover:bg-ink/80 disabled:opacity-50 cursor-pointer"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <div className="mt-10 border-t border-ink/10 pt-6">
            <button
              onClick={() => setActiveTab("off")}
              className="text-sm text-ink/40 transition-colors hover:text-ink cursor-pointer"
            >
              ← Back to Off Page
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
