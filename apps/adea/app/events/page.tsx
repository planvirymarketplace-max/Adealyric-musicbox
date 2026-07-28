import { TourPage } from '@/components/adea/MusicDiscography';
import { SiteHeader, SiteFooter } from '@/components/adea/SiteChrome';

export default function EventsPage() {
  return (
    <div className="bg-white text-black">
      <SiteHeader />
      <TourPage />
      <SiteFooter />
    </div>
  );
}
