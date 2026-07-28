import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type { TicketEvent, TicketTier, TicketOrder } from '@/types/database';

// ── Query keys ──
const keys = {
  events: (artistId?: string) => ['events', 'list', artistId] as const,
  event: (id: string) => ['events', 'detail', id] as const,
  ticketTiers: (eventId: string) => ['events', 'ticket-tiers', eventId] as const,
};

// ── Events ──
export function useEvents(artistId?: string) {
  return useQuery<TicketEvent[]>({
    queryKey: keys.events(artistId),
    queryFn: () => apiClient.get<TicketEvent[]>('/api/events', { artistId }),
  });
}

export function useEvent(id: string) {
  return useQuery<TicketEvent>({
    queryKey: keys.event(id),
    queryFn: () => apiClient.get<TicketEvent>(`/api/events/${id}`),
    enabled: !!id,
  });
}

export function useCreateEvent() {
  const qc = useQueryClient();
  return useMutation<TicketEvent, unknown, Partial<TicketEvent>>({
    mutationFn: (body) => apiClient.post<TicketEvent>('/api/events', body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['events'] }),
  });
}

// ── Ticket Tiers ──
export function useTicketTiers(eventId: string) {
  return useQuery<TicketTier[]>({
    queryKey: keys.ticketTiers(eventId),
    queryFn: () => apiClient.get<TicketTier[]>(`/api/events/${eventId}/ticket-tiers`),
    enabled: !!eventId,
  });
}

// ── Purchase Tickets ──
export function usePurchaseTickets() {
  const qc = useQueryClient();
  return useMutation<TicketOrder, unknown, { eventId: string; tierId: string; quantity: number; fanEmail: string; fanName?: string }>({
    mutationFn: (body) => apiClient.post<TicketOrder>(`/api/events/${body.eventId}/purchase`, body),
    onSuccess: (_, { eventId }) => {
      qc.invalidateQueries({ queryKey: keys.ticketTiers(eventId) });
      qc.invalidateQueries({ queryKey: keys.event(eventId) });
    },
  });
}
