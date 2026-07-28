import PortalHomePage from '@/portal/pages/PortalHomePage';
import { PortalShell } from '@/components/layout/PortalShell';

export default function Page() {
  return (
    <PortalShell>
      <PortalHomePage />
    </PortalShell>
  );
}
