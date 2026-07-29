import { AdminLayout } from '@/components/layout/AdminLayout';
import InquiriesPage from '@/components/dashboard/pages/bookings/InquiriesPage';

export default function Page() {
  return (
    <AdminLayout>
      <InquiriesPage />
    </AdminLayout>
  );
}
