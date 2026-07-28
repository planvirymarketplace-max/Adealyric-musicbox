import { OffPage } from '@/components/adea/OffLogin';
import { SiteHeader, SiteFooter } from '@/components/adea/SiteChrome';

export default function SignupPage() {
  return (
    <div className="bg-white text-black">
      <SiteHeader />
      <OffPage />
      <SiteFooter />
    </div>
  );
}
