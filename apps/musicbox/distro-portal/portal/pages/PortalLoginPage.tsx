'use client';

import { useState } from 'react';
import { useRouter } from '@/lib/router';
import { usePortalAuth } from '@/lib/auth';
import { Mail, Lock, Music, ArrowRight } from 'lucide-react';
import { toast } from '@/components/ui/Toast';
import { Button } from '@/components/ui/Button';
import { Field, Input } from '@/components/ui/Form';

export default function PortalLoginPage() {
  const { signIn } = usePortalAuth();
  const { navigate } = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    if (!email || !password) { toast('error', 'Email and password are required'); return; }
    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);
    if (error) { toast('error', error); return; }
    toast('success', 'Welcome back!');
    navigate('/portal/dashboard');
  };

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col">
      {/* ─── Left: Brand ─── */}
      <div className="flex-1 flex flex-col lg:flex-row">
        <div className="lg:w-1/2 flex flex-col justify-between p-8 sm:p-12 lg:p-16 bg-gradient-to-br from-neutral-50 to-white border-r border-neutral-100">
          <div>
            <p className="text-xs tracking-[0.2em] text-neutral-300 uppercase mb-8">Adea Lyric</p>
            <h1 className="text-4xl sm:text-5xl font-bold leading-tight text-neutral-900 mb-4">
              Welcome back.
            </h1>
            <p className="text-lg text-neutral-500 max-w-md leading-relaxed">
              Sign in to your fan account to access exclusive content, pre-sale tickets, merch drops, and more.
            </p>
          </div>
          <div className="mt-8 pt-8 border-t border-neutral-100">
            <p className="text-xs text-neutral-300">West Philadelphia · 2026</p>
          </div>
        </div>

        {/* ─── Right: Sign in form ─── */}
        <div className="lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-16 bg-white">
          <div className="w-full max-w-sm">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center">
                <Music size={20} className="text-white" />
              </div>
              <div>
                <p className="text-xs font-bold tracking-[0.15em] uppercase text-emerald-600">Fan Portal</p>
                <p className="text-sm font-semibold text-neutral-900">Sign In</p>
              </div>
            </div>

            <div className="border border-neutral-200 rounded-xl p-6 space-y-4 bg-white">
              <Field label="Email">
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-9 border-neutral-200 bg-white text-neutral-900 placeholder:text-neutral-400" placeholder="you@example.com" />
                </div>
              </Field>
              <Field label="Password">
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-9 border-neutral-200 bg-white text-neutral-900 placeholder:text-neutral-400" placeholder="Your password" onKeyDown={(e) => e.key === 'Enter' && handleSignIn()} />
                </div>
              </Field>
              <Button variant="primary" className="w-full bg-emerald-600 text-white hover:bg-emerald-700 flex items-center justify-center gap-2" onClick={handleSignIn} disabled={loading}>
                {loading ? 'Signing in...' : 'Sign In'} <ArrowRight size={16} />
              </Button>
            </div>

            <div className="mt-6 text-center space-y-2">
              <p className="text-sm text-neutral-500">
                Don't have an account?{' '}
                <button onClick={() => navigate('/portal/signup')} className="text-emerald-600 hover:underline font-medium">Create one</button>
              </p>
              <p className="text-sm text-neutral-500">
                Not a fan?{' '}
                <button onClick={() => navigate('/')} className="text-neutral-900 hover:underline font-medium">Choose a different portal</button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
