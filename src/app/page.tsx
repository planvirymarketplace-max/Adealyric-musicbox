"use client";

import { useEffect } from "react";
import { useAppStore, type TabId } from "@/lib/store";
import { EntryGate } from "@/components/adea/EntryGate";
import { Landing } from "@/components/adea/Landing";
import { MusicPage, DiscographyPage, ReleaseDetailPage, TourPage } from "@/components/adea/MusicDiscography";
import { ShopPage, ProductDetailPage } from "@/components/adea/Shop";
import { BookingPage } from "@/components/adea/Booking";
import { BioPage, AccountPage } from "@/components/adea/BioAccount";

function HomePage() {
  return (
    <div className="relative w-full bg-ink text-bone">
      <Landing />
    </div>
  );
}

function TabContent({ tab }: { tab: TabId }) {
  switch (tab) {
    case "home":
      return <HomePage />;
    case "music":
      return <MusicPage />;
    case "discography":
      return <DiscographyPage />;
    case "shop":
      return <ShopPage />;
    case "tour":
      return <TourPage />;
    case "booking":
      return <BookingPage />;
    case "bio":
      return <BioPage />;
    case "account":
      return <AccountPage />;
    default:
      return <HomePage />;
  }
}

export default function Home() {
  const { entered, setEntered, activeTab, detailSlug, detailType } = useAppStore();

  useEffect(() => {
    // Scroll to top when tab changes
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeTab, detailSlug]);

  // If viewing a detail page, show that instead
  if (detailSlug && detailType === "release") {
    return <ReleaseDetailPage />;
  }
  if (detailSlug && detailType === "product") {
    return <ProductDetailPage />;
  }

  return (
    <>
      {!entered && <EntryGate onEnter={() => setEntered(true)} />}
      <TabContent tab={activeTab} />
    </>
  );
}
