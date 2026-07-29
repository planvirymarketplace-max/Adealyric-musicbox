import { AdminLayout } from '@/components/layout/AdminLayout';
import ReleasesPage from '@/components/dashboard/pages/catalog/ReleasesPage';

export default function Page() {
  return (
    <AdminLayout>
      <ReleasesPage />
    </AdminLayout>
  );
}
