import { AdminLayout } from '@/components/layout/AdminLayout';
import TicketEventsPage from '@/components/dashboard/pages/tickets/TicketEventsPage';

export default function AdminTicketEventsPage() {
  return (
    <AdminLayout>
      <TicketEventsPage />
    </AdminLayout>
  );
}
