import { AdminLayout } from '@/components/layout/AdminLayout';
import OrdersPage from '@/components/dashboard/pages/commerce/OrdersPage';

export default function Page() {
  return (
    <AdminLayout>
      <OrdersPage />
    </AdminLayout>
  );
}
