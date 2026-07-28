import { SyncTrackDetailPage } from '@/sync/pages/SyncTrackDetailPage';
import { SyncPortalShell } from '@/components/layout/SyncPortalShell';

export default function Page() {
  return (
    <SyncPortalShell>
      <SyncTrackDetailPage />
    </SyncPortalShell>
  );
}
