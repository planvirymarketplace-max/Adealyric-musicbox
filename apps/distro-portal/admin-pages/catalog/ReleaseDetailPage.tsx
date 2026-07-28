'use client';

import { useRouter } from '@/lib/router';
import { ArrowLeft, Disc3 } from 'lucide-react';
import { Badge, StatusBadge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { PageHeader } from '@/components/layout/PageHeader';
import { formatDate, formatCents } from '@/lib/format';
import { mockReleases, mockTracks, mockArtists } from '@/lib/mock-data';

export default function ReleaseDetailPage() {
  const { path, navigate } = useRouter();
  const id = path.split('/').pop() ?? '';
  const release = mockReleases.find((r) => r.id === id);
  if (!release) return <div className="p-8 text-center text-neutral-400">Release not found</div>;

  const tracks = mockTracks.filter((t) => t.release_id === id);
  const artist = mockArtists.find((a) => a.id === release.artist_id);

  return (
    <div>
      <button onClick={() => navigate('/admin/music/albums')} className="inline-flex items-center gap-1 text-sm text-neutral-400 hover:text-neutral-600 mb-4"><ArrowLeft size={16} /> Back</button>
      <div className="flex items-start gap-5 mb-6">
        <div className="w-20 h-20 rounded-xl bg-neutral-100 flex items-center justify-center"><Disc3 size={36} className="text-neutral-300" /></div>
        <div><h1 className="text-2xl font-semibold text-neutral-900">{release.title}</h1><p className="text-sm text-neutral-500">{artist?.name ?? 'Unknown'} · {release.type} · {formatDate(release.release_date)}</p><div className="flex items-center gap-1.5 mt-2"><StatusBadge status={release.status} /><Badge color="gray">{release.genre ?? '—'}</Badge>{release.is_free && <Badge color="green">Free</Badge>}{!release.is_free && <Badge color="blue">{formatCents(release.price_cents)}</Badge>}</div></div>
      </div>
      <Card className="p-5">
        <h3 className="font-semibold text-neutral-900 mb-4">Tracks ({tracks.length})</h3>
        <div className="space-y-2">
          {tracks.map((t) => (
            <div key={t.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-neutral-50">
              <div className="flex items-center gap-3"><span className="text-sm text-neutral-400 w-6">{t.position}</span><div><p className="text-sm font-medium text-neutral-900">{t.title}</p><p className="text-xs text-neutral-400">{t.duration_seconds ? `${Math.floor(t.duration_seconds / 60)}:${String(t.duration_seconds % 60).padStart(2, '0')}` : '—'} · {t.isrc ?? 'No ISRC'}</p></div></div>
              <div className="flex items-center gap-2">{t.is_free ? <Badge color="green">Free</Badge> : <Badge color="blue">{formatCents(t.price_cents)}</Badge>}{t.explicit && <Badge color="red">E</Badge>}<StatusBadge status={t.status} /></div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
