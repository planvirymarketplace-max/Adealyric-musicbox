import { SyncSearchPage } from '@/sync/pages/SyncSearchPage';
import { SyncPortalShell } from '@/components/layout/SyncPortalShell';

export default function Page() {
  return (
    <SyncPortalShell>
      <SyncSearchPage />
    </SyncPortalShell>
  );
}
