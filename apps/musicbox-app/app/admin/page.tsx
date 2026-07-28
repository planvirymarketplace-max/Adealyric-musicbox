import { AdminDashboardPage } from '@/admin/pages/AdminDashboardPage';
import { AdminLayout } from '@/components/layout/AdminLayout';

export default function Page() {
  return (
    <AdminLayout>
      <AdminDashboardPage />
    </AdminLayout>
  );
}
