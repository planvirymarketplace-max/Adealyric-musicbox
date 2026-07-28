import Link from 'next/link';

export default function GatewayPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 flex items-center justify-center">
      <div className="max-w-4xl mx-auto px-8 py-16 text-center">
        <h1 className="text-5xl font-bold text-neutral-900 mb-4">MusicBox Gateway</h1>
        <p className="text-xl text-neutral-600 mb-12">Authentication & Routing Gateway</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/auth/login" className="p-6 bg-white rounded-xl border border-neutral-200 hover:border-neutral-300 hover:shadow-lg transition-all">
            <h2 className="text-lg font-semibold text-neutral-900 mb-1">Login</h2>
            <p className="text-sm text-neutral-500">Sign in to your account</p>
          </Link>
          
          <Link href="/auth/signup" className="p-6 bg-white rounded-xl border border-neutral-200 hover:border-neutral-300 hover:shadow-lg transition-all">
            <h2 className="text-lg font-semibold text-neutral-900 mb-1">Sign Up</h2>
            <p className="text-sm text-neutral-500">Create a new account</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
