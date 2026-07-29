import { AdminLayout } from '@/components/layout/AdminLayout';
import TicketEventsPage from '@/components/dashboard/pages/tickets/TicketEventsPage';

export default function Page() {
  return (
    <AdminLayout>
      <TicketEventsPage />
    </AdminLayout>
  );
}
