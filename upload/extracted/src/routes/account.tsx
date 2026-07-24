import { createFileRoute } from "@tanstack/react-router";
import { PageShell, PageIntro } from "@/components/SiteChrome";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [
      { title: "Account — Adea Lyric" },
      {
        name: "description",
        content: "Fan portal. Download purchased hi-fi audio and track shipments.",
      },
      { property: "og:title", content: "Account — Adea Lyric" },
      { property: "og:description", content: "Your fan portal." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AccountPage,
});

function AccountPage() {
  return (
    <PageShell>
      <PageIntro eyebrow="Fan Portal" title="Sign in." />
      <section className="px-6 pb-32 md:px-12">
        <div className="mx-auto max-w-md">
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="text-eyebrow text-ash">Email</label>
              <input
                type="email"
                className="mt-2 w-full border-b border-border bg-transparent py-3 text-bone focus:border-bone focus:outline-none"
              />
            </div>
            <div>
              <label className="text-eyebrow text-ash">Password</label>
              <input
                type="password"
                className="mt-2 w-full border-b border-border bg-transparent py-3 text-bone focus:border-bone focus:outline-none"
              />
            </div>
            <button className="flex w-full items-center justify-between border border-bone px-6 py-4 text-eyebrow text-bone transition-all hover:bg-bone hover:text-ink">
              <span>Sign in</span>
              <span>→</span>
            </button>
            <p className="text-center text-sm text-ash">Fan portal coming online soon.</p>
          </form>
        </div>
      </section>
    </PageShell>
  );
}
