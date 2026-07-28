import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type { Booking, BookingInquiry } from '@/types/database';

// ── Query keys ──
const keys = {
  inquiries: (artistId?: string) => ['bookings', 'inquiries', artistId] as const,
  inquiry: (id: string) => ['bookings', 'inquiry', id] as const,
  bookings: (artistId?: string) => ['bookings', 'list', artistId] as const,
  booking: (id: string) => ['bookings', 'detail', id] as const,
};

// ── Inquiries ──
export function useBookingInquiries(artistId?: string) {
  return useQuery<BookingInquiry[]>({
    queryKey: keys.inquiries(artistId),
    queryFn: () => apiClient.get<BookingInquiry[]>('/api/bookings/inquiries', { artistId }),
  });
}

export function useBookingInquiry(id: string) {
  return useQuery<BookingInquiry>({
    queryKey: keys.inquiry(id),
    queryFn: () => apiClient.get<BookingInquiry>(`/api/bookings/inquiries/${id}`),
    enabled: !!id,
  });
}

export function useCreateInquiry() {
  const qc = useQueryClient();
  return useMutation<BookingInquiry, unknown, Partial<BookingInquiry>>({
    mutationFn: (body) => apiClient.post<BookingInquiry>('/api/bookings/inquiries', body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['bookings', 'inquiries'] }),
  });
}

// ── Bookings ──
export function useBookings(artistId?: string) {
  return useQuery<Booking[]>({
    queryKey: keys.bookings(artistId),
    queryFn: () => apiClient.get<Booking[]>('/api/bookings', { artistId }),
  });
}

export function useCreateBooking() {
  const qc = useQueryClient();
  return useMutation<Booking, unknown, Partial<Booking>>({
    mutationFn: (body) => apiClient.post<Booking>('/api/bookings', body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['bookings'] });
      qc.invalidateQueries({ queryKey: ['bookings', 'inquiries'] });
    },
  });
}
