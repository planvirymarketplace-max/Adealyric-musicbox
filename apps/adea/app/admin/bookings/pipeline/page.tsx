import { AdminLayout } from '@/components/layout/AdminLayout';
import BookingsPipelinePage from '@/components/dashboard/pages/bookings/BookingsPipelinePage';

export default function AdminBookingsPipelinePage() {
  return (
    <AdminLayout>
      <BookingsPipelinePage />
    </AdminLayout>
  );
}
