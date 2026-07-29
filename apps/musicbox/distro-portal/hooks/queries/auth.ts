import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type { PortalUser } from '@/types/database';

// ── Response types ──
type LoginResponse = { user: { id: string; email: string; role: string; tenantId: string; displayName: string | null; orgName: string | null; status: string }; token: string };
type RegisterResponse = { user: PortalUser; token: string };
type SessionResponse = { user: { id: string; email: string; role: string; tenantId: string; displayName: string | null; orgName: string | null; status: string } };

// ── Query keys ──
const keys = {
  session: ['auth', 'session'] as const,
};

// ── Login mutation ──
export function useLogin() {
  const qc = useQueryClient();
  return useMutation<LoginResponse, unknown, { email: string; password: string; tenantId?: string }>({
    mutationFn: (body) => apiClient.post<LoginResponse>('/api/auth/login', body),
    onSuccess: (data) => {
      apiClient.setToken(data.token);
      qc.setQueryData(keys.session, { user: data.user });
      qc.invalidateQueries({ queryKey: keys.session });
    },
  });
}

// ── Register mutation ──
export function useRegister() {
  const qc = useQueryClient();
  return useMutation<RegisterResponse, unknown, { email: string; password: string; role: string; orgName?: string; displayName?: string }>({
    mutationFn: (body) => apiClient.post<RegisterResponse>('/api/auth/register', body),
    onSuccess: (data) => {
      if (data.token) apiClient.setToken(data.token);
      qc.invalidateQueries({ queryKey: keys.session });
    },
  });
}

// ── Session query ──
export function useSession() {
  return useQuery<SessionResponse>({
    queryKey: keys.session,
    queryFn: () => apiClient.get<SessionResponse>('/api/auth/session'),
    staleTime: 5 * 60 * 1000,
  });
}

// ── Logout mutation ──
export function useLogout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => apiClient.delete<void>('/api/auth/session'),
    onSuccess: () => {
      apiClient.clearToken();
      qc.removeQueries({ queryKey: keys.session });
      qc.clearQueries(); // Clear all cached data on logout
    },
  });
}

// ── Combined auth hook ──
export function useAuth() {
  const session = useSession();
  const login = useLogin();
  const logout = useLogout();
  const register = useRegister();

  return {
    user: session.data?.user ?? null,
    isLoading: session.isLoading,
    isAuthenticated: !!session.data?.user,
    login: login.mutateAsync,
    logout: logout.mutateAsync,
    register: register.mutateAsync,
    loginError: login.error,
    registerError: register.error,
  };
}
