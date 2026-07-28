import { SyncClearancePage } from '@/sync/pages/SyncClearancePage';
import { SyncPortalShell } from '@/components/layout/SyncPortalShell';

export default function Page() {
  return (
    <SyncPortalShell>
      <SyncClearancePage />
    </SyncPortalShell>
  );
}
