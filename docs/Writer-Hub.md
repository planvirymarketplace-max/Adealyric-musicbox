# Writer Hub

## Purpose
The "identified gap" workspace (Section 37.E) — a dedicated lyric/composition environment that neither BandLab nor Soundtrap fully offer. This is your existing `apps/writer` ("Adea Lyric Frontend"). It is scoped narrower than Studio: pure text/lyric collaboration, not audio production.

## Users & Roles
- Co-Writer/Session Collaborator (primary)
- Artist/Creator (primary)
- Publisher/Royalty Administrator (secondary, read access to split data once finalized)

## Navigation
Sidebar: My Lyrics · Shared Sessions · Rhyme Tools · Split Sheets

## Dashboard
Recent lyric docs, active co-writing sessions, split sheets awaiting signature.

## Sidebar
Shared Live-Text Editor · Section Tagging · Rhyme/Syllable Tools · Per-Line Voice Memos · Version History · Suggestion Mode · Line-to-Timeline Sync

## Core Entities
`LyricDoc`, `Project`, `Credit`, `SplitSheet`, `VoiceNote`

## Features
- Multi-cursor shared live-text lyric editor (Yjs CRDT — same pattern as Studio's Section 20.3)
- Section tagging synced to arrangement (verse/chorus/bridge)
- Rhyme/syllable tools (Datamuse API or self-hosted CMU Pronouncing Dictionary)
- Per-line voice memos, lyric version history (separate from audio version history)
- Suggestion mode (track-changes style)
- Line-to-timeline sync — click a lyric line, jump to the corresponding audio timestamp (paired with Studio's Tone.js transport)

## Workflows
1. Writer opens/creates a `LyricDoc` inside a `Project`.
2. Co-writers invited → live multi-cursor editing via Yjs.
3. Section tags applied; rhyme tool suggests alternatives inline.
4. On completion, co-writer credit tagging generates a `SplitSheet` draft automatically — no re-entry into Rights Manager.
5. Split sheet exported to PDF (pdf-lib) and sent for e-signature.

## Database Models Used
`LyricDoc`, `Project`, `Credit`, `SplitSheet`, `Split`, `VoiceNote`

## API Endpoints
- `POST /api/writer/docs`
- `GET /api/writer/docs/:id` (+ Yjs sync endpoint)
- `POST /api/writer/docs/:id/split-sheet` — generate draft split sheet from credits
- `POST /api/writer/split-sheets/:id/export-pdf`

## Permissions
Only invited collaborators (`Credit` on the `Project`) can edit; split sheet finalization requires all named parties to sign.

## Integrations
Yjs + y-websocket (self-hosted) or Liveblocks for transport; Datamuse API or CMU dict for rhyme; feeds `packages/rights` for split-sheet generation and PDF export (Section 5/6 of Architecture doc).

## Notifications
Co-writer invited, suggestion added, split sheet ready to sign, signature completed.

## Reports
Time-to-complete per lyric doc, split conflict frequency.

## Future Roadmap
AI co-writing suggestions layered onto Suggestion Mode; multi-language rhyme support.
