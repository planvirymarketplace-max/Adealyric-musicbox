import PortalGalleryPage from '@/portal/pages/PortalGalleryPage';
import { PortalShell } from '@/components/layout/PortalShell';

export default function Page() {
  return (
    <PortalShell>
      <PortalGalleryPage />
    </PortalShell>
  );
}
