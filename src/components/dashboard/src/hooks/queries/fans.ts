import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type { Fan, LoyaltyTransaction } from '@/types/database';

// ── Types ──
type LoyaltyAction = { id: string; fanId: string; points: number; direction: 'earned' | 'spent'; reason: string; createdAt: string };

// ── Query keys ──
const keys = {
  fans: (artistId?: string) => ['fans', 'list', artistId] as const,
  fan: (id: string) => ['fans', 'detail', id] as const,
  loyaltyActions: (fanId: string) => ['fans', 'loyalty', fanId] as const,
};

// ── Fans ──
export function useFans(artistId?: string) {
  return useQuery<Fan[]>({
    queryKey: keys.fans(artistId),
    queryFn: () => apiClient.get<Fan[]>('/api/fans', { artistId }),
  });
}

export function useFan(id: string) {
  return useQuery<Fan>({
    queryKey: keys.fan(id),
    queryFn: () => apiClient.get<Fan>(`/api/fans/${id}`),
    enabled: !!id,
  });
}

// ── Loyalty Actions ──
export function useLoyaltyActions(fanId: string) {
  return useQuery<LoyaltyTransaction[]>({
    queryKey: keys.loyaltyActions(fanId),
    queryFn: () => apiClient.get<LoyaltyTransaction[]>(`/api/fans/${fanId}/loyalty`),
    enabled: !!fanId,
  });
}

// ── Record Loyalty Action ──
export function useRecordLoyaltyAction() {
  const qc = useQueryClient();
  return useMutation<LoyaltyTransaction, unknown, { fanId: string; points: number; reason: string; direction?: 'earned' | 'spent' }>({
    mutationFn: (body) => apiClient.post<LoyaltyTransaction>(`/api/fans/${body.fanId}/loyalty`, body),
    onSuccess: (_, { fanId }) => qc.invalidateQueries({ queryKey: keys.loyaltyActions(fanId) }),
  });
}
