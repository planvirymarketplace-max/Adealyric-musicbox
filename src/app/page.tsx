"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useAppStore, type TabId } from "@/lib/store";
import { EntryGate } from "@/components/adea/EntryGate";
import { Landing } from "@/components/adea/Landing";
import { DiscographyPage, ReleaseDetailPage, TourPage } from "@/components/adea/MusicDiscography";
import { ShopPage, ProductDetailPage, AlbumDetailPage } from "@/components/adea/Shop";
import { BookingPage } from "@/components/adea/Booking";
import { BioPage, AccountPage } from "@/components/adea/BioAccount";
import { SiteHeader, SiteFooter } from "@/components/adea/SiteChrome";
import { OffPage, LoginPage } from "@/components/adea/OffLogin";

// Lazy load dashboard/portal to reduce initial bundle
const AdminPortal = dynamic(() => import("@/components/dashboard/AdminPortal").then(m => ({ default: m.AdminPortal })), { ssr: false });
const UserPortal = dynamic(() => import("@/components/portal/UserPortal").then(m => ({ default: m.UserPortal })), { ssr: false });

function TabContent({ tab }: { tab: TabId }) {
  switch (tab) {
    case "home":
      return <Landing />;
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
    case "off":
      return <OffPage />;
    case "login":
      return <LoginPage />;
    case "admin":
      return <AdminPortal />;
    case "portal":
      return <UserPortal />;
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
  if (detailSlug && detailType === "album") return <AlbumDetailPage />;

  // Login and dashboard pages render without the main site chrome
  if (activeTab === "login" || activeTab === "admin" || activeTab === "portal") {
    return <TabContent tab={activeTab} />;
  }

  const isHome = activeTab === "home";

  return (
    <div className="relative w-full bg-ink text-bone">
      {/* Splash gate */}
      {!entered && <EntryGate onEnter={() => setEntered(true)} onLogin={() => setActiveTab("login")} />}

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
