'use client';

import Link from 'next/link';
import { useSession } from '@musicbox/auth';
import { getPortalUrl, navigateToPortal, type PortalType } from '@musicbox/auth';

interface PortalNavProps {
  currentPortal: PortalType;
}

export function PortalNav({ currentPortal }: PortalNavProps) {
  const { session } = useSession();

  const portals: { key: PortalType; label: string; icon: string }[] = [
    { key: 'fan', label: 'Fan Portal', icon: '🎵' },
    { key: 'label', label: 'Label Portal', icon: '🏢' },
    { key: 'sync', label: 'Sync Portal', icon: '🎬' },
    { key: 'admin', label: 'Admin', icon: '⚙️' },
  ];

  return (
    <nav className="bg-white border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-neutral-900">MusicBox</span>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {portals.map((portal) => (
                <button
                  key={portal.key}
                  onClick={() => navigateToPortal(portal.key)}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    currentPortal === portal.key
                      ? 'border-neutral-900 text-neutral-900'
                      : 'border-transparent text-neutral-500 hover:border-neutral-300 hover:text-neutral-700'
                  }`}
                >
                  <span className="mr-2">{portal.icon}</span>
                  {portal.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center">
            {session.isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-neutral-600">
                  {session.user?.name || session.user?.email}
                </span>
                <button
                  onClick={() => window.location.href = getPortalUrl('gateway', '/auth/logout')}
                  className="text-sm text-neutral-500 hover:text-neutral-700"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                href={getPortalUrl('gateway', '/auth/login')}
                className="text-sm text-neutral-500 hover:text-neutral-700"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
