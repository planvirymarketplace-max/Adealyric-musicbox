'use client';

import { useState, useMemo } from 'react';
import { useRouter } from '@/lib/router';
import { useSyncSearch, useRightsRecords } from '@/hooks/queries';
import { formatCents, formatDate } from '@/lib/format';
import { Card, StatCard } from '@/components/ui/Card';
import { Badge, StatusBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Field, Input, Select, Textarea } from '@/components/ui/Form';
import { Drawer } from '@/components/ui/Drawer';
import { PageHeader } from '@/components/layout/PageHeader';
import { LoadingState, ErrorState } from '@/components/ui/States';
import { Search, Filter, X, Music, Play, ArrowUpRight, ChevronRight, CheckCircle2, Clock, AlertTriangle, SlidersHorizontal, FileText } from 'lucide-react';
import { mockCatalogSongs } from '@/lib/mock-data';
import { ensureArray } from '@/lib/ensure-array';
import type { CatalogSong } from '@/types/database';

const GENRES = ['Electronic', 'Techno', 'Ambient', 'Hip-Hop', 'House', 'Pop', 'R&B'];
const MOODS = ['Uplifting', 'Energetic', 'Epic', 'Dreamy', 'Chill', 'Dark', 'Aggressive', 'Tense', 'Hopeful'];
const KEYS = ['C', 'D', 'E', 'F', 'G', 'A', 'B', 'Am', 'Cm', 'Dm', 'Em', 'Fm', 'Gm', 'Bm'];
const VOCAL_TYPES = ['Male', 'Female', 'Mixed', 'Instrumental'];
const EXPLICIT_OPTIONS = ['Clean', 'Explicit', 'Either'];
const CLEARANCE_OPTIONS = ['One-stop', 'Co-clearance needed', 'Either'];
const TERRITORIES = ['Worldwide', 'US', 'UK/EU', 'North America', 'Asia'];
const VERSIONS = ['Stems', 'Instrumental', 'TV Mix'];

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

function syncStatusLabel(status: string): string {
  const map: Record<string, string> = { available: 'Available', on_hold: 'On Hold', licensed: 'Licensed', cleared: 'Cleared' };
  return map[status] ?? status;
}

function syncStatusColor(status: string): 'green' | 'amber' | 'red' | 'gray' | 'teal' {
  const map: Record<string, 'green' | 'amber' | 'red' | 'gray' | 'teal'> = {
    available: 'green', on_hold: 'amber', licensed: 'teal', cleared: 'teal',
  };
  return map[status] ?? 'gray';
}

interface SearchFilters {
  genre: string;
  moods: string[];
  bpmMin: string;
  bpmMax: string;
  key: string;
  vocalType: string;
  explicitStatus: string;
  clearanceStatus: string;
  territory: string;
  versions: string[];
  query: string;
}

function ClearanceInfo({ song }: { song: CatalogSong }) {
  const rightsQuery = useRightsRecords(song.id);
  const rights = rightsQuery.data ?? [];
  const syncRights = rights.filter(r => r.rights_type === 'sync');
  const masterRights = rights.filter(r => r.rights_type === 'master');
  const publishingRights = rights.filter(r => r.rights_type === 'publishing');

  const isOneStop = syncRights.some(r =>
    r.notes?.toLowerCase().includes('one-stop') &&
    r.ownership_pct === 100
  );

  if (rightsQuery.isLoading) return <div className="mt-4 p-4 rounded-lg bg-neutral-50 border border-neutral-200"><LoadingState label="Loading rights data…" /></div>;

  return (
    <div className="mt-4 p-4 rounded-lg bg-neutral-50 border border-neutral-200">
      <h4 className="text-sm font-semibold text-neutral-900 mb-3">Rights & Clearance</h4>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          {isOneStop ? (
            <Badge color="green">One-Stop Clearance</Badge>
          ) : (
            <Badge color="amber">Co-Clearance Required</Badge>
          )}
        </div>
        {masterRights.length > 0 && (
          <div className="text-xs text-neutral-600">
            <span className="font-medium">Master:</span> {masterRights.map(r => `${r.owner} (${r.ownership_pct}%)`).join(', ')}
          </div>
        )}
        {publishingRights.length > 0 && (
          <div className="text-xs text-neutral-600">
            <span className="font-medium">Publishing:</span> {publishingRights.map(r => `${r.owner} (${r.ownership_pct}%)`).join(', ')}
          </div>
        )}
        {syncRights.map(r => (
          <div key={r.id} className="text-xs text-neutral-500">{r.notes}</div>
        ))}
      </div>
    </div>
  );
}

export function SyncSearchPage() {
  const { navigate } = useRouter();
  const [filters, setFilters] = useState<SearchFilters>({
    genre: '', moods: [], bpmMin: '', bpmMax: '', key: '',
    vocalType: '', explicitStatus: 'Either', clearanceStatus: 'Either',
    territory: '', versions: [], query: '',
  });
  const [showFilters, setShowFilters] = useState(true);
  const [selectedSong, setSelectedSong] = useState<CatalogSong | null>(null);
  const [showLicenseForm, setShowLicenseForm] = useState(false);

  // Build the query filters object from the SearchFilters state
  const queryFilters = useMemo(() => {
    const f: Record<string, unknown> = {};
    if (filters.query) f.query = filters.query;
    if (filters.genre) f.genre = filters.genre;
    if (filters.moods.length > 0) f.moods = filters.moods.join(',');
    if (filters.bpmMin) f.bpmMin = Number(filters.bpmMin);
    if (filters.bpmMax) f.bpmMax = Number(filters.bpmMax);
    if (filters.key) f.key = filters.key;
    if (filters.vocalType) f.vocalType = filters.vocalType;
    if (filters.explicitStatus !== 'Either') f.explicitStatus = filters.explicitStatus;
    if (filters.clearanceStatus !== 'Either') f.clearanceStatus = filters.clearanceStatus;
    if (filters.territory) f.territory = filters.territory;
    if (filters.versions.length > 0) f.versions = filters.versions.join(',');
    return f;
  }, [filters]);

  const catalogQuery = useSyncSearch(queryFilters);

  const catalog = ensureArray(catalogQuery.data, mockCatalogSongs);

  // Client-side filtering for fields the API may not handle
  const filteredResults = useMemo(() => {
    return catalog.filter(song => {
      // Vocal type (instrumental = no language/lyrics)
      if (filters.vocalType === 'Instrumental' && song.language) return false;
      if (filters.vocalType === 'Male' || filters.vocalType === 'Female' || filters.vocalType === 'Mixed') {
        if (!song.language) return false;
      }
      // Explicit
      if (filters.explicitStatus === 'Clean' && song.explicit) return false;
      if (filters.explicitStatus === 'Explicit' && !song.explicit) return false;
      // Versions
      if (filters.versions.includes('Stems') && !song.stems_available) return false;
      // Only show sync-available tracks
      if (!song.is_active) return false;
      return true;
    });
  }, [filters, catalog]);

  if (catalogQuery.isLoading) return <div><PageHeader title="Advanced Sync Search" description="Search the catalog with structured filters to find the perfect track for your sync need." /><LoadingState label="Searching catalog…" /></div>;
  if (catalogQuery.error) return <div><PageHeader title="Advanced Sync Search" /><ErrorState message={`Search failed: ${(catalogQuery.error as any).error || 'Unknown error'}`} /></div>;

  const toggleMood = (mood: string) => {
    setFilters(f => ({
      ...f,
      moods: f.moods.includes(mood) ? f.moods.filter(m => m !== mood) : [...f.moods, mood],
    }));
  };

  const toggleVersion = (ver: string) => {
    setFilters(f => ({
      ...f,
      versions: f.versions.includes(ver) ? f.versions.filter(v => v !== ver) : [...f.versions, ver],
    }));
  };

  const clearFilters = () => {
    setFilters({
      genre: '', moods: [], bpmMin: '', bpmMax: '', key: '',
      vocalType: '', explicitStatus: 'Either', clearanceStatus: 'Either',
      territory: '', versions: [], query: '',
    });
  };

  const activeFilterCount = [
    filters.genre, filters.key, filters.vocalType,
    filters.explicitStatus !== 'Either' ? filters.explicitStatus : '',
    filters.clearanceStatus !== 'Either' ? filters.clearanceStatus : '',
    filters.territory, filters.bpmMin, filters.bpmMax,
    ...filters.moods, ...filters.versions,
  ].filter(Boolean).length;

  return (
    <div>
      <PageHeader title="Advanced Sync Search" description="Search the catalog with structured filters to find the perfect track for your sync need." actions={
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={clearFilters} className={activeFilterCount > 0 ? 'text-neutral-900' : ''}>
            <X size={14} /> Clear {activeFilterCount > 0 ? `(${activeFilterCount})` : ''}
          </Button>
          <Button variant="secondary" size="sm" onClick={() => setShowFilters(!showFilters)}>
            <SlidersHorizontal size={14} /> {showFilters ? 'Hide Filters' : 'Show Filters'}
          </Button>
        </div>
      } />

      {/* Search query */}
      <div className="mb-4">
        <div className="relative max-w-xl">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <Input
            value={filters.query}
            onChange={e => setFilters(f => ({ ...f, query: e.target.value }))}
            placeholder="Quick search by title, genre, mood..."
            className="pl-10 text-base"
          />
        </div>
      </div>

      {/* Filter panel */}
      {showFilters && (
        <Card className="p-5 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {/* Genre */}
            <Field label="Genre">
              <Select value={filters.genre} onChange={e => setFilters(f => ({ ...f, genre: e.target.value }))}>
                <option value="">All Genres</option>
                {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
              </Select>
            </Field>

            {/* BPM Range */}
            <Field label="BPM Range" hint="60–180">
              <div className="flex gap-2">
                <Input type="number" placeholder="Min" value={filters.bpmMin} onChange={e => setFilters(f => ({ ...f, bpmMin: e.target.value }))} className="w-1/2" />
                <Input type="number" placeholder="Max" value={filters.bpmMax} onChange={e => setFilters(f => ({ ...f, bpmMax: e.target.value }))} className="w-1/2" />
              </div>
            </Field>

            {/* Key */}
            <Field label="Musical Key">
              <Select value={filters.key} onChange={e => setFilters(f => ({ ...f, key: e.target.value }))}>
                <option value="">All Keys</option>
                {KEYS.map(k => <option key={k} value={k}>{k}</option>)}
              </Select>
            </Field>

            {/* Vocal Type */}
            <Field label="Vocal Type">
              <Select value={filters.vocalType} onChange={e => setFilters(f => ({ ...f, vocalType: e.target.value }))}>
                <option value="">Any</option>
                {VOCAL_TYPES.map(v => <option key={v} value={v}>{v}</option>)}
              </Select>
            </Field>

            {/* Explicit Status */}
            <Field label="Explicit Status">
              <Select value={filters.explicitStatus} onChange={e => setFilters(f => ({ ...f, explicitStatus: e.target.value }))}>
                {EXPLICIT_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
              </Select>
            </Field>

            {/* Clearance Status */}
            <Field label="Clearance Status">
              <Select value={filters.clearanceStatus} onChange={e => setFilters(f => ({ ...f, clearanceStatus: e.target.value }))}>
                {CLEARANCE_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
              </Select>
            </Field>

            {/* Territory */}
            <Field label="Territory">
              <Select value={filters.territory} onChange={e => setFilters(f => ({ ...f, territory: e.target.value }))}>
                <option value="">All Territories</option>
                {TERRITORIES.map(t => <option key={t} value={t}>{t}</option>)}
              </Select>
            </Field>
          </div>

          {/* Mood tags */}
          <Field label="Mood Tags" className="mt-4">
            <div className="flex flex-wrap gap-2">
              {MOODS.map(mood => (
                <button
                  key={mood}
                  onClick={() => toggleMood(mood)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    filters.moods.includes(mood)
                      ? 'bg-neutral-900 text-white'
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                  }`}
                >
                  {mood}
                </button>
              ))}
            </div>
          </Field>

          {/* Available versions */}
          <Field label="Available Versions" className="mt-4">
            <div className="flex flex-wrap gap-2">
              {VERSIONS.map(ver => (
                <button
                  key={ver}
                  onClick={() => toggleVersion(ver)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    filters.versions.includes(ver)
                      ? 'bg-neutral-900 text-white'
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                  }`}
                >
                  {ver}
                </button>
              ))}
            </div>
          </Field>
        </Card>
      )}

      {/* Results summary */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-neutral-500">{filteredResults.length} tracks found</p>
        {activeFilterCount > 0 && <p className="text-xs text-neutral-400">{activeFilterCount} filters active</p>}
      </div>

      {/* Results table */}
      {filteredResults.length === 0 ? (
        <Card className="p-8">
          <div className="flex flex-col items-center justify-center text-center">
            <Search size={32} className="text-neutral-300 mb-3" />
            <p className="text-sm font-medium text-neutral-900">No tracks match your filters</p>
            <p className="text-sm text-neutral-500 mt-1">Try adjusting your search criteria</p>
            <Button variant="secondary" size="sm" className="mt-3" onClick={clearFilters}>Clear All Filters</Button>
          </div>
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50">
                  <th className="text-left py-3 px-4 font-medium text-neutral-500">Title</th>
                  <th className="text-left py-3 px-4 font-medium text-neutral-500">Genre</th>
                  <th className="text-left py-3 px-4 font-medium text-neutral-500">BPM</th>
                  <th className="text-left py-3 px-4 font-medium text-neutral-500">Key</th>
                  <th className="text-left py-3 px-4 font-medium text-neutral-500">Duration</th>
                  <th className="text-left py-3 px-4 font-medium text-neutral-500">Sync Status</th>
                  <th className="text-left py-3 px-4 font-medium text-neutral-500">Clearance</th>
                  <th className="text-left py-3 px-4 font-medium text-neutral-500"></th>
                </tr>
              </thead>
              <tbody>
                {filteredResults.map(song => {
                  // Use inline rights data from the song for quick clearance indicator in table
                  // Full rights data loads in the drawer via ClearanceInfo hook
                  const isOneStopFromSearch = song.sync_status === 'available';
                  return (
                    <tr
                      key={song.id}
                      className="border-b border-neutral-100 hover:bg-neutral-50 cursor-pointer transition-colors"
                      onClick={() => setSelectedSong(song)}
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded bg-gradient-to-br from-neutral-200 to-neutral-300 flex items-center justify-center">
                            <Music size={14} className="text-neutral-500" />
                          </div>
                          <div>
                            <p className="font-medium text-neutral-900">{song.title}</p>
                            <p className="text-xs text-neutral-500">{song.mood_tags.slice(0, 3).join(', ')}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4"><Badge color="gray">{song.genre}</Badge></td>
                      <td className="py-3 px-4 text-neutral-600">{song.bpm ?? '—'}</td>
                      <td className="py-3 px-4 text-neutral-600">{song.key ?? '—'}</td>
                      <td className="py-3 px-4 text-neutral-600">{formatDuration(song.duration_seconds)}</td>
                      <td className="py-3 px-4"><Badge color={syncStatusColor(song.sync_status)}>{syncStatusLabel(song.sync_status)}</Badge></td>
                      <td className="py-3 px-4">{isOneStopFromSearch ? <Badge color="green">One-Stop</Badge> : <Badge color="amber">Co-Clearance</Badge>}</td>
                      <td className="py-3 px-4">
                        <ChevronRight size={16} className="text-neutral-400" />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Detail drawer */}
      {selectedSong && (
        <Drawer
          open={!!selectedSong}
          onClose={() => { setSelectedSong(null); setShowLicenseForm(false); }}
          title={selectedSong.title}
          width="max-w-2xl"
        >
          {!showLicenseForm ? (
            <div className="space-y-6">
              {/* Audio preview area */}
              <div className="p-4 rounded-lg bg-neutral-100 border border-neutral-200 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-neutral-900 flex items-center justify-center">
                  <Play size={16} className="text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-900">Watermarked Preview</p>
                  <p className="text-xs text-neutral-500">{formatDuration(selectedSong.duration_seconds)} · {selectedSong.genre} · {selectedSong.bpm} BPM</p>
                </div>
                <Badge color="amber" size="md">Watermarked</Badge>
              </div>

              {/* Creative metadata */}
              <div>
                <h4 className="text-sm font-semibold text-neutral-900 mb-3">Creative Metadata</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-neutral-50">
                    <p className="text-xs text-neutral-400">Description</p>
                    <p className="text-sm text-neutral-900">{selectedSong.description ?? '—'}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-neutral-50">
                    <p className="text-xs text-neutral-400">Genre / Subgenre</p>
                    <p className="text-sm text-neutral-900">{selectedSong.genre}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-neutral-50">
                    <p className="text-xs text-neutral-400">Mood Descriptors</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedSong.mood_tags.map(m => <Badge key={m} color="gray" size="sm">{m}</Badge>)}
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-neutral-50">
                    <p className="text-xs text-neutral-400">Tempo</p>
                    <p className="text-sm text-neutral-900">{selectedSong.bpm} BPM</p>
                  </div>
                  <div className="p-3 rounded-lg bg-neutral-50">
                    <p className="text-xs text-neutral-400">Key</p>
                    <p className="text-sm text-neutral-900">{selectedSong.key ?? '—'} · {selectedSong.time_signature}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-neutral-50">
                    <p className="text-xs text-neutral-400">Energy / Valence</p>
                    <p className="text-sm text-neutral-900">{selectedSong.energy ?? '—'} / {selectedSong.valence ?? '—'}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-neutral-50">
                    <p className="text-xs text-neutral-400">Vocal Type</p>
                    <p className="text-sm text-neutral-900">{selectedSong.language ? `${selectedSong.language} vocals` : 'Instrumental'}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-neutral-50">
                    <p className="text-xs text-neutral-400">Explicit / Clean</p>
                    <p className="text-sm text-neutral-900">{selectedSong.explicit ? 'Explicit' : 'Clean'}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-neutral-50">
                    <p className="text-xs text-neutral-400">Instrumentation</p>
                    <p className="text-sm text-neutral-900">
                      Composers: {selectedSong.composer.join(', ')}<br />
                      Producers: {selectedSong.producer.join(', ')}
                      {selectedSong.mix_engineer && <><br />Mix: {selectedSong.mix_engineer}</>}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-neutral-50">
                    <p className="text-xs text-neutral-400">Song Structure</p>
                    <p className="text-sm text-neutral-900">{selectedSong.version_label ?? 'Original'} · {formatDuration(selectedSong.duration_seconds)}</p>
                  </div>
                </div>
              </div>

              {/* Available versions */}
              <div>
                <h4 className="text-sm font-semibold text-neutral-900 mb-3">Available Versions</h4>
                <div className="flex flex-wrap gap-2">
                  <Badge color="gray" size="md">Original ({formatDuration(selectedSong.duration_seconds)})</Badge>
                  {selectedSong.stems_available && <Badge color="teal" size="md">Stems Available</Badge>}
                  {!selectedSong.language && <Badge color="teal" size="md">Instrumental</Badge>}
                  <Badge color="gray" size="md">TV Mix</Badge>
                  <Badge color="gray" size="md">30s Edit</Badge>
                  <Badge color="gray" size="md">60s Edit</Badge>
                </div>
              </div>

              {/* Rights & Clearance */}
              <ClearanceInfo song={selectedSong} />

              {/* Territory & exclusivity */}
              <div>
                <h4 className="text-sm font-semibold text-neutral-900 mb-3">Territory & Exclusivity</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-neutral-50">
                    <p className="text-xs text-neutral-400">Territory Restrictions</p>
                    <p className="text-sm text-neutral-900">Worldwide</p>
                  </div>
                  <div className="p-3 rounded-lg bg-neutral-50">
                    <p className="text-xs text-neutral-400">Exclusivity Status</p>
                    <p className="text-sm text-neutral-900">Non-exclusive available</p>
                  </div>
                </div>
              </div>

              {/* Pricing */}
              {selectedSong.asking_price && (
                <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                  <p className="text-xs text-green-600 font-medium">Asking Price</p>
                  <p className="text-lg font-semibold text-green-900">{formatCents(selectedSong.asking_price * 100)}</p>
                  {selectedSong.asking_price_negotiable && <Badge color="green" size="sm">Negotiable</Badge>}
                </div>
              )}

              {/* Action buttons */}
              <div className="flex items-center gap-3 pt-4">
                <Button variant="primary" onClick={() => setShowLicenseForm(true)}>
                  <FileText size={16} /> Request License
                </Button>
                <Button variant="secondary" onClick={() => navigate(`/sync/track/${selectedSong.id}`)}>
                  <ArrowUpRight size={16} /> Full Detail Page
                </Button>
              </div>
            </div>
          ) : (
            /* License request form */
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-neutral-900">Request License for "{selectedSong.title}"</h4>
              <Field label="Usage Type" required>
                <Select>
                  <option value="film">Film</option>
                  <option value="tv">TV</option>
                  <option value="ad">Ad / Commercial</option>
                  <option value="game">Video Game</option>
                  <option value="trailer">Trailer</option>
                  <option value="corporate">Corporate</option>
                  <option value="social">Social Media</option>
                </Select>
              </Field>
              <Field label="Territory" required>
                <Select>
                  <option value="Worldwide">Worldwide</option>
                  <option value="US">US</option>
                  <option value="UK/EU">UK/EU</option>
                  <option value="North America">North America</option>
                </Select>
              </Field>
              <Field label="Term (months)" required>
                <Input type="number" placeholder="e.g. 12" />
              </Field>
              <Field label="Media">
                <Select>
                  <option value="all">All Media</option>
                  <option value="theatrical">Theatrical</option>
                  <option value="streaming">Streaming</option>
                  <option value="broadcast">Broadcast</option>
                  <option value="digital">Digital</option>
                </Select>
              </Field>
              <Field label="Budget Range">
                <Input placeholder="e.g. $5k-$15k" />
              </Field>
              <Field label="Notes / Description">
                <Textarea placeholder="Describe your sync need..." rows={4} />
              </Field>
              <div className="flex items-center gap-3 pt-2">
                <Button variant="primary">Submit Request</Button>
                <Button variant="ghost" onClick={() => setShowLicenseForm(false)}>Cancel</Button>
              </div>
            </div>
          )}
        </Drawer>
      )}
    </div>
  );
}
