import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getTenantFromSubdomain, getTenantFromDomain } from '@musicbox/auth';

export async function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const hostname = req.headers.get('host') || '';
  
  // Extract subdomain (e.g., 'label-name.musicbox.com' -> 'label-name')
  const subdomain = hostname.split('.')[0];
  
  // Check if this is a tenant subdomain or custom domain
  let tenant;
  if (subdomain && subdomain !== 'www' && subdomain !== 'gateway') {
    tenant = await getTenantFromSubdomain(subdomain);
  } else {
    tenant = await getTenantFromDomain(hostname);
  }
  
  // If tenant found, inject tenant info into headers
  if (tenant) {
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set('x-tenant-id', tenant.id);
    requestHeaders.set('x-tenant-slug', tenant.slug);
    
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }
  
  // If no tenant, continue to default routing
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes that handle their own auth
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
