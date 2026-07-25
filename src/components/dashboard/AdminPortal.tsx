"use client";

import { useAppStore } from "@/lib/store";
import { AdminLayout } from "./layout/AdminLayout";
import { ToastContainer } from "./ui/Toast";
import DashboardPage from "./pages/DashboardPage";
import ReleasesPage from "./pages/catalog/ReleasesPage";
import ReleaseDetailPage from "./pages/catalog/ReleaseDetailPage";
import TracksPage from "./pages/catalog/TracksPage";
import OrdersPage from "./pages/commerce/OrdersPage";
import BookingsPipelinePage from "./pages/bookings/BookingsPipelinePage";
import BookingsCalendarPage from "./pages/bookings/BookingsCalendarPage";
import InquiriesPage from "./pages/bookings/InquiriesPage";
import BookingDetailPage from "./pages/bookings/BookingDetailPage";
import ContactsPage from "./pages/crm/ContactsPage";
import ContactDetailPage from "./pages/crm/ContactDetailPage";
import CsvImportPage from "./pages/crm/CsvImportPage";
import CampaignsPage from "./pages/comms/CampaignsPage";
import IntegrationsPage from "./pages/IntegrationsPage";
import AutomationPage from "./pages/AutomationPage";
import ExportsPage from "./pages/ExportsPage";
import SettingsPage from "./pages/SettingsPage";
import GalleriesPage from "./pages/cms/GalleriesPage";
import VideosPage from "./pages/cms/VideosPage";
import BannersPage from "./pages/cms/BannersPage";
import TicketEventsPage from "./pages/tickets/TicketEventsPage";
import TicketSalesPage from "./pages/tickets/TicketSalesPage";
import FansPage from "./pages/fans/FansPage";

function RouteContent({ route }: { route: string }) {
  switch (route) {
    case '/':
      return <DashboardPage />;
    case '/catalog/releases':
      return <ReleasesPage />;
    case '/catalog/tracks':
      return <TracksPage />;
    case '/commerce/orders':
      return <OrdersPage />;
    case '/cms/galleries':
      return <GalleriesPage />;
    case '/cms/videos':
      return <VideosPage />;
    case '/cms/banners':
      return <BannersPage />;
    case '/tickets/events':
      return <TicketEventsPage />;
    case '/tickets/sales':
      return <TicketSalesPage />;
    case '/bookings/pipeline':
      return <BookingsPipelinePage />;
    case '/bookings/calendar':
      return <BookingsCalendarPage />;
    case '/bookings/inquiries':
      return <InquiriesPage />;
    case '/crm/contacts':
      return <ContactsPage />;
    case '/crm/import':
      return <CsvImportPage />;
    case '/fans':
      return <FansPage />;
    case '/comms/campaigns':
      return <CampaignsPage />;
    case '/integrations':
      return <IntegrationsPage />;
    case '/automation':
      return <AutomationPage />;
    case '/exports':
      return <ExportsPage />;
    case '/settings':
      return <SettingsPage />;
    default:
      if (route.startsWith('/catalog/releases/')) return <ReleaseDetailPage />;
      if (route.startsWith('/bookings/')) return <BookingDetailPage />;
      if (route.startsWith('/crm/contacts/')) return <ContactDetailPage />;
      return <DashboardPage />;
  }
}

export function AdminPortal() {
  const { isAuthenticated, isAdmin, adminRoute } = useAppStore();

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  return (
    <>
      <AdminLayout>
        <RouteContent route={adminRoute} />
      </AdminLayout>
      <ToastContainer />
    </>
  );
}
