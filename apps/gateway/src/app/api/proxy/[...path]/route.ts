import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return proxyRequest(req, params.path);
}

export async function POST(
  req: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return proxyRequest(req, params.path);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return proxyRequest(req, params.path);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return proxyRequest(req, params.path);
}

async function proxyRequest(req: NextRequest, path: string[]) {
  const tenantId = req.headers.get('x-tenant-id');
  const tenantSlug = req.headers.get('x-tenant-slug');
  
  // Determine target portal based on path
  const targetPortal = determineTargetPortal(path);
  
  if (!targetPortal) {
    return NextResponse.json(
      { error: 'Invalid target portal' },
      { status: 400 }
    );
  }

  // Construct target URL
  const targetUrl = `http://localhost:3001/${targetPortal}/${path.join('/')}`;
  
  try {
    // Forward request to target portal
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        'x-tenant-id': tenantId || '',
        'x-tenant-slug': tenantSlug || '',
        // Forward authorization header if present
        ...(req.headers.get('authorization') && {
          authorization: req.headers.get('authorization')!,
        }),
      },
      body: req.method !== 'GET' ? await req.text() : undefined,
    });

    const data = await response.json();
    
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to proxy request' },
      { status: 502 }
    );
  }
}

function determineTargetPortal(path: string[]): string | null {
  // Simple routing logic based on path prefix
  if (path[0] === 'fan') return 'fan-portal';
  if (path[0] === 'label') return 'label-portal';
  if (path[0] === 'sync') return 'sync-portal';
  if (path[0] === 'admin') return 'admin-portal';
  
  return null;
}
