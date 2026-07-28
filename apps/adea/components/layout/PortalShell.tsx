'use client';

import { useState, type ReactNode } from 'react';
import { useRouter } from '@/lib/router';
import { usePortalAuth } from '@/lib/auth';
import {
  Music, Calendar, Video, User, Home, LogOut, Menu, X,
  ShoppingBag, MapPin, Award, Bell, Search, Settings, Star, Heart,
  Ticket, Gift, Crown, MessageSquare, ChevronDown, Palette, Wallet,
  Disc3,
} from 'lucide-react';
import { toast } from '@/components/ui/Toast';
import { useCommerceStore } from '@/lib/commerce-store';
import { formatCents } from '@/lib/format';

const navSections: { title: string; items: { to: string; label: string; icon: ReactNode; badge?: string }[] }[] = [
  {
    title: 'Discover',
    items: [
      { to: '/portal', label: 'Home', icon: <Home size={18} /> },
      { to: '/portal/music', label: 'Featured Releases', icon: <Disc3 size={18} /> },
    ],
  },
  {
    title: 'Stream',
    items: [
      { to: '/portal/music', label: 'Music', icon: <Music size={18} /> },
      { to: '/portal/videos', label: 'Videos', icon: <Video size={18} /> },
    ],
  },
  {
    title: 'Shop',
    items: [
      { to: '/portal/shop', label: 'Merch Store', icon: <ShoppingBag size={18} /> },
      { to: '/portal/membership', label: 'Bundles & Tiers', icon: <Gift size={18} /> },
    ],
  },
  {
    title: 'Tour Dates',
    items: [
      { to: '/portal/events', label: 'Events', icon: <Calendar size={18} /> },
      { to: '/portal/tours', label: 'Tours', icon: <MapPin size={18} /> },
    ],
  },
  {
    title: 'Fan Club',
    items: [
      { to: '/portal/exclusive', label: 'Exclusive Access', icon: <Crown size={18} /> },
      { to: '/portal/community', label: 'Community Hub', icon: <MessageSquare size={18} /> },
      { to: '/portal/premium', label: 'Premium Content', icon: <Star size={18} /> },
    ],
  },
  {
    title: 'My Account',
    items: [
      { to: '/portal/dashboard', label: 'My Dashboard', icon: <User size={18} /> },
      { to: '/portal/wallet', label: 'Wallet', icon: <Wallet size={18} /> },
      { to: '/portal/cart', label: 'Cart', icon: <ShoppingBag size={18} /> },
      { to: '/portal/orders', label: 'Orders', icon: <Ticket size={18} /> },
      { to: '/portal/account', label: 'Loyalty & Account', icon: <Award size={18} /> },
    ],
  },
];

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const { path, navigate } = useRouter();

  return (
    <nav className="flex-1 overflow-y-auto px-3 py-4">
      {navSections.map((section) => (
        <div key={section.title} className="mb-6">
          <p className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-neutral-400">{section.title}</p>
          <div className="space-y-0.5">
            {section.items.map((item) => {
              const isActive = path === item.to || (item.to !== '/portal' && path.startsWith(item.to));
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
                  {item.badge && (
                    <span className="ml-auto text-xs bg-neutral-200 text-neutral-600 px-1.5 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}

function NotificationsPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const notifications = [
    { id: 1, title: 'Summer Festival tickets on sale!', description: 'Get your tickets before they sell out.', time: '2h ago', icon: <Ticket size={16} className="text-emerald-500" /> },
    { id: 2, title: 'New merch drop: Limited edition pins', description: 'Club-member exclusive merch just dropped.', time: '1d ago', icon: <Gift size={16} className="text-purple-500" /> },
    { id: 3, title: 'Behind-the-scenes studio update', description: 'Adea just shared a new studio clip.', time: '3d ago', icon: <Video size={16} className="text-blue-500" /> },
  ];

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/20" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-white shadow-xl flex flex-col h-full">
        <div className="flex items-center justify-between px-4 py-4 border-b border-neutral-200">
          <h2 className="text-lg font-semibold text-neutral-900">Notifications</h2>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-600"><X size={20} /></button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Bell size={32} className="text-neutral-200 mb-3" />
              <p className="text-sm text-neutral-400">No notifications yet</p>
            </div>
          ) : (
            <div className="divide-y divide-neutral-100">
              {notifications.map((n) => (
                <div key={n.id} className="flex items-start gap-3 px-4 py-3 hover:bg-neutral-50 transition-colors cursor-pointer">
                  <div className="flex-shrink-0 mt-0.5">{n.icon}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-neutral-900">{n.title}</p>
                    <p className="text-xs text-neutral-500 mt-0.5">{n.description}</p>
                  </div>
                  <span className="text-xs text-neutral-400 flex-shrink-0">{n.time}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function PortalShell({ children }: { children: ReactNode }) {
  const { path, navigate } = useRouter();
  const { user, signOut } = usePortalAuth();
  const { wallet, cartItemCount } = useCommerceStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const itemCount = cartItemCount();

  const handleSignOut = () => {
    signOut();
    toast('success', 'Signed out');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 flex-col bg-white border-r border-neutral-200 fixed inset-y-0 left-0 z-30">
        <div className="flex items-center gap-2 px-6 py-5 border-b border-neutral-200">
          <div className="w-8 h-8 rounded-lg bg-neutral-900 flex items-center justify-center">
            <Music size={18} className="text-white" />
          </div>
          <span className="font-semibold text-neutral-900">Adea Lyric</span>
        </div>
        <SidebarContent />
        <div className="px-6 py-4 border-t border-neutral-200 space-y-2">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 text-xs text-neutral-500 hover:text-neutral-900 transition-colors w-full">
            <Home size={12} /> Back to Home
          </button>
          <p className="text-xs text-neutral-400 mt-1">Fan Portal v1.0</p>
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
                <span className="font-semibold text-neutral-900">Adea Lyric</span>
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

          {/* Search */}
          <div className="flex-1 max-w-md ml-2 hidden sm:block">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                placeholder="Search music, events, merch…"
                className="w-full pl-9 pr-4 py-2 text-sm bg-neutral-100 rounded-lg border border-transparent focus:outline-none focus:border-neutral-300 focus:bg-white transition-colors"
              />
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2 ml-auto">
            {/* Wallet balance */}
            <button
              onClick={() => navigate('/portal/wallet')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-neutral-100 text-neutral-700 transition-colors"
            >
              <Wallet size={16} className="text-emerald-600" />
              <span className="text-sm font-medium">{formatCents(wallet.balanceCents)}</span>
            </button>

            {/* Cart icon */}
            <button
              onClick={() => navigate('/portal/cart')}
              className="relative p-2 rounded-lg hover:bg-neutral-100 text-neutral-500 transition-colors"
            >
              <ShoppingBag size={20} />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setNotificationsOpen(true)}
              className="relative p-2 rounded-lg hover:bg-neutral-100 text-neutral-500"
            >
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            {user ? (
              <div className="relative">
                <button onClick={() => setShowProfile(!showProfile)} className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-neutral-100 transition-colors">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-neutral-700 to-neutral-900 flex items-center justify-center text-xs font-medium text-white">
                    {(user.email?.charAt(0) ?? 'F').toUpperCase()}
                  </div>
                  <ChevronDown size={14} className="text-neutral-400" />
                </button>
                {showProfile && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowProfile(false)} />
                    <div className="absolute right-0 top-full mt-1 w-56 bg-white rounded-lg shadow-lg border border-neutral-200 py-1 z-20">
                      <div className="px-3 py-2 border-b border-neutral-100">
                        <p className="text-sm font-medium truncate text-neutral-900">{user.email}</p>
                      </div>
                      <button onClick={() => { navigate('/portal/dashboard'); setShowProfile(false); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-neutral-600 hover:bg-neutral-50">
                        <User size={14} /> Dashboard
                      </button>
                      <button onClick={() => { navigate('/portal/account'); setShowProfile(false); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-neutral-600 hover:bg-neutral-50">
                        <Award size={14} /> Account & Loyalty
                      </button>
                      <button onClick={() => { handleSignOut(); setShowProfile(false); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-neutral-600 hover:bg-neutral-50">
                        <LogOut size={14} /> Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button onClick={() => navigate('/portal/login')} className="px-3 py-1.5 rounded-lg text-sm text-neutral-600 hover:text-neutral-900 transition-colors">Sign In</button>
                <button onClick={() => navigate('/portal/signup')} className="px-4 py-1.5 rounded-lg text-sm font-medium bg-neutral-900 text-white hover:bg-neutral-700 transition-colors">Sign Up</button>
              </div>
            )}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 px-4 lg:px-8 py-6">{children}</main>

        {/* Footer */}
        <footer className="border-t border-neutral-200 py-6 px-4 text-center">
          <p className="text-sm text-neutral-400">&copy; 2026 Adea Lyric. All rights reserved.</p>
        </footer>
      </div>

      <NotificationsPanel open={notificationsOpen} onClose={() => setNotificationsOpen(false)} />
    </div>
  );
}
