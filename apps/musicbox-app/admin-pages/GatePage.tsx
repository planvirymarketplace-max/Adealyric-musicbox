'use client';

import { useState, useEffect } from 'react';
import { useRouter } from '@/lib/router';
import {
  Music, ArrowRight, ChevronRight, Building2, PenLine, Calendar,
  ShoppingBag, Disc3, FileText, Ticket, Video, Star, Users,
  Crown, CheckCircle2, MapPin,
} from 'lucide-react';

const PORTALS = [
  {
    id: 'fan',
    tag: 'Fan Community',
    headline: 'Stream, shop, and connect.',
    description: 'Access exclusive content, buy tickets before anyone else, shop limited merch, and join a community of people who love this music.',
    route: '/portal/signup',
    loginRoute: '/portal/login',
    color: 'from-emerald-500 to-emerald-600',
    accentBg: 'bg-emerald-50',
    accentBorder: 'border-emerald-200',
    accentText: 'text-emerald-700',
    iconBg: 'bg-emerald-600',
    features: [
      { icon: <Music size={14} />, label: 'Stream & preview music' },
      { icon: <Ticket size={14} />, label: 'Ticket pre-sales & early access' },
      { icon: <ShoppingBag size={14} />, label: 'Exclusive merch & limited drops' },
      { icon: <Calendar size={14} />, label: 'Tour dates & meet-and-greets' },
      { icon: <Video size={14} />, label: 'Behind-the-scenes & live streams' },
      { icon: <Star size={14} />, label: 'Loyalty rewards & VIP perks' },
    ],
  },
  {
    id: 'industry',
    tag: 'Industry & Sync',
    headline: 'License, distribute, and manage catalog.',
    description: 'Search the sync catalog with advanced metadata filters (mood, BPM, key, clearance status). Review songs for placement, request licenses, negotiate deals, check one-stop clearance, and manage distribution — all in one place.',
    route: '/pro/signup',
    loginRoute: '/pro/login',
    color: 'from-blue-500 to-blue-600',
    accentBg: 'bg-blue-50',
    accentBorder: 'border-blue-200',
    accentText: 'text-blue-700',
    iconBg: 'bg-blue-600',
    features: [
      { icon: <Disc3 size={14} />, label: 'Sync catalog with metadata & mood/BPM/key filters' },
      { icon: <CheckCircle2 size={14} />, label: 'One-stop clearance detection' },
      { icon: <FileText size={14} />, label: 'License contracts & deal history' },
      { icon: <Building2 size={14} />, label: 'Distribution pipeline & DSP delivery' },
    ],
  },
  {
    id: 'writer',
    tag: 'Writer & Collaborator',
    headline: 'Collaborate, pitch, and create.',
    description: 'A standalone portal for songwriters and collaborators. View open collaboration calls, pitch demos, propose co-writes, or make an offer on songs available for purchase. Writer access requires approval.',
    route: '/pro/signup?role=writer',
    loginRoute: '/pro/login',
    color: 'from-violet-500 to-violet-600',
    accentBg: 'bg-violet-50',
    accentBorder: 'border-violet-200',
    accentText: 'text-violet-700',
    iconBg: 'bg-violet-600',
    features: [
      { icon: <PenLine size={14} />, label: 'Open collab calls' },
      { icon: <Music size={14} />, label: 'Submit demos & pitches' },
      { icon: <ShoppingBag size={14} />, label: 'Buy a song outright' },
      { icon: <FileText size={14} />, label: 'Track submissions' },
    ],
  },
];

export default function GatePage() {
  const { navigate } = useRouter();
  const [selectedPortal, setSelectedPortal] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const go = (portal: typeof PORTALS[0]) => {
    navigate(portal.route);
  };

  const portal = selectedPortal ? PORTALS.find(p => p.id === selectedPortal) : null;

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col">
      {/* ─── Two-column layout ─── */}
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* ─── Left column: Brand identity ─── */}
        <div className="lg:w-1/2 flex flex-col justify-between p-8 sm:p-12 lg:p-16 bg-gradient-to-br from-neutral-50 to-white border-r border-neutral-100">
          <div>
            <p className="text-xs tracking-[0.2em] text-neutral-300 uppercase mb-8">Adea Lyric</p>
            <div className={`transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-neutral-900 mb-6">
                One platform.<br />
                <span className="text-neutral-400">Every connection.</span>
              </h1>
              <p className="text-lg text-neutral-500 max-w-md leading-relaxed mb-8">
                Whether you're here to listen, to license, or to collaborate — pick your path and get started.
              </p>

              {/* Key stats / trust markers */}
              <div className="flex items-center gap-6 text-sm text-neutral-400">
                <div className="flex items-center gap-2">
                  <Users size={16} />
                  <span>Fans worldwide</span>
                </div>
                <div className="flex items-center gap-2">
                  <Disc3 size={16} />
                  <span>Full sync catalog</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={16} />
                  <span>Active tours</span>
                </div>
              </div>
            </div>
          </div>

          {/* ─── Bottom branding ─── */}
          <div className="mt-8 pt-8 border-t border-neutral-100">
            <p className="text-xs text-neutral-300">West Philadelphia · 2026</p>
            <p className="text-xs text-neutral-300 mt-1">Fan content is open to everyone. Industry and writer access requires approval.</p>
          </div>
        </div>

        {/* ─── Right column: Portal selection ─── */}
        <div className="lg:w-1/2 flex flex-col p-8 sm:p-12 lg:p-16 bg-white">
          <div className={`transition-all duration-700 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <h2 className="text-lg font-semibold text-neutral-900 mb-2">Choose your path</h2>
            <p className="text-sm text-neutral-400 mb-8">Select the portal that fits your needs. Each one is built for a specific purpose.</p>

            {/* ─── Portal cards ─── */}
            <div className="space-y-4">
              {PORTALS.map((p, i) => {
                const isSelected = selectedPortal === p.id;
                return (
                  <div
                    key={p.id}
                    className={`rounded-xl overflow-hidden transition-all duration-300 border ${
                      isSelected
                        ? `border-2 ${p.accentBorder} shadow-md ${p.accentBg}`
                        : 'border border-neutral-200 hover:border-neutral-300 bg-white'
                    }`}
                    style={{ transitionDelay: `${i * 60}ms` }}
                  >
                    {/* Card header */}
                    <button
                      className="w-full flex items-center gap-4 p-5 text-left group"
                      onClick={() => setSelectedPortal(isSelected ? null : p.id)}
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                        isSelected ? `${p.iconBg} text-white` : 'bg-neutral-100 text-neutral-500 group-hover:bg-neutral-200'
                      }`}>
                        {p.id === 'fan' && <Music size={22} />}
                        {p.id === 'industry' && <Building2 size={22} />}
                        {p.id === 'writer' && <PenLine size={22} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-[10px] font-bold tracking-[0.18em] uppercase mb-0.5 ${isSelected ? p.accentText : 'text-neutral-400'}`}>
                          {p.tag}
                        </p>
                        <p className={`text-sm font-semibold ${isSelected ? 'text-neutral-900' : 'text-neutral-700'}`}>
                          {p.headline}
                        </p>
                      </div>
                      <ChevronRight size={16} className={`transition-transform ${isSelected ? 'rotate-90 text-neutral-400' : 'text-neutral-300'}`} />
                    </button>

                    {/* Expanded content */}
                    {isSelected && (
                      <div className="px-5 pb-5 border-t border-neutral-100">
                        <p className="text-sm text-neutral-500 mt-4 mb-4 leading-relaxed">{p.description}</p>

                        {/* Feature list */}
                        <div className="grid grid-cols-2 gap-2 mb-4">
                          {p.features.map((f) => (
                            <div key={f.label} className="flex items-center gap-2 text-xs text-neutral-500">
                              <span className={isSelected ? p.accentText : 'text-neutral-300'}>{f.icon}</span>
                              {f.label}
                            </div>
                          ))}
                        </div>

                        {/* Action buttons */}
                        <div className="flex gap-3">
                          <button
                            onClick={() => go(p)}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r ${p.color} text-white text-sm font-medium hover:opacity-90 transition-opacity`}
                          >
                            {p.id === 'fan' ? 'Create Fan Account' : p.id === 'writer' ? 'Request Writer Access' : 'Request Industry & Sync Access'}
                            <ArrowRight size={15} />
                          </button>
                          <button
                            onClick={() => navigate(p.loginRoute)}
                            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-neutral-200 text-neutral-700 text-sm font-medium hover:bg-neutral-50 transition-colors"
                          >
                            Sign In
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* ─── Admin Dashboard link (separate from the three public-facing entry paths) ─── */}
            <div className="mt-6 text-center">
              <button
                onClick={() => navigate('/admin')}
                className="inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-neutral-700 transition-colors group"
              >
                <Crown size={14} />
                <span className="group-hover:underline">Admin Dashboard</span>
                <span className="text-xs text-neutral-300">— The back office for the whole business</span>
              </button>
            </div>

            {/* ─── Already a member? ─── */}
            <div className="mt-8 pt-8 border-t border-neutral-100 text-center">
              <p className="text-sm text-neutral-400">
                Already have an account?{' '}
                <button onClick={() => navigate('/portal/login')} className="text-neutral-900 hover:underline font-medium">Fan Sign In</button>
                {' · '}
                <button onClick={() => navigate('/pro/login')} className="text-neutral-900 hover:underline font-medium">Industry & Writer Sign In</button>
              </p>
              <p className="text-xs text-neutral-400 mt-2">
                Industry and Writer users share the same sign-in page and are automatically routed to their respective portal.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
