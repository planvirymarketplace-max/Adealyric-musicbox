'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, type ReactNode } from 'react';

/** Default QueryClient config for the music platform */
function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute — data is fresh for 60s
        gcTime: 5 * 60 * 1000, // 5 minutes — cache kept for 5min
        refetchOnWindowFocus: false,
        retry: (failureCount, error: any) => {
          // Never retry 401 or 403 — auth errors won't resolve by retrying
          if (error?.status === 401 || error?.status === 403) return false;
          // Retry up to 1 time for other errors (network flake, 503, etc.)
          return failureCount < 1;
        },
        throwOnError: false,
      },
      mutations: {
        retry: 0,
      },
    },
  });
}

/**
 * React Query provider — wrap root layout with this.
 * Creates a new QueryClient per mount to avoid shared state during SSR.
 */
export function QueryProvider({ children }: { children: ReactNode }) {
  const [client] = useState(createQueryClient);
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
