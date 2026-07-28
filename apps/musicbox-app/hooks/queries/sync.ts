import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type { SyncLicenseRequest, CatalogSong } from '@/types/database';

// ── Query keys ──
const keys = {
  search: (filters?: Record<string, unknown>) => ['sync', 'search', filters] as const,
  requests: (status?: string) => ['sync', 'requests', status] as const,
  request: (id: string) => ['sync', 'request', id] as const,
  contract: (id: string) => ['sync', 'contract', id] as const,
};

type SyncSearchResult = CatalogSong[];

// ── Sync Search ──
export function useSyncSearch(filters?: Record<string, unknown>) {
  return useQuery<SyncSearchResult>({
    queryKey: keys.search(filters),
    queryFn: () => apiClient.get<SyncSearchResult>('/api/sync/search', filters as Record<string, string | number | undefined>),
  });
}

// ── Sync Requests ──
export function useSyncRequests(status?: string) {
  return useQuery<SyncLicenseRequest[]>({
    queryKey: keys.requests(status),
    queryFn: () => apiClient.get<SyncLicenseRequest[]>('/api/sync/requests', { status }),
  });
}

export function useSyncRequest(id: string) {
  return useQuery<SyncLicenseRequest>({
    queryKey: keys.request(id),
    queryFn: () => apiClient.get<SyncLicenseRequest>(`/api/sync/requests/${id}`),
    enabled: !!id,
  });
}

export function useCreateSyncRequest() {
  const qc = useQueryClient();
  return useMutation<SyncLicenseRequest, unknown, Partial<SyncLicenseRequest>>({
    mutationFn: (body) => apiClient.post<SyncLicenseRequest>('/api/sync/requests', body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['sync', 'requests'] }),
  });
}

// ── Clearance ──
export function useProcessClearance(id: string) {
  const qc = useQueryClient();
  return useMutation<SyncLicenseRequest, unknown, { approved: boolean; feeCents?: number }>({
    mutationFn: (body) => apiClient.post<SyncLicenseRequest>(`/api/sync/requests/${id}/clearance`, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.request(id) });
      qc.invalidateQueries({ queryKey: ['sync', 'requests'] });
    },
  });
}

// ── Contract ──
export function useSyncContract(id: string) {
  return useQuery<{ contractHtml: string }>({
    queryKey: keys.contract(id),
    queryFn: () => apiClient.get<{ contractHtml: string }>(`/api/sync/requests/${id}/contract`),
    enabled: !!id,
  });
}

// ── Exclusivity Check ──
export function useExclusivityCheck() {
  return useMutation<{ exclusive: boolean; conflicts: string[] }, unknown, { songId: string; territory: string; termMonths: number }>({
    mutationFn: (body) => apiClient.post<{ exclusive: boolean; conflicts: string[] }>('/api/sync/exclusivity-check', body),
  });
}
