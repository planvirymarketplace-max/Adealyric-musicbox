import { AdminLayout } from '@/components/layout/AdminLayout';
import DashboardPage from '@/components/dashboard/pages/DashboardPage';

export default function AdminPage() {
  return (
    <AdminLayout>
      <DashboardPage />
    </AdminLayout>
  );
}
