'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface SessionUser {
  id: string;
  email: string;
  name?: string;
  avatarUrl?: string;
}

export interface SessionTenant {
  id: string;
  name: string;
  slug: string;
  type: string;
}

export interface SessionRole {
  id: string;
  name: string;
  permissions: string[];
}

export interface Session {
  user: SessionUser | null;
  tenant: SessionTenant | null;
  role: SessionRole | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface SessionContextValue {
  session: Session;
  setSession: (session: Partial<Session>) => void;
  clearSession: () => void;
}

const SessionContext = createContext<SessionContextValue | undefined>(undefined);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [session, setSessionState] = useState<Session>({
    user: null,
    tenant: null,
    role: null,
    isLoading: true,
    isAuthenticated: false,
  });

  useEffect(() => {
    // Load session from localStorage on mount
    const storedSession = localStorage.getItem('musicbox_session');
    if (storedSession) {
      try {
        const parsed = JSON.parse(storedSession);
        setSessionState({
          ...parsed,
          isLoading: false,
          isAuthenticated: !!parsed.user,
        });
      } catch (e) {
        console.error('Failed to parse session:', e);
        setSessionState((prev) => ({ ...prev, isLoading: false }));
      }
    } else {
      setSessionState((prev) => ({ ...prev, isLoading: false }));
    }
  }, []);

  const setSession = (partialSession: Partial<Session>) => {
    const newSession = { ...session, ...partialSession };
    setSessionState(newSession);
    
    // Persist to localStorage
    if (partialSession.user || partialSession.tenant) {
      localStorage.setItem('musicbox_session', JSON.stringify(newSession));
    }
  };

  const clearSession = () => {
    const clearedSession = {
      user: null,
      tenant: null,
      role: null,
      isLoading: false,
      isAuthenticated: false,
    };
    setSessionState(clearedSession);
    localStorage.removeItem('musicbox_session');
  };

  return (
    <SessionContext.Provider value={{ session, setSession, clearSession }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
}
