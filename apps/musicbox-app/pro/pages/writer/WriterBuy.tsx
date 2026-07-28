'use client';

import { Music, DollarSign } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatCents } from '@/lib/format';
import { mockCatalogSongs } from '@/lib/mock-data';

export default function WriterBuy() {
  const songs = mockCatalogSongs.filter((s) => s.for_sale && s.visible_to_roles.includes('writer'));

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-white">Buy a Song</h1><p className="mt-1 text-sm text-white/50">Songs available for outright purchase</p></div>
      <div className="space-y-3">
        {songs.length === 0 ? <p className="text-white/30 text-center py-12">No songs for sale right now</p> : (
          songs.map((song) => (
            <div key={song.id} className="bg-white/5 border border-white/10 rounded-xl p-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0"><Music size={20} className="text-white/30" /></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white">{song.title}</p>
                  <p className="text-xs text-white/40">{song.genre} · {song.bpm} BPM</p>
                  {song.description && <p className="text-xs text-white/50 mt-1 line-clamp-2">{song.description}</p>}
                </div>
                <div className="flex-shrink-0 text-right">
                  <p className="text-lg font-bold text-white">{song.asking_price ? formatCents(song.asking_price) : '—'}</p>
                  {song.asking_price_negotiable && <Badge color="amber" size="sm">Negotiable</Badge>}
                  <Button size="sm" variant="primary" className="mt-2 bg-white text-neutral-900 hover:bg-white/90"><DollarSign size={12} /> Make Offer</Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
