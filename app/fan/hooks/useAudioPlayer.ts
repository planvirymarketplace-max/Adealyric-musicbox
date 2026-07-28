// packages/hooks/useAudioPlayer.ts
//
// Web playback layer. Howler.js handles the actual decode/play/seek across
// browsers (it falls back from Web Audio to HTML5 Audio automatically,
// which matters for older mobile Safari). Offline behavior is layered on
// top by useOfflineLibrary.ts (Workbox) -- this hook just asks "is this
// track cached?" and points Howler at the cached blob URL if so, otherwise
// the network URL.

'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Howl } from 'howler';

interface Track {
  id: string;
  title: string;
  streamUrl: string; // signed Supabase Storage URL
}

interface UseAudioPlayerOptions {
  /** Given a track id, resolve a cached-blob object URL if this track was downloaded for offline use. */
  resolveCachedUrl?: (trackId: string) => Promise<string | null>;
}

export function useAudioPlayer({ resolveCachedUrl }: UseAudioPlayerOptions = {}) {
  const howlRef = useRef<Howl | null>(null);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);

  const load = useCallback(
    async (track: Track) => {
      howlRef.current?.unload();

      const cachedUrl = resolveCachedUrl ? await resolveCachedUrl(track.id) : null;
      const src = cachedUrl ?? track.streamUrl;

      const howl = new Howl({
        src: [src],
        html5: true, // stream rather than fully decode in memory -- important for longer sessions/albums
        onload: () => setDuration(howl.duration()),
        onplay: () => setIsPlaying(true),
        onpause: () => setIsPlaying(false),
        onend: () => setIsPlaying(false),
      });

      howlRef.current = howl;
      setCurrentTrack(track);
    },
    [resolveCachedUrl],
  );

  useEffect(() => {
    const interval = setInterval(() => {
      if (howlRef.current?.playing()) {
        setPosition(howlRef.current.seek() as number);
      }
    }, 250);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => () => howlRef.current?.unload(), []);

  return {
    currentTrack,
    isPlaying,
    position,
    duration,
    load,
    play: () => howlRef.current?.play(),
    pause: () => howlRef.current?.pause(),
    seek: (seconds: number) => howlRef.current?.seek(seconds),
  };
}
