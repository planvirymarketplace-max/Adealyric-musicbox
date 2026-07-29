import { AdminLayout } from '@/components/layout/AdminLayout';
import ContactsPage from '@/components/dashboard/pages/crm/ContactsPage';

export default function AdminContactsPage() {
  return (
    <AdminLayout>
      <ContactsPage />
    </AdminLayout>
  );
}
