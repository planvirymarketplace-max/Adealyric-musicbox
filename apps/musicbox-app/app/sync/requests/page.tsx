import { SyncLicenseRequestsPage } from '@/sync/pages/SyncLicenseRequestsPage';
import { SyncPortalShell } from '@/components/layout/SyncPortalShell';

export default function Page() {
  return (
    <SyncPortalShell>
      <SyncLicenseRequestsPage />
    </SyncPortalShell>
  );
}
