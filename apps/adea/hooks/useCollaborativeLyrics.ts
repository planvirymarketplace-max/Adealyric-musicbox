// packages/hooks/useCollaborativeLyrics.ts
//
// The Writers' Room editor (Section "E. Writers' Room" in your feature doc).
// Stack: Yjs (CRDT) + Tiptap (ProseMirror-based, has first-class Yjs
// bindings) + y-websocket (self-hosted relay server, NOT a Vercel function
// -- see production-architecture.md for why this needs its own long-lived
// process).
//
// This hook owns three things: the shared document, presence/awareness
// (who's online, their cursor color), and a side-channel Y.Map for
// line-to-timestamp sync so a lyric line can be clicked to jump the DAW
// transport to the matching audio position.

'use client';

import { useEffect, useMemo, useState } from 'react';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Collaboration from '@tiptap/extension-collaboration';
import CollaborationCursor from '@tiptap/extension-collaboration-cursor';

interface CollaboratorInfo {
  name: string;
  color: string;
}

interface UseCollaborativeLyricsOptions {
  roomName: string; // matches CollabDoc.roomName in the schema
  wsUrl: string; // e.g. wss://collab.musicinabox.com
  user: CollaboratorInfo;
}

export function useCollaborativeLyrics({ roomName, wsUrl, user }: UseCollaborativeLyricsOptions) {
  const [activeUsers, setActiveUsers] = useState<CollaboratorInfo[]>([]);

  const ydoc = useMemo(() => new Y.Doc(), [roomName]);

  const provider = useMemo(
    () => new WebsocketProvider(wsUrl, roomName, ydoc),
    [wsUrl, roomName, ydoc],
  );

  // Line-to-timestamp map, shared alongside the prose doc so a click on a
  // lyric line can look up (or set) the transport position it corresponds to.
  const lineTimestamps = useMemo(() => ydoc.getMap<number>('line-timestamps'), [ydoc]);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ history: false }), // history is handled by Yjs, not Tiptap's default undo stack
      Collaboration.configure({ document: ydoc }),
      CollaborationCursor.configure({
        provider,
        user: { name: user.name, color: user.color },
      }),
    ],
  });

  useEffect(() => {
    provider.awareness.setLocalStateField('user', user);

    const onAwarenessChange = () => {
      const states = Array.from(provider.awareness.getStates().values());
      setActiveUsers(states.map((s: any) => s.user).filter(Boolean));
    };

    provider.awareness.on('change', onAwarenessChange);
    return () => {
      provider.awareness.off('change', onAwarenessChange);
      provider.destroy();
      ydoc.destroy();
    };
  }, [provider, ydoc, user]);

  /** Attach a timestamp (seconds) to a line, e.g. after recording a vocal pass. */
  function setLineTimestamp(lineId: string, seconds: number) {
    lineTimestamps.set(lineId, seconds);
  }

  function getLineTimestamp(lineId: string): number | undefined {
    return lineTimestamps.get(lineId);
  }

  return { editor, activeUsers, setLineTimestamp, getLineTimestamp };
}
