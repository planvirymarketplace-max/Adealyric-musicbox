import { AdminLayout } from '@/components/layout/AdminLayout';
import TracksPage from '@/components/dashboard/pages/catalog/TracksPage';

export default function AdminTracksPage() {
  return (
    <AdminLayout>
      <TracksPage />
    </AdminLayout>
  );
}
