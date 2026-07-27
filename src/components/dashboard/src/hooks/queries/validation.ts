import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type { ValidationCheck } from '@/types/database';

// ── Query keys ──
const keys = {
  checks: (releaseId: string) => ['validation', 'checks', releaseId] as const,
};

// ── Validation Checks ──
export function useValidationChecks(releaseId: string) {
  return useQuery<ValidationCheck[]>({
    queryKey: keys.checks(releaseId),
    queryFn: () => apiClient.get<ValidationCheck[]>('/api/validation/checks', { releaseId }),
    enabled: !!releaseId,
  });
}

// ── Run Validation (mutation) ──
export function useRunValidation(releaseId: string) {
  const qc = useQueryClient();
  return useMutation<ValidationCheck[], unknown, void>({
    mutationFn: () => apiClient.post<ValidationCheck[]>(`/api/validation/run/${releaseId}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.checks(releaseId) });
      qc.invalidateQueries({ queryKey: ['catalog', 'release', releaseId] });
    },
  });
}
