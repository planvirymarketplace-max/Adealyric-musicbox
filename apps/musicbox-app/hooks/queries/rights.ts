import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient, type PaginatedResponse } from '@/lib/api-client';
import type { RightsRecord, RoyaltySplit } from '@/types/database';

// ── Query keys ──
const keys = {
  records: (songId: string, rightsType?: string) => ['rights', 'records', songId, rightsType] as const,
  record: (id: string) => ['rights', 'record', id] as const,
  splits: (songId: string) => ['rights', 'splits', songId] as const,
  clearance: (songId: string) => ['rights', 'clearance', songId] as const,
  territoryMatrix: (songId: string) => ['rights', 'territory-matrix', songId] as const,
};

// ── Rights Records ──
export function useRightsRecords(songId: string, rightsType?: string) {
  return useQuery<RightsRecord[]>({
    queryKey: keys.records(songId, rightsType),
    queryFn: () => apiClient.get<RightsRecord[]>('/api/rights/records', { catalogSongId: songId, rightsType }),
    enabled: !!songId,
  });
}

export function useRightsRecord(id: string) {
  return useQuery<RightsRecord>({
    queryKey: keys.record(id),
    queryFn: () => apiClient.get<RightsRecord>(`/api/rights/records/${id}`),
    enabled: !!id,
  });
}

export function useCreateRightsRecord() {
  const qc = useQueryClient();
  return useMutation<RightsRecord, unknown, Partial<RightsRecord>>({
    mutationFn: (body) => apiClient.post<RightsRecord>('/api/rights/records', body),
    onSuccess: (_, body) => {
      if (body.catalogSongId) qc.invalidateQueries({ queryKey: ['rights', 'records', body.catalogSongId] });
      qc.invalidateQueries({ queryKey: ['rights', 'clearance'] });
    },
  });
}

export function useUpdateRightsRecord() {
  const qc = useQueryClient();
  return useMutation<RightsRecord, unknown, { id: string; data: Partial<RightsRecord> }>({
    mutationFn: ({ id, data }) => apiClient.put<RightsRecord>(`/api/rights/records/${id}`, data),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: keys.record(id) });
      qc.invalidateQueries({ queryKey: ['rights', 'records'] });
      qc.invalidateQueries({ queryKey: ['rights', 'clearance'] });
    },
  });
}

// ── Splits ──
export function useSplits(songId: string) {
  return useQuery<RoyaltySplit[]>({
    queryKey: keys.splits(songId),
    queryFn: () => apiClient.get<RoyaltySplit[]>('/api/rights/splits', { catalogSongId: songId }),
    enabled: !!songId,
  });
}

export function useCreateSplit() {
  const qc = useQueryClient();
  return useMutation<RoyaltySplit, unknown, Partial<RoyaltySplit>>({
    mutationFn: (body) => apiClient.post<RoyaltySplit>('/api/rights/splits', body),
    onSuccess: (_, body) => {
      if (body.catalogSongId) qc.invalidateQueries({ queryKey: keys.splits(body.catalogSongId) });
    },
  });
}

export function useUpdateSplit() {
  const qc = useQueryClient();
  return useMutation<RoyaltySplit, unknown, { id: string; data: Partial<RoyaltySplit> }>({
    mutationFn: ({ id, data }) => apiClient.put<RoyaltySplit>(`/api/rights/splits/${id}`, data),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: ['rights', 'splits'] });
      qc.invalidateQueries({ queryKey: ['rights', 'record'] }); // broad invalidate
    },
  });
}

// ── Clearance & Territory ──
export function useClearanceStatus(songId: string) {
  return useQuery<{ cleared: boolean; checks: RightsRecord[] }>({
    queryKey: keys.clearance(songId),
    queryFn: () => apiClient.get(`/api/rights/clearance/${songId}`),
    enabled: !!songId,
  });
}

export function useTerritoryMatrix(songId: string) {
  return useQuery<Record<string, Record<string, string>>>({
    queryKey: keys.territoryMatrix(songId),
    queryFn: () => apiClient.get(`/api/rights/territory-matrix/${songId}`),
    enabled: !!songId,
  });
}
