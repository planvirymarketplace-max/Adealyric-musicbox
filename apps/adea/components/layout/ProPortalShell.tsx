'use client';

import { useState, type ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useProAuth } from '@/lib/auth';
import {
  Music, LayoutDashboard, Disc3, FileAudio, Send, PlusCircle, RefreshCw,
  Search, Handshake, Users, ScrollText, Shield, DollarSign, BarChart3,
  Settings, Menu, X, LogOut, Bell, ChevronDown, ExternalLink,
} from 'lucide-react';
import { toast } from '@/components/ui/Toast';

interface NavItem { to: string; label: string; icon: ReactNode }
interface NavSection { title: string; items: NavItem[] }

const INDUSTRY_NAV: NavSection[] = [
  { title: 'Main', items: [
    { to: '/pro/dashboard/label', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
  ]},
  { title: 'Catalog', items: [
    { to: '/pro/catalog/releases', label: 'Releases', icon: <Disc3 size={18} /> },
    { to: '/pro/catalog/tracks', label: 'Tracks', icon: <Music size={18} /> },
    { to: '/pro/catalog/assets', label: 'Assets', icon: <FileAudio size={18} /> },
  ]},
  { title: 'Distribution', items: [
    { to: '/pro/distribution/status', label: 'Delivery Status', icon: <Send size={18} /> },
    { to: '/pro/distribution/submit', label: 'New Release Submission', icon: <PlusCircle size={18} /> },
    { to: '/pro/distribution/corrections', label: 'Store Corrections', icon: <RefreshCw size={18} /> },
  ]},
  { title: 'Sync Marketplace', items: [
    { to: '/pro/sync/search', label: 'Browse & Search', icon: <Search size={18} /> },
    { to: '/pro/sync/deals', label: 'Deal Rooms', icon: <Handshake size={18} /> },
    { to: '/pro/sync/workspace', label: 'A&R Workspace', icon: <Users size={18} /> },
    { to: '/pro/sync/history', label: 'License History', icon: <ScrollText size={18} /> },
  ]},
  { title: 'Operations', items: [
    { to: '/pro/rights', label: 'Rights & Splits', icon: <Shield size={18} /> },
    { to: '/pro/royalties', label: 'Royalties & Statements', icon: <DollarSign size={18} /> },
    { to: '/pro/analytics', label: 'Analytics', icon: <BarChart3 size={18} /> },
    { to: '/pro/settings', label: 'Settings', icon: <Settings size={18} /> },
  ]},
];

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <nav className="flex-1 overflow-y-auto px-3 py-4">
      {INDUSTRY_NAV.map((section) => (
        <div key={section.title} className="mb-6">
          <p className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-neutral-400">{section.title}</p>
          <div className="space-y-0.5">
            {section.items.map((item) => {
              const active = pathname === item.to || pathname.startsWith(item.to + '/');
              return (
                <button
                  key={item.to}
                  onClick={() => { router.push(item.to); onNavigate?.(); }}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors w-full text-left ${
                    active
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
        </div>
      ))}
    </nav>
  );
}

export function ProPortalShell({ children }: { children: ReactNode; role?: string }) {
  const router = useRouter();
  const { portalUser, signOut, loading } = useProAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  if (loading) return <div className="min-h-screen bg-neutral-50 flex items-center justify-center"><div className="w-8 h-8 border-2 border-neutral-200 border-t-neutral-400 rounded-full animate-spin" /></div>;
  if (!portalUser) { router.push('/'); return <div className="min-h-screen bg-neutral-50 flex items-center justify-center"><p className="text-neutral-500">Redirecting…</p></div>; }
  if (portalUser.status === 'pending') { router.push('/pro/pending'); return null; }
  if (portalUser.status === 'suspended') { router.push('/pro/suspended'); return null; }

  const handleSignOut = () => {
    signOut();
    toast('success', 'Signed out');
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 flex-col bg-white border-r border-neutral-200 fixed inset-y-0 left-0 z-30">
        <div className="flex items-center gap-2 px-6 py-5 border-b border-neutral-200">
          <div className="w-8 h-8 rounded-lg bg-neutral-900 flex items-center justify-center">
            <Music size={18} className="text-white" />
          </div>
          <span className="font-semibold text-neutral-900">Industry & Sync Portal</span>
        </div>
        <SidebarContent />
        <div className="px-4 py-3 border-t border-neutral-200">
          <div className="flex items-center gap-2 text-xs">
            <span className="px-2 py-1 rounded-full bg-neutral-100 text-neutral-600 font-medium">Industry & Sync</span>
            {portalUser.org_name && <span className="text-neutral-400 truncate">{portalUser.org_name}</span>}
          </div>
          <button onClick={() => router.push('/')} className="flex items-center gap-2 text-xs text-neutral-500 hover:text-neutral-900 transition-colors mt-2 w-full">
            <ExternalLink size={12} /> Back to Home
          </button>
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
                <span className="font-semibold text-neutral-900">Industry & Sync Portal</span>
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
          <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden text-neutral-500">
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          {/* Search */}
          <div className="flex-1 max-w-md ml-2 hidden sm:block">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Search catalog, sync deals..."
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
            <div className="relative">
              <button onClick={() => setShowProfile(!showProfile)} className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-neutral-100 transition-colors">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-neutral-700 to-neutral-900 flex items-center justify-center text-xs font-medium text-white">
                  {(portalUser.display_name ?? portalUser.email).charAt(0).toUpperCase()}
                </div>
                <ChevronDown size={14} className="text-neutral-400" />
              </button>
              {showProfile && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowProfile(false)} />
                  <div className="absolute right-0 top-full mt-1 w-56 bg-white rounded-lg shadow-lg border border-neutral-200 py-1 z-20">
                    <div className="px-3 py-2 border-b border-neutral-100">
                      <p className="text-sm font-medium truncate text-neutral-900">{portalUser.display_name ?? 'User'}</p>
                      <p className="text-xs text-neutral-400 truncate">{portalUser.email}</p>
                    </div>
                    <button onClick={handleSignOut} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-neutral-600 hover:bg-neutral-50">
                      <LogOut size={14} /> Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 px-4 lg:px-8 py-6">{children}</main>
      </div>
    </div>
  );
}
