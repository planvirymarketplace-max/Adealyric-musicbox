import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession as useAuthSession } from '@musicbox/auth';

// Re-export TanStack Query hooks
export { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Re-export auth session hook
export { useSession as useAuthSession } from '@musicbox/auth';

// Audio playback hooks
// export { useAudioPlayer } from './useAudioPlayer';
// export { useOfflineLibrary } from './useOfflineLibrary';

// Collaborative lyrics hooks
// export { useCollaborativeLyrics } from './useCollaborativeLyrics';

// Tenant-aware hooks (wrapper around auth session)
export function useTenant() {
  const { session } = useAuthSession();
  return {
    organizationId: session.tenant?.id || null,
    organizationSlug: session.tenant?.slug || null,
    isLoading: session.isLoading,
  };
}

export function useSession() {
  return useAuthSession();
}

