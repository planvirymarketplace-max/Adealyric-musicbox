import { SyncRevenuePage } from '@/sync/pages/SyncRevenuePage';
import { SyncPortalShell } from '@/components/layout/SyncPortalShell';

export default function Page() {
  return (
    <SyncPortalShell>
      <SyncRevenuePage />
    </SyncPortalShell>
  );
}
