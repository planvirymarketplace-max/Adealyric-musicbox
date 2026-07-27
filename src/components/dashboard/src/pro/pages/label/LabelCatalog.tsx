'use client';

import { useState } from 'react';
import { useRouter } from '@/lib/router';
import { useSyncSearch } from '@/hooks/queries';
import { useProAuth } from '@/lib/auth';
import { formatCents, formatDate } from '@/lib/format';
import { Badge, StatusBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, StatCard } from '@/components/ui/Card';
import { PageHeader } from '@/components/layout/PageHeader';
import { mockCatalogSongs } from '@/lib/mock-data';
import { Drawer } from '@/components/ui/Drawer';
import { Search, Filter, X, Music, Play, ArrowUpRight, ChevronRight, CheckCircle2, Clock, AlertTriangle, SlidersHorizontal, FileText } from 'lucide-react';
import type { CatalogSong } from '@/types/database';

const GENRES = ['Electronic', 'Techno', 'Ambient', 'Hip-Hop', 'House', 'Pop', 'R&B'];
const MOODS = ['Uplifting', 'Energetic', 'Epic', 'Dreamy', 'Chill', 'Dark', 'Aggressive', 'Tense', 'Hopeful'];
const KEYS = ['C', 'D', 'E', 'F', 'G', 'A', 'B', 'Am', 'Cm', 'Dm', 'Em', 'Fm', 'Gm', 'Bm'];
const CLEARANCE_OPTIONS = ['One-stop', 'Co-clearance needed', 'Either'];

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

function syncStatusLabel(status: string): string {
  const map: Record<string, string> = { available: 'Available', on_hold: 'On Hold', licensed: 'Licensed', not_for_sync: 'Not for Sync' };
  return map[status] ?? status;
}

export default function LabelCatalog() {
  const { navigate } = useRouter();
  const { portalUser } = useProAuth();
  const [search, setSearch] = useState('');
  const [genreFilter, setGenreFilter] = useState<string[]>([]);
  const [moodFilter, setMoodFilter] = useState<string[]>([]);
  const [clearanceFilter, setClearanceFilter] = useState('');
  const [selectedSong, setSelectedSong] = useState<CatalogSong | null>(null);

  const catalogQuery = useSyncSearch();

  const catalog = (catalogQuery.data ?? mockCatalogSongs).filter(s => s.sync_status !== 'not_for_sync');

  const filtered = catalog.filter(song => {
    if (search && !song.title.toLowerCase().includes(search.toLowerCase()) && !song.genre.toLowerCase().includes(search.toLowerCase())) return false;
    if (genreFilter.length > 0 && !genreFilter.includes(song.genre)) return false;
    if (moodFilter.length > 0 && !(song.mood_tags ?? []).some(m => moodFilter.includes(m))) return false;
    if (clearanceFilter === 'One-stop' && song.clearance_type !== 'one_stop') return false;
    if (clearanceFilter === 'Co-clearance needed' && song.clearance_type === 'one_stop') return false;
    return true;
  });

  const toggleArrayFilter = (arr: string[], val: string): string[] => arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val];

  return (
    <div>
      <PageHeader title="Sync Catalog" description="Browse songs available for sync licensing with metadata, clearance status, and audio preview." />

      {/* Search & filter bar */}
      <Card className="p-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by title or genre…" className="w-full rounded-lg border border-neutral-200 bg-white pl-9 pr-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-300" />
          </div>
          <div className="flex items-center gap-2">
            <select value={clearanceFilter} onChange={(e) => setClearanceFilter(e.target.value)} className="text-sm bg-white border border-neutral-200 rounded-lg px-3 py-2">
              <option value="">All Clearance</option>
              {CLEARANCE_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        {/* Genre chips */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {GENRES.map(g => (
            <button key={g} onClick={() => setGenreFilter(toggleArrayFilter(genreFilter, g))} className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${genreFilter.includes(g) ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'}`}>
              {g}
            </button>
          ))}
        </div>

        {/* Mood chips */}
        <div className="flex flex-wrap gap-1.5 mt-2">
          {MOODS.map(m => (
            <button key={m} onClick={() => setMoodFilter(toggleArrayFilter(moodFilter, m))} className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${moodFilter.includes(m) ? 'bg-violet-600 text-white' : 'bg-violet-50 text-violet-600 hover:bg-violet-100'}`}>
              {m}
            </button>
          ))}
        </div>

        {(genreFilter.length > 0 || moodFilter.length > 0 || clearanceFilter) && (
          <button onClick={() => { setGenreFilter([]); setMoodFilter([]); setClearanceFilter(''); }} className="text-xs text-neutral-500 hover:text-neutral-900 mt-2 flex items-center gap-1"><X size={12} /> Clear filters</button>
        )}
      </Card>

      {/* Results */}
      <p className="text-sm text-neutral-500 mb-3">{filtered.length} tracks found</p>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <Card className="p-8">
            <div className="flex flex-col items-center text-center">
              <Music size={32} className="text-neutral-300 mb-3" />
              <p className="text-sm font-medium text-neutral-900">No tracks match your filters</p>
              <p className="text-sm text-neutral-500 mt-1">Try adjusting genre, mood, or clearance filters.</p>
            </div>
          </Card>
        ) : (
          filtered.map(song => (
            <Card key={song.id} className="p-4 hover:shadow-md transition-shadow cursor-pointer" onClick={() => setSelectedSong(song)}>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-neutral-100 flex items-center justify-center flex-shrink-0">
                  <Music size={20} className="text-neutral-300" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-neutral-900">{song.title}</p>
                    <div className="flex items-center gap-2">
                      <Badge color={song.sync_status === 'available' ? 'green' : song.sync_status === 'on_hold' ? 'amber' : 'gray'}>{syncStatusLabel(song.sync_status)}</Badge>
                      {song.clearance_type === 'one_stop' && <Badge color="teal">One-Stop</Badge>}
                    </div>
                  </div>
                  <p className="text-xs text-neutral-500 mt-0.5">{song.genre} · {song.bpm} BPM · {song.key} · {formatDuration(song.duration_seconds)}</p>
                  {(song.mood_tags ?? []).length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1.5">{(song.mood_tags ?? []).map(m => <Badge key={m} color="purple" size="sm">{m}</Badge>)}</div>
                  )}
                  {song.description && <p className="text-xs text-neutral-500 mt-1 line-clamp-1">{song.description}</p>}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Song detail drawer */}
      {selectedSong && (
        <Drawer open={true} onClose={() => setSelectedSong(null)} title="Track Details">
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-neutral-900">{selectedSong.title}</h2>
            <div className="flex items-center gap-2">
              <Badge color={selectedSong.sync_status === 'available' ? 'green' : 'gray'}>{syncStatusLabel(selectedSong.sync_status)}</Badge>
              {selectedSong.clearance_type === 'one_stop' && <Badge color="teal">One-Stop Clearance</Badge>}
              {selectedSong.explicit && <Badge color="red">Explicit</Badge>}
              {selectedSong.stems_available && <Badge color="blue">Stems Available</Badge>}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-neutral-50"><p className="text-xs text-neutral-400">Genre</p><p className="text-sm text-neutral-900">{selectedSong.genre}</p></div>
              <div className="p-3 rounded-lg bg-neutral-50"><p className="text-xs text-neutral-400">BPM</p><p className="text-sm text-neutral-900">{selectedSong.bpm ?? '—'}</p></div>
              <div className="p-3 rounded-lg bg-neutral-50"><p className="text-xs text-neutral-400">Key</p><p className="text-sm text-neutral-900">{selectedSong.key ?? '—'}</p></div>
              <div className="p-3 rounded-lg bg-neutral-50"><p className="text-xs text-neutral-400">Duration</p><p className="text-sm text-neutral-900">{formatDuration(selectedSong.duration_seconds)}</p></div>
            </div>
            {(selectedSong.mood_tags ?? []).length > 0 && (
              <div className="flex flex-wrap gap-1.5">{(selectedSong.mood_tags ?? []).map(m => <Badge key={m} color="purple">{m}</Badge>)}</div>
            )}
            {selectedSong.description && <p className="text-sm text-neutral-600">{selectedSong.description}</p>}
            <div className="flex items-center gap-2 pt-2 border-t border-neutral-200">
              <Button variant="primary" className="w-full" disabled={selectedSong.sync_status !== 'available'}>Request License</Button>
            </div>
          </div>
        </Drawer>
      )}
    </div>
  );
}
