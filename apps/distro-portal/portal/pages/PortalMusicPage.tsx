'use client';

import { useState } from 'react';
import { useRouter } from '@/lib/router';
import { Disc3, Music, Search } from 'lucide-react';
import { formatDate, formatCents } from '@/lib/format';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Form';
import { mockReleases } from '@/lib/mock-data';

export default function PortalMusicPage() {
  const { navigate } = useRouter();
  const [search, setSearch] = useState('');
  const [genreFilter, setGenreFilter] = useState('all');

  const releases = mockReleases.filter((r) => r.status === 'live' || r.status === 'submitted');
  const genres = [...new Set(releases.map((r) => r.genre).filter(Boolean))] as string[];

  const filtered = releases.filter((r) => {
    if (genreFilter !== 'all' && r.genre !== genreFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return r.title.toLowerCase().includes(q) || (r.genre?.toLowerCase().includes(q) ?? false);
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-3xl font-bold text-white mb-6">Music</h1>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <Input placeholder="Search releases…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 bg-white/5 border-white/10 text-white" />
        </div>
        {genres.length > 0 && (
          <select value={genreFilter} onChange={(e) => setGenreFilter(e.target.value)} className="bg-white/5 border border-white/10 text-white rounded-lg px-3 py-2 text-sm">
            <option value="all">All Genres</option>
            {genres.map((g) => <option key={g} value={g}>{g}</option>)}
          </select>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <Music size={48} className="text-white/10 mx-auto mb-4" />
          <p className="text-white/30">No releases available</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((r) => (
            <button key={r.id} onClick={() => navigate(`/portal/music/${r.id}`)} className="group rounded-xl overflow-hidden bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
              <div className="aspect-square bg-gradient-to-br from-neutral-700 to-neutral-900 flex items-center justify-center overflow-hidden">
                <Disc3 size={40} className="text-white/20 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <div className="p-3">
                <p className="text-sm font-semibold text-white truncate">{r.title}</p>
                <p className="text-xs text-white/40 mt-0.5">{formatDate(r.release_date)}</p>
                <div className="flex items-center gap-1.5 mt-2">
                  {r.is_free ? <Badge color="green">Free</Badge> : r.price_cents > 0 ? <Badge color="blue">{formatCents(r.price_cents)}</Badge> : null}
                  {r.explicit && <span className="text-xs text-white/30">E</span>}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
