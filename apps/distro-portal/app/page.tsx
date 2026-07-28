// Catch-all route for SPA hash-based routing.
// Without this, navigating to /admin/studio (without #) causes Next.js 404.
// This catch-all ensures the SPA always loads, and the hash router takes over.
export const dynamic = 'force-dynamic';

import SpaClient from '../SpaClient';

export default function CatchAllPage() {
  return <SpaClient />;
}
