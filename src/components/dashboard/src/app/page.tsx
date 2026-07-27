// Prevent static prerendering — this is a client-side SPA with hash-based routing
export const dynamic = 'force-dynamic';

import SpaClient from './SpaClient';

export default function Page() {
  return <SpaClient />;
}
