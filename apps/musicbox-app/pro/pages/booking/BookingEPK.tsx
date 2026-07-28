'use client';

import { Music, MapPin, Clock, DollarSign } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

export default function BookingEPK() {
  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-white">Artist EPK</h1><p className="mt-1 text-sm text-white/50">Electronic press kit — everything you need to know</p></div>
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <div className="flex flex-col sm:flex-row gap-6">
          <div className="flex-shrink-0"><div className="w-24 h-24 rounded-xl bg-gradient-to-br from-neutral-700 to-neutral-900 border border-white/10 flex items-center justify-center"><Music size={32} className="text-white/30" /></div></div>
          <div className="flex-1 space-y-3">
            <h2 className="text-xl font-bold text-white">Nova Sound Collective</h2>
            <p className="text-sm text-white/60">Electronic music producer and collective from West Philadelphia. Blending house, techno, and experimental sounds since 2019.</p>
            <div className="flex flex-wrap gap-2"><Badge color="purple">Electronic / House</Badge><Badge color="teal">Berlin, DE</Badge><Badge color="green">Available</Badge></div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-3">
              <div><p className="text-xs text-white/40">Genre</p><p className="text-sm text-white/80">Electronic</p></div>
              <div><p className="text-xs text-white/40">Base Rate</p><p className="text-sm text-white/80 flex items-center gap-1"><DollarSign size={14} /> $3K-8K</p></div>
              <div><p className="text-xs text-white/40">Set Length</p><p className="text-sm text-white/80 flex items-center gap-1"><Clock size={14} /> 60-120min</p></div>
              <div><p className="text-xs text-white/40">Location</p><p className="text-sm text-white/80 flex items-center gap-1"><MapPin size={14} /> Global</p></div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white/5 border border-white/10 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-white mb-3">Notable Past Shows</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between py-2 border-b border-white/5"><p className="text-sm text-white">Summer Music Festival 2025 — NYC</p><Badge color="green">Completed</Badge></div>
          <div className="flex items-center justify-between py-2 border-b border-white/5"><p className="text-sm text-white">Warehouse Series LA — 4 shows</p><Badge color="green">Completed</Badge></div>
          <div className="flex items-center justify-between py-2"><p className="text-sm text-white">Blue Note Philly — 2 residencies</p><Badge color="green">Completed</Badge></div>
        </div>
      </div>
    </div>
  );
}
