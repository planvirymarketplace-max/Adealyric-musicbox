import { AdminLayout } from '@/components/layout/AdminLayout';
import BookingsCalendarPage from '@/components/dashboard/pages/bookings/BookingsCalendarPage';

export default function Page() {
  return (
    <AdminLayout>
      <BookingsCalendarPage />
    </AdminLayout>
  );
}
