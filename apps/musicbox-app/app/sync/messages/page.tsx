import { SyncMessagesPage } from '@/sync/pages/SyncMessagesPage';
import { SyncPortalShell } from '@/components/layout/SyncPortalShell';

export default function Page() {
  return (
    <SyncPortalShell>
      <SyncMessagesPage />
    </SyncPortalShell>
  );
}
