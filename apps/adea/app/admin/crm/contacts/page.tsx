import { AdminLayout } from '@/components/layout/AdminLayout';
import ContactsPage from '@/components/dashboard/pages/crm/ContactsPage';

export default function Page() {
  return (
    <AdminLayout>
      <ContactsPage />
    </AdminLayout>
  );
}
