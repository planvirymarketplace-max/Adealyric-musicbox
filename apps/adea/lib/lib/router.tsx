'use client';
import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';

interface RouterState {
  path: string;
  navigate: (to: string) => void;
  params: Record<string, string>;
}

const RouterContext = createContext<RouterState | undefined>(undefined);

export function useRouter() {
  const ctx = useContext(RouterContext);
  if (!ctx) {
    // SSR fallback — don't throw, return safe defaults
    if (typeof window === 'undefined') {
      return { path: '/', navigate: () => {}, params: {} as Record<string, string> };
    }
    throw new Error('useRouter must be used within RouterProvider');
  }
  return ctx;
}

export function RouterProvider({ children }: { children: ReactNode }) {
  const [path, setPath] = useState(() => {
    if (typeof window !== 'undefined') {
      // On initial load, convert URL pathname to hash path if no hash exists
      const currentHash = window.location.hash.slice(1);
      if (currentHash) return currentHash;
      
      // If no hash, check if the URL path is a known SPA route
      const urlPath = window.location.pathname;
      // Known SPA routes that should be converted to hash paths
      const SPA_ROUTES = ['/admin', '/portal', '/pro', '/writer', '/sync'];
      const isSpaRoute = SPA_ROUTES.some(r => urlPath.startsWith(r));
      if (isSpaRoute && urlPath !== '/') {
        // Convert the URL path to a hash path immediately
        const fullPath = urlPath + window.location.search;
        window.location.hash = fullPath;
        return fullPath;
      }
      return '/';
    }
    return '/';
  });

  const navigate = useCallback((to: string) => {
    window.location.hash = to;
    setPath(to);
  }, []);

  useEffect(() => {
    const handler = () => {
      const hash = window.location.hash.slice(1) || '/';
      setPath(hash);
    };
    window.addEventListener('hashchange', handler);
    return () => window.removeEventListener('hashchange', handler);
  }, []);

  // Parse params from path (e.g. /portal/music/abc123 -> { id: 'abc123' })
  const params: Record<string, string> = {};
  // Match dynamic segments like :id
  const pathMatch = path.match(/\/([^/]+)\/([^/]+)\/([^/]+)$/);
  if (pathMatch) {
    const [, , , lastSegment] = pathMatch;
    // If the last segment looks like an ID (not a known route keyword)
    if (lastSegment && !['music', 'events', 'albums', 'contacts', 'bookings'].includes(lastSegment)) {
      params.id = lastSegment;
    }
  }

  return (
    <RouterContext.Provider value={{ path, navigate, params }}>
      {children}
    </RouterContext.Provider>
  );
}

// Link component that works with hash routing
export function Link({ to, children, className, onClick }: { to: string; children: ReactNode; className?: string; onClick?: () => void }) {
  const { navigate } = useRouter();
  return (
    <a
      href={`#${to}`}
      className={className}
      onClick={(e) => {
        e.preventDefault();
        navigate(to);
        onClick?.();
      }}
    >
      {children}
    </a>
  );
}
