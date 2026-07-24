"use client";

import { type ReactNode } from 'react';

export function Link({ to, children, className, ...props }: { to: string; children: ReactNode; className?: string; [key: string]: unknown }) {
  return (
    <a href={to} className={className} onClick={(e) => { e.preventDefault(); }} {...props}>
      {children}
    </a>
  );
}

export function NavLink({ to, children, className, onClick, ...props }: { to: string; children: ReactNode; className?: string | ((args: { isActive: boolean }) => string); onClick?: () => void; [key: string]: unknown }) {
  return (
    <a href={to} className={typeof className === 'function' ? className({ isActive: false }) : className} onClick={(e) => { e.preventDefault(); onClick?.(); }} {...props}>
      {children}
    </a>
  );
}

export function Navigate({ to }: { to: string }) {
  return <a href={to} />;
}

export function useNavigate() {
  return (_path: string) => {};
}

export function useLocation() {
  return { pathname: '/' };
}

export function useParams() {
  return {};
}

export function Routes({ children }: { children: ReactNode }) { return <>{children}</>; }
export function Route({ element }: { element: ReactNode }) { return <>{element}</>; }
