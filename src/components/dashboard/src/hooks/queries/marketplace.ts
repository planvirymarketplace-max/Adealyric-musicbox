import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type { CatalogSong, CollabCall } from '@/types/database';

// ── Types ──
type Listing = CatalogSong & { asking_price: number | null; asking_price_negotiable: boolean };
type Offer = { id: string; listingId: string; offerPrice: number; buyerName: string; status: string; message: string | null; createdAt: string };
type CustomWrite = { id: string; title: string; description: string; genre: string; budget: number; deadline: string; status: string };

// ── Query keys ──
const keys = {
  listings: (filters?: Record<string, unknown>) => ['marketplace', 'listings', filters] as const,
  listing: (id: string) => ['marketplace', 'listing', id] as const,
  offers: (listingId: string) => ['marketplace', 'offers', listingId] as const,
  customWrites: ['marketplace', 'custom-writes'] as const,
  collabCalls: ['marketplace', 'collab-calls'] as const,
};

// ── Listings ──
export function useListings(filters?: Record<string, unknown>) {
  return useQuery<Listing[]>({
    queryKey: keys.listings(filters),
    queryFn: () => apiClient.get<Listing[]>('/api/marketplace/listings', filters as Record<string, string | number | undefined>),
  });
}

export function useListing(id: string) {
  return useQuery<Listing>({
    queryKey: keys.listing(id),
    queryFn: () => apiClient.get<Listing>(`/api/marketplace/listings/${id}`),
    enabled: !!id,
  });
}

export function useSubmitForSale() {
  const qc = useQueryClient();
  return useMutation<Listing, unknown, { songId: string; askingPrice: number; negotiable: boolean }>({
    mutationFn: (body) => apiClient.post<Listing>('/api/marketplace/listings', body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['marketplace', 'listings'] }),
  });
}

// ── Offers ──
export function useOffers(listingId: string) {
  return useQuery<Offer[]>({
    queryKey: keys.offers(listingId),
    queryFn: () => apiClient.get<Offer[]>('/api/marketplace/offers', { listingId }),
    enabled: !!listingId,
  });
}

export function useMakeOffer() {
  const qc = useQueryClient();
  return useMutation<Offer, unknown, { listingId: string; offerPrice: number; message?: string }>({
    mutationFn: (body) => apiClient.post<Offer>('/api/marketplace/offers', body),
    onSuccess: (_, { listingId }) => qc.invalidateQueries({ queryKey: keys.offers(listingId) }),
  });
}

export function useProcessNegotiation() {
  const qc = useQueryClient();
  return useMutation<Offer, unknown, { offerId: string; action: 'accept' | 'counter' | 'reject'; counterPrice?: number }>({
    mutationFn: ({ offerId, action, counterPrice }) => apiClient.put<Offer>(`/api/marketplace/offers/${offerId}`, { action, counterPrice }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['marketplace'] }),
  });
}

export function useCompletePurchase() {
  const qc = useQueryClient();
  return useMutation<{ success: boolean }, unknown, { offerId: string }>({
    mutationFn: ({ offerId }) => apiClient.post(`/api/marketplace/offers/${offerId}/purchase`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['marketplace'] }),
  });
}

// ── Custom Writes ──
export function useCustomWrites() {
  return useQuery<CustomWrite[]>({
    queryKey: keys.customWrites,
    queryFn: () => apiClient.get<CustomWrite[]>('/api/marketplace/custom-writes'),
  });
}

export function useCreateCustomWrite() {
  const qc = useQueryClient();
  return useMutation<CustomWrite, unknown, Partial<CustomWrite>>({
    mutationFn: (body) => apiClient.post<CustomWrite>('/api/marketplace/custom-writes', body),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.customWrites }),
  });
}

// ── Collab Calls ──
export function useCollabCalls() {
  return useQuery<CollabCall[]>({
    queryKey: keys.collabCalls,
    queryFn: () => apiClient.get<CollabCall[]>('/api/marketplace/collab-calls'),
  });
}

export function useCreateCollabCall() {
  const qc = useQueryClient();
  return useMutation<CollabCall, unknown, Partial<CollabCall>>({
    mutationFn: (body) => apiClient.post<CollabCall>('/api/marketplace/collab-calls', body),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.collabCalls }),
  });
}

export function useApplyToCollabCall() {
  const qc = useQueryClient();
  return useMutation<{ success: boolean }, unknown, { collabCallId: string; proposal: string }>({
    mutationFn: (body) => apiClient.post('/api/marketplace/collab-calls', body),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.collabCalls }),
  });
}
