import { AdminLayout } from '@/components/layout/AdminLayout';
import VideosPage from '@/components/dashboard/pages/cms/VideosPage';

export default function AdminVideosPage() {
  return (
    <AdminLayout>
      <VideosPage />
    </AdminLayout>
  );
}
