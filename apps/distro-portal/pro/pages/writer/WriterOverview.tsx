'use client';

import { useRouter } from '@/lib/router';
import { useProAuth } from '@/lib/auth';
import { Sparkles, ArrowRight, Clock, Send, Target, Music2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/States';
import { Badge } from '@/components/ui/Badge';
import { formatDate } from '@/lib/format';
import { mockCollabCalls } from '@/lib/mock-data';

export default function WriterOverview() {
  const { portalUser } = useProAuth();
  const { navigate } = useRouter();
  if (!portalUser) return null;

  const calls = mockCollabCalls.filter((c) => c.status === 'open');
  const firstName = portalUser?.display_name?.split(' ')[0] ?? 'there';

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="mb-10">
          <div className="flex items-center gap-2 text-white/40 text-sm mb-2"><Sparkles size={16} /><span>Writer & Collaborator Portal</span></div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, {firstName}.</h1>
          <p className="mt-2 text-white/50 max-w-2xl">This is your creative home base. Browse open collaboration calls, submit unsolicited pitches, explore the catalog for sale, and track every submission.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <button onClick={() => navigate('/pro/dashboard/writer/submit')} className="block">
            <div className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-5 transition-colors h-full">
              <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center mb-3"><Send size={20} className="text-white" /></div>
              <h3 className="font-semibold text-white">Submit a pitch</h3>
              <p className="text-sm text-white/40 mt-1">Send us a demo, co-write idea, or beat for sale.</p>
            </div>
          </button>
          <button onClick={() => navigate('/pro/dashboard/writer/buy')} className="block">
            <div className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-5 transition-colors h-full">
              <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center mb-3"><Music2 size={20} className="text-white" /></div>
              <h3 className="font-semibold text-white">Browse catalog</h3>
              <p className="text-sm text-white/40 mt-1">Songs available for purchase or licensing.</p>
            </div>
          </button>
          <button onClick={() => navigate('/pro/dashboard/writer/submissions')} className="block">
            <div className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-5 transition-colors h-full">
              <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center mb-3"><Target size={20} className="text-white" /></div>
              <h3 className="font-semibold text-white">Track submissions</h3>
              <p className="text-sm text-white/40 mt-1">See where your pitches stand.</p>
            </div>
          </button>
        </div>

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Open collaboration calls</h2>
          <button onClick={() => navigate('/pro/dashboard/writer/collab-calls')} className="text-sm text-white/50 hover:text-white inline-flex items-center gap-1">View all <ArrowRight size={14} /></button>
        </div>

        {calls.length === 0 ? (
          <div className="bg-white/5 border border-white/10 rounded-xl"><EmptyState icon={<Sparkles size={32} />} title="No open calls right now" description="Check back soon — new opportunities are posted regularly." /></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {calls.slice(0, 4).map((call) => (
              <div key={call.id} className="bg-white/5 border border-white/10 rounded-xl p-5 flex flex-col">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="font-semibold text-white leading-snug">{call.title}</h3>
                  {call.deadline && <Badge color="amber" size="sm"><span className="inline-flex items-center gap-1"><Clock size={11} /> {formatDate(call.deadline)}</span></Badge>}
                </div>
                <p className="text-sm text-white/50 line-clamp-2 mb-3">{call.description}</p>
                <div className="mt-auto pt-3 border-t border-white/10">
                  <p className="text-xs uppercase tracking-wide text-white/30 mb-1">What&apos;s needed</p>
                  <p className="text-sm text-white/70 line-clamp-2">{call.what_needed}</p>
                </div>
                <button onClick={() => navigate('/pro/dashboard/writer/collab-calls')} className="mt-3">
                  <Button variant="primary" size="sm" className="w-full bg-white text-neutral-900 hover:bg-white/90">View & apply</Button>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
