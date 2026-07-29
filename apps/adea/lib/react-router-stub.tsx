"use client";

import { type ReactNode } from 'react';
import NextLink from 'next/link';
import { useRouter as useNextRouter, useParams as useNextParams, usePathname } from 'next/navigation';

export function Link({ to, children, className, onClick, ...props }: { to: string; children: ReactNode; className?: string; onClick?: () => void; [key: string]: unknown }) {
  return (
    <NextLink href={to} className={className} onClick={onClick} {...props}>
      {children}
    </NextLink>
  );
}

export function NavLink({ to, children, className, onClick, ...props }: { to: string; children: ReactNode; className?: string | ((args: { isActive: boolean }) => string); onClick?: () => void; [key: string]: unknown }) {
  const pathname = usePathname();
  const isActive = pathname === to;
  return (
    <NextLink href={to} className={typeof className === 'function' ? className({ isActive }) : className} onClick={onClick} {...props}>
      {children}
    </NextLink>
  );
}

export function Navigate({ to }: { to: string }) {
  const router = useNextRouter();
  if (typeof window !== 'undefined') {
    router.push(to);
  }
  return null;
}

export function useNavigate() {
  const router = useNextRouter();
  return (path: string) => {
    router.push(path);
  };
}

export function useLocation() {
  const pathname = usePathname();
  return { pathname };
}

export function useParams() {
  return useNextParams() || {};
}

export function Routes({ children }: { children: ReactNode }) { return <>{children}</>; }
export function Route({ element }: { element: ReactNode }) { return <>{element}</>; }
