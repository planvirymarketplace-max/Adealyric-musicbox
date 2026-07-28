import PortalProductDetailPage from '@/portal/pages/PortalProductDetailPage';
import { PortalShell } from '@/components/layout/PortalShell';

export default function Page() {
  return (
    <PortalShell>
      <PortalProductDetailPage />
    </PortalShell>
  );
}
