"use client";

import { type ReactNode, useCallback } from 'react';
import { useAppStore } from '@/lib/store';

export function Link({ to, children, className, onClick, ...props }: { to: string; children: ReactNode; className?: string; onClick?: () => void; [key: string]: unknown }) {
  const { setAdminRoute, setPortalRoute, activeTab } = useAppStore();
  const isPortal = activeTab === 'portal';
  const handleClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    if (isPortal) {
      setPortalRoute(to);
    } else {
      setAdminRoute(to);
    }
    onClick?.();
  }, [to, isPortal, setAdminRoute, setPortalRoute, onClick]);
  return (
    <a href={to} className={className} onClick={handleClick} {...props}>
      {children}
    </a>
  );
}

export function NavLink({ to, children, className, onClick, ...props }: { to: string; children: ReactNode; className?: string | ((args: { isActive: boolean }) => string); onClick?: () => void; [key: string]: unknown }) {
  const { setAdminRoute, setPortalRoute, activeTab, adminRoute, portalRoute } = useAppStore();
  const isPortal = activeTab === 'portal';
  const currentRoute = isPortal ? portalRoute : adminRoute;
  const isActive = currentRoute === to;
  const handleClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    if (isPortal) {
      setPortalRoute(to);
    } else {
      setAdminRoute(to);
    }
    onClick?.();
  }, [to, isPortal, setAdminRoute, setPortalRoute, onClick]);
  return (
    <a href={to} className={typeof className === 'function' ? className({ isActive }) : className} onClick={handleClick} {...props}>
      {children}
    </a>
  );
}

export function Navigate({ to }: { to: string }) {
  const { setAdminRoute, setPortalRoute, activeTab } = useAppStore();
  if (activeTab === 'portal') {
    setPortalRoute(to);
  } else {
    setAdminRoute(to);
  }
  return null;
}

export function useNavigate() {
  const { setAdminRoute, setPortalRoute, activeTab } = useAppStore();
  return (path: string) => {
    if (activeTab === 'portal') {
      setPortalRoute(path);
    } else {
      setAdminRoute(path);
    }
  };
}

export function useLocation() {
  const { adminRoute, portalRoute, activeTab } = useAppStore();
  return { pathname: activeTab === 'portal' ? portalRoute : adminRoute };
}

export function useParams() {
  return {};
}

export function Routes({ children }: { children: ReactNode }) { return <>{children}</>; }
export function Route({ element }: { element: ReactNode }) { return <>{element}</>; }
