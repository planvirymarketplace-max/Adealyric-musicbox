'use client';

import { useState } from 'react';
import { Card, StatCard } from '@/components/ui/Card';
import { Badge, StatusBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { PageHeader } from '@/components/layout/PageHeader';
import { EmptyState } from '@/components/ui/States';
import { toast } from '@/components/ui/Toast';
import { BarChart3, DollarSign, TrendingUp, Globe, Music, Star, Heart, Filter, SlidersHorizontal, X } from 'lucide-react';

const formatCents = (cents: number) => `$${(cents / 100).toFixed(2)}`;

const DSP_LIST = ['Spotify', 'Apple Music', 'Amazon Music', 'YouTube Music', 'Tidal', 'Deezer', 'Pandora', 'SoundCloud'];
const GENRE_LIST = ['R&B/Soul', 'Pop', 'Electronic', 'Hip-Hop/Rap', 'Rock', 'Jazz', 'Country', 'Folk', 'Alternative', 'Latin'];
const TERRITORY_LIST = ['US', 'UK', 'EU', 'Canada', 'Australia', 'Japan', 'Brazil', 'Global'];
const METRIC_TYPES = [
  { key: 'all', label: 'All Metrics' },
  { key: 'revenue', label: 'Revenue' },
  { key: 'streams', label: 'Streams' },
  { key: 'sync_revenue', label: 'Sync Revenue' },
  { key: 'engagement', label: 'Engagement' },
];
const DATE_RANGES = [
  { key: '7d', label: 'Last 7 days' },
  { key: '30d', label: 'Last 30 days' },
  { key: '90d', label: 'Last 90 days' },
  { key: '1y', label: 'Last 12 months' },
  { key: 'all', label: 'All time' },
];

// ── Mock statements (per Section 13 + Section 10.3) ──
const MOCK_STATEMENTS = [
  { id: 's1', period: '2025-01', dsp_source: 'Spotify', total_streams: 142000, total_revenue_cents: 710000, territory: 'US', status: 'paid' },
  { id: 's2', period: '2025-01', dsp_source: 'Apple Music', total_streams: 58000, total_revenue_cents: 406000, territory: 'US', status: 'paid' },
  { id: 's3', period: '2025-02', dsp_source: 'Amazon Music', total_streams: 22000, total_revenue_cents: 132000, territory: 'US', status: 'finalized' },
  { id: 's4', period: '2025-02', dsp_source: 'YouTube Music', total_streams: 31000, total_revenue_cents: 155000, territory: 'Global', status: 'draft' },
  { id: 's5', period: '2025-03', dsp_source: 'Tidal', total_streams: 8500, total_revenue_cents: 59500, territory: 'US', status: 'finalized' },
  { id: 's6', period: '2025-03', dsp_source: 'Deezer', total_streams: 4200, total_revenue_cents: 25200, territory: 'EU', status: 'draft' },
  { id: 's7', period: '2025-04', dsp_source: 'Pandora', total_streams: 15000, total_revenue_cents: 90000, territory: 'US', status: 'paid' },
  { id: 's8', period: '2025-04', dsp_source: 'SoundCloud', total_streams: 9500, total_revenue_cents: 28500, territory: 'Global', status: 'finalized' },
];

const MOCK_RELEASES = [
  { id: 'r1', title: 'Midnight Echoes', genre: 'R&B/Soul', type: 'Album' },
  { id: 'r2', title: 'Urban Frequencies', genre: 'Electronic', type: 'EP' },
  { id: 'r3', title: 'Neon Dreams', genre: 'Pop', type: 'Single' },
];

const MOCK_SYNC_FEES = [
  { track_title: 'Midnight Echoes', fee_cents: 500000 },
  { track_title: 'Neon Dreams', fee_cents: 250000 },
];

export function AdminAnalyticsPage() {
  // ── Filter state ──
  const [filterDsp, setFilterDsp] = useState<string>('all');
  const [filterGenre, setFilterGenre] = useState<string>('all');
  const [filterTerritory, setFilterTerritory] = useState<string>('all');
  const [filterMetric, setFilterMetric] = useState<string>('all');
  const [filterDateRange, setFilterDateRange] = useState<string>('all');
  const [filterRelease, setFilterRelease] = useState<string>('all');
  const [filtersVisible, setFiltersVisible] = useState(true);

  // ── Apply filters ──
  const filteredStatements = MOCK_STATEMENTS.filter(s => {
    if (filterDsp !== 'all' && s.dsp_source !== filterDsp) return false;
    if (filterTerritory !== 'all' && s.territory !== filterTerritory) return false;
    return true;
  });

  const filteredSyncFees = filterGenre !== 'all'
    ? MOCK_SYNC_FEES.filter(f => {
        const rel = MOCK_RELEASES.find(r => r.title === f.track_title);
        return rel?.genre === filterGenre;
      })
    : MOCK_SYNC_FEES;

  // ── Computed analytics ──
  const revenueByDsp = filteredStatements.reduce((acc, s) => {
    if (!acc[s.dsp_source]) acc[s.dsp_source] = 0;
    acc[s.dsp_source] += s.total_revenue_cents;
    return acc;
  }, {} as Record<string, number>);

  const totalRevenue = filteredStatements.reduce((sum, s) => sum + s.total_revenue_cents, 0);
  const totalStreams = filteredStatements.reduce((sum, s) => sum + s.total_streams, 0);
  const maxDspRevenue = Math.max(...Object.values(revenueByDsp), 0);

  const revenueByGenre = filteredStatements.reduce((acc, s) => {
    const release = MOCK_RELEASES.find(r => r.genre === 'R&B/Soul');
    const genre = MOCK_RELEASES[0]?.genre ?? 'Unknown';
    // Distribute evenly for mock
    if (!acc['R&B/Soul']) acc['R&B/Soul'] = 0;
    if (!acc['Electronic']) acc['Electronic'] = 0;
    if (!acc['Pop']) acc['Pop'] = 0;
    acc['R&B/Soul'] += Math.round(s.total_revenue_cents * 0.45);
    acc['Electronic'] += Math.round(s.total_revenue_cents * 0.30);
    acc['Pop'] += Math.round(s.total_revenue_cents * 0.25);
    return acc;
  }, {} as Record<string, number>);

  const streamsByPeriod = filteredStatements.reduce((acc, s) => {
    if (!acc[s.period]) acc[s.period] = { streams: 0, revenue: 0 };
    acc[s.period].streams += s.total_streams;
    acc[s.period].revenue += s.total_revenue_cents;
    return acc;
  }, {} as Record<string, { streams: number; revenue: number }>);

  const streamsByTerritory = filteredStatements.reduce((acc, s) => {
    const territory = s.territory ?? 'Global';
    if (!acc[territory]) acc[territory] = 0;
    acc[territory] += s.total_streams;
    return acc;
  }, {} as Record<string, number>);

  const revenueByTrack = filteredSyncFees.reduce((acc, f) => {
    if (!acc[f.track_title]) acc[f.track_title] = 0;
    acc[f.track_title] += f.fee_cents;
    return acc;
  }, {} as Record<string, number>);

  const totalSyncRevenue = filteredSyncFees.reduce((sum, f) => sum + f.fee_cents, 0);

  // ── Metric visibility ──
  const showRevenue = filterMetric === 'all' || filterMetric === 'revenue';
  const showStreams = filterMetric === 'all' || filterMetric === 'streams';
  const showSyncRevenue = filterMetric === 'all' || filterMetric === 'sync_revenue';
  const showEngagement = filterMetric === 'all' || filterMetric === 'engagement';

  const activeFilterCount = [filterDsp, filterGenre, filterTerritory, filterMetric, filterDateRange, filterRelease].filter(v => v !== 'all').length;
  const clearAllFilters = () => {
    setFilterDsp('all'); setFilterGenre('all'); setFilterTerritory('all');
    setFilterMetric('all'); setFilterDateRange('all'); setFilterRelease('all');
  };

  return (
    <div>
      <PageHeader
        title="Analytics Dashboard"
        description="Revenue, streams, geographic, and engagement analytics across all platforms (System Architecture Section 13)."
        actions={
          <Button variant="secondary" onClick={() => setFiltersVisible(!filtersVisible)}>
            <SlidersHorizontal size={16} />
            {filtersVisible ? 'Hide Filters' : 'Show Filters'}
            {activeFilterCount > 0 && <Badge color="blue" size="sm" className="ml-1">{activeFilterCount}</Badge>}
          </Button>
        }
      />

      {filtersVisible && (
        <Card className="p-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-neutral-400" />
              <h3 className="text-sm font-semibold text-neutral-700">Attribute → Metric Filters</h3>
            </div>
            {activeFilterCount > 0 && (
              <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                <X size={14} /> Clear all ({activeFilterCount})
              </Button>
            )}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <div>
              <label className="text-xs font-medium text-neutral-500 mb-1 block">Platform (DSP)</label>
              <select value={filterDsp} onChange={e => setFilterDsp(e.target.value)} className="w-full bg-white border border-neutral-200 rounded-lg px-3 py-2 text-sm">
                <option value="all">All DSPs</option>
                {DSP_LIST.map(dsp => <option key={dsp} value={dsp}>{dsp}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-neutral-500 mb-1 block">Genre</label>
              <select value={filterGenre} onChange={e => setFilterGenre(e.target.value)} className="w-full bg-white border border-neutral-200 rounded-lg px-3 py-2 text-sm">
                <option value="all">All Genres</option>
                {GENRE_LIST.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-neutral-500 mb-1 block">Territory</label>
              <select value={filterTerritory} onChange={e => setFilterTerritory(e.target.value)} className="w-full bg-white border border-neutral-200 rounded-lg px-3 py-2 text-sm">
                <option value="all">All Territories</option>
                {TERRITORY_LIST.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-neutral-500 mb-1 block">Metric Type</label>
              <select value={filterMetric} onChange={e => setFilterMetric(e.target.value)} className="w-full bg-white border border-neutral-200 rounded-lg px-3 py-2 text-sm">
                {METRIC_TYPES.map(m => <option key={m.key} value={m.key}>{m.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-neutral-500 mb-1 block">Date Range</label>
              <select value={filterDateRange} onChange={e => setFilterDateRange(e.target.value)} className="w-full bg-white border border-neutral-200 rounded-lg px-3 py-2 text-sm">
                {DATE_RANGES.map(d => <option key={d.key} value={d.key}>{d.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-neutral-500 mb-1 block">Release</label>
              <select value={filterRelease} onChange={e => setFilterRelease(e.target.value)} className="w-full bg-white border border-neutral-200 rounded-lg px-3 py-2 text-sm">
                <option value="all">All Releases</option>
                {MOCK_RELEASES.map(r => <option key={r.id} value={r.id}>{r.title}</option>)}
              </select>
            </div>
          </div>
          {activeFilterCount > 0 && (
            <div className="mt-3 flex items-center gap-2 flex-wrap">
              <span className="text-xs text-neutral-400">Active:</span>
              {filterDsp !== 'all' && <Badge color="blue" size="sm">DSP: {filterDsp} <button onClick={() => setFilterDsp('all')} className="ml-1 hover:text-red-500"><X size={10} /></button></Badge>}
              {filterGenre !== 'all' && <Badge color="blue" size="sm">Genre: {filterGenre} <button onClick={() => setFilterGenre('all')} className="ml-1 hover:text-red-500"><X size={10} /></button></Badge>}
              {filterTerritory !== 'all' && <Badge color="blue" size="sm">Territory: {filterTerritory} <button onClick={() => setFilterTerritory('all')} className="ml-1 hover:text-red-500"><X size={10} /></button></Badge>}
              {filterMetric !== 'all' && <Badge color="blue" size="sm">Metric: {METRIC_TYPES.find(m => m.key === filterMetric)?.label} <button onClick={() => setFilterMetric('all')} className="ml-1 hover:text-red-500"><X size={10} /></button></Badge>}
              {filterDateRange !== 'all' && <Badge color="blue" size="sm">Range: {DATE_RANGES.find(d => d.key === filterDateRange)?.label} <button onClick={() => setFilterDateRange('all')} className="ml-1 hover:text-red-500"><X size={10} /></button></Badge>}
              {filterRelease !== 'all' && <Badge color="blue" size="sm">Release: {MOCK_RELEASES.find(r => r.id === filterRelease)?.title ?? filterRelease} <button onClick={() => setFilterRelease('all')} className="ml-1 hover:text-red-500"><X size={10} /></button></Badge>}
            </div>
          )}
        </Card>
      )}

      {/* Overview stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {showRevenue && <StatCard label="Total Revenue" value={formatCents(totalRevenue)} icon={<DollarSign size={28} />} trend="Across all DSPs" />}
        {showStreams && <StatCard label="Total Streams" value={totalStreams.toLocaleString()} icon={<BarChart3 size={28} />} />}
        {showSyncRevenue && <StatCard label="Sync Revenue" value={formatCents(totalSyncRevenue)} icon={<TrendingUp size={28} />} />}
        {showEngagement && <StatCard label="Active Catalog" value={MOCK_RELEASES.length} icon={<Music size={28} />} trend={`${MOCK_RELEASES.length} releases`} />}
      </div>

      {/* Revenue by DSP */}
      {showRevenue && (
        <Card className="p-5 mb-6">
          <h3 className="font-semibold text-neutral-900 mb-4">Revenue by DSP</h3>
          {Object.keys(revenueByDsp).length === 0 ? (
            <EmptyState title="No data" description="No revenue data for the selected filters." />
          ) : (
            <div className="space-y-3">
              {Object.entries(revenueByDsp).sort(([, a], [, b]) => b - a).map(([dsp, revenue]) => (
                <div key={dsp} className="flex items-center gap-3">
                  <p className="text-sm font-medium text-neutral-900 w-32">{dsp}</p>
                  <div className="flex-1 h-6 bg-neutral-100 rounded-full overflow-hidden">
                    <div className="h-6 bg-gradient-to-r from-neutral-700 to-neutral-500 rounded-full flex items-center px-3" style={{ width: `${maxDspRevenue > 0 ? (revenue / maxDspRevenue) * 100 : 0}%`, minWidth: '60px' }}>
                      <span className="text-xs font-medium text-white">{formatCents(revenue)}</span>
                    </div>
                  </div>
                  <p className="text-sm text-neutral-500 w-20">{totalRevenue > 0 ? ((revenue / totalRevenue) * 100).toFixed(1) : 0}%</p>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {/* Revenue by Genre */}
      {showRevenue && (
        <Card className="p-5 mb-6">
          <h3 className="font-semibold text-neutral-900 mb-4">Revenue by Genre</h3>
          {Object.keys(revenueByGenre).length === 0 ? (
            <EmptyState title="No data" description="No genre data for the selected filters." />
          ) : (
            <div className="space-y-3">
              {Object.entries(revenueByGenre).sort(([, a], [, b]) => b - a).map(([genre, revenue]) => {
                const maxGenreRevenue = Math.max(...Object.values(revenueByGenre), 0);
                return (
                  <div key={genre} className="flex items-center gap-3">
                    <p className="text-sm font-medium text-neutral-900 w-28">{genre}</p>
                    <div className="flex-1 h-6 bg-neutral-100 rounded-full overflow-hidden">
                      <div className="h-6 bg-gradient-to-r from-neutral-600 to-neutral-400 rounded-full flex items-center px-3" style={{ width: `${maxGenreRevenue > 0 ? (revenue / maxGenreRevenue) * 100 : 0}%`, minWidth: '60px' }}>
                        <span className="text-xs font-medium text-white">{formatCents(revenue)}</span>
                      </div>
                    </div>
                    <p className="text-sm text-neutral-500 w-20">{totalRevenue > 0 ? ((revenue / totalRevenue) * 100).toFixed(1) : 0}%</p>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      )}

      {/* Streams over time */}
      {showStreams && (
        <Card className="p-5 mb-6">
          <h3 className="font-semibold text-neutral-900 mb-4">Streams Over Time</h3>
          {Object.keys(streamsByPeriod).length === 0 ? (
            <EmptyState title="No data" description="No stream data for the selected filters." />
          ) : (
            <div className="flex items-end gap-2 h-32">
              {Object.entries(streamsByPeriod).sort(([a], [b]) => a.localeCompare(b)).map(([period, data]) => {
                const maxStreams = Math.max(...Object.values(streamsByPeriod).map(d => d.streams), 1);
                const height = (data.streams / maxStreams) * 100;
                return (
                  <div key={period} className="flex-1 flex flex-col items-center justify-end h-full">
                    <div className="w-full bg-gradient-to-t from-neutral-700 to-neutral-400 rounded-t-md" style={{ height: `${Math.max(height, 5)}%` }} />
                    <p className="text-xs text-neutral-500 mt-1">{period}</p>
                    <p className="text-xs text-neutral-400">{data.streams.toLocaleString()}</p>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      )}

      {/* Streams by Territory */}
      {showStreams && (
        <Card className="p-5 mb-6">
          <h3 className="font-semibold text-neutral-900 mb-4">Streams by Territory</h3>
          {Object.keys(streamsByTerritory).length === 0 ? (
            <EmptyState title="No data" />
          ) : (
            <div className="space-y-3">
              {Object.entries(streamsByTerritory).sort(([, a], [, b]) => b - a).map(([territory, streams]) => {
                const maxTerritoryStreams = Math.max(...Object.values(streamsByTerritory), 0);
                return (
                  <div key={territory} className="flex items-center gap-3">
                    <p className="text-sm font-medium text-neutral-900 w-28">{territory}</p>
                    <div className="flex-1 h-6 bg-neutral-100 rounded-full overflow-hidden">
                      <div className="h-6 bg-gradient-to-r from-neutral-500 to-neutral-300 rounded-full flex items-center px-3" style={{ width: `${maxTerritoryStreams > 0 ? (streams / maxTerritoryStreams) * 100 : 0}%`, minWidth: '60px' }}>
                        <span className="text-xs font-medium text-white">{streams.toLocaleString()} streams</span>
                      </div>
                    </div>
                    <p className="text-sm text-neutral-500 w-20">{totalStreams > 0 ? ((streams / totalStreams) * 100).toFixed(1) : 0}%</p>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      )}

      {/* Revenue by track (sync) */}
      {showRevenue && (
        <Card className="p-5 mb-6">
          <h3 className="font-semibold text-neutral-900 mb-4">Revenue by Track (Sync)</h3>
          {Object.keys(revenueByTrack).length === 0 ? (
            <EmptyState title="No sync revenue data" />
          ) : (
            <div className="space-y-3">
              {Object.entries(revenueByTrack).sort(([, a], [, b]) => b - a).map(([title, revenue]) => {
                const maxTrackRevenue = Math.max(...Object.values(revenueByTrack), 0);
                return (
                  <div key={title} className="flex items-center gap-3">
                    <p className="text-sm font-medium text-neutral-900 w-40">{title}</p>
                    <div className="flex-1 h-6 bg-neutral-100 rounded-full overflow-hidden">
                      <div className="h-6 bg-gradient-to-r from-neutral-600 to-neutral-400 rounded-full flex items-center px-3" style={{ width: `${maxTrackRevenue > 0 ? (revenue / maxTrackRevenue) * 100 : 0}%`, minWidth: '60px' }}>
                        <span className="text-xs font-medium text-white">{formatCents(revenue)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      )}

      {/* Engagement + Geography */}
      {(showStreams || showEngagement) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="p-5">
            <h3 className="font-semibold text-neutral-900 mb-4 flex items-center gap-2"><Globe size={18} className="text-neutral-400" /> Geographic Breakdown</h3>
            <div className="space-y-2">
              {[{ region: 'US', pct: 45 }, { region: 'UK/EU', pct: 30 }, { region: 'Asia', pct: 10 }, { region: 'Other', pct: 15 }].map(g => (
                <div key={g.region} className="flex items-center justify-between">
                  <p className="text-sm text-neutral-600">{g.region}</p>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-2 bg-neutral-200 rounded-full overflow-hidden"><div className="h-2 bg-neutral-600 rounded-full" style={{ width: `${g.pct}%` }} /></div>
                    <p className="text-sm text-neutral-900 font-medium">{g.pct}%</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
          <Card className="p-5">
            <h3 className="font-semibold text-neutral-900 mb-4 flex items-center gap-2"><Star size={18} className="text-neutral-400" /> Playlist Adds</h3>
            <div className="space-y-2">
              {[{ name: 'Spotify Editorial', count: 3 }, { name: 'Apple Music Curated', count: 2 }, { name: 'User Generated', count: 12 }].map(p => (
                <div key={p.name} className="flex items-center justify-between p-2 rounded-lg bg-neutral-50">
                  <p className="text-sm text-neutral-600">{p.name}</p>
                  <Badge color="gray" size="sm">{p.count} adds</Badge>
                </div>
              ))}
            </div>
          </Card>
          <Card className="p-5">
            <h3 className="font-semibold text-neutral-900 mb-4 flex items-center gap-2"><Heart size={18} className="text-neutral-400" /> Engagement Metrics</h3>
            <div className="space-y-2">
              {[{ label: 'Saves', value: '2,450' }, { label: 'Shazams', value: '890' }, { label: 'Shares', value: '156' }].map(e => (
                <div key={e.label} className="flex items-center justify-between p-2 rounded-lg bg-neutral-50">
                  <p className="text-sm text-neutral-600">{e.label}</p>
                  <p className="text-sm text-neutral-900 font-medium">{e.value}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
