import { DiscographyPage } from '@/components/adea/MusicDiscography';
import { SiteHeader, SiteFooter } from '@/components/adea/SiteChrome';

export default function MusicPage() {
  return (
    <div className="bg-white text-black">
      <SiteHeader />
      <DiscographyPage />
      <SiteFooter />
    </div>
  );
}
