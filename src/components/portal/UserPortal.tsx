"use client";

import { useAppStore } from "@/lib/store";
import PortalApp from "./PortalApp";

export function UserPortal() {
  const { isAuthenticated } = useAppStore();
  // Portal is accessible without auth in our setup (uses stub data)
  return <PortalApp />;
}
