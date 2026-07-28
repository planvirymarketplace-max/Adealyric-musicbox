import PortalDashboardPage from '@/portal/pages/PortalDashboardPage';
import { PortalShell } from '@/components/layout/PortalShell';

export default function Page() {
  return (
    <PortalShell>
      <PortalDashboardPage />
    </PortalShell>
  );
}
