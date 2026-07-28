'use client';

import { Music, Search } from 'lucide-react';
import { useState } from 'react';
import { Badge, StatusBadge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Form';
import { mockCatalogSongs } from '@/lib/mock-data';

export default function AdminCatalog() {
  const [search, setSearch] = useState('');
  const songs = mockCatalogSongs.filter((s) => !search || s.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-white">Catalog Manager</h1><p className="mt-1 text-sm text-white/50">Manage all songs in the sync catalog</p></div>
      <div className="relative max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
        <Input placeholder="Search catalog…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 bg-white/5 border-white/10 text-white" />
      </div>
      <div className="space-y-3">
        {songs.map((s) => (
          <div key={s.id} className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3"><div className="w-10 h-10 rounded bg-white/10 flex items-center justify-center"><Music size={16} className="text-white/30" /></div><div><p className="text-sm font-medium text-white">{s.title}</p><p className="text-xs text-white/40">{s.genre} · {s.bpm} BPM</p></div></div>
            <div className="flex items-center gap-2"><StatusBadge status={s.sync_status} /><StatusBadge status={s.distribution_status} /></div>
          </div>
        ))}
      </div>
    </div>
  );
}
