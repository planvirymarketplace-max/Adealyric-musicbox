'use client';
import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { apiClient } from '@/lib/api-client';

// Types
type PortalUser = {
  id: string;
  tenant_id: string;
  email: string;
  role: 'admin' | 'label' | 'booking' | 'writer';
  secondary_roles: string[];
  org_name: string | null;
  status: 'pending' | 'approved' | 'suspended' | 'rejected';
  display_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  bio: string | null;
  website: string | null;
  created_at?: string;
};

type SupaUser = {
  id: string;
  email: string;
  user_metadata: Record<string, unknown>;
};

/** Dev-mode flag: auto-approves all new signups so the Catch-22 (pending → no approval UI) is bypassed. */
const DEV_AUTO_APPROVE = true;

// Pre-seeded demo users — always approved
const MOCK_PORTAL_USERS: Record<string, PortalUser> = {
  'fan@test.com': {
    id: 'fan-1',
    tenant_id: 'tenant-1',
    email: 'fan@test.com',
    role: 'label' as 'label',
    secondary_roles: [],
    org_name: null,
    status: 'approved',
    display_name: 'Fan User',
    phone: null,
    avatar_url: null,
    bio: null,
    website: null,
    created_at: new Date().toISOString(),
  },
  'label@test.com': {
    id: 'label-1',
    tenant_id: 'tenant-1',
    email: 'label@test.com',
    role: 'label',
    secondary_roles: [],
    org_name: 'Sync Agency LLC',
    status: 'approved',
    display_name: 'Label Agent',
    phone: null,
    avatar_url: null,
    bio: null,
    website: null,
    created_at: new Date().toISOString(),
  },
  'booking@test.com': {
    id: 'booking-1',
    tenant_id: 'tenant-1',
    email: 'booking@test.com',
    role: 'booking',
    secondary_roles: [],
    org_name: 'Booking Co',
    status: 'approved',
    display_name: 'Booking Agent',
    phone: null,
    avatar_url: null,
    bio: null,
    website: null,
    created_at: new Date().toISOString(),
  },
  'writer@test.com': {
    id: 'writer-1',
    tenant_id: 'tenant-1',
    email: 'writer@test.com',
    role: 'writer',
    secondary_roles: [],
    org_name: null,
    status: 'approved',
    display_name: 'Writer Person',
    phone: null,
    avatar_url: null,
    bio: null,
    website: null,
    created_at: new Date().toISOString(),
  },
  'admin@test.com': {
    id: 'admin-1',
    tenant_id: 'tenant-1',
    email: 'admin@test.com',
    role: 'admin',
    secondary_roles: ['label', 'booking'],
    org_name: 'Adea Lyric HQ',
    status: 'approved',
    display_name: 'Admin User',
    phone: null,
    avatar_url: null,
    bio: null,
    website: null,
    created_at: new Date().toISOString(),
  },
};

/** All registered users — seeded from localStorage on init, merged with MOCK_PORTAL_USERS */
let _registeredUsers: Record<string, PortalUser> = {};

function loadRegisteredUsers(): Record<string, PortalUser> {
  try {
    const stored = localStorage.getItem('pro-registered-users');
    if (stored) _registeredUsers = JSON.parse(stored);
  } catch {}
  return _registeredUsers;
}

function saveRegisteredUsers(users: Record<string, PortalUser>) {
  _registeredUsers = users;
  localStorage.setItem('pro-registered-users', JSON.stringify(users));
}

/** Get all known users (demo + registered) */
function getAllUsers(): Record<string, PortalUser> {
  loadRegisteredUsers();
  return { ...MOCK_PORTAL_USERS, ..._registeredUsers };
}

/** Update a user's status (for admin approval/reject/suspend actions) */
function updateUserStatus(email: string, newStatus: PortalUser['status']): PortalUser | null {
  const all = getAllUsers();
  const user = all[email];
  if (!user) return null;
  const updated = { ...user, status: newStatus };
  // If it's a mock demo user, we can't change it in MOCK_PORTAL_USERS (const),
  // so store the override in _registeredUsers
  saveRegisteredUsers({ ..._registeredUsers, [email]: updated });
  return updated;
}

// ============ PORTAL AUTH (Fan) ============
interface PortalAuthContextValue {
  user: SupaUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, name?: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const PortalAuthContext = createContext<PortalAuthContextValue | undefined>(undefined);

export function PortalAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SupaUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('portal-auth-user');
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch {}
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    if (password.length < 4) return { error: 'Invalid credentials' };
    const u: SupaUser = { id: `fan-${Date.now()}`, email, user_metadata: { display_name: email.split('@')[0] } };
    setUser(u);
    localStorage.setItem('portal-auth-user', JSON.stringify(u));
    return { error: null };
  };

  const signUp = async (email: string, password: string, name?: string) => {
    if (password.length < 6) return { error: 'Password must be at least 6 characters' };
    const u: SupaUser = { id: `fan-${Date.now()}`, email, user_metadata: { display_name: name || email.split('@')[0] } };
    setUser(u);
    localStorage.setItem('portal-auth-user', JSON.stringify(u));
    return { error: null };
  };

  const signOut = async () => {
    setUser(null);
    localStorage.removeItem('portal-auth-user');
    apiClient.clearToken(); // Also clear any JWT token
  };

  return (
    <PortalAuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </PortalAuthContext.Provider>
  );
}

export function usePortalAuth() {
  const ctx = useContext(PortalAuthContext);
  if (!ctx) throw new Error('usePortalAuth must be used within PortalAuthProvider');
  return ctx;
}

// ============ PRO AUTH (Industry) ============
interface ProAuthContextValue {
  supaUser: SupaUser | null;
  portalUser: PortalUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, role: string, orgName: string, displayName: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const ProAuthContext = createContext<ProAuthContextValue | undefined>(undefined);

export function ProAuthProvider({ children }: { children: ReactNode }) {
  const [supaUser, setSupaUser] = useState<SupaUser | null>(null);
  const [portalUser, setPortalUser] = useState<PortalUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('pro-auth-session');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setSupaUser(parsed.supaUser);
        setPortalUser(parsed.portalUser);
      } catch {}
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    // Check ALL known users: demo mock users + previously registered users
    const allUsers = getAllUsers();
    const portalUser = allUsers[email];
    if (!portalUser) return { error: 'Invalid credentials — account not found' };
    if (password.length < 4) return { error: 'Invalid credentials' };

    const u: SupaUser = { id: portalUser.id, email, user_metadata: {} };
    setSupaUser(u);
    setPortalUser(portalUser);
    localStorage.setItem('pro-auth-session', JSON.stringify({ supaUser: u, portalUser }));
    return { error: null };
  };

  const signUp = async (email: string, password: string, role: string, orgName: string, displayName: string) => {
    if (password.length < 8) return { error: 'Password must be at least 8 characters' };
    const id = `pro-${Date.now()}`;
    // In dev mode, auto-approve so the Catch-22 is bypassed
    const initialStatus = DEV_AUTO_APPROVE ? 'approved' : 'pending';
    const newPortalUser: PortalUser = {
      id,
      tenant_id: 'tenant-1',
      email,
      role: role as PortalUser['role'],
      secondary_roles: [],
      org_name: orgName || null,
      status: initialStatus,
      display_name: displayName || null,
      phone: null,
      avatar_url: null,
      bio: null,
      website: null,
      created_at: new Date().toISOString(),
    };
    const u: SupaUser = { id, email, user_metadata: { display_name: displayName } };

    // Register the new user so signIn can find them next time
    saveRegisteredUsers({ ..._registeredUsers, [email]: newPortalUser });

    setSupaUser(u);
    setPortalUser(newPortalUser);
    localStorage.setItem('pro-auth-session', JSON.stringify({ supaUser: u, portalUser: newPortalUser }));
    return { error: null };
  };

  const signOut = async () => {
    setSupaUser(null);
    setPortalUser(null);
    localStorage.removeItem('pro-auth-session');
    apiClient.clearToken(); // Also clear any JWT token
  };

  return (
    <ProAuthContext.Provider value={{ supaUser, portalUser, loading, signIn, signUp, signOut }}>
      {children}
    </ProAuthContext.Provider>
  );
}

export function useProAuth() {
  const ctx = useContext(ProAuthContext);
  if (!ctx) throw new Error('useProAuth must be used within ProAuthProvider');
  return ctx;
}

// Export helpers for admin pages to use
export { getAllUsers, updateUserStatus, saveRegisteredUsers };
export type { PortalUser };
