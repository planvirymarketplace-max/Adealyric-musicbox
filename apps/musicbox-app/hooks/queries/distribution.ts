import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type { DspAdapter, DeliveryRecord } from '@/types/database';

// ── Query keys ──
const keys = {
  adapters: ['distribution', 'dsp-adapters'] as const,
  adapter: (id: string) => ['distribution', 'dsp-adapters', id] as const,
  deliveries: (releaseId?: string, status?: string) => ['distribution', 'deliveries', releaseId, status] as const,
  delivery: (id: string) => ['distribution', 'delivery', id] as const,
  ddex: (releaseId: string) => ['distribution', 'ddex', releaseId] as const,
};

// ── DSP Adapters ──
export function useDspAdapters() {
  return useQuery<DspAdapter[]>({
    queryKey: keys.adapters,
    queryFn: () => apiClient.get<DspAdapter[]>('/api/distribution/dsp-adapters'),
  });
}

export function useCreateDspAdapter() {
  const qc = useQueryClient();
  return useMutation<DspAdapter, unknown, Partial<DspAdapter>>({
    mutationFn: (body) => apiClient.post<DspAdapter>('/api/distribution/dsp-adapters', body),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.adapters }),
  });
}

// ── Deliveries ──
export function useDeliveries(releaseId?: string, status?: string) {
  return useQuery<DeliveryRecord[]>({
    queryKey: keys.deliveries(releaseId, status),
    queryFn: () => apiClient.get<DeliveryRecord[]>('/api/distribution/deliveries', { releaseId, status }),
  });
}

export function useDelivery(id: string) {
  return useQuery<DeliveryRecord>({
    queryKey: keys.delivery(id),
    queryFn: () => apiClient.get<DeliveryRecord>(`/api/distribution/deliveries/${id}`),
    enabled: !!id,
  });
}

export function useQueueDelivery() {
  const qc = useQueryClient();
  return useMutation<DeliveryRecord, unknown, { releaseId: string; dspAdapterId: string }>({
    mutationFn: (body) => apiClient.post<DeliveryRecord>('/api/distribution/deliveries', body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['distribution', 'deliveries'] }),
  });
}

export function useRetryDelivery(id: string) {
  const qc = useQueryClient();
  return useMutation<DeliveryRecord, unknown, void>({
    mutationFn: () => apiClient.post<DeliveryRecord>(`/api/distribution/deliveries/${id}/retry`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.delivery(id) });
      qc.invalidateQueries({ queryKey: ['distribution', 'deliveries'] });
    },
  });
}

// ── DDEX XML ──
export function useDdexXml(releaseId: string) {
  return useQuery<{ xml: string }>({
    queryKey: keys.ddex(releaseId),
    queryFn: () => apiClient.get<{ xml: string }>(`/api/distribution/ddex/${releaseId}`),
    enabled: !!releaseId,
    staleTime: 10 * 60 * 1000, // DDEX XML rarely changes
  });
}
