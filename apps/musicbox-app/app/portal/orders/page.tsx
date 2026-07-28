import PortalOrdersPage from '@/portal/pages/PortalOrdersPage';
import { PortalShell } from '@/components/layout/PortalShell';

export default function Page() {
  return (
    <PortalShell>
      <PortalOrdersPage />
    </PortalShell>
  );
}
