import { AdminLayout } from '@/components/layout/AdminLayout';
import VideosPage from '@/components/dashboard/pages/cms/VideosPage';

export default function Page() {
  return (
    <AdminLayout>
      <VideosPage />
    </AdminLayout>
  );
}
