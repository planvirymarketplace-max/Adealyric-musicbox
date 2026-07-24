import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { EntryGate } from "@/components/EntryGate";
import { Landing } from "@/components/Landing";
import { PageShell } from "@/components/SiteChrome";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Adea Lyric — The Sound of West Philly" },
      {
        name: "description",
        content:
          "Official home of Adea Lyric — raw, soulful, unapologetic. West Philadelphia's defining voice since 2017.",
      },
      { property: "og:title", content: "Adea Lyric — The Sound of West Philly" },
      { property: "og:description", content: "She isn't chasing a sound. She is the sound." },
    ],
  }),
  component: Index,
});

function Index() {
  const [entered, setEntered] = useState(false);
  const onEnter = () => {
    setEntered(true);
  };
  return (
    <>
      {!entered && <EntryGate onEnter={onEnter} />}
      <PageShell>
        <Landing />
      </PageShell>
    </>
  );
}
