import { ShopPage as ShopPageComponent } from '@/components/adea/Shop';
import { SiteHeader, SiteFooter } from '@/components/adea/SiteChrome';

export default function ShopPage() {
  return (
    <div className="bg-white text-black">
      <SiteHeader />
      <ShopPageComponent />
      <SiteFooter />
    </div>
  );
}
