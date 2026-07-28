import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 flex items-center justify-center">
      <div className="max-w-4xl mx-auto px-8 py-16 text-center">
        <h1 className="text-5xl font-bold text-neutral-900 mb-4">MusicBox</h1>
        <p className="text-xl text-neutral-600 mb-12">Enterprise Music Operating System</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link href="/portal" className="p-6 bg-white rounded-xl border border-neutral-200 hover:border-neutral-300 hover:shadow-lg transition-all">
            <div className="text-3xl mb-3">🎵</div>
            <h2 className="text-lg font-semibold text-neutral-900 mb-1">Fan Portal</h2>
            <p className="text-sm text-neutral-500">Music, events, merch</p>
          </Link>
          
          <Link href="/pro" className="p-6 bg-white rounded-xl border border-neutral-200 hover:border-neutral-300 hover:shadow-lg transition-all">
            <div className="text-3xl mb-3">🏢</div>
            <h2 className="text-lg font-semibold text-neutral-900 mb-1">Label Portal</h2>
            <p className="text-sm text-neutral-500">Catalog, distribution</p>
          </Link>
          
          <Link href="/sync" className="p-6 bg-white rounded-xl border border-neutral-200 hover:border-neutral-300 hover:shadow-lg transition-all">
            <div className="text-3xl mb-3">🎬</div>
            <h2 className="text-lg font-semibold text-neutral-900 mb-1">Sync Portal</h2>
            <p className="text-sm text-neutral-500">Licensing, deals</p>
          </Link>
          
          <Link href="/admin" className="p-6 bg-white rounded-xl border border-neutral-200 hover:border-neutral-300 hover:shadow-lg transition-all">
            <div className="text-3xl mb-3">⚙️</div>
            <h2 className="text-lg font-semibold text-neutral-900 mb-1">Admin</h2>
            <p className="text-sm text-neutral-500">Platform operations</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
