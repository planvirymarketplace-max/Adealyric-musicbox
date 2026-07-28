import { SyncDealsPage } from '@/sync/pages/SyncDealsPage';
import { SyncPortalShell } from '@/components/layout/SyncPortalShell';

export default function Page() {
  return (
    <SyncPortalShell>
      <SyncDealsPage />
    </SyncPortalShell>
  );
}
