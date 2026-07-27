'use client';

import { useState, useEffect } from 'react';
import { useRouter } from '@/lib/router';
import { useProAuth } from '@/lib/auth';
import { Building2, Music, Mail, Lock, User as UserIcon, ArrowRight, CheckCircle2, PenLine } from 'lucide-react';
import { toast } from '@/components/ui/Toast';
import { Button } from '@/components/ui/Button';
import { Field, Input } from '@/components/ui/Form';

const ROLES = [
  { value: 'label', label: 'Label / Sync Agent', desc: 'Browse catalog, request sync licenses, negotiate deals', icon: Building2, color: 'bg-blue-600', accentText: 'text-blue-600' },
  { value: 'booking', label: 'Booking Agent', desc: 'View EPK, check availability, submit booking requests', icon: Music, color: 'bg-blue-600', accentText: 'text-blue-600' },
  { value: 'writer', label: 'Writer / Collaborator', desc: 'View open collab calls, submit demos, buy songs', icon: PenLine, color: 'bg-violet-600', accentText: 'text-violet-600' },
];

const SIGNUP_STEPS = [
  { id: 'role', title: 'Choose Role', desc: 'What type of industry professional?' },
  { id: 'perks', title: 'What You Get', desc: 'Features based on your role' },
  { id: 'details', title: 'Create Account', desc: 'Set up your profile' },
];

const ROLE_PERKS: Record<string, { icon: ReactNode; label: string }[]> = {
  label: [
    { icon: <CheckCircle2 size={16} className="text-blue-600" />, label: 'Full sync catalog with metadata' },
    { icon: <CheckCircle2 size={16} className="text-blue-600" />, label: 'Request sync licenses directly' },
    { icon: <CheckCircle2 size={16} className="text-blue-600" />, label: 'Deal history & contract management' },
    { icon: <CheckCircle2 size={16} className="text-blue-600" />, label: 'Direct messaging with artist team' },
    { icon: <CheckCircle2 size={16} className="text-blue-600" />, label: 'Custom write request submission' },
  ],
  booking: [
    { icon: <CheckCircle2 size={16} className="text-blue-600" />, label: 'Artist EPK & press materials' },
    { icon: <CheckCircle2 size={16} className="text-blue-600" />, label: 'Real-time availability calendar' },
    { icon: <CheckCircle2 size={16} className="text-blue-600" />, label: 'Submit booking requests' },
    { icon: <CheckCircle2 size={16} className="text-blue-600" />, label: 'Manage bookings & documents' },
    { icon: <CheckCircle2 size={16} className="text-blue-600" />, label: 'Direct messaging with artist team' },
  ],
  writer: [
    { icon: <CheckCircle2 size={16} className="text-violet-600" />, label: 'Browse open collaboration calls' },
    { icon: <CheckCircle2 size={16} className="text-violet-600" />, label: 'Submit demos & pitches' },
    { icon: <CheckCircle2 size={16} className="text-violet-600" />, label: 'Buy songs outright' },
    { icon: <CheckCircle2 size={16} className="text-violet-600" />, label: 'Track submission status' },
    { icon: <CheckCircle2 size={16} className="text-violet-600" />, label: 'Direct messaging with artist team' },
  ],
};

export default function ProSignupPage() {
  const { signUp } = useProAuth();
  const { navigate } = useRouter();
  const [step, setStep] = useState<'role' | 'perks' | 'details'>('role');
  const [selectedRole, setSelectedRole] = useState('');
  const [form, setForm] = useState({ email: '', password: '', orgName: '', displayName: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check for role pre-selection from URL
    const hash = window.location.hash;
    const queryStr = hash.includes('?') ? hash.split('?')[1] : '';
    const params = new URLSearchParams(queryStr);
    const roleParam = params.get('role');
    if (roleParam && ROLES.some((r) => r.value === roleParam)) {
      setSelectedRole(roleParam);
      setStep('perks');
    }
  }, []);

  const submit = async () => {
    if (!form.email || !form.password || !selectedRole) { toast('error', 'All fields are required'); return; }
    if (form.password.length < 8) { toast('error', 'Password must be at least 8 characters'); return; }
    setLoading(true);
    const { error } = await signUp(form.email, form.password, selectedRole, form.orgName, form.displayName);
    setLoading(false);
    if (error) { toast('error', error); return; }
    toast('success', 'Account created — pending admin approval');
    navigate('/pro/login');
  };

  const currentRole = ROLES.find(r => r.value === selectedRole);
  const currentPerks = ROLE_PERKS[selectedRole] ?? [];

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col">
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* ─── Left: Brand ─── */}
        <div className="lg:w-1/2 flex flex-col justify-between p-8 sm:p-12 lg:p-16 bg-gradient-to-br from-neutral-50 to-white border-r border-neutral-100">
          <div>
            <p className="text-xs tracking-[0.2em] text-neutral-300 uppercase mb-8">Adea Lyric</p>
            <h1 className="text-4xl sm:text-5xl font-bold leading-tight text-neutral-900 mb-4">
              Industry<br />access.
            </h1>
            <p className="text-lg text-neutral-500 max-w-md leading-relaxed">
              Request access to sync licensing, booking, or collaboration tools. Your account will be reviewed by the artist team.
            </p>
          </div>
          <div className="mt-8 pt-8 border-t border-neutral-100">
            <p className="text-xs text-neutral-300">West Philadelphia · 2026</p>
            <p className="text-xs text-neutral-300 mt-1">Industry and writer access requires admin approval.</p>
          </div>
        </div>

        {/* ─── Right: Guided sign-up ─── */}
        <div className="lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-16 bg-white">
          <div className="w-full max-w-sm">
            {/* Step indicator */}
            <div className="flex items-center gap-2 mb-8">
              {SIGNUP_STEPS.map((s, i) => {
                const stepIndex = step === 'role' ? 0 : step === 'perks' ? 1 : 2;
                const isActive = i <= stepIndex;
                return (
                  <div key={s.id} className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                      isActive ? 'bg-blue-600 text-white' : 'bg-neutral-200 text-neutral-400'
                    }`}>
                      {i + 1}
                    </div>
                    <div className="hidden sm:block">
                      <p className={`text-xs font-semibold ${isActive ? 'text-neutral-900' : 'text-neutral-400'}`}>{s.title}</p>
                      <p className="text-xs text-neutral-400">{s.desc}</p>
                    </div>
                    {i < 2 && <div className="w-8 h-px bg-neutral-200 mx-1" />}
                  </div>
                );
              })}
            </div>

            {step === 'role' ? (
              <div>
                <p className="text-sm font-semibold text-neutral-900 mb-2">I am a...</p>
                <p className="text-xs text-neutral-400 mb-4">Choose your professional role to get started.</p>
                <div className="space-y-3">
                  {ROLES.map((r) => {
                    const Icon = r.icon;
                    return (
                      <button
                        key={r.value}
                        onClick={() => { setSelectedRole(r.value); setStep('perks'); }}
                        className="w-full text-left p-4 rounded-xl border border-neutral-200 hover:border-neutral-400 hover:bg-neutral-50 transition-all group bg-white"
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-10 h-10 rounded-lg ${r.color} flex items-center justify-center flex-shrink-0 text-white`}>
                            <Icon size={20} />
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-sm text-neutral-900">{r.label}</p>
                            <p className="text-xs text-neutral-500 mt-0.5">{r.desc}</p>
                          </div>
                          <ArrowRight size={16} className="text-neutral-300 group-hover:text-neutral-600 mt-2 transition-colors" />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : step === 'perks' ? (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  {currentRole && (
                    <>
                      <div className={`w-10 h-10 rounded-lg ${currentRole.color} flex items-center justify-center text-white`}>
                        {(() => { const Icon = currentRole.icon; return <Icon size={20} />; })()}
                      </div>
                      <div>
                        <p className={`text-xs font-bold tracking-[0.15em] uppercase ${currentRole.accentText}`}>{currentRole.label}</p>
                        <p className="text-sm font-semibold text-neutral-900">What you get</p>
                      </div>
                    </>
                  )}
                  <button onClick={() => setStep('role')} className="ml-auto text-xs text-neutral-400 hover:text-neutral-600">Change role</button>
                </div>

                <div className="space-y-3 mb-6">
                  {currentPerks.map((perk) => (
                    <div key={perk.label} className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 border border-blue-100">
                      {perk.icon}
                      <span className="text-sm text-neutral-700">{perk.label}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setStep('details')}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  Continue to Create Account <ArrowRight size={16} />
                </button>
                <button onClick={() => setStep('role')} className="w-full text-center text-xs text-neutral-400 hover:text-neutral-600 mt-3 transition-colors">
                  Back to role selection
                </button>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  {currentRole && (
                    <>
                      <div className={`w-10 h-10 rounded-lg ${currentRole.color} flex items-center justify-center text-white`}>
                        {(() => { const Icon = currentRole.icon; return <Icon size={20} />; })()}
                      </div>
                      <div>
                        <span className={`text-xs px-2 py-1 rounded-full bg-blue-100 ${currentRole.accentText} font-medium`}>{currentRole.label}</span>
                        <p className="text-sm font-semibold text-neutral-900 mt-1">Create Account</p>
                      </div>
                    </>
                  )}
                </div>

                <div className="border border-neutral-200 rounded-xl p-6 space-y-4 bg-white">
                  <Field label="Email" required>
                    <div className="relative">
                      <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                      <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="pl-9 border-neutral-200 bg-white text-neutral-900 placeholder:text-neutral-400" placeholder="you@company.com" />
                    </div>
                  </Field>
                  <Field label="Password" required>
                    <div className="relative">
                      <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                      <Input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="pl-9 border-neutral-200 bg-white text-neutral-900 placeholder:text-neutral-400" placeholder="Min 8 characters" />
                    </div>
                  </Field>
                  <Field label="Your Name">
                    <div className="relative">
                      <UserIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                      <Input value={form.displayName} onChange={(e) => setForm({ ...form, displayName: e.target.value })} className="pl-9 border-neutral-200 bg-white text-neutral-900 placeholder:text-neutral-400" placeholder="Full name" />
                    </div>
                  </Field>
                  <Field label="Organization">
                    <Input value={form.orgName} onChange={(e) => setForm({ ...form, orgName: e.target.value })} className="border-neutral-200 bg-white text-neutral-900 placeholder:text-neutral-400" placeholder="Label, agency, or self" />
                  </Field>
                  <Button variant="primary" className="w-full bg-blue-600 text-white hover:bg-blue-700 flex items-center justify-center gap-2" onClick={submit} disabled={loading}>
                    {loading ? 'Creating...' : 'Request Access'} <ArrowRight size={16} />
                  </Button>
                  <p className="text-xs text-neutral-400 text-center">Your account will be reviewed by the artist team before activation</p>
                </div>

                <button onClick={() => setStep('perks')} className="w-full text-center text-xs text-neutral-400 hover:text-neutral-600 mt-3 transition-colors">
                  Back to overview
                </button>
              </div>
            )}

            <div className="mt-6 text-center space-y-2">
              <p className="text-sm text-neutral-500">
                Already have access?{' '}
                <button onClick={() => navigate('/pro/login')} className="text-blue-600 hover:underline font-medium">Sign in</button>
              </p>
              <p className="text-sm text-neutral-500">
                Not an industry professional?{' '}
                <button onClick={() => navigate('/')} className="text-neutral-900 hover:underline font-medium">Choose a different portal</button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
