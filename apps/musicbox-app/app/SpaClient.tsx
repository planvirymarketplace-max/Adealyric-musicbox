'use client';
import { useState, useEffect, type ReactNode } from 'react';
import {
  Music, LayoutDashboard, Disc3, ShoppingBag, Calendar, Inbox, Users, Mail, Plug, Bot, Download, Settings, Menu, X, Search, Bell, ChevronDown, ChevronLeft, ChevronRight, ArrowRight, ArrowUpRight, ArrowLeft, BarChart3, Building2, PenLine, FileText, DollarSign, MapPin, Ticket, Heart, User, Award, Clock, Star, TrendingUp, Play, Pause, Loader2, Lock, Gift, ShoppingBag as ShoppingBagIcon, Image as ImageIcon, Video as VideoIcon, Send, Sparkles, Handshake, ExternalLink, Radio, Activity, CheckCircle2, Ban, Target, Music2, Crown, MessageSquare, Palette, Eye, Headphones, Users as UsersIcon, Cpu, Shield, Wallet, Plus, Filter, MoreHorizontal, Edit3, Trash2, Upload, FileCheck, AlertTriangle, Globe, Mic, CheckCircle, XCircle, Circle, ChevronUp, Tag, CalendarDays, LayoutGrid, List, Columns3, Move, AlertCircle, Info, Hash, Timer, Zap, Package, Link2, Newspaper, Megaphone, CreditCard, Truck, Layers, Save, Warehouse, ToggleLeft, ToggleRight, ImagePlus, FileUp, GripVertical, Type, Monitor, EyeOff, MoveUp, MoveDown, LayoutTemplate, SwatchBook, Bold, Italic, Underline, AlignLeft, AlignCenter, ListOrdered, Undo2, Redo2, SlidersHorizontal, Paintbrush, Share, Scissors, Shirt, Watch
} from 'lucide-react';
import { formatCents, formatDate, formatDateTime, timeAgo } from '@/lib/format';
import { toast, ToastContainer } from '@/components/ui/Toast';
import { Button } from '@/components/ui/Button';
import { Card, StatCard } from '@/components/ui/Card';
import { Badge, StatusBadge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Field, Input, Select, Textarea } from '@/components/ui/Form';
import { EmptyState, LoadingState, ErrorState } from '@/components/ui/States';
import { AudioPlayer } from '@/components/ui/AudioPlayer';
import { PageHeader } from '@/components/layout/PageHeader';
import { PortalShell } from '@/components/layout/PortalShell';
import PortalWalletPage from '@/portal/pages/PortalWalletPage';
import PortalCartPage from '@/portal/pages/PortalCartPage';
import PortalOrdersPage from '@/portal/pages/PortalOrdersPage';
import PortalShopPageNew from '@/portal/pages/PortalShopPageNew';
import PortalProductDetailPage from '@/portal/pages/PortalProductDetailPage';
import AdminProductCatalogPage from '@/admin-pages/shop/AdminProductCatalogPage';
import AdminProductEditPage from '@/admin-pages/shop/AdminProductEditPage';
import AdminAddProductPage from '@/admin-pages/shop/AdminAddProductPage';
import { ProPortalShell } from '@/components/layout/ProPortalShell';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { SyncPortalShell } from '@/components/layout/SyncPortalShell';
import { WriterPortalShell } from '@/components/layout/WriterPortalShell';
import { SyncOverviewPage } from '@/sync/pages/SyncOverviewPage';
import { SyncSearchPage } from '@/sync/pages/SyncSearchPage';
import { SyncTrackDetailPage } from '@/sync/pages/SyncTrackDetailPage';
import { SyncLicenseRequestsPage } from '@/sync/pages/SyncLicenseRequestsPage';
import { SyncMyLicensesPage } from '@/sync/pages/SyncMyLicensesPage';
import { SyncDealsPage } from '@/sync/pages/SyncDealsPage';
import { SyncClearancePage } from '@/sync/pages/SyncClearancePage';
import { SyncDistributionPage } from '@/sync/pages/SyncDistributionPage';
import { SyncRevenuePage } from '@/sync/pages/SyncRevenuePage';
import { SyncMessagesPage } from '@/sync/pages/SyncMessagesPage';
import { AdminDistributionPage } from '@/admin/pages/AdminDistributionPage';
import { AdminNewReleaseWizard } from '@/admin/pages/AdminNewReleaseWizard';
import { AdminRightsPage } from '@/admin/pages/AdminRightsPage';
import { AdminRoyaltyPage } from '@/admin/pages/AdminRoyaltyPage';
import { AdminSyncPage } from '@/admin/pages/AdminSyncPage';
import { AdminOversightPage } from '@/admin/pages/AdminOversightPage';
import { AdminValidationPage } from '@/admin/pages/AdminValidationPage';
import { AdminAnalyticsPage } from '@/admin/pages/AdminAnalyticsPage';
import { AdminShopAlbumsPage } from '@/admin/pages/AdminShopAlbumsPage';
import { AdminShopCollectionsPage } from '@/admin/pages/AdminShopCollectionsPage';
import { AdminShopAllPage } from '@/admin/pages/AdminShopAllPage';
import { AdminShopGetTheLookPage } from '@/admin/pages/AdminShopGetTheLookPage';
import { AdminDashboardPage } from '@/admin/pages/AdminDashboardPage';
import { AdminCmsBannersPage as AdminCmsBannersPageNew } from '@/admin/pages/AdminCmsBannersPage';
import SocialMediaPage from '@/admin/pages/SocialMediaPage';
import { AdminTourCalendarPage as AdminTourCalendarPageExternal } from '@/admin/pages/AdminTourCalendarPage';
import { AdminTourRecentlyPlayedPage as AdminTourRecentlyPlayedPageExternal } from '@/admin/pages/AdminTourRecentlyPlayedPage';
import { AdminTourVenuesPage as AdminTourVenuesPageExternal } from '@/admin/pages/AdminTourVenuesPage';
import { AdminTourBookingsPage as AdminTourBookingsPageExternal } from '@/admin/pages/AdminTourBookingsPage';
import GatePage from '@/admin-pages/GatePage';
import { RouterProvider, useRouter, Link } from '@/lib/router';
import { PortalAuthProvider, usePortalAuth, ProAuthProvider, useProAuth } from '@/lib/auth';
import * as mockData from '@/lib/mock-data';
import { useBookings, useBookingInquiries, useOrders, useReleases } from '@/hooks/queries';
import { usePageTitle } from '@/hooks/use-page-title';
import LabelOverview from '@/pro/pages/label/LabelOverview';
import LabelCatalog from '@/pro/pages/label/LabelCatalog';
import LabelRequests from '@/pro/pages/label/LabelRequests';
import LabelDeals from '@/pro/pages/label/LabelDeals';
import LabelCustomWrite from '@/pro/pages/label/LabelCustomWrite';
import LabelMessages from '@/pro/pages/label/LabelMessages';
import LabelDocuments from '@/pro/pages/label/LabelDocuments';
import type { Release, Track, Artist, Booking, BookingInquiry, CrmContact, Order, Fan, TicketEvent, TicketTier, TicketOrder, CmsBanner, CmsGallery, CmsImage, CmsVideo, ShopProduct, TourDate, CatalogSong, CollabCall, PortalRequest, AvailabilityHold, SpendEntry, PortalUser, UserLoyalty, LoyaltyTransaction, EmailCampaign } from '@/types/database';

// ============ FAN PORTAL ROUTER ============
function PortalApp({ noShell }: { noShell?: boolean }) {
  const { path } = useRouter();
  if (noShell || path === '/portal/login' || path === '/portal/signup') return <PortalRouter />;
  return <PortalShell><PortalRouter /></PortalShell>;
}

function PortalRouter() {
  const { path, params } = useRouter();
  const { user } = usePortalAuth();

  if (path === '/portal' || path === '/portal/') return <PortalHomePage />;
  if (path === '/portal/login') return <PortalLoginPage />;
  if (path === '/portal/signup') return <PortalSignupPage />;
  if (path === '/portal/dashboard') return <PortalDashboardPage />;
  if (path === '/portal/account') return <PortalLoyaltyPage />;
  if (path === '/portal/music' || path === '/portal/music/') return <PortalMusicPage />;
  if (path.startsWith('/portal/music/')) return <PortalReleaseDetailPage />;
  if (path === '/portal/events' || path === '/portal/events/') return <PortalEventsPage />;
  if (path.startsWith('/portal/events/')) return <PortalEventDetailPage />;
  if (path === '/portal/gallery') return <PortalGalleryPage />;
  if (path === '/portal/videos') return <PortalVideosPage />;
  if (path === '/portal/shop') return <PortalShopPageNew />;
  if (path.startsWith('/portal/shop/')) return <PortalProductDetailPage />;
  if (path === '/portal/wallet') return <PortalWalletPage />;
  if (path === '/portal/cart') return <PortalCartPage />;
  if (path === '/portal/orders') return <PortalOrdersPage />;
  if (path === '/portal/tours') return <PortalToursPage />;
  if (path === '/portal/membership') return <MembershipPage />;
  if (path === '/portal/exclusive') return <ExclusivePage />;
  if (path === '/portal/community') return <CommunityPage />;
  if (path === '/portal/premium') return <PremiumContentPage />;
  return <PortalHomePage />;
}

// ============ FAN PORTAL PAGES (LIGHT THEME) ============

function PortalHomePage() {
  const [banners] = useState<CmsBanner[]>(mockData.mockBanners);
  const [events] = useState<TicketEvent[]>(mockData.mockTicketEvents);
  const [bannerIdx, setBannerIdx] = useState(0);
  const heroBanners = banners.filter((b) => b.position === 'hero');
  const promoBanners = banners.filter((b) => b.position === 'promo');

  const EXCLUSIVE_PERKS = [
    { icon: <Ticket size={20} className="text-emerald-600" />, title: 'Ticket Pre-Sales', desc: 'Get early access to tickets before the general public. Never miss a show.', color: 'bg-emerald-50' },
    { icon: <ShoppingBag size={20} className="text-purple-600" />, title: 'Exclusive Merch', desc: 'Limited edition drops only available to members. Collect rare items.', color: 'bg-purple-50' },
    { icon: <Heart size={20} className="text-rose-600" />, title: 'Meet & Greet', desc: 'VIP meet-and-greet opportunities at select events. Get up close.', color: 'bg-rose-50' },
    { icon: <VideoIcon size={20} className="text-blue-600" />, title: 'Behind the Scenes', desc: 'Studio updates, demo tracks, and rehearsal clips — see the process.', color: 'bg-blue-50' },
    { icon: <Radio size={20} className="text-amber-600" />, title: 'Live Streams & Q&A', desc: 'Member-only live streams and Q&A sessions with the artist.', color: 'bg-amber-50' },
    { icon: <UsersIcon size={20} className="text-teal-600" />, title: 'Community Spaces', desc: 'Connect with other fans in exclusive community channels and forums.', color: 'bg-teal-50' },
  ];

  return (
    <div>
      {/* Hero Banner */}
      {heroBanners.length > 0 ? (
        <div className="relative h-[60vh] min-h-[400px] overflow-hidden">
          {heroBanners.map((b, i) => (
            <div key={b.id} className={`absolute inset-0 transition-opacity duration-700 ${i === bannerIdx ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
              <img src={b.image_url} alt={b.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8 sm:p-12">
                <div className="max-w-2xl">
                  <h1 className="text-3xl sm:text-5xl font-bold text-white mb-2">{b.title}</h1>
                  {b.subtitle && <p className="text-lg text-white/70 mb-4">{b.subtitle}</p>}
                  {b.cta_text && <Link to={b.cta_link ?? '/portal/events'} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white text-neutral-900 font-medium hover:bg-white/90 transition-colors">{b.cta_text} <ArrowRight size={16} /></Link>}
                </div>
              </div>
            </div>
          ))}
          {heroBanners.length > 1 && (
            <>
              <button onClick={() => setBannerIdx((i) => (i - 1 + heroBanners.length) % heroBanners.length)} className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 p-2 rounded-full text-white"><ChevronLeft size={20} /></button>
              <button onClick={() => setBannerIdx((i) => (i + 1) % heroBanners.length)} className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 p-2 rounded-full text-white"><ChevronRight size={20} /></button>
              <div className="absolute bottom-4 right-8 flex gap-1.5">{heroBanners.map((_, i) => (<button key={i} onClick={() => setBannerIdx(i)} className={`w-2 h-2 rounded-full transition-colors ${i === bannerIdx ? 'bg-white' : 'bg-white/30'}`} />))}</div>
            </>
          )}
        </div>
      ) : (
        <div className="h-[40vh] min-h-[300px] bg-gradient-to-br from-neutral-100 to-neutral-200 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl sm:text-5xl font-bold text-neutral-900 mb-2">Welcome</h1>
            <p className="text-neutral-500">Your new home for music, events, and more</p>
          </div>
        </div>
      )}

      {/* Promo Banners */}
      {promoBanners.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {promoBanners.map((b) => (
              <Link key={b.id} to={b.cta_link ?? '/portal/events'} className="relative rounded-xl overflow-hidden group">
                <img src={b.image_url} alt={b.title} className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent" />
                <div className="absolute bottom-0 left-0 p-4">
                  <p className="text-sm font-semibold text-white">{b.title}</p>
                  {b.cta_text && <p className="text-xs text-white/60 mt-0.5">{b.cta_text} →</p>}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Exclusive Perks & Access Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-neutral-900">Exclusive Perks & Access</h2>
            <p className="text-sm text-neutral-500 mt-1">What you get as part of the community</p>
          </div>
          <Crown size={24} className="text-neutral-300" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {EXCLUSIVE_PERKS.map((perk) => (
            <div key={perk.title} className={`rounded-xl p-5 border border-neutral-200 ${perk.color} transition-colors hover:border-neutral-300`}>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">{perk.icon}</div>
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-neutral-900">{perk.title}</h3>
                  <p className="text-xs text-neutral-500 mt-1 leading-relaxed">{perk.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Membership Tiers Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-neutral-900">Membership Tiers</h2>
            <p className="text-sm text-neutral-500 mt-1">More access, more content, more connection — at every level</p>
          </div>
          <Link to="/portal/membership" className="text-sm text-neutral-500 hover:text-neutral-900 flex items-center gap-1">View all tiers <ArrowRight size={14} /></Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {MEMBERSHIP_TIERS.map((tier) => (
            <Link key={tier.id} to="/portal/membership" className={`rounded-xl overflow-hidden ${tier.popular ? 'border-2 border-neutral-900' : 'border border-neutral-200'} transition-all hover:shadow-md`}>
              <div className={`${tier.headerBg} px-4 py-3 text-center`}>
                {tier.popular && <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold mb-1 ${tier.badgeColor}`}>Most Popular</span>}
                <p className={`text-xl font-bold ${tier.headerBg === 'bg-neutral-900' || tier.headerBg === 'bg-neutral-800' ? 'text-white' : 'text-neutral-900'}`}>
                  {tier.price}<span className="text-sm font-normal">{tier.period}</span>
                </p>
                <p className={`text-xs ${tier.headerBg === 'bg-neutral-900' || tier.headerBg === 'bg-neutral-800' ? 'text-white/40' : 'text-neutral-400'}`}>{tier.name}</p>
              </div>
              <div className="bg-white px-4 py-4">
                <ul className="space-y-1.5">
                  {tier.features.slice(0, 3).map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-neutral-600">
                      <CheckCircle2 size={12} className="text-neutral-400 flex-shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                  {tier.features.length > 3 && <li className="text-xs text-neutral-400 pl-4">+ {tier.features.length - 3} more features</li>}
                </ul>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-neutral-900">Upcoming Events</h2>
          <Link to="/portal/events" className="text-sm text-neutral-500 hover:text-neutral-900 flex items-center gap-1">View all <ArrowRight size={14} /></Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.map((e) => (
            <Link key={e.id} to={`/portal/events/${e.id}`} className="group rounded-xl overflow-hidden bg-white border border-neutral-200 hover:border-neutral-300 transition-colors">
              <div className="w-full h-44 bg-gradient-to-br from-neutral-100 to-neutral-300 flex items-center justify-center">
                <Calendar size={32} className="text-neutral-300" />
              </div>
              <div className="p-4">
                <p className="text-xs text-neutral-400 mb-1">{formatDate(e.event_date)}</p>
                <p className="text-lg font-semibold text-neutral-900 mb-1">{e.title}</p>
                <p className="text-sm text-neutral-500">{e.venue_name}{e.city ? `, ${e.city}` : ''}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

function PortalLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = usePortalAuth();
  const { navigate } = useRouter();
  const submit = async () => {
    if (!email || !password) { toast('error', 'Email and password are required'); return; }
    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);
    if (error) { toast('error', error); return; }
    toast('success', 'Welcome back!');
    navigate('/portal/dashboard');
  };
  return (
    <div className="min-h-screen bg-white font-sans flex flex-col">
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Left: Brand */}
        <div className="lg:w-1/2 flex flex-col justify-between p-8 sm:p-12 lg:p-16 bg-gradient-to-br from-neutral-50 to-white border-r border-neutral-100">
          <div>
            <p className="text-xs tracking-[0.2em] text-neutral-300 uppercase mb-8">Adea Lyric</p>
            <h1 className="text-4xl sm:text-5xl font-bold leading-tight text-neutral-900 mb-4">Welcome back.</h1>
            <p className="text-lg text-neutral-500 max-w-md leading-relaxed">Sign in to your fan account to access exclusive content, pre-sale tickets, merch drops, and more.</p>
          </div>
          <div className="mt-8 pt-8 border-t border-neutral-100"><p className="text-xs text-neutral-300">West Philadelphia · 2026</p></div>
        </div>
        {/* Right: Sign in form */}
        <div className="lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-16 bg-white">
          <div className="w-full max-w-sm">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center"><Music size={20} className="text-white" /></div>
              <div>
                <p className="text-xs font-bold tracking-[0.15em] uppercase text-emerald-600">Fan Portal</p>
                <p className="text-sm font-semibold text-neutral-900">Sign In</p>
              </div>
            </div>
            <div className="border border-neutral-200 rounded-xl p-6 space-y-4 bg-white">
              <Field label="Email"><div className="relative"><Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" /><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-9 border-neutral-200 bg-white text-neutral-900 placeholder:text-neutral-400" placeholder="you@example.com" /></div></Field>
              <Field label="Password"><div className="relative"><Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" /><Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-9 border-neutral-200 bg-white text-neutral-900 placeholder:text-neutral-400" placeholder="Your password" onKeyDown={(e) => e.key === 'Enter' && submit()} /></div></Field>
              <Button variant="primary" className="w-full bg-emerald-600 text-white hover:bg-emerald-700 flex items-center justify-center gap-2" onClick={submit} disabled={loading}>{loading ? 'Signing in...' : 'Sign In'} <ArrowRight size={16} /></Button>
            </div>
            <div className="mt-6 text-center space-y-2">
              <p className="text-sm text-neutral-500">Don't have an account? <button onClick={() => navigate('/portal/signup')} className="text-emerald-600 hover:underline font-medium">Create one</button></p>
              <p className="text-sm text-neutral-500">Not a fan? <button onClick={() => navigate('/')} className="text-neutral-900 hover:underline font-medium">Choose a different portal</button></p>
              <p className="text-xs text-neutral-400 mt-2">Demo: fan@test.com / password123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PortalSignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'welcome' | 'details'>('welcome');
  const { signUp } = usePortalAuth();
  const { navigate } = useRouter();
  const submit = async () => {
    if (!email || !password) { toast('error', 'Email and password are required'); return; }
    if (password.length < 6) { toast('error', 'Password must be at least 6 characters'); return; }
    setLoading(true);
    const { error } = await signUp(email, password, name);
    setLoading(false);
    if (error) { toast('error', error); return; }
    toast('success', 'Account created! Welcome.');
    navigate('/portal/dashboard');
  };
  const FAN_PERKS = [
    { icon: <Crown size={16} className="text-emerald-600" />, label: 'Membership tiers from $4/mo' },
    { icon: <CheckCircle2 size={16} className="text-emerald-600" />, label: 'Ticket pre-sales & early access' },
    { icon: <CheckCircle2 size={16} className="text-emerald-600" />, label: 'Exclusive merch & limited drops' },
    { icon: <CheckCircle2 size={16} className="text-emerald-600" />, label: 'Behind-the-scenes content' },
    { icon: <CheckCircle2 size={16} className="text-emerald-600" />, label: 'Live streams & Q&A sessions' },
    { icon: <CheckCircle2 size={16} className="text-emerald-600" />, label: 'Loyalty rewards & VIP perks' },
  ];
  return (
    <div className="min-h-screen bg-white font-sans flex flex-col">
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Left: Brand */}
        <div className="lg:w-1/2 flex flex-col justify-between p-8 sm:p-12 lg:p-16 bg-gradient-to-br from-neutral-50 to-white border-r border-neutral-100">
          <div>
            <p className="text-xs tracking-[0.2em] text-neutral-300 uppercase mb-8">Adea Lyric</p>
            <h1 className="text-4xl sm:text-5xl font-bold leading-tight text-neutral-900 mb-4">Join the<br />community.</h1>
            <p className="text-lg text-neutral-500 max-w-md leading-relaxed">Create your fan account and start exploring exclusive content, early access, and more.</p>
          </div>
          <div className="mt-8 pt-8 border-t border-neutral-100"><p className="text-xs text-neutral-300">West Philadelphia · 2026</p></div>
        </div>
        {/* Right: Sign-up flow */}
        <div className="lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-16 bg-white">
          <div className="w-full max-w-sm">
            {/* Step indicator */}
            <div className="flex items-center gap-2 mb-8">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${step === 'welcome' ? 'bg-emerald-600 text-white' : 'bg-neutral-200 text-neutral-400'}`}>1</div>
              <div className="hidden sm:block"><p className="text-xs font-semibold text-neutral-900">Welcome</p><p className="text-xs text-neutral-400">What you get as a fan member</p></div>
              <div className="w-8 h-px bg-neutral-200 mx-1" />
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${step === 'details' ? 'bg-emerald-600 text-white' : 'bg-neutral-200 text-neutral-400'}`}>2</div>
              <div className="hidden sm:block"><p className="text-xs font-semibold text-neutral-900">Create Account</p><p className="text-xs text-neutral-400">Set up your fan profile</p></div>
            </div>
            {/* Portal badge */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center"><Music size={20} className="text-white" /></div>
              <div><p className="text-xs font-bold tracking-[0.15em] uppercase text-emerald-600">Fan Portal</p><p className="text-sm font-semibold text-neutral-900">Create Your Account</p></div>
            </div>
            {step === 'welcome' ? (
              <div>
                <p className="text-sm text-neutral-500 mb-4">Here's what you get when you join:</p>
                <div className="space-y-3 mb-6">{FAN_PERKS.map((perk) => (<div key={perk.label} className="flex items-center gap-3 p-3 rounded-lg bg-emerald-50 border border-emerald-100">{perk.icon}<span className="text-sm text-neutral-700">{perk.label}</span></div>))}</div>
                <button onClick={() => setStep('details')} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition-colors">Continue to Create Account <ArrowRight size={16} /></button>
              </div>
            ) : (
              <div className="border border-neutral-200 rounded-xl p-6 space-y-4 bg-white">
                <Field label="Display Name"><Input value={name} onChange={(e) => setName(e.target.value)} className="border-neutral-200 bg-white text-neutral-900 placeholder:text-neutral-400" placeholder="Your name" /></Field>
                <Field label="Email"><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="border-neutral-200 bg-white text-neutral-900 placeholder:text-neutral-400" placeholder="you@example.com" /></Field>
                <Field label="Password"><Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="border-neutral-200 bg-white text-neutral-900 placeholder:text-neutral-400" placeholder="Min 6 characters" onKeyDown={(e) => e.key === 'Enter' && submit()} /></Field>
                <Button variant="primary" className="w-full bg-emerald-600 text-white hover:bg-emerald-700 flex items-center justify-center gap-2" onClick={submit} disabled={loading}>{loading ? 'Creating...' : 'Create Account'} <ArrowRight size={16} /></Button>
                <button onClick={() => setStep('welcome')} className="w-full text-center text-xs text-neutral-400 hover:text-neutral-600 transition-colors">Back to overview</button>
              </div>
            )}
            <div className="mt-6 text-center space-y-2">
              <p className="text-sm text-neutral-500">Already have an account? <button onClick={() => navigate('/portal/login')} className="text-emerald-600 hover:underline font-medium">Sign in</button></p>
              <p className="text-sm text-neutral-500">Not a fan? <button onClick={() => navigate('/')} className="text-neutral-900 hover:underline font-medium">Choose a different portal</button></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PortalDashboardPage() {
  const { user } = usePortalAuth();
  const { navigate } = useRouter();
  const [membershipTier] = useState('core');
  if (!user) { navigate('/portal/login'); return null; }
  const MEMBERSHIP_DISPLAY: Record<string, { name: string; price: string; color: string; iconBg: string }> = {
    entry: { name: 'Entry', price: '$4/mo', color: 'bg-neutral-50 border-neutral-200 text-neutral-900', iconBg: 'bg-neutral-100' },
    core: { name: 'Core', price: '$12/mo', color: 'bg-neutral-900 text-white border-neutral-900', iconBg: 'bg-white/10' },
    premium: { name: 'Premium', price: '$28/mo', color: 'bg-neutral-800 text-white border-neutral-700', iconBg: 'bg-white/10' },
  };
  const currentMembership = MEMBERSHIP_DISPLAY[membershipTier];
  const isDarkCard = currentMembership.color.includes('text-white');

  return (
    <div className="max-w-5xl mx-auto py-8">
      <h1 className="text-3xl font-bold text-neutral-900 mb-6">My Dashboard</h1>

      {/* Membership status card */}
      <div className={`rounded-xl p-6 mb-6 border ${isDarkCard ? currentMembership.color.split(' ').slice(0,2).join(' ') : 'bg-white border-neutral-200'}`}>
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className={`w-14 h-14 rounded-xl ${currentMembership.iconBg} flex items-center justify-center`}>
              <Crown size={28} className={isDarkCard ? 'text-white' : 'text-neutral-700'} />
            </div>
            <div>
              <p className={`text-xs uppercase tracking-wider ${isDarkCard ? 'text-white/60' : 'text-neutral-400'}`}>Current Membership</p>
              <p className={`text-2xl font-bold ${isDarkCard ? 'text-white' : 'text-neutral-900'}`}>{currentMembership.name}</p>
              <p className={`text-sm ${isDarkCard ? 'text-white/40' : 'text-neutral-500'}`}>{currentMembership.price}</p>
            </div>
          </div>
          <Link to="/portal/membership" className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isDarkCard ? 'bg-white text-neutral-900 hover:bg-white/90' : 'bg-neutral-900 text-white hover:bg-neutral-700'}`}>
            Manage Membership <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* Quick perks overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Link to="/portal/exclusive" className="bg-white border border-neutral-200 rounded-xl p-4 hover:border-neutral-300 transition-colors">
          <div className="flex items-center gap-3">
            <Crown size={20} className="text-neutral-400" />
            <div>
              <p className="text-sm font-semibold text-neutral-900">Exclusive Access</p>
              <p className="text-xs text-neutral-500">Early drops, merch, downloads</p>
            </div>
          </div>
        </Link>
        <Link to="/portal/community" className="bg-white border border-neutral-200 rounded-xl p-4 hover:border-neutral-300 transition-colors">
          <div className="flex items-center gap-3">
            <MessageSquare size={20} className="text-neutral-400" />
            <div>
              <p className="text-sm font-semibold text-neutral-900">Community</p>
              <p className="text-xs text-neutral-500">Q&As, streams, social</p>
            </div>
          </div>
        </Link>
        <Link to="/portal/premium" className="bg-white border border-neutral-200 rounded-xl p-4 hover:border-neutral-300 transition-colors">
          <div className="flex items-center gap-3">
            <Gift size={20} className="text-neutral-400" />
            <div>
              <p className="text-sm font-semibold text-neutral-900">Premium Content</p>
              <p className="text-xs text-neutral-500">BTS, docs, concerts</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Profile */}
      <div className="bg-white border border-neutral-200 rounded-xl p-5 mb-6">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-neutral-600 to-neutral-800 flex items-center justify-center text-white text-xl font-medium">
            {(user.user_metadata?.display_name ?? user.email).charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-lg font-semibold text-neutral-900">{(user.user_metadata?.display_name as string) ?? 'Fan'}</p>
            <p className="text-sm text-neutral-500">{user.email}</p>
          </div>
        </div>
      </div>
      <h2 className="text-xl font-semibold text-neutral-900 mb-3 flex items-center gap-2"><Ticket size={20} /> My Tickets</h2>
      <Card className="p-6">
        <p className="text-neutral-400 text-center py-4">No tickets yet. <Link to="/portal/events" className="text-neutral-600 hover:text-neutral-900 underline">Browse events</Link></p>
      </Card>
    </div>
  );
}

function PortalMusicPage() {
  const [releases] = useState<Release[]>(mockData.mockReleases.filter(r => r.status === 'live' || r.status === 'submitted'));
  const [search, setSearch] = useState('');
  const [genreFilter, setGenreFilter] = useState('all');
  const genres = [...new Set(releases.map((r) => r.genre).filter(Boolean))] as string[];
  const filtered = releases.filter((r) => {
    if (genreFilter !== 'all' && r.genre !== genreFilter) return false;
    if (search) { const q = search.toLowerCase(); return r.title.toLowerCase().includes(q); }
    return true;
  });
  return (
    <div className="py-8">
      <h1 className="text-3xl font-bold text-neutral-900 mb-6">Music</h1>
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <Input placeholder="Search releases…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 bg-white border-neutral-200 text-neutral-900" />
        </div>
        {genres.length > 0 && (
          <select value={genreFilter} onChange={(e) => setGenreFilter(e.target.value)} className="bg-white border border-neutral-200 text-neutral-900 rounded-lg px-3 py-2 text-sm">
            <option value="all">All Genres</option>
            {genres.map((g) => <option key={g} value={g}>{g}</option>)}
          </select>
        )}
      </div>
      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <Music size={48} className="text-neutral-200 mx-auto mb-4" />
          <p className="text-neutral-400">No releases available</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((r) => (
            <Link key={r.id} to={`/portal/music/${r.id}`} className="group rounded-xl overflow-hidden bg-white border border-neutral-200 hover:border-neutral-300 transition-colors">
              <div className="aspect-square bg-gradient-to-br from-neutral-100 to-neutral-300 flex items-center justify-center overflow-hidden">
                <Disc3 size={40} className="text-neutral-300 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <div className="p-3">
                <p className="text-sm font-semibold text-neutral-900 truncate">{r.title}</p>
                <p className="text-xs text-neutral-400 mt-0.5">{formatDate(r.release_date)}</p>
                <div className="flex items-center gap-1.5 mt-2">
                  {r.is_free ? <Badge color="green">Free</Badge> : r.price_cents > 0 ? <Badge color="blue">{formatCents(r.price_cents)}</Badge> : null}
                  {r.explicit && <span className="text-xs text-neutral-400">E</span>}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function PortalReleaseDetailPage() {
  const { path, navigate } = useRouter();
  const id = path.split('/portal/music/')[1];
  const release = mockData.mockReleases.find(r => r.id === id);
  const tracks = mockData.mockTracks.filter(t => t.release_id === id);
  const artist = release?.artist_id ? mockData.mockArtists.find(a => a.id === release.artist_id) : null;
  if (!release) return <div className="max-w-2xl mx-auto py-20 text-center"><p className="text-neutral-400">Release not found</p></div>;
  return (
    <div className="max-w-3xl mx-auto py-8">
      <Link to="/portal/music" className="inline-flex items-center gap-1 text-sm text-neutral-500 hover:text-neutral-900 mb-6"><ArrowLeft size={16} /> All Music</Link>
      <div className="flex items-start gap-5 mb-8">
        <div className="w-32 h-32 rounded-xl bg-gradient-to-br from-neutral-100 to-neutral-300 flex items-center justify-center flex-shrink-0">
          <Disc3 size={48} className="text-neutral-300" />
        </div>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-neutral-900">{release.title}</h1>
          <p className="text-lg text-neutral-500 mt-1">{artist?.name ?? 'Unknown Artist'}</p>
          <div className="flex items-center gap-2 mt-3">
            <Badge color="gray">{release.type}</Badge>
            <span className="text-sm text-neutral-400">{formatDate(release.release_date)}</span>
            {release.genre && <Badge color="blue">{release.genre}</Badge>}
            {release.explicit && <Badge color="red">Explicit</Badge>}
          </div>
          {!release.is_free && release.price_cents > 0 && (
            <div className="mt-4 flex items-center gap-3">
              <span className="text-2xl font-bold text-neutral-900">{formatCents(release.price_cents)}</span>
              <Button variant="primary"><ShoppingBagIcon size={16} /> Buy Full Release</Button>
            </div>
          )}
          {release.is_free && <div className="mt-4"><Badge color="green"><Gift size={12} className="inline mr-1" /> Free Release</Badge></div>}
        </div>
      </div>
      <div className="space-y-2">
        {tracks.map((track) => (
          <div key={track.id} className="bg-white border border-neutral-200 rounded-xl p-3">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-sm text-neutral-400 w-6 text-center">{track.position}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-neutral-900 truncate">{track.title}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  {track.is_free ? <span className="text-xs text-green-600">Free</span> : track.price_cents > 0 ? <span className="text-xs text-neutral-500">{formatCents(track.price_cents)}</span> : null}
                  {track.duration_seconds && <span className="text-xs text-neutral-400">{Math.floor(track.duration_seconds / 60)}:{String(track.duration_seconds % 60).padStart(2, '0')}</span>}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PortalEventsPage() {
  const events = mockData.mockTicketEvents;
  return (
    <div className="py-8">
      <h1 className="text-3xl font-bold text-neutral-900 mb-6">Events</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {events.map((e) => (
          <Link key={e.id} to={`/portal/events/${e.id}`} className="group rounded-xl overflow-hidden bg-white border border-neutral-200 hover:border-neutral-300 transition-colors">
            <div className="w-full h-44 bg-gradient-to-br from-neutral-100 to-neutral-300 flex items-center justify-center">
              <Calendar size={32} className="text-neutral-300" />
            </div>
            <div className="p-4">
              <p className="text-xs text-neutral-400 mb-1">{formatDate(e.event_date)}</p>
              <p className="text-lg font-semibold text-neutral-900 mb-1">{e.title}</p>
              <p className="text-sm text-neutral-500">{e.venue_name}{e.city ? `, ${e.city}` : ''}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function PortalEventDetailPage() {
  const { path } = useRouter();
  const id = path.split('/portal/events/')[1];
  const event = mockData.mockTicketEvents.find(e => e.id === id);
  const tiers = mockData.mockTicketTiers.filter(t => t.event_id === id);
  if (!event) return <div className="max-w-2xl mx-auto py-20 text-center"><p className="text-neutral-400">Event not found</p></div>;
  return (
    <div className="max-w-3xl mx-auto py-8">
      <Link to="/portal/events" className="inline-flex items-center gap-1 text-sm text-neutral-500 hover:text-neutral-900 mb-4"><ArrowLeft size={16} /> All Events</Link>
      <h1 className="text-3xl font-bold text-neutral-900 mb-3">{event.title}</h1>
      <div className="space-y-1 text-neutral-600 mb-6">
        <p className="flex items-center gap-2"><Calendar size={16} /> {formatDate(event.event_date)}</p>
        <p className="flex items-center gap-2"><MapPin size={16} /> {event.venue_name}{event.address ? ` — ${event.address}` : ''}</p>
      </div>
      {event.description && <p className="text-neutral-700 mb-8">{event.description}</p>}
      <div className="bg-white border border-neutral-200 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-neutral-900 mb-4 flex items-center gap-2"><Ticket size={20} /> Get Tickets</h2>
        {tiers.length === 0 ? <p className="text-neutral-400 text-center py-4">Tickets coming soon</p> : (
          <div className="space-y-3">
            {tiers.map(t => (
              <div key={t.id} className="flex items-center justify-between p-3 rounded-lg bg-neutral-50">
                <div>
                  <p className="text-sm font-medium text-neutral-900">{t.name}</p>
                  <p className="text-xs text-neutral-500">{formatCents(t.price_cents)} · {t.quantity - t.sold_count} left</p>
                </div>
                <Badge color={t.sold_count >= t.quantity ? 'red' : 'green'}>{t.sold_count >= t.quantity ? 'Sold Out' : 'Available'}</Badge>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function PortalGalleryPage() {
  const galleries = mockData.mockGalleries.filter(g => g.kind === 'image');
  const [activeGallery, setActiveGallery] = useState<CmsGallery | null>(null);
  const [images, setImages] = useState<CmsImage[]>([]);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const openGallery = (g: CmsGallery) => { setActiveGallery(g); setImages(mockData.mockImages.filter(i => i.gallery_id === g.id)); };
  return (
    <div className="py-8">
      <h1 className="text-3xl font-bold text-neutral-900 mb-6">Gallery</h1>
      {activeGallery ? (
        <div>
          <button onClick={() => setActiveGallery(null)} className="text-sm text-neutral-500 hover:text-neutral-900 mb-4">← Back to galleries</button>
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">{activeGallery.title}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {images.map((img, i) => (
              <button key={img.id} onClick={() => setLightbox(i)} className="group relative rounded-lg overflow-hidden bg-neutral-100">
                <img src={img.image_url} alt={img.title ?? ''} className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300" />
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {galleries.map((g) => (
            <button key={g.id} onClick={() => openGallery(g)} className="group rounded-xl overflow-hidden bg-white border border-neutral-200 hover:border-neutral-300 transition-colors text-left">
              {g.cover_image_url ? <img src={g.cover_image_url} alt={g.title} className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300" /> : <div className="w-full h-44 bg-neutral-100 flex items-center justify-center"><ImageIcon size={32} className="text-neutral-300" /></div>}
              <div className="p-4"><p className="text-lg font-semibold text-neutral-900">{g.title}</p></div>
            </button>
          ))}
        </div>
      )}
      {lightbox !== null && images[lightbox] && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={() => setLightbox(null)}>
          <button className="absolute top-4 right-4 text-white/60 hover:text-white" onClick={() => setLightbox(null)}><X size={28} /></button>
          <img src={images[lightbox].image_url} alt={images[lightbox].title ?? ''} className="max-w-full max-h-[85vh] object-contain" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </div>
  );
}

function PortalVideosPage() {
  const galleries = mockData.mockGalleries.filter(g => g.kind === 'video');
  const [activeGallery, setActiveGallery] = useState<CmsGallery | null>(null);
  const [videos, setVideos] = useState<CmsVideo[]>([]);
  const [playing, setPlaying] = useState<CmsVideo | null>(null);
  const openGallery = (g: CmsGallery) => { setActiveGallery(g); setVideos(mockData.mockVideos.filter(v => v.gallery_id === g.id)); };
  return (
    <div className="py-8">
      <h1 className="text-3xl font-bold text-neutral-900 mb-6">Videos</h1>
      {activeGallery ? (
        <div>
          <button onClick={() => setActiveGallery(null)} className="text-sm text-neutral-500 hover:text-neutral-900 mb-4">← Back to galleries</button>
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">{activeGallery.title}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {videos.map((v) => (
              <button key={v.id} onClick={() => setPlaying(v)} className="group rounded-xl overflow-hidden bg-white border border-neutral-200 hover:border-neutral-300 transition-colors text-left">
                <div className="relative h-40 bg-neutral-100">
                  {v.thumbnail_url ? <img src={v.thumbnail_url} alt={v.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" /> : <div className="w-full h-full flex items-center justify-center"><VideoIcon size={32} className="text-neutral-300" /></div>}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10">
                    <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center"><Play size={20} className="text-neutral-900 ml-0.5" /></div>
                  </div>
                </div>
                <div className="p-3"><p className="text-sm font-semibold text-neutral-900">{v.title}</p></div>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {galleries.map((g) => (
            <button key={g.id} onClick={() => openGallery(g)} className="group rounded-xl overflow-hidden bg-white border border-neutral-200 hover:border-neutral-300 transition-colors text-left">
              {g.cover_image_url ? <img src={g.cover_image_url} alt={g.title} className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300" /> : <div className="w-full h-44 bg-neutral-100 flex items-center justify-center"><VideoIcon size={32} className="text-neutral-300" /></div>}
              <div className="p-4"><p className="text-lg font-semibold text-neutral-900">{g.title}</p></div>
            </button>
          ))}
        </div>
      )}
      {playing && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={() => setPlaying(null)}>
          <button className="absolute top-4 right-4 text-white/60 hover:text-white" onClick={() => setPlaying(null)}><X size={28} /></button>
          <div className="max-w-3xl w-full" onClick={(e) => e.stopPropagation()}>
            <div className="aspect-video bg-black rounded-lg overflow-hidden"><video src={playing.video_url} controls autoPlay className="w-full h-full" /></div>
            <div className="mt-4"><p className="text-lg font-semibold text-white">{playing.title}</p></div>
          </div>
        </div>
      )}
    </div>
  );
}

function PortalShopPage() {
  const products = mockData.mockShopProducts;
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const categories = [...new Set(products.map(p => p.category).filter(Boolean))] as string[];
  const filtered = products.filter(p => {
    if (category !== 'all' && p.category !== category) return false;
    if (search) return p.title.toLowerCase().includes(search.toLowerCase());
    return true;
  });
  return (
    <div className="py-8">
      <h1 className="text-3xl font-bold text-neutral-900 mb-6">Shop</h1>
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <Input placeholder="Search products…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 bg-white border-neutral-200 text-neutral-900" />
        </div>
        {categories.length > 0 && (
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="bg-white border border-neutral-200 text-neutral-900 rounded-lg px-3 py-2 text-sm">
            <option value="all">All Categories</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        )}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map(p => (
          <div key={p.id} className="group rounded-xl overflow-hidden bg-white border border-neutral-200 hover:border-neutral-300 transition-colors">
            <div className="aspect-square bg-neutral-100 overflow-hidden">
              {p.image_url ? <img src={p.image_url} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" /> : <div className="w-full h-full flex items-center justify-center"><ShoppingBag size={32} className="text-neutral-300" /></div>}
            </div>
            <div className="p-3">
              <p className="text-sm font-semibold text-neutral-900 truncate">{p.title}</p>
              {p.category && <p className="text-xs text-neutral-400 mt-0.5">{p.category}</p>}
              <div className="flex items-center justify-between mt-2">
                <span className="text-lg font-bold text-neutral-900">{formatCents(Math.round(p.price * 100))}</span>
                {p.inventory_count <= 5 && p.inventory_count > 0 && <Badge color="amber">Only {p.inventory_count} left</Badge>}
                {p.inventory_count === 0 && <Badge color="red">Sold Out</Badge>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PortalToursPage() {
  const tours = mockData.mockTourDates;
  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-3xl font-bold text-neutral-900 mb-6">Tour Dates</h1>
      <div className="space-y-3">
        {tours.map(t => {
          const dateObj = new Date(t.date);
          return (
            <div key={t.id} className="flex items-center gap-4 p-4 rounded-xl bg-white border border-neutral-200 hover:border-neutral-300 transition-colors">
              <div className="flex-shrink-0 text-center w-14">
                <p className="text-xs text-neutral-400 uppercase">{dateObj.toLocaleDateString('en', { month: 'short' })}</p>
                <p className="text-2xl font-bold text-neutral-900">{dateObj.getDate()}</p>
                <p className="text-xs text-neutral-400">{dateObj.getFullYear()}</p>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-neutral-900">{t.title}</p>
                <p className="text-sm text-neutral-500 flex items-center gap-1 mt-0.5"><MapPin size={12} /> {t.venue}{t.city ? `, ${t.city}` : ''}</p>
              </div>
              <div className="flex-shrink-0">
                {t.is_sold_out ? <Badge color="red">Sold Out</Badge> : <Link to={`/portal/events/${t.ticket_event_id}`} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-neutral-900 text-white text-sm font-medium hover:bg-neutral-700"><Ticket size={14} /> Tickets</Link>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PortalLoyaltyPage() {
  const { user } = usePortalAuth();
  const { navigate } = useRouter();
  if (!user) { navigate('/portal/login'); return null; }
  const loyalty = mockData.mockUserLoyalty;
  const TIER_COLORS: Record<string, string> = { fan: 'from-neutral-600 to-neutral-800', silver: 'from-gray-400 to-gray-600', gold: 'from-amber-400 to-amber-600', platinum: 'from-cyan-300 to-cyan-500' };
  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-3xl font-bold text-neutral-900 mb-6">My Account</h1>
      <div className={`relative rounded-2xl p-6 mb-6 bg-gradient-to-br ${TIER_COLORS[loyalty.tier]} overflow-hidden`}>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-12 translate-x-12" />
        <div className="relative">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-xs uppercase tracking-wider text-white/60">Loyalty Tier</p>
              <p className="text-2xl font-bold text-white capitalize">{loyalty.tier}</p>
            </div>
            <Award size={32} className="text-white/40" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><p className="text-xs text-white/60">Total Points</p><p className="text-xl font-bold text-white">{loyalty.total_points.toLocaleString()}</p></div>
            <div><p className="text-xs text-white/60">Lifetime Spend</p><p className="text-xl font-bold text-white">{formatCents(Math.round(loyalty.lifetime_spend * 100))}</p></div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============ PRO PORTAL (LIGHT THEME) ============


// ============ FAN CLUB - NEW PAGES ============

// ─── Membership Tiers Page ───
const MEMBERSHIP_TIERS = [
  {
    id: 'entry',
    name: 'Entry',
    price: '$4',
    period: '/mo',
    annual: '$40/yr (save 2 months)',
    color: 'border-neutral-200',
    headerBg: 'bg-neutral-50',
    badgeColor: 'bg-neutral-100 text-neutral-700',
    iconBg: 'bg-neutral-100',
    features: [
      'Early access to music & merch drops',
      'Exclusive digital downloads (unreleased tracks, wallpapers)',
      'Members-only discount codes',
      'Access to fan community feed',
    ],
    cta: 'Start with Entry',
  },
  {
    id: 'core',
    name: 'Core',
    price: '$12',
    period: '/mo',
    annual: '$120/yr (save 2 months)',
    color: 'border-neutral-900 ring-1 ring-neutral-900',
    headerBg: 'bg-neutral-900',
    badgeColor: 'bg-white text-neutral-900',
    iconBg: 'bg-white/10',
    popular: true,
    features: [
      'Everything in Entry',
      'Monthly Q&A sessions with the artist',
      'Behind-the-scenes photos, videos & blogs',
      'Exclusive live stream access',
      'Ticket pre-sale codes (48h before public)',
      'Limited-edition merch drops (first chance)',
    ],
    cta: 'Join Core',
  },
  {
    id: 'premium',
    name: 'Premium',
    price: '$28',
    period: '/mo',
    annual: '$280/yr (save 2 months)',
    color: 'border-neutral-300',
    headerBg: 'bg-neutral-800',
    badgeColor: 'bg-neutral-100 text-neutral-800',
    iconBg: 'bg-white/10',
    features: [
      'Everything in Core',
      'Premium on-demand documentaries & interviews',
      'Raffle entries for limited-edition merch',
      'First priority for in-person meetup tickets',
      'Annual exclusive merch bundle (hoodie + signed print + vinyl)',
      '1-on-1 video call (1 per year, 15 min)',
    ],
    cta: 'Go Premium',
  },
];

function MembershipPage() {
  const [selectedTier, setSelectedTier] = useState('core');
  const [billing, setBilling] = useState<'monthly' | 'annual'>('annual');

  return (
    <div className="max-w-5xl mx-auto py-8">
      <div className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-3">Membership Tiers</h1>
        <p className="text-lg text-neutral-500 max-w-xl mx-auto">
          Pick the tier that matches your passion. Every level gives you more access, more content, and more connection to the artist.
        </p>
      </div>

      {/* Billing toggle */}
      <div className="flex items-center justify-center gap-3 mb-8">
        <button
          onClick={() => setBilling('monthly')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            billing === 'monthly' ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
          }`}
        >
          Monthly
        </button>
        <button
          onClick={() => setBilling('annual')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            billing === 'annual' ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
          }`}
        >
          Annual (save 2 months)
        </button>
      </div>

      {/* Tier cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {MEMBERSHIP_TIERS.map((tier) => (
          <div
            key={tier.id}
            className={`relative rounded-xl overflow-hidden ${tier.color} ${selectedTier === tier.id ? 'shadow-lg' : 'shadow-sm'} transition-all cursor-pointer`}
            onClick={() => setSelectedTier(tier.id)}
          >
            {tier.popular && (
              <div className="absolute top-4 right-4">
                <span className={`px-2 py-1 rounded-full text-xs font-bold ${tier.badgeColor}`}>Most Popular</span>
              </div>
            )}
            {/* Header */}
            <div className={`${tier.headerBg} px-6 py-6 text-center`}>
              <p className={`text-xs font-bold uppercase tracking-wider mb-2 ${tier.headerBg === 'bg-neutral-900' || tier.headerBg === 'bg-neutral-800' ? 'text-white/60' : 'text-neutral-400'}`}>
                {tier.name}
              </p>
              <p className={`text-4xl font-bold ${tier.headerBg === 'bg-neutral-900' || tier.headerBg === 'bg-neutral-800' ? 'text-white' : 'text-neutral-900'}`}>
                {tier.price}<span className="text-lg font-normal">{tier.period}</span>
              </p>
              {billing === 'annual' && (
                <p className={`text-xs mt-1 ${tier.headerBg === 'bg-neutral-900' || tier.headerBg === 'bg-neutral-800' ? 'text-white/40' : 'text-neutral-400'}`}>
                  {tier.annual}
                </p>
              )}
            </div>
            {/* Features */}
            <div className="bg-white px-6 py-6">
              <ul className="space-y-3">
                {tier.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 size={16} className="text-neutral-400 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-neutral-700">{f}</span>
                  </li>
                ))}
              </ul>
              <button
                className={`w-full mt-6 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  selectedTier === tier.id
                    ? 'bg-neutral-900 text-white hover:bg-neutral-700'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
                onClick={(e) => { e.stopPropagation(); setSelectedTier(tier.id); }}
              >
                {tier.cta}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Monetization Strategy Summary */}
      <div className="mt-12 border border-neutral-200 rounded-xl p-6 bg-white">
        <h2 className="text-xl font-bold text-neutral-900 mb-4">How This Works for the Artist</h2>
        <p className="text-sm text-neutral-600 mb-6 leading-relaxed">
          A fan club is more than just a community — it is a crucial source of funding and a direct avenue to build a sustainable career. By offering tiered memberships, the artist can monetize their talent while fostering a loyal fanbase that feels genuinely connected to the journey.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200">
            <h3 className="text-sm font-semibold text-neutral-900 mb-2 flex items-center gap-2"><DollarSign size={16} /> Recurring Revenue</h3>
            <p className="text-xs text-neutral-500 leading-relaxed">Predictable monthly income from tiered subscriptions. Casual fans pay a little, superfans pay more.</p>
          </div>
          <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200">
            <h3 className="text-sm font-semibold text-neutral-900 mb-2 flex items-center gap-2"><ShoppingBag size={16} /> Direct Sales</h3>
            <p className="text-xs text-neutral-500 leading-relaxed">High-margin revenue through scarcity and exclusivity — limited drops, presale codes, PPV archives.</p>
          </div>
          <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200">
            <h3 className="text-sm font-semibold text-neutral-900 mb-2 flex items-center gap-2"><Crown size={16} /> Experience Upsells</h3>
            <p className="text-xs text-neutral-500 leading-relaxed">Premium one-time fees for deep personal connections — VIP meetups, 1-on-1 calls, annual bundles.</p>
          </div>
        </div>
      </div>

      {/* Smart Tactics */}
      <div className="mt-6 border border-neutral-200 rounded-xl p-6 bg-white">
        <h2 className="text-xl font-bold text-neutral-900 mb-4">Smart Monetization Tactics</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0"><Sparkles size={18} className="text-amber-600" /></div>
            <div>
              <p className="text-sm font-semibold text-neutral-900">Free Trial Funnel</p>
              <p className="text-xs text-neutral-500 mt-1">Give one BTS piece away for free on social, then say "Want the full documentary? Join the club." Converts casual fans into paying members.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0"><Clock size={18} className="text-red-600" /></div>
            <div>
              <p className="text-sm font-semibold text-neutral-900">Expiring Perks</p>
              <p className="text-xs text-neutral-500 mt-1">Digital downloads available for only 30 days. Fans stay subscribed so they never miss the next drop.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0"><Gift size={18} className="text-emerald-600" /></div>
            <div>
              <p className="text-sm font-semibold text-neutral-900">Annual Billing Discount</p>
              <p className="text-xs text-neutral-500 mt-1">2 months free if fans pay for a full year upfront — gives the artist a large cash injection immediately.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0"><Target size={18} className="text-purple-600" /></div>
            <div>
              <p className="text-sm font-semibold text-neutral-900">The Holy Grail Upsell</p>
              <p className="text-xs text-neutral-500 mt-1">Always keep one premium item (video call, signed vinyl) as a paid upsell outside the subscription — the ultimate collector experience.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Monetization Summary Table */}
      <div className="mt-6 border border-neutral-200 rounded-xl overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-neutral-50 border-b border-neutral-200">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-neutral-900">Feature</th>
                <th className="px-4 py-3 text-left font-semibold text-neutral-900">Monetization Strategy</th>
                <th className="px-4 py-3 text-left font-semibold text-neutral-900">Revenue Type</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              <tr className="hover:bg-neutral-50 transition-colors">
                <td className="px-4 py-3 text-neutral-700">Early Music / Merch Access</td>
                <td className="px-4 py-3 text-neutral-500">Gated behind monthly subscription</td>
                <td className="px-4 py-3"><Badge color="green">Recurring</Badge></td>
              </tr>
              <tr className="hover:bg-neutral-50 transition-colors">
                <td className="px-4 py-3 text-neutral-700">Limited-Edition Merch</td>
                <td className="px-4 py-3 text-neutral-500">Sold at premium price with low supply</td>
                <td className="px-4 py-3"><Badge color="blue">One-time Sale</Badge></td>
              </tr>
              <tr className="hover:bg-neutral-50 transition-colors">
                <td className="px-4 py-3 text-neutral-700">Discount Codes</td>
                <td className="px-4 py-3 text-neutral-500">Drives merch volume; member pays to unlock</td>
                <td className="px-4 py-3"><Badge color="gray">Indirect</Badge></td>
              </tr>
              <tr className="hover:bg-neutral-50 transition-colors">
                <td className="px-4 py-3 text-neutral-700">Monthly Q&A</td>
                <td className="px-4 py-3 text-neutral-500">Included in mid/high tiers to justify upgrades</td>
                <td className="px-4 py-3"><Badge color="green">Recurring</Badge></td>
              </tr>
              <tr className="hover:bg-neutral-50 transition-colors">
                <td className="px-4 py-3 text-neutral-700">BTS Content</td>
                <td className="px-4 py-3 text-neutral-500">Gateway content to convert free followers to paid</td>
                <td className="px-4 py-3"><Badge color="green">Recurring</Badge></td>
              </tr>
              <tr className="hover:bg-neutral-50 transition-colors">
                <td className="px-4 py-3 text-neutral-700">Live Streams</td>
                <td className="px-4 py-3 text-neutral-500">Free for members; $5 PPV for non-members</td>
                <td className="px-4 py-3"><Badge color="blue">Recurring + One-time</Badge></td>
              </tr>
              <tr className="hover:bg-neutral-50 transition-colors">
                <td className="px-4 py-3 text-neutral-700">Premium Video Docs</td>
                <td className="px-4 py-3 text-neutral-500">Gated to highest-priced tier only</td>
                <td className="px-4 py-3"><Badge color="green">Recurring (higher ARPU)</Badge></td>
              </tr>
              <tr className="hover:bg-neutral-50 transition-colors">
                <td className="px-4 py-3 text-neutral-700">In-Person VIP Meetups</td>
                <td className="px-4 py-3 text-neutral-500">Separate ticketed event outside monthly fee</td>
                <td className="px-4 py-3"><Badge color="blue">One-time High Ticket</Badge></td>
              </tr>
              <tr className="hover:bg-neutral-50 transition-colors">
                <td className="px-4 py-3 text-neutral-700">Co-Branded Collabs</td>
                <td className="px-4 py-3 text-neutral-500">Affiliate % or flat fee from brand partnerships</td>
                <td className="px-4 py-3"><Badge color="gray">Sponsorship</Badge></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── Exclusive Access Page ───
const EXCLUSIVE_FEATURES = [
  {
    category: 'Early Access & Releases',
    items: [
      { icon: <Music size={20} className="text-emerald-600" />, title: 'Early Access to Music', desc: 'Sneak peeks and first-purchase opportunities for new music before the general public. Never miss a drop.', bgColor: 'bg-emerald-50' },
      { icon: <ShoppingBag size={20} className="text-purple-600" />, title: 'Limited Edition Merch', desc: 'Unique, collectible products designed exclusively for fan club members. Small-batch, numbered, and never reprinted.', bgColor: 'bg-purple-50' },
      { icon: <Download size={20} className="text-blue-600" />, title: 'Exclusive Digital Downloads', desc: 'Unreleased tracks, music videos, wallpapers, printable artwork, and lyric sheets — available only to members.', bgColor: 'bg-blue-50' },
    ],
  },
  {
    category: 'Financial Perks & Loyalty Rewards',
    items: [
      { icon: <DollarSign size={20} className="text-amber-600" />, title: 'Exclusive Discounts', desc: 'Special pricing and sales on music, merchandise, and concert tickets as a thank you for your loyalty and support.', bgColor: 'bg-amber-50' },
      { icon: <Ticket size={20} className="text-teal-600" />, title: 'Ticket Pre-Sales', desc: 'Get a unique code to buy concert tickets 48 hours before the general public. Secure your spot at every show.', bgColor: 'bg-teal-50' },
    ],
  },
  {
    category: 'Interactive Experiences',
    items: [
      { icon: <MessageSquare size={20} className="text-rose-600" />, title: 'Monthly Q&A Sessions', desc: 'Regular opportunities for members to ask questions and connect personally with the artist in live group sessions.', bgColor: 'bg-rose-50' },
      { icon: <Heart size={20} className="text-pink-600" />, title: 'Meet & Greet VIP Access', desc: 'VIP meet-and-greet opportunities at select events — soundcheck parties, dinner meetups, and private hangouts.', bgColor: 'bg-pink-50' },
    ],
  },
];

function ExclusivePage() {
  return (
    <div className="max-w-5xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-3">Exclusive Access & Releases</h1>
        <p className="text-lg text-neutral-500 max-w-xl">
          What you get when you join. Every tier unlocks more — from early drops to in-person VIP experiences.
        </p>
      </div>

      {EXCLUSIVE_FEATURES.map((cat) => (
        <section key={cat.category} className="mb-10">
          <h2 className="text-xl font-bold text-neutral-900 mb-4">{cat.category}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {cat.items.map((item) => (
              <div key={item.title} className={`${item.bgColor} border border-neutral-200 rounded-xl p-5 transition-colors hover:border-neutral-300`}>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">{item.icon}</div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-neutral-900">{item.title}</h3>
                    <p className="text-xs text-neutral-500 mt-1 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}

      {/* Upsell callout */}
      <div className="mt-8 bg-neutral-900 rounded-xl p-6 text-center">
        <Crown size={32} className="text-white/40 mx-auto mb-3" />
        <h2 className="text-2xl font-bold text-white mb-2">Ready to unlock everything?</h2>
        <p className="text-sm text-white/60 mb-4">Start with Entry for $4/mo — or go all-in with Premium at $28/mo for the ultimate fan experience.</p>
        <Link to="/portal/membership" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white text-neutral-900 font-medium hover:bg-white/90 transition-colors">
          View Membership Tiers <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}

// ─── Community Hub Page ───
const COMMUNITY_FEATURES = [
  { icon: <Radio size={24} className="text-neutral-700" />, title: 'Live Streams', desc: 'Exclusive broadcasts of live performances, studio sessions, and intimate sets — members-only access to moments you won\'t find anywhere else.', badge: 'Core & Premium' },
  { icon: <MessageSquare size={24} className="text-neutral-700" />, title: 'Monthly Q&A Sessions', desc: 'Regular live Q&A sessions where you can ask questions directly. The artist answers in real time — no filter, no delay.', badge: 'Core & Premium' },
  { icon: <UsersIcon size={24} className="text-neutral-700" />, title: 'Social Spaces', desc: 'Connect with other fans in exclusive community channels. Share thoughts, discuss new releases, and build friendships with people who share your passion.', badge: 'All Tiers' },
  { icon: <Calendar size={24} className="text-neutral-700" />, title: 'In-Person Meetups', desc: 'Special meetups and events to foster community and show appreciation. Soundcheck parties, local hangouts, and annual fan gatherings.', badge: 'Premium Priority' },
  { icon: <Bell size={24} className="text-neutral-700" />, title: 'In-App Notifications', desc: 'Never miss a drop, a stream, or an event. Push notifications keep you in the loop on everything happening in the community.', badge: 'All Tiers' },
  { icon: <Activity size={24} className="text-neutral-700" />, title: 'Fan Leaderboard', desc: 'See where you rank among the community. Points earned from engagement, purchases, and attendance — climb the board and earn recognition.', badge: 'All Tiers' },
];

const UPCOMING_EVENTS_DATA = [
  { title: 'Studio Session Live Stream', date: 'Aug 12, 2026', time: '7:00 PM EST', type: 'Live Stream', tier: 'Core+' },
  { title: 'Monthly Q&A: Ask Adea Anything', date: 'Aug 15, 2026', time: '3:00 PM EST', type: 'Q&A', tier: 'Core+' },
  { title: 'Philadelphia Fan Meetup', date: 'Sep 20, 2026', time: '6:00 PM EST', type: 'In-Person', tier: 'Premium' },
  { title: 'Fall Tour Pre-Sale Opens', date: 'Oct 1, 2026', time: '12:00 PM EST', type: 'Pre-Sale', tier: 'Entry+' },
];

function CommunityPage() {
  return (
    <div className="max-w-5xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-3">Community Hub</h1>
        <p className="text-lg text-neutral-500 max-w-xl">
          Where fans connect, interact, and experience the music together. Live streams, Q&As, meetups, and social spaces — all in one place.
        </p>
      </div>

      {/* Community features */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        {COMMUNITY_FEATURES.map((f) => (
          <div key={f.title} className="bg-white border border-neutral-200 rounded-xl p-5 transition-colors hover:border-neutral-300">
            <div className="flex items-center gap-2 mb-3">
              {f.icon}
              <h3 className="text-sm font-semibold text-neutral-900">{f.title}</h3>
            </div>
            <p className="text-xs text-neutral-500 leading-relaxed mb-3">{f.desc}</p>
            <Badge color="gray" className="text-xs">{f.badge}</Badge>
          </div>
        ))}
      </div>

      {/* Upcoming community events */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-neutral-900 mb-4">Upcoming Community Events</h2>
        <div className="bg-white border border-neutral-200 rounded-xl divide-y divide-neutral-100">
          {UPCOMING_EVENTS_DATA.map((ev, i) => (
            <div key={i} className="flex items-center justify-between px-5 py-4 hover:bg-neutral-50 transition-colors">
              <div>
                <p className="text-sm font-semibold text-neutral-900">{ev.title}</p>
                <p className="text-xs text-neutral-500 mt-0.5">{ev.date} · {ev.time}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge color="gray" className="text-xs">{ev.type}</Badge>
                <Badge color="green" className="text-xs">{ev.tier}</Badge>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Join prompt */}
      <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-6 text-center">
        <h2 className="text-xl font-bold text-neutral-900 mb-2">Not a member yet?</h2>
        <p className="text-sm text-neutral-500 mb-4">Join the community to unlock live streams, Q&As, and exclusive social spaces.</p>
        <Link to="/portal/membership" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-neutral-900 text-white font-medium hover:bg-neutral-700 transition-colors">
          Choose Your Tier <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}

// ─── Premium Content Page ───
const CONTENT_CATEGORIES = [
  {
    title: 'Behind-the-Scenes',
    icon: <Eye size={20} className="text-neutral-700" />,
    items: [
      { title: 'Studio Session: Midnight Echoes', type: 'Photo Gallery', date: 'Jul 15, 2026', tier: 'Core+', duration: '24 photos' },
      { title: 'Making of Urban Frequencies', type: 'Video Documentary', date: 'Jun 28, 2026', tier: 'Core+', duration: '18 min' },
      { title: 'Tour Rehearsal Clips', type: 'Short Video', date: 'Jul 20, 2026', tier: 'Entry+', duration: '5 min' },
    ],
  },
  {
    title: 'Premium Video Content',
    icon: <VideoIcon size={20} className="text-neutral-700" />,
    items: [
      { title: 'Adea Lyric: The Story So Far', type: 'Feature Documentary', date: 'May 10, 2026', tier: 'Premium', duration: '45 min' },
      { title: 'Exclusive Interview: On Creativity & Process', type: 'Interview', date: 'Jun 5, 2026', tier: 'Premium', duration: '22 min' },
      { title: 'Live at The Fillmore — Full Performance', type: 'Concert Film', date: 'Apr 20, 2026', tier: 'Core+', duration: '90 min' },
    ],
  },
  {
    title: 'Live Streams',
    icon: <Radio size={20} className="text-neutral-700" />,
    items: [
      { title: 'Studio Session — Writing New Material', type: 'Live Stream', date: 'Aug 12, 2026', tier: 'Core+', duration: 'Live' },
      { title: 'Adea Answers: Monthly Fan Q&A', type: 'Live Q&A', date: 'Aug 15, 2026', tier: 'Core+', duration: '60 min' },
      { title: 'Intimate Acoustic Set — Members Only', type: 'Live Performance', date: 'Sep 1, 2026', tier: 'Premium', duration: '45 min' },
    ],
  },
  {
    title: 'Collaborative Content',
    icon: <Handshake size={20} className="text-neutral-700" />,
    items: [
      { title: 'Co-Branded Merch Drop with Waverly Supply Co.', type: 'Shoppable Collab', date: 'Aug 25, 2026', tier: 'Core+', duration: 'Limited run' },
    ],
  },
];

function PremiumContentPage() {
  return (
    <div className="max-w-5xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-3">Premium Content & Storytelling</h1>
        <p className="text-lg text-neutral-500 max-w-xl">
          A Netflix for fans. Behind-the-scenes, documentaries, live streams, and exclusive interviews — all on demand.
        </p>
      </div>

      {CONTENT_CATEGORIES.map((cat) => (
        <section key={cat.title} className="mb-8">
          <h2 className="text-lg font-bold text-neutral-900 mb-3 flex items-center gap-2">
            {cat.icon} {cat.title}
          </h2>
          <div className="bg-white border border-neutral-200 rounded-xl divide-y divide-neutral-100">
            {cat.items.map((item) => (
              <div key={item.title} className="flex items-center justify-between px-5 py-4 hover:bg-neutral-50 transition-colors cursor-pointer">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-neutral-900 truncate">{item.title}</p>
                  <p className="text-xs text-neutral-500 mt-0.5">{item.type} · {item.date} · {item.duration}</p>
                </div>
                <Badge color={item.tier === 'Premium' ? 'amber' : item.tier === 'Core+' ? 'green' : 'gray'} className="text-xs">{item.tier}</Badge>
              </div>
            ))}
          </div>
        </section>
      ))}

      {/* Upsell */}
      <div className="mt-8 bg-neutral-900 rounded-xl p-6 text-center">
        <VideoIcon size={32} className="text-white/40 mx-auto mb-3" />
        <h2 className="text-2xl font-bold text-white mb-2">Unlock the full library</h2>
        <p className="text-sm text-white/60 mb-4">From BTS photos to feature-length documentaries — Premium members get it all, on demand.</p>
        <Link to="/portal/membership" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white text-neutral-900 font-medium hover:bg-white/90 transition-colors">
          Upgrade to Premium <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}



function ProApp() {
  const { path, navigate } = useRouter();
  const { portalUser } = useProAuth();

  if (path === '/pro/login' || path === '/pro/login/') return <ProLoginPage />;
  if (path === '/pro/signup' || path.startsWith('/pro/signup')) return <ProSignupPage />;
  if (path === '/pro/pending') return <ProPendingPage />;
  if (path === '/pro/suspended') return <ProSuspendedPage />;

  const roleFromPath = path.startsWith('/pro/dashboard/label') ? 'label' : path.startsWith('/pro/dashboard/booking') ? 'booking' : path.startsWith('/pro/dashboard/writer') ? 'writer' : path.startsWith('/pro/dashboard/admin') ? 'admin' : null;
  const role = roleFromPath ?? portalUser?.role ?? 'label';

  if (path === '/pro/dashboard/label' || path === '/pro/dashboard/label/') return <ProPortalShell role="label"><LabelOverview /></ProPortalShell>;
  if (path === '/pro/dashboard/label/catalog') return <ProPortalShell role="label"><LabelCatalog /></ProPortalShell>;
  if (path === '/pro/dashboard/label/requests') return <ProPortalShell role="label"><LabelRequests /></ProPortalShell>;
  if (path === '/pro/dashboard/label/deals') return <ProPortalShell role="label"><LabelDeals /></ProPortalShell>;
  if (path === '/pro/dashboard/label/custom') return <ProPortalShell role="label"><LabelCustomWrite /></ProPortalShell>;
  if (path === '/pro/dashboard/label/messages') return <ProPortalShell role="label"><LabelMessages /></ProPortalShell>;
  if (path === '/pro/dashboard/label/documents') return <ProPortalShell role="label"><LabelDocuments /></ProPortalShell>;
  if (path === '/pro/dashboard/booking' || path === '/pro/dashboard/booking/') return <ProPortalShell role="booking"><BookingOverview /></ProPortalShell>;
  if (path.startsWith('/pro/dashboard/booking/')) return <ProPortalShell role="booking"><GenericProPage title={path.split('/pro/dashboard/booking/')[1]} role="booking" /></ProPortalShell>;
  if (path === '/pro/dashboard/writer' || path === '/pro/dashboard/writer/') return <ProPortalShell role="writer"><WriterOverview /></ProPortalShell>;
  if (path.startsWith('/pro/dashboard/writer/')) return <ProPortalShell role="writer"><GenericProPage title={path.split('/pro/dashboard/writer/')[1]} role="writer" /></ProPortalShell>;
  if (path === '/pro/dashboard/admin' || path === '/pro/dashboard/admin/') return <ProPortalShell role="admin"><ProAdminDashboard /></ProPortalShell>;
  if (path.startsWith('/pro/dashboard/admin/')) return <ProPortalShell role="admin"><GenericProPage title={path.split('/pro/dashboard/admin/')[1]} role="admin" /></ProPortalShell>;

  // ─── Default Pro landing (no sub-path specified) ───
  if (path === '/pro' || path === '/pro/') return <ProPortalShell role={role}><LabelOverview /></ProPortalShell>;

  // New Industry & Sync Portal routes
  if (path === '/pro/catalog/releases') return <ProPortalShell role={role}><ProCatalogReleasesPage /></ProPortalShell>;
  if (path === '/pro/catalog/tracks') return <ProPortalShell role={role}><ProCatalogTracksPage /></ProPortalShell>;
  if (path === '/pro/catalog/assets') return <ProPortalShell role={role}><ProCatalogAssetsPage /></ProPortalShell>;
  if (path === '/pro/distribution/status') return <ProPortalShell role={role}><ProDistributionStatusPage /></ProPortalShell>;
  if (path === '/pro/distribution/submit') return <ProPortalShell role={role}><ProDistributionSubmitPage /></ProPortalShell>;
  if (path === '/pro/distribution/corrections') return <ProPortalShell role={role}><ProDistributionCorrectionsPage /></ProPortalShell>;
  if (path === '/pro/sync/search') return <ProPortalShell role={role}><ProSyncSearchPage /></ProPortalShell>;
  if (path === '/pro/sync/deals') return <ProPortalShell role={role}><ProSyncDealRoomsPage /></ProPortalShell>;
  if (path === '/pro/sync/workspace') return <ProPortalShell role={role}><ProSyncWorkspacePage /></ProPortalShell>;
  if (path === '/pro/sync/history') return <ProPortalShell role={role}><ProSyncLicenseHistoryPage /></ProPortalShell>;
  if (path === '/pro/rights') return <ProPortalShell role={role}><ProRightsPage /></ProPortalShell>;
  if (path === '/pro/royalties') return <ProPortalShell role={role}><ProRoyaltiesPage /></ProPortalShell>;
  if (path === '/pro/analytics') return <ProPortalShell role={role}><ProAnalyticsPage /></ProPortalShell>;
  if (path === '/pro/settings') return <ProPortalShell role={role}><ProSettingsPage /></ProPortalShell>;

  // ─── Fallback: redirect to the label dashboard for unknown /pro/ routes ───
  navigate('/pro/dashboard/label');
  return null;
}

function ProLoginPage() {
  const { signIn } = useProAuth();
  const { navigate } = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const submit = async () => {
    if (!email || !password) { toast('error', 'Email and password are required'); return; }
    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);
    if (error) { toast('error', error); return; }
    const stored = localStorage.getItem('pro-auth-session');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const pu = parsed.portalUser;
        if (pu?.status === 'pending') { navigate('/pro/pending'); return; }
        if (pu?.status === 'suspended') { navigate('/pro/suspended'); return; }
        // Smart redirect based on role
        if (pu?.role === 'writer') { navigate('/writer'); return; }
        if (pu?.role === 'admin') { navigate('/admin'); return; }
        if (pu?.role === 'booking') { navigate('/pro/dashboard/booking'); return; }
        navigate('/pro/dashboard/label');
      } catch { navigate('/pro/dashboard/label'); }
    } else {
      navigate('/pro/dashboard/label');
    }
  };
  return (
    <div className="min-h-screen bg-white font-sans flex flex-col">
      <div className="flex-1 flex flex-col lg:flex-row">
        <div className="lg:w-1/2 flex flex-col justify-between p-8 sm:p-12 lg:p-16 bg-gradient-to-br from-neutral-50 to-white border-r border-neutral-100">
          <div>
            <p className="text-xs tracking-[0.2em] text-neutral-300 uppercase mb-8">Adea Lyric</p>
            <h1 className="text-4xl sm:text-5xl font-bold leading-tight text-neutral-900 mb-4">Professional<br />sign in.</h1>
            <p className="text-lg text-neutral-500 max-w-md leading-relaxed">Access your industry, sync, booking, or writer dashboard. You'll be routed to the right portal based on your role.</p>
          </div>
          <div className="mt-8 pt-8 border-t border-neutral-100"><p className="text-xs text-neutral-300">West Philadelphia · 2026</p></div>
        </div>
        <div className="lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-16 bg-white">
          <div className="w-full max-w-sm">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center"><Building2 size={20} className="text-white" /></div>
              <div><p className="text-xs font-bold tracking-[0.15em] uppercase text-neutral-500">Professional Portal</p><p className="text-sm font-semibold text-neutral-900">Sign In</p></div>
            </div>
            <div className="border border-neutral-200 rounded-xl p-6 space-y-4 bg-white">
              <Field label="Email"><div className="relative"><Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" /><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-9 border-neutral-200 bg-white text-neutral-900 placeholder:text-neutral-400" placeholder="you@company.com" /></div></Field>
              <Field label="Password"><div className="relative"><Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" /><Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-9 border-neutral-200 bg-white text-neutral-900 placeholder:text-neutral-400" placeholder="Your password" onKeyDown={(e) => e.key === 'Enter' && submit()} /></div></Field>
              <Button variant="primary" className="w-full bg-blue-600 text-white hover:bg-blue-700 flex items-center justify-center gap-2" onClick={submit} disabled={loading}>{loading ? 'Signing in...' : 'Sign In'} <ArrowRight size={16} /></Button>
            </div>
            <div className="mt-6 text-center space-y-2">
              <p className="text-sm text-neutral-500">Need access? <button onClick={() => navigate('/pro/signup')} className="text-blue-600 hover:underline font-medium">Request industry access</button> or <button onClick={() => navigate('/pro/signup?role=writer')} className="text-violet-600 hover:underline font-medium">Request writer access</button></p>
              <p className="text-sm text-neutral-500">Looking for a different portal? <button onClick={() => navigate('/')} className="text-neutral-900 hover:underline font-medium">Go back</button></p>
              <p className="text-xs text-neutral-400 mt-2">Demo accounts: admin@test.com, label@test.com, booking@test.com, writer@test.com (any password)</p>
              <p className="text-xs text-neutral-400 mt-1">Or navigate directly to the <button onClick={() => navigate('/admin')} className="text-neutral-900 hover:underline font-medium">Admin Dashboard</button></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProSignupPage() {
  const { signUp } = useProAuth();
  const { navigate, path } = useRouter();
  // Determine if this is a Writer signup (from Writer portal card) or Industry signup
  const isWriterSignup = (() => {
    const params = new URLSearchParams(path.split('?')[1] || '');
    return params.get('role') === 'writer';
  })();
  const [step, setStep] = useState<'role' | 'perks' | 'details'>(isWriterSignup ? 'perks' : 'role');
  const [selectedRole, setSelectedRole] = useState(isWriterSignup ? 'writer' : '');
  const [form, setForm] = useState({ email: '', password: '', orgName: '', displayName: '' });
  const [loading, setLoading] = useState(false);
  // Industry roles ONLY — writers have their own portal and signup flow
  const INDUSTRY_ROLES = [
    { value: 'label', label: 'Label / Sync Agent', desc: 'Browse catalog, request sync licenses, negotiate deals', icon: Building2, color: 'bg-blue-600' },
    { value: 'booking', label: 'Booking Agent', desc: 'View EPK, check availability, submit booking requests', icon: Music, color: 'bg-blue-600' },
  ];
  const WRITER_ROLE = { value: 'writer', label: 'Writer / Collaborator', desc: 'View open collab calls, submit demos, buy songs', icon: PenLine, color: 'bg-violet-600' };
  const ROLES = isWriterSignup ? [WRITER_ROLE] : INDUSTRY_ROLES;
  const ROLE_PERKS: Record<string, { label: string }[]> = {
    label: [{ label: 'Full sync catalog with metadata' }, { label: 'Request sync licenses directly' }, { label: 'Deal history & contract management' }, { label: 'Direct messaging with artist team' }, { label: 'Custom write request submission' }],
    booking: [{ label: 'Artist EPK & press materials' }, { label: 'Real-time availability calendar' }, { label: 'Submit booking requests' }, { label: 'Manage bookings & documents' }, { label: 'Direct messaging with artist team' }],
    writer: [{ label: 'Browse open collaboration calls' }, { label: 'Submit demos & pitches' }, { label: 'Buy songs outright' }, { label: 'Track submission status' }, { label: 'Direct messaging with artist team' }],
  };
  const submit = async () => {
    if (!form.email || !form.password || !selectedRole) { toast('error', 'All fields are required'); return; }
    if (form.password.length < 8) { toast('error', 'Password must be at least 8 characters'); return; }
    setLoading(true);
    const { error } = await signUp(form.email, form.password, selectedRole, form.orgName, form.displayName);
    setLoading(false);
    if (error) { toast('error', error); return; }
    toast('success', 'Account created — pending admin approval');
    navigate('/pro/login');
  };
  const currentRole = ROLES.find(r => r.value === selectedRole);
  const currentPerks = ROLE_PERKS[selectedRole] ?? [];
  return (
    <div className="min-h-screen bg-white font-sans flex flex-col">
      <div className="flex-1 flex flex-col lg:flex-row">
        <div className="lg:w-1/2 flex flex-col justify-between p-8 sm:p-12 lg:p-16 bg-gradient-to-br from-neutral-50 to-white border-r border-neutral-100">
          <div>
            <p className="text-xs tracking-[0.2em] text-neutral-300 uppercase mb-8">Adea Lyric</p>
            <h1 className="text-4xl sm:text-5xl font-bold leading-tight text-neutral-900 mb-4">{isWriterSignup ? 'Writer' : 'Industry'}<br />access.</h1>
            <p className="text-lg text-neutral-500 max-w-md leading-relaxed">{isWriterSignup ? 'Join the songwriter and collaborator community. Pitch demos, browse collab calls, and buy songs. Your account will be reviewed by the artist team.' : 'Request access to sync licensing and booking tools. Your account will be reviewed by the artist team.'}</p>
          </div>
          <div className="mt-8 pt-8 border-t border-neutral-100"><p className="text-xs text-neutral-300">West Philadelphia · 2026</p><p className="text-xs text-neutral-300 mt-1">{isWriterSignup ? 'Writer access requires admin approval.' : 'Industry access requires admin approval.'}</p></div>
        </div>
        <div className="lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-16 bg-white">
          <div className="w-full max-w-sm">
            <div className="flex items-center gap-2 mb-8">
              {[{ id: 'role', t: isWriterSignup ? 'Writer Portal' : 'Choose Role', d: isWriterSignup ? 'Songwriter & collaborator access' : 'What type of professional?' }, { id: 'perks', t: 'What You Get', d: 'Features based on role' }, { id: 'details', t: 'Create Account', d: 'Set up your profile' }].map((s, i) => {
                const stepIndex = step === 'role' ? 0 : step === 'perks' ? 1 : 2;
                const isActive = i <= stepIndex;
                const activeColor = isWriterSignup ? 'bg-violet-600' : 'bg-blue-600';
                return (<div key={s.id} className="flex items-center gap-2"><div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${isActive ? activeColor + ' text-white' : 'bg-neutral-200 text-neutral-400'}`}>{i + 1}</div><div className="hidden sm:block"><p className={`text-xs font-semibold ${isActive ? 'text-neutral-900' : 'text-neutral-400'}`}>{s.t}</p><p className="text-xs text-neutral-400">{s.d}</p></div>{i < 2 && <div className="w-8 h-px bg-neutral-200 mx-1" />}</div>);
              })}
            </div>
            {step === 'role' ? (
              <div>
                <p className="text-sm font-semibold text-neutral-900 mb-2">I am a...</p>
                <p className="text-xs text-neutral-400 mb-4">Choose your professional role to get started.</p>
                <div className="space-y-3">{ROLES.map((r) => { const Icon = r.icon; return (<button key={r.value} onClick={() => { setSelectedRole(r.value); setStep('perks'); }} className="w-full text-left p-4 rounded-xl border border-neutral-200 hover:border-neutral-400 hover:bg-neutral-50 transition-all group bg-white"><div className="flex items-start gap-3"><div className={`w-10 h-10 rounded-lg ${r.color} flex items-center justify-center flex-shrink-0 text-white`}><Icon size={20} /></div><div className="flex-1"><p className="font-semibold text-sm text-neutral-900">{r.label}</p><p className="text-xs text-neutral-500 mt-0.5">{r.desc}</p></div><ArrowRight size={16} className="text-neutral-300 group-hover:text-neutral-600 mt-2 transition-colors" /></div></button>); })}</div>
              </div>
            ) : step === 'perks' ? (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  {currentRole && (<><div className={`w-10 h-10 rounded-lg ${currentRole.color} flex items-center justify-center text-white`}>{(() => { const Icon = currentRole.icon; return <Icon size={20} />; })()}</div><div><p className={`text-xs font-bold tracking-[0.15em] uppercase ${isWriterSignup ? 'text-violet-600' : 'text-blue-600'}`}>{currentRole.label}</p><p className="text-sm font-semibold text-neutral-900">What you get</p></div></>)}
                  {!isWriterSignup && <button onClick={() => setStep('role')} className="ml-auto text-xs text-neutral-400 hover:text-neutral-600">Change role</button>}
                </div>
                <div className="space-y-3 mb-6">{currentPerks.map((perk) => (<div key={perk.label} className={`flex items-center gap-3 p-3 rounded-lg ${isWriterSignup ? 'bg-violet-50 border border-violet-100' : 'bg-blue-50 border border-blue-100'}`}><CheckCircle2 size={16} className={isWriterSignup ? 'text-violet-600' : 'text-blue-600'} /><span className="text-sm text-neutral-700">{perk.label}</span></div>))}</div>
                <button onClick={() => setStep('details')} className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl ${isWriterSignup ? 'bg-violet-600 text-white hover:bg-violet-700' : 'bg-blue-600 text-white hover:bg-blue-700'} text-sm font-medium transition-colors`}>Continue to Create Account <ArrowRight size={16} /></button>
                {!isWriterSignup && <button onClick={() => setStep('role')} className="w-full text-center text-xs text-neutral-400 hover:text-neutral-600 mt-3 transition-colors">Back to role selection</button>}
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  {currentRole && (<><div className={`w-10 h-10 rounded-lg ${currentRole.color} flex items-center justify-center text-white`}>{(() => { const Icon = currentRole.icon; return <Icon size={20} />; })()}</div><div><span className={`text-xs px-2 py-1 rounded-full ${isWriterSignup ? 'bg-violet-100 text-violet-600' : 'bg-blue-100 text-blue-600'} font-medium`}>{currentRole.label}</span><p className="text-sm font-semibold text-neutral-900 mt-1">Create Account</p></div></>)}
                </div>
                <div className="border border-neutral-200 rounded-xl p-6 space-y-4 bg-white">
                  <Field label="Email" required><div className="relative"><Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" /><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="pl-9 border-neutral-200 bg-white text-neutral-900 placeholder:text-neutral-400" placeholder="you@company.com" /></div></Field>
                  <Field label="Password" required><div className="relative"><Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" /><Input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="pl-9 border-neutral-200 bg-white text-neutral-900 placeholder:text-neutral-400" placeholder="Min 8 characters" /></div></Field>
                  <Field label="Your Name"><Input value={form.displayName} onChange={(e) => setForm({ ...form, displayName: e.target.value })} className="border-neutral-200 bg-white text-neutral-900 placeholder:text-neutral-400" placeholder="Full name" /></Field>
                  <Field label="Organization"><Input value={form.orgName} onChange={(e) => setForm({ ...form, orgName: e.target.value })} className="border-neutral-200 bg-white text-neutral-900 placeholder:text-neutral-400" placeholder="Label, agency, or self" /></Field>
                  <Button variant="primary" className={`w-full ${isWriterSignup ? 'bg-violet-600 text-white hover:bg-violet-700' : 'bg-blue-600 text-white hover:bg-blue-700'} flex items-center justify-center gap-2`} onClick={submit} disabled={loading}>{loading ? 'Creating...' : 'Request Access'} <ArrowRight size={16} /></Button>
                  <p className="text-xs text-neutral-400 text-center">Your account will be reviewed by the artist team before activation</p>
                </div>
                <button onClick={() => setStep('perks')} className="w-full text-center text-xs text-neutral-400 hover:text-neutral-600 mt-3 transition-colors">Back to overview</button>
              </div>
            )}
            <div className="mt-6 text-center space-y-2">
              <p className="text-sm text-neutral-500">Already have access? <button onClick={() => navigate('/pro/login')} className={`${isWriterSignup ? 'text-violet-600' : 'text-blue-600'} hover:underline font-medium`}>Sign in</button></p>
              <p className="text-sm text-neutral-500">{isWriterSignup ? 'Not a songwriter or collaborator?' : 'Not an industry professional?'} <button onClick={() => navigate('/')} className="text-neutral-900 hover:underline font-medium">Choose a different portal</button></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProPendingPage() {
  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-4"><Clock size={32} className="text-neutral-400" /></div>
        <h1 className="text-2xl font-bold text-neutral-900 mb-2">Awaiting Approval</h1>
        <p className="text-neutral-500 mb-6">Your account is pending review by the artist team.</p>
        <Link to="/pro/login"><Button variant="secondary">Back to Login</Button></Link>
      </div>
    </div>
  );
}

function ProSuspendedPage() {
  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4"><Ban size={32} className="text-red-500" /></div>
        <h1 className="text-2xl font-bold text-neutral-900 mb-2">Account Suspended</h1>
        <p className="text-neutral-500 mb-6">Your portal access has been suspended.</p>
        <Link to="/pro/login"><Button variant="secondary">Back to Login</Button></Link>
      </div>
    </div>
  );
}

// ============ PRO PORTAL PAGE CONTENT (LIGHT THEME) ============
// Label pages are now imported from @/pro/pages/label/*

function BookingOverview() {
  const { portalUser } = useProAuth();
  const holds = mockData.mockAvailabilityHolds;
  const requests = mockData.mockPortalRequests.filter(r => r.type === 'booking');
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Booking Overview</h1>
          <p className="mt-1 text-sm text-neutral-500">Welcome back{portalUser?.display_name ? `, ${portalUser.display_name}` : ''}.</p>
        </div>
        <Link to="/pro/dashboard/booking/request">
          <Button variant="primary" size="lg"><Send size={18} /> Request a Booking</Button>
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Upcoming Shows', value: holds.filter(h => h.status === 'booked').length, icon: <Calendar size={24} /> },
          { label: 'Pending Requests', value: requests.filter(r => r.status === 'pending').length, icon: <Clock size={24} /> },
          { label: 'Confirmed (Month)', value: holds.filter(h => h.status === 'booked').length, icon: <TrendingUp size={24} /> },
        ].map(s => (
          <div key={s.label} className="bg-white border border-neutral-200 rounded-xl p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-500">{s.label}</p>
                <p className="mt-2 text-2xl font-semibold text-neutral-900">{s.value}</p>
              </div>
              <div className="text-neutral-300">{s.icon}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-white border border-neutral-200 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">Upcoming Confirmed Shows</h2>
        {holds.filter(h => h.status === 'booked').length === 0 ? <EmptyState title="No upcoming confirmed shows" /> : (
          <div className="space-y-2">
            {holds.filter(h => h.status === 'booked').map(hold => (
              <div key={hold.id} className="flex items-center justify-between p-3 bg-neutral-50 border border-neutral-200 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-neutral-900">{hold.label ?? 'Booked Date'}</p>
                  <p className="text-xs text-neutral-500">{formatDate(hold.date)}</p>
                </div>
                <Badge color="green">Booked</Badge>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function WriterOverview() {
  const { portalUser } = useProAuth();
  const calls = mockData.mockCollabCalls.filter(c => c.status === 'open');
  return (
    <div className="max-w-5xl mx-auto py-10">
      <div className="mb-10">
        <div className="flex items-center gap-2 text-neutral-400 text-sm mb-2"><Sparkles size={16} /><span>Writer & Collaborator Portal</span></div>
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900">Welcome back, {portalUser?.display_name?.split(' ')[0] ?? 'there'}.</h1>
        <p className="mt-2 text-neutral-500 max-w-2xl">Browse open collaboration calls, submit unsolicited pitches, explore the catalog for sale, and track every submission.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {[
          { to: '/pro/dashboard/writer/submit', icon: <Send size={20} />, title: 'Submit a pitch', desc: 'Send us a demo or co-write idea.' },
          { to: '/pro/dashboard/writer/buy', icon: <Music2 size={20} />, title: 'Browse catalog', desc: 'Songs available for purchase.' },
          { to: '/pro/dashboard/writer/submissions', icon: <Target size={20} />, title: 'Track submissions', desc: 'See where your pitches stand.' },
        ].map(a => (
          <Link key={a.to} to={a.to} className="block">
            <div className="bg-white hover:bg-neutral-50 border border-neutral-200 hover:border-neutral-300 rounded-xl p-5 transition-colors h-full">
              <div className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center mb-3">{a.icon}</div>
              <h3 className="font-semibold text-neutral-900">{a.title}</h3>
              <p className="text-sm text-neutral-500 mt-1">{a.desc}</p>
            </div>
          </Link>
        ))}
      </div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-neutral-900">Open collaboration calls</h2>
        <Link to="/pro/dashboard/writer/collab-calls" className="text-sm text-neutral-500 hover:text-neutral-900 inline-flex items-center gap-1">View all <ArrowRight size={14} /></Link>
      </div>
      {calls.length === 0 ? <EmptyState title="No open calls right now" /> : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {calls.slice(0, 4).map(call => (
            <div key={call.id} className="bg-white border border-neutral-200 rounded-xl p-5 flex flex-col">
              <h3 className="font-semibold text-neutral-900 leading-snug">{call.title}</h3>
              {call.deadline && <Badge color="amber" size="sm"><Clock size={11} /> {formatDate(call.deadline)}</Badge>}
              <p className="text-sm text-neutral-500 line-clamp-2 mb-3">{call.description}</p>
              <div className="mt-auto pt-3 border-t border-neutral-200">
                <p className="text-xs uppercase tracking-wide text-neutral-400 mb-1">What's needed</p>
                <p className="text-sm text-neutral-600 line-clamp-2">{call.what_needed}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ProAdminDashboard() {
  const { portalUser } = useProAuth();
  const requests = mockData.mockPortalRequests;
  const songs = mockData.mockCatalogSongs;
  const spend = mockData.mockSpendEntries;
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Admin Dashboard</h1>
          <p className="mt-1 text-sm text-neutral-500">Welcome back{portalUser?.display_name ? `, ${portalUser.display_name}` : ''}.</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        {[
          { label: 'New Requests (7d)', value: 3, icon: <Inbox size={20} /> },
          { label: 'Open Bookings', value: 2, icon: <Activity size={20} /> },
          { label: 'Catalog Size', value: songs.length, icon: <Music size={20} /> },
          { label: 'Revenue (30d)', value: formatCents(spend.filter(s => s.direction === 'revenue').reduce((sum, s) => sum + s.amount * 100, 0)), icon: <DollarSign size={20} /> },
          { label: 'Pipeline Value', value: formatCents(300000), icon: <TrendingUp size={20} /> },
        ].map(s => (
          <div key={s.label} className="bg-white border border-neutral-200 rounded-xl p-4">
            <div className="flex items-start justify-between">
              <div className="min-w-0">
                <p className="text-xs font-medium text-neutral-500 truncate">{s.label}</p>
                <p className="mt-2 text-xl font-semibold text-neutral-900">{s.value}</p>
              </div>
              <div className="text-neutral-300 flex-shrink-0">{s.icon}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-white border border-neutral-200 rounded-xl p-5">
        <h2 className="text-sm font-semibold text-neutral-900 mb-4">Recent Activity</h2>
        <div className="space-y-1">
          {requests.map(req => (
            <div key={req.id} className="flex items-center justify-between gap-3 py-2.5 border-b border-neutral-100 last:border-0">
              <div className="flex items-center gap-3 min-w-0">
                <Badge color={req.type === 'sync' ? 'purple' : req.type === 'booking' ? 'blue' : req.type === 'purchase' ? 'amber' : 'teal'} size="sm">{req.type.replace(/_/g, ' ')}</Badge>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-neutral-900 truncate">{req.type === 'sync' ? 'Label Agent' : req.type === 'booking' ? 'Booking Agent' : 'Writer'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <StatusBadge status={req.status} />
                <span className="text-xs text-neutral-400">{timeAgo(req.created_at)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============ INDUSTRY PORTAL PAGE COMPONENTS ============

function ProCatalogReleasesPage() {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterArtist, setFilterArtist] = useState<string>('all');
  const releases = [
    { id: 'r1', title: 'Midnight Echoes', artist: 'Adea Lyric', type: 'Album', status: 'live', releaseDate: '2025-09-15', dspStatus: [{ dsp: 'Spotify', status: 'live' }, { dsp: 'Apple Music', status: 'live' }, { dsp: 'Amazon Music', status: 'live' }, { dsp: 'Tidal', status: 'pending' }, { dsp: 'Deezer', status: 'rejected', reason: 'Metadata mismatch: ISRC duplicate' }] },
    { id: 'r2', title: 'Velvet Skies', artist: 'Marcus Cole', type: 'Single', status: 'live', releaseDate: '2025-11-01', dspStatus: [{ dsp: 'Spotify', status: 'live' }, { dsp: 'Apple Music', status: 'live' }, { dsp: 'Amazon Music', status: 'pending' }] },
    { id: 'r3', title: 'Neon Dreams', artist: 'Adea Lyric', type: 'EP', status: 'submitted', releaseDate: '2026-02-20', dspStatus: [{ dsp: 'Spotify', status: 'pending' }, { dsp: 'Apple Music', status: 'pending' }, { dsp: 'Amazon Music', status: 'pending' }] },
    { id: 'r4', title: 'Still Waters', artist: 'Kai Nakamura', type: 'Album', status: 'draft', releaseDate: '2026-04-10', dspStatus: [] },
    { id: 'r5', title: 'Golden Hour', artist: 'Luna Vega', type: 'Single', status: 'live', releaseDate: '2025-07-22', dspStatus: [{ dsp: 'Spotify', status: 'live' }, { dsp: 'Apple Music', status: 'live' }, { dsp: 'Amazon Music', status: 'live' }, { dsp: 'Tidal', status: 'live' }] },
    { id: 'r6', title: 'Paper Trails', artist: 'Marcus Cole', type: 'EP', status: 'rejected', releaseDate: '2025-12-05', dspStatus: [{ dsp: 'Spotify', status: 'rejected', reason: 'Cover art resolution below minimum 3000x3000' }] },
  ];
  const filtered = releases.filter(r => (filterStatus === 'all' || r.status === filterStatus) && (filterArtist === 'all' || r.artist === filterArtist));
  const artists = [...new Set(releases.map(r => r.artist))];
  const dspColors: Record<string, string> = { Spotify: 'bg-green-100 text-green-700', 'Apple Music': 'bg-red-100 text-red-700', 'Amazon Music': 'bg-amber-100 text-amber-700', Tidal: 'bg-blue-100 text-blue-700', Deezer: 'bg-purple-100 text-purple-700' };
  const statusIcons: Record<string, ReactNode> = { live: <CheckCircle2 size={12} className="text-green-600" />, pending: <Clock size={12} className="text-amber-500" />, rejected: <XCircle size={12} className="text-red-500" /> };
  return (
    <div>
      <PageHeader title="Catalog Releases" description="Manage releases across your catalog with delivery status per DSP" actions={<Button variant="primary"><Plus size={16} /> New Release</Button>} />
      <div className="flex flex-wrap gap-3 mb-4">
        <Select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="w-auto"><option value="all">All Status</option><option value="live">Live</option><option value="submitted">Submitted</option><option value="draft">Draft</option><option value="rejected">Rejected</option></Select>
        <Select value={filterArtist} onChange={e => setFilterArtist(e.target.value)} className="w-auto"><option value="all">All Artists</option>{artists.map(a => <option key={a} value={a}>{a}</option>)}</Select>
      </div>
      <div className="space-y-3 max-h-[600px] overflow-y-auto">
        {filtered.map(r => (
          <Card key={r.id} className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-neutral-700 to-neutral-900 flex items-center justify-center"><Disc3 size={18} className="text-white/30" /></div>
                <div><p className="text-sm font-semibold text-neutral-900">{r.title}</p><p className="text-xs text-neutral-500">{r.artist} · {r.type} · {r.releaseDate}</p></div>
              </div>
              <StatusBadge status={r.status} />
            </div>
            {r.dspStatus.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2 pt-2 border-t border-neutral-100">
                {r.dspStatus.map(d => (
                  <div key={d.dsp} className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${dspColors[d.dsp] ?? 'bg-neutral-100 text-neutral-700'}`}>
                    {statusIcons[d.status] ?? <Circle size={12} className="text-neutral-400" />}
                    <span>{d.dsp}</span>
                    {d.reason && <span className="text-red-500 font-normal ml-1">({d.reason})</span>}
                  </div>
                ))}
              </div>
            )}
            {r.dspStatus.length === 0 && <p className="text-xs text-neutral-400 mt-2 pt-2 border-t border-neutral-100">Not yet submitted for distribution</p>}
          </Card>
        ))}
      </div>
    </div>
  );
}

function ProCatalogTracksPage() {
  const [filterBpm, setFilterBpm] = useState<string>('all');
  const [filterMood, setFilterMood] = useState<string>('all');
  const tracks = [
    { id: 't1', title: 'Midnight Run', artist: 'Adea Lyric', release: 'Midnight Echoes', bpm: 128, key: 'Am', mood: ['dark', 'energetic'], clearance: 'cleared', duration: '3:42' },
    { id: 't2', title: 'Velvet Sunrise', artist: 'Adea Lyric', release: 'Midnight Echoes', bpm: 92, key: 'C', mood: ['warm', 'uplifting'], clearance: 'cleared', duration: '4:15' },
    { id: 't3', title: 'Neon Pulse', artist: 'Marcus Cole', release: 'Velvet Skies', bpm: 140, key: 'Dm', mood: ['energetic', 'dark'], clearance: 'partial', duration: '2:58' },
    { id: 't4', title: 'Still Breathing', artist: 'Kai Nakamura', release: 'Still Waters', bpm: 76, key: 'F', mood: ['calm', 'reflective'], clearance: 'pending', duration: '5:20' },
    { id: 't5', title: 'Golden Light', artist: 'Luna Vega', release: 'Golden Hour', bpm: 110, key: 'G', mood: ['warm', 'romantic'], clearance: 'cleared', duration: '3:55' },
    { id: 't6', title: 'Paper Hearts', artist: 'Marcus Cole', release: 'Paper Trails', bpm: 85, key: 'Eb', mood: ['romantic', 'reflective'], clearance: 'blocked', duration: '4:30' },
    { id: 't7', title: 'Thunder Road', artist: 'Adea Lyric', release: 'Midnight Echoes', bpm: 155, key: 'Em', mood: ['energetic', 'aggressive'], clearance: 'cleared', duration: '2:45' },
    { id: 't8', title: 'Ocean Memory', artist: 'Kai Nakamura', release: 'Still Waters', bpm: 68, key: 'Bb', mood: ['calm', 'nostalgic'], clearance: 'cleared', duration: '6:10' },
  ];
  const moods = [...new Set(tracks.flatMap(t => t.mood))];
  const bpmRanges = ['0-80', '81-110', '111-140', '141+'];
  const filtered = tracks.filter(t => {
    if (filterBpm !== 'all') {
      const [lo, hi] = filterBpm === '141+' ? [141, 999] : filterBpm.split('-').map(Number);
      if (t.bpm < lo || t.bpm > hi) return false;
    }
    if (filterMood !== 'all' && !t.mood.includes(filterMood)) return false;
    return true;
  });
  const clearanceColors: Record<string, string> = { cleared: 'green', partial: 'amber', pending: 'gray', blocked: 'red' };
  return (
    <div>
      <PageHeader title="Catalog Tracks" description="Sync-search-friendly track listing with metadata, mood tags, and clearance status" />
      <div className="flex flex-wrap gap-3 mb-4">
        <Select value={filterBpm} onChange={e => setFilterBpm(e.target.value)} className="w-auto"><option value="all">All BPM</option>{bpmRanges.map(r => <option key={r} value={r}>{r} BPM</option>)}</Select>
        <Select value={filterMood} onChange={e => setFilterMood(e.target.value)} className="w-auto"><option value="all">All Moods</option>{moods.map(m => <option key={m} value={m}>{m}</option>)}</Select>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-neutral-200"><th className="py-3 px-4 text-left font-medium text-neutral-500">Track</th><th className="py-3 px-4 text-left font-medium text-neutral-500">Release</th><th className="py-3 px-4 text-left font-medium text-neutral-500">BPM</th><th className="py-3 px-4 text-left font-medium text-neutral-500">Key</th><th className="py-3 px-4 text-left font-medium text-neutral-500">Mood</th><th className="py-3 px-4 text-left font-medium text-neutral-500">Duration</th><th className="py-3 px-4 text-left font-medium text-neutral-500">Clearance</th></tr></thead>
          <tbody>{filtered.map(t => (
            <tr key={t.id} className="border-b border-neutral-100 hover:bg-neutral-50"><td className="py-3 px-4"><div><p className="font-medium text-neutral-900">{t.title}</p><p className="text-xs text-neutral-400">{t.artist}</p></div></td><td className="py-3 px-4 text-neutral-600">{t.release}</td><td className="py-3 px-4 text-neutral-900 font-mono">{t.bpm}</td><td className="py-3 px-4 text-neutral-900 font-mono">{t.key}</td><td className="py-3 px-4"><div className="flex gap-1">{t.mood.map(m => <Badge key={m} color="purple" size="sm">{m}</Badge>)}</div></td><td className="py-3 px-4 text-neutral-600">{t.duration}</td><td className="py-3 px-4"><Badge color={clearanceColors[t.clearance]}>{t.clearance}</Badge></td></tr>
          ))}</tbody>
        </table>
      </div>
      {filtered.length === 0 && <EmptyState title="No tracks match your filters" description="Try adjusting BPM range or mood tags" />}
    </div>
  );
}

function ProCatalogAssetsPage() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const assets = [
    { id: 'a1', title: 'Midnight Run', artist: 'Adea Lyric', assets: [{ type: 'Vocal Stem', format: 'WAV 24-bit', size: '48 MB', status: 'available' }, { type: 'Instrumental', format: 'WAV 24-bit', size: '42 MB', status: 'available' }, { type: 'TV Mix (no lead vocal)', format: 'WAV 16-bit', size: '38 MB', status: 'available' }, { type: 'Dolby Atmos', format: 'ADM BWF', size: '180 MB', status: 'available' }] },
    { id: 'a2', title: 'Velvet Sunrise', artist: 'Adea Lyric', assets: [{ type: 'Vocal Stem', format: 'WAV 24-bit', size: '52 MB', status: 'available' }, { type: 'Instrumental', format: 'WAV 24-bit', size: '44 MB', status: 'available' }, { type: 'TV Mix', format: 'WAV 16-bit', size: '36 MB', status: 'pending' }] },
    { id: 'a3', title: 'Neon Pulse', artist: 'Marcus Cole', assets: [{ type: 'Vocal Stem', format: 'WAV 24-bit', size: '38 MB', status: 'available' }, { type: 'Instrumental', format: 'WAV 24-bit', size: '35 MB', status: 'available' }] },
    { id: 'a4', title: 'Still Breathing', artist: 'Kai Nakamura', assets: [{ type: 'Vocal Stem', format: 'WAV 24-bit', size: '55 MB', status: 'missing' }, { type: 'Dolby Atmos', format: 'ADM BWF', size: '210 MB', status: 'available' }] },
  ];
  const statusIcons: Record<string, ReactNode> = { available: <CheckCircle2 size={14} className="text-green-600" />, pending: <Clock size={14} className="text-amber-500" />, missing: <AlertTriangle size={14} className="text-red-500" /> };
  return (
    <div>
      <PageHeader title="Catalog Assets" description="Stems, TV mixes, instrumentals, and Dolby Atmos deliverables per track" />
      <div className="space-y-3">
        {assets.map(a => (
          <Card key={a.id} className="p-0 overflow-hidden">
            <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-neutral-50" onClick={() => setExpanded(expanded === a.id ? null : a.id)}>
              <div className="flex items-center gap-3"><Disc3 size={18} className="text-neutral-400" /><div><p className="text-sm font-semibold text-neutral-900">{a.title}</p><p className="text-xs text-neutral-500">{a.artist} · {a.assets.length} assets</p></div></div>
              <div className="flex items-center gap-2"><Badge color="green" size="sm">{a.assets.filter(x => x.status === 'available').length} ready</Badge>{expanded === a.id ? <ChevronUp size={16} className="text-neutral-400" /> : <ChevronDown size={16} className="text-neutral-400" />}</div>
            </div>
            {expanded === a.id && (
              <div className="border-t border-neutral-100 bg-neutral-50/50">
                <table className="w-full text-sm"><thead><tr className="border-b border-neutral-200"><th className="py-2 px-4 text-left font-medium text-neutral-500">Asset Type</th><th className="py-2 px-4 text-left font-medium text-neutral-500">Format</th><th className="py-2 px-4 text-left font-medium text-neutral-500">Size</th><th className="py-2 px-4 text-left font-medium text-neutral-500">Status</th><th className="py-2 px-4 text-right font-medium text-neutral-500">Action</th></tr></thead>
                <tbody>{a.assets.map((asset, i) => (
                  <tr key={i} className="border-b border-neutral-100"><td className="py-2.5 px-4 font-medium text-neutral-900">{asset.type}</td><td className="py-2.5 px-4 text-neutral-600">{asset.format}</td><td className="py-2.5 px-4 text-neutral-600">{asset.size}</td><td className="py-2.5 px-4"><div className="flex items-center gap-1.5">{statusIcons[asset.status]}<span className="text-neutral-700">{asset.status}</span></div></td><td className="py-2.5 px-4 text-right">{asset.status === 'available' ? <Button variant="secondary" size="sm"><Download size={14} /> Download</Button> : asset.status === 'pending' ? <Badge color="amber">Processing</Badge> : <Badge color="red">Missing</Badge>}</td></tr>
                ))}</tbody></table>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}

function ProDistributionStatusPage() {
  const [filterRelease, setFilterRelease] = useState<string>('all');
  const deliveries = [
    { id: 'd1', release: 'Midnight Echoes', artist: 'Adea Lyric', dsp: 'Spotify', status: 'live', deliveredAt: '2025-09-12', rejectionReason: null },
    { id: 'd2', release: 'Midnight Echoes', artist: 'Adea Lyric', dsp: 'Apple Music', status: 'live', deliveredAt: '2025-09-12', rejectionReason: null },
    { id: 'd3', release: 'Midnight Echoes', artist: 'Adea Lyric', dsp: 'Amazon Music', status: 'live', deliveredAt: '2025-09-13', rejectionReason: null },
    { id: 'd4', release: 'Midnight Echoes', artist: 'Adea Lyric', dsp: 'Tidal', status: 'pending', deliveredAt: null, rejectionReason: null },
    { id: 'd5', release: 'Midnight Echoes', artist: 'Adea Lyric', dsp: 'Deezer', status: 'rejected', deliveredAt: null, rejectionReason: 'ISRC code duplicate in metadata' },
    { id: 'd6', release: 'Velvet Skies', artist: 'Marcus Cole', dsp: 'Spotify', status: 'live', deliveredAt: '2025-10-29', rejectionReason: null },
    { id: 'd7', release: 'Velvet Skies', artist: 'Marcus Cole', dsp: 'Apple Music', status: 'live', deliveredAt: '2025-10-29', rejectionReason: null },
    { id: 'd8', release: 'Velvet Skies', artist: 'Marcus Cole', dsp: 'Amazon Music', status: 'pending', deliveredAt: null, rejectionReason: null },
    { id: 'd9', release: 'Neon Dreams', artist: 'Adea Lyric', dsp: 'Spotify', status: 'pending', deliveredAt: null, rejectionReason: null },
    { id: 'd10', release: 'Neon Dreams', artist: 'Adea Lyric', dsp: 'Apple Music', status: 'pending', deliveredAt: null, rejectionReason: null },
  ];
  const releaseNames = [...new Set(deliveries.map(d => d.release))];
  const grouped = deliveries.filter(d => filterRelease === 'all' || d.release === filterRelease).reduce<Record<string, typeof deliveries>>((acc, d) => { (acc[d.release] ??= []).push(d); return acc; }, {});
  return (
    <div>
      <PageHeader title="Delivery Status" description="Track delivery status per DSP for each release in your catalog" />
      <div className="mb-4"><Select value={filterRelease} onChange={e => setFilterRelease(e.target.value)} className="w-auto"><option value="all">All Releases</option>{releaseNames.map(r => <option key={r} value={r}>{r}</option>)}</Select></div>
      {Object.entries(grouped).map(([release, rows]) => (
        <div key={release} className="mb-6">
          <div className="flex items-center gap-2 mb-3"><Disc3 size={16} className="text-neutral-400" /><h3 className="text-sm font-semibold text-neutral-900">{release}</h3><span className="text-xs text-neutral-500">{rows[0]?.artist}</span></div>
          <Card className="overflow-hidden p-0">
            <table className="w-full text-sm"><thead><tr className="border-b border-neutral-200 bg-neutral-50"><th className="py-2.5 px-4 text-left font-medium text-neutral-500">DSP</th><th className="py-2.5 px-4 text-left font-medium text-neutral-500">Status</th><th className="py-2.5 px-4 text-left font-medium text-neutral-500">Delivered</th><th className="py-2.5 px-4 text-left font-medium text-neutral-500">Rejection Reason</th></tr></thead>
            <tbody>{rows.map(r => (
              <tr key={r.id} className="border-b border-neutral-100 hover:bg-neutral-50"><td className="py-2.5 px-4 font-medium text-neutral-900">{r.dsp}</td><td className="py-2.5 px-4"><StatusBadge status={r.status} /></td><td className="py-2.5 px-4 text-neutral-600">{r.deliveredAt ?? '—'}</td><td className="py-2.5 px-4 text-neutral-600">{r.rejectionReason ?? '—'}</td></tr>
            ))}</tbody></table>
          </Card>
        </div>
      ))}
    </div>
  );
}

function ProDistributionSubmitPage() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ title: '', artist: '', type: 'Single', releaseDate: '', upc: '', genre: '', label: '', coverArt: false, metadata: false, audio: false });
  const steps = ['Release Info', 'Metadata & Assets', 'DSP Selection', 'Review & Submit'];
  const dspOptions = ['Spotify', 'Apple Music', 'Amazon Music', 'Tidal', 'Deezer', 'YouTube Music', 'Pandora'];
  const [selectedDsps, setSelectedDsps] = useState<string[]>(['Spotify', 'Apple Music']);
  const canProceed = () => {
    if (step === 0) return form.title && form.artist && form.releaseDate;
    if (step === 1) return form.coverArt && form.metadata && form.audio;
    if (step === 2) return selectedDsps.length > 0;
    return true;
  };
  return (
    <div>
      <PageHeader title="New Release Submission" description="Submit a new release for distribution across DSPs" />
      <div className="flex items-center gap-2 mb-8">{steps.map((s, i) => (
        <div key={s} className="flex items-center gap-2"><div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${i <= step ? 'bg-neutral-900 text-white' : 'bg-neutral-200 text-neutral-400'}`}>{i + 1}</div><span className={`text-sm font-medium hidden sm:inline ${i <= step ? 'text-neutral-900' : 'text-neutral-400'}`}>{s}</span>{i < steps.length - 1 && <div className="w-6 h-px bg-neutral-200" />}</div>
      ))}</div>
      {step === 0 && (
        <Card className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Release Title" required><Input value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="e.g. Midnight Echoes" /></Field>
            <Field label="Primary Artist" required><Input value={form.artist} onChange={e => setForm({...form, artist: e.target.value})} placeholder="e.g. Adea Lyric" /></Field>
            <Field label="Release Type" required><Select value={form.type} onChange={e => setForm({...form, type: e.target.value})}><option value="Single">Single</option><option value="EP">EP</option><option value="Album">Album</option></Select></Field>
            <Field label="Release Date" required><Input type="date" value={form.releaseDate} onChange={e => setForm({...form, releaseDate: e.target.value})} /></Field>
            <Field label="UPC/EAN"><Input value={form.upc} onChange={e => setForm({...form, upc: e.target.value})} placeholder="Auto-generated if blank" /></Field>
            <Field label="Genre"><Select value={form.genre} onChange={e => setForm({...form, genre: e.target.value})}><option value="">Select genre</option><option value="Pop">Pop</option><option value="R&B">R&B</option><option value="Hip-Hop">Hip-Hop</option><option value="Electronic">Electronic</option><option value="Jazz">Jazz</option><option value="Rock">Rock</option></Select></Field>
          </div>
        </Card>
      )}
      {step === 1 && (
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 rounded-lg border border-neutral-200"><div className={`w-8 h-8 rounded-lg flex items-center justify-center ${form.coverArt ? 'bg-green-100' : 'bg-neutral-100'}`}>{form.coverArt ? <CheckCircle2 size={18} className="text-green-600" /> : <ImageIcon size={18} className="text-neutral-400" />}</div><div className="flex-1"><p className="text-sm font-medium text-neutral-900">Cover Art</p><p className="text-xs text-neutral-500">3000×3000px minimum, JPG or PNG</p></div><button onClick={() => setForm({...form, coverArt: !form.coverArt})} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${form.coverArt ? 'bg-green-100 text-green-700' : 'bg-neutral-100 text-neutral-600'}`}>{form.coverArt ? 'Uploaded' : 'Upload'}</button></div>
            <div className="flex items-center gap-3 p-4 rounded-lg border border-neutral-200"><div className={`w-8 h-8 rounded-lg flex items-center justify-center ${form.metadata ? 'bg-green-100' : 'bg-neutral-100'}`}>{form.metadata ? <CheckCircle2 size={18} className="text-green-600" /> : <FileText size={18} className="text-neutral-400" />}</div><div className="flex-1"><p className="text-sm font-medium text-neutral-900">Metadata Sheet</p><p className="text-xs text-neutral-500">Track titles, ISRCs, songwriters, publishers</p></div><button onClick={() => setForm({...form, metadata: !form.metadata})} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${form.metadata ? 'bg-green-100 text-green-700' : 'bg-neutral-100 text-neutral-600'}`}>{form.metadata ? 'Validated' : 'Upload'}</button></div>
            <div className="flex items-center gap-3 p-4 rounded-lg border border-neutral-200"><div className={`w-8 h-8 rounded-lg flex items-center justify-center ${form.audio ? 'bg-green-100' : 'bg-neutral-100'}`}>{form.audio ? <CheckCircle2 size={18} className="text-green-600" /> : <Music size={18} className="text-neutral-400" />}</div><div className="flex-1"><p className="text-sm font-medium text-neutral-900">Audio Files</p><p className="text-xs text-neutral-500">WAV 16-bit/44.1kHz minimum per track</p></div><button onClick={() => setForm({...form, audio: !form.audio})} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${form.audio ? 'bg-green-100 text-green-700' : 'bg-neutral-100 text-neutral-600'}`}>{form.audio ? 'Uploaded' : 'Upload'}</button></div>
          </div>
        </Card>
      )}
      {step === 2 && (
        <Card className="p-6">
          <p className="text-sm text-neutral-500 mb-4">Select the DSPs you want to distribute to:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">{dspOptions.map(dsp => (
            <button key={dsp} onClick={() => setSelectedDsps(prev => prev.includes(dsp) ? prev.filter(d => d !== dsp) : [...prev, dsp])} className={`p-3 rounded-lg border text-sm font-medium text-left transition-colors ${selectedDsps.includes(dsp) ? 'border-neutral-900 bg-neutral-900 text-white' : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300'}`}>
              <div className="flex items-center justify-between">{dsp}{selectedDsps.includes(dsp) && <CheckCircle2 size={16} />}</div>
            </button>
          ))}</div>
        </Card>
      )}
      {step === 3 && (
        <Card className="p-6">
          <h3 className="text-sm font-semibold text-neutral-900 mb-4">Submission Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Release Title"><p className="text-sm text-neutral-900">{form.title || '—'}</p></Field>
            <Field label="Artist"><p className="text-sm text-neutral-900">{form.artist || '—'}</p></Field>
            <Field label="Type"><p className="text-sm text-neutral-900">{form.type}</p></Field>
            <Field label="Release Date"><p className="text-sm text-neutral-900">{form.releaseDate || '—'}</p></Field>
            <Field label="Target DSPs"><div className="flex flex-wrap gap-1">{selectedDsps.map(d => <Badge key={d} color="gray">{d}</Badge>)}</div></Field>
            <Field label="Assets Status"><div className="flex flex-wrap gap-1">{form.coverArt && <Badge color="green">Cover Art ✓</Badge>}{form.metadata && <Badge color="green">Metadata ✓</Badge>}{form.audio && <Badge color="green">Audio ✓</Badge>}</div></Field>
          </div>
        </Card>
      )}
      <div className="flex items-center justify-between mt-6">
        <Button variant="secondary" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}>Back</Button>
        {step < 3 ? <Button variant="primary" onClick={() => setStep(step + 1)} disabled={!canProceed()}>Continue</Button> : <Button variant="primary" onClick={() => { toast('success', 'Release submitted for distribution'); setStep(0); }}>Submit Release</Button>}
      </div>
    </div>
  );
}

function ProDistributionCorrectionsPage() {
  const corrections = [
    { id: 'c1', release: 'Midnight Echoes', dsp: 'Deezer', field: 'ISRC', issue: 'Duplicate ISRC code detected for track 3', status: 'open', submittedAt: '2025-09-14' },
    { id: 'c2', release: 'Paper Trails', dsp: 'Spotify', field: 'Cover Art', issue: 'Image resolution below 3000×3000px minimum', status: 'open', submittedAt: '2025-12-06' },
    { id: 'c3', release: 'Velvet Skies', dsp: 'Amazon Music', field: 'Metadata', issue: 'Missing publisher field on track 1', status: 'in_progress', submittedAt: '2025-11-02' },
    { id: 'c4', release: 'Golden Hour', dsp: 'Tidal', field: 'Audio', issue: 'Bitrate below minimum threshold', status: 'resolved', submittedAt: '2025-07-25' },
  ];
  return (
    <div>
      <PageHeader title="Store Corrections" description="Track and resolve metadata, artwork, and audio issues flagged by DSPs" actions={<Button variant="primary"><Plus size={16} /> New Correction</Button>} />
      <Card className="overflow-hidden p-0">
        <table className="w-full text-sm"><thead><tr className="border-b border-neutral-200 bg-neutral-50"><th className="py-2.5 px-4 text-left font-medium text-neutral-500">Ticket</th><th className="py-2.5 px-4 text-left font-medium text-neutral-500">Release</th><th className="py-2.5 px-4 text-left font-medium text-neutral-500">DSP</th><th className="py-2.5 px-4 text-left font-medium text-neutral-500">Field</th><th className="py-2.5 px-4 text-left font-medium text-neutral-500">Issue</th><th className="py-2.5 px-4 text-left font-medium text-neutral-500">Status</th><th className="py-2.5 px-4 text-left font-medium text-neutral-500">Date</th></tr></thead>
        <tbody>{corrections.map(c => (
          <tr key={c.id} className="border-b border-neutral-100 hover:bg-neutral-50"><td className="py-2.5 px-4 font-mono text-xs text-neutral-500">{c.id}</td><td className="py-2.5 px-4 font-medium text-neutral-900">{c.release}</td><td className="py-2.5 px-4 text-neutral-600">{c.dsp}</td><td className="py-2.5 px-4"><Badge color="gray" size="sm">{c.field}</Badge></td><td className="py-2.5 px-4 text-neutral-700 max-w-xs truncate">{c.issue}</td><td className="py-2.5 px-4"><StatusBadge status={c.status} /></td><td className="py-2.5 px-4 text-neutral-500">{c.submittedAt}</td></tr>
        ))}</tbody></table>
      </Card>
    </div>
  );
}

function ProSyncSearchPage() {
  const [search, setSearch] = useState('');
  const [filterBpm, setFilterBpm] = useState<string>('all');
  const [filterMood, setFilterMood] = useState<string>('all');
  const [filterClearance, setFilterClearance] = useState<string>('all');
  const tracks = [
    { id: 's1', title: 'Midnight Run', artist: 'Adea Lyric', bpm: 128, key: 'Am', mood: ['dark', 'energetic'], clearance: 'cleared', duration: '3:42', price: '$2,500' },
    { id: 's2', title: 'Velvet Sunrise', artist: 'Adea Lyric', bpm: 92, key: 'C', mood: ['warm', 'uplifting'], clearance: 'cleared', duration: '4:15', price: '$3,000' },
    { id: 's3', title: 'Neon Pulse', artist: 'Marcus Cole', bpm: 140, key: 'Dm', mood: ['energetic', 'dark'], clearance: 'partial', duration: '2:58', price: '$1,800' },
    { id: 's4', title: 'Golden Light', artist: 'Luna Vega', bpm: 110, key: 'G', mood: ['warm', 'romantic'], clearance: 'cleared', duration: '3:55', price: '$2,200' },
    { id: 's5', title: 'Thunder Road', artist: 'Adea Lyric', bpm: 155, key: 'Em', mood: ['energetic', 'aggressive'], clearance: 'cleared', duration: '2:45', price: '$4,000' },
    { id: 's6', title: 'Ocean Memory', artist: 'Kai Nakamura', bpm: 68, key: 'Bb', mood: ['calm', 'nostalgic'], clearance: 'cleared', duration: '6:10', price: '$2,800' },
    { id: 's7', title: 'Paper Hearts', artist: 'Marcus Cole', bpm: 85, key: 'Eb', mood: ['romantic', 'reflective'], clearance: 'blocked', duration: '4:30', price: 'N/A' },
    { id: 's8', title: 'Still Breathing', artist: 'Kai Nakamura', bpm: 76, key: 'F', mood: ['calm', 'reflective'], clearance: 'pending', duration: '5:20', price: 'TBD' },
  ];
  const moods = [...new Set(tracks.flatMap(t => t.mood))];
  const filtered = tracks.filter(t => {
    if (search && !t.title.toLowerCase().includes(search.toLowerCase()) && !t.artist.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterBpm !== 'all') { const [lo, hi] = filterBpm === '141+' ? [141, 999] : filterBpm.split('-').map(Number); if (t.bpm < lo || t.bpm > hi) return false; }
    if (filterMood !== 'all' && !t.mood.includes(filterMood)) return false;
    if (filterClearance !== 'all' && t.clearance !== filterClearance) return false;
    return true;
  });
  const clearanceColors: Record<string, string> = { cleared: 'green', partial: 'amber', pending: 'gray', blocked: 'red' };
  return (
    <div>
      <PageHeader title="Sync Browse & Search" description="Find tracks for sync licensing with metadata, mood, and clearance filters" />
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-64 space-y-4">
          <Field label="Search"><div className="relative"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" /><Input value={search} onChange={e => setSearch(e.target.value)} className="pl-9" placeholder="Track or artist..." /></div></Field>
          <Field label="BPM Range"><Select value={filterBpm} onChange={e => setFilterBpm(e.target.value)}><option value="all">All BPM</option><option value="0-80">0–80</option><option value="81-110">81–110</option><option value="111-140">111–140</option><option value="141+">141+</option></Select></Field>
          <Field label="Mood"><Select value={filterMood} onChange={e => setFilterMood(e.target.value)}><option value="all">All Moods</option>{moods.map(m => <option key={m} value={m}>{m}</option>)}</Select></Field>
          <Field label="Clearance"><Select value={filterClearance} onChange={e => setFilterClearance(e.target.value)}><option value="all">All Status</option><option value="cleared">Cleared</option><option value="partial">Partial</option><option value="pending">Pending</option><option value="blocked">Blocked</option></Select></Field>
        </div>
        <div className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map(t => (
              <Card key={t.id} className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                <div className="w-full h-32 rounded-lg bg-gradient-to-br from-neutral-700 to-neutral-900 flex items-center justify-center mb-3"><Music2 size={24} className="text-white/20" /></div>
                <p className="text-sm font-semibold text-neutral-900">{t.title}</p>
                <p className="text-xs text-neutral-500 mb-2">{t.artist}</p>
                <div className="flex items-center gap-2 mb-2"><span className="text-xs font-mono text-neutral-600">{t.bpm} BPM</span><span className="text-xs font-mono text-neutral-600">{t.key}</span><span className="text-xs text-neutral-600">{t.duration}</span></div>
                <div className="flex flex-wrap gap-1 mb-2">{t.mood.map(m => <Badge key={m} color="purple" size="sm">{m}</Badge>)}</div>
                <div className="flex items-center justify-between pt-2 border-t border-neutral-100"><Badge color={clearanceColors[t.clearance]}>{t.clearance}</Badge><span className="text-sm font-semibold text-neutral-900">{t.price}</span></div>
              </Card>
            ))}
          </div>
          {filtered.length === 0 && <EmptyState title="No tracks found" description="Try adjusting your search or filters" />}
        </div>
      </div>
    </div>
  );
}

function ProSyncDealRoomsPage() {
  const dealRooms = [
    { id: 'dr1', title: 'Midnight Run — Film License', counterpart: 'Lakeshore Entertainment', type: 'Film Sync', stage: 'negotiation', tracks: ['Midnight Run'], deadline: '2026-03-15', messages: 8 },
    { id: 'dr2', title: 'Velvet Sunrise — Ad Campaign', counterpart: 'Nike Creative', type: 'Commercial', stage: 'offer_sent', tracks: ['Velvet Sunrise'], deadline: '2026-02-01', messages: 4 },
    { id: 'dr3', title: 'Thunder Road — TV Series', counterpart: 'HBO Music Dept', type: 'TV Sync', stage: 'cleared', tracks: ['Thunder Road'], deadline: '2026-04-10', messages: 12 },
    { id: 'dr4', title: 'Golden Light — Brand Partnership', counterpart: 'L\u2019Occitane', type: 'Commercial', stage: 'draft', tracks: ['Golden Light'], deadline: '2026-06-01', messages: 2 },
  ];
  const stageColors: Record<string, 'gray' | 'blue' | 'amber' | 'green' | 'purple' | 'red'> = { draft: 'gray', negotiation: 'purple', offer_sent: 'blue', cleared: 'green', completed: 'green', cancelled: 'red' };
  return (
    <div>
      <PageHeader title="Deal Rooms" description="Active sync licensing negotiations and deal progress" actions={<Button variant="primary"><Plus size={16} /> New Deal Room</Button>} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {dealRooms.map(dr => (
          <Card key={dr.id} className="p-5 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-start justify-between mb-3"><div><p className="text-sm font-semibold text-neutral-900">{dr.title}</p><p className="text-xs text-neutral-500">{dr.counterpart} · {dr.type}</p></div><Badge color={stageColors[dr.stage]}>{dr.stage.replace('_', ' ')}</Badge></div>
            <div className="flex flex-wrap gap-1 mb-3">{dr.tracks.map(t => <Badge key={t} color="gray" size="sm">{t}</Badge>)}</div>
            <div className="flex items-center justify-between pt-3 border-t border-neutral-100"><div className="flex items-center gap-2 text-xs text-neutral-500"><Clock size={14} /> Deadline: {dr.deadline}</div><div className="flex items-center gap-1.5 text-xs text-neutral-500"><MessageSquare size={14} /> {dr.messages} messages</div></div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function ProSyncWorkspacePage() {
  const projects = [
    { id: 'w1', title: 'Film Sync — Midnight Run', brief: 'Dark, energetic track needed for chase scene', stage: 'review', invitedRoles: ['Composer', 'Music Supervisor', 'Label Rep'], submissions: 3, deadline: '2026-03-15' },
    { id: 'w2', title: 'Ad Campaign — Velvet Sunrise', brief: 'Warm, uplifting track for lifestyle brand campaign', stage: 'cleared', invitedRoles: ['Creative Director', 'Music Supervisor', 'Label Rep', 'Artist Manager'], submissions: 1, deadline: '2026-02-01' },
    { id: 'w3', title: 'TV Series — Thunder Road', brief: 'Aggressive rock/EDM hybrid for action sequence', stage: 'finalizing', invitedRoles: ['Music Supervisor', 'Composer', 'Label Rep'], submissions: 2, deadline: '2026-04-10' },
  ];
  const stageColors: Record<string, string> = { review: 'bg-blue-100 text-blue-700', cleared: 'bg-green-100 text-green-700', finalizing: 'bg-purple-100 text-purple-700', draft: 'bg-neutral-100 text-neutral-700' };
  return (
    <div>
      <PageHeader title="A&R Workspace" description="Manage sync projects with team roles, submissions, and stages" />
      <div className="space-y-4">
        {projects.map(p => (
          <Card key={p.id} className="p-5">
            <div className="flex items-start justify-between mb-3"><div><p className="text-sm font-semibold text-neutral-900">{p.title}</p><p className="text-xs text-neutral-500 max-w-md">{p.brief}</p></div><Badge color={p.stage === 'review' ? 'blue' : p.stage === 'cleared' ? 'green' : p.stage === 'finalizing' ? 'purple' : 'gray'}>{p.stage}</Badge></div>
            <div className="flex items-center gap-4 mb-3"><div className="flex flex-wrap gap-1.5">{p.invitedRoles.map(r => <Badge key={r} color="gray" size="sm">{r}</Badge>)}</div></div>
            <div className="flex items-center justify-between pt-3 border-t border-neutral-100"><div className="flex items-center gap-4 text-xs text-neutral-500"><span><Users size={14} className="inline mr-1" />{p.invitedRoles.length} roles</span><span><FileText size={14} className="inline mr-1" />{p.submissions} submissions</span></div><div className="flex items-center gap-1.5 text-xs text-neutral-500"><Clock size={14} /> {p.deadline}</div></div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function ProSyncLicenseHistoryPage() {
  const licenses = [
    { id: 'l1', track: 'Midnight Run', licensee: 'Lakeshore Entertainment', type: 'Film Sync', territory: 'Worldwide', fee: '$25,000', status: 'active', date: '2025-11-15' },
    { id: 'l2', track: 'Velvet Sunrise', licensee: 'Nike Creative', type: 'Commercial', territory: 'North America', fee: '$18,000', status: 'active', date: '2025-10-22' },
    { id: 'l3', track: 'Thunder Road', licensee: 'HBO Music Dept', type: 'TV Sync', territory: 'Worldwide', fee: '$12,500', status: 'expired', date: '2024-06-01' },
    { id: 'l4', track: 'Golden Light', licensee: 'L\u2019Occitane', type: 'Commercial', territory: 'Europe', fee: '$15,000', status: 'active', date: '2025-08-10' },
    { id: 'l5', track: 'Ocean Memory', licensee: 'Netflix Music', type: 'Film Sync', territory: 'Worldwide', fee: '$30,000', status: 'active', date: '2025-12-01' },
  ];
  return (
    <div>
      <PageHeader title="License History" description="Past and active sync licenses for accounting reconciliation" actions={<Button variant="secondary"><Download size={16} /> Export CSV</Button>} />
      <Card className="overflow-hidden p-0">
        <table className="w-full text-sm"><thead><tr className="border-b border-neutral-200 bg-neutral-50"><th className="py-2.5 px-4 text-left font-medium text-neutral-500">Track</th><th className="py-2.5 px-4 text-left font-medium text-neutral-500">Licensee</th><th className="py-2.5 px-4 text-left font-medium text-neutral-500">Type</th><th className="py-2.5 px-4 text-left font-medium text-neutral-500">Territory</th><th className="py-2.5 px-4 text-left font-medium text-neutral-500">Fee</th><th className="py-2.5 px-4 text-left font-medium text-neutral-500">Status</th><th className="py-2.5 px-4 text-left font-medium text-neutral-500">Date</th></tr></thead>
        <tbody>{licenses.map(l => (
          <tr key={l.id} className="border-b border-neutral-100 hover:bg-neutral-50"><td className="py-2.5 px-4 font-medium text-neutral-900">{l.track}</td><td className="py-2.5 px-4 text-neutral-700">{l.licensee}</td><td className="py-2.5 px-4"><Badge color="gray" size="sm">{l.type}</Badge></td><td className="py-2.5 px-4 text-neutral-600">{l.territory}</td><td className="py-2.5 px-4 font-semibold text-neutral-900">{l.fee}</td><td className="py-2.5 px-4"><StatusBadge status={l.status} /></td><td className="py-2.5 px-4 text-neutral-500">{l.date}</td></tr>
        ))}</tbody></table>
      </Card>
    </div>
  );
}

function ProRightsPage() {
  const [filterType, setFilterType] = useState<string>('all');
  const rights = [
    { id: 'rr1', release: 'Midnight Echoes', track: 'Midnight Run', rightType: 'Mechanical', owner: 'Adea Lyric Publishing', share: '100%', status: 'confirmed' },
    { id: 'rr2', release: 'Midnight Echoes', track: 'Velvet Sunrise', rightType: 'Performance', owner: 'Adea Lyric', share: '50%', status: 'confirmed' },
    { id: 'rr3', release: 'Midnight Echoes', track: 'Velvet Sunrise', rightType: 'Performance', owner: 'Marcus Cole', share: '50%', status: 'pending' },
    { id: 'rr4', release: 'Velvet Skies', track: 'Neon Pulse', rightType: 'Mechanical', owner: 'Cole Publishing Group', share: '100%', status: 'confirmed' },
    { id: 'rr5', release: 'Velvet Skies', track: 'Neon Pulse', rightType: 'Sync', owner: 'Marcus Cole', share: '100%', status: 'partial' },
    { id: 'rr6', release: 'Golden Hour', track: 'Golden Light', rightType: 'Mechanical', owner: 'Vega Music LLC', share: '100%', status: 'confirmed' },
  ];
  const rightTypes = [...new Set(rights.map(r => r.rightType))];
  const filtered = rights.filter(r => filterType === 'all' || r.rightType === filterType);
  const grouped = filtered.reduce<Record<string, typeof filtered>>((acc, r) => { (acc[r.release] ??= []).push(r); return acc; }, {});
  return (
    <div>
      <PageHeader title="Rights & Splits" description="Ownership splits and rights types per release and track" actions={<Button variant="primary"><Plus size={16} /> Add Split</Button>} />
      <div className="mb-4"><Select value={filterType} onChange={e => setFilterType(e.target.value)} className="w-auto"><option value="all">All Right Types</option>{rightTypes.map(rt => <option key={rt} value={rt}>{rt}</option>)}</Select></div>
      {Object.entries(grouped).map(([release, rows]) => (
        <div key={release} className="mb-4">
          <h3 className="text-sm font-semibold text-neutral-900 mb-2">{release}</h3>
          <Card className="overflow-hidden p-0">
            <table className="w-full text-sm"><thead><tr className="border-b border-neutral-200 bg-neutral-50"><th className="py-2 px-4 text-left font-medium text-neutral-500">Track</th><th className="py-2 px-4 text-left font-medium text-neutral-500">Right Type</th><th className="py-2 px-4 text-left font-medium text-neutral-500">Owner</th><th className="py-2 px-4 text-left font-medium text-neutral-500">Share</th><th className="py-2 px-4 text-left font-medium text-neutral-500">Status</th></tr></thead>
            <tbody>{rows.map(r => (<tr key={r.id} className="border-b border-neutral-100 hover:bg-neutral-50"><td className="py-2 px-4 font-medium text-neutral-900">{r.track}</td><td className="py-2 px-4"><Badge color="gray" size="sm">{r.rightType}</Badge></td><td className="py-2 px-4 text-neutral-700">{r.owner}</td><td className="py-2 px-4 font-semibold text-neutral-900">{r.share}</td><td className="py-2 px-4"><StatusBadge status={r.status} /></td></tr>))}</tbody></table>
          </Card>
        </div>
      ))}
    </div>
  );
}

function ProRoyaltiesPage() {
  const [expandedPeriod, setExpandedPeriod] = useState<string | null>(null);
  const periods = [
    { id: 'p1', period: 'Q4 2025 (Oct–Dec)', total: '$142,500', sources: [{ source: 'Spotify', amount: '$68,200' }, { source: 'Apple Music', amount: '$42,300' }, { source: 'Amazon Music', amount: '$18,900' }, { source: 'Sync Licensing', amount: '$13,100' }], participants: [{ name: 'Adea Lyric', role: 'Artist', share: '45%', amount: '$64,125' }, { name: 'Marcus Cole', role: 'Songwriter', share: '25%', amount: '$35,625' }, { name: 'Label Publishing', role: 'Publisher', share: '30%', amount: '$42,750' }] },
    { id: 'p2', period: 'Q3 2025 (Jul–Sep)', total: '$98,750', sources: [{ source: 'Spotify', amount: '$52,100' }, { source: 'Apple Music', amount: '$28,500' }, { source: 'Amazon Music', amount: '$12,150' }, { source: 'Sync Licensing', amount: '$6,000' }], participants: [{ name: 'Adea Lyric', role: 'Artist', share: '45%', amount: '$44,438' }, { name: 'Marcus Cole', role: 'Songwriter', share: '25%', amount: '$24,688' }, { name: 'Label Publishing', role: 'Publisher', share: '30%', amount: '$29,625' }] },
  ];
  return (
    <div>
      <PageHeader title="Royalties & Statements" description="Royalty periods expanding into per-participant breakdowns" actions={<Button variant="secondary"><Download size={16} /> Export</Button>} />
      <div className="space-y-3">
        {periods.map(p => (
          <Card key={p.id} className="p-0 overflow-hidden">
            <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-neutral-50" onClick={() => setExpandedPeriod(expandedPeriod === p.id ? null : p.id)}>
              <div><p className="text-sm font-semibold text-neutral-900">{p.period}</p><p className="text-xs text-neutral-500">Total earnings: {p.total}</p></div>
              <div className="flex items-center gap-3"><Badge color="green">{p.total}</Badge>{expandedPeriod === p.id ? <ChevronUp size={16} className="text-neutral-400" /> : <ChevronDown size={16} className="text-neutral-400" />}</div>
            </div>
            {expandedPeriod === p.id && (
              <div className="border-t border-neutral-100 p-4 bg-neutral-50/50 space-y-4">
                <div><h4 className="text-xs font-semibold text-neutral-500 uppercase mb-2">Sources</h4><div className="grid grid-cols-2 sm:grid-cols-4 gap-2">{p.sources.map(s => <div key={s.source} className="p-2 rounded-lg bg-white border border-neutral-100"><p className="text-xs text-neutral-500">{s.source}</p><p className="text-sm font-semibold text-neutral-900">{s.amount}</p></div>)}</div></div>
                <div><h4 className="text-xs font-semibold text-neutral-500 uppercase mb-2">Participant Breakdown</h4><table className="w-full text-sm"><thead><tr className="border-b border-neutral-200"><th className="py-2 px-3 text-left font-medium text-neutral-500">Name</th><th className="py-2 px-3 text-left font-medium text-neutral-500">Role</th><th className="py-2 px-3 text-left font-medium text-neutral-500">Share</th><th className="py-2 px-3 text-left font-medium text-neutral-500">Amount</th></tr></thead>
                <tbody>{p.participants.map(pt => (<tr key={pt.name} className="border-b border-neutral-100"><td className="py-2 px-3 font-medium text-neutral-900">{pt.name}</td><td className="py-2 px-3"><Badge color="gray" size="sm">{pt.role}</Badge></td><td className="py-2 px-3 text-neutral-700">{pt.share}</td><td className="py-2 px-3 font-semibold text-neutral-900">{pt.amount}</td></tr>))}</tbody></table></div>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}

function ProAnalyticsPage() {
  const months = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const streamingData = [42, 55, 48, 68, 62, 71];
  const syncData = [6, 4, 12, 13, 8, 15];
  const maxStream = Math.max(...streamingData);
  return (
    <div>
      <PageHeader title="Analytics" description="Chart-first dashboard with trend lines and bar charts" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard label="Total Streams (Q4)" value="201K" icon={<Play size={28} />} trend="+18% vs Q3" />
        <StatCard label="Sync Revenue (Q4)" value="$13.1K" icon={<Handshake size={28} />} trend="+117% vs Q3" />
        <StatCard label="Avg. Daily Streams" value="2.2K" icon={<BarChart3 size={28} />} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-5">
          <h3 className="text-sm font-semibold text-neutral-900 mb-4">Streaming Trend (K streams)</h3>
          <div className="h-48 flex items-end gap-2">{streamingData.map((v, i) => (<div key={i} className="flex-1 flex flex-col items-center"><div className="w-full bg-neutral-800 rounded-t-md" style={{ height: `${(v / maxStream) * 100}%` }} /><span className="text-xs text-neutral-500 mt-1">{months[i]}</span></div>))}</div>
        </Card>
        <Card className="p-5">
          <h3 className="text-sm font-semibold text-neutral-900 mb-4">Sync Revenue ($K)</h3>
          <div className="h-48 flex items-end gap-2">{syncData.map((v, i) => (<div key={i} className="flex-1 flex flex-col items-center"><div className="w-full bg-violet-600 rounded-t-md" style={{ height: `${(v / Math.max(...syncData)) * 100}%` }} /><span className="text-xs text-neutral-500 mt-1">{months[i]}</span></div>))}</div>
        </Card>
      </div>
      <Card className="p-5 mt-6">
        <h3 className="text-sm font-semibold text-neutral-900 mb-4">Top Tracks by Streams</h3>
        <div className="space-y-3">{[
          { track: 'Midnight Run', artist: 'Adea Lyric', streams: '85K', pct: 42 },
          { track: 'Velvet Sunrise', artist: 'Adea Lyric', streams: '62K', pct: 31 },
          { track: 'Neon Pulse', artist: 'Marcus Cole', streams: '38K', pct: 19 },
          { track: 'Golden Light', artist: 'Luna Vega', streams: '16K', pct: 8 },
        ].map(t => (<div key={t.track} className="flex items-center gap-3"><span className="text-sm font-medium text-neutral-900 min-w-[140px]">{t.track}</span><span className="text-xs text-neutral-500 min-w-[80px]">{t.artist}</span><div className="flex-1 h-6 bg-neutral-100 rounded-full overflow-hidden"><div className="h-full bg-neutral-800 rounded-full" style={{ width: `${t.pct}%` }} /></div><span className="text-sm font-semibold text-neutral-900 min-w-[60px] text-right">{t.streams}</span></div>))}</div>
      </Card>
    </div>
  );
}

function ProSettingsPage() {
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifSync, setNotifSync] = useState(true);
  const [notifRoyalty, setNotifRoyalty] = useState(false);
  return (
    <div>
      <PageHeader title="Settings" description="Notification preferences and connected accounts" />
      <div className="space-y-6">
        <Card className="p-5">
          <h3 className="text-sm font-semibold text-neutral-900 mb-4">Notification Preferences</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-neutral-50"><div><p className="text-sm font-medium text-neutral-900">Email Notifications</p><p className="text-xs text-neutral-500">Receive updates about distribution status</p></div><button onClick={() => setNotifEmail(!notifEmail)} className={`w-10 h-6 rounded-full transition-colors ${notifEmail ? 'bg-neutral-900' : 'bg-neutral-200'} relative`}><div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${notifEmail ? 'left-5' : 'left-1'}`} /></button></div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-neutral-50"><div><p className="text-sm font-medium text-neutral-900">Sync Deal Alerts</p><p className="text-xs text-neutral-500">Get notified when new deal room activity occurs</p></div><button onClick={() => setNotifSync(!notifSync)} className={`w-10 h-6 rounded-full transition-colors ${notifSync ? 'bg-neutral-900' : 'bg-neutral-200'} relative`}><div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${notifSync ? 'left-5' : 'left-1'}`} /></button></div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-neutral-50"><div><p className="text-sm font-medium text-neutral-900">Royalty Statement Alerts</p><p className="text-xs text-neutral-500">Notify when new royalty statements are available</p></div><button onClick={() => setNotifRoyalty(!notifRoyalty)} className={`w-10 h-6 rounded-full transition-colors ${notifRoyalty ? 'bg-neutral-900' : 'bg-neutral-200'} relative`}><div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${notifRoyalty ? 'left-5' : 'left-1'}`} /></button></div>
          </div>
        </Card>
        <Card className="p-5">
          <h3 className="text-sm font-semibold text-neutral-900 mb-4">Connected Accounts</h3>
          <div className="space-y-3">
            {[{ name: 'Spotify for Artists', icon: <Globe size={18} />, connected: true }, { name: 'Apple Music Connect', icon: <Globe size={18} />, connected: true }, { name: 'SoundCloud', icon: <Globe size={18} />, connected: false }].map(a => (
              <div key={a.name} className="flex items-center justify-between p-3 rounded-lg bg-neutral-50"><div className="flex items-center gap-3">{a.icon}<div><p className="text-sm font-medium text-neutral-900">{a.name}</p></div></div>{a.connected ? <Badge color="green">Connected</Badge> : <Button variant="secondary" size="sm">Connect</Button>}</div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

// Legacy GenericProPage for old role-based routes (label, booking, writer, admin) 
function GenericProPage({ title, role }: { title: string; role: string }) {
  const pageTitles: Record<string, Record<string, string>> = {
    label: { requests: 'License Requests', deals: 'Deal History', custom: 'Custom Write Request', messages: 'Messages', documents: 'Contracts & Invoices' },
    booking: { epk: 'Artist EPK', calendar: 'Availability Calendar', request: 'Submit Booking Request', 'my-bookings': 'My Bookings', messages: 'Messages', documents: 'Documents' },
    writer: { 'collab-calls': 'Open Collab Calls', submit: 'Submit a Demo', buy: 'Buy a Song', submissions: 'My Submissions', messages: 'Messages' },
    admin: { users: 'Users & Roles', requests: 'Requests Inbox', catalog: 'Catalog Manager', spend: 'Spend & Financials' },
  };
  const pageTitle = pageTitles[role]?.[title] ?? title.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-900 mb-2">{pageTitle}</h1>
      <p className="text-sm text-neutral-500 mb-8">This section is under development. Full functionality coming soon.</p>
      <EmptyState title={`${pageTitle} coming soon`} description="This feature is being built. Check back later for full functionality." />
    </div>
  );
}

// ============ WRITER PORTAL PAGE COMPONENTS ============

function WriterStudioProjectsPage() {
  const [filterStage, setFilterStage] = useState<string>('all');
  const projects = [
    { id: 'wp1', title: 'Midnight Echoes', stage: 'mastered', collaborators: 3, tracks: 8, lastUpdated: '2 hours ago', color: 'from-violet-600 to-purple-800' },
    { id: 'wp2', title: 'Velvet Sunrise', stage: 'recording', collaborators: 2, tracks: 1, lastUpdated: '1 day ago', color: 'from-amber-500 to-orange-700' },
    { id: 'wp3', title: 'Neon Dreams', stage: 'mixing', collaborators: 4, tracks: 6, lastUpdated: '3 days ago', color: 'from-blue-500 to-cyan-700' },
    { id: 'wp4', title: 'Untitled Ballad', stage: 'writing', collaborators: 1, tracks: 0, lastUpdated: '5 days ago', color: 'from-emerald-500 to-green-700' },
    { id: 'wp5', title: 'Thunder Road (Remix)', stage: 'writing', collaborators: 2, tracks: 0, lastUpdated: '1 week ago', color: 'from-rose-500 to-red-700' },
    { id: 'wp6', title: 'Ocean Memory', stage: 'mastered', collaborators: 2, tracks: 4, lastUpdated: '2 weeks ago', color: 'from-teal-500 to-cyan-700' },
  ];
  const filtered = projects.filter(p => filterStage === 'all' || p.stage === filterStage);
  const stageColors: Record<string, 'gray' | 'amber' | 'blue' | 'green' | 'purple'> = { writing: 'amber', recording: 'blue', mixing: 'purple', mastered: 'green' };
  return (
    <div>
      <PageHeader title="My Projects" description="Card grid filterable by stage — writing, recording, mixing, mastered" actions={<Button variant="primary" className="bg-violet-600 hover:bg-violet-700"><Plus size={16} /> New Project</Button>} />
      <div className="flex flex-wrap gap-2 mb-4">
        {['all', 'writing', 'recording', 'mixing', 'mastered'].map(s => (
          <button key={s} onClick={() => setFilterStage(s)} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filterStage === s ? 'bg-violet-600 text-white' : 'bg-white border border-neutral-200 text-neutral-700 hover:border-neutral-300'}`}>{s === 'all' ? 'All Stages' : s}</button>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(p => (
          <Card key={p.id} className="p-4 hover:shadow-md transition-shadow cursor-pointer">
            <div className={`w-full h-24 rounded-lg bg-gradient-to-br ${p.color} flex items-center justify-center mb-3`}><Disc3 size={24} className="text-white/20" /></div>
            <div className="flex items-start justify-between mb-2"><p className="text-sm font-semibold text-neutral-900">{p.title}</p><Badge color={stageColors[p.stage]}>{p.stage}</Badge></div>
            <div className="flex items-center gap-3 text-xs text-neutral-500 mb-3"><span><Users size={14} className="inline mr-1" />{p.collaborators} collaborators</span><span><Music size={14} className="inline mr-1" />{p.tracks} tracks</span></div>
            <div className="flex items-center justify-between pt-2 border-t border-neutral-100"><span className="text-xs text-neutral-400">Updated {p.lastUpdated}</span></div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function WriterCollaboratorsPage() {
  const projects = [
    { id: 'wp1', title: 'Midnight Echoes', collaborators: [{ name: 'Adea Lyric', role: 'Artist / Songwriter', status: 'active' }, { name: 'Marcus Cole', role: 'Producer', status: 'active' }, { name: 'Kai Nakamura', role: 'Mixing Engineer', status: 'pending_invite' }] },
    { id: 'wp2', title: 'Velvet Sunrise', collaborators: [{ name: 'Adea Lyric', role: 'Artist', status: 'active' }, { name: 'Luna Vega', role: 'Backing Vocals', status: 'active' }] },
    { id: 'wp3', title: 'Neon Dreams', collaborators: [{ name: 'Marcus Cole', role: 'Producer', status: 'active' }, { name: 'Adea Lyric', role: 'Songwriter', status: 'active' }, { name: 'DJ Flux', role: 'Co-Producer', status: 'pending_invite' }, { name: 'Skye Martin', role: 'Vocalist', status: 'declined' }] },
  ];
  const statusColors: Record<string, 'green' | 'amber' | 'red'> = { active: 'green', pending_invite: 'amber', declined: 'red' };
  return (
    <div>
      <PageHeader title="Collaborators & Invites" description="Team members per project with role and invite status" actions={<Button variant="primary" className="bg-violet-600 hover:bg-violet-700"><Plus size={16} /> Invite Collaborator</Button>} />
      <div className="space-y-4">
        {projects.map(p => (
          <Card key={p.id} className="p-5">
            <div className="flex items-center gap-2 mb-3"><Disc3 size={16} className="text-violet-400" /><h3 className="text-sm font-semibold text-neutral-900">{p.title}</h3></div>
            <div className="space-y-2">{p.collaborators.map(c => (
              <div key={c.name} className="flex items-center justify-between p-3 rounded-lg bg-neutral-50"><div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-400 to-purple-600 flex items-center justify-center text-white text-xs font-bold">{c.name.split(' ').map(n => n[0]).join('')}</div><div><p className="text-sm font-medium text-neutral-900">{c.name}</p><p className="text-xs text-neutral-500">{c.role}</p></div></div><Badge color={statusColors[c.status]}>{c.status.replace('_', ' ')}</Badge></div>
            ))}</div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function WriterBeatMarketplacePage() {
  const [filterLicense, setFilterLicense] = useState<string>('all');
  const beats = [
    { id: 'b1', title: 'Soul Connection', producer: 'Marcus Cole', bpm: 95, key: 'Gm', genre: 'R&B', license: 'exclusive', price: '$500', duration: '3:22', preview: true },
    { id: 'b2', title: 'Crimson Wave', producer: 'DJ Flux', bpm: 128, key: 'Am', genre: 'Electronic', license: 'non-exclusive', price: '$50', duration: '2:58', preview: true },
    { id: 'b3', title: 'Golden Dawn', producer: 'Kai Nakamura', bpm: 82, key: 'C', genre: 'Jazz Fusion', license: 'exclusive', price: '$750', duration: '4:10', preview: true },
    { id: 'b4', title: 'Street Anthem', producer: 'BeatHouse', bpm: 140, key: 'Dm', genre: 'Hip-Hop', license: 'non-exclusive', price: '$35', duration: '2:45', preview: true },
    { id: 'b5', title: 'Velvet Night', producer: 'Luna Vega', bpm: 110, key: 'Eb', genre: 'Pop', license: 'non-exclusive', price: '$75', duration: '3:55', preview: false },
    { id: 'b6', title: 'Ember Glow', producer: 'Marcus Cole', bpm: 88, key: 'Fm', genre: 'Neo-Soul', license: 'exclusive', price: '$600', duration: '3:42', preview: true },
  ];
  const filtered = beats.filter(b => filterLicense === 'all' || b.license === filterLicense);
  const licenseColors: Record<string, string> = { exclusive: 'bg-violet-100 text-violet-700', 'non-exclusive': 'bg-neutral-100 text-neutral-700' };
  return (
    <div>
      <PageHeader title="Beat Marketplace" description="Browse beats with audio preview, license type, and price" />
      <div className="flex flex-wrap gap-2 mb-4">
        {['all', 'exclusive', 'non-exclusive'].map(l => (
          <button key={l} onClick={() => setFilterLicense(l)} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filterLicense === l ? 'bg-violet-600 text-white' : 'bg-white border border-neutral-200 text-neutral-700 hover:border-neutral-300'}`}>{l === 'all' ? 'All License Types' : l}</button>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(b => (
          <Card key={b.id} className="p-4 hover:shadow-md transition-shadow cursor-pointer">
            <div className="w-full h-28 rounded-lg bg-gradient-to-br from-violet-600 to-purple-800 flex items-center justify-center mb-3 relative">
              <Music2 size={24} className="text-white/20" />
              {b.preview && <button className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-white/90 text-violet-700 flex items-center justify-center hover:bg-white"><Play size={14} className="ml-0.5" /></button>}
            </div>
            <p className="text-sm font-semibold text-neutral-900 mb-1">{b.title}</p>
            <p className="text-xs text-neutral-500 mb-2">by {b.producer} · {b.genre}</p>
            <div className="flex items-center gap-2 mb-2"><span className="text-xs font-mono text-neutral-600">{b.bpm} BPM</span><span className="text-xs font-mono text-neutral-600">{b.key}</span><span className="text-xs text-neutral-600">{b.duration}</span></div>
            <div className="flex items-center justify-between pt-2 border-t border-neutral-100"><span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${licenseColors[b.license]}`}>{b.license}</span><span className="text-sm font-semibold text-neutral-900">{b.price}</span></div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function WriterSongwritingWorkspacePage() {
  const [lyrics, setLyrics] = useState('Verse 1:\nMidnight shadows fall across the room\nWhispers echo through the velvet gloom\nYour memory lingers like a fading tune\n\nChorus:\nI\'m chasing echoes in the dark\nSearching for the spark we left behind\nEvery step a rhythm, every breath a mark\nMidnight echoes — you\'re still on my mind\n\nVerse 2:\nStreetlights flicker on the rain-soaked road\nStories written in the lines we never told\nTime moves forward but the heart stays slow\nStill reaching for the warmth we used to know');
  const [comment, setComment] = useState('');
  const versions = [
    { id: 'v1', label: 'Original Draft', date: 'Jan 12, 2026', author: 'Adea Lyric' },
    { id: 'v2', label: 'With chorus revision', date: 'Jan 18, 2026', author: 'Marcus Cole' },
    { id: 'v3', label: 'Final verse polish', date: 'Jan 25, 2026', author: 'Adea Lyric' },
  ];
  const comments = [
    { id: 'c1', author: 'Marcus Cole', text: 'The chorus is strong. Consider making Verse 2 more rhythmic to match the energy shift.', time: '2 days ago' },
    { id: 'c2', author: 'Luna Vega', text: 'Love "fading tune" — great imagery. Maybe add a bridge before final chorus?', time: '1 day ago' },
  ];
  return (
    <div>
      <PageHeader title="Songwriting Workspace" description="Split-pane editor: lyrics on one side, comments and versions on the other" actions={<Button variant="secondary" className="bg-violet-600 text-white hover:bg-violet-700"><Save size={16} /> Save Draft</Button>} />
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 min-w-0">
          <Card className="p-4 h-full">
            <div className="flex items-center justify-between mb-3"><h3 className="text-sm font-semibold text-neutral-900">Lyrics Editor</h3><Badge color="purple">Editing</Badge></div>
            <Textarea value={lyrics} onChange={e => setLyrics(e.target.value)} rows={16} className="border-violet-200 focus:ring-violet-600/10 focus:border-violet-400" placeholder="Write your lyrics here..." />
          </Card>
        </div>
        <div className="lg:w-72 space-y-4">
          <Card className="p-4">
            <h3 className="text-sm font-semibold text-neutral-900 mb-3">Version History</h3>
            <div className="space-y-2">{versions.map(v => (
              <div key={v.id} className="flex items-center justify-between p-2 rounded-lg bg-neutral-50 cursor-pointer hover:bg-violet-50"><div><p className="text-sm font-medium text-neutral-900">{v.label}</p><p className="text-xs text-neutral-500">{v.author} · {v.date}</p></div><ChevronRight size={14} className="text-neutral-400" /></div>
            ))}</div>
          </Card>
          <Card className="p-4">
            <h3 className="text-sm font-semibold text-neutral-900 mb-3">Comments</h3>
            <div className="space-y-2 mb-3 max-h-48 overflow-y-auto">{comments.map(c => (
              <div key={c.id} className="p-2 rounded-lg bg-neutral-50"><div className="flex items-center gap-2 mb-1"><div className="w-6 h-6 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center text-xs font-bold">{c.author[0]}</div><span className="text-xs font-medium text-neutral-900">{c.author}</span><span className="text-xs text-neutral-400">{c.time}</span></div><p className="text-xs text-neutral-700">{c.text}</p></div>
            ))}</div>
            <div className="flex gap-2"><Input value={comment} onChange={e => setComment(e.target.value)} placeholder="Add comment..." className="text-xs" /><Button variant="primary" size="sm" className="bg-violet-600 hover:bg-violet-700" onClick={() => { if (comment) { setComment(''); toast('success', 'Comment added'); } }}><Send size={14} /></Button></div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function WriterSampleLibraryPage() {
  const samples = [
    { id: 'sl1', title: 'Lo-Fi Piano Phrase', pack: 'Midnight Keys', bpm: 85, key: 'Cm', duration: '0:08', format: 'WAV', size: '3.2 MB' },
    { id: 'sl2', title: 'Vinyl Crackle Texture', pack: 'Analog Noise', bpm: null, key: '-', duration: '0:15', format: 'WAV', size: '5.8 MB' },
    { id: 'sl3', title: '808 Sub Bass Hit', pack: 'Heavy Low', bpm: 140, key: 'D', duration: '0:02', format: 'WAV', size: '1.1 MB' },
    { id: 'sl4', title: 'Jazz Drum Break', pack: 'Live Sessions', bpm: 110, key: '-', duration: '0:12', format: 'WAV', size: '4.5 MB' },
    { id: 'sl5', title: 'Synth Pad Atmosphere', pack: 'Ambient Worlds', bpm: null, key: 'Am', duration: '0:30', format: 'WAV', size: '12 MB' },
    { id: 'sl6', title: 'Vocal Chop — Soul', pack: 'Vocal Elements', bpm: 95, key: 'Gm', duration: '0:04', format: 'WAV', size: '1.8 MB' },
    { id: 'sl7', title: 'Guitar Strum — Clean', pack: 'String Sessions', bpm: 88, key: 'E', duration: '0:06', format: 'WAV', size: '2.4 MB' },
    { id: 'sl8', title: 'FM Synth Lead', pack: 'Digital Pulse', bpm: 128, key: 'Fm', duration: '0:05', format: 'WAV', size: '2.0 MB' },
  ];
  return (
    <div>
      <PageHeader title="Sample Library" description="Grid with waveform thumbnails and play-on-hover preview" actions={<Button variant="primary" className="bg-violet-600 hover:bg-violet-700"><Upload size={16} /> Upload Sample</Button>} />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {samples.map(s => (
          <Card key={s.id} className="p-3 hover:shadow-md transition-shadow cursor-pointer group">
            <div className="w-full h-16 rounded-lg bg-gradient-to-r from-violet-500/20 to-purple-500/20 flex items-center justify-center mb-2 relative">
              <div className="flex items-end gap-[1px] h-8">{Array.from({ length: 24 }).map((_, i) => <div key={i} className="w-1 bg-violet-400 rounded-t-sm" style={{ height: `${Math.random() * 100}%` }} />)}</div>
              <button className="absolute inset-0 flex items-center justify-center bg-violet-600/0 group-hover:bg-violet-600/80 transition-colors rounded-lg opacity-0 group-hover:opacity-100"><Play size={18} className="text-white" /></button>
            </div>
            <p className="text-sm font-semibold text-neutral-900">{s.title}</p>
            <p className="text-xs text-neutral-500 mb-1">{s.pack}</p>
            <div className="flex items-center gap-2 text-xs text-neutral-500"><span>{s.bpm ? `${s.bpm} BPM` : '—'}</span><span>{s.key}</span><span>{s.duration}</span></div>
            <div className="flex items-center justify-between mt-1.5 pt-1.5 border-t border-neutral-100"><span className="text-xs text-neutral-400">{s.format} · {s.size}</span></div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function WriterReleasesDraftsPage() {
  const drafts = [
    { id: 'rd1', title: 'Midnight Echoes', type: 'Album', validation: { coverArt: 'pass', metadata: 'pass', audio: 'fail', rights: 'pending' }, tracks: 8, lastSaved: '2 hours ago' },
    { id: 'rd2', title: 'Untitled Ballad', type: 'Single', validation: { coverArt: 'missing', metadata: 'partial', audio: 'pass', rights: 'missing' }, tracks: 1, lastSaved: '5 days ago' },
    { id: 'rd3', title: 'Neon Dreams', type: 'EP', validation: { coverArt: 'pass', metadata: 'pass', audio: 'pass', rights: 'pass' }, tracks: 6, lastSaved: '1 day ago' },
  ];
  const valColors: Record<string, string> = { pass: 'bg-green-100 text-green-700', fail: 'bg-red-100 text-red-700', partial: 'bg-amber-100 text-amber-700', missing: 'bg-neutral-100 text-neutral-700', pending: 'bg-blue-100 text-blue-700' };
  const valIcons: Record<string, ReactNode> = { pass: <CheckCircle2 size={12} />, fail: <XCircle size={12} />, partial: <AlertCircle size={12} />, missing: <Circle size={12} />, pending: <Clock size={12} /> };
  return (
    <div>
      <PageHeader title="Draft Releases" description="List table with Validation Engine status per field" actions={<Button variant="primary" className="bg-violet-600 hover:bg-violet-700"><Plus size={16} /> New Draft</Button>} />
      <div className="space-y-3">
        {drafts.map(d => (
          <Card key={d.id} className="p-4">
            <div className="flex items-start justify-between mb-3"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-600 to-purple-800 flex items-center justify-center"><Disc3 size={18} className="text-white/30" /></div><div><p className="text-sm font-semibold text-neutral-900">{d.title}</p><p className="text-xs text-neutral-500">{d.type} · {d.tracks} tracks · Saved {d.lastSaved}</p></div></div><Button variant="secondary" size="sm">Edit</Button></div>
            <div className="flex flex-wrap gap-2 pt-3 border-t border-neutral-100">{Object.entries(d.validation).map(([field, status]) => (
              <div key={field} className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${valColors[status]}`}>{valIcons[status]}<span className="capitalize">{field === 'coverArt' ? 'Cover Art' : field === 'rights' ? 'Rights & Splits' : field === 'metadata' ? 'Metadata' : 'Audio'}</span></div>
            ))}</div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function WriterReleasesLivePage() {
  const releases = [
    { id: 'rl1', title: 'Golden Hour', artist: 'Luna Vega', type: 'Single', releaseDate: 'Jul 22, 2025', dspCount: 4 },
    { id: 'rl2', title: 'Velvet Skies', artist: 'Marcus Cole', type: 'Single', releaseDate: 'Nov 1, 2025', dspCount: 3 },
    { id: 'rl3', title: 'Midnight Echoes', artist: 'Adea Lyric', type: 'Album', releaseDate: 'Sep 15, 2025', dspCount: 5 },
  ];
  return (
    <div>
      <PageHeader title="Submitted / Live Releases" description="Card grid with cover art for live releases" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {releases.map(r => (
          <Card key={r.id} className="p-4 hover:shadow-md transition-shadow cursor-pointer">
            <div className="w-full h-40 rounded-lg bg-gradient-to-br from-violet-600 to-purple-800 flex items-center justify-center mb-3"><Disc3 size={32} className="text-white/15" /></div>
            <p className="text-sm font-semibold text-neutral-900 mb-1">{r.title}</p>
            <p className="text-xs text-neutral-500 mb-2">{r.artist} · {r.type} · {r.releaseDate}</p>
            <div className="flex items-center justify-between pt-2 border-t border-neutral-100"><Badge color="green">Live</Badge><span className="text-xs text-neutral-500">{r.dspCount} DSPs</span></div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function WriterRightsMySplitsPage() {
  const splits = [
    { id: 'ms1', track: 'Midnight Run', release: 'Midnight Echoes', splits: [{ name: 'Adea Lyric', role: 'Artist', pct: 45 }, { name: 'Marcus Cole', role: 'Songwriter', pct: 25 }, { name: 'Label Publishing', role: 'Publisher', pct: 30 }] },
    { id: 'ms2', track: 'Velvet Sunrise', release: 'Midnight Echoes', splits: [{ name: 'Adea Lyric', role: 'Artist', pct: 50 }, { name: 'Luna Vega', role: 'Backing Vocals', pct: 10 }, { name: 'Label Publishing', role: 'Publisher', pct: 40 }] },
    { id: 'ms3', track: 'Neon Pulse', release: 'Velvet Skies', splits: [{ name: 'Marcus Cole', role: 'Artist / Producer', pct: 60 }, { name: 'Adea Lyric', role: 'Songwriter', pct: 20 }, { name: 'Cole Publishing', role: 'Publisher', pct: 20 }] },
  ];
  return (
    <div>
      <PageHeader title="My Splits" description="Split percentage per track with role breakdown" actions={<Button variant="primary" className="bg-violet-600 hover:bg-violet-700"><Plus size={16} /> Add Split</Button>} />
      <Card className="overflow-hidden p-0">
        <table className="w-full text-sm"><thead><tr className="border-b border-neutral-200 bg-neutral-50"><th className="py-2.5 px-4 text-left font-medium text-neutral-500">Track</th><th className="py-2.5 px-4 text-left font-medium text-neutral-500">Release</th><th className="py-2.5 px-4 text-left font-medium text-neutral-500">Split Details</th></tr></thead>
        <tbody>{splits.map(s => (
          <tr key={s.id} className="border-b border-neutral-100 hover:bg-neutral-50"><td className="py-3 px-4 font-medium text-neutral-900">{s.track}</td><td className="py-3 px-4 text-neutral-600">{s.release}</td><td className="py-3 px-4"><div className="flex flex-wrap gap-1.5">{s.splits.map(sp => <div key={sp.name} className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${sp.role === 'Artist' || sp.role === 'Artist / Producer' ? 'bg-violet-100 text-violet-700' : sp.role === 'Publisher' ? 'bg-teal-100 text-teal-700' : 'bg-neutral-100 text-neutral-700'}`}>{sp.name} — {sp.pct}%</div>)}</div></td></tr>
        ))}</tbody></table>
      </Card>
    </div>
  );
}

function WriterRightsDocumentsPage() {
  const documents = [
    { id: 'doc1', title: 'Split Sheet — Midnight Run', type: 'Split Sheet', generatedFrom: 'Beat Marketplace Purchase', date: 'Jan 15, 2026', status: 'signed' },
    { id: 'doc2', title: 'Split Sheet — Velvet Sunrise', type: 'Split Sheet', generatedFrom: 'Direct Agreement', date: 'Jan 20, 2026', status: 'pending_signature' },
    { id: 'doc3', title: 'License Agreement — Soul Connection Beat', type: 'License', generatedFrom: 'Beat Marketplace Purchase', date: 'Jan 12, 2026', status: 'signed' },
    { id: 'doc4', title: 'Sync License — Midnight Run (Film)', type: 'Sync License', generatedFrom: 'Deal Room', date: 'Nov 15, 2025', status: 'signed' },
  ];
  const statusColors: Record<string, 'green' | 'amber' | 'red'> = { signed: 'green', pending_signature: 'amber', expired: 'red' };
  return (
    <div>
      <PageHeader title="Split Sheets & Contracts" description="Generated documents from marketplace purchases and deal rooms" actions={<Button variant="secondary"><Download size={16} /> Export All</Button>} />
      <Card className="overflow-hidden p-0">
        <table className="w-full text-sm"><thead><tr className="border-b border-neutral-200 bg-neutral-50"><th className="py-2.5 px-4 text-left font-medium text-neutral-500">Document</th><th className="py-2.5 px-4 text-left font-medium text-neutral-500">Type</th><th className="py-2.5 px-4 text-left font-medium text-neutral-500">Generated From</th><th className="py-2.5 px-4 text-left font-medium text-neutral-500">Date</th><th className="py-2.5 px-4 text-left font-medium text-neutral-500">Status</th><th className="py-2.5 px-4 text-right font-medium text-neutral-500">Action</th></tr></thead>
        <tbody>{documents.map(d => (
          <tr key={d.id} className="border-b border-neutral-100 hover:bg-neutral-50"><td className="py-2.5 px-4 font-medium text-neutral-900">{d.title}</td><td className="py-2.5 px-4"><Badge color="gray" size="sm">{d.type}</Badge></td><td className="py-2.5 px-4 text-neutral-600">{d.generatedFrom}</td><td className="py-2.5 px-4 text-neutral-500">{d.date}</td><td className="py-2.5 px-4"><Badge color={statusColors[d.status]}>{d.status.replace('_', ' ')}</Badge></td><td className="py-2.5 px-4 text-right"><Button variant="secondary" size="sm"><Download size={14} /></Button></td></tr>
        ))}</tbody></table>
      </Card>
    </div>
  );
}

function WriterRoyaltiesEarningsPage() {
  const months = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const streamingEarnings = [1.2, 1.8, 1.5, 2.1, 1.9, 2.4];
  const syncEarnings = [0.5, 0.3, 1.2, 1.3, 0.8, 1.5];
  const maxE = Math.max(...streamingEarnings, ...syncEarnings);
  return (
    <div>
      <PageHeader title="Earnings Dashboard" description="Chart-first dashboard showing earnings trend by source" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard label="Total Earnings (Q4)" value="$6.2K" icon={<DollarSign size={28} />} trend="+42% vs Q3" />
        <StatCard label="Streaming Revenue" value="$6.4K" icon={<Play size={28} />} trend="YTD" />
        <StatCard label="Sync Revenue" value="$4.6K" icon={<Handshake size={28} />} trend="YTD" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-5">
          <h3 className="text-sm font-semibold text-neutral-900 mb-4">Streaming Earnings ($K)</h3>
          <div className="h-48 flex items-end gap-2">{streamingEarnings.map((v, i) => (<div key={i} className="flex-1 flex flex-col items-center"><div className="w-full bg-violet-600 rounded-t-md" style={{ height: `${(v / maxE) * 100}%` }} /><span className="text-xs text-neutral-500 mt-1">{months[i]}</span></div>))}</div>
        </Card>
        <Card className="p-5">
          <h3 className="text-sm font-semibold text-neutral-900 mb-4">Sync Earnings ($K)</h3>
          <div className="h-48 flex items-end gap-2">{syncEarnings.map((v, i) => (<div key={i} className="flex-1 flex flex-col items-center"><div className="w-full bg-emerald-500 rounded-t-md" style={{ height: `${(v / maxE) * 100}%` }} /><span className="text-xs text-neutral-500 mt-1">{months[i]}</span></div>))}</div>
        </Card>
      </div>
      <Card className="p-5 mt-6">
        <h3 className="text-sm font-semibold text-neutral-900 mb-4">Earnings by Source</h3>
        <div className="space-y-3">{[
          { source: 'Spotify', amount: '$3,200', pct: 35 },
          { source: 'Apple Music', amount: '$1,800', pct: 20 },
          { source: 'Sync Licensing', amount: '$2,400', pct: 26 },
          { source: 'Amazon Music', amount: '$900', pct: 10 },
          { source: 'YouTube', amount: '$600', pct: 9 },
        ].map(s => (<div key={s.source} className="flex items-center gap-3"><span className="text-sm font-medium text-neutral-900 min-w-[100px]">{s.source}</span><div className="flex-1 h-6 bg-neutral-100 rounded-full overflow-hidden"><div className="h-full bg-violet-600 rounded-full" style={{ width: `${s.pct}%` }} /></div><span className="text-sm font-semibold text-neutral-900 min-w-[60px] text-right">{s.amount}</span></div>))}</div>
      </Card>
    </div>
  );
}

function WriterRoyaltiesStatementsPage() {
  const statements = [
    { id: 'st1', period: 'Q4 2025', date: 'Jan 15, 2026', total: '$2,425', status: 'available' },
    { id: 'st2', period: 'Q3 2025', date: 'Oct 15, 2025', total: '$1,725', status: 'available' },
    { id: 'st3', period: 'Q2 2025', date: 'Jul 15, 2025', total: '$1,100', status: 'available' },
  ];
  return (
    <div>
      <PageHeader title="Royalty Statements" description="Per-period documents available for download" actions={<Button variant="secondary"><Download size={16} /> Export All</Button>} />
      <div className="space-y-3">
        {statements.map(s => (
          <Card key={s.id} className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3"><FileText size={20} className="text-violet-400" /><div><p className="text-sm font-semibold text-neutral-900">{s.period} Statement</p><p className="text-xs text-neutral-500">Issued {s.date}</p></div></div>
              <div className="flex items-center gap-3"><Badge color="green">{s.total}</Badge><Button variant="secondary" size="sm"><Download size={14} /> PDF</Button></div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function WriterRoyaltiesPayoutPage() {
  const [bankName, setBankName] = useState('Chase Bank');
  const [routing, setRouting] = useState('021000021');
  const [account, setAccount] = useState('****4789');
  const [taxFiled, setTaxFiled] = useState(true);
  return (
    <div>
      <PageHeader title="Payout Settings" description="Banking details and tax forms for royalty disbursements" />
      <div className="space-y-6">
        <Card className="p-5">
          <h3 className="text-sm font-semibold text-neutral-900 mb-4">Banking Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Bank Name"><Input value={bankName} onChange={e => setBankName(e.target.value)} /></Field>
            <Field label="Routing Number"><Input value={routing} onChange={e => setRouting(e.target.value)} /></Field>
            <Field label="Account Number"><Input value={account} onChange={e => setAccount(e.target.value)} type="password" /></Field>
            <Field label="Account Type"><Select><option value="checking">Checking</option><option value="savings">Savings</option></Select></Field>
          </div>
          <div className="mt-4"><Button variant="primary" className="bg-violet-600 hover:bg-violet-700" onClick={() => toast('success', 'Banking details updated')}>Save Changes</Button></div>
        </Card>
        <Card className="p-5">
          <h3 className="text-sm font-semibold text-neutral-900 mb-4">Tax Forms</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-neutral-50"><div className="flex items-center gap-3"><FileCheck size={18} className={taxFiled ? 'text-green-600' : 'text-neutral-400'} /><div><p className="text-sm font-medium text-neutral-900">W-9 (US Tax ID)</p><p className="text-xs text-neutral-500">Required for US-based creators</p></div></div>{taxFiled ? <Badge color="green">Filed</Badge> : <Button variant="secondary" size="sm">Upload W-9</Button>}</div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-neutral-50"><div className="flex items-center gap-3"><FileCheck size={18} className="text-neutral-400" /><div><p className="text-sm font-medium text-neutral-900">1099-MISC</p><p className="text-xs text-neutral-500">Annual earnings report (auto-generated)</p></div></div><Badge color="gray">Auto</Badge></div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function WriterSyncOpportunitiesPage() {
  const briefs = [
    { id: 'so1', title: 'Dark Chase Scene — Film', brief: 'Looking for dark, energetic tracks for action sequence', budget: '$15K–$25K', deadline: 'Mar 15, 2026', genre: 'Action', submissions: 4 },
    { id: 'so2', title: 'Lifestyle Brand Campaign', brief: 'Warm, uplifting track for summer lifestyle campaign', budget: '$8K–$12K', deadline: 'Feb 1, 2026', genre: 'Commercial', submissions: 2 },
    { id: 'so3', title: 'Streaming Original Series', brief: 'Reflective, nostalgic track for flashback montage', budget: '$10K–$18K', deadline: 'Apr 10, 2026', genre: 'TV', submissions: 7 },
    { id: 'so4', title: 'Indie Game Soundtrack', brief: 'Calm, ambient track for exploration mode', budget: '$2K–$5K', deadline: 'Jun 1, 2026', genre: 'Gaming', submissions: 1 },
  ];
  const dealRooms = [
    { id: 'dr1', title: 'Midnight Run — Film License', counterpart: 'Lakeshore Entertainment', stage: 'negotiation', deadline: 'Mar 15, 2026' },
    { id: 'dr2', title: 'Velvet Sunrise — Ad Campaign', counterpart: 'Nike Creative', stage: 'offer_sent', deadline: 'Feb 1, 2026' },
  ];
  const stageColors: Record<string, 'gray' | 'blue' | 'amber' | 'green' | 'purple' | 'red'> = { negotiation: 'purple', offer_sent: 'blue', draft: 'gray', cleared: 'green' };
  return (
    <div>
      <PageHeader title="Sync Opportunities" description="Open briefs and active deal rooms" actions={<Button variant="primary" className="bg-violet-600 hover:bg-violet-700"><Search size={16} /> Browse All</Button>} />
      <h3 className="text-sm font-semibold text-neutral-900 mb-3">Open Briefs</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {briefs.map(b => (
          <Card key={b.id} className="p-4 hover:shadow-md transition-shadow cursor-pointer">
            <p className="text-sm font-semibold text-neutral-900 mb-1">{b.title}</p>
            <p className="text-xs text-neutral-500 mb-2">{b.brief}</p>
            <div className="flex items-center gap-3 text-xs text-neutral-500 mb-2"><span><DollarSign size={14} className="inline mr-1" />{b.budget}</span><span><Clock size={14} className="inline mr-1" />{b.deadline}</span><span><Tag size={14} className="inline mr-1" />{b.genre}</span></div>
            <div className="flex items-center justify-between pt-2 border-t border-neutral-100"><Badge color="purple" size="sm">{b.submissions} submissions</Badge><Button variant="secondary" size="sm">Submit Track</Button></div>
          </Card>
        ))}
      </div>
      <h3 className="text-sm font-semibold text-neutral-900 mb-3">Active Deal Rooms</h3>
      <div className="space-y-3">
        {dealRooms.map(dr => (
          <Card key={dr.id} className="p-4 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center justify-between"><div><p className="text-sm font-semibold text-neutral-900">{dr.title}</p><p className="text-xs text-neutral-500">{dr.counterpart} · Deadline {dr.deadline}</p></div><Badge color={stageColors[dr.stage]}>{dr.stage.replace('_', ' ')}</Badge></div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function WriterSyncDealsPage() {
  const deals = [
    { id: 'wd1', title: 'Midnight Run — Film License', counterpart: 'Lakeshore Entertainment', fee: '$25,000', territory: 'Worldwide', stage: 'negotiation', deadline: 'Mar 15, 2026' },
    { id: 'wd2', title: 'Velvet Sunrise — Ad Campaign', counterpart: 'Nike Creative', fee: '$18,000', territory: 'North America', stage: 'offer_sent', deadline: 'Feb 1, 2026' },
  ];
  const stageColors: Record<string, 'gray' | 'blue' | 'amber' | 'green' | 'purple' | 'red'> = { negotiation: 'purple', offer_sent: 'blue', draft: 'gray', cleared: 'green' };
  return (
    <div>
      <PageHeader title="Active Deal Rooms" description="Negotiations you're actively involved in" />
      <div className="space-y-4">
        {deals.map(d => (
          <Card key={d.id} className="p-5 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-start justify-between mb-3"><div><p className="text-sm font-semibold text-neutral-900">{d.title}</p><p className="text-xs text-neutral-500">{d.counterpart}</p></div><Badge color={stageColors[d.stage]}>{d.stage.replace('_', ' ')}</Badge></div>
            <div className="flex items-center gap-4 text-xs text-neutral-500 pt-3 border-t border-neutral-100"><span><DollarSign size={14} className="inline mr-1" />{d.fee}</span><span><Globe size={14} className="inline mr-1" />{d.territory}</span><span><Clock size={14} className="inline mr-1" />{d.deadline}</span></div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function WriterD2fTiersPage() {
  const tiers = [
    { id: 'dt1', name: 'Free Fan', price: '$0/mo', members: 342, perks: ['Public posts', 'Stream updates', 'Newsletter'] },
    { id: 'dt2', name: 'Inner Circle', price: '$5/mo', members: 89, perks: ['Exclusive tracks', 'Behind-the-scenes', 'Early ticket access', 'Community chat'] },
    { id: 'dt3', name: 'VIP Collective', price: '$15/mo', members: 23, perks: ['All Inner Circle perks', 'Monthly livestream', 'Direct messaging', 'Signed merch discount', 'VIP meet & greet'] },
  ];
  return (
    <div>
      <PageHeader title="Subscription Tiers" description="Fan subscription tiers matching the admin bundles view" actions={<Button variant="primary" className="bg-violet-600 hover:bg-violet-700"><Plus size={16} /> Add Tier</Button>} />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {tiers.map(t => (
          <Card key={t.id} className={`p-5 ${t.name === 'VIP Collective' ? 'border-2 border-violet-400' : ''}`}>
            <div className="text-center mb-4"><h3 className="text-lg font-bold text-neutral-900">{t.name}</h3><p className="text-2xl font-bold text-violet-600 mt-1">{t.price}</p><p className="text-xs text-neutral-500 mt-1">{t.members} members</p></div>
            <div className="space-y-2 pt-4 border-t border-neutral-100">{t.perks.map(p => <div key={p} className="flex items-center gap-2 text-sm text-neutral-700"><CheckCircle2 size={14} className="text-violet-500" />{p}</div>)}</div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function WriterD2fContentPage() {
  const content = [
    { id: 'dc1', title: 'Studio Session Recording — Midnight Echoes', type: 'Video', tier: 'Inner Circle', date: 'Jan 20, 2026', views: 45 },
    { id: 'dc2', title: 'Unreleased Demo — Velvet Sunrise (Alt Version)', type: 'Audio', tier: 'VIP Collective', date: 'Jan 18, 2026', plays: 12 },
    { id: 'dc3', title: 'Songwriting Breakdown: Midnight Run', type: 'Video', tier: 'Inner Circle', date: 'Jan 10, 2026', views: 89 },
    { id: 'dc4', title: 'Monthly Artist Update — January 2026', type: 'Post', tier: 'Free Fan', date: 'Jan 1, 2026', views: 342 },
  ];
  const typeIcons: Record<string, ReactNode> = { Video: <VideoIcon size={16} className="text-violet-500" />, Audio: <Music size={16} className="text-violet-500" />, Post: <PenLine size={16} className="text-violet-500" /> };
  return (
    <div>
      <PageHeader title="Exclusive Content" description="Content library for your fan tiers" actions={<Button variant="primary" className="bg-violet-600 hover:bg-violet-700"><Plus size={16} /> New Content</Button>} />
      <div className="space-y-3">
        {content.map(c => (
          <Card key={c.id} className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">{typeIcons[c.type]}<div><p className="text-sm font-semibold text-neutral-900">{c.title}</p><p className="text-xs text-neutral-500">{c.tier} · {c.date}</p></div></div>
              <div className="flex items-center gap-3"><Badge color={c.tier === 'VIP Collective' ? 'purple' : c.tier === 'Inner Circle' ? 'teal' : 'gray'} size="sm">{c.tier}</Badge><span className="text-xs text-neutral-400">{c.type === 'Video' ? `${c.views} views` : c.type === 'Audio' ? `${c.plays} plays` : `${c.views} views`}</span></div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function WriterShowsPage() {
  const shows = [
    { id: 'ws1', venue: 'The Fillmore', city: 'Philadelphia, PA', date: 'Feb 28, 2026', status: 'confirmed', promoter: 'Live Nation' },
    { id: 'ws2', venue: 'Brooklyn Steel', city: 'Brooklyn, NY', date: 'Mar 15, 2026', status: 'confirmed', promoter: 'AEG Presents' },
    { id: 'ws3', venue: 'The Roxy', city: 'Los Angeles, CA', date: 'Apr 10, 2026', status: 'confirmed', promoter: 'Goldenvoice' },
    { id: 'ws4', venue: 'Union Transfer', city: 'Philadelphia, PA', date: 'May 5, 2026', status: 'confirmed', promoter: 'Local Promotions' },
  ];
  return (
    <div>
      <PageHeader title="Upcoming Shows" description="Confirmed tour dates — read-only view" />
      <div className="space-y-3">
        {shows.map(s => (
          <Card key={s.id} className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3"><MapPin size={18} className="text-violet-400" /><div><p className="text-sm font-semibold text-neutral-900">{s.venue}</p><p className="text-xs text-neutral-500">{s.city} · {s.promoter}</p></div></div>
              <div className="flex items-center gap-3"><span className="text-sm text-neutral-700">{s.date}</span><Badge color="green">Confirmed</Badge></div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function WriterProfilePage() {
  const { portalUser } = useProAuth();
  const [bio, setBio] = useState('Songwriter, producer, and multi-instrumentalist blending R&B, neo-soul, and electronic influences. Based in West Philadelphia. Creating music that moves between shadow and light.');
  const [links, setLinks] = useState([{ platform: 'Spotify', url: 'https://open.spotify.com/artist/adea-lyric' }, { platform: 'Instagram', url: 'https://instagram.com/adealyric' }, { platform: 'SoundCloud', url: 'https://soundcloud.com/adealyric' }]);
  return (
    <div>
      <PageHeader title="Artist Profile" description="Your public artist profile — bio, photo, and links" actions={<Button variant="primary" className="bg-violet-600 hover:bg-violet-700" onClick={() => toast('success', 'Profile saved')}>Save Profile</Button>} />
      <div className="space-y-6">
        <Card className="p-5">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-400 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">{(portalUser?.display_name ?? 'AL').split(' ').map(n => n[0]).join('')}</div>
            <div className="flex-1"><Field label="Display Name"><Input value={portalUser?.display_name ?? ''} /></Field></div>
          </div>
          <Field label="Bio"><Textarea value={bio} onChange={e => setBio(e.target.value)} rows={4} /></Field>
        </Card>
        <Card className="p-5">
          <h3 className="text-sm font-semibold text-neutral-900 mb-4">Social & Streaming Links</h3>
          <div className="space-y-3">{links.map((l, i) => (
            <div key={i} className="flex items-center gap-3"><Badge color="purple" size="sm">{l.platform}</Badge><Input value={l.url} onChange={e => setLinks(prev => prev.map((x, j) => j === i ? { ...x, url: e.target.value } : x))} className="flex-1" /></div>
          ))}</div>
          <Button variant="secondary" size="sm" className="mt-3" onClick={() => setLinks(prev => [...prev, { platform: 'New Link', url: '' }])}><Plus size={14} /> Add Link</Button>
        </Card>
      </div>
    </div>
  );
}

function WriterSettingsPage() {
  const [notifProject, setNotifProject] = useState(true);
  const [notifRoyalty, setNotifRoyalty] = useState(true);
  const [notifSync, setNotifSync] = useState(true);
  const [notifD2f, setNotifD2f] = useState(false);
  return (
    <div>
      <PageHeader title="Settings" description="Notification preferences and connected accounts" />
      <div className="space-y-6">
        <Card className="p-5">
          <h3 className="text-sm font-semibold text-neutral-900 mb-4">Notification Preferences</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-neutral-50"><div><p className="text-sm font-medium text-neutral-900">Project Updates</p><p className="text-xs text-neutral-500">When collaborators make changes to your projects</p></div><button onClick={() => setNotifProject(!notifProject)} className={`w-10 h-6 rounded-full transition-colors ${notifProject ? 'bg-violet-600' : 'bg-neutral-200'} relative`}><div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${notifProject ? 'left-5' : 'left-1'}`} /></button></div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-neutral-50"><div><p className="text-sm font-medium text-neutral-900">Royalty Alerts</p><p className="text-xs text-neutral-500">When new statements are available</p></div><button onClick={() => setNotifRoyalty(!notifRoyalty)} className={`w-10 h-6 rounded-full transition-colors ${notifRoyalty ? 'bg-violet-600' : 'bg-neutral-200'} relative`}><div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${notifRoyalty ? 'left-5' : 'left-1'}`} /></button></div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-neutral-50"><div><p className="text-sm font-medium text-neutral-900">Sync Opportunities</p><p className="text-xs text-neutral-500">When new briefs match your catalog</p></div><button onClick={() => setNotifSync(!notifSync)} className={`w-10 h-6 rounded-full transition-colors ${notifSync ? 'bg-violet-600' : 'bg-neutral-200'} relative`}><div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${notifSync ? 'left-5' : 'left-1'}`} /></button></div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-neutral-50"><div><p className="text-sm font-medium text-neutral-900">Fan Engagement</p><p className="text-xs text-neutral-500">Direct-to-fan activity and tier changes</p></div><button onClick={() => setNotifD2f(!notifD2f)} className={`w-10 h-6 rounded-full transition-colors ${notifD2f ? 'bg-violet-600' : 'bg-neutral-200'} relative`}><div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${notifD2f ? 'left-5' : 'left-1'}`} /></button></div>
          </div>
        </Card>
        <Card className="p-5">
          <h3 className="text-sm font-semibold text-neutral-900 mb-4">Connected Accounts</h3>
          <div className="space-y-3">
            {[{ name: 'Spotify for Artists', connected: true }, { name: 'Apple Music Connect', connected: true }, { name: 'SoundCloud', connected: false }, { name: 'Instagram', connected: true }].map(a => (
              <div key={a.name} className="flex items-center justify-between p-3 rounded-lg bg-neutral-50"><div className="flex items-center gap-3"><Globe size={18} className="text-neutral-400" /><p className="text-sm font-medium text-neutral-900">{a.name}</p></div>{a.connected ? <Badge color="green">Connected</Badge> : <Button variant="secondary" size="sm">Connect</Button>}</div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function WriterHomePage() {
  const { portalUser } = useProAuth();
  return (
    <div className="max-w-5xl mx-auto py-10">
      <div className="mb-10">
        <div className="flex items-center gap-2 text-violet-500 text-sm mb-2"><Sparkles size={16} /><span>Writer & Collaborator Portal</span></div>
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900">Welcome back, {portalUser?.display_name?.split(' ')[0] ?? 'there'}.</h1>
        <p className="mt-2 text-neutral-500 max-w-2xl">Manage your projects, collaborate with others, track royalties, and explore sync opportunities.</p>
      </div>
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
        <StatCard label="Active Projects" value="4" icon={<Disc3 size={28} />} />
        <StatCard label="Q4 Earnings" value="$6.2K" icon={<DollarSign size={28} />} trend="+42% vs Q3" />
        <StatCard label="Sync Deals" value="2" icon={<Handshake size={28} />} />
        <StatCard label="Fan Members" value="112" icon={<Users size={28} />} />
      </div>
      {/* Active Project Cards */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4"><h2 className="text-lg font-semibold text-neutral-900">Active Projects</h2><Link to="/writer/studio/projects" className="text-sm text-violet-600 hover:text-violet-700 flex items-center gap-1">View all <ArrowRight size={14} /></Link></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { to: '/writer/studio/projects', title: 'Midnight Echoes', stage: 'mastered', collaborators: 3, color: 'from-violet-600 to-purple-800' },
            { to: '/writer/studio/projects', title: 'Velvet Sunrise', stage: 'recording', collaborators: 2, color: 'from-amber-500 to-orange-700' },
            { to: '/writer/studio/projects', title: 'Neon Dreams', stage: 'mixing', collaborators: 4, color: 'from-blue-500 to-cyan-700' },
          ].map(p => (
            <Link key={p.title} to={p.to} className="block">
              <div className="bg-white hover:bg-violet-50 border border-neutral-200 hover:border-violet-300 rounded-xl p-5 transition-colors h-full">
                <div className={`w-full h-16 rounded-lg bg-gradient-to-br ${p.color} flex items-center justify-center mb-3`}><Disc3 size={20} className="text-white/20" /></div>
                <p className="text-sm font-semibold text-neutral-900">{p.title}</p>
                <div className="flex items-center gap-2 text-xs text-neutral-500 mt-1"><Badge color={p.stage === 'mastered' ? 'green' : p.stage === 'recording' ? 'blue' : p.stage === 'mixing' ? 'purple' : 'amber'} size="sm">{p.stage}</Badge><span>{p.collaborators} collaborators</span></div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      {/* AI Suggestions */}
      <Card className="p-5 mb-8">
        <div className="flex items-center gap-2 mb-3"><Sparkles size={16} className="text-violet-500" /><h3 className="text-sm font-semibold text-neutral-900">AI Suggestions</h3></div>
        <div className="space-y-2">
          <div className="flex items-center justify-between p-3 rounded-lg bg-violet-50 border border-violet-100"><div><p className="text-sm font-medium text-neutral-900">Submit "Midnight Run" to Film Sync brief</p><p className="text-xs text-neutral-500">Matches: dark, energetic, 128 BPM</p></div><Button variant="secondary" size="sm" className="bg-violet-600 text-white hover:bg-violet-700">Submit</Button></div>
          <div className="flex items-center justify-between p-3 rounded-lg bg-violet-50 border border-violet-100"><div><p className="text-sm font-medium text-neutral-900">Invite Kai Nakamura to "Neon Dreams"</p><p className="text-xs text-neutral-500">Previously collaborated on 3 projects</p></div><Button variant="secondary" size="sm" className="bg-violet-600 text-white hover:bg-violet-700">Invite</Button></div>
        </div>
      </Card>
      {/* Quick Links & Show Reminders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="p-5">
          <h3 className="text-sm font-semibold text-neutral-900 mb-3">Quick Links</h3>
          <div className="space-y-2">
            {[
              { to: '/writer/royalties/earnings', icon: <BarChart3 size={16} />, title: 'Earnings Dashboard' },
              { to: '/writer/sync/opportunities', icon: <Handshake size={16} />, title: 'Sync Opportunities' },
              { to: '/writer/studio/beats', icon: <Music size={16} />, title: 'Beat Marketplace' },
            ].map(a => <Link key={a.to} to={a.to} className="flex items-center gap-2 p-2 rounded-lg text-sm text-neutral-700 hover:bg-violet-50 hover:text-violet-700 transition-colors">{a.icon}{a.title}<ArrowRight size={14} className="ml-auto text-neutral-400" /></Link>)}
          </div>
        </Card>
        <Card className="p-5">
          <h3 className="text-sm font-semibold text-neutral-900 mb-3">Upcoming Shows</h3>
          <div className="space-y-2">
            {[
              { venue: 'The Fillmore', date: 'Feb 28', city: 'Philly' },
              { venue: 'Brooklyn Steel', date: 'Mar 15', city: 'Brooklyn' },
            ].map(s => <div key={s.venue} className="flex items-center justify-between p-2 rounded-lg bg-neutral-50"><div className="flex items-center gap-2"><MapPin size={14} className="text-violet-400" /><div><p className="text-sm font-medium text-neutral-900">{s.venue}</p><p className="text-xs text-neutral-500">{s.city}</p></div></div><span className="text-sm text-neutral-700">{s.date}</span></div>)}
          </div>
          <Link to="/writer/shows" className="block text-center mt-3 text-sm text-violet-600 hover:text-violet-700">View all shows</Link>
        </Card>
      </div>
    </div>
  );
}

function WriterApp() {
  const { path } = useRouter();

  if (path === '/writer' || path === '/writer/') return <WriterPortalShell><WriterHomePage /></WriterPortalShell>;
  // Studio section
  if (path === '/writer/studio/projects') return <WriterPortalShell><WriterStudioProjectsPage /></WriterPortalShell>;
  if (path === '/writer/studio/collaborators') return <WriterPortalShell><WriterCollaboratorsPage /></WriterPortalShell>;
  if (path === '/writer/studio/beats') return <WriterPortalShell><WriterBeatMarketplacePage /></WriterPortalShell>;
  if (path === '/writer/studio/songwriting') return <WriterPortalShell><WriterSongwritingWorkspacePage /></WriterPortalShell>;
  if (path === '/writer/studio/samples') return <WriterPortalShell><WriterSampleLibraryPage /></WriterPortalShell>;
  // Releases section
  if (path === '/writer/releases/drafts') return <WriterPortalShell><WriterReleasesDraftsPage /></WriterPortalShell>;
  if (path === '/writer/releases/live') return <WriterPortalShell><WriterReleasesLivePage /></WriterPortalShell>;
  // Rights section
  if (path === '/writer/rights/my-splits') return <WriterPortalShell><WriterRightsMySplitsPage /></WriterPortalShell>;
  if (path === '/writer/rights/documents') return <WriterPortalShell><WriterRightsDocumentsPage /></WriterPortalShell>;
  // Royalties section
  if (path === '/writer/royalties/earnings') return <WriterPortalShell><WriterRoyaltiesEarningsPage /></WriterPortalShell>;
  if (path === '/writer/royalties/statements') return <WriterPortalShell><WriterRoyaltiesStatementsPage /></WriterPortalShell>;
  if (path === '/writer/royalties/payout') return <WriterPortalShell><WriterRoyaltiesPayoutPage /></WriterPortalShell>;
  // Sync section
  if (path === '/writer/sync/opportunities') return <WriterPortalShell><WriterSyncOpportunitiesPage /></WriterPortalShell>;
  if (path === '/writer/sync/deals') return <WriterPortalShell><WriterSyncDealsPage /></WriterPortalShell>;
  // D2F section
  if (path === '/writer/d2f/tiers') return <WriterPortalShell><WriterD2fTiersPage /></WriterPortalShell>;
  if (path === '/writer/d2f/content') return <WriterPortalShell><WriterD2fContentPage /></WriterPortalShell>;
  // Shows
  if (path === '/writer/shows') return <WriterPortalShell><WriterShowsPage /></WriterPortalShell>;
  // Profile & Settings
  if (path === '/writer/profile') return <WriterPortalShell><WriterProfilePage /></WriterPortalShell>;
  if (path === '/writer/settings') return <WriterPortalShell><WriterSettingsPage /></WriterPortalShell>;

  // Fallback for any unmatched /writer/* routes
  return <WriterPortalShell><WriterHomePage /></WriterPortalShell>;
}

// ============ SYNC PORTAL ============
function SyncApp() {
  const { path } = useRouter();
  if (path === '/sync' || path === '/sync/') return <SyncPortalShell><SyncOverviewPage /></SyncPortalShell>;
  if (path === '/sync/search') return <SyncPortalShell><SyncSearchPage /></SyncPortalShell>;
  if (path.startsWith('/sync/track/')) return <SyncPortalShell><SyncTrackDetailPage /></SyncPortalShell>;
  if (path === '/sync/license-requests') return <SyncPortalShell><SyncLicenseRequestsPage /></SyncPortalShell>;
  if (path === '/sync/my-licenses') return <SyncPortalShell><SyncMyLicensesPage /></SyncPortalShell>;
  if (path === '/sync/deals') return <SyncPortalShell><SyncDealsPage /></SyncPortalShell>;
  if (path === '/sync/clearance') return <SyncPortalShell><SyncClearancePage /></SyncPortalShell>;
  if (path === '/sync/distribution') return <SyncPortalShell><SyncDistributionPage /></SyncPortalShell>;
  if (path === '/sync/revenue') return <SyncPortalShell><SyncRevenuePage /></SyncPortalShell>;
  if (path === '/sync/messages') return <SyncPortalShell><SyncMessagesPage /></SyncPortalShell>;
  return <SyncPortalShell><SyncOverviewPage /></SyncPortalShell>;
}

// ============ ADMIN PORTAL ============
function AdminApp() {
  const { path } = useRouter();
  const content = (() => {
    // ─── Overview ───
    if (path === '/admin' || path === '/admin/') return <AdminDashboardPage />;
    // ─── Create ───
    if (path === '/admin/discography/new-release') return <AdminNewReleaseWizard />;
    if (path === '/admin/shop/new-look') return <AdminNewLookPage />;
    if (path === '/admin/tour/new-tour-date') return <AdminNewTourDatePage />;
    if (path === '/admin/cms/new-banner') return <AdminCmsNewBannerPage />;
    // ─── Website ───
    if (path === '/admin/website/homepage') return <AdminWebsiteHomepagePage />;
    if (path === '/admin/website/pages') return <AdminWebsitePagesPage />;
    if (path === '/admin/website/navigation') return <AdminWebsiteNavigationPage />;
    if (path === '/admin/website/seo') return <AdminWebsiteSeoPage />;
    if (path === '/admin/website/theme') return <AdminWebsiteThemePage />;
    // ─── CMS ───
    if (path === '/admin/cms/blog') return <AdminCmsBlogPage />;
    if (path === '/admin/cms/press') return <AdminCmsPressPage />;
    if (path === '/admin/cms/gallery') return <AdminCmsGalleryPage />;
    if (path === '/admin/cms/banners') return <AdminCmsBannersPageNew />;
    // ─── Shop ───
    if (path === '/admin/shop/albums') return <AdminShopAlbumsPage />;
    if (path === '/admin/shop/collections') return <AdminShopCollectionsPage />;
    if (path === '/admin/shop/catalog') return <AdminShopAllPage />;
    if (path === '/admin/shop/catalog/new') return <AdminAddProductPage />;
    if (path.startsWith('/admin/shop/catalog/')) return <AdminProductEditPage />;
    if (path === '/admin/shop/get-the-look') return <AdminShopGetTheLookPage />;
    if (path === '/admin/shop/carts') return <AdminShopCartsPage />;
    if (path === '/admin/shop/orders') return <OrdersPage />;
    if (path === '/admin/shop/inventory') return <AdminShopInventoryPage />;
    if (path === '/admin/shop/settings') return <AdminShopSettingsPage />;
    // ─── Discography ───
    if (path === '/admin/discography/releases') return <AdminDiscographyReleasesPage />;
    if (path === '/admin/discography/tracks') return <AdminDiscographyTracksPage />;
    if (path === '/admin/discography/credits') return <AdminDiscographyCreditsPage />;
    if (path === '/admin/discography/metadata') return <AdminDiscographyMetadataPage />;
    // ─── Tour & Booking ───
    if (path === '/admin/tour/calendar') return <AdminTourCalendarPageExternal />;
    if (path === '/admin/tour/recently-played') return <AdminTourRecentlyPlayedPageExternal />;
    if (path === '/admin/tour/venues') return <AdminTourVenuesPageExternal />;
    if (path === '/admin/tour/bookings') return <AdminTourBookingsPageExternal />;
    if (path === '/admin/tour/new-tour-date') return <AdminNewTourDatePage />;
    // ─── Business: Artists ───
    if (path === '/admin/artists/roster') return <AdminArtistsRosterPage />;
    if (path === '/admin/artists/contracts') return <AdminArtistsContractsPage />;
    if (path === '/admin/artists/onboarding') return <AdminArtistsOnboardingPage />;
    // ─── Business: CRM ───
    if (path === '/admin/audience/contacts') return <ContactsPage />;
    if (path.startsWith('/admin/audience/contacts/')) return <ContactDetailPage />;
    if (path === '/admin/audience/import') return <CsvImportPage />;
    if (path === '/admin/audience/fans') return <FansPage />;
    if (path === '/admin/audience/campaigns') return <CampaignsPage />;
    // ─── Business: Oversight ───
    if (path === '/admin/oversight') return <AdminOversightPage />;
    if (path === '/admin/rights') return <AdminRightsPage />;
    if (path === '/admin/rights/splits') return <AdminRightsSplitsPage />;
    if (path === '/admin/distribution') return <AdminDistributionPage />;
    if (path === '/admin/distribution/queue') return <AdminDistributionQueuePage />;
    if (path === '/admin/sync') return <AdminSyncPage />;
    if (path === '/admin/validation') return <AdminValidationPage />;
    if (path === '/admin/licensing') return <AdminLicensingPage />;
    if (path === '/admin/royalty') return <AdminRoyaltyPage />;
    if (path === '/admin/royalty/revenue') return <AdminRoyaltyRevenuePage />;
    // ─── Insights ───
    if (path === '/admin/analytics') return <AdminAnalyticsPage />;
    if (path === '/admin/events/tickets') return <TicketEventsAdminPage />;
    // ─── Marketing ───
    if (path === '/admin/social/metricool') return <SocialMediaPage />;
    if (path === '/admin/social/scheduler') return <SocialMediaPage />;
    if (path === '/admin/social/analytics') return <SocialMediaPage />;
    // ─── AI & API ───
    if (path === '/admin/ai') return <AdminAIPage />;
    if (path === '/admin/api') return <AdminAPIPage />;
    // ─── Legacy routes still supported ───
    if (path === '/admin/music/albums') return <ReleasesPage />;
    if (path.startsWith('/admin/music/albums/')) return <ReleaseDetailAdminPage />;
    if (path === '/admin/music/tracks') return <TracksPage />;
    if (path === '/admin/studio') return <AdminStudioPage />;
    if (path === '/admin/catalog') return <AdminCatalogPage />;
    if (path === '/admin/content') return <CmsPage />;
    if (path === '/admin/events/tours') return <TourDatesAdminPage />;
    if (path === '/admin/bookings/pipeline') return <BookingsPipelinePage />;
    if (path === '/admin/bookings/calendar') return <BookingsCalendarPage />;
    if (path === '/admin/bookings/inquiries') return <InquiriesPage />;
    if (path.startsWith('/admin/bookings/')) return <BookingDetailAdminPage />;
    if (path === '/admin/shop/bundles') return <AdminShopBundlesPage />;
    // ─── System ───
    if (path === '/admin/settings') return <SettingsPage />;
    if (path === '/admin/exports') return <ExportsPage />;
    return <AdminDashboardPage />;
  })();
  return <AdminLayout>{content}</AdminLayout>;
}

// ============ NEW ADMIN PAGES (Create section) ============

// ─── New Release Wizard imported from @/admin/pages/AdminNewReleaseWizard ───

// ─── New Look (Get the Look builder) ───
function AdminNewLookPage() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedItems, setSelectedItems] = useState<{ category: string; item: string }[]>([]);
  const [price, setPrice] = useState('');

  const LOOK_CATEGORIES = [
    { key: 'hair', label: 'Hair / Wig', icon: <Sparkles size={18} /> },
    { key: 'top', label: 'Top', icon: <Shirt size={18} /> },
    { key: 'bottom', label: 'Bottom', icon: <Scissors size={18} /> },
    { key: 'shoes', label: 'Shoes', icon: <Watch size={18} /> },
    { key: 'bag', label: 'Bag', icon: <ShoppingBag size={18} /> },
  ];

  const addCategoryItem = (category: string) => setSelectedItems(prev => [...prev, { category, item: '' }]);
  const removeItem = (i: number) => setSelectedItems(prev => prev.filter((_, idx) => idx !== i));
  const updateItem = (i: number, val: string) => setSelectedItems(prev => prev.map((s, idx) => idx === i ? { ...s, item: val } : s));

  return (
    <div className="space-y-6">
      <PageHeader title="New Look (Get the Look)" description="Create an outfit bundle — hair/wig, top, bottom, shoes, bag — that fans can buy as a complete look" />
      <div className="bg-white border border-neutral-200 rounded-xl p-6 space-y-5">
        <Field label="Look Name"><Input value={name} onChange={e => setName(e.target.value)} placeholder="Midnight Velvet Set" className="bg-white border-neutral-200" /></Field>
        <Field label="Description"><Textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Complete outfit for the 'Midnight Echoes' era — wig, sequin top, leather pants, platform boots, and clutch bag." className="bg-white border-neutral-200" /></Field>
        <Field label="Total Price"><Input value={price} onChange={e => setPrice(e.target.value)} placeholder="$149.99" className="bg-white border-neutral-200" /></Field>

        {/* Category tiles — click to auto-add */}
        <div>
          <p className="text-sm font-semibold text-neutral-900 mb-3">Select categories for this look (click tile to auto-add a slot)</p>
          <div className="flex flex-wrap gap-2">
            {LOOK_CATEGORIES.map(cat => (
              <button key={cat.key} onClick={() => addCategoryItem(cat.key)} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors border ${selectedItems.some(s => s.category === cat.key) ? 'bg-neutral-900 text-white border-neutral-900' : 'bg-neutral-50 text-neutral-600 border-neutral-200 hover:border-neutral-300'}`}>
                {cat.icon} {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Item slots */}
        {selectedItems.length > 0 && (
          <div className="space-y-3">
            <p className="text-sm font-semibold text-neutral-900">Items in this look</p>
            {selectedItems.map((s, i) => (
              <div key={i} className="flex items-center gap-3">
                <Badge color="gray" className="text-xs">{LOOK_CATEGORIES.find(c => c.key === s.category)?.label}</Badge>
                <Input value={s.item} onChange={e => updateItem(i, e.target.value)} placeholder={`Select or enter ${s.category} product name`} className="flex-1 bg-white border-neutral-200" />
                <button onClick={() => removeItem(i)} className="text-red-400 hover:text-red-600"><Trash2 size={16} /></button>
              </div>
            ))}
          </div>
        )}

        <Button variant="primary" className="bg-neutral-900 text-white" onClick={() => toast('success', `Look "${name}" created — now visible in Get the Look section`)}>Create Look</Button>
      </div>
    </div>
  );
}

// ─── New Tour Date ───
function AdminNewTourDatePage() {
  const [form, setForm] = useState({ city: '', date: '', time: '', venueName: '', venueAddress: '', venueImage: '', publishToTourPage: true, ticketLink: '', notes: '' });

  return (
    <div className="space-y-6">
      <PageHeader title="New Tour Date" description="Add a tour date with venue info — publish directly to the Tour page on the website" />
      <div className="bg-white border border-neutral-200 rounded-xl p-6 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="City"><Input value={form.city} onChange={e => setForm({...form, city: e.target.value})} placeholder="Philadelphia, PA" className="bg-white border-neutral-200" /></Field>
          <Field label="Date"><Input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} className="bg-white border-neutral-200" /></Field>
          <Field label="Time"><Input type="time" value={form.time} onChange={e => setForm({...form, time: e.target.value})} placeholder="8:00 PM" className="bg-white border-neutral-200" /></Field>
          <Field label="Venue Name"><Input value={form.venueName} onChange={e => setForm({...form, venueName: e.target.value})} placeholder="The Fillmore" className="bg-white border-neutral-200" /></Field>
          <Field label="Venue Address"><Input value={form.venueAddress} onChange={e => setForm({...form, venueAddress: e.target.value})} placeholder="29 E Allen St, Philadelphia, PA 19123" className="bg-white border-neutral-200" /></Field>
          <Field label="Ticket Link"><Input value={form.ticketLink} onChange={e => setForm({...form, ticketLink: e.target.value})} placeholder="https://www.ticketmaster.com/..." className="bg-white border-neutral-200" /></Field>
        </div>
        <Field label="Venue Image">
          <div className="flex items-center gap-4">
            <div className="w-24 h-24 rounded-xl border-2 border-dashed border-neutral-300 flex items-center justify-center bg-neutral-50">
              <ImageIcon size={20} className="text-neutral-300" />
            </div>
            <Button variant="outline" onClick={() => toast('info', 'Image upload connected to media library')}><Upload size={16} /> Upload Venue Photo</Button>
          </div>
        </Field>
        {/* Publish to Tour Page toggle */}
        <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-xl border border-emerald-200">
          <ToggleLeft size={20} className="text-emerald-600" />
          <div>
            <p className="text-sm font-semibold text-emerald-900">Publish to Tour Page</p>
            <p className="text-xs text-emerald-600">When enabled, this tour date appears on the fan website Tour page immediately</p>
          </div>
          <button onClick={() => setForm({...form, publishToTourPage: !form.publishToTourPage})} className={`ml-auto px-3 py-1 rounded-lg text-xs font-medium ${form.publishToTourPage ? 'bg-emerald-600 text-white' : 'bg-neutral-200 text-neutral-600'}`}>
            {form.publishToTourPage ? 'Published' : 'Draft'}
          </button>
        </div>
        <Textarea value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} placeholder="Internal notes (booking contact, load-in time, etc.)" className="bg-white border-neutral-200" />
        <Button variant="primary" className="bg-neutral-900 text-white" onClick={() => toast('success', `Tour date for ${form.city} added — ${form.publishToTourPage ? 'published to website' : 'saved as draft'}`)}>{form.publishToTourPage ? 'Publish Tour Date' : 'Save as Draft'}</Button>
      </div>
    </div>
  );
}

// ─── New Banner (with target_pages) ───
function AdminCmsNewBannerPage() {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [position, setPosition] = useState('hero');
  const [targetPages, setTargetPages] = useState<string[]>(['Home']);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [ctaLink, setCtaLink] = useState('');
  const [ctaText, setCtaText] = useState('');

  const PAGE_TARGETS = ['Home', 'Discography', 'Tour', 'Shop', 'Bio', 'Booking'];

  const togglePage = (page: string) => setTargetPages(prev => prev.includes(page) ? prev.filter(p => p !== page) : [...prev, page]);

  return (
    <div className="space-y-6">
      <PageHeader title="New Banner" description="Create an announcement banner — select which website pages it appears on" />
      <div className="bg-white border border-neutral-200 rounded-xl p-6 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Banner Title"><Input value={title} onChange={e => setTitle(e.target.value)} placeholder="New Album Out Now!" className="bg-white border-neutral-200" /></Field>
          <Field label="Subtitle"><Input value={subtitle} onChange={e => setSubtitle(e.target.value)} placeholder="Midnight Echoes — available everywhere" className="bg-white border-neutral-200" /></Field>
          <Field label="Position"><Select value={position} onChange={e => setPosition(e.target.value)} options={['hero', 'top-bar', 'inline', 'footer']} className="bg-white border-neutral-200" /></Field>
          <Field label="CTA Text"><Input value={ctaText} onChange={e => setCtaText(e.target.value)} placeholder="Listen Now" className="bg-white border-neutral-200" /></Field>
          <Field label="CTA Link"><Input value={ctaLink} onChange={e => setCtaLink(e.target.value)} placeholder="https://open.spotify.com/..." className="bg-white border-neutral-200" /></Field>
          <Field label="Start Date"><Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="bg-white border-neutral-200" /></Field>
          <Field label="End Date"><Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="bg-white border-neutral-200" /></Field>
        </div>

        {/* Target pages selector */}
        <div>
          <p className="text-sm font-semibold text-neutral-900 mb-3">Show this banner on which pages?</p>
          <div className="flex flex-wrap gap-2">
            {PAGE_TARGETS.map(page => (
              <button key={page} onClick={() => togglePage(page)} className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${targetPages.includes(page) ? 'bg-emerald-600 text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'}`}>
                {page}
              </button>
            ))}
          </div>
          <p className="text-xs text-neutral-400 mt-2">Selected pages: {targetPages.join(', ') || 'None'}</p>
        </div>

        <Field label="Banner Image">
          <div className="flex items-center gap-4">
            <div className="w-48 h-16 rounded-xl border-2 border-dashed border-neutral-300 flex items-center justify-center bg-neutral-50">
              {imageUrl ? <img src={imageUrl} alt="banner" className="w-full h-full object-cover rounded-xl" /> : <div className="text-center"><ImageIcon size={20} className="text-neutral-300" /><p className="text-xs text-neutral-400">Upload banner</p></div>}
            </div>
            <Button variant="outline"><Upload size={16} /> Upload Image</Button>
          </div>
        </Field>

        <Button variant="primary" className="bg-neutral-900 text-white" onClick={() => toast('success', `Banner "${title}" created — visible on: ${targetPages.join(', ')}`)}>Create Banner</Button>
      </div>
    </div>
  );
}

// ─── Shop: Carts (with auto-clear threshold) ───
function AdminShopCartsPage() {
  const [carts] = useState([{ id: 'cart-1', user: 'fan@test.com', items: 3, total: '$47.99', age: '2h 15m' }, { id: 'cart-2', user: 'sunny@gmail.com', items: 1, total: '$24.99', age: '45m' }]);
  const [clearThreshold, setClearThreshold] = useState('48');

  return (
    <div className="space-y-6">
      <PageHeader title="Carts" description="See what fans have in their carts and for how long — set auto-clear threshold" />
      {/* Auto-clear setting */}
      <div className="bg-white border border-neutral-200 rounded-xl p-5 flex items-center gap-4">
        <Zap size={20} className="text-amber-600" />
        <div className="flex-1">
          <p className="text-sm font-semibold text-neutral-900">Cart Auto-Clear Threshold</p>
          <p className="text-xs text-neutral-500">Carts older than this will be automatically cleared</p>
        </div>
        <div className="flex items-center gap-2">
          <Input value={clearThreshold} onChange={e => setClearThreshold(e.target.value)} className="w-16 bg-white border-neutral-200 text-center" />
          <span className="text-sm text-neutral-600">hours</span>
        </div>
        <Button variant="outline" onClick={() => toast('success', `Cart auto-clear set to ${clearThreshold} hours`)}>Save</Button>
      </div>

      {/* Active carts */}
      <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
        <div className="px-5 py-3 border-b border-neutral-200"><p className="text-sm font-semibold text-neutral-900">Active Carts ({carts.length})</p></div>
        <table className="w-full text-sm">
          <thead className="bg-neutral-50"><tr><th className="px-4 py-2 text-left font-semibold text-neutral-900">User</th><th className="px-4 py-2 text-left font-semibold text-neutral-900">Items</th><th className="px-4 py-2 text-left font-semibold text-neutral-900">Total</th><th className="px-4 py-2 text-left font-semibold text-neutral-900">Cart Age</th><th className="px-4 py-2 text-left font-semibold text-neutral-900">Actions</th></tr></thead>
          <tbody className="divide-y divide-neutral-100">
            {carts.map(c => (
              <tr key={c.id} className="hover:bg-neutral-50">
                <td className="px-4 py-2 text-neutral-900">{c.user}</td>
                <td className="px-4 py-2 text-neutral-600">{c.items} items</td>
                <td className="px-4 py-2 font-medium text-neutral-900">{c.total}</td>
                <td className="px-4 py-2 text-neutral-600">{c.age}</td>
                <td className="px-4 py-2"><button className="text-xs text-red-500 hover:text-red-700">Clear Cart</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Tour: Recently Played (now external module) ───
function AdminTourRecentlyPlayedPage() { return <AdminTourRecentlyPlayedPageExternal />; }

// ============ ADMIN PAGES (ALREADY LIGHT THEME) ============
function DashboardPage() {
  const bookingsQuery = useBookings();
  const inquiriesQuery = useBookingInquiries();
  const ordersQuery = useOrders();
  const releasesQuery = useReleases();

  // Fall back to mock data when API calls fail (expected in dev mode — mock auth has no JWT)
  const bookings = bookingsQuery.data ?? (bookingsQuery.isError ? mockData.mockBookings : []);
  const inquiries = inquiriesQuery.data ?? (inquiriesQuery.isError ? mockData.mockBookingInquiries : []);
  const orders = ordersQuery.data ?? (ordersQuery.isError ? mockData.mockOrders : []);
  const releases = releasesQuery.data?.data ?? (releasesQuery.isError ? mockData.mockReleases : []); 

  const totalRevenue = orders.filter(o => o.status === 'paid').reduce((sum, o) => sum + o.amount_total_cents, 0);

  // Show loading only when queries are actually fetching (not when they've already errored and fallen back to mock)
  const allLoading = !bookingsQuery.isError && bookingsQuery.isLoading || !inquiriesQuery.isError && inquiriesQuery.isLoading || !ordersQuery.isError && ordersQuery.isLoading || !releasesQuery.isError && releasesQuery.isLoading;
  if (allLoading) return <div><PageHeader title="Dashboard" description="Overview of your music business operations" /><LoadingState label="Loading dashboard data…" /></div>;

  return (
    <div>
      <PageHeader title="Dashboard" description="Overview of your music business operations" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Revenue" value={formatCents(totalRevenue)} icon={<DollarSign size={28} />} trend="All time" />
        <StatCard label="Upcoming Bookings" value={bookings.length} icon={<Calendar size={28} />} />
        <StatCard label="CRM Contacts" value={mockData.mockCrmContacts.length} icon={<Users size={28} />} />
        <StatCard label="Releases" value={releases.length} icon={<Disc3 size={28} />} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-neutral-900">Upcoming Bookings</h3>
            <Link to="/admin/bookings/pipeline" className="text-sm text-neutral-500 hover:text-neutral-900 flex items-center gap-1">View all <ArrowUpRight size={14} /></Link>
          </div>
          <div className="space-y-3">{bookings.map(b => (<Link key={b.id} to={`/admin/bookings/${b.id}`} className="flex items-center justify-between p-3 rounded-lg hover:bg-neutral-50 transition-colors"><div><p className="text-sm font-medium text-neutral-900">{b.event_name}</p><p className="text-xs text-neutral-500">{b.venue_name} · {formatDate(b.event_date)}</p></div><StatusBadge status={b.status} /></Link>))}</div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-neutral-900">Recent Inquiries</h3>
            <Link to="/admin/bookings/inquiries" className="text-sm text-neutral-500 hover:text-neutral-900 flex items-center gap-1">View all <ArrowUpRight size={14} /></Link>
          </div>
          <div className="space-y-3">{inquiries.map(inq => (<div key={inq.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-neutral-50"><div><p className="text-sm font-medium text-neutral-900">{inq.contact_name}</p><p className="text-xs text-neutral-500">{inq.event_name ?? 'General inquiry'}</p></div><StatusBadge status={inq.status} /></div>))}</div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-neutral-900">Recent Orders</h3>
            <Link to="/admin/shop/orders" className="text-sm text-neutral-500 hover:text-neutral-900 flex items-center gap-1">View all <ArrowUpRight size={14} /></Link>
          </div>
          <div className="space-y-3">{orders.map(o => (<div key={o.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-neutral-50"><div><p className="text-sm font-medium text-neutral-900">{formatCents(o.amount_total_cents)}</p><p className="text-xs text-neutral-500">{formatDate(o.created_at)}</p></div><StatusBadge status={o.status} /></div>))}</div>
        </Card>
        <Card className="p-5">
          <h3 className="font-semibold text-neutral-900 mb-4">Pipeline Summary</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-neutral-50"><span className="text-sm text-neutral-600">New Inquiries</span><span className="text-sm font-semibold text-neutral-900">{inquiries.filter(i => i.status === 'new').length}</span></div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-neutral-50"><span className="text-sm text-neutral-600">Confirmed Bookings</span><span className="text-sm font-semibold text-neutral-900">{bookings.filter(b => b.status === 'confirmed' || b.status === 'deposit_paid').length}</span></div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-neutral-50"><span className="text-sm text-neutral-600">Paid Orders</span><span className="text-sm font-semibold text-neutral-900">{orders.filter(o => o.status === 'paid').length}</span></div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function ReleasesPage() {
  return <div><PageHeader title="Albums & Tracks" description="Manage your music catalog" actions={<Button variant="primary"><Disc3 size={16} /> New Release</Button>} /><div className="space-y-4">{mockData.mockReleases.map(r => (<Card key={r.id} className="p-4"><div className="flex items-center justify-between"><div className="flex items-center gap-3"><div className="w-12 h-12 rounded-lg bg-gradient-to-br from-neutral-700 to-neutral-900 flex items-center justify-center"><Disc3 size={20} className="text-white/30" /></div><div><p className="text-sm font-medium text-neutral-900">{r.title}</p><p className="text-xs text-neutral-500">{r.type} · {formatDate(r.release_date)}</p></div></div><div className="flex items-center gap-2"><StatusBadge status={r.status} />{r.is_free ? <Badge color="green">Free</Badge> : <Badge color="blue">{formatCents(r.price_cents)}</Badge>}</div></div></Card>))}</div></div>;
}

function TracksPage() {
  return <div><PageHeader title="Tracks" description="Manage individual tracks" /><div className="space-y-4">{mockData.mockTracks.map(t => (<Card key={t.id} className="p-4"><div className="flex items-center justify-between"><div><p className="text-sm font-medium text-neutral-900">{t.title}</p><p className="text-xs text-neutral-500">Position {t.position} · {t.duration_seconds ? `${Math.floor(t.duration_seconds / 60)}:${String(t.duration_seconds % 60).padStart(2, '0')}` : '—'}</p></div><div className="flex items-center gap-2"><StatusBadge status={t.status} />{t.is_free ? <Badge color="green">Free</Badge> : <Badge color="blue">{formatCents(t.price_cents)}</Badge>}</div></div></Card>))}</div></div>;
}

function OrdersPage() {
  return <div><PageHeader title="Orders" description="Track customer orders" /><div className="space-y-4">{mockData.mockOrders.map(o => (<Card key={o.id} className="p-4"><div className="flex items-center justify-between"><div><p className="text-sm font-medium text-neutral-900">{formatCents(o.amount_total_cents)}</p><p className="text-xs text-neutral-500">{formatDate(o.created_at)}</p></div><StatusBadge status={o.status} /></div></Card>))}</div></div>;
}

// ShopProductsPage is now replaced by AdminProductCatalogPage

function TicketEventsAdminPage() {
  return <div><PageHeader title="Ticket Events" description="Manage ticket sales" /><div className="space-y-4">{mockData.mockTicketEvents.map(e => (<Card key={e.id} className="p-4"><div className="flex items-center justify-between"><div><p className="text-sm font-medium text-neutral-900">{e.title}</p><p className="text-xs text-neutral-500">{e.venue_name} · {formatDate(e.event_date)}</p></div><Badge color={e.published ? 'green' : 'gray'}>{e.published ? 'Published' : 'Draft'}</Badge></div></Card>))}</div></div>;
}

function TourDatesAdminPage() {
  return <div><PageHeader title="Tour Dates" description="Manage tour schedule" /><div className="space-y-4">{mockData.mockTourDates.map(t => (<Card key={t.id} className="p-4"><div className="flex items-center justify-between"><div><p className="text-sm font-medium text-neutral-900">{t.title}</p><p className="text-xs text-neutral-500">{t.venue} · {formatDate(t.date)}</p></div><Badge color={t.is_sold_out ? 'red' : 'green'}>{t.is_sold_out ? 'Sold Out' : 'Available'}</Badge></div></Card>))}</div></div>;
}

function BookingsPipelinePage() {
  return <div><PageHeader title="Bookings Pipeline" description="Track booking progress" /><div className="grid grid-cols-1 md:grid-cols-4 gap-4">{['inquiry', 'hold', 'confirmed', 'completed'].map(stage => (<Card key={stage} className="p-4"><p className="text-xs font-semibold uppercase text-neutral-400 mb-3">{stage}</p><div className="space-y-2">{mockData.mockBookings.filter(b => b.status === stage || (stage === 'confirmed' && b.status === 'deposit_paid')).map(b => (<div key={b.id} className="p-2 rounded-lg bg-neutral-50"><p className="text-sm font-medium text-neutral-900">{b.event_name}</p><p className="text-xs text-neutral-500">{formatCents(b.fee_cents)}</p></div>))}</div></Card>))}</div></div>;
}

function BookingsCalendarPage() {
  return <div><PageHeader title="Bookings Calendar" description="Visual calendar view" /><EmptyState title="Calendar view coming soon" description="Interactive calendar will show all bookings and availability." /></div>;
}

function InquiriesPage() {
  return <div><PageHeader title="Booking Inquiries" description="Manage incoming inquiries" /><div className="space-y-4">{mockData.mockBookingInquiries.map(i => (<Card key={i.id} className="p-4"><div className="flex items-center justify-between"><div><p className="text-sm font-medium text-neutral-900">{i.contact_name}</p><p className="text-xs text-neutral-500">{i.event_name ?? 'General'} · {i.city}{i.state ? `, ${i.state}` : ''}</p></div><div className="flex items-center gap-2"><StatusBadge status={i.status} /><Badge color="gray">{i.source}</Badge></div></div></Card>))}</div></div>;
}

function BookingDetailAdminPage() {
  return <div><PageHeader title="Booking Detail" /><EmptyState title="Booking detail page coming soon" /></div>;
}

function ReleaseDetailAdminPage() {
  return <div><PageHeader title="Release Detail" /><EmptyState title="Release detail page coming soon" /></div>;
}

function ContactsPage() {
  return <div><PageHeader title="CRM Contacts" description="Manage your professional network" actions={<Button variant="primary"><Users size={16} /> Add Contact</Button>} /><div className="space-y-4">{mockData.mockCrmContacts.map(c => (<Link key={c.id} to={`/admin/audience/contacts/${c.id}`}><Card className="p-4 cursor-pointer"><div className="flex items-center justify-between"><div><p className="text-sm font-medium text-neutral-900">{c.name}</p><p className="text-xs text-neutral-500">{c.company ?? 'No company'} · {c.contact_type}</p></div><div className="flex items-center gap-2"><StatusBadge status={c.stage} /></div></div></Card></Link>))}</div></div>;
}

function ContactDetailPage() {
  return <div><PageHeader title="Contact Detail" /><EmptyState title="Contact detail page coming soon" /></div>;
}

function CsvImportPage() {
  return <div><PageHeader title="CSV Import" description="Bulk import contacts from CSV" /><EmptyState title="CSV import coming soon" /></div>;
}

function FansPage() {
  return <div><PageHeader title="Fans" description="Manage your fan base" /><div className="space-y-4">{mockData.mockFans.map(f => (<Card key={f.id} className="p-4"><div className="flex items-center justify-between"><div><p className="text-sm font-medium text-neutral-900">{f.name ?? f.email}</p><p className="text-xs text-neutral-500">{f.email} · {f.tags.join(', ')}</p></div><Badge color={f.subscribed ? 'green' : 'gray'}>{f.subscribed ? 'Subscribed' : 'Not subscribed'}</Badge></div></Card>))}</div></div>;
}

function CampaignsPage() {
  return <div><PageHeader title="Email Campaigns" description="Manage email outreach" /><div className="space-y-4">{mockData.mockEmailCampaigns.map(c => (<Card key={c.id} className="p-4"><div className="flex items-center justify-between"><div><p className="text-sm font-medium text-neutral-900">{c.subject}</p><p className="text-xs text-neutral-500">{formatDate(c.created_at)}</p></div><div className="flex items-center gap-2"><StatusBadge status={c.status} />{c.open_count && <span className="text-xs text-neutral-400">{c.open_count} opens</span>}</div></div></Card>))}</div></div>;
}

function CmsPage() {
  return <div><PageHeader title="Content & Media" description="Manage galleries, banners, and pages" /><EmptyState title="CMS management coming soon" description="Full content management system will be available here." /></div>;
}

// ============ NEW ADMIN PAGES (Studio, Catalog, Licensing, AI, API, etc.) ============

function AdminStudioPage() {
  return (
    <div>
      <PageHeader title="Creative Studio" description="Create, design, and produce merch — manage albums, tracks, and product designs" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 hover:border-neutral-300 transition-colors cursor-pointer">
          <Link to="/admin/music/albums">
            <div className="flex items-center gap-3 mb-3"><Disc3 size={24} className="text-neutral-700" /><h3 className="font-semibold text-neutral-900">Albums & Tracks</h3></div>
            <p className="text-sm text-neutral-500">Manage releases, track metadata, ISRC codes, and audio assets for distribution.</p>
          </Link>
        </Card>
        <Card className="p-6 hover:border-neutral-300 transition-colors cursor-pointer">
          <Link to="/admin/shop/catalog">
            <div className="flex items-center gap-3 mb-3"><ShoppingBag size={24} className="text-neutral-700" /><h3 className="font-semibold text-neutral-900">Merch Product Manager</h3></div>
            <p className="text-sm text-neutral-500">Create products, upload images, set pricing, configure size guides, publish to fan shop.</p>
          </Link>
        </Card>
        <Card className="p-6 hover:border-neutral-300 transition-colors cursor-pointer">
          <Link to="/admin/music/tracks">
            <div className="flex items-center gap-3 mb-3"><Music2 size={24} className="text-neutral-700" /><h3 className="font-semibold text-neutral-900">Track Management</h3></div>
            <p className="text-sm text-neutral-500">Individual track management, lyrics, credits, and metadata editing.</p>
          </Link>
        </Card>
      </div>
    </div>
  );
}

function AdminCatalogPage() {
  return (
    <div>
      <PageHeader title="Music Catalog" description="Full catalog view — releases, tracks, metadata, and distribution readiness" />
      <EmptyState title="Unified catalog view coming soon" description="A comprehensive view combining releases, tracks, metadata status, and distribution readiness in one interface." />
    </div>
  );
}

function AdminDistributionQueuePage() {
  return (
    <div>
      <PageHeader title="Delivery Queue" description="Monitor and manage DDEX ERN deliveries to DSPs" />
      <EmptyState title="Delivery queue coming soon" description="Real-time delivery tracking with status per DSP (pending, delivered, accepted, rejected)." />
    </div>
  );
}

function AdminRightsSplitsPage() {
  return (
    <div>
      <PageHeader title="Rights Splits" description="Manage songwriter, publisher, and master ownership splits per track" />
      <EmptyState title="Splits management coming soon" description="Define and edit rights splits per track with percentage allocation, waterfall logic, and conflict resolution." />
    </div>
  );
}

function AdminLicensingPage() {
  return (
    <div>
      <PageHeader title="Sync Licensing" description="Manage sync catalog, license requests, one-stop clearance, and deal tracking" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 hover:border-neutral-300 transition-colors cursor-pointer">
          <Link to="/admin/rights">
            <div className="flex items-center gap-3 mb-3"><Shield size={24} className="text-neutral-700" /><h3 className="font-semibold text-neutral-900">Rights & Ownership</h3></div>
            <p className="text-sm text-neutral-500">Verify one-stop clearance status, ownership records, and rights chain for sync.</p>
          </Link>
        </Card>
        <Card className="p-6 hover:border-neutral-300 transition-colors cursor-pointer">
          <Link to="/sync">
            <div className="flex items-center gap-3 mb-3"><Handshake size={24} className="text-neutral-700" /><h3 className="font-semibold text-neutral-900">Sync Portal</h3></div>
            <p className="text-sm text-neutral-500">Browse sync catalog, search by mood/BPM/key, process license requests.</p>
          </Link>
        </Card>
        <Card className="p-6 hover:border-neutral-300 transition-colors cursor-pointer">
          <Link to="/admin/rights/splits">
            <div className="flex items-center gap-3 mb-3"><Users size={24} className="text-neutral-700" /><h3 className="font-semibold text-neutral-900">Rights Splits</h3></div>
            <p className="text-sm text-neutral-500">Define splits per track for sync clearance waterfall logic.</p>
          </Link>
        </Card>
      </div>
    </div>
  );
}

function AdminRoyaltyRevenuePage() {
  return (
    <div>
      <PageHeader title="Revenue" description="Revenue streams, breakdowns, and financial reporting" />
      <EmptyState title="Revenue dashboard coming soon" description="Revenue breakdown by source (streaming, sync, merch, tickets), royalty calculations, and financial reports." />
    </div>
  );
}

function AdminAIPage() {
  return (
    <div>
      <PageHeader title="AI Tools" description="AI-powered mastering, voice synthesis, content tagging, and analytics" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-3"><Cpu size={24} className="text-violet-600" /><h3 className="font-semibold text-neutral-900">ROEX AI Mastering</h3></div>
          <p className="text-sm text-neutral-500 mb-4">Professional AI mastering for tracks before distribution. Upload audio, select mastering profile, and download mastered file.</p>
          <Badge color="purple">Coming Soon</Badge>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-3"><Sparkles size={24} className="text-blue-600" /><h3 className="font-semibold text-neutral-900">AI Voice Synthesis</h3></div>
          <p className="text-sm text-neutral-500 mb-4">Eleven Labs voice integration for demo vocals, backing tracks, and creative exploration.</p>
          <Badge color="blue">Coming Soon</Badge>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-3"><Target size={24} className="text-emerald-600" /><h3 className="font-semibold text-neutral-900">AI Content Tagging</h3></div>
          <p className="text-sm text-neutral-500 mb-4">Auto-generate mood, BPM, key, genre tags from audio analysis for sync catalog metadata.</p>
          <Badge color="green">Coming Soon</Badge>
        </Card>
      </div>
    </div>
  );
}

function AdminAPIPage() {
  return (
    <div>
      <PageHeader title="API & Integrations" description="Manage API keys, webhook endpoints, and third-party service connections" />
      <div className="space-y-4">
        <Card className="p-6">
          <h3 className="font-semibold text-neutral-900 mb-3">Platform API</h3>
          <p className="text-sm text-neutral-500 mb-4">RESTful API for catalog, orders, fans, and distribution data. Generate API keys and monitor usage.</p>
          <div className="flex items-center gap-3">
            <Badge color="green">Active</Badge>
            <span className="text-xs text-neutral-400">v1.0 · /api/v1/*</span>
          </div>
        </Card>
        <Card className="p-6">
          <h3 className="font-semibold text-neutral-900 mb-3">Connected Services</h3>
          <p className="text-sm text-neutral-500 mb-4">Manage integrations with Stripe, TooLost (distribution), Metricool (social), and DSP adapters.</p>
          <EmptyState title="No active integrations" description="Connect your first service to begin syncing data." />
        </Card>
      </div>
    </div>
  );
}

function IntegrationsPage() {
  return <div><PageHeader title="Integrations" description="Connect external services" /><EmptyState title="Integrations coming soon" description="Stripe, Spotify, Mailchimp, and more integrations will be available." /></div>;
}

function AutomationPage() {
  return <div><PageHeader title="Automation" description="Set up automated workflows" /><EmptyState title="Automation coming soon" /></div>;
}

function ExportsPage() {
  return <div><PageHeader title="Exports" description="Export data in various formats" /><EmptyState title="Exports coming soon" /></div>;
}

function SettingsPage() {
  return <div><PageHeader title="Settings" description="Configure your portal" /><EmptyState title="Settings coming soon" description="Artist profile, branding, and platform settings will be available here." /></div>;
}

// ============ NEW ADMIN PLACEHOLDER PAGES ============

function AdminWebsiteHomepagePage() {
  // Mock homepage blocks
  const [blocks, setBlocks] = useState([
    { id: 'hero', type: 'Hero Section', label: 'Hero Banner', heading: 'New Album "Echoes" — Out Now', subheading: 'Stream the latest release from Luna Wave', ctaText: 'Listen Now', ctaUrl: '/music', bgMedia: 'hero-bg.jpg', enabled: true },
    { id: 'featured-release', type: 'Featured Release', label: 'Featured Release Module', releaseId: 'r1', releaseTitle: 'Echoes', releaseArt: 'echoes-cover.jpg', enabled: true },
    { id: 'featured-tour', type: 'Featured Tour Date', label: 'Featured Tour Module', tourId: 't1', tourTitle: 'Summer Tour 2025', tourDate: 'Aug 15 — The Roxy, LA', enabled: true },
    { id: 'cta-1', type: 'Call-to-Action', label: 'CTA: Shop Merch', ctaText: 'Shop Official Merch', ctaUrl: '/shop', ctaStyle: 'primary', enabled: true },
    { id: 'cta-2', type: 'Call-to-Action', label: 'CTA: Join Fan Club', ctaText: 'Join the Fan Club', ctaUrl: '/signup', ctaStyle: 'secondary', enabled: false },
    { id: 'newsletter', type: 'Newsletter Signup', label: 'Newsletter Block', heading: 'Stay in the loop', subheading: 'Get exclusive drops and tour news', enabled: true },
  ]);
  const [editBlock, setEditBlock] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState(false);


  const moveBlock = (fromIdx: number, toIdx: number) => {
    const updated = [...blocks];
    const [moved] = updated.splice(fromIdx, 1);
    updated.splice(toIdx, 0, moved);
    setBlocks(updated);
    toast('success', `Moved "${moved.label}" to position ${toIdx + 1}`);
  };

  const toggleBlock = (id: string) => {
    setBlocks(blocks.map(b => b.id === id ? { ...b, enabled: !b.enabled } : b));
    const block = blocks.find(b => b.id === id);
    toast('info', `"${block?.label}" ${block?.enabled ? 'disabled' : 'enabled'}`);
  };

  const deleteBlock = (id: string) => {
    const block = blocks.find(b => b.id === id);
    setBlocks(blocks.filter(b => b.id !== id));
    toast('success', `Removed "${block?.label}"`);
  };

  const currentEdit = blocks.find(b => b.id === editBlock);

  return (
    <div>
      <PageHeader title="Homepage Builder" description="Drag-and-drop block editor for your website homepage layout" actions={<div className="flex gap-2"><Button variant={previewMode ? 'primary' : 'secondary'} onClick={() => setPreviewMode(!previewMode)}><Monitor size={16} /> {previewMode ? 'Editor' : 'Preview'}</Button><Button variant="primary" onClick={() => toast('success', 'Homepage layout saved!')}><Save size={16} /> Save Layout</Button></div>} />

      {!previewMode ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Block list / editor panel */}
          <div className="lg:col-span-2 space-y-3">
            <div className="bg-white border border-neutral-200 rounded-xl p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-neutral-900">Content Blocks</h2>
                <span className="text-xs text-neutral-500">{blocks.length} blocks · {blocks.filter(b => b.enabled).length} active</span>
              </div>
              <div className="space-y-2">
                {blocks.map((block, idx) => (
                  <div key={block.id} className={`group flex items-center gap-3 p-3 rounded-lg border transition-colors ${block.enabled ? 'bg-white border-neutral-200 hover:border-neutral-300' : 'bg-neutral-50 border-neutral-200 opacity-60'}`}>
                    <div className="flex items-center gap-1 text-neutral-400 cursor-grab active:cursor-grabbing flex-shrink-0">
                      <GripVertical size={16} />
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <div className={`w-8 h-8 rounded flex items-center justify-center ${block.type === 'Hero Section' ? 'bg-purple-100 text-purple-600' : block.type === 'Featured Release' ? 'bg-teal-100 text-teal-600' : block.type === 'Featured Tour Date' ? 'bg-blue-100 text-blue-600' : block.type === 'Call-to-Action' ? 'bg-amber-100 text-amber-600' : 'bg-pink-100 text-pink-600'}`}>
                        {block.type === 'Hero Section' ? <LayoutTemplate size={16} /> : block.type === 'Featured Release' ? <Disc3 size={16} /> : block.type === 'Featured Tour Date' ? <Calendar size={16} /> : block.type === 'Call-to-Action' ? <ArrowRight size={16} /> : <Mail size={16} />}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-neutral-900 truncate">{block.label}</p>
                      <p className="text-xs text-neutral-500 truncate">{block.type}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {idx > 0 && <button onClick={() => moveBlock(idx, idx - 1)} className="p-1 text-neutral-400 hover:text-neutral-600 rounded"><MoveUp size={14} /></button>}
                      {idx < blocks.length - 1 && <button onClick={() => moveBlock(idx, idx + 1)} className="p-1 text-neutral-400 hover:text-neutral-600 rounded"><MoveDown size={14} /></button>}
                      <button onClick={() => toggleBlock(block.id)} className="p-1 text-neutral-400 hover:text-neutral-600 rounded">{block.enabled ? <Eye size={14} /> : <EyeOff size={14} />}</button>
                      <button onClick={() => setEditBlock(block.id)} className="p-1 text-neutral-400 hover:text-neutral-600 rounded"><Edit3 size={14} /></button>
                      <button onClick={() => deleteBlock(block.id)} className="p-1 text-neutral-400 hover:text-red-500 rounded"><Trash2 size={14} /></button>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="secondary" className="mt-4 w-full" onClick={() => toast('info', 'Block library coming soon — Hero, Gallery, Video, Spotify Embed, Merch Carousel, Press Quotes')}>
                <Plus size={16} /> Add Block
              </Button>
            </div>
          </div>

          {/* Edit panel */}
          <div className="space-y-4">
            {currentEdit ? (
              <Card className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-neutral-900">Edit: {currentEdit.label}</h3>
                  <button onClick={() => setEditBlock(null)} className="text-neutral-400 hover:text-neutral-600"><X size={16} /></button>
                </div>
                <div className="space-y-4">
                  <Field label="Block Label"><Input value={currentEdit.label} onChange={(e) => setBlocks(blocks.map(b => b.id === currentEdit.id ? { ...b, label: e.target.value } : b))} /></Field>
                  {currentEdit.heading && <Field label="Heading"><Input value={currentEdit.heading} onChange={(e) => setBlocks(blocks.map(b => b.id === currentEdit.id ? { ...b, heading: e.target.value } : b))} /></Field>}
                  {currentEdit.subheading && <Field label="Subheading"><Textarea value={currentEdit.subheading} rows={2} onChange={(e) => setBlocks(blocks.map(b => b.id === currentEdit.id ? { ...b, subheading: e.target.value } : b))} /></Field>}
                  {currentEdit.ctaText && <Field label="CTA Text"><Input value={currentEdit.ctaText} onChange={(e) => setBlocks(blocks.map(b => b.id === currentEdit.id ? { ...b, ctaText: e.target.value } : b))} /></Field>}
                  {currentEdit.ctaUrl && <Field label="CTA URL"><Input value={currentEdit.ctaUrl} onChange={(e) => setBlocks(blocks.map(b => b.id === currentEdit.id ? { ...b, ctaUrl: e.target.value } : b))} /></Field>}
                  {currentEdit.ctaStyle && <Field label="CTA Style"><Select value={currentEdit.ctaStyle} onChange={(e) => setBlocks(blocks.map(b => b.id === currentEdit.id ? { ...b, ctaStyle: e.target.value } : b))}><option value="primary">Primary (Filled)</option><option value="secondary">Secondary (Outlined)</option><option value="ghost">Ghost (Text only)</option></Select></Field>}
                  {currentEdit.bgMedia && <Field label="Background Media"><div className="border border-dashed border-neutral-300 rounded-lg p-4 text-center cursor-pointer hover:border-neutral-400 transition-colors"><ImagePlus size={24} className="text-neutral-400 mx-auto mb-2" /><p className="text-sm text-neutral-600">Upload image or video</p><p className="text-xs text-neutral-400 mt-1">Currently: {currentEdit.bgMedia}</p></div></Field>}
                  <Button variant="primary" className="w-full" onClick={() => { toast('success', `"${currentEdit.label}" updated`); setEditBlock(null); }}><Save size={16} /> Save Changes</Button>
                </div>
              </Card>
            ) : (
              <Card className="p-5">
                <div className="text-center py-8">
                  <LayoutTemplate size={32} className="text-neutral-300 mx-auto mb-3" />
                  <p className="text-sm text-neutral-500">Select a block to edit its content and settings</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      ) : (
        /* Live preview pane */
        <Card className="p-6">
          <div className="space-y-1 mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-neutral-900">Live Preview</h2>
            <Badge color="green" size="sm">Live</Badge>
          </div>
          <div className="bg-neutral-50 rounded-xl border border-neutral-200 overflow-hidden">
            {/* Simulated homepage preview */}
            <div className="space-y-0">
              {blocks.filter(b => b.enabled).map((block) => (
                <div key={block.id} className={`p-6 ${block.type === 'Hero Section' ? 'bg-gradient-to-r from-purple-900 to-purple-700 text-white text-center' : block.type === 'Featured Release' ? 'bg-white border-b border-neutral-200' : block.type === 'Featured Tour Date' ? 'bg-white border-b border-neutral-200' : block.type === 'Call-to-Action' ? 'bg-white border-b border-neutral-200' : 'bg-neutral-100 border-b border-neutral-200'}`}>
                  {block.type === 'Hero Section' && (
                    <div className="py-8">
                      <p className="text-2xl font-bold">{block.heading}</p>
                      <p className="text-sm opacity-80 mt-2">{block.subheading}</p>
                      <button className="mt-4 px-6 py-2 bg-white text-purple-900 rounded-lg font-medium text-sm">{block.ctaText}</button>
                    </div>
                  )}
                  {block.type === 'Featured Release' && (
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded bg-neutral-200 flex items-center justify-center"><Disc3 size={24} className="text-neutral-400" /></div>
                      <div><p className="font-semibold text-neutral-900">{block.releaseTitle}</p><Badge color="teal" size="sm">New Release</Badge></div>
                    </div>
                  )}
                  {block.type === 'Featured Tour Date' && (
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded bg-blue-100 flex items-center justify-center"><Calendar size={18} className="text-blue-600" /></div>
                      <div><p className="font-semibold text-neutral-900">{block.tourTitle}</p><p className="text-sm text-neutral-500">{block.tourDate}</p></div>
                    </div>
                  )}
                  {block.type === 'Call-to-Action' && (
                    <div className="text-center py-4">
                      <button className={`px-6 py-2 rounded-lg font-medium text-sm ${block.ctaStyle === 'primary' ? 'bg-neutral-900 text-white' : 'border border-neutral-900 text-neutral-900'}`}>{block.ctaText}</button>
                    </div>
                  )}
                  {block.type === 'Newsletter Signup' && (
                    <div className="text-center py-4">
                      <p className="font-semibold text-neutral-900">{block.heading}</p>
                      <p className="text-sm text-neutral-500 mt-1">{block.subheading}</p>
                      <div className="mt-3 flex gap-2 max-w-xs mx-auto"><Input placeholder="Enter email" className="text-sm" /><Button variant="primary" size="sm">Subscribe</Button></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

function AdminWebsitePagesPage() {
  // Mock pages data
  const [pages, setPages] = useState([
    { id: '1', title: 'Home', slug: '/', body: 'Welcome to Luna Wave\'s official site. Explore music, tours, merch, and more.', status: 'published', lastUpdated: '2025-07-18T10:30:00' },
    { id: '2', title: 'About', slug: '/about', body: 'Luna Wave is an indie electronic artist blending ambient textures with driving rhythms. Based in Los Angeles, the project has released three studio albums and toured extensively across North America and Europe.', status: 'published', lastUpdated: '2025-07-15T08:20:00' },
    { id: '3', title: 'Tour Dates', slug: '/tour', body: 'Catch Luna Wave live on the Summer 2025 tour. Dates, venues, and ticket info below.', status: 'published', lastUpdated: '2025-07-12T14:45:00' },
    { id: '4', title: 'Shop', slug: '/shop', body: 'Official merch, vinyl, and digital downloads. Limited edition items available now.', status: 'published', lastUpdated: '2025-07-10T09:15:00' },
    { id: '5', title: 'Press Kit', slug: '/press-kit', body: 'High-res photos, bio, and press contact information for media and booking inquiries.', status: 'draft', lastUpdated: '2025-07-08T16:00:00' },
    { id: '6', title: 'Contact', slug: '/contact', body: 'Booking, press, and general inquiries. Reach the team through the form below.', status: 'draft', lastUpdated: '2025-07-05T11:30:00' },
  ]);
  const [selectedPage, setSelectedPage] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [newPage, setNewPage] = useState({ title: '', slug: '', status: 'draft' });

  const currentPage = pages.find(p => p.id === selectedPage);

  const toggleStatus = (id: string) => {
    setPages(pages.map(p => p.id === id ? { ...p, status: p.status === 'published' ? 'draft' : 'published', lastUpdated: new Date().toISOString() } : p));
    const page = pages.find(p => p.id === id);
    toast('success', `"${page?.title}" ${page?.status === 'published' ? 'unpublished' : 'published'}`);
  };

  const deletePage = (id: string) => {
    const page = pages.find(p => p.id === id);
    setPages(pages.filter(p => p.id !== id));
    if (selectedPage === id) setSelectedPage(null);
    toast('success', `"${page?.title}" deleted`);
  };

  const createPage = () => {
    if (!newPage.title) { toast('error', 'Title is required'); return; }
    const id = String(Date.now());
    const slug = newPage.slug || '/' + newPage.title.toLowerCase().replace(/\s+/g, '-');
    setPages([...pages, { id, title: newPage.title, slug, body: '', status: newPage.status, lastUpdated: new Date().toISOString() }]);
    toast('success', `"${newPage.title}" created`);
    setCreateOpen(false);
    setNewPage({ title: '', slug: '', status: 'draft' });
  };

  return (
    <div>
      <PageHeader title="Pages" description="Manage website pages, content, and publish status" actions={<Button variant="primary" onClick={() => setCreateOpen(true)}><Plus size={16} /> New Page</Button>} />

      {!selectedPage ? (
        /* List table view */
        <Card className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-200">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wide">Title</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wide">Slug</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wide">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wide">Last Updated</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-neutral-500 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pages.map(page => (
                  <tr key={page.id} className="border-b border-neutral-100 hover:bg-neutral-50 transition-colors">
                    <td className="px-4 py-3"><button onClick={() => setSelectedPage(page.id)} className="text-sm font-medium text-neutral-900 hover:text-neutral-700 hover:underline">{page.title}</button></td>
                    <td className="px-4 py-3"><span className="text-sm text-neutral-500">{page.slug}</span></td>
                    <td className="px-4 py-3"><StatusBadge status={page.status} /></td>
                    <td className="px-4 py-3"><span className="text-sm text-neutral-500">{formatDateTime(page.lastUpdated)}</span></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => toggleStatus(page.id)} className="p-1.5 text-neutral-400 hover:text-neutral-600 rounded-lg hover:bg-neutral-100" title={page.status === 'published' ? 'Unpublish' : 'Publish'}>{page.status === 'published' ? <EyeOff size={14} /> : <Eye size={14} />}</button>
                        <button onClick={() => setSelectedPage(page.id)} className="p-1.5 text-neutral-400 hover:text-neutral-600 rounded-lg hover:bg-neutral-100" title="Edit"><Edit3 size={14} /></button>
                        <button onClick={() => deletePage(page.id)} className="p-1.5 text-neutral-400 hover:text-red-500 rounded-lg hover:bg-neutral-100" title="Delete"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        /* Rich-text editor detail view */
        currentPage && (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <button onClick={() => setSelectedPage(null)} className="text-neutral-400 hover:text-neutral-600 transition-colors"><ArrowLeft size={20} /></button>
              <h2 className="text-lg font-semibold text-neutral-900">{currentPage.title}</h2>
              <StatusBadge status={currentPage.status} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main editor */}
              <div className="lg:col-span-2 space-y-4">
                <Card className="p-5">
                  <Field label="Page Title" required>
                    <Input value={currentPage.title} onChange={(e) => setPages(pages.map(p => p.id === currentPage.id ? { ...p, title: e.target.value } : p))} />
                  </Field>
                </Card>
                <Card className="p-5">
                  <Field label="Body Content">
                    {/* Toolbar */}
                    <div className="flex items-center gap-1 p-2 bg-neutral-50 border border-neutral-200 rounded-t-lg border-b-0">
                      <button className="p-1.5 text-neutral-500 hover:text-neutral-700 hover:bg-neutral-200 rounded"><Bold size={14} /></button>
                      <button className="p-1.5 text-neutral-500 hover:text-neutral-700 hover:bg-neutral-200 rounded"><Italic size={14} /></button>
                      <button className="p-1.5 text-neutral-500 hover:text-neutral-700 hover:bg-neutral-200 rounded"><Underline size={14} /></button>
                      <div className="w-px h-4 bg-neutral-200 mx-1" />
                      <button className="p-1.5 text-neutral-500 hover:text-neutral-700 hover:bg-neutral-200 rounded"><AlignLeft size={14} /></button>
                      <button className="p-1.5 text-neutral-500 hover:text-neutral-700 hover:bg-neutral-200 rounded"><AlignCenter size={14} /></button>
                      <div className="w-px h-4 bg-neutral-200 mx-1" />
                      <button className="p-1.5 text-neutral-500 hover:text-neutral-700 hover:bg-neutral-200 rounded"><ListOrdered size={14} /></button>
                      <button className="p-1.5 text-neutral-500 hover:text-neutral-700 hover:bg-neutral-200 rounded"><List size={14} /></button>
                      <div className="w-px h-4 bg-neutral-200 mx-1" />
                      <button className="p-1.5 text-neutral-500 hover:text-neutral-700 hover:bg-neutral-200 rounded"><Link2 size={14} /></button>
                      <button className="p-1.5 text-neutral-500 hover:text-neutral-700 hover:bg-neutral-200 rounded"><ImageIcon size={14} /></button>
                      <div className="ml-auto flex gap-1">
                        <button className="p-1.5 text-neutral-500 hover:text-neutral-700 hover:bg-neutral-200 rounded"><Undo2 size={14} /></button>
                        <button className="p-1.5 text-neutral-500 hover:text-neutral-700 hover:bg-neutral-200 rounded"><Redo2 size={14} /></button>
                      </div>
                    </div>
                    <Textarea
                      value={currentPage.body}
                      rows={12}
                      onChange={(e) => setPages(pages.map(p => p.id === currentPage.id ? { ...p, body: e.target.value, lastUpdated: new Date().toISOString() } : p))}
                      className="rounded-t-none"
                      placeholder="Write your page content here..."
                    />
                  </Field>
                </Card>
              </div>

              {/* Sidebar settings */}
              <div className="space-y-4">
                <Card className="p-5">
                  <h3 className="text-sm font-semibold text-neutral-900 mb-4">Page Settings</h3>
                  <div className="space-y-4">
                    <Field label="Slug / URL" hint="The URL path for this page">
                      <Input value={currentPage.slug} onChange={(e) => setPages(pages.map(p => p.id === currentPage.id ? { ...p, slug: e.target.value } : p))} />
                    </Field>
                    <Field label="Status">
                      <Select value={currentPage.status} onChange={(e) => setPages(pages.map(p => p.id === currentPage.id ? { ...p, status: e.target.value, lastUpdated: new Date().toISOString() } : p))}>
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                      </Select>
                    </Field>
                    <div className="pt-3 border-t border-neutral-200">
                      <p className="text-xs text-neutral-500">Last updated</p>
                      <p className="text-sm text-neutral-700 mt-1">{formatDateTime(currentPage.lastUpdated)}</p>
                    </div>
                  </div>
                </Card>
                <div className="flex gap-2">
                  <Button variant="primary" className="w-full" onClick={() => { toast('success', `"${currentPage.title}" saved`); }}><Save size={16} /> Save</Button>
                  <Button variant="secondary" onClick={() => setSelectedPage(null)}>Cancel</Button>
                </div>
              </div>
            </div>
          </div>
        )
      )}

      {/* Create page modal */}
      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Create New Page" footer={<><Button onClick={() => setCreateOpen(false)}>Cancel</Button><Button variant="primary" onClick={createPage}>Create Page</Button></>}>
        <div className="space-y-4">
          <Field label="Page Title" required><Input value={newPage.title} onChange={(e) => setNewPage({ ...newPage, title: e.target.value })} autoFocus placeholder="e.g., About, Tour Dates, Shop" /></Field>
          <Field label="Slug / URL" hint="Auto-generated from title if empty"><Input value={newPage.slug} onChange={(e) => setNewPage({ ...newPage, slug: e.target.value })} placeholder="/about" /></Field>
          <Field label="Status"><Select value={newPage.status} onChange={(e) => setNewPage({ ...newPage, status: e.target.value })}><option value="draft">Draft</option><option value="published">Published</option></Select></Field>
        </div>
      </Modal>
    </div>
  );
}

function AdminWebsiteNavigationPage() {
  // Mock navigation menu items
  const [items, setItems] = useState([
    { id: '1', label: 'Home', target: '/', order: 1, visibility: 'public' },
    { id: '2', label: 'Music', target: '/music', order: 2, visibility: 'public' },
    { id: '3', label: 'Tour Dates', target: '/tour', order: 3, visibility: 'public' },
    { id: '4', label: 'Shop', target: '/shop', order: 4, visibility: 'public' },
    { id: '5', label: 'Gallery', target: '/gallery', order: 5, visibility: 'public' },
    { id: '6', label: 'Fan Club', target: '/fan-club', order: 6, visibility: 'logged-in' },
    { id: '7', label: 'Press Kit', target: '/press-kit', order: 7, visibility: 'logged-in' },
    { id: '8', label: 'Contact', target: '/contact', order: 8, visibility: 'public' },
  ]);
  const [addOpen, setAddOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [newItem, setNewItem] = useState({ label: '', target: '', visibility: 'public' });

  const moveItem = (fromIdx: number, toIdx: number) => {
    const updated = [...items];
    const [moved] = updated.splice(fromIdx, 1);
    updated.splice(toIdx, 0, moved);
    // Re-number order
    const renumbered = updated.map((item, idx) => ({ ...item, order: idx + 1 }));
    setItems(renumbered);
    toast('success', `"${moved.label}" moved to position ${toIdx + 1}`);
  };

  const addItem = () => {
    if (!newItem.label) { toast('error', 'Label is required'); return; }
    const id = String(Date.now());
    setItems([...items, { id, label: newItem.label, target: newItem.target || '/' + newItem.label.toLowerCase().replace(/\s+/g, '-'), order: items.length + 1, visibility: newItem.visibility }]);
    toast('success', `"${newItem.label}" added to menu`);
    setAddOpen(false);
    setNewItem({ label: '', target: '', visibility: 'public' });
  };

  const deleteItem = (id: string) => {
    const item = items.find(i => i.id === id);
    const remaining = items.filter(i => i.id !== id).map((i, idx) => ({ ...i, order: idx + 1 }));
    setItems(remaining);
    toast('success', `"${item?.label}" removed`);
  };

  const editItem = items.find(i => i.id === editId);

  return (
    <div>
      <PageHeader title="Navigation Menu" description="Configure site navigation menus — drag to reorder items" actions={<div className="flex gap-2"><Button variant="primary" onClick={() => setAddOpen(true)}><Plus size={16} /> Add Menu Item</Button><Button variant="secondary" onClick={() => toast('success', 'Navigation menu saved!')}><Save size={16} /> Save Menu</Button></div>} />

      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-neutral-900">Main Navigation</h2>
          <span className="text-xs text-neutral-500">{items.length} items · {items.filter(i => i.visibility === 'public').length} public</span>
        </div>
        <div className="space-y-2">
          {items.map((item, idx) => (
            <div key={item.id} className="group flex items-center gap-3 p-3 rounded-lg border border-neutral-200 bg-white hover:border-neutral-300 transition-colors">
              {/* Drag handle */}
              <div className="text-neutral-400 cursor-grab active:cursor-grabbing flex-shrink-0"><GripVertical size={16} /></div>
              {/* Order indicator */}
              <div className="w-6 h-6 rounded bg-neutral-100 flex items-center justify-center text-xs font-medium text-neutral-500 flex-shrink-0">{item.order}</div>
              {/* Menu item info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-neutral-900">{item.label}</p>
                <p className="text-xs text-neutral-500 truncate">{item.target}</p>
              </div>
              {/* Visibility badge */}
              <Badge color={item.visibility === 'public' ? 'green' : 'amber'} size="sm">
                {item.visibility === 'public' ? <Eye size={12} /> : <Lock size={12} />}
                {item.visibility === 'public' ? 'Public' : 'Members'}
              </Badge>
              {/* Action buttons */}
              <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                {idx > 0 && <button onClick={() => moveItem(idx, idx - 1)} className="p-1 text-neutral-400 hover:text-neutral-600 rounded"><MoveUp size={14} /></button>}
                {idx < items.length - 1 && <button onClick={() => moveItem(idx, idx + 1)} className="p-1 text-neutral-400 hover:text-neutral-600 rounded"><MoveDown size={14} /></button>}
                <button onClick={() => setEditId(item.id)} className="p-1 text-neutral-400 hover:text-neutral-600 rounded"><Edit3 size={14} /></button>
                <button onClick={() => deleteItem(item.id)} className="p-1 text-neutral-400 hover:text-red-500 rounded"><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Preview of navigation */}
      <Card className="p-5 mt-4">
        <h3 className="text-sm font-semibold text-neutral-900 mb-3">Preview: Navigation Bar</h3>
        <div className="bg-neutral-900 rounded-xl px-4 py-3 flex items-center gap-6">
          {items.filter(i => i.visibility === 'public').map((item) => (
            <span key={item.id} className="text-sm text-white/80 hover:text-white cursor-default transition-colors">{item.label}</span>
          ))}
          <span className="text-sm text-white/40 ml-auto">···</span>
          <span className="text-sm text-white/40">Login</span>
        </div>
        <p className="text-xs text-neutral-500 mt-2 italic">Public items shown in main nav; "Members-only" items appear after login</p>
      </Card>

      {/* Add menu item modal */}
      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Add Menu Item" footer={<><Button onClick={() => setAddOpen(false)}>Cancel</Button><Button variant="primary" onClick={addItem}>Add Item</Button></>}>
        <div className="space-y-4">
          <Field label="Menu Label" required><Input value={newItem.label} onChange={(e) => setNewItem({ ...newItem, label: e.target.value })} autoFocus placeholder="e.g., About, Shop, Tour Dates" /></Field>
          <Field label="Target Page / URL" hint="Select a page or enter a custom URL"><Input value={newItem.target} onChange={(e) => setNewItem({ ...newItem, target: e.target.value })} placeholder="/about or https://..." /></Field>
          <Field label="Visibility"><Select value={newItem.visibility} onChange={(e) => setNewItem({ ...newItem, visibility: e.target.value })}><option value="public">Public — visible to everyone</option><option value="logged-in">Members — only after login</option></Select></Field>
        </div>
      </Modal>

      {/* Edit menu item modal */}
      <Modal open={!!editId} onClose={() => setEditId(null)} title="Edit Menu Item" footer={<><Button onClick={() => setEditId(null)}>Cancel</Button><Button variant="primary" onClick={() => { toast('success', `"${editItem?.label}" updated`); setEditId(null); }}>Save</Button></>}>
        {editItem && (
          <div className="space-y-4">
            <Field label="Menu Label" required><Input value={editItem.label} onChange={(e) => setItems(items.map(i => i.id === editItem.id ? { ...i, label: e.target.value } : i))} /></Field>
            <Field label="Target Page / URL"><Input value={editItem.target} onChange={(e) => setItems(items.map(i => i.id === editItem.id ? { ...i, target: e.target.value } : i))} /></Field>
            <Field label="Visibility"><Select value={editItem.visibility} onChange={(e) => setItems(items.map(i => i.id === editItem.id ? { ...i, visibility: e.target.value } : i))}><option value="public">Public — visible to everyone</option><option value="logged-in">Members — only after login</option></Select></Field>
          </div>
        )}
      </Modal>
    </div>
  );
}

function AdminWebsiteSeoPage() {
  // Mock SEO metadata for each page
  const [seoData, setSeoData] = useState([
    { id: '1', pageTitle: 'Luna Wave — Official Site', metaDescription: 'Luna Wave official website. Stream music, grab tour tickets, and shop exclusive merch.', socialShareImage: 'og-home.jpg', canonicalUrl: 'https://lunawave.com/', pageName: 'Home', slug: '/' },
    { id: '2', pageTitle: 'About Luna Wave', metaDescription: 'Learn about Luna Wave — indie electronic artist blending ambient textures with driving rhythms.', socialShareImage: 'og-about.jpg', canonicalUrl: 'https://lunawave.com/about', pageName: 'About', slug: '/about' },
    { id: '3', pageTitle: 'Tour Dates — Luna Wave', metaDescription: 'Find Luna Wave live shows, tour dates, and ticket info. Summer 2025 tour across North America.', socialShareImage: 'og-tour.jpg', canonicalUrl: 'https://lunawave.com/tour', pageName: 'Tour Dates', slug: '/tour' },
    { id: '4', pageTitle: 'Official Merch Shop', metaDescription: 'Shop Luna Wave official merch — vinyl, tees, digital downloads, and limited edition drops.', socialShareImage: 'og-shop.jpg', canonicalUrl: 'https://lunawave.com/shop', pageName: 'Shop', slug: '/shop' },
    { id: '5', pageTitle: 'Press Kit — Luna Wave', metaDescription: 'Luna Wave press kit with high-res photos, bio, and contact info for media and booking.', socialShareImage: '', canonicalUrl: 'https://lunawave.com/press-kit', pageName: 'Press Kit', slug: '/press-kit' },
    { id: '6', pageTitle: 'Contact Luna Wave', metaDescription: 'Reach Luna Wave for booking, press, and general inquiries.', socialShareImage: '', canonicalUrl: 'https://lunawave.com/contact', pageName: 'Contact', slug: '/contact' },
  ]);
  const [selectedPage, setSelectedPage] = useState<string | null>(null);

  const currentSeo = seoData.find(s => s.id === selectedPage);

  const charCount = (text: string) => text.length;
  const metaDescLimit = 160;

  return (
    <div>
      <PageHeader title="SEO & Metadata" description="Manage SEO settings, meta tags, and social share data for each page" actions={<Button variant="primary" onClick={() => toast('success', 'SEO settings saved!')}><Save size={16} /> Save All</Button>} />

      {!selectedPage ? (
        /* Page selector list */
        <Card className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-200">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wide">Page</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wide">Page Title</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wide">Meta Description</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wide">Social Image</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-neutral-500 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody>
                {seoData.map(seo => (
                  <tr key={seo.id} className="border-b border-neutral-100 hover:bg-neutral-50 transition-colors">
                    <td className="px-4 py-3"><button onClick={() => setSelectedPage(seo.id)} className="text-sm font-medium text-neutral-900 hover:text-neutral-700 hover:underline">{seo.pageName}</button><p className="text-xs text-neutral-400">{seo.slug}</p></td>
                    <td className="px-4 py-3"><span className="text-sm text-neutral-700 truncate block max-w-[200px]">{seo.pageTitle}</span></td>
                    <td className="px-4 py-3"><span className="text-sm text-neutral-500 truncate block max-w-[250px]">{seo.metaDescription || <span className="text-neutral-400 italic">Not set</span>}</span><span className={`text-xs ${charCount(seo.metaDescription) > metaDescLimit ? 'text-red-500' : 'text-neutral-400'}`}>{charCount(seo.metaDescription)}/{metaDescLimit}</span></td>
                    <td className="px-4 py-3">{seo.socialShareImage ? <Badge color="green" size="sm"><ImageIcon size={12} /> Set</Badge> : <Badge color="gray" size="sm">Not set</Badge>}</td>
                    <td className="px-4 py-3 text-right"><button onClick={() => setSelectedPage(seo.id)} className="text-sm text-neutral-500 hover:text-neutral-900 inline-flex items-center gap-1"><Edit3 size={14} /> Edit</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        currentSeo && (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <button onClick={() => setSelectedPage(null)} className="text-neutral-400 hover:text-neutral-600 transition-colors"><ArrowLeft size={20} /></button>
              <h2 className="text-lg font-semibold text-neutral-900">SEO: {currentSeo.pageName}</h2>
              <Badge color="gray" size="sm">{currentSeo.slug}</Badge>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Form fields */}
              <div className="space-y-4">
                <Card className="p-5">
                  <h3 className="text-sm font-semibold text-neutral-900 mb-4 flex items-center gap-2"><Globe size={16} /> Search Engine Optimization</h3>
                  <div className="space-y-4">
                    <Field label="Page Title" hint="Appears in search engine results and browser tabs (50–60 chars recommended)">
                      <Input value={currentSeo.pageTitle} onChange={(e) => setSeoData(seoData.map(s => s.id === currentSeo.id ? { ...s, pageTitle: e.target.value } : s))} />
                      <div className="flex items-center justify-between mt-1"><span className={`text-xs ${charCount(currentSeo.pageTitle) > 60 ? 'text-red-500' : 'text-neutral-400'}`}>{charCount(currentSeo.pageTitle)} chars</span>{charCount(currentSeo.pageTitle) > 60 && <span className="text-xs text-red-500">⚠ Too long</span>}</div>
                    </Field>
                    <Field label="Meta Description" hint="Brief description for search results (150–160 chars)" required>
                      <Textarea value={currentSeo.metaDescription} rows={3} onChange={(e) => setSeoData(seoData.map(s => s.id === currentSeo.id ? { ...s, metaDescription: e.target.value } : s))} />
                      <div className="flex items-center justify-between mt-1"><span className={`text-xs ${charCount(currentSeo.metaDescription) > metaDescLimit ? 'text-red-500' : 'text-neutral-400'}`}>{charCount(currentSeo.metaDescription)}/{metaDescLimit}</span>{charCount(currentSeo.metaDescription) > metaDescLimit && <span className="text-xs text-red-500">⚠ Exceeds limit</span>}</div>
                    </Field>
                    <Field label="Canonical URL" hint="The preferred URL for this page to avoid duplicate content">
                      <Input value={currentSeo.canonicalUrl} onChange={(e) => setSeoData(seoData.map(s => s.id === currentSeo.id ? { ...s, canonicalUrl: e.target.value } : s))} />
                    </Field>
                  </div>
                </Card>

                <Card className="p-5">
                  <h3 className="text-sm font-semibold text-neutral-900 mb-4 flex items-center gap-2"><Share size={16} /> Social Sharing (Open Graph)</h3>
                  <div className="space-y-4">
                    <Field label="Social Share Image" hint="1200×630px recommended for Facebook/Twitter cards">
                      <div className="border border-dashed border-neutral-300 rounded-lg p-4 text-center cursor-pointer hover:border-neutral-400 transition-colors">
                        {currentSeo.socialShareImage ? (
                          <div className="space-y-2">
                            <div className="w-full h-24 bg-neutral-100 rounded flex items-center justify-center"><ImageIcon size={32} className="text-neutral-400" /></div>
                            <p className="text-sm text-neutral-600">{currentSeo.socialShareImage}</p>
                            <Button variant="ghost" size="sm" className="text-red-500"><Trash2 size={12} /> Remove</Button>
                          </div>
                        ) : (
                          <div>
                            <ImagePlus size={24} className="text-neutral-400 mx-auto mb-2" />
                            <p className="text-sm text-neutral-600">Upload social share image</p>
                            <p className="text-xs text-neutral-400 mt-1">Recommended: 1200×630px PNG or JPG</p>
                          </div>
                        )}
                      </div>
                    </Field>
                  </div>
                </Card>

                <div className="flex gap-2">
                  <Button variant="primary" onClick={() => { toast('success', `SEO for "${currentSeo.pageName}" saved`); setSelectedPage(null); }}><Save size={16} /> Save</Button>
                  <Button variant="secondary" onClick={() => setSelectedPage(null)}>Cancel</Button>
                </div>
              </div>

              {/* Preview panel */}
              <div className="space-y-4">
                <Card className="p-5">
                  <h3 className="text-sm font-semibold text-neutral-900 mb-3 flex items-center gap-2"><Globe size={16} /> Google Search Preview</h3>
                  <div className="bg-white border border-neutral-200 rounded-lg p-4">
                    <p className="text-lg text-blue-700 font-medium truncate">{currentSeo.pageTitle}</p>
                    <p className="text-sm text-green-700 truncate mt-1">{currentSeo.canonicalUrl}</p>
                    <p className="text-sm text-neutral-600 mt-1 line-clamp-2">{currentSeo.metaDescription || 'No meta description set'}</p>
                  </div>
                </Card>

                <Card className="p-5">
                  <h3 className="text-sm font-semibold text-neutral-900 mb-3 flex items-center gap-2"><Share size={16} /> Social Card Preview</h3>
                  <div className="bg-neutral-50 border border-neutral-200 rounded-lg overflow-hidden">
                    <div className="w-full h-32 bg-neutral-200 flex items-center justify-center">
                      {currentSeo.socialShareImage ? <ImageIcon size={40} className="text-neutral-400" /> : <div className="text-center"><ImagePlus size={24} className="text-neutral-400 mx-auto" /><p className="text-xs text-neutral-400 mt-1">No image set</p></div>}
                    </div>
                    <div className="p-3">
                      <p className="text-sm font-medium text-neutral-900 truncate">{currentSeo.pageTitle}</p>
                      <p className="text-xs text-neutral-500 truncate">{currentSeo.canonicalUrl}</p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
}

function AdminWebsiteThemePage() {
  // Mock theme/branding data
  const [theme, setTheme] = useState({
    logo: 'luna-wave-logo.svg',
    favicon: 'favicon.ico',
    primaryColor: '#6B21A8',
    secondaryColor: '#F59E0B',
    accentColor: '#10B981',
    backgroundColor: '#FFFFFF',
    textColor: '#171717',
    fontFamily: 'Inter',
    headingFont: 'Inter',
    fontSizeBase: '16px',
    borderRadius: '12px',
  });

  const [activeTab, setActiveTab] = useState<'logo' | 'colors' | 'typography' | 'favicon'>('colors');

  const presetPalettes = [
    { name: 'Purple Dream', primary: '#6B21A8', secondary: '#F59E0B', accent: '#10B981', bg: '#FFFFFF', text: '#171717' },
    { name: 'Midnight Gold', primary: '#1C1917', secondary: '#D97706', accent: '#E5E5E5', bg: '#0A0A0A', text: '#FAFAFA' },
    { name: 'Ocean Teal', primary: '#0D9488', secondary: '#6366F1', accent: '#F43F5E', bg: '#FFFFFF', text: '#171717' },
    { name: 'Warm Ember', primary: '#DC2626', secondary: '#78350F', accent: '#FCD34D', bg: '#FFFFFF', text: '#171717' },
    { name: 'Sage Garden', primary: '#4D7C0F', secondary: '#A3A3A3', accent: '#DBEAFE', bg: '#FAFAFA', text: '#171717' },
    { name: 'Neon Pulse', primary: '#EC4899', secondary: '#8B5CF6', accent: '#06B6D4', bg: '#0A0A0A', text: '#FAFAFA' },
  ];

  const fontOptions = ['Inter', 'Georgia', 'Helvetica Neue', 'Playfair Display', 'Space Grotesk', 'DM Sans', 'Merriweather', 'Fira Code'];

  const applyPalette = (palette: typeof presetPalettes[0]) => {
    setTheme({ ...theme, primaryColor: palette.primary, secondaryColor: palette.secondary, accentColor: palette.accent, backgroundColor: palette.bg, textColor: palette.text });
    toast('success', `"${palette.name}" palette applied`);
  };

  return (
    <div>
      <PageHeader title="Theme & Branding" description="Customize your website's visual identity — colors, typography, logo, and favicon" actions={<Button variant="primary" onClick={() => toast('success', 'Theme settings saved!')}><Save size={16} /> Save Theme</Button>} />

      {/* Tab navigation */}
      <div className="flex items-center gap-1 mb-6 bg-white border border-neutral-200 rounded-xl p-1">
        {[
          { key: 'colors', label: 'Color Palette', icon: <SwatchBook size={16} /> },
          { key: 'typography', label: 'Typography', icon: <Type size={16} /> },
          { key: 'logo', label: 'Logo & Branding', icon: <ImageIcon size={16} /> },
          { key: 'favicon', label: 'Favicon', icon: <Star size={16} /> },
        ].map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key as any)} className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === tab.key ? 'bg-neutral-900 text-white' : 'text-neutral-500 hover:bg-neutral-100'}`}>
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'colors' && (
        <div className="space-y-6">
          {/* Preset palettes */}
          <Card className="p-5">
            <h3 className="text-sm font-semibold text-neutral-900 mb-4">Quick Palettes</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {presetPalettes.map(palette => (
                <button key={palette.name} onClick={() => applyPalette(palette)} className="group border border-neutral-200 rounded-xl p-3 hover:border-neutral-300 hover:shadow-sm transition-all">
                  <div className="flex gap-1 mb-2">
                    <div className="w-6 h-6 rounded-full" style={{ backgroundColor: palette.primary }} />
                    <div className="w-6 h-6 rounded-full" style={{ backgroundColor: palette.secondary }} />
                    <div className="w-6 h-6 rounded-full" style={{ backgroundColor: palette.accent }} />
                  </div>
                  <p className="text-xs font-medium text-neutral-700 group-hover:text-neutral-900">{palette.name}</p>
                </button>
              ))}
            </div>
          </Card>

          {/* Custom color settings */}
          <Card className="p-5">
            <h3 className="text-sm font-semibold text-neutral-900 mb-4">Custom Colors</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Field label="Primary Color">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-lg border border-neutral-200 cursor-pointer" style={{ backgroundColor: theme.primaryColor }} />
                  <Input value={theme.primaryColor} onChange={(e) => setTheme({ ...theme, primaryColor: e.target.value })} />
                </div>
              </Field>
              <Field label="Secondary Color">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-lg border border-neutral-200 cursor-pointer" style={{ backgroundColor: theme.secondaryColor }} />
                  <Input value={theme.secondaryColor} onChange={(e) => setTheme({ ...theme, secondaryColor: e.target.value })} />
                </div>
              </Field>
              <Field label="Accent Color">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-lg border border-neutral-200 cursor-pointer" style={{ backgroundColor: theme.accentColor }} />
                  <Input value={theme.accentColor} onChange={(e) => setTheme({ ...theme, accentColor: e.target.value })} />
                </div>
              </Field>
              <Field label="Background Color">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-lg border border-neutral-200 cursor-pointer" style={{ backgroundColor: theme.backgroundColor }} />
                  <Input value={theme.backgroundColor} onChange={(e) => setTheme({ ...theme, backgroundColor: e.target.value })} />
                </div>
              </Field>
              <Field label="Text Color">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-lg border border-neutral-200 cursor-pointer" style={{ backgroundColor: theme.textColor }} />
                  <Input value={theme.textColor} onChange={(e) => setTheme({ ...theme, textColor: e.target.value })} />
                </div>
              </Field>
            </div>
          </Card>

          {/* Color preview */}
          <Card className="p-5">
            <h3 className="text-sm font-semibold text-neutral-900 mb-4">Preview</h3>
            <div className="rounded-xl overflow-hidden" style={{ backgroundColor: theme.backgroundColor, color: theme.textColor }}>
              {/* Simulated website section */}
              <div className="p-8 space-y-4">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded" style={{ backgroundColor: theme.primaryColor }} />
                  <span className="font-semibold text-lg">Luna Wave</span>
                </div>
                <div className="p-6 rounded-xl text-center" style={{ backgroundColor: theme.primaryColor, color: '#FFFFFF' }}>
                  <p className="text-2xl font-bold">New Album Out Now</p>
                  <p className="text-sm opacity-80 mt-2">Stream "Echoes" everywhere</p>
                  <button className="mt-4 px-4 py-2 rounded-lg font-medium text-sm" style={{ backgroundColor: theme.secondaryColor, color: '#FFFFFF' }}>Listen Now</button>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 rounded-lg text-center" style={{ backgroundColor: theme.accentColor, color: theme.textColor }}><p className="text-sm font-medium">Tour Dates</p></div>
                  <div className="p-3 rounded-lg text-center border" style={{ borderColor: theme.primaryColor }}><p className="text-sm font-medium">Shop</p></div>
                  <div className="p-3 rounded-lg text-center" style={{ backgroundColor: theme.secondaryColor, color: '#FFFFFF' }}><p className="text-sm font-medium">Fan Club</p></div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'typography' && (
        <div className="space-y-6">
          <Card className="p-5">
            <h3 className="text-sm font-semibold text-neutral-900 mb-4">Typography Settings</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Body Font Family" hint="Used for paragraphs, descriptions, and general text">
                <Select value={theme.fontFamily} onChange={(e) => setTheme({ ...theme, fontFamily: e.target.value })}>
                  {fontOptions.map(f => <option key={f} value={f}>{f}</option>)}
                </Select>
              </Field>
              <Field label="Heading Font Family" hint="Used for page titles and section headings">
                <Select value={theme.headingFont} onChange={(e) => setTheme({ ...theme, headingFont: e.target.value })}>
                  {fontOptions.map(f => <option key={f} value={f}>{f}</option>)}
                </Select>
              </Field>
              <Field label="Base Font Size">
                <Select value={theme.fontSizeBase} onChange={(e) => setTheme({ ...theme, fontSizeBase: e.target.value })}>
                  <option value="14px">14px — Compact</option>
                  <option value="16px">16px — Standard</option>
                  <option value="18px">18px — Large</option>
                  <option value="20px">20px — Extra Large</option>
                </Select>
              </Field>
              <Field label="Border Radius" hint="Controls roundness of buttons, cards, and inputs">
                <Select value={theme.borderRadius} onChange={(e) => setTheme({ ...theme, borderRadius: e.target.value })}>
                  <option value="0px">0px — Sharp</option>
                  <option value="4px">4px — Subtle</option>
                  <option value="8px">8px — Rounded</option>
                  <option value="12px">12px — Smooth</option>
                  <option value="16px">16px — Pill-like</option>
                </Select>
              </Field>
            </div>
          </Card>

          {/* Typography preview */}
          <Card className="p-5">
            <h3 className="text-sm font-semibold text-neutral-900 mb-4">Typography Preview</h3>
            <div className="space-y-4 p-6 bg-neutral-50 rounded-xl">
              <p className="text-3xl font-bold" style={{ fontFamily: theme.headingFont }}>Heading — {theme.headingFont}</p>
              <p className="text-xl font-semibold" style={{ fontFamily: theme.headingFont }}>Section Title</p>
              <p className="text-base" style={{ fontFamily: theme.fontFamily, fontSize: theme.fontSizeBase }}>Body text paragraph — {theme.fontFamily} at {theme.fontSizeBase}. This is how your regular content will look across the site.</p>
              <p className="text-sm" style={{ fontFamily: theme.fontFamily }}>Small text for captions, footnotes, and metadata.</p>
              <div className="flex gap-2 mt-4">
                <button className="px-4 py-2 text-sm font-medium" style={{ borderRadius: theme.borderRadius, backgroundColor: theme.primaryColor, color: '#FFFFFF' }}>Primary Button</button>
                <button className="px-4 py-2 text-sm font-medium border" style={{ borderRadius: theme.borderRadius, borderColor: theme.primaryColor }}>Secondary Button</button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'logo' && (
        <div className="space-y-6">
          <Card className="p-5">
            <h3 className="text-sm font-semibold text-neutral-900 mb-4">Logo</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Main logo */}
              <div>
                <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-2">Main Logo</p>
                <div className="border border-neutral-200 rounded-xl p-6 bg-neutral-50 flex flex-col items-center justify-center min-h-[120px]">
                  {theme.logo ? (
                    <div className="space-y-3 text-center">
                      <div className="w-20 h-20 bg-white rounded-lg flex items-center justify-center border border-neutral-200">
                        <Paintbrush size={28} className="text-neutral-400" />
                      </div>
                      <p className="text-sm text-neutral-600">{theme.logo}</p>
                      <Button variant="ghost" size="sm" className="text-red-500"><Trash2 size={12} /> Remove</Button>
                    </div>
                  ) : (
                    <div className="border border-dashed border-neutral-300 rounded-lg p-4 text-center cursor-pointer hover:border-neutral-400 transition-colors">
                      <ImagePlus size={24} className="text-neutral-400 mx-auto mb-2" />
                      <p className="text-sm text-neutral-600">Upload logo</p>
                    </div>
                  )}
                </div>
              </div>
              {/* Dark mode logo */}
              <div>
                <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-2">Dark Background Variant</p>
                <div className="border border-neutral-200 rounded-xl p-6 bg-neutral-900 flex flex-col items-center justify-center min-h-[120px]">
                  <div className="space-y-3 text-center">
                    <div className="w-20 h-20 bg-neutral-800 rounded-lg flex items-center justify-center border border-neutral-700">
                      <Paintbrush size={28} className="text-neutral-500" />
                    </div>
                    <p className="text-sm text-neutral-400">{theme.logo} (white variant)</p>
                    <Button variant="ghost" size="sm" className="text-neutral-500 hover:text-white"><Upload size={12} /> Upload white variant</Button>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-neutral-200">
              <Field label="Maximum Logo Width"><Select value="160px" onChange={() => {}}><option value="80px">80px — Small</option><option value="120px">120px — Medium</option><option value="160px">160px — Standard</option><option value="200px">200px — Large</option></Select></Field>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'favicon' && (
        <div className="space-y-6">
          <Card className="p-5">
            <h3 className="text-sm font-semibold text-neutral-900 mb-4">Favicon</h3>
            <div className="flex items-start gap-6">
              {/* Current favicon */}
              <div className="space-y-3 text-center">
                <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide">Current Favicon</p>
                <div className="w-16 h-16 bg-white border border-neutral-200 rounded-lg flex items-center justify-center">
                  <Star size={24} className="text-purple-600" />
                </div>
                <p className="text-xs text-neutral-500">{theme.favicon}</p>
              </div>
              {/* Browser preview */}
              <div className="flex-1">
                <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-2">Browser Tab Preview</p>
                <div className="bg-neutral-200 rounded-xl overflow-hidden">
                  {/* Simulated browser chrome */}
                  <div className="bg-neutral-300 px-3 py-2 flex items-center gap-2 border-b border-neutral-400">
                    <div className="w-4 h-4 bg-purple-600 rounded-sm flex items-center justify-center"><Star size={10} className="text-white" /></div>
                    <span className="text-xs font-medium text-neutral-700">Luna Wave — Official Site</span>
                    <div className="ml-auto flex gap-1.5"><div className="w-3 h-3 rounded-full bg-neutral-400" /><div className="w-3 h-3 rounded-full bg-neutral-400" /><div className="w-3 h-3 rounded-full bg-neutral-400" /></div>
                  </div>
                  <div className="bg-white p-4 min-h-[80px]">
                    <p className="text-sm text-neutral-400">Website content area...</p>
                  </div>
                </div>
                <div className="mt-4 border border-dashed border-neutral-300 rounded-lg p-4 text-center cursor-pointer hover:border-neutral-400 transition-colors">
                  <ImagePlus size={20} className="text-neutral-400 mx-auto mb-1" />
                  <p className="text-sm text-neutral-600">Upload new favicon</p>
                  <p className="text-xs text-neutral-400 mt-1">Recommended: 32×32px ICO or PNG</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

// ============ CMS BLOG / NEWS PAGE ============
function AdminCmsBlogPage() {
  const [filterTag, setFilterTag] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingPost, setEditingPost] = useState<typeof blogPosts[0] | null>(null);
  const [formTitle, setFormTitle] = useState('');
  const [formAuthor, setFormAuthor] = useState('');
  const [formBody, setFormBody] = useState('');
  const [formCoverImage, setFormCoverImage] = useState('');
  const [formTags, setFormTags] = useState('');
  const [formPublishDate, setFormPublishDate] = useState('');
  const [formStatus, setFormStatus] = useState('draft');

  const blogPosts = [
    { id: 1, title: 'New Album "Midnight Echoes" Drops Friday', author: 'Sarah Chen', body: 'The highly anticipated sophomore album from Luna Vega is set for release this Friday...', coverImage: 'https://placehold.co/600x400/1a1a2e/eee?text=Midnight+Echoes', tags: ['album release', 'luna vega'], publishDate: '2025-03-14', status: 'published' },
    { id: 2, title: 'Summer Tour 2025 Dates Announced', author: 'Marcus Webb', body: 'The Neon Waves summer tour will hit 24 cities across North America...', coverImage: 'https://placehold.co/600x400/0f3460/eee?text=Summer+Tour', tags: ['tour', 'neon waves'], publishDate: '2025-03-10', status: 'published' },
    { id: 3, title: 'Behind the Scenes: Studio Sessions with Kai Horizon', author: 'Sarah Chen', body: 'Go behind the glass as Kai Horizon records his upcoming EP...', coverImage: 'https://placehold.co/600x400/16213e/eee?text=Studio+BTS', tags: ['behind the scenes', 'kai horizon'], publishDate: '2025-03-18', status: 'draft' },
    { id: 4, title: 'Collaboration Alert: Zara Moon × The Velvet Lines', author: 'Marcus Webb', body: 'Two of the label\'s biggest acts are joining forces for a special double single...', coverImage: 'https://placehold.co/600x400/1a1a2e/eee?text=Collab', tags: ['collaboration', 'zara moon'], publishDate: '2025-03-20', status: 'scheduled' },
    { id: 5, title: 'Vinyl Restock: Classic Albums Back in Press', author: 'Lena Park', body: 'Fan favorites from the back catalog are getting a limited vinyl repress...', coverImage: 'https://placehold.co/600x400/0f3460/eee?text=Vinyl+Restock', tags: ['merch', 'vinyl'], publishDate: '2025-03-22', status: 'draft' },
    { id: 6, title: 'Label Spotlight: Rising Artists to Watch in 2025', author: 'Lena Park', body: 'Meet the next wave of talent signed to the roster this year...', coverImage: 'https://placehold.co/600x400/16213e/eee?text=Rising+Artists', tags: ['spotlight', 'roster'], publishDate: '2025-02-28', status: 'published' },
  ];

  const allTags = Array.from(new Set(blogPosts.flatMap(p => p.tags))).sort();
  const filtered = blogPosts.filter(p => {
    if (filterTag !== 'all' && !p.tags.includes(filterTag)) return false;
    if (filterStatus !== 'all' && p.status !== filterStatus) return false;
    return true;
  });

  const openNew = () => {
    setEditingPost(null);
    setFormTitle(''); setFormAuthor(''); setFormBody(''); setFormCoverImage('');
    setFormTags(''); setFormPublishDate(''); setFormStatus('draft');
    setShowModal(true);
  };
  const openEdit = (post: typeof blogPosts[0]) => {
    setEditingPost(post);
    setFormTitle(post.title); setFormAuthor(post.author); setFormBody(post.body);
    setFormCoverImage(post.coverImage); setFormTags(post.tags.join(', '));
    setFormPublishDate(post.publishDate); setFormStatus(post.status);
    setShowModal(true);
  };
  const handleSave = () => {
    toast.success(editingPost ? 'Post updated' : 'Post created');
    setShowModal(false);
  };

  return (
    <div>
      <PageHeader title="Blog / News" description="Manage blog posts and news articles" actions={<Button variant="primary" onClick={openNew}><Plus size={16} />New Post</Button>} />
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="flex items-center gap-2">
          <Tag size={14} className="text-neutral-400" />
          <Select value={filterTag} onChange={e => setFilterTag(e.target.value)} className="!w-40">
            <option value="all">All Tags</option>
            {allTags.map(t => <option key={t} value={t}>{t}</option>)}
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-neutral-400" />
          <Select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="!w-36">
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="scheduled">Scheduled</option>
            <option value="published">Published</option>
          </Select>
        </div>
        <span className="text-xs text-neutral-400 ml-auto">{filtered.length} post{filtered.length !== 1 ? 's' : ''}</span>
      </div>
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-100 bg-neutral-50/60">
                <th className="text-left px-4 py-3 font-medium text-neutral-500">Title</th>
                <th className="text-left px-4 py-3 font-medium text-neutral-500">Author</th>
                <th className="text-left px-4 py-3 font-medium text-neutral-500">Tags</th>
                <th className="text-left px-4 py-3 font-medium text-neutral-500">Status</th>
                <th className="text-left px-4 py-3 font-medium text-neutral-500">Publish Date</th>
                <th className="text-right px-4 py-3 font-medium text-neutral-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(post => (
                <tr key={post.id} className="border-b border-neutral-50 hover:bg-neutral-50/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-neutral-100 flex-shrink-0 overflow-hidden">
                        <img src={post.coverImage} alt="" className="w-full h-full object-cover" />
                      </div>
                      <span className="font-medium text-neutral-900 truncate max-w-[200px]">{post.title}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-neutral-600">{post.author}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {post.tags.slice(0, 2).map(t => <Badge key={t} color="gray" size="sm">{t}</Badge>)}
                      {post.tags.length > 2 && <Badge color="gray" size="sm">+{post.tags.length - 2}</Badge>}
                    </div>
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={post.status} /></td>
                  <td className="px-4 py-3 text-neutral-500">{post.publishDate}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="sm" onClick={() => openEdit(post)}><Edit3 size={14} /></Button>
                      <Button variant="ghost" size="sm"><Trash2 size={14} className="text-red-500" /></Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      <Modal open={showModal} onClose={() => setShowModal(false)} title={editingPost ? 'Edit Post' : 'New Post'} size="lg" footer={<><Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button><Button variant="primary" onClick={handleSave}><Save size={14} />{editingPost ? 'Update' : 'Create'}</Button></>}>
        <div className="space-y-4">
          <Field label="Title" required><Input value={formTitle} onChange={e => setFormTitle(e.target.value)} placeholder="Enter post title" /></Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Author" required><Input value={formAuthor} onChange={e => setFormAuthor(e.target.value)} placeholder="Author name" /></Field>
            <Field label="Publish Date"><Input type="date" value={formPublishDate} onChange={e => setFormPublishDate(e.target.value)} /></Field>
          </div>
          <Field label="Body" required><Textarea value={formBody} onChange={e => setFormBody(e.target.value)} placeholder="Write your post content..." rows={6} /></Field>
          <Field label="Cover Image URL"><Input value={formCoverImage} onChange={e => setFormCoverImage(e.target.value)} placeholder="https://..." /></Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Tags" hint="Comma-separated"><Input value={formTags} onChange={e => setFormTags(e.target.value)} placeholder="album release, tour" /></Field>
            <Field label="Status"><Select value={formStatus} onChange={e => setFormStatus(e.target.value)}><option value="draft">Draft</option><option value="scheduled">Scheduled</option><option value="published">Published</option></Select></Field>
          </div>
        </div>
      </Modal>
    </div>
  );
}

// ============ CMS PRESS RELEASES PAGE ============
function AdminCmsPressPage() {
  const [sortField, setSortField] = useState<'embargo' | 'title'>('embargo');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [showModal, setShowModal] = useState(false);
  const [formTitle, setFormTitle] = useState('');
  const [formLink, setFormLink] = useState('');
  const [formAssociated, setFormAssociated] = useState('');
  const [formEmbargo, setFormEmbargo] = useState('');

  const pressReleases = [
    { id: 1, title: 'Luna Vega Announces "Midnight Echoes" Album Release', link: 'https://press.lunavega.com/midnight-echoes', associatedRelease: 'Midnight Echoes', embargoDate: '2025-03-14', status: 'published' },
    { id: 2, title: 'Neon Waves 2025 Summer Tour — Official Press Kit', link: 'https://press.neonwaves.com/tour-2025', associatedRelease: 'Summer Tour 2025', embargoDate: '2025-03-10', status: 'published' },
    { id: 3, title: 'Kai Horizon Signs Exclusive Deal with Label', link: 'https://drive.google.com/kai-horizon-signing', associatedRelease: 'Kai Horizon EP', embargoDate: '2025-03-20', status: 'embargoed' },
    { id: 4, title: 'Zara Moon × The Velvet Lines Double Single Announcement', link: 'https://press.zaramoon.com/collab', associatedRelease: 'Double Single', embargoDate: '2025-03-18', status: 'embargoed' },
    { id: 5, title: 'Label Wins Independent Music Award for Best Roster', link: 'https://press.label.com/ima-2025', associatedRelease: '—', embargoDate: '2025-02-20', status: 'published' },
    { id: 6, title: 'Vinyl Restock Announcement for Classic Catalog', link: 'https://drive.google.com/vinyl-restock', associatedRelease: 'Catalog Reissue', embargoDate: '2025-03-25', status: 'draft' },
  ];

  const sorted = [...pressReleases].sort((a, b) => {
    const mul = sortDir === 'asc' ? 1 : -1;
    if (sortField === 'embargo') return mul * a.embargoDate.localeCompare(b.embargoDate);
    return mul * a.title.localeCompare(b.title);
  });

  const toggleSort = (field: 'embargo' | 'title') => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('asc'); }
  };

  const renderSortIcon = (field: 'embargo' | 'title') => {
    if (sortField !== field) return <ChevronUp size={12} className="text-neutral-300" />;
    return sortDir === 'asc' ? <ChevronUp size={12} className="text-neutral-900" /> : <ChevronDown size={12} className="text-neutral-900" />;
  };

  return (
    <div>
      <PageHeader title="Press Releases" description="Manage press releases and media coverage" actions={<Button variant="primary" onClick={() => { setFormTitle(''); setFormLink(''); setFormAssociated(''); setFormEmbargo(''); setShowModal(true); }}><Plus size={16} />New Press Release</Button>} />
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-100 bg-neutral-50/60">
                <th className="text-left px-4 py-3 font-medium text-neutral-500 cursor-pointer select-none" onClick={() => toggleSort('title')}>
                  <span className="inline-flex items-center gap-1">Title {renderSortIcon('title')}</span>
                </th>
                <th className="text-left px-4 py-3 font-medium text-neutral-500">Associated Release</th>
                <th className="text-left px-4 py-3 font-medium text-neutral-500">PDF / Link</th>
                <th className="text-left px-4 py-3 font-medium text-neutral-500 cursor-pointer select-none" onClick={() => toggleSort('embargo')}>
                  <span className="inline-flex items-center gap-1">Embargo Date {renderSortIcon('embargo')}</span>
                </th>
                <th className="text-left px-4 py-3 font-medium text-neutral-500">Status</th>
                <th className="text-right px-4 py-3 font-medium text-neutral-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map(pr => (
                <tr key={pr.id} className="border-b border-neutral-50 hover:bg-neutral-50/50 transition-colors">
                  <td className="px-4 py-3 font-medium text-neutral-900 max-w-[280px] truncate">{pr.title}</td>
                  <td className="px-4 py-3 text-neutral-600">{pr.associatedRelease}</td>
                  <td className="px-4 py-3">
                    <a href={pr.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-neutral-500 hover:text-neutral-900 transition-colors">
                      <Link2 size={14} />View
                    </a>
                  </td>
                  <td className="px-4 py-3 text-neutral-600">{pr.embargoDate}</td>
                  <td className="px-4 py-3"><StatusBadge status={pr.status} /></td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="sm"><Edit3 size={14} /></Button>
                      <Button variant="ghost" size="sm"><Trash2 size={14} className="text-red-500" /></Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      <Modal open={showModal} onClose={() => setShowModal(false)} title="New Press Release" size="lg" footer={<><Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button><Button variant="primary" onClick={() => { toast.success('Press release created'); setShowModal(false); }}><Save size={14} />Create</Button></>}>
        <div className="space-y-4">
          <Field label="Title" required><Input value={formTitle} onChange={e => setFormTitle(e.target.value)} placeholder="Press release title" /></Field>
          <Field label="PDF / Link" required><Input value={formLink} onChange={e => setFormLink(e.target.value)} placeholder="https://..." /></Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Associated Release / Tour"><Input value={formAssociated} onChange={e => setFormAssociated(e.target.value)} placeholder="e.g. Midnight Echoes" /></Field>
            <Field label="Embargo Date"><Input type="date" value={formEmbargo} onChange={e => setFormEmbargo(e.target.value)} /></Field>
          </div>
        </div>
      </Modal>
    </div>
  );
}

// ============ CMS MEDIA GALLERY PAGE ============
function AdminCmsGalleryPage() {
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [formCaption, setFormCaption] = useState('');
  const [formCategory, setFormCategory] = useState('press photo');
  const [formUsageRights, setFormUsageRights] = useState('');

  const galleryItems = [
    { id: 1, src: 'https://placehold.co/400x500/1a1a2e/eee?text=Luna+Vega+Press', caption: 'Luna Vega — Official press photo 2025', category: 'press photo', usageRights: 'Approved for editorial use worldwide' },
    { id: 2, src: 'https://placehold.co/400x300/0f3460/eee?text=Neon+Waves+Tour', caption: 'Neon Waves live at The Roxy', category: 'tour photo', usageRights: 'Label-owned, no restrictions' },
    { id: 3, src: 'https://placehold.co/400x350/16213e/eee?text=Studio+BTS', caption: 'Kai Horizon in the studio', category: 'behind-the-scenes', usageRights: 'Social media only, no print' },
    { id: 4, src: 'https://placehold.co/400x450/1a1a2e/eee?text=Zara+Moon', caption: 'Zara Moon — Album cover shoot', category: 'press photo', usageRights: 'Approved for editorial use worldwide' },
    { id: 5, src: 'https://placehold.co/400x280/0f3460/eee?text=Concert+Crowd', caption: 'Summer Tour 2025 — crowd shot', category: 'tour photo', usageRights: 'Label-owned, no restrictions' },
    { id: 6, src: 'https://placehold.co/400x400/16213e/eee?text=Writing+Session', caption: 'Behind the scenes: writing session', category: 'behind-the-scenes', usageRights: 'Social media only, no print' },
    { id: 7, src: 'https://placehold.co/400x320/1a1a2e/eee?text=Velvet+Lines', caption: 'The Velvet Lines — band press shot', category: 'press photo', usageRights: 'Approved for editorial use worldwide' },
    { id: 8, src: 'https://placehold.co/400x360/0f3460/eee?text=Soundcheck', caption: 'Soundcheck before Nashville show', category: 'tour photo', usageRights: 'Label-owned, no restrictions' },
    { id: 9, src: 'https://placehold.co/400x420/16213e/eee?text=Merch+Setup', caption: 'Merch table setup before doors', category: 'behind-the-scenes', usageRights: 'Internal use only' },
  ];

  const filtered = categoryFilter === 'all' ? galleryItems : galleryItems.filter(i => i.category === categoryFilter);

  const categoryColor: Record<string, 'blue' | 'green' | 'purple'> = {
    'press photo': 'blue',
    'tour photo': 'green',
    'behind-the-scenes': 'purple',
  };

  return (
    <div>
      <PageHeader title="Media Gallery" description="Manage photos and visual assets" actions={<Button variant="primary" onClick={() => { setFormCaption(''); setFormCategory('press photo'); setFormUsageRights(''); setShowModal(true); }}><ImagePlus size={16} />Upload Asset</Button>} />
      <div className="flex items-center gap-2 mb-4">
        {['all', 'press photo', 'tour photo', 'behind-the-scenes'].map(cat => (
          <Button key={cat} variant={categoryFilter === cat ? 'primary' : 'secondary'} size="sm" onClick={() => setCategoryFilter(cat)}>
            {cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
          </Button>
        ))}
        <span className="text-xs text-neutral-400 ml-auto">{filtered.length} asset{filtered.length !== 1 ? 's' : ''}</span>
      </div>
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
        {filtered.map(item => (
          <Card key={item.id} className="overflow-hidden break-inside-avoid">
            <div className="aspect-auto w-full overflow-hidden bg-neutral-100">
              <img src={item.src} alt={item.caption} className="w-full h-auto object-cover" />
            </div>
            <div className="p-4">
              <p className="text-sm font-medium text-neutral-900 mb-2">{item.caption}</p>
              <div className="flex items-center justify-between">
                <Badge color={categoryColor[item.category] ?? 'gray'} size="sm">{item.category}</Badge>
                <Button variant="ghost" size="sm"><MoreHorizontal size={14} /></Button>
              </div>
              <p className="mt-2 text-xs text-neutral-400 flex items-start gap-1"><Info size={12} className="mt-0.5 flex-shrink-0" />{item.usageRights}</p>
            </div>
          </Card>
        ))}
      </div>
      <Modal open={showModal} onClose={() => setShowModal(false)} title="Upload Asset" size="md" footer={<><Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button><Button variant="primary" onClick={() => { toast.success('Asset uploaded'); setShowModal(false); }}><Upload size={14} />Upload</Button></>}>
        <div className="space-y-4">
          <Field label="Asset File"><div className="border-2 border-dashed border-neutral-200 rounded-lg p-8 text-center cursor-pointer hover:border-neutral-300 transition-colors"><FileUp size={24} className="mx-auto text-neutral-300 mb-2" /><p className="text-sm text-neutral-500">Click or drag to upload</p><p className="text-xs text-neutral-400 mt-1">PNG, JPG, WebP up to 10MB</p></div></Field>
          <Field label="Caption" required><Input value={formCaption} onChange={e => setFormCaption(e.target.value)} placeholder="Describe the asset" /></Field>
          <Field label="Category"><Select value={formCategory} onChange={e => setFormCategory(e.target.value)}><option value="press photo">Press Photo</option><option value="tour photo">Tour Photo</option><option value="behind-the-scenes">Behind-the-Scenes</option></Select></Field>
          <Field label="Usage Rights Note"><Textarea value={formUsageRights} onChange={e => setFormUsageRights(e.target.value)} placeholder="e.g. Approved for editorial use worldwide" rows={2} /></Field>
        </div>
      </Modal>
    </div>
  );
}

// ============ CMS ANNOUNCEMENTS & BANNERS PAGE ============
function AdminCmsBannersPage() {
  const [banners, setBanners] = useState([
    { id: 1, message: 'New album "Midnight Echoes" — out now! Stream everywhere.', link: '/releases/midnight-echoes', startDate: '2025-03-14', endDate: '2025-04-14', placement: 'site-wide', active: true },
    { id: 2, message: 'Summer Tour 2025 tickets on sale this Friday.', link: '/tour/2025', startDate: '2025-03-10', endDate: '2025-03-17', placement: 'homepage-only', active: true },
    { id: 3, message: 'Fan Club members get 20% off all merch this week.', link: '/shop', startDate: '2025-03-01', endDate: '2025-03-08', placement: 'site-wide', active: false },
    { id: 4, message: 'Sign up for exclusive early access to Kai Horizon EP.', link: '/fan-club', startDate: '2025-03-18', endDate: '2025-03-25', placement: 'homepage-only', active: true },
    { id: 5, message: 'Vinyl restock alert — limited edition pressings available now.', link: '/shop/vinyl', startDate: '2025-03-22', endDate: '2025-04-22', placement: 'site-wide', active: false },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [formMessage, setFormMessage] = useState('');
  const [formLink, setFormLink] = useState('');
  const [formStart, setFormStart] = useState('');
  const [formEnd, setFormEnd] = useState('');
  const [formPlacement, setFormPlacement] = useState('site-wide');

  const toggleActive = (id: number) => {
    setBanners(prev => prev.map(b => b.id === id ? { ...b, active: !b.active } : b));
    toast.success('Banner status updated');
  };

  return (
    <div>
      <PageHeader title="Announcements & Banners" description="Manage promotional banners and site announcements" actions={<Button variant="primary" onClick={() => { setFormMessage(''); setFormLink(''); setFormStart(''); setFormEnd(''); setFormPlacement('site-wide'); setShowModal(true); }}><Plus size={16} />New Banner</Button>} />
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-100 bg-neutral-50/60">
                <th className="text-left px-4 py-3 font-medium text-neutral-500">Message</th>
                <th className="text-left px-4 py-3 font-medium text-neutral-500">Link Target</th>
                <th className="text-left px-4 py-3 font-medium text-neutral-500">Placement</th>
                <th className="text-left px-4 py-3 font-medium text-neutral-500">Start — End</th>
                <th className="text-center px-4 py-3 font-medium text-neutral-500">Active</th>
                <th className="text-right px-4 py-3 font-medium text-neutral-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {banners.map(b => (
                <tr key={b.id} className={`border-b border-neutral-50 transition-colors ${!b.active ? 'opacity-60' : 'hover:bg-neutral-50/50'}`}>
                  <td className="px-4 py-3 font-medium text-neutral-900 max-w-[280px] truncate">{b.message}</td>
                  <td className="px-4 py-3 text-neutral-500 text-xs font-mono">{b.link}</td>
                  <td className="px-4 py-3"><Badge color={b.placement === 'site-wide' ? 'blue' : 'gray'} size="sm">{b.placement}</Badge></td>
                  <td className="px-4 py-3 text-neutral-500 text-xs">{b.startDate} — {b.endDate}</td>
                  <td className="px-4 py-3 text-center">
                    <button onClick={() => toggleActive(b.id)} className={`inline-flex items-center h-6 w-11 rounded-full transition-colors relative ${b.active ? 'bg-green-500' : 'bg-neutral-200'}`}>
                      <span className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${b.active ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="sm"><Edit3 size={14} /></Button>
                      <Button variant="ghost" size="sm"><Trash2 size={14} className="text-red-500" /></Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      <Modal open={showModal} onClose={() => setShowModal(false)} title="New Banner" size="md" footer={<><Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button><Button variant="primary" onClick={() => { toast.success('Banner created'); setShowModal(false); }}><Save size={14} />Create</Button></>}>
        <div className="space-y-4">
          <Field label="Message Text" required><Textarea value={formMessage} onChange={e => setFormMessage(e.target.value)} placeholder="Banner message..." rows={2} /></Field>
          <Field label="Link Target"><Input value={formLink} onChange={e => setFormLink(e.target.value)} placeholder="/path or https://..." /></Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Start Date"><Input type="date" value={formStart} onChange={e => setFormStart(e.target.value)} /></Field>
            <Field label="End Date"><Input type="date" value={formEnd} onChange={e => setFormEnd(e.target.value)} /></Field>
          </div>
          <Field label="Placement"><Select value={formPlacement} onChange={e => setFormPlacement(e.target.value)}><option value="site-wide">Site-wide</option><option value="homepage-only">Homepage Only</option></Select></Field>
        </div>
      </Modal>
    </div>
  );
}

// ============ SHOP BUNDLES & FAN TIERS PAGE ============
function AdminShopBundlesPage() {
  const [showModal, setShowModal] = useState(false);
  const [formTierName, setFormTierName] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [formBilling, setFormBilling] = useState('monthly');
  const [formPerks, setFormPerks] = useState('');
  const [formLinkedSub, setFormLinkedSub] = useState('');

  const fanTiers = [
    { id: 1, name: 'Entry', price: 4.99, billingCycle: 'monthly', perks: ['Ad-free streaming', 'Early access to singles', 'Community forum access'], linkedSub: 'Direct-to-Fan Basic', color: 'teal', icon: <Star size={20} /> },
    { id: 2, name: 'Core', price: 9.99, billingCycle: 'monthly', perks: ['All Entry perks', 'Exclusive content drops', '10% merch discount', 'Monthly live Q&A'], linkedSub: 'Direct-to-Fan Core', color: 'purple', icon: <Crown size={20} /> },
    { id: 3, name: 'Premium', price: 19.99, billingCycle: 'monthly', perks: ['All Core perks', 'VIP meet & greet access', '25% merch discount', 'Signed merch quarterly', 'First access to tour presales'], linkedSub: 'Direct-to-Fan Premium', color: 'amber', icon: <Gift size={20} /> },
  ];

  const colorMap: Record<string, string> = {
    teal: 'border-teal-200 bg-teal-50/30',
    purple: 'border-purple-200 bg-purple-50/30',
    amber: 'border-amber-200 bg-amber-50/30',
  };
  const iconColorMap: Record<string, string> = {
    teal: 'text-teal-600 bg-teal-100',
    purple: 'text-purple-600 bg-purple-100',
    amber: 'text-amber-600 bg-amber-100',
  };

  return (
    <div>
      <PageHeader title="Bundles & Fan Tiers" description="Manage subscription tiers and fan bundles" actions={<Button variant="primary" onClick={() => { setFormTierName(''); setFormPrice(''); setFormBilling('monthly'); setFormPerks(''); setFormLinkedSub(''); setShowModal(true); }}><Plus size={16} />Add Tier</Button>} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {fanTiers.map(tier => (
          <Card key={tier.id} className={`overflow-hidden border-2 ${colorMap[tier.color]}`}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${iconColorMap[tier.color]}`}>{tier.icon}</div>
                <Badge color={tier.color as 'teal' | 'purple' | 'amber'} size="sm">{tier.billingCycle}</Badge>
              </div>
              <h3 className="text-lg font-semibold text-neutral-900">{tier.name}</h3>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-3xl font-bold text-neutral-900">${tier.price.toFixed(2)}</span>
                <span className="text-sm text-neutral-500">/mo</span>
              </div>
              <div className="mt-4 space-y-2">
                {tier.perks.map((perk, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-neutral-600">
                    <CheckCircle2 size={14} className="text-green-500 mt-0.5 flex-shrink-0" />
                    <span>{perk}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-neutral-100">
                <p className="text-xs text-neutral-400 flex items-center gap-1"><Link2 size={12} />Linked: {tier.linkedSub}</p>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <Button variant="secondary" size="sm" className="flex-1"><Edit3 size={14} />Edit</Button>
                <Button variant="ghost" size="sm"><Trash2 size={14} className="text-red-500" /></Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
      <Modal open={showModal} onClose={() => setShowModal(false)} title="Add Fan Tier" size="lg" footer={<><Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button><Button variant="primary" onClick={() => { toast.success('Fan tier created'); setShowModal(false); }}><Save size={14} />Create</Button></>}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Tier Name" required><Input value={formTierName} onChange={e => setFormTierName(e.target.value)} placeholder="e.g. Core" /></Field>
            <Field label="Price" required><Input type="number" step="0.01" value={formPrice} onChange={e => setFormPrice(e.target.value)} placeholder="9.99" /></Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Billing Cycle"><Select value={formBilling} onChange={e => setFormBilling(e.target.value)}><option value="monthly">Monthly</option><option value="quarterly">Quarterly</option><option value="yearly">Yearly</option></Select></Field>
            <Field label="Linked Subscription"><Input value={formLinkedSub} onChange={e => setFormLinkedSub(e.target.value)} placeholder="Direct-to-Fan tier name" /></Field>
          </div>
          <Field label="Included Perks" hint="One perk per line"><Textarea value={formPerks} onChange={e => setFormPerks(e.target.value)} placeholder={"Exclusive content\nEarly access\nMerch discount"} rows={4} /></Field>
        </div>
      </Modal>
    </div>
  );
}

// ============ SHOP INVENTORY PAGE ============
function AdminShopInventoryPage() {
  const [showModal, setShowModal] = useState(false);
  const [formSku, setFormSku] = useState('');
  const [formProduct, setFormProduct] = useState('');
  const [formQty, setFormQty] = useState('');
  const [formThreshold, setFormThreshold] = useState('');
  const [formWarehouse, setFormWarehouse] = useState('');

  const inventory = [
    { id: 1, sku: 'LVE-VNYL-001', product: 'Luna Vega "Midnight Echoes" — Vinyl LP', qtyOnHand: 248, reorderThreshold: 50, warehouse: 'LA Warehouse', image: 'https://placehold.co/40x40/1a1a2e/eee?text=LV' },
    { id: 2, sku: 'LVE-CD-001', product: 'Luna Vega "Midnight Echoes" — CD', qtyOnHand: 512, reorderThreshold: 100, warehouse: 'LA Warehouse', image: 'https://placehold.co/40x40/1a1a2e/eee?text=CD' },
    { id: 3, sku: 'NW-TSH-001', product: 'Neon Waves Tour 2025 — Graphic Tee', qtyOnHand: 18, reorderThreshold: 30, warehouse: 'NY Warehouse', image: 'https://placehold.co/40x40/0f3460/eee?text=NW' },
    { id: 4, sku: 'KH-EP-001', product: 'Kai Horizon EP — Digital Bundle', qtyOnHand: 9999, reorderThreshold: 0, warehouse: 'Digital', image: 'https://placehold.co/40x40/16213e/eee?text=KH' },
    { id: 5, sku: 'ZM-HOD-001', product: 'Zara Moon — Embroidered Hoodie', qtyOnHand: 8, reorderThreshold: 20, warehouse: 'LA Warehouse', image: 'https://placehold.co/40x40/1a1a2e/eee?text=ZM' },
    { id: 6, sku: 'VL-POST-001', product: 'The Velvet Lines — Limited Tour Poster', qtyOnHand: 42, reorderThreshold: 25, warehouse: 'NY Warehouse', image: 'https://placehold.co/40x40/0f3460/eee?text=VL' },
    { id: 7, sku: 'LVE-HAT-001', product: 'Luna Vega — Logo Dad Hat', qtyOnHand: 5, reorderThreshold: 15, warehouse: 'LA Warehouse', image: 'https://placehold.co/40x40/16213e/eee?text=Hat' },
    { id: 8, sku: 'NW-VNYL-001', product: 'Neon Waves "Electric Dusk" — Colored Vinyl', qtyOnHand: 64, reorderThreshold: 30, warehouse: 'NY Warehouse', image: 'https://placehold.co/40x40/1a1a2e/eee?text=NV' },
  ];

  const lowStock = inventory.filter(i => i.qtyOnHand <= i.reorderThreshold && i.reorderThreshold > 0);
  const totalItems = inventory.length;

  return (
    <div>
      <PageHeader title="Inventory" description="Track and manage product inventory" actions={<Button variant="primary" onClick={() => { setFormSku(''); setFormProduct(''); setFormQty(''); setFormThreshold(''); setFormWarehouse(''); setShowModal(true); }}><Plus size={16} />Add Item</Button>} />
      {lowStock.length > 0 && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
          <AlertTriangle size={16} className="text-amber-600 flex-shrink-0" />
          <span className="text-sm text-amber-800">{lowStock.length} item{lowStock.length > 1 ? 's' : ''} below reorder threshold — {lowStock.map(i => i.sku).join(', ')}</span>
        </div>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
        <StatCard label="Total SKUs" value={totalItems} icon={<Package size={18} />} />
        <StatCard label="In Stock" value={inventory.filter(i => i.qtyOnHand > i.reorderThreshold || i.reorderThreshold === 0).length} icon={<CheckCircle2 size={18} />} />
        <StatCard label="Low Stock" value={lowStock.length} icon={<AlertTriangle size={18} />} />
        <StatCard label="Digital" value={inventory.filter(i => i.warehouse === 'Digital').length} icon={<Disc3 size={18} />} />
      </div>
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-100 bg-neutral-50/60">
                <th className="text-left px-4 py-3 font-medium text-neutral-500">SKU</th>
                <th className="text-left px-4 py-3 font-medium text-neutral-500">Product</th>
                <th className="text-right px-4 py-3 font-medium text-neutral-500">Qty on Hand</th>
                <th className="text-right px-4 py-3 font-medium text-neutral-500">Reorder At</th>
                <th className="text-left px-4 py-3 font-medium text-neutral-500">Warehouse</th>
                <th className="text-left px-4 py-3 font-medium text-neutral-500">Status</th>
                <th className="text-right px-4 py-3 font-medium text-neutral-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map(item => {
                const isLow = item.qtyOnHand <= item.reorderThreshold && item.reorderThreshold > 0;
                return (
                  <tr key={item.id} className={`border-b border-neutral-50 transition-colors ${isLow ? 'bg-red-50/50' : 'hover:bg-neutral-50/50'}`}>
                    <td className="px-4 py-3 font-mono text-xs text-neutral-600">{item.sku}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img src={item.image} alt="" className="w-8 h-8 rounded object-cover flex-shrink-0" />
                        <span className="font-medium text-neutral-900 truncate max-w-[240px]">{item.product}</span>
                      </div>
                    </td>
                    <td className={`px-4 py-3 text-right font-semibold ${isLow ? 'text-red-600' : 'text-neutral-900'}`}>{item.qtyOnHand.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right text-neutral-500">{item.reorderThreshold || '—'}</td>
                    <td className="px-4 py-3 text-neutral-600 flex items-center gap-1"><Warehouse size={12} className="text-neutral-400" />{item.warehouse}</td>
                    <td className="px-4 py-3">
                      {isLow ? <Badge color="red" size="sm">Low Stock</Badge> : item.warehouse === 'Digital' ? <Badge color="teal" size="sm">Unlimited</Badge> : <Badge color="green" size="sm">In Stock</Badge>}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="sm"><Edit3 size={14} /></Button>
                        <Button variant="ghost" size="sm"><Trash2 size={14} className="text-red-500" /></Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
      <Modal open={showModal} onClose={() => setShowModal(false)} title="Add Inventory Item" size="lg" footer={<><Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button><Button variant="primary" onClick={() => { toast.success('Item added'); setShowModal(false); }}><Save size={14} />Add</Button></>}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Field label="SKU" required><Input value={formSku} onChange={e => setFormSku(e.target.value)} placeholder="ABC-XXX-001" /></Field>
            <Field label="Product Name" required><Input value={formProduct} onChange={e => setFormProduct(e.target.value)} placeholder="Product name" /></Field>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <Field label="Quantity on Hand" required><Input type="number" value={formQty} onChange={e => setFormQty(e.target.value)} placeholder="0" /></Field>
            <Field label="Reorder Threshold"><Input type="number" value={formThreshold} onChange={e => setFormThreshold(e.target.value)} placeholder="0" /></Field>
            <Field label="Warehouse / Location"><Select value={formWarehouse} onChange={e => setFormWarehouse(e.target.value)}><option value="">Select...</option><option value="LA Warehouse">LA Warehouse</option><option value="NY Warehouse">NY Warehouse</option><option value="Digital">Digital</option></Select></Field>
          </div>
        </div>
      </Modal>
    </div>
  );
}

// ============ SHOP STOREFRONT SETTINGS PAGE ============
function AdminShopSettingsPage() {
  const [paymentKey, setPaymentKey] = useState('sk_live_••••••••••••4242');
  const [paymentWebhook, setPaymentWebhook] = useState('https://api.label.com/webhooks/stripe');
  const [shippingZones, setShippingZones] = useState([
    { id: 1, zone: 'US Domestic', method: 'Standard', rate: '$5.99', freeAbove: '$75' },
    { id: 2, zone: 'US Domestic', method: 'Express', rate: '$12.99', freeAbove: '—' },
    { id: 3, zone: 'Canada', method: 'Standard', rate: '$9.99', freeAbove: '$100' },
    { id: 4, zone: 'EU / UK', method: 'Standard', rate: '$14.99', freeAbove: '$150' },
    { id: 5, zone: 'Rest of World', method: 'Standard', rate: '$19.99', freeAbove: '—' },
  ]);
  const [taxRate, setTaxRate] = useState('7.25');
  const [taxMode, setTaxMode] = useState('origin');
  const [taxExempt, setTaxExempt] = useState('digital');
  const [currency, setCurrency] = useState('USD');
  const [newZoneName, setNewZoneName] = useState('');
  const [newZoneRate, setNewZoneRate] = useState('');
  const [showZoneModal, setShowZoneModal] = useState(false);

  return (
    <div>
      <PageHeader title="Storefront Settings" description="Configure payment, shipping, tax, and currency settings" />
      <div className="space-y-6">
        {/* Payment Processor */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-neutral-100"><CreditCard size={18} className="text-neutral-600" /></div>
            <div>
              <h3 className="text-sm font-semibold text-neutral-900">Payment Processor</h3>
              <p className="text-xs text-neutral-500">Stripe integration and webhook configuration</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Stripe Secret Key" hint="Live key for payment processing"><Input value={paymentKey} onChange={e => setPaymentKey(e.target.value)} type="password" /></Field>
              <Field label="Webhook Endpoint"><Input value={paymentWebhook} onChange={e => setPaymentWebhook(e.target.value)} /></Field>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={14} className="text-green-500" />
              <span className="text-xs text-green-700 font-medium">Stripe connected — live mode</span>
            </div>
          </div>
        </Card>

        {/* Shipping Zones & Rates */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-neutral-100"><Truck size={18} className="text-neutral-600" /></div>
              <div>
                <h3 className="text-sm font-semibold text-neutral-900">Shipping Zones & Rates</h3>
                <p className="text-xs text-neutral-500">Configure shipping methods and rates per zone</p>
              </div>
            </div>
            <Button variant="secondary" size="sm" onClick={() => { setNewZoneName(''); setNewZoneRate(''); setShowZoneModal(true); }}><Plus size={14} />Add Zone</Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-100">
                  <th className="text-left py-2 pr-4 font-medium text-neutral-500">Zone</th>
                  <th className="text-left py-2 pr-4 font-medium text-neutral-500">Method</th>
                  <th className="text-left py-2 pr-4 font-medium text-neutral-500">Rate</th>
                  <th className="text-left py-2 pr-4 font-medium text-neutral-500">Free Above</th>
                  <th className="text-right py-2 font-medium text-neutral-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {shippingZones.map(zone => (
                  <tr key={zone.id} className="border-b border-neutral-50">
                    <td className="py-2 pr-4 font-medium text-neutral-900">{zone.zone}</td>
                    <td className="py-2 pr-4 text-neutral-600">{zone.method}</td>
                    <td className="py-2 pr-4 text-neutral-900">{zone.rate}</td>
                    <td className="py-2 pr-4 text-neutral-500">{zone.freeAbove}</td>
                    <td className="py-2 text-right"><Button variant="ghost" size="sm"><Edit3 size={14} /></Button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Tax Settings */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-neutral-100"><FileText size={18} className="text-neutral-600" /></div>
            <div>
              <h3 className="text-sm font-semibold text-neutral-900">Tax Settings</h3>
              <p className="text-xs text-neutral-500">Sales tax calculation and exemptions</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Field label="Default Tax Rate (%)" hint="Applied when origin-based"><Input type="number" step="0.01" value={taxRate} onChange={e => setTaxRate(e.target.value)} /></Field>
              <Field label="Tax Calculation Mode"><Select value={taxMode} onChange={e => setTaxMode(e.target.value)}><option value="origin">Origin-based</option><option value="destination">Destination-based</option><option value="auto">Auto (TaxJar)</option></Select></Field>
              <Field label="Tax-Exempt Categories"><Select value={taxExempt} onChange={e => setTaxExempt(e.target.value)}><option value="digital">Digital products only</option><option value="none">None</option><option value="all">All products</option></Select></Field>
            </div>
          </div>
        </Card>

        {/* Currency */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-neutral-100"><DollarSign size={18} className="text-neutral-600" /></div>
            <div>
              <h3 className="text-sm font-semibold text-neutral-900">Currency</h3>
              <p className="text-xs text-neutral-500">Default store currency and display format</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Store Currency"><Select value={currency} onChange={e => setCurrency(e.target.value)}><option value="USD">USD — US Dollar ($)</option><option value="EUR">EUR — Euro (€)</option><option value="GBP">GBP — British Pound (£)</option><option value="CAD">CAD — Canadian Dollar (C$)</option><option value="AUD">AUD — Australian Dollar (A$)</option></Select></Field>
            <Field label="Display Format"><Select value="symbol"><option value="symbol">$1,234.56</option><option value="code">USD 1,234.56</option></Select></Field>
          </div>
        </Card>

        {/* Save */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button variant="secondary">Reset to Defaults</Button>
          <Button variant="primary" onClick={() => toast.success('Settings saved')}><Save size={14} />Save Settings</Button>
        </div>
      </div>
      <Modal open={showZoneModal} onClose={() => setShowZoneModal(false)} title="Add Shipping Zone" size="md" footer={<><Button variant="secondary" onClick={() => setShowZoneModal(false)}>Cancel</Button><Button variant="primary" onClick={() => { toast.success('Shipping zone added'); setShowZoneModal(false); }}><Save size={14} />Add</Button></>}>
        <div className="space-y-4">
          <Field label="Zone Name" required><Input value={newZoneName} onChange={e => setNewZoneName(e.target.value)} placeholder="e.g. US Domestic" /></Field>
          <Field label="Standard Rate" required><Input value={newZoneRate} onChange={e => setNewZoneRate(e.target.value)} placeholder="$5.99" /></Field>
        </div>
      </Modal>
    </div>
  );
}

function AdminDiscographyReleasesPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedRelease, setSelectedRelease] = useState<string | null>(null);
  const [releases] = useState([
    { id: '1', title: 'Midnight Echoes', type: 'Album', artist: 'Adea Lyric', releaseDate: '2025-03-14', upc: '012345678905', coverArt: 'https://picsum.photos/seed/midnight-echoes/80/80', status: 'live' },
    { id: '2', title: 'Urban Frequencies', type: 'EP', artist: 'Adea Lyric', releaseDate: '2025-06-20', upc: '012345678912', coverArt: 'https://picsum.photos/seed/urban-freq/80/80', status: 'in_review' },
    { id: '3', title: 'Neon Dreams', type: 'Single', artist: 'Adea Lyric', releaseDate: '2025-08-01', upc: '012345678929', coverArt: 'https://picsum.photos/seed/neon-dreams/80/80', status: 'draft' },
    { id: '4', title: 'Velvet Horizons', type: 'Album', artist: 'Marcus Cole', releaseDate: '2025-04-22', upc: '098765432101', coverArt: 'https://picsum.photos/seed/velvet-hor/80/80', status: 'live' },
    { id: '5', title: 'Afterglow', type: 'Single', artist: 'Marcus Cole', releaseDate: '2025-07-15', upc: '098765432118', coverArt: 'https://picsum.photos/seed/afterglow/80/80', status: 'in_review' },
    { id: '6', title: 'Solstice', type: 'EP', artist: 'The Velvet Strings', releaseDate: '2025-09-10', upc: '098765432125', coverArt: 'https://picsum.photos/seed/solstice/80/80', status: 'draft' },
  ]);
  const statusGroups = ['live', 'in_review', 'draft'] as const;
  const statusLabels: Record<string, string> = { live: 'Live', in_review: 'In Review', draft: 'Draft' };
  const statusColors: Record<string, 'green' | 'amber' | 'gray'> = { live: 'green', in_review: 'amber', draft: 'gray' };

  return (
    <div>
      <PageHeader title="Releases" description="Manage album and single releases" actions={<Button variant="primary" onClick={() => setShowAddModal(true)}><Plus size={16} /> New Release</Button>} />
      {statusGroups.map((status) => {
        const group = releases.filter((r) => r.status === status);
        if (group.length === 0) return null;
        return (
          <div key={status} className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <StatusBadge status={status} />
              <span className="text-sm text-neutral-500">{group.length} release{group.length !== 1 ? 's' : ''}</span>
            </div>
            <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-neutral-100 bg-neutral-50/50">
                    <th className="text-left px-4 py-3 text-xs font-medium text-neutral-500 uppercase tracking-wider w-16"></th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-neutral-500 uppercase tracking-wider">Title</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-neutral-500 uppercase tracking-wider">Type</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-neutral-500 uppercase tracking-wider">Artist</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-neutral-500 uppercase tracking-wider">Release Date</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-neutral-500 uppercase tracking-wider">UPC</th>
                    <th className="text-right px-4 py-3 text-xs font-medium text-neutral-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {group.map((r) => (
                    <tr key={r.id} className="hover:bg-neutral-50/50 cursor-pointer" onClick={() => setSelectedRelease(r.id)}>
                      <td className="px-4 py-3"><img src={r.coverArt} alt={r.title} className="w-10 h-10 rounded-lg object-cover" /></td>
                      <td className="px-4 py-3 text-sm font-medium text-neutral-900">{r.title}</td>
                      <td className="px-4 py-3"><Badge color={r.type === 'Album' ? 'purple' : r.type === 'EP' ? 'teal' : 'blue'} size="sm">{r.type}</Badge></td>
                      <td className="px-4 py-3 text-sm text-neutral-600">{r.artist}</td>
                      <td className="px-4 py-3 text-sm text-neutral-600">{r.releaseDate}</td>
                      <td className="px-4 py-3 text-sm text-neutral-400 font-mono">{r.upc}</td>
                      <td className="px-4 py-3 text-right">
                        <button className="text-neutral-400 hover:text-neutral-600 p-1"><Edit3 size={14} /></button>
                        <button className="text-neutral-400 hover:text-neutral-600 p-1 ml-1"><MoreHorizontal size={14} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}
      <Modal open={showAddModal} onClose={() => setShowAddModal(false)} title="New Release" size="lg" footer={<><Button variant="secondary" onClick={() => setShowAddModal(false)}>Cancel</Button><Button variant="primary" onClick={() => { toast.success('Release created'); setShowAddModal(false); }}>Create Release</Button></>}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Title" required><Input placeholder="Enter release title" /></Field>
          <Field label="Type" required><Select><option value="">Select type</option><option>Album</option><option>EP</option><option>Single</option></Select></Field>
          <Field label="Artist" required><Input placeholder="Artist name" /></Field>
          <Field label="Release Date" required><Input type="date" /></Field>
          <Field label="UPC"><Input placeholder="Universal Product Code" /></Field>
          <Field label="Cover Art"><div className="flex items-center gap-3"><Button variant="secondary" size="sm"><Upload size={14} /> Upload</Button><span className="text-xs text-neutral-400">JPG, PNG up to 10MB</span></div></Field>
          <Field label="Status" required><Select><option value="draft">Draft</option><option value="in_review">In Review</option><option value="live">Live</option></Select></Field>
        </div>
      </Modal>
    </div>
  );
}

function AdminDiscographyTracksPage() {
  const [selectedRelease, setSelectedRelease] = useState<string>('1');
  const [showAddTrackModal, setShowAddTrackModal] = useState(false);
  const releases = [
    { id: '1', title: 'Midnight Echoes', type: 'Album', artist: 'Adea Lyric', coverArt: 'https://picsum.photos/seed/midnight-echoes/80/80' },
    { id: '2', title: 'Urban Frequencies', type: 'EP', artist: 'Adea Lyric', coverArt: 'https://picsum.photos/seed/urban-freq/80/80' },
    { id: '3', title: 'Neon Dreams', type: 'Single', artist: 'Adea Lyric', coverArt: 'https://picsum.photos/seed/neon-dreams/80/80' },
    { id: '4', title: 'Velvet Horizons', type: 'Album', artist: 'Marcus Cole', coverArt: 'https://picsum.photos/seed/velvet-hor/80/80' },
  ];
  const tracksByRelease: Record<string, Array<{ id: string; title: string; isrc: string; duration: string; bpm: number; key: string; explicit: boolean; aiAssisted: boolean; trackNumber: number }>> = {
    '1': [
      { id: 't1', title: 'Midnight Overture', isrc: 'USRC12300001', duration: '4:32', bpm: 92, key: 'C minor', explicit: false, aiAssisted: false, trackNumber: 1 },
      { id: 't2', title: 'Echoes in the Dark', isrc: 'USRC12300002', duration: '3:47', bpm: 110, key: 'A♭ major', explicit: true, aiAssisted: false, trackNumber: 2 },
      { id: 't3', title: 'Silhouette Dance', isrc: 'USRC12300003', duration: '5:01', bpm: 88, key: 'E♭ minor', explicit: false, aiAssisted: true, trackNumber: 3 },
      { id: 't4', title: 'Velvet Nightfall', isrc: 'USRC12300004', duration: '4:15', bpm: 96, key: 'B♭ major', explicit: false, aiAssisted: false, trackNumber: 4 },
      { id: 't5', title: 'Resonance', isrc: 'USRC12300005', duration: '3:58', bpm: 104, key: 'F minor', explicit: true, aiAssisted: true, trackNumber: 5 },
    ],
    '2': [
      { id: 't6', title: 'City Pulse', isrc: 'USRC12300006', duration: '3:22', bpm: 118, key: 'G major', explicit: false, aiAssisted: false, trackNumber: 1 },
      { id: 't7', title: 'Frequency Shift', isrc: 'USRC12300007', duration: '4:10', bpm: 125, key: 'D minor', explicit: false, aiAssisted: true, trackNumber: 2 },
      { id: 't8', title: 'Neon Streets', isrc: 'USRC12300008', duration: '3:45', bpm: 132, key: 'A major', explicit: true, aiAssisted: false, trackNumber: 3 },
    ],
    '3': [
      { id: 't9', title: 'Neon Dreams', isrc: 'USRC12300009', duration: '3:18', bpm: 120, key: 'C major', explicit: false, aiAssisted: false, trackNumber: 1 },
    ],
    '4': [
      { id: 't10', title: 'Velvet Sunrise', isrc: 'USRC12400001', duration: '4:28', bpm: 85, key: 'D♭ major', explicit: false, aiAssisted: false, trackNumber: 1 },
      { id: 't11', title: 'Horizon Line', isrc: 'USRC12400002', duration: '5:12', bpm: 78, key: 'F minor', explicit: false, aiAssisted: true, trackNumber: 2 },
      { id: 't12', title: 'Golden Hour', isrc: 'USRC12400003', duration: '3:55', bpm: 95, key: 'A♭ major', explicit: true, aiAssisted: false, trackNumber: 3 },
    ],
  };
  const activeRelease = releases.find((r) => r.id === selectedRelease);
  const activeTracks = tracksByRelease[selectedRelease] || [];

  return (
    <div>
      <PageHeader title="Tracks" description="Manage individual track metadata within releases" actions={<Button variant="primary" onClick={() => setShowAddTrackModal(true)}><Plus size={16} /> Add Track</Button>} />
      <div className="flex flex-col md:flex-row gap-6">
        {/* Release selector sidebar */}
        <div className="md:w-64 shrink-0">
          <h3 className="text-sm font-semibold text-neutral-500 uppercase tracking-wider mb-3">Releases</h3>
          <div className="space-y-2">
            {releases.map((r) => (
              <button key={r.id} onClick={() => setSelectedRelease(r.id)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${selectedRelease === r.id ? 'bg-neutral-100 border border-neutral-200' : 'hover:bg-neutral-50'}`}>
                <img src={r.coverArt} alt={r.title} className="w-8 h-8 rounded object-cover" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-neutral-900 truncate">{r.title}</p>
                  <p className="text-xs text-neutral-400">{r.type} · {r.artist}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
        {/* Track list for selected release */}
        <div className="flex-1 min-w-0">
          {activeRelease && (
            <div className="mb-4 flex items-center gap-3">
              <img src={activeRelease.coverArt} alt={activeRelease.title} className="w-12 h-12 rounded-lg object-cover" />
              <div>
                <h2 className="text-lg font-semibold text-neutral-900">{activeRelease.title}</h2>
                <p className="text-sm text-neutral-500">{activeRelease.type} by {activeRelease.artist} · {activeTracks.length} tracks</p>
              </div>
            </div>
          )}
          <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-100 bg-neutral-50/50">
                  <th className="text-left px-4 py-3 text-xs font-medium text-neutral-500 uppercase tracking-wider w-10">#</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-neutral-500 uppercase tracking-wider">Title</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-neutral-500 uppercase tracking-wider">ISRC</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-neutral-500 uppercase tracking-wider">Duration</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-neutral-500 uppercase tracking-wider">BPM</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-neutral-500 uppercase tracking-wider">Key</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-neutral-500 uppercase tracking-wider">Flags</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-neutral-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {activeTracks.map((t) => (
                  <tr key={t.id} className="hover:bg-neutral-50/50">
                    <td className="px-4 py-3 text-sm text-neutral-400">{t.trackNumber}</td>
                    <td className="px-4 py-3 text-sm font-medium text-neutral-900">{t.title}</td>
                    <td className="px-4 py-3 text-sm text-neutral-400 font-mono">{t.isrc}</td>
                    <td className="px-4 py-3 text-sm text-neutral-600">{t.duration}</td>
                    <td className="px-4 py-3 text-sm text-neutral-600">{t.bpm}</td>
                    <td className="px-4 py-3 text-sm text-neutral-600">{t.key}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        {t.explicit && <Badge color="red" size="sm">Explicit</Badge>}
                        {t.aiAssisted && <Badge color="purple" size="sm">AI</Badge>}
                        {!t.explicit && !t.aiAssisted && <span className="text-xs text-neutral-400">—</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button className="text-neutral-400 hover:text-neutral-600 p-1"><Edit3 size={14} /></button>
                      <button className="text-neutral-400 hover:text-neutral-600 p-1 ml-1"><Trash2 size={14} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Modal open={showAddTrackModal} onClose={() => setShowAddTrackModal(false)} title="Add Track" size="lg" footer={<><Button variant="secondary" onClick={() => setShowAddTrackModal(false)}>Cancel</Button><Button variant="primary" onClick={() => { toast.success('Track added'); setShowAddTrackModal(false); }}>Add Track</Button></>}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Title" required><Input placeholder="Track title" /></Field>
          <Field label="ISRC" required><Input placeholder="e.g. USRC12300001" /></Field>
          <Field label="Duration" hint="Format: MM:SS"><Input placeholder="e.g. 3:45" /></Field>
          <Field label="BPM"><Input type="number" placeholder="e.g. 120" /></Field>
          <Field label="Key"><Input placeholder="e.g. C minor" /></Field>
          <Field label="Track Number"><Input type="number" placeholder="1" /></Field>
          <Field label="Explicit"><Select><option value="no">No</option><option value="yes">Yes</option></Select></Field>
          <Field label="AI-Assisted"><Select><option value="no">No</option><option value="yes">Yes</option></Select></Field>
        </div>
      </Modal>
    </div>
  );
}

function AdminDiscographyCreditsPage() {
  const [selectedTrack, setSelectedTrack] = useState<string>('t1');
  const [showAddCreditModal, setShowAddCreditModal] = useState(false);
  const tracks = [
    { id: 't1', title: 'Midnight Overture', release: 'Midnight Echoes' },
    { id: 't2', title: 'Echoes in the Dark', release: 'Midnight Echoes' },
    { id: 't3', title: 'Silhouette Dance', release: 'Midnight Echoes' },
    { id: 't6', title: 'City Pulse', release: 'Urban Frequencies' },
    { id: 't9', title: 'Neon Dreams', release: 'Neon Dreams' },
  ];
  const creditsByTrack: Record<string, Array<{ id: string; contributor: string; role: string; splitPct: number; proAffiliation: string }>> = {
    't1': [
      { id: 'c1', contributor: 'Adea Lyric', role: 'Writer', splitPct: 50, proAffiliation: 'ASCAP' },
      { id: 'c2', contributor: 'James Rivera', role: 'Writer', splitPct: 25, proAffiliation: 'BMI' },
      { id: 'c3', contributor: 'Adea Lyric', role: 'Producer', splitPct: 15, proAffiliation: 'ASCAP' },
      { id: 'c4', contributor: 'Studio 54 Publishing', role: 'Publisher', splitPct: 10, proAffiliation: 'SESAC' },
    ],
    't2': [
      { id: 'c5', contributor: 'Adea Lyric', role: 'Writer', splitPct: 40, proAffiliation: 'ASCAP' },
      { id: 'c6', contributor: 'Marcus Cole', role: 'Writer', splitPct: 30, proAffiliation: 'BMI' },
      { id: 'c7', contributor: 'DJ Onyx', role: 'Producer', splitPct: 20, proAffiliation: 'ASCAP' },
      { id: 'c8', contributor: 'Studio 54 Publishing', role: 'Publisher', splitPct: 10, proAffiliation: 'SESAC' },
    ],
    't3': [
      { id: 'c9', contributor: 'Adea Lyric', role: 'Writer', splitPct: 60, proAffiliation: 'ASCAP' },
      { id: 'c10', contributor: 'Neural Beats', role: 'Producer (AI)', splitPct: 20, proAffiliation: '—' },
      { id: 'c11', contributor: 'Studio 54 Publishing', role: 'Publisher', splitPct: 20, proAffiliation: 'SESAC' },
    ],
    't6': [
      { id: 'c12', contributor: 'Adea Lyric', role: 'Writer', splitPct: 50, proAffiliation: 'ASCAP' },
      { id: 'c13', contributor: 'Kai Nakamura', role: 'Writer', splitPct: 25, proAffiliation: 'JASRAC' },
      { id: 'c14', contributor: 'Adea Lyric', role: 'Producer', splitPct: 15, proAffiliation: 'ASCAP' },
      { id: 'c15', contributor: 'Studio 54 Publishing', role: 'Publisher', splitPct: 10, proAffiliation: 'SESAC' },
    ],
    't9': [
      { id: 'c16', contributor: 'Adea Lyric', role: 'Writer', splitPct: 75, proAffiliation: 'ASCAP' },
      { id: 'c17', contributor: 'Adea Lyric', role: 'Producer', splitPct: 15, proAffiliation: 'ASCAP' },
      { id: 'c18', contributor: 'Studio 54 Publishing', role: 'Publisher', splitPct: 10, proAffiliation: 'SESAC' },
    ],
  };
  const activeTrack = tracks.find((t) => t.id === selectedTrack);
  const activeCredits = creditsByTrack[selectedTrack] || [];
  const totalSplit = activeCredits.reduce((sum, c) => sum + c.splitPct, 0);

  return (
    <div>
      <PageHeader title="Credits & Splits" description="Manage songwriter and performer credits with split sheets" actions={<Button variant="primary" onClick={() => setShowAddCreditModal(true)}><Plus size={16} /> Add Credit</Button>} />
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-72 shrink-0">
          <h3 className="text-sm font-semibold text-neutral-500 uppercase tracking-wider mb-3">Tracks</h3>
          <div className="space-y-1">
            {tracks.map((t) => (
              <button key={t.id} onClick={() => setSelectedTrack(t.id)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${selectedTrack === t.id ? 'bg-neutral-100 border border-neutral-200' : 'hover:bg-neutral-50'}`}>
                <Music2 size={16} className="text-neutral-400 shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-neutral-900 truncate">{t.title}</p>
                  <p className="text-xs text-neutral-400">{t.release}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          {activeTrack && (
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-neutral-900">{activeTrack.title}</h2>
                <p className="text-sm text-neutral-500">From {activeTrack.release}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-neutral-500">Total Split:</span>
                <Badge color={totalSplit === 100 ? 'green' : 'red'} size="md">{totalSplit}%</Badge>
              </div>
            </div>
          )}
          {/* Split Sheet */}
          <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
            <div className="px-4 py-3 border-b border-neutral-100 bg-neutral-50/50">
              <h3 className="text-sm font-semibold text-neutral-700">Split Sheet</h3>
            </div>
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-100">
                  <th className="text-left px-4 py-3 text-xs font-medium text-neutral-500 uppercase tracking-wider">Contributor</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-neutral-500 uppercase tracking-wider">Role</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-neutral-500 uppercase tracking-wider">Split %</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-neutral-500 uppercase tracking-wider">PRO</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-neutral-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {activeCredits.map((c) => (
                  <tr key={c.id} className="hover:bg-neutral-50/50 group">
                    <td className="px-4 py-3 text-sm font-medium text-neutral-900">{c.contributor}</td>
                    <td className="px-4 py-3"><Badge color={c.role === 'Writer' ? 'blue' : c.role === 'Producer' ? 'teal' : c.role.includes('AI') ? 'purple' : 'gray'} size="sm">{c.role}</Badge></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-neutral-100 rounded-full h-2"><div className="bg-neutral-900 rounded-full h-2" style={{ width: `${c.splitPct}%` }} /></div>
                        <span className="text-sm font-medium text-neutral-700">{c.splitPct}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-neutral-600">{c.proAffiliation}</td>
                    <td className="px-4 py-3 text-right">
                      <button className="text-neutral-400 hover:text-neutral-600 p-1"><Edit3 size={14} /></button>
                      <button className="text-neutral-400 hover:text-neutral-600 p-1 ml-1"><Trash2 size={14} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t border-neutral-200 bg-neutral-50/50">
                  <td className="px-4 py-3 text-sm font-semibold text-neutral-700">Total</td>
                  <td></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-neutral-100 rounded-full h-2"><div className={`rounded-full h-2 ${totalSplit === 100 ? 'bg-green-500' : 'bg-red-500'}`} style={{ width: `${Math.min(totalSplit, 100)}%` }} /></div>
                      <span className={`text-sm font-semibold ${totalSplit === 100 ? 'text-green-600' : 'text-red-600'}`}>{totalSplit}%</span>
                    </div>
                  </td>
                  <td></td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
          {totalSplit !== 100 && (
            <div className="mt-3 flex items-center gap-2 text-amber-600 text-sm">
              <AlertTriangle size={16} />
              <span>Splits must total 100%. Currently {totalSplit}% — adjust before submitting.</span>
            </div>
          )}
        </div>
      </div>
      <Modal open={showAddCreditModal} onClose={() => setShowAddCreditModal(false)} title="Add Credit" size="md" footer={<><Button variant="secondary" onClick={() => setShowAddCreditModal(false)}>Cancel</Button><Button variant="primary" onClick={() => { toast.success('Credit added'); setShowAddCreditModal(false); }}>Add Credit</Button></>}>
        <div className="space-y-4">
          <Field label="Contributor Name" required><Input placeholder="Full name" /></Field>
          <Field label="Role" required><Select><option value="">Select role</option><option>Writer</option><option>Composer</option><option>Producer</option><option>Producer (AI)</option><option>Publisher</option><option>Performer</option></Select></Field>
          <Field label="Split Percentage" required hint="Must total 100% across all credits"><Input type="number" placeholder="e.g. 25" /></Field>
          <Field label="PRO Affiliation"><Select><option value="">Select PRO</option><option>ASCAP</option><option>BMI</option><option>SESAC</option><option>GMR</option><option>JASRAC</option><option>Other</option></Select></Field>
        </div>
      </Modal>
    </div>
  );
}

function AdminDiscographyMetadataPage() {
  const [selectedRelease, setSelectedRelease] = useState<string>('1');
  const [showValidation, setShowValidation] = useState(false);
  const releases = [
    { id: '1', title: 'Midnight Echoes', type: 'Album', artist: 'Adea Lyric', coverArt: 'https://picsum.photos/seed/midnight-echoes/80/80' },
    { id: '2', title: 'Urban Frequencies', type: 'EP', artist: 'Adea Lyric', coverArt: 'https://picsum.photos/seed/urban-freq/80/80' },
    { id: '3', title: 'Neon Dreams', type: 'Single', artist: 'Adea Lyric', coverArt: 'https://picsum.photos/seed/neon-dreams/80/80' },
  ];
  const metadataByRelease: Record<string, {
    cLine: string; pLine: string; genre: string; subGenre: string; language: string; labelName: string;
    copyrightHolder: string; copyrightYear: string; publisher: string; distributor: string;
    artworkStatus: string; artworkResolution: string; artworkFormat: string;
    distributionStatus: string; validationScore: number; issues: string[];
  }> = {
    '1': {
      cLine: '2025 Studio 54 Records', pLine: '2025 Studio 54 Records', genre: 'R&B/Soul', subGenre: 'Alternative R&B',
      language: 'English', labelName: 'Studio 54 Records', copyrightHolder: 'Adea Lyric / Studio 54 Records',
      copyrightYear: '2025', publisher: 'Studio 54 Publishing', distributor: 'DistroKid',
      artworkStatus: 'approved', artworkResolution: '3000×3000', artworkFormat: 'JPEG',
      distributionStatus: 'delivered', validationScore: 95, issues: [],
    },
    '2': {
      cLine: '2025 Studio 54 Records', pLine: '2025 Studio 54 Records', genre: 'Electronic', subGenre: 'Deep House',
      language: 'English', labelName: 'Studio 54 Records', copyrightHolder: 'Adea Lyric / Studio 54 Records',
      copyrightYear: '2025', publisher: 'Studio 54 Publishing', distributor: 'DistroKid',
      artworkStatus: 'pending_review', artworkResolution: '1500×1500', artworkFormat: 'PNG',
      distributionStatus: 'preparing', validationScore: 72, issues: ['Artwork resolution below minimum (3000×3000)', 'Missing sub-genre on track 2'],
    },
    '3': {
      cLine: '2025 Studio 54 Records', pLine: '2025 Studio 54 Records', genre: 'Pop', subGenre: 'Synth Pop',
      language: 'English', labelName: 'Studio 54 Records', copyrightHolder: 'Adea Lyric',
      copyrightYear: '2025', publisher: 'Studio 54 Publishing', distributor: 'DistroKid',
      artworkStatus: 'not_uploaded', artworkResolution: '—', artworkFormat: '—',
      distributionStatus: 'not_started', validationScore: 38, issues: ['No artwork uploaded', 'Missing C-Line', 'Missing P-Line', 'No tracks assigned', 'Genre not specified on all tracks'],
    },
  };
  const activeRelease = releases.find((r) => r.id === selectedRelease);
  const meta = metadataByRelease[selectedRelease];
  const artworkBadgeColor: Record<string, 'green' | 'amber' | 'red'> = { approved: 'green', pending_review: 'amber', not_uploaded: 'red' };
  const artworkLabel: Record<string, string> = { approved: 'Approved ✓', pending_review: 'Pending Review', not_uploaded: 'Not Uploaded' };

  return (
    <div>
      <PageHeader title="Metadata & Artwork" description="Manage release metadata and distribution readiness" actions={<Button variant="secondary" onClick={() => setShowValidation(!showValidation)}><FileCheck size={16} /> {showValidation ? 'Hide Validation' : 'Run Validation'}</Button>} />
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-64 shrink-0">
          <h3 className="text-sm font-semibold text-neutral-500 uppercase tracking-wider mb-3">Releases</h3>
          <div className="space-y-2">
            {releases.map((r) => (
              <button key={r.id} onClick={() => setSelectedRelease(r.id)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${selectedRelease === r.id ? 'bg-neutral-100 border border-neutral-200' : 'hover:bg-neutral-50'}`}>
                <img src={r.coverArt} alt={r.title} className="w-8 h-8 rounded object-cover" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-neutral-900 truncate">{r.title}</p>
                  <p className="text-xs text-neutral-400">{r.type}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          {activeRelease && meta && (
            <>
              <div className="flex items-center gap-3 mb-4">
                <img src={activeRelease.coverArt} alt={activeRelease.title} className="w-12 h-12 rounded-lg object-cover" />
                <div>
                  <h2 className="text-lg font-semibold text-neutral-900">{activeRelease.title}</h2>
                  <p className="text-sm text-neutral-500">{activeRelease.type} by {activeRelease.artist}</p>
                </div>
              </div>
              {/* Artwork Status */}
              <Card className="mb-6 p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-neutral-700">Artwork Status</h3>
                  <Badge color={artworkBadgeColor[meta.artworkStatus]} size="md">{artworkLabel[meta.artworkStatus]}</Badge>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                  <div><span className="text-neutral-500">Resolution:</span> <span className="text-neutral-900 font-medium ml-1">{meta.artworkResolution}</span></div>
                  <div><span className="text-neutral-500">Format:</span> <span className="text-neutral-900 font-medium ml-1">{meta.artworkFormat}</span></div>
                  <div>
                    <span className="text-neutral-500">Actions:</span>
                    {meta.artworkStatus === 'not_uploaded' ? (
                      <Button variant="secondary" size="sm" className="ml-2"><Upload size={14} /> Upload</Button>
                    ) : meta.artworkStatus === 'pending_review' ? (
                      <Button variant="secondary" size="sm" className="ml-2"><Eye size={14} /> Review</Button>
                    ) : (
                      <Button variant="ghost" size="sm" className="ml-2"><Eye size={14} /> View</Button>
                    )}
                  </div>
                </div>
              </Card>
              {/* Validation Score */}
              {showValidation && (
                <Card className="mb-6 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-neutral-700">Validation Score</h3>
                    <span className={`text-lg font-bold ${meta.validationScore >= 80 ? 'text-green-600' : meta.validationScore >= 50 ? 'text-amber-600' : 'text-red-600'}`}>{meta.validationScore}%</span>
                  </div>
                  <div className="w-full bg-neutral-100 rounded-full h-2 mb-3">
                    <div className={`rounded-full h-2 ${meta.validationScore >= 80 ? 'bg-green-500' : meta.validationScore >= 50 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${meta.validationScore}%` }} />
                  </div>
                  {meta.issues.length > 0 && (
                    <div className="space-y-2">
                      {meta.issues.map((issue, i) => (
                        <div key={i} className="flex items-start gap-2 text-sm">
                          <AlertCircle size={14} className="text-amber-500 mt-0.5 shrink-0" />
                          <span className="text-neutral-700">{issue}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {meta.issues.length === 0 && (
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <CheckCircle size={14} /> All validation checks passed
                    </div>
                  )}
                </Card>
              )}
              {/* Metadata Form */}
              <Card className="p-6">
                <h3 className="text-sm font-semibold text-neutral-700 mb-4">Release Metadata</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="C-Line" required><Input defaultValue={meta.cLine} /></Field>
                  <Field label="P-Line" required><Input defaultValue={meta.pLine} /></Field>
                  <Field label="Genre" required><Select defaultValue={meta.genre}><option>R&B/Soul</option><option>Pop</option><option>Electronic</option><option>Hip-Hop/Rap</option><option>Rock</option><option>Jazz</option><option>Country</option><option>Folk</option></Select></Field>
                  <Field label="Sub-Genre"><Input defaultValue={meta.subGenre} /></Field>
                  <Field label="Language" required><Select defaultValue={meta.language}><option>English</option><option>Spanish</option><option>French</option><option>Japanese</option><option>Portuguese</option><option>Korean</option></Select></Field>
                  <Field label="Label Name" required><Input defaultValue={meta.labelName} /></Field>
                  <Field label="Copyright Holder"><Input defaultValue={meta.copyrightHolder} /></Field>
                  <Field label="Copyright Year"><Input defaultValue={meta.copyrightYear} /></Field>
                  <Field label="Publisher"><Input defaultValue={meta.publisher} /></Field>
                  <Field label="Distributor"><Select defaultValue={meta.distributor}><option>DistroKid</option><option>CD Baby</option><option>TuneCore</option><option>AWAL</option><option>UnitedMasters</option></Select></Field>
                </div>
                <div className="mt-6 flex items-center gap-3">
                  <Button variant="primary" onClick={() => toast.success('Metadata saved')}>Save Metadata</Button>
                  <Button variant="secondary">Reset</Button>
                </div>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function AdminArtistsRosterPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [filterGenre, setFilterGenre] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [artists] = useState([
    { id: '1', name: 'Adea Lyric', photo: 'https://picsum.photos/seed/adea-lyric/200/200', genre: 'R&B/Soul', active: true, linkedAccounts: ['adea@studio54.com'], releases: 3 },
    { id: '2', name: 'Marcus Cole', photo: 'https://picsum.photos/seed/marcus-cole/200/200', genre: 'Jazz/Neo-Soul', active: true, linkedAccounts: ['marcus@studio54.com', 'marcus.cole@label.com'], releases: 2 },
    { id: '3', name: 'The Velvet Strings', photo: 'https://picsum.photos/seed/velvet-str/200/200', genre: 'Indie Folk', active: true, linkedAccounts: ['velvet@studio54.com'], releases: 1 },
    { id: '4', name: 'DJ Onyx', photo: 'https://picsum.photos/seed/dj-onyx/200/200', genre: 'Electronic', active: false, linkedAccounts: ['onyx@studio54.com'], releases: 4 },
    { id: '5', name: 'Kai Nakamura', photo: 'https://picsum.photos/seed/kai-naka/200/200', genre: 'Hip-Hop/Rap', active: true, linkedAccounts: ['kai@studio54.com'], releases: 0 },
    { id: '6', name: 'Luna Vega', photo: 'https://picsum.photos/seed/luna-vega/200/200', genre: 'Pop', active: true, linkedAccounts: ['luna@studio54.com'], releases: 1 },
  ]);
  const filtered = artists.filter((a) => {
    if (filterGenre !== 'all' && a.genre !== filterGenre) return false;
    if (filterStatus !== 'all' && (filterStatus === 'active' ? !a.active : a.active)) return false;
    return true;
  });
  const genres = [...new Set(artists.map((a) => a.genre))];

  return (
    <div>
      <PageHeader title="Roster" description="Manage your artist roster" actions={<Button variant="primary" onClick={() => setShowAddModal(true)}><Plus size={16} /> Add Artist</Button>} />
      <div className="flex items-center gap-3 mb-6">
        <Select value={filterGenre} onChange={(e) => setFilterGenre(e.target.value)} className="w-auto"><option value="all">All Genres</option>{genres.map((g) => <option key={g}>{g}</option>)}</Select>
        <Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="w-auto"><option value="all">All Status</option><option value="active">Active</option><option value="inactive">Inactive</option></Select>
        <span className="text-sm text-neutral-400">{filtered.length} artists</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((a) => (
          <Card key={a.id} className="p-0 cursor-pointer hover:shadow-md transition-shadow" onClick={() => toast.info(`Viewing ${a.name}`)}>
            <div className="flex items-start gap-4 p-6">
              <img src={a.photo} alt={a.name} className="w-16 h-16 rounded-xl object-cover shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-semibold text-neutral-900 truncate">{a.name}</h3>
                  {a.active ? <Badge color="green" size="sm">Active</Badge> : <Badge color="gray" size="sm">Inactive</Badge>}
                </div>
                <p className="text-sm text-neutral-500 mb-2">{a.genre}</p>
                <div className="flex items-center gap-2 text-xs text-neutral-400">
                  <Disc3 size={12} />
                  <span>{a.releases} releases</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-neutral-400 mt-1">
                  <Mail size={12} />
                  <span className="truncate">{a.linkedAccounts[0]}</span>
                  {a.linkedAccounts.length > 1 && <span>+{a.linkedAccounts.length - 1}</span>}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between px-6 py-3 border-t border-neutral-100 bg-neutral-50/50">
              <Button variant="ghost" size="sm"><Eye size={14} /> View</Button>
              <Button variant="ghost" size="sm"><Edit3 size={14} /> Edit</Button>
            </div>
          </Card>
        ))}
      </div>
      <Modal open={showAddModal} onClose={() => setShowAddModal(false)} title="Add Artist" size="lg" footer={<><Button variant="secondary" onClick={() => setShowAddModal(false)}>Cancel</Button><Button variant="primary" onClick={() => { toast.success('Artist added'); setShowAddModal(false); }}>Add Artist</Button></>}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Artist Name" required><Input placeholder="Full artist name" /></Field>
          <Field label="Genre" required><Select><option value="">Select genre</option><option>R&B/Soul</option><option>Pop</option><option>Hip-Hop/Rap</option><option>Electronic</option><option>Jazz/Neo-Soul</option><option>Indie Folk</option><option>Rock</option><option>Country</option></Select></Field>
          <Field label="Profile Photo"><div className="flex items-center gap-3"><Button variant="secondary" size="sm"><Upload size={14} /> Upload</Button><span className="text-xs text-neutral-400">JPG, PNG up to 5MB</span></div></Field>
          <Field label="Active Status"><Select><option value="active">Active</option><option value="inactive">Inactive</option></Select></Field>
          <Field label="Linked User Account" hint="Primary contact email"><Input placeholder="email@example.com" /></Field>
        </div>
      </Modal>
    </div>
  );
}

function AdminArtistsContractsPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [contracts] = useState([
    { id: '1', artist: 'Adea Lyric', type: 'Recording Agreement', termStart: '2023-01-15', termEnd: '2026-01-14', royaltySplit: 'Artist 70% / Label 30%', renewalDate: '2025-12-01', signedDocument: 'recording_adea_2023.pdf', status: 'active' },
    { id: '2', artist: 'Marcus Cole', type: 'Recording Agreement', termStart: '2024-06-01', termEnd: '2027-05-31', royaltySplit: 'Artist 65% / Label 35%', renewalDate: '2027-04-01', signedDocument: 'recording_marcus_2024.pdf', status: 'active' },
    { id: '3', artist: 'Adea Lyric', type: 'Management Agreement', termStart: '2022-03-01', termEnd: '2025-02-28', royaltySplit: 'Manager 15% commission', renewalDate: '2024-12-01', signedDocument: 'management_adea_2022.pdf', status: 'expiring_soon' },
    { id: '4', artist: 'The Velvet Strings', type: 'Recording Agreement', termStart: '2024-09-01', termEnd: '2027-08-31', royaltySplit: 'Artist 60% / Label 40%', renewalDate: '2027-07-01', signedDocument: 'recording_velvet_2024.pdf', status: 'active' },
    { id: '5', artist: 'DJ Onyx', type: 'Recording Agreement', termStart: '2021-04-01', termEnd: '2024-03-31', royaltySplit: 'Artist 50% / Label 50%', renewalDate: '2023-12-01', signedDocument: 'recording_onyx_2021.pdf', status: 'expired' },
    { id: '6', artist: 'Kai Nakamura', type: 'Single Deal', termStart: '2025-02-01', termEnd: '2025-07-31', royaltySplit: 'Artist 75% / Label 25%', renewalDate: '2025-06-01', signedDocument: 'single_kai_2025.pdf', status: 'active' },
    { id: '7', artist: 'Luna Vega', type: 'Distribution Agreement', termStart: '2025-01-01', termEnd: '2026-12-31', royaltySplit: 'Artist retains 85%', renewalDate: '2026-10-01', signedDocument: 'distribution_luna_2025.pdf', status: 'expiring_soon' },
  ]);

  return (
    <div>
      <PageHeader title="Contracts" description="Manage artist contracts and agreements" actions={<Button variant="primary" onClick={() => setShowAddModal(true)}><Plus size={16} /> New Contract</Button>} />
      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-neutral-100 bg-neutral-50/50">
              <th className="text-left px-4 py-3 text-xs font-medium text-neutral-500 uppercase tracking-wider">Artist</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-neutral-500 uppercase tracking-wider">Type</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-neutral-500 uppercase tracking-wider">Term</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-neutral-500 uppercase tracking-wider">Royalty Split</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-neutral-500 uppercase tracking-wider">Renewal Date</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-neutral-500 uppercase tracking-wider">Document</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-neutral-500 uppercase tracking-wider">Status</th>
              <th className="text-right px-4 py-3 text-xs font-medium text-neutral-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {contracts.map((c) => (
              <tr key={c.id} className={`hover:bg-neutral-50/50 ${c.status === 'expiring_soon' ? 'bg-amber-50/30' : ''}`}>
                <td className="px-4 py-3 text-sm font-medium text-neutral-900">{c.artist}</td>
                <td className="px-4 py-3 text-sm text-neutral-600">{c.type}</td>
                <td className="px-4 py-3 text-sm text-neutral-600">{c.termStart} — {c.termEnd}</td>
                <td className="px-4 py-3 text-sm text-neutral-600">{c.royaltySplit}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-neutral-600">{c.renewalDate}</span>
                    {c.status === 'expiring_soon' && <AlertTriangle size={14} className="text-amber-500" />}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5 text-sm text-neutral-500">
                    <FileText size={14} className="text-neutral-400" />
                    <span>{c.signedDocument}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  {c.status === 'active' ? <Badge color="green" size="sm">Active</Badge> : c.status === 'expiring_soon' ? <Badge color="amber" size="sm">Expiring Soon</Badge> : <Badge color="red" size="sm">Expired</Badge>}
                </td>
                <td className="px-4 py-3 text-right">
                  <button className="text-neutral-400 hover:text-neutral-600 p-1"><Eye size={14} /></button>
                  <button className="text-neutral-400 hover:text-neutral-600 p-1 ml-1"><Edit3 size={14} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {contracts.filter((c) => c.status === 'expiring_soon').length > 0 && (
        <div className="mt-4 flex items-center gap-2 text-amber-600 text-sm p-3 bg-amber-50 rounded-lg border border-amber-200">
          <AlertTriangle size={16} />
          <span>{contracts.filter((c) => c.status === 'expiring_soon').length} contracts expiring soon — review and initiate renewals.</span>
        </div>
      )}
      <Modal open={showAddModal} onClose={() => setShowAddModal(false)} title="New Contract" size="lg" footer={<><Button variant="secondary" onClick={() => setShowAddModal(false)}>Cancel</Button><Button variant="primary" onClick={() => { toast.success('Contract created'); setShowAddModal(false); }}>Create Contract</Button></>}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Artist" required><Select><option value="">Select artist</option><option>Adea Lyric</option><option>Marcus Cole</option><option>The Velvet Strings</option><option>DJ Onyx</option><option>Kai Nakamura</option><option>Luna Vega</option></Select></Field>
          <Field label="Contract Type" required><Select><option value="">Select type</option><option>Recording Agreement</option><option>Management Agreement</option><option>Distribution Agreement</option><option>Single Deal</option><option>360 Deal</option></Select></Field>
          <Field label="Term Start" required><Input type="date" /></Field>
          <Field label="Term End" required><Input type="date" /></Field>
          <Field label="Royalty Split Terms"><Textarea placeholder="e.g. Artist 70% / Label 30%" rows={2} /></Field>
          <Field label="Renewal Date"><Input type="date" /></Field>
          <Field label="Signed Document"><div className="flex items-center gap-3"><Button variant="secondary" size="sm"><Upload size={14} /> Upload PDF</Button><span className="text-xs text-neutral-400">Signed contract document</span></div></Field>
        </div>
      </Modal>
    </div>
  );
}

function AdminArtistsOnboardingPage() {
  const [selectedArtist, setSelectedArtist] = useState<string>('1');
  const [artists] = useState([
    { id: '1', name: 'Kai Nakamura', photo: 'https://picsum.photos/seed/kai-naka/80/80', genre: 'Hip-Hop/Rap', startDate: '2025-02-01' },
    { id: '2', name: 'Luna Vega', photo: 'https://picsum.photos/seed/luna-vega/80/80', genre: 'Pop', startDate: '2025-01-15' },
    { id: '3', name: 'Adea Lyric', photo: 'https://picsum.photos/seed/adea-lyric/80/80', genre: 'R&B/Soul', startDate: '2023-01-15' },
    { id: '4', name: 'Marcus Cole', photo: 'https://picsum.photos/seed/marcus-cole/80/80', genre: 'Jazz/Neo-Soul', startDate: '2024-06-01' },
  ]);
  const onboardingSteps = [
    { key: 'identity_verification', label: 'Identity Verification', icon: Shield },
    { key: 'tax_form', label: 'Tax Form (W-9/W-8BEN)', icon: FileText },
    { key: 'banking_info', label: 'Banking Information', icon: Wallet },
    { key: 'contract_signed', label: 'Contract Signed', icon: Handshake },
    { key: 'profile_complete', label: 'Profile Complete', icon: User },
    { key: 'first_release_ready', label: 'First Release Ready', icon: Disc3 },
  ];
  const onboardingByArtist: Record<string, Record<string, { status: 'complete' | 'pending' | 'not_started'; note?: string }>> = {
    '1': {
      identity_verification: { status: 'complete', note: 'Verified via ID.me' },
      tax_form: { status: 'complete', note: 'W-9 submitted' },
      banking_info: { status: 'pending', note: 'Awaiting direct deposit form' },
      contract_signed: { status: 'complete', note: 'Single Deal signed' },
      profile_complete: { status: 'pending', note: 'Bio and photo needed' },
      first_release_ready: { status: 'not_started', note: 'No tracks uploaded yet' },
    },
    '2': {
      identity_verification: { status: 'complete', note: 'Passport verified' },
      tax_form: { status: 'complete', note: 'W-8BEN submitted' },
      banking_info: { status: 'complete', note: 'International wire configured' },
      contract_signed: { status: 'complete', note: 'Distribution Agreement signed' },
      profile_complete: { status: 'complete', note: 'All fields populated' },
      first_release_ready: { status: 'pending', note: 'Artwork in review' },
    },
    '3': {
      identity_verification: { status: 'complete', note: 'Verified 2023' },
      tax_form: { status: 'complete', note: 'W-9 on file' },
      banking_info: { status: 'complete', note: 'Chase direct deposit' },
      contract_signed: { status: 'complete', note: 'Recording + Management signed' },
      profile_complete: { status: 'complete', note: 'Full profile' },
      first_release_ready: { status: 'complete', note: '3 releases live' },
    },
    '4': {
      identity_verification: { status: 'complete', note: 'Driver license verified' },
      tax_form: { status: 'pending', note: 'W-9 requested, not yet returned' },
      banking_info: { status: 'not_started' },
      contract_signed: { status: 'complete', note: 'Recording Agreement signed' },
      profile_complete: { status: 'pending', note: 'Missing genre tags' },
      first_release_ready: { status: 'pending', note: '2 tracks mixed, 1 mastering' },
    },
  };

  const activeArtist = artists.find((a) => a.id === selectedArtist);
  const steps = onboardingByArtist[selectedArtist] || {};
  const completedCount = Object.values(steps).filter((s) => s.status === 'complete').length;
  const progressPct = Math.round((completedCount / onboardingSteps.length) * 100);
  const statusIcon: Record<string, ReactNode> = {
    complete: <CheckCircle2 size={18} className="text-green-500" />,
    pending: <Clock size={18} className="text-amber-500" />,
    not_started: <Circle size={18} className="text-neutral-300" />,
  };
  const statusBadge: Record<string, { color: 'green' | 'amber' | 'gray'; label: string }> = {
    complete: { color: 'green', label: 'Complete' },
    pending: { color: 'amber', label: 'Pending' },
    not_started: { color: 'gray', label: 'Not Started' },
  };

  return (
    <div>
      <PageHeader title="Onboarding" description="Manage artist onboarding workflows" />
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-64 shrink-0">
          <h3 className="text-sm font-semibold text-neutral-500 uppercase tracking-wider mb-3">Artists</h3>
          <div className="space-y-2">
            {artists.map((a) => {
              const aSteps = onboardingByArtist[a.id] || {};
              const aCompleted = Object.values(aSteps).filter((s) => s.status === 'complete').length;
              const aPct = Math.round((aCompleted / onboardingSteps.length) * 100);
              return (
                <button key={a.id} onClick={() => setSelectedArtist(a.id)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${selectedArtist === a.id ? 'bg-neutral-100 border border-neutral-200' : 'hover:bg-neutral-50'}`}>
                  <img src={a.photo} alt={a.name} className="w-8 h-8 rounded object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-neutral-900 truncate">{a.name}</p>
                    <p className="text-xs text-neutral-400">{aPct}% complete</p>
                  </div>
                  <div className={`w-2 h-2 rounded-full ${aPct === 100 ? 'bg-green-500' : aPct >= 50 ? 'bg-amber-500' : 'bg-neutral-300'}`} />
                </button>
              );
            })}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          {activeArtist && (
            <>
              <div className="flex items-center gap-3 mb-4">
                <img src={activeArtist.photo} alt={activeArtist.name} className="w-12 h-12 rounded-lg object-cover" />
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-neutral-900">{activeArtist.name}</h2>
                  <p className="text-sm text-neutral-500">{activeArtist.genre} · Onboarded {activeArtist.startDate}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-neutral-500">Progress</p>
                  <p className={`text-lg font-bold ${progressPct === 100 ? 'text-green-600' : progressPct >= 50 ? 'text-amber-600' : 'text-neutral-400'}`}>{progressPct}%</p>
                </div>
              </div>
              <div className="w-full bg-neutral-100 rounded-full h-2 mb-6">
                <div className={`rounded-full h-2 transition-all ${progressPct === 100 ? 'bg-green-500' : 'bg-amber-500'}`} style={{ width: `${progressPct}%` }} />
              </div>
              {/* Checklist */}
              <div className="space-y-3">
                {onboardingSteps.map((step) => {
                  const stepData = steps[step.key] || { status: 'not_started' };
                  const IconComp = step.icon;
                  return (
                    <Card key={step.key} className={`p-4 ${stepData.status === 'complete' ? 'border-green-200' : stepData.status === 'pending' ? 'border-amber-200' : ''}`}>
                      <div className="flex items-center gap-4">
                        <div className="shrink-0">{statusIcon[stepData.status]}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <IconComp size={16} className="text-neutral-400" />
                            <h3 className="text-sm font-semibold text-neutral-900">{step.label}</h3>
                          </div>
                          {stepData.note && <p className="text-xs text-neutral-500 mt-1">{stepData.note}</p>}
                        </div>
                        <Badge color={statusBadge[stepData.status].color} size="sm">{statusBadge[stepData.status].label}</Badge>
                        {stepData.status !== 'complete' && (
                          <Button variant="secondary" size="sm" onClick={() => toast.info(`Working on: ${step.label}`)}>
                            {stepData.status === 'pending' ? 'Review' : 'Start'}
                          </Button>
                        )}
                      </div>
                    </Card>
                  );
                })}
              </div>
              {progressPct === 100 && (
                <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200 flex items-center gap-3">
                  <CheckCircle2 size={20} className="text-green-600" />
                  <div>
                    <p className="text-sm font-semibold text-green-700">Onboarding Complete</p>
                    <p className="text-xs text-green-600">{activeArtist.name} is fully onboarded and ready for releases.</p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function AdminTourCalendarPage() { return <AdminTourCalendarPageExternal />; }

function AdminTourVenuesPage() { return <AdminTourVenuesPageExternal />; }

function AdminTourBookingsPage() { return <AdminTourBookingsPageExternal />; }

// ============ MAIN APP ============
function AppContent() {
  const { path } = useRouter();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  usePageTitle();

  // During SSR and the initial client render, return a minimal shell
  // that matches what the server produces, so hydration succeeds.
  // After mounting, the hash router is active and we can render the
  // real portal based on the current path.
  if (!mounted) {
    return <LoadingState label="Loading…" />;
  }

  if (path === '/' || path === '') return <GatePage />;
  if (path === '/portal/login' || path === '/portal/signup') return <PortalApp noShell />;
  if (path.startsWith('/portal')) return <PortalApp />;
  if (path.startsWith('/writer')) return <WriterApp />;
  if (path.startsWith('/pro')) return <ProApp />;
  if (path.startsWith('/sync')) return <SyncApp />;
  if (path.startsWith('/admin')) return <AdminApp />;
  return <GatePage />;
}

export default function Page() {
  return (
    <RouterProvider>
      <PortalAuthProvider>
        <ProAuthProvider>
          <AppContent />
          <ToastContainer />
        </ProAuthProvider>
      </PortalAuthProvider>
    </RouterProvider>
  );
}
