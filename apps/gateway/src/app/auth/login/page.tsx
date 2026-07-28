export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 flex items-center justify-center">
      <div className="max-w-md w-full mx-auto px-8 py-16">
        <div className="bg-white rounded-xl border border-neutral-200 p-8">
          <h1 className="text-2xl font-bold text-neutral-900 mb-6">Sign In</h1>
          
          <form className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-neutral-500"
                placeholder="you@example.com"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-neutral-500"
                placeholder="••••••••"
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-neutral-900 text-white py-2 px-4 rounded-md hover:bg-neutral-800 transition-colors"
            >
              Sign In
            </button>
          </form>
          
          <p className="mt-6 text-center text-sm text-neutral-600">
            Don't have an account?{' '}
            <a href="/auth/signup" className="text-neutral-900 hover:underline">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
