import { LoginPage as AdminLoginForm } from '@/components/adea/OffLogin';
import { SiteHeader, SiteFooter } from '@/components/adea/SiteChrome';

export default function LoginPage() {
  return (
    <div className="bg-white text-black">
      <SiteHeader />
      <AdminLoginForm />
      <SiteFooter />
    </div>
  );
}
