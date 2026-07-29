import { AdminLayout } from '@/components/layout/AdminLayout';
import CsvImportPage from '@/components/dashboard/pages/crm/CsvImportPage';

export default function Page() {
  return (
    <AdminLayout>
      <CsvImportPage />
    </AdminLayout>
  );
}
