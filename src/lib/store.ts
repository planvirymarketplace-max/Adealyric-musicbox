import { create } from "zustand";

export type TabId = "home" | "music" | "discography" | "shop" | "tour" | "booking" | "bio" | "account";

export interface AppState {
  activeTab: TabId;
  entered: boolean;
  cartCount: number;
  detailSlug: string | null;
  detailType: "release" | "product" | null;
  setActiveTab: (tab: TabId) => void;
  setEntered: (v: boolean) => void;
  setDetailSlug: (slug: string | null, type: "release" | "product" | null) => void;
  addToCart: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  activeTab: "home",
  entered: false,
  cartCount: 0,
  detailSlug: null,
  detailType: null,
  setActiveTab: (tab) => set({ activeTab: tab, detailSlug: null, detailType: null }),
  setEntered: (v) => set({ entered: v }),
  setDetailSlug: (slug, type) => set({ detailSlug: slug, detailType: type }),
  addToCart: () => set((s) => ({ cartCount: s.cartCount + 1 })),
}));
