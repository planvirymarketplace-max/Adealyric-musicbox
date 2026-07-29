import { AdminLayout } from '@/components/layout/AdminLayout';
import DashboardPage from '@/components/dashboard/pages/DashboardPage';

export default function AdminDashboardPage() {
  return (
    <AdminLayout>
      <DashboardPage />
    </AdminLayout>
  );
}
