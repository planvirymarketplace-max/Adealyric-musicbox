import { SyncMyLicensesPage } from '@/sync/pages/SyncMyLicensesPage';
import { SyncPortalShell } from '@/components/layout/SyncPortalShell';

export default function Page() {
  return (
    <SyncPortalShell>
      <SyncMyLicensesPage />
    </SyncPortalShell>
  );
}
