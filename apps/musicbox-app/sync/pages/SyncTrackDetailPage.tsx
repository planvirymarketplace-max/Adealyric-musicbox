'use client';

import { useState } from 'react';
import { useRouter } from '@/lib/router';
import { useSong, useRightsRecords, useSplits, useSyncRequests } from '@/hooks/queries';
import { formatCents, formatDate, formatDateTime } from '@/lib/format';
import { Card, StatCard } from '@/components/ui/Card';
import { Badge, StatusBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Field, Input, Select, Textarea } from '@/components/ui/Form';
import { PageHeader } from '@/components/layout/PageHeader';
import { mockCatalogSongs, mockRightsRecords, mockRoyaltySplits, mockSyncLicenseRequests } from '@/lib/mock-data';
import { ensureArray } from '@/lib/ensure-array';
import { Music, Play, Pause, FileText, ArrowLeft, Clock, CheckCircle2, AlertTriangle, Shield, Globe, Users, DollarSign } from 'lucide-react';

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export function SyncTrackDetailPage() {
  const { path, navigate } = useRouter();
  const [showLicenseForm, setShowLicenseForm] = useState(false);

  // Extract track ID from hash path: /sync/track/cs-1
  const trackId = path.split('/sync/track/')[1]?.split('?')[0];

  const songQuery = useSong(trackId ?? '');
  const rightsQuery = useRightsRecords(trackId ?? '');
  const splitsQuery = useSplits(trackId ?? '');
  const syncRequestsQuery = useSyncRequests();

  const song = songQuery.data ?? mockCatalogSongs.find(s => s.id === trackId) ?? mockCatalogSongs[0];

  const rights = ensureArray(rightsQuery.data, mockRightsRecords).filter(r => r.catalog_song_id === song.id);
  const splits = ensureArray(splitsQuery.data, mockRoyaltySplits).filter(s => s.catalog_song_id === song.id);
  const allRequests = ensureArray(syncRequestsQuery.data, mockSyncLicenseRequests);
  const syncRequests = allRequests.filter(r => r.catalog_song_id === song.id);

  const masterRights = rights.filter(r => r.rights_type === 'master');
  const publishingRights = rights.filter(r => r.rights_type === 'publishing');
  const syncRights = rights.filter(r => r.rights_type === 'sync');

  const isOneStop = syncRights.some(r =>
    r.notes?.toLowerCase().includes('one-stop') && r.ownership_pct === 100
  );

  return (
    <div>
      <PageHeader
        title={song.title}
        description={`${song.genre} · ${song.bpm ?? '—'} BPM · ${song.key ?? '—'} · ${formatDuration(song.duration_seconds)}`}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => navigate('/sync/search')}>
              <ArrowLeft size={14} /> Back to Search
            </Button>
            <Button variant="primary" onClick={() => setShowLicenseForm(true)}>
              <FileText size={16} /> Request License
            </Button>
          </div>
        }
      />

      {!showLicenseForm ? (
        <div className="space-y-6">
          {/* Audio preview */}
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-neutral-200 to-neutral-300 flex items-center justify-center">
                <Music size={24} className="text-neutral-500" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-neutral-900 text-lg">{song.title}</h3>
                <p className="text-sm text-neutral-500">{song.album ?? 'Single'} · {song.version_label ?? 'Original'} · {song.recording_year ?? '—'}</p>
                <div className="flex items-center gap-2 mt-1">
                  {song.mood_tags.map(m => <Badge key={m} color="gray" size="sm">{m}</Badge>)}
                </div>
              </div>
              <Badge color="amber" size="md">Watermarked Preview</Badge>
            </div>
            <div className="mt-4 p-3 rounded-lg bg-neutral-50 flex items-center gap-3">
              <button className="w-10 h-10 rounded-full bg-neutral-900 flex items-center justify-center">
                <Play size={16} className="text-white" />
              </button>
              <div className="flex-1">
                <div className="h-1 bg-neutral-200 rounded-full">
                  <div className="h-1 bg-neutral-400 rounded-full w-0" />
                </div>
              </div>
              <span className="text-xs text-neutral-500">{formatDuration(song.duration_seconds)}</span>
            </div>
            {song.explicit && <Badge color="red" size="sm" className="mt-2">Explicit Content</Badge>}
          </Card>

          {/* Creative metadata grid */}
          <Card className="p-6">
            <h3 className="font-semibold text-neutral-900 mb-4">Creative Metadata</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-3 rounded-lg bg-neutral-50">
                <p className="text-xs text-neutral-400 mb-1">Description</p>
                <p className="text-sm text-neutral-900">{song.description ?? '—'}</p>
              </div>
              <div className="p-3 rounded-lg bg-neutral-50">
                <p className="text-xs text-neutral-400 mb-1">Genre / Subgenre</p>
                <p className="text-sm text-neutral-900">{song.genre}</p>
              </div>
              <div className="p-3 rounded-lg bg-neutral-50">
                <p className="text-xs text-neutral-400 mb-1">Mood Descriptors</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {song.mood_tags.map(m => <Badge key={m} color="gray" size="sm">{m}</Badge>)}
                </div>
              </div>
              <div className="p-3 rounded-lg bg-neutral-50">
                <p className="text-xs text-neutral-400 mb-1">Tempo (BPM)</p>
                <p className="text-sm text-neutral-900">{song.bpm ?? '—'} BPM</p>
              </div>
              <div className="p-3 rounded-lg bg-neutral-50">
                <p className="text-xs text-neutral-400 mb-1">Musical Key</p>
                <p className="text-sm text-neutral-900">{song.key ?? '—'}</p>
              </div>
              <div className="p-3 rounded-lg bg-neutral-50">
                <p className="text-xs text-neutral-400 mb-1">Time Signature</p>
                <p className="text-sm text-neutral-900">{song.time_signature ?? '—'}</p>
              </div>
              <div className="p-3 rounded-lg bg-neutral-50">
                <p className="text-xs text-neutral-400 mb-1">Energy Level</p>
                <p className="text-sm text-neutral-900">{song.energy ?? '—'} / 10</p>
              </div>
              <div className="p-3 rounded-lg bg-neutral-50">
                <p className="text-xs text-neutral-400 mb-1">Valence (Positivity)</p>
                <p className="text-sm text-neutral-900">{song.valence ?? '—'} / 10</p>
              </div>
              <div className="p-3 rounded-lg bg-neutral-50">
                <p className="text-xs text-neutral-400 mb-1">Vocal Type</p>
                <p className="text-sm text-neutral-900">{song.language ? `${song.language} vocals` : 'Instrumental'}</p>
              </div>
              <div className="p-3 rounded-lg bg-neutral-50">
                <p className="text-xs text-neutral-400 mb-1">Language</p>
                <p className="text-sm text-neutral-900">{song.language ?? 'Instrumental'}</p>
              </div>
              <div className="p-3 rounded-lg bg-neutral-50">
                <p className="text-xs text-neutral-400 mb-1">Explicit / Clean</p>
                <p className="text-sm text-neutral-900">{song.explicit ? 'Explicit' : 'Clean'}</p>
              </div>
              <div className="p-3 rounded-lg bg-neutral-50">
                <p className="text-xs text-neutral-400 mb-1">Song Structure</p>
                <p className="text-sm text-neutral-900">{song.version_label ?? 'Original'} · {formatDuration(song.duration_seconds)}</p>
              </div>
              <div className="p-3 rounded-lg bg-neutral-50">
                <p className="text-xs text-neutral-400 mb-1">Composer</p>
                <p className="text-sm text-neutral-900">{song.composer.join(', ')}</p>
              </div>
              <div className="p-3 rounded-lg bg-neutral-50">
                <p className="text-xs text-neutral-400 mb-1">Producer</p>
                <p className="text-sm text-neutral-900">{song.producer.join(', ')}</p>
              </div>
              <div className="p-3 rounded-lg bg-neutral-50">
                <p className="text-xs text-neutral-400 mb-1">Mix Engineer</p>
                <p className="text-sm text-neutral-900">{song.mix_engineer ?? '—'}</p>
              </div>
            </div>
          </Card>

          {/* Available versions */}
          <Card className="p-6">
            <h3 className="font-semibold text-neutral-900 mb-4">Available Versions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <div className="p-3 rounded-lg border border-neutral-200 bg-white flex items-center justify-between">
                <div><p className="text-sm font-medium text-neutral-900">Original</p><p className="text-xs text-neutral-500">{formatDuration(song.duration_seconds)}</p></div>
                <Badge color="green" size="sm">Available</Badge>
              </div>
              {!song.language && (
                <div className="p-3 rounded-lg border border-neutral-200 bg-white flex items-center justify-between">
                  <div><p className="text-sm font-medium text-neutral-900">Instrumental</p><p className="text-xs text-neutral-500">{formatDuration(song.duration_seconds)}</p></div>
                  <Badge color="green" size="sm">Available</Badge>
                </div>
              )}
              {song.stems_available && (
                <div className="p-3 rounded-lg border border-neutral-200 bg-white flex items-center justify-between">
                  <div><p className="text-sm font-medium text-neutral-900">Stems</p><p className="text-xs text-neutral-500">Individual tracks</p></div>
                  <Badge color="green" size="sm">Available</Badge>
                </div>
              )}
              <div className="p-3 rounded-lg border border-neutral-200 bg-white flex items-center justify-between">
                <div><p className="text-sm font-medium text-neutral-900">TV Mix</p><p className="text-xs text-neutral-500">Edited for broadcast</p></div>
                <Badge color="green" size="sm">Available</Badge>
              </div>
              <div className="p-3 rounded-lg border border-neutral-200 bg-white flex items-center justify-between">
                <div><p className="text-sm font-medium text-neutral-900">30s Edit</p><p className="text-xs text-neutral-500">Short clip</p></div>
                <Badge color="gray" size="sm">Conceptual</Badge>
              </div>
              <div className="p-3 rounded-lg border border-neutral-200 bg-white flex items-center justify-between">
                <div><p className="text-sm font-medium text-neutral-900">60s Edit</p><p className="text-xs text-neutral-500">Medium clip</p></div>
                <Badge color="gray" size="sm">Conceptual</Badge>
              </div>
            </div>
          </Card>

          {/* Rights & ownership */}
          <Card className="p-6">
            <h3 className="font-semibold text-neutral-900 mb-4">Rights & Ownership</h3>
            <div className="flex items-center gap-2 mb-4">
              {isOneStop ? (
                <div className="flex items-center gap-2 p-2 rounded-lg bg-green-50 border border-green-200">
                  <CheckCircle2 size={16} className="text-green-600" />
                  <span className="text-sm font-medium text-green-900">One-Stop Clearance</span>
                  <span className="text-xs text-green-600">Both master and publishing controlled by same owner</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 p-2 rounded-lg bg-amber-50 border border-amber-200">
                  <AlertTriangle size={16} className="text-amber-600" />
                  <span className="text-sm font-medium text-amber-900">Co-Clearance Required</span>
                  <span className="text-xs text-amber-600">Multiple rights holders must approve</span>
                </div>
              )}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-neutral-200">
                    <th className="text-left py-2 px-3 font-medium text-neutral-500">Rights Type</th>
                    <th className="text-left py-2 px-3 font-medium text-neutral-500">Owner</th>
                    <th className="text-left py-2 px-3 font-medium text-neutral-500">Territory</th>
                    <th className="text-left py-2 px-3 font-medium text-neutral-500">Ownership %</th>
                    <th className="text-left py-2 px-3 font-medium text-neutral-500">Expiration</th>
                    <th className="text-left py-2 px-3 font-medium text-neutral-500">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {rights.map(r => (
                    <tr key={r.id} className="border-b border-neutral-100">
                      <td className="py-2 px-3"><Badge color="gray">{r.rights_type}</Badge></td>
                      <td className="py-2 px-3 text-neutral-900">{r.owner}</td>
                      <td className="py-2 px-3 text-neutral-600">{r.territory}</td>
                      <td className="py-2 px-3 text-neutral-900 font-medium">{r.ownership_pct}%</td>
                      <td className="py-2 px-3 text-neutral-500">{r.expiration ?? 'None'}</td>
                      <td className="py-2 px-3 text-neutral-500 text-xs">{r.notes ?? '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Split information */}
          {splits.length > 0 && (
            <Card className="p-6">
              <h3 className="font-semibold text-neutral-900 mb-4">Royalty Split Breakdown</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-neutral-200">
                      <th className="text-left py-2 px-3 font-medium text-neutral-500">Participant</th>
                      <th className="text-left py-2 px-3 font-medium text-neutral-500">Role</th>
                      <th className="text-left py-2 px-3 font-medium text-neutral-500">Share %</th>
                      <th className="text-left py-2 px-3 font-medium text-neutral-500">IPI/CAE</th>
                      <th className="text-left py-2 px-3 font-medium text-neutral-500">PRO</th>
                    </tr>
                  </thead>
                  <tbody>
                    {splits.map(s => (
                      <tr key={s.id} className="border-b border-neutral-100">
                        <td className="py-2 px-3 text-neutral-900 font-medium">{s.participant_name}</td>
                        <td className="py-2 px-3"><Badge color="gray">{s.participant_role}</Badge></td>
                        <td className="py-2 px-3 text-neutral-900 font-medium">{s.share_pct}%</td>
                        <td className="py-2 px-3 text-neutral-500">{s.ipi_cae ?? '—'}</td>
                        <td className="py-2 px-3 text-neutral-500">{s.pro ?? '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Visual split breakdown */}
              <div className="mt-4 flex gap-1">
                {splits.map(s => (
                  <div key={s.id} className="flex-1 rounded-lg p-2 text-center" style={{ backgroundColor: s.participant_role === 'artist' ? '#e5e5e5' : s.participant_role === 'producer' ? '#d4d4d4' : s.participant_role === 'writer' ? '#c7c7c7' : s.participant_role === 'publisher' ? '#b0b0b0' : '#9a9a9a' }}>
                    <p className="text-xs text-neutral-700 font-medium">{s.participant_name}</p>
                    <p className="text-xs text-neutral-500">{s.share_pct}%</p>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Territory & exclusivity */}
          <Card className="p-6">
            <h3 className="font-semibold text-neutral-900 mb-4">Territory & Exclusivity</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3 rounded-lg bg-neutral-50 flex items-center gap-2">
                <Globe size={16} className="text-neutral-400" />
                <div>
                  <p className="text-xs text-neutral-400">Territory Restrictions</p>
                  <p className="text-sm text-neutral-900">Worldwide — no restrictions</p>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-neutral-50 flex items-center gap-2">
                <Shield size={16} className="text-neutral-400" />
                <div>
                  <p className="text-xs text-neutral-400">Exclusivity Status</p>
                  <p className="text-sm text-neutral-900">Non-exclusive licensing available</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Sync licensing history */}
          {syncRequests.length > 0 && (
            <Card className="p-6">
              <h3 className="font-semibold text-neutral-900 mb-4">Sync Licensing History</h3>
              <div className="space-y-3">
                {syncRequests.map(req => (
                  <div key={req.id} className="p-4 rounded-lg border border-neutral-200">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="text-sm font-medium text-neutral-900">{req.requester_name}</p>
                        <p className="text-xs text-neutral-500">{req.requester_org ?? 'No org'} · {req.usage_type} · {req.territory}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <StatusBadge status={req.status} />
                        {req.fee_cents && <Badge color="teal">{formatCents(req.fee_cents)}</Badge>}
                      </div>
                    </div>
                    {req.notes && <p className="text-xs text-neutral-500 mt-1">{req.notes}</p>}
                    <p className="text-xs text-neutral-400 mt-2">Submitted {formatDate(req.created_at)}</p>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Pricing (if for sale) */}
          {song.for_sale && song.asking_price && (
            <Card className="p-6">
              <h3 className="font-semibold text-neutral-900 mb-2">Purchase / Licensing Price</h3>
              <div className="flex items-center gap-4">
                <p className="text-2xl font-semibold text-neutral-900">{formatCents(song.asking_price * 100)}</p>
                {song.asking_price_negotiable && <Badge color="green" size="md">Negotiable</Badge>}
              </div>
            </Card>
          )}
        </div>
      ) : (
        /* License request form */
        <Card className="p-6">
          <h3 className="font-semibold text-neutral-900 mb-4">Request License for "{song.title}"</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
          </div>
          <Field label="Notes / Description" className="mt-4">
            <Textarea placeholder="Describe your sync need..." rows={4} />
          </Field>
          <div className="flex items-center gap-3 mt-4">
            <Button variant="primary">Submit Request</Button>
            <Button variant="ghost" onClick={() => setShowLicenseForm(false)}>Cancel</Button>
          </div>
        </Card>
      )}
    </div>
  );
}
