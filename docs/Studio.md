# Studio

## Purpose
The Creative OS — the browser DAW where a beat becomes a mixed, mastered, metadata-complete master (System Architecture Section 20). This is where the canonical song record originates; everything downstream (Catalog, Distribution, Rights, Sync) reads from what Studio produces. Maps to your existing `apps/writer` app for the lyric/writing side and a forthcoming `apps/web` or dedicated `apps/studio` for the DAW side.

## Users & Roles
- Artist/Creator, Co-Writer/Session Collaborator (primary)
- Educator/Student (Education Mode only)
- Manager (invited, view-only into collaborator activity)

## Navigation
Sidebar: My Sessions · Beat Marketplace · Sample Library · AI Tools · Track Versions

## Dashboard
Active sessions, pending collaborator invites, tracks awaiting mastering, recent AI Assistant suggestions.

## Sidebar
Browser DAW · Sounds & Instruments · Effects & Mixing · AI Tools · Writers' Room · Collaboration · Podcast Sub-Suite · Education Mode

## Core Entities
`Project`, `StudioSession`, `Track`, `Asset`, `TrackVersion`, `Credit`

## Features
- Multi-track recording/editing, MIDI piano roll, sampler, effects (Section 20.2)
- Real-time multi-user collaboration via CRDT (Yjs) — Section 20.3
- AI tools: Roex mastering, ElevenLabs voice synthesis, Audiocraft stem/music generation, AI Assistant suggestions (Section 20.4, 20.13)
- Automated Metadata Pipeline — BPM/key/mood extraction while writing (Section 20.6)
- Track Versions (non-destructive history)
- Beat Marketplace and Songwriting Workspace as full sub-workflows (Section 20.11, 20.12)

## Workflows
Beat → Sync-Ready Master (Section 20.7): Producer creates beat → Writer invited (lyrics/melody) → Singer records vocals → Engineer mixes → Automated Metadata Pipeline fills BPM/key/mood/ISRC → Release Manager publishes → same record appears in Catalog and SyncOS with zero re-upload.

## Database Models Used
`Project`, `StudioSession`, `LyricDoc`, `VoiceNote`, `Track`, `TrackVersion`, `Asset`, `Credit`, `SplitSheet`

## API Endpoints
- `POST /api/studio/projects`
- `PATCH /api/studio/projects/:id/invite`
- `POST /api/studio/tracks/:id/master` — triggers Roex mastering job
- `POST /api/studio/tracks/:id/metadata` — triggers Automated Metadata Pipeline
- WebSocket/Yjs endpoint for real-time collaboration state

## Permissions
Session-scoped: only invited `Credit` holders can edit; Manager role is view-only unless explicitly granted edit.

## Integrations
Roex (mastering), ElevenLabs (voice), Audiocraft (self-hosted gen models), Essentia.js/Librosa (analysis), taglib-wasm (binary tag writing). Feeds Catalog, Rights (split sheets), Distribution (finished master), Sync (auto-generated sync package).

## Notifications
Collaborator joined, mastering complete, metadata pipeline finished, split conflict flagged.

## Reports
Sessions created, average time-to-master, AI tool usage per artist.

## Future Roadmap
Custom Visual DAW white-labeling; Fully Closed Remix Portals (Section 20.5); desktop-companion export for offline mixing.
