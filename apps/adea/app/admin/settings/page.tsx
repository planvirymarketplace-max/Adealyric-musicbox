import { AdminLayout } from '@/components/layout/AdminLayout';
import SettingsPage from '@/components/dashboard/pages/SettingsPage';

export default function AdminSettingsPage() {
  return (
    <AdminLayout>
      <SettingsPage />
    </AdminLayout>
  );
}
