'use client';

import { useState } from 'react';
import { useRouter } from '@/lib/router';
import { usePortalAuth } from '@/lib/auth';
import { Music, ArrowRight, Mail, Lock, User as UserIcon, Crown, CheckCircle2 } from 'lucide-react';
import { toast } from '@/components/ui/Toast';
import { Button } from '@/components/ui/Button';
import { Field, Input } from '@/components/ui/Form';

const SIGNUP_STEPS = [
  { id: 'welcome', title: 'Welcome', desc: 'What you get as a fan member' },
  { id: 'details', title: 'Create Account', desc: 'Set up your fan profile' },
  { id: 'done', title: "You're In", desc: 'Start exploring' },
];

const FAN_PERKS = [
  { icon: <Crown size={16} className="text-emerald-600" />, label: 'Membership tiers from $4/mo' },
  { icon: <CheckCircle2 size={16} className="text-emerald-600" />, label: 'Ticket pre-sales & early access' },
  { icon: <CheckCircle2 size={16} className="text-emerald-600" />, label: 'Exclusive merch & limited drops' },
  { icon: <CheckCircle2 size={16} className="text-emerald-600" />, label: 'Behind-the-scenes content' },
  { icon: <CheckCircle2 size={16} className="text-emerald-600" />, label: 'Live streams & Q&A sessions' },
  { icon: <CheckCircle2 size={16} className="text-emerald-600" />, label: 'Loyalty rewards & VIP perks' },
];

export default function PortalSignupPage() {
  const { signUp } = usePortalAuth();
  const { navigate } = useRouter();
  const [step, setStep] = useState<'welcome' | 'details'>('welcome');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (!email || !password) { toast('error', 'Email and password are required'); return; }
    if (password.length < 6) { toast('error', 'Password must be at least 6 characters'); return; }
    setLoading(true);
    const { error } = await signUp(email, password, name);
    setLoading(false);
    if (error) { toast('error', error); return; }
    toast('success', 'Account created! Welcome.');
    navigate('/portal/dashboard');
  };

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col">
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* ─── Left: Brand ─── */}
        <div className="lg:w-1/2 flex flex-col justify-between p-8 sm:p-12 lg:p-16 bg-gradient-to-br from-neutral-50 to-white border-r border-neutral-100">
          <div>
            <p className="text-xs tracking-[0.2em] text-neutral-300 uppercase mb-8">Adea Lyric</p>
            <h1 className="text-4xl sm:text-5xl font-bold leading-tight text-neutral-900 mb-4">
              Join the<br />community.
            </h1>
            <p className="text-lg text-neutral-500 max-w-md leading-relaxed">
              Create your fan account and start exploring exclusive content, early access, and more.
            </p>
          </div>
          <div className="mt-8 pt-8 border-t border-neutral-100">
            <p className="text-xs text-neutral-300">West Philadelphia · 2026</p>
          </div>
        </div>

        {/* ─── Right: Sign-up flow ─── */}
        <div className="lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-16 bg-white">
          <div className="w-full max-w-sm">
            {/* Step indicator */}
            <div className="flex items-center gap-2 mb-8">
              {SIGNUP_STEPS.filter(s => s.id !== 'done').map((s, i) => (
                <div key={s.id} className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                    (step === 'welcome' && i === 0) || (step === 'details' && i === 1)
                      ? 'bg-emerald-600 text-white'
                      : 'bg-neutral-200 text-neutral-400'
                  }`}>
                    {i + 1}
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-xs font-semibold text-neutral-900">{s.title}</p>
                    <p className="text-xs text-neutral-400">{s.desc}</p>
                  </div>
                  {i < 1 && <div className="w-8 h-px bg-neutral-200 mx-1" />}
                </div>
              ))}
            </div>

            {/* Portal badge */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center">
                <Music size={20} className="text-white" />
              </div>
              <div>
                <p className="text-xs font-bold tracking-[0.15em] uppercase text-emerald-600">Fan Portal</p>
                <p className="text-sm font-semibold text-neutral-900">Create Your Account</p>
              </div>
            </div>

            {step === 'welcome' ? (
              <div>
                <p className="text-sm text-neutral-500 mb-4">Here's what you get when you join:</p>
                <div className="space-y-3 mb-6">
                  {FAN_PERKS.map((perk) => (
                    <div key={perk.label} className="flex items-center gap-3 p-3 rounded-lg bg-emerald-50 border border-emerald-100">
                      {perk.icon}
                      <span className="text-sm text-neutral-700">{perk.label}</span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => setStep('details')}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition-colors"
                >
                  Continue to Create Account <ArrowRight size={16} />
                </button>
              </div>
            ) : (
              <div className="border border-neutral-200 rounded-xl p-6 space-y-4 bg-white">
                <Field label="Display Name">
                  <div className="relative">
                    <UserIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <Input value={name} onChange={(e) => setName(e.target.value)} className="pl-9 border-neutral-200 bg-white text-neutral-900 placeholder:text-neutral-400" placeholder="Your name" />
                  </div>
                </Field>
                <Field label="Email">
                  <div className="relative">
                    <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-9 border-neutral-200 bg-white text-neutral-900 placeholder:text-neutral-400" placeholder="you@example.com" />
                  </div>
                </Field>
                <Field label="Password">
                  <div className="relative">
                    <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-9 border-neutral-200 bg-white text-neutral-900 placeholder:text-neutral-400" placeholder="Min 6 characters" onKeyDown={(e) => e.key === 'Enter' && handleSignUp()} />
                  </div>
                </Field>
                <Button variant="primary" className="w-full bg-emerald-600 text-white hover:bg-emerald-700 flex items-center justify-center gap-2" onClick={handleSignUp} disabled={loading}>
                  {loading ? 'Creating...' : 'Create Account'} <ArrowRight size={16} />
                </Button>
                <button onClick={() => setStep('welcome')} className="w-full text-center text-xs text-neutral-400 hover:text-neutral-600 transition-colors">
                  Back to overview
                </button>
              </div>
            )}

            <div className="mt-6 text-center space-y-2">
              <p className="text-sm text-neutral-500">
                Already have an account?{' '}
                <button onClick={() => navigate('/portal/login')} className="text-emerald-600 hover:underline font-medium">Sign in</button>
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
