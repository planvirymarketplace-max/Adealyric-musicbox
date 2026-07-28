import { SyncDistributionPage } from '@/sync/pages/SyncDistributionPage';
import { SyncPortalShell } from '@/components/layout/SyncPortalShell';

export default function Page() {
  return (
    <SyncPortalShell>
      <SyncDistributionPage />
    </SyncPortalShell>
  );
}
