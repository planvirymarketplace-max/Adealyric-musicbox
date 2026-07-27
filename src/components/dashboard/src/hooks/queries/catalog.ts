import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient, type PaginatedResponse } from '@/lib/api-client';
import type { CatalogSong, Release } from '@/types/database';

// ── Query keys ──
const keys = {
  songs: (filters?: Record<string, unknown>) => ['catalog', 'songs', filters] as const,
  song: (id: string) => ['catalog', 'song', id] as const,
  releases: (filters?: Record<string, unknown>) => ['catalog', 'releases', filters] as const,
  release: (id: string) => ['catalog', 'release', id] as const,
};

// ── Songs ──
export function useSongs(filters?: Record<string, unknown>) {
  return useQuery<PaginatedResponse<CatalogSong>>({
    queryKey: keys.songs(filters),
    queryFn: () => apiClient.get<PaginatedResponse<CatalogSong>>('/api/catalog/songs', filters as Record<string, string | number | undefined>),
  });
}

export function useSong(id: string) {
  return useQuery<CatalogSong>({
    queryKey: keys.song(id),
    queryFn: () => apiClient.get<CatalogSong>(`/api/catalog/songs/${id}`),
    enabled: !!id,
  });
}

export function useCreateSong() {
  const qc = useQueryClient();
  return useMutation<CatalogSong, unknown, Partial<CatalogSong>>({
    mutationFn: (body) => apiClient.post<CatalogSong>('/api/catalog/songs', body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['catalog', 'songs'] }),
  });
}

export function useUpdateSong() {
  const qc = useQueryClient();
  return useMutation<CatalogSong, unknown, { id: string; data: Partial<CatalogSong> }>({
    mutationFn: ({ id, data }) => apiClient.put<CatalogSong>(`/api/catalog/songs/${id}`, data),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: keys.song(id) });
      qc.invalidateQueries({ queryKey: ['catalog', 'songs'] });
    },
  });
}

export function useDeleteSong() {
  const qc = useQueryClient();
  return useMutation<void, unknown, string>({
    mutationFn: (id) => apiClient.delete(`/api/catalog/songs/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['catalog', 'songs'] }),
  });
}

// ── Releases ──
export function useReleases(filters?: Record<string, unknown>) {
  return useQuery<PaginatedResponse<Release>>({
    queryKey: keys.releases(filters),
    queryFn: () => apiClient.get<PaginatedResponse<Release>>('/api/catalog/releases', filters as Record<string, string | number | undefined>),
  });
}

export function useRelease(id: string) {
  return useQuery<Release>({
    queryKey: keys.release(id),
    queryFn: () => apiClient.get<Release>(`/api/catalog/releases/${id}`),
    enabled: !!id,
  });
}

export function useCreateRelease() {
  const qc = useQueryClient();
  return useMutation<Release, unknown, Partial<Release>>({
    mutationFn: (body) => apiClient.post<Release>('/api/catalog/releases', body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['catalog', 'releases'] }),
  });
}

export function useUpdateRelease() {
  const qc = useQueryClient();
  return useMutation<Release, unknown, { id: string; data: Partial<Release> }>({
    mutationFn: ({ id, data }) => apiClient.put<Release>(`/api/catalog/releases/${id}`, data),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: keys.release(id) });
      qc.invalidateQueries({ queryKey: ['catalog', 'releases'] });
    },
  });
}

export function useValidateRelease(id: string) {
  const qc = useQueryClient();
  return useMutation<unknown, unknown, string>({
    mutationFn: () => apiClient.post(`/api/catalog/releases/${id}/validate`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.release(id) });
      qc.invalidateQueries({ queryKey: ['validation'] });
    },
  });
}
