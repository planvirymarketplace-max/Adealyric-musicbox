import { BookingPage as BookingPageComponent } from '@/components/adea/Booking';
import { SiteHeader, SiteFooter } from '@/components/adea/SiteChrome';

export default function BookingPage() {
  return (
    <div className="bg-white text-black">
      <SiteHeader />
      <BookingPageComponent />
      <SiteFooter />
    </div>
  );
}
