import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type { RoyaltyStatement, RoyaltySplit } from '@/types/database';

// ── Types ──
type SplitPayment = { participantName: string; role: string; sharePct: number; amountCents: number };
type PerStreamRate = { dsp: string; rateCents: number; currency: string };
type MechanicalResult = { mechanicalRate: number; units: number; totalCents: number };
type RecoupmentResult = { advanceCents: number; recoupedCents: number; remainingCents: number; isFullyRecouped: boolean };

// ── Query keys ──
const keys = {
  statements: (artistId?: string) => ['royalties', 'statements', artistId] as const,
  statement: (id: string) => ['royalties', 'statement', id] as const,
  splitPayments: (songId: string) => ['royalties', 'split-payments', songId] as const,
  perStreamRate: (dsp: string) => ['royalties', 'per-stream', dsp] as const,
};

// ── Statements ──
export function useRoyaltyStatements(artistId?: string) {
  return useQuery<RoyaltyStatement[]>({
    queryKey: keys.statements(artistId),
    queryFn: () => apiClient.get<RoyaltyStatement[]>('/api/royalties/statements', { artistId }),
  });
}

export function useRoyaltyStatement(id: string) {
  return useQuery<RoyaltyStatement>({
    queryKey: keys.statement(id),
    queryFn: () => apiClient.get<RoyaltyStatement>(`/api/royalties/statements/${id}`),
    enabled: !!id,
  });
}

// ── Split Payments ──
export function useSplitPayments(songId: string) {
  return useQuery<SplitPayment[]>({
    queryKey: keys.splitPayments(songId),
    queryFn: () => apiClient.get<SplitPayment[]>(`/api/royalties/calculations/${songId}`),
    enabled: !!songId,
  });
}

// ── Per Stream Rate ──
export function usePerStreamRate(dsp: string) {
  return useQuery<PerStreamRate>({
    queryKey: keys.perStreamRate(dsp),
    queryFn: () => apiClient.get<PerStreamRate>(`/api/royalties/per-stream/${dsp}`),
    enabled: !!dsp,
  });
}

// ── Mechanical Royalty (mutation — calculate) ──
export function useMechanicalRoyalty() {
  return useMutation<MechanicalResult, unknown, { songId: string; units: number; rateType: string }>({
    mutationFn: (body) => apiClient.post<MechanicalResult>('/api/royalties/mechanical', body),
  });
}

// ── Recoupment (mutation — calculate) ──
export function useRecoupment() {
  return useMutation<RecoupmentResult, unknown, { artistId: string; periodStart: string; periodEnd: string }>({
    mutationFn: (body) => apiClient.post<RecoupmentResult>('/api/royalties/recoupment', body),
  });
}
