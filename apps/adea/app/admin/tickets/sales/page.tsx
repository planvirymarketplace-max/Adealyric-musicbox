import { AdminLayout } from '@/components/layout/AdminLayout';
import TicketSalesPage from '@/components/dashboard/pages/tickets/TicketSalesPage';

export default function AdminTicketSalesPage() {
  return (
    <AdminLayout>
      <TicketSalesPage />
    </AdminLayout>
  );
}
