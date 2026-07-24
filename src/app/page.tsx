"use client";

import { useEffect } from "react";
import { useAppStore, type TabId } from "@/lib/store";
import { EntryGate } from "@/components/adea/EntryGate";
import { Landing } from "@/components/adea/Landing";
import { MusicPage, DiscographyPage, ReleaseDetailPage, TourPage } from "@/components/adea/MusicDiscography";
import { ShopPage, ProductDetailPage } from "@/components/adea/Shop";
import { BookingPage } from "@/components/adea/Booking";
import { BioPage, AccountPage } from "@/components/adea/BioAccount";
import { SiteHeader, SiteFooter } from "@/components/adea/SiteChrome";

function TabContent({ tab }: { tab: TabId }) {
  switch (tab) {
    case "home":
      return <Landing />;
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
      return <Landing />;
  }
}

export default function Home() {
  const { entered, setEntered, activeTab, detailSlug, detailType } = useAppStore();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeTab, detailSlug]);

  // Detail pages have their own full shell
  if (detailSlug && detailType === "release") return <ReleaseDetailPage />;
  if (detailSlug && detailType === "product") return <ProductDetailPage />;

  const isHome = activeTab === "home";

  return (
    <div className="relative w-full bg-ink text-bone">
      {/* Splash gate */}
      {!entered && <EntryGate onEnter={() => setEntered(true)} onLogin={() => {}} />}

      {/* After entering: show nav + content + footer */}
      {entered && (
        <>
          <SiteHeader />
          {isHome ? (
            <main><TabContent tab={activeTab} /></main>
          ) : (
            <TabContent tab={activeTab} />
          )}
          <SiteFooter />
        </>
      )}
    </div>
  );
}
