import { create } from "zustand";

export type TabId = "home" | "discography" | "shop" | "tour" | "booking" | "bio" | "account" | "off" | "login" | "admin" | "portal";

export interface AdminRoute {
  path: string;
  label: string;
}

export interface AppState {
  activeTab: TabId;
  entered: boolean;
  cartCount: number;
  detailSlug: string | null;
  detailType: "release" | "product" | "album" | null;
  shopSubPath: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  authUser: string | null;
  adminRoute: string;
  portalRoute: string;
  setActiveTab: (tab: TabId) => void;
  setEntered: (v: boolean) => void;
  setDetailSlug: (slug: string | null, type: "release" | "product" | "album" | null) => void;
  setShopSubPath: (path: string | null) => void;
  addToCart: () => void;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  setAdminRoute: (route: string) => void;
  setPortalRoute: (route: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  activeTab: "home",
  entered: false,
  cartCount: 0,
  detailSlug: null,
  detailType: null,
  shopSubPath: null,
  isAuthenticated: false,
  isAdmin: false,
  authUser: null,
  adminRoute: "/",
  portalRoute: "/portal",
  setActiveTab: (tab) => set({ activeTab: tab, detailSlug: null, detailType: null }),
  setEntered: (v) => set({ entered: v }),
  setDetailSlug: (slug, type) => set({ detailSlug: slug, detailType: type }),
  setShopSubPath: (path) => set({ shopSubPath: path }),
  addToCart: () => set((s) => ({ cartCount: s.cartCount + 1 })),
  login: (username, password) => {
    if (username === "admin" && password === "adminphilly") {
      set({ isAuthenticated: true, isAdmin: true, authUser: "admin" });
      return true;
    }
    return false;
  },
  logout: () => set({ isAuthenticated: false, isAdmin: false, authUser: null, activeTab: "login" }),
  setAdminRoute: (route) => set({ adminRoute: route }),
  setPortalRoute: (route) => set({ portalRoute: route }),
}));
