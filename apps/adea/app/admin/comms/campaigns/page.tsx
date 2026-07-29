import { AdminLayout } from '@/components/layout/AdminLayout';
import CampaignsPage from '@/components/dashboard/pages/comms/CampaignsPage';

export default function AdminCampaignsPage() {
  return (
    <AdminLayout>
      <CampaignsPage />
    </AdminLayout>
  );
}
