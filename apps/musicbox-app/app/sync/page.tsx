import { SyncOverviewPage } from '@/sync/pages/SyncOverviewPage';
import { SyncPortalShell } from '@/components/layout/SyncPortalShell';

export default function Page() {
  return (
    <SyncPortalShell>
      <SyncOverviewPage />
    </SyncPortalShell>
  );
}
