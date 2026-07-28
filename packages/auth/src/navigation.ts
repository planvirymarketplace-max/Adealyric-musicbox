export type PortalType = 'fan' | 'label' | 'sync' | 'admin' | 'gateway';

export interface PortalConfig {
  name: string;
  baseUrl: string;
  subdomain?: string;
}

export const PORTAL_CONFIGS: Record<PortalType, PortalConfig> = {
  fan: {
    name: 'Fan Portal',
    baseUrl: 'https://fan.musicbox.com',
  },
  label: {
    name: 'Label Portal',
    baseUrl: 'https://label.musicbox.com',
  },
  sync: {
    name: 'Sync Portal',
    baseUrl: 'https://sync.musicbox.com',
  },
  admin: {
    name: 'Admin Portal',
    baseUrl: 'https://admin.musicbox.com',
  },
  gateway: {
    name: 'Gateway',
    baseUrl: 'https://musicbox.com',
  },
};

export function getPortalUrl(portal: PortalType, path: string = ''): string {
  const config = PORTAL_CONFIGS[portal];
  return `${config.baseUrl}${path}`;
}

export function navigateToPortal(portal: PortalType, path: string = '') {
  const url = getPortalUrl(portal, path);
  window.location.href = url;
}

export function getTenantPortalUrl(tenantSlug: string, portal: PortalType, path: string = ''): string {
  // For tenant-specific subdomains: tenant-slug.portal.musicbox.com
  const config = PORTAL_CONFIGS[portal];
  const subdomain = tenantSlug ? `${tenantSlug}.${portal}` : portal;
  return `https://${subdomain}.musicbox.com${path}`;
}

export function navigateToTenantPortal(tenantSlug: string, portal: PortalType, path: string = '') {
  const url = getTenantPortalUrl(tenantSlug, portal, path);
  window.location.href = url;
}
