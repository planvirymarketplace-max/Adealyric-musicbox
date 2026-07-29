'use client';

import { type ReactNode, useState } from 'react';
import { useRouter } from '@/lib/router';
import { useProAuth } from '@/lib/auth';
import { toast } from '@/components/ui/Toast';
import {
  LayoutDashboard,
  Disc3,
  ShoppingBag,
  Calendar,
  Inbox,
  Users,
  Settings,
  Menu,
  X,
  Search,
  Bell,
  Music,
  ExternalLink,
  MapPin,
  Send,
  Shield,
  DollarSign,
  BarChart3,
  Globe,
  LogOut,
  Palette,
  Cpu,
  FileCode,
  Handshake,
  FileText,
  Brush,
  PenLine,
  Newspaper,
  Image,
  Megaphone,
  Crown,
  Receipt,
  Package,
  ScrollText,
  UserPlus,
  Ticket,
  Plus,
  Sparkles,
  Megaphone as Announce,
  ChevronDown,
  ChevronRight,
  Scissors,
  Shirt,
  Watch,
  Eye,
  AlertTriangle,
  CheckCircle,
  Zap,
  XCircle,
  Heart,
} from 'lucide-react';

interface NavItem {
  to: string;
  label: string;
  icon: ReactNode;
}

const navSections: { title: string; collapsible: boolean; items: NavItem[] }[] = [
  // ─── 1. Overview ───
  {
    title: 'Overview',
    collapsible: false,
    items: [
      { to: '/admin', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    ],
  },
  // ─── 2. Create ───
  {
    title: 'Create',
    collapsible: true,
    items: [
      { to: '/admin/discography/new-release', label: 'New Release', icon: <Plus size={18} /> },
      { to: '/admin/shop/new-look', label: 'New Look', icon: <Sparkles size={18} /> },
      { to: '/admin/tour/new-tour-date', label: 'New Tour Date', icon: <Plus size={18} /> },
      { to: '/admin/cms/new-banner', label: 'New Banner', icon: <Announce size={18} /> },
    ],
  },
  // ─── 3. Website ───
  {
    title: 'Website',
    collapsible: true,
    items: [
      { to: '/admin/website/homepage', label: 'Homepage', icon: <Palette size={18} /> },
      { to: '/admin/website/pages', label: 'Pages', icon: <FileText size={18} /> },
      { to: '/admin/website/navigation', label: 'Navigation', icon: <Globe size={18} /> },
      { to: '/admin/website/seo', label: 'SEO', icon: <Search size={18} /> },
      { to: '/admin/website/theme', label: 'Theme & Layout', icon: <Brush size={18} /> },
    ],
  },
  // ─── 4. CMS ───
  {
    title: 'CMS',
    collapsible: true,
    items: [
      { to: '/admin/cms/banners', label: 'Announcements & Banners', icon: <Announce size={18} /> },
      { to: '/admin/cms/blog', label: 'Blog / News', icon: <PenLine size={18} /> },
      { to: '/admin/cms/press', label: 'Press Releases', icon: <Newspaper size={18} /> },
      { to: '/admin/cms/gallery', label: 'Media Gallery', icon: <Image size={18} /> },
    ],
  },
  // ─── 5. Shop ───
  {
    title: 'Shop',
    collapsible: true,
    items: [
      { to: '/admin/shop/albums', label: 'Albums', icon: <Disc3 size={18} /> },
      { to: '/admin/shop/collections', label: 'Collections', icon: <Crown size={18} /> },
      { to: '/admin/shop/catalog', label: 'Shop All', icon: <ShoppingBag size={18} /> },
      { to: '/admin/shop/get-the-look', label: 'Get the Look', icon: <Sparkles size={18} /> },
      { to: '/admin/shop/carts', label: 'Carts', icon: <Receipt size={18} /> },
      { to: '/admin/shop/orders', label: 'Orders', icon: <Receipt size={18} /> },
      { to: '/admin/shop/inventory', label: 'Inventory', icon: <Package size={18} /> },
      { to: '/admin/shop/settings', label: 'Storefront Settings', icon: <Settings size={18} /> },
    ],
  },
  // ─── 6. Discography ───
  {
    title: 'Discography',
    collapsible: true,
    items: [
      { to: '/admin/discography/releases', label: 'Releases', icon: <Disc3 size={18} /> },
      { to: '/admin/discography/tracks', label: 'Tracks', icon: <Music size={18} /> },
      { to: '/admin/discography/credits', label: 'Credits & Splits', icon: <Users size={18} /> },
      { to: '/admin/discography/metadata', label: 'Metadata', icon: <FileCode size={18} /> },
    ],
  },
  // ─── 7. Tour & Booking ───
  {
    title: 'Tour & Booking',
    collapsible: true,
    items: [
      { to: '/admin/tour/calendar', label: 'Calendar', icon: <Calendar size={18} /> },
      { to: '/admin/tour/recently-played', label: 'Recently Played', icon: <Eye size={18} /> },
      { to: '/admin/tour/venues', label: 'Venues', icon: <MapPin size={18} /> },
      { to: '/admin/tour/bookings', label: 'Booking Requests', icon: <Inbox size={18} /> },
    ],
  },
  // ─── 8. Artists & CRM ───
  {
    title: 'Artists & CRM',
    collapsible: true,
    items: [
      { to: '/admin/artists/roster', label: 'Artist Roster', icon: <Users size={18} /> },
      { to: '/admin/artists/contracts', label: 'Contracts', icon: <ScrollText size={18} /> },
      { to: '/admin/artists/onboarding', label: 'Onboarding', icon: <UserPlus size={18} /> },
      { to: '/admin/audience/contacts', label: 'CRM Contacts', icon: <Inbox size={18} /> },
      { to: '/admin/audience/fans', label: 'Fans', icon: <Heart size={18} /> },
      { to: '/admin/audience/campaigns', label: 'Email Campaigns', icon: <Send size={18} /> },
    ],
  },
  // ─── 9. Oversight ───
  {
    title: 'Oversight',
    collapsible: true,
    items: [
      { to: '/admin/oversight', label: 'Dashboard', icon: <Shield size={18} /> },
      { to: '/admin/rights', label: 'Rights', icon: <ScrollText size={18} /> },
      { to: '/admin/rights/splits', label: 'Split Conflicts', icon: <AlertTriangle size={18} /> },
      { to: '/admin/distribution', label: 'Distribution', icon: <Send size={18} /> },
      { to: '/admin/distribution/queue', label: 'Delivery Queue', icon: <Package size={18} /> },
      { to: '/admin/sync', label: 'Sync Licensing', icon: <Handshake size={18} /> },
      { to: '/admin/validation', label: 'Validation', icon: <CheckCircle size={18} /> },
      { to: '/admin/licensing', label: 'Licensing', icon: <FileText size={18} /> },
      { to: '/admin/royalty', label: 'Royalties', icon: <DollarSign size={18} /> },
      { to: '/admin/royalty/revenue', label: 'Revenue', icon: <BarChart3 size={18} /> },
    ],
  },
  // ─── 10. Marketing & Social ───
  {
    title: 'Marketing & Social',
    collapsible: true,
    items: [
      { to: '/admin/social/metricool', label: 'Metricool', icon: <BarChart3 size={18} /> },
      { to: '/admin/social/scheduler', label: 'Post Scheduler', icon: <Calendar size={18} /> },
      { to: '/admin/social/analytics', label: 'Social Analytics', icon: <Eye size={18} /> },
    ],
  },
  // ─── 11. AI & API ───
  {
    title: 'AI & API',
    collapsible: true,
    items: [
      { to: '/admin/ai', label: 'AI Assistant', icon: <Cpu size={18} /> },
      { to: '/admin/api', label: 'API Settings', icon: <FileCode size={18} /> },
    ],
  },
];

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const { path, navigate } = useRouter();
  // Track which sections are expanded
  const [expanded, setExpanded] = useState<Record<string, boolean>>({ Overview: true, Create: true, Website: true, CMS: true, Shop: true, Discography: true });

  const toggleSection = (title: string) => setExpanded(prev => ({ ...prev, [title]: !prev[title] }));

  // Action cards — shown inside the Oversight section
  const actionCards = [
    { label: 'Metadata Errors', icon: <AlertTriangle size={14} />, route: '/admin/validation' },
    { label: 'DSP Rejections', icon: <XCircle size={14} />, route: '/admin/distribution' },
    { label: 'Sync Requests', icon: <Handshake size={14} />, route: '/admin/licensing' },
    { label: 'Split Conflicts', icon: <AlertTriangle size={14} />, route: '/admin/rights/splits' },
    { label: 'Royalties Ready', icon: <DollarSign size={14} />, route: '/admin/royalty' },
    { label: 'Contracts Waiting', icon: <ScrollText size={14} />, route: '/admin/artists/contracts' },
    { label: 'Artists Awaiting Onboarding', icon: <UserPlus size={14} />, route: '/admin/artists/onboarding' },
  ];

  return (
    <nav className="flex-1 overflow-y-auto px-3 py-4">
      {navSections.map((section) => (
        <div key={section.title} className="mb-4">
          {/* Section header — collapsible */}
          {section.collapsible ? (
            <button
              onClick={() => toggleSection(section.title)}
              className="flex items-center justify-between px-3 mb-1 w-full text-left"
            >
              <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">{section.title}</p>
              <span className="text-neutral-400">{expanded[section.title] ? <ChevronDown size={14} /> : <ChevronRight size={14} />}</span>
            </button>
          ) : (
            <p className="px-3 mb-1 text-xs font-semibold uppercase tracking-wider text-neutral-400">{section.title}</p>
          )}

          {/* Section items */}
          {(!section.collapsible || expanded[section.title]) && (
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const isActive = path === item.to || (item.to !== '/admin' && path.startsWith(item.to));
                return (
                  <button
                    key={item.to}
                    onClick={() => { navigate(item.to); onNavigate?.(); }}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors w-full text-left ${
                      isActive
                        ? 'bg-neutral-900 text-white'
                        : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Oversight section: action cards */}
          {section.title === 'Oversight' && expanded['Oversight'] && (
            <div className="mt-2 px-3 space-y-1">
              <p className="text-xs font-semibold text-neutral-500 mb-2">Action Cards</p>
              {actionCards.map(card => {
                const isCardActive = path === card.route;
                return (
                  <button
                    key={card.label}
                    onClick={() => { navigate(card.route); onNavigate?.(); }}
                    className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors w-full text-left ${
                      isCardActive ? 'bg-neutral-900 text-white' : 'text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900'
                    }`}
                  >
                    {card.icon}
                    <span>{card.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      ))}
      {/* Settings */}
      <div className="mb-2">
        <button onClick={() => { navigate('/admin/settings'); onNavigate?.(); }} className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors w-full text-left ${path === '/admin/settings' ? 'bg-neutral-900 text-white' : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'}`}>
          <Settings size={18} /><span>Settings</span>
        </button>
      </div>
    </nav>
  );
}

export function AdminLayout({ children }: { children: ReactNode }) {
  const { signOut } = useProAuth();
  const { navigate } = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-neutral-50 flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 flex-col bg-white border-r border-neutral-200 fixed inset-y-0 left-0 z-30">
        <div className="flex items-center gap-2 px-6 py-5 border-b border-neutral-200">
          <div className="w-8 h-8 rounded-lg bg-neutral-900 flex items-center justify-center">
            <Music size={18} className="text-white" />
          </div>
          <span className="font-semibold text-neutral-900">Admin Portal</span>
        </div>
        <SidebarContent />
        <div className="px-6 py-4 border-t border-neutral-200 space-y-2">
          <button onClick={async () => { await signOut(); toast('success', 'Signed out'); navigate('/pro/login'); }} className="flex items-center gap-2 text-xs text-red-500 hover:text-red-700 transition-colors w-full">
            <LogOut size={12} /> Sign Out
          </button>
          <p className="text-xs font-semibold text-neutral-500 mt-3">Switch Portal</p>
          <button onClick={() => navigate('/portal')} className="flex items-center gap-2 text-xs text-emerald-600 hover:text-emerald-800 transition-colors">
            <ExternalLink size={12} /> Fan Portal
          </button>
          <button onClick={() => navigate('/pro')} className="flex items-center gap-2 text-xs text-blue-600 hover:text-blue-800 transition-colors">
            <ExternalLink size={12} /> Industry Portal
          </button>
          <button onClick={() => navigate('/sync')} className="flex items-center gap-2 text-xs text-violet-600 hover:text-violet-800 transition-colors">
            <ExternalLink size={12} /> Sync Portal
          </button>
          <button onClick={() => navigate('/writer')} className="flex items-center gap-2 text-xs text-amber-600 hover:text-amber-800 transition-colors">
            <ExternalLink size={12} /> Writer Portal
          </button>
          <button onClick={() => navigate('/')} className="flex items-center gap-2 text-xs text-neutral-500 hover:text-neutral-900 transition-colors">
            <ExternalLink size={12} /> Back to Gate
          </button>
          <p className="text-xs text-neutral-400 mt-1">Admin Portal v3.0</p>
        </div>
      </aside>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="absolute inset-0 bg-black/30" onClick={() => setMobileOpen(false)} />
          <aside className="relative w-64 bg-white flex flex-col">
            <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-200">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-neutral-900 flex items-center justify-center">
                  <Music size={18} className="text-white" />
                </div>
                <span className="font-semibold text-neutral-900">Admin Portal</span>
              </div>
              <button onClick={() => setMobileOpen(false)} className="text-neutral-400">
                <X size={20} />
              </button>
            </div>
            <SidebarContent onNavigate={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Topbar */}
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-neutral-200 px-4 lg:px-8 py-3 flex items-center gap-4">
          <button onClick={() => setMobileOpen(true)} className="lg:hidden text-neutral-500">
            <Menu size={22} />
          </button>

          {/* Admin Portal branding */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-neutral-900 flex items-center justify-center">
              <Music size={14} className="text-white" />
            </div>
            <span className="text-sm font-semibold text-neutral-900">Admin Portal</span>
          </div>

          {/* Search */}
          <div className="flex-1 max-w-md ml-2">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                placeholder="Search music, orders, contacts…"
                className="w-full pl-9 pr-4 py-2 text-sm bg-neutral-100 rounded-lg border border-transparent focus:outline-none focus:border-neutral-300 focus:bg-white transition-colors"
              />
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2 ml-auto">
            <button className="relative p-2 rounded-lg hover:bg-neutral-100 text-neutral-500">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <div className="w-8 h-8 rounded-full bg-neutral-200 flex items-center justify-center text-sm font-medium text-neutral-600">
              A
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 px-4 lg:px-8 py-6">{children}</main>
      </div>
    </div>
  );
}
