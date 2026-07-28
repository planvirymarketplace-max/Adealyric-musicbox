import { BioPage as BioPageComponent } from '@/components/adea/BioAccount';
import { SiteHeader, SiteFooter } from '@/components/adea/SiteChrome';

export default function BioPage() {
  return (
    <div className="bg-white text-black">
      <SiteHeader />
      <BioPageComponent />
      <SiteFooter />
    </div>
  );
}
