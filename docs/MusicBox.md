**Music-in-a-Box**

**Enterprise Music Operating System**

**System Architecture Document — Studi · Digital Asset Management · Distribution· Rights Sync · Publishing ·Direct to fan ·Touring & Booking · Label Services**

*Covering: Product Architecture · API Documentation · Metadata Specification · Security Overview · Disaster Recovery Plan · Release Workflows · Rights Management · Data Validation Rules · SyncOS Marketplace & Deal Rooms · Royalty & Revenue Splits · Monetization Models · TooLost V1 Distribution · Studio Browser DAW & AI Assistant*

Prepared: July 26, 2026

# **Table of Contents** {#table-of-contents}

[Table of Contents	2](#table-of-contents)

[1\. Executive Summary	7](#1.-executive-summary)

[1.1 Competitive Positioning	7](#1.1-competitive-positioning)

[1.2 Integration & Conflict Resolution Notes	8](#1.2-integration-&-conflict-resolution-notes)

[2\. System Architecture Overview	9](#2.-system-architecture-overview)

[2.1 Music-in-a-Box Product Architecture	9](#2.1-music-in-a-box-product-architecture)

[2.1.1 Digital asset Mangement: The Source of Truth	9](#2.1.1-digital-asset-mangement:-the-source-of-truth)

[2.1.2 Eight-Layer Technical Stack	9](#2.1.2-eight-layer-technical-stack)

[2.1.3 Six-Layer Request Pipeline	10](#2.1.3-six-layer-request-pipeline)

[2.2 Platform Modules	10](#2.2-platform-modules)

[2.3 Technology Stack	11](#2.3-technology-stack)

[2.3.1 Creative Collaboration Hub Stack	12](#2.3.1-creative-collaboration-hub-stack)

[2.4 Platform Positioning	12](#2.4-platform-positioning)

[2.5 Repository & Deployment Structure	12](#2.5-repository-&-deployment-structure)

[3\. Development Roadmap	14](#3.-development-roadmap)

[4\. Distribution Channel Directory	15](#4.-distribution-channel-directory)

[4.1 Major Streaming Platforms	15](#4.1-major-streaming-platforms)

[4.2 Social & Video Platforms	16](#4.2-social-&-video-platforms)

[4.3 Download & High-Fidelity Stores	16](#4.3-download-&-high-fidelity-stores)

[4.4 Internet Radio & Non-Interactive	17](#4.4-internet-radio-&-non-interactive)

[4.5 Asian Platforms	17](#4.5-asian-platforms)

[4.6 African Platforms	18](#4.6-african-platforms)

[4.7 Latin American Platforms	18](#4.7-latin-american-platforms)

[4.8 Background Music / B2B	18](#4.8-background-music-/-b2b)

[4.9 Sync Licensing / Production Music Platforms	19](#4.9-sync-licensing-/-production-music-platforms)

[4.10 UGC / Content ID Platforms	19](#4.10-ugc-/-content-id-platforms)

[4.11 Blockchain / Web3 Platforms	20](#4.11-blockchain-/-web3-platforms)

[4.12 Social Monetization Programs	20](#4.12-social-monetization-programs)

[4.13 Access Corrections & Caveats	20](#4.13-access-corrections-&-caveats)

[5\. Rights Management Documentation	22](#5.-rights-management-documentation)

[5.1 Rights Types Tracked	22](#5.1-rights-types-tracked)

[5.2 Collection Societies — Neighboring Rights	22](#5.2-collection-societies-—-neighboring-rights)

[5.3 Collection Societies — Mechanical Rights	22](#5.3-collection-societies-—-mechanical-rights)

[5.4 Collection Societies — Performance Rights	22](#5.4-collection-societies-—-performance-rights)

[5.5 Identifier Registrations	23](#5.5-identifier-registrations)

[5.6 Metadata Registries & Standards	23](#5.6-metadata-registries-&-standards)

[5.7 Royalty Collection & Rights-Data Portals	24](#5.7-royalty-collection-&-rights-data-portals)

[5.8 PRO / Publishing Registration	24](#5.8-pro-/-publishing-registration)

[5.9 Charts & Consumption Reporting	24](#5.9-charts-&-consumption-reporting)

[5.10 Audio Recognition & Fingerprinting	25](#5.10-audio-recognition-&-fingerprinting)

[5.11 Lyrics Providers	25](#5.11-lyrics-providers)

[5.12 Label Management / Integration Partners	25](#5.12-label-management-/-integration-partners)

[5.13 DDEX Delivery Transport	25](#5.13-ddex-delivery-transport)

[6\. Metadata Specification	26](#6.-metadata-specification)

[6.1 Core Release & Track Metadata	26](#6.1-core-release-&-track-metadata)

[6.2 Extended Technical / Professional Delivery Fields	26](#6.2-extended-technical-/-professional-delivery-fields)

[6.3 Sync-Specific Creative & Legal Metadata	26](#6.3-sync-specific-creative-&-legal-metadata)

[6.4 DDEX Message Types Generated	27](#6.4-ddex-message-types-generated)

[6.5 AI Auto-Tagged Fields (Generated While Writing)	27](#6.5-ai-auto-tagged-fields-\(generated-while-writing\))

[7\. SyncOS: Sync Licensing Portal & Marketplace	29](#7.-syncos:-sync-licensing-portal-&-marketplace)

[7.1 Purpose	29](#7.1-purpose)

[7.2 Advanced Sync Search	29](#7.2-advanced-sync-search)

[7.3 Role-Based Access	29](#7.3-role-based-access)

[7.4 Deal Rooms: Sync Request to Royalty Tracking	29](#7.4-deal-rooms:-sync-request-to-royalty-tracking)

[7.5 Sync Marketplace Participants	30](#7.5-sync-marketplace-participants)

[7.6 Automatic Sync Package Generation	31](#7.6-automatic-sync-package-generation)

[7.7 A\&R Workspace	32](#7.7-a&r-workspace)

[8\. API Documentation	34](#8.-api-documentation)

[8.1 Core Catalog & Distribution Endpoints	34](#8.1-core-catalog-&-distribution-endpoints)

[8.2 Sync Portal Endpoints (proposed extension)	34](#8.2-sync-portal-endpoints-\(proposed-extension\))

[8.3 Delivery Adapter Pattern	34](#8.3-delivery-adapter-pattern)

[8.4 V1 Distribution Partner API — TooLost	35](#8.4-v1-distribution-partner-api-—-toolost)

[9\. Data Validation Rules	39](#9.-data-validation-rules)

[9.1 Validation Engine Modules	39](#9.1-validation-engine-modules)

[9.2 Artwork Validation Rules	39](#9.2-artwork-validation-rules)

[9.3 Audio Processing Pipeline	39](#9.3-audio-processing-pipeline)

[9.4 Metadata Validation Requirements	40](#9.4-metadata-validation-requirements)

[9.5 Copyright & Territory Checks	40](#9.5-copyright-&-territory-checks)

[9.6 Access-Reality Validation	40](#9.6-access-reality-validation)

[10\. Release Workflow	41](#10.-release-workflow)

[10.1 Onboarding	41](#10.1-onboarding)

[10.2 End-to-End Release Pipeline	41](#10.2-end-to-end-release-pipeline)

[10.3 Royalty Calculation Flow	41](#10.3-royalty-calculation-flow)

[10.4 Split Payment Example	42](#10.4-split-payment-example)

[11\. Security Overview	43](#11.-security-overview)

[11.1 Identity & Access	43](#11.1-identity-&-access)

[11.2 Data Protection	43](#11.2-data-protection)

[11.3 Application Security	43](#11.3-application-security)

[11.4 Partner & Third-Party Risk	43](#11.4-partner-&-third-party-risk)

[12\. Disaster Recovery Plan	44](#12.-disaster-recovery-plan)

[12.1 Backup Strategy	44](#12.1-backup-strategy)

[12.2 Failure Scenarios & Response	44](#12.2-failure-scenarios-&-response)

[12.3 Business Continuity	44](#12.3-business-continuity)

[13\. Analytics & Reporting	45](#13.-analytics-&-reporting)

[14\. Revenue & Royalty Distribution by Role	46](#14.-revenue-&-royalty-distribution-by-role)

[14.1 Master Recording Income	46](#14.1-master-recording-income)

[14.2 Composition Income	46](#14.2-composition-income)

[14.3 Summary of Payment Sources by Role	46](#14.3-summary-of-payment-sources-by-role)

[15\. Often-Overlooked Royalty Streams	47](#15.-often-overlooked-royalty-streams)

[15.1 International Performance (Neighboring Rights)	47](#15.1-international-performance-\(neighboring-rights\))

[15.2 Session Musicians & Backup Vocalists (Non-Featured Artists)	47](#15.2-session-musicians-&-backup-vocalists-\(non-featured-artists\))

[15.3 Sampling Fees & Clearances	47](#15.3-sampling-fees-&-clearances)

[15.4 Public Performance of the Master (US Venues)	47](#15.4-public-performance-of-the-master-\(us-venues\))

[15.5 Content ID & User-Generated Content (UGC)	47](#15.5-content-id-&-user-generated-content-\(ugc\))

[16\. Distribution Architecture Options	49](#16.-distribution-architecture-options)

[16.1 White-Label Distribution (B2B SaaS) — V1 Partner: TooLost	49](#16.1-white-label-distribution-\(b2b-saas\)-—-v1-partner:-toolost)

[16.2 Direct-to-DSP Licensing	49](#16.2-direct-to-dsp-licensing)

[17\. Platform Monetization Models	49](#17.-platform-monetization-models)

[17.1 The Freemium Creator Funnel	49](#17.1-the-freemium-creator-funnel)

[17.2 The "Label Services" Split	49](#17.2-the-"label-services"-split)

[18\. AI-Generated Content: Legal & Rights Bottlenecks	50](#18.-ai-generated-content:-legal-&-rights-bottlenecks)

[18.1 Voice Model Rights	50](#18.1-voice-model-rights)

[18.2 AI Metadata Tracking	50](#18.2-ai-metadata-tracking)

[18.3 Automated Split Sheets & Registration	50](#18.3-automated-split-sheets-&-registration)

[20\. Artist Collaboration Hub	51](#20.-artist-collaboration-hub)

[20.1 Purpose & Scope	51](#20.1-purpose-&-scope)

[20.2 Browser DAW Architecture	51](#20.2-browser-daw-architecture)

[20.3 Real-Time Collaboration Layer	51](#20.3-real-time-collaboration-layer)

[20.4 AI Music Tools	53](#20.4-ai-music-tools)

[20.4.1 Roex AI Mastering	53](#20.4.1-roex-ai-mastering)

[20.4.2 ElevenLabs AI Voice	53](#20.4.2-elevenlabs-ai-voice)

[20.4.3 Custom AI-Driven Stem & Music Generators	53](#20.4.3-custom-ai-driven-stem-&-music-generators)

[20.5 Proprietary Lock-In Strategy (Optional Differentiators)	53](#20.5-proprietary-lock-in-strategy-\(optional-differentiators\))

[20.6 Automated Metadata Pipeline	55](#20.6-automated-metadata-pipeline)

[20.7 Collaboration Workflow (Beat to Sync-Ready Master)	57](#20.7-collaboration-workflow-\(beat-to-sync-ready-master\))

[20.8 Direct-to-Fan	57](#20.8-direct-to-fan)

[20.9 Indie Retail	57](#20.9-indie-retail)

[20.10 Additional Creative Tools	57](#20.10-additional-creative-tools)

[20.11 Beat Marketplace (Full Workflow)	59](#20.11-beat-marketplace-\(full-workflow\))

[20.12 Songwriting Workspace (Full Workflow)	59](#20.12-songwriting-workspace-\(full-workflow\))

[20.13 AI Assistant	60](#20.13-ai-assistant)

[20.14 How the Hub Fits the Architecture	61](#20.14-how-the-hub-fits-the-architecture)

[21\. The Workspace Model	61](#heading=h.ks5a0a2m926)

[22\. Global Application Shell	63](#heading=h.u7ocbrlqh8z7)

[22.1 Global Header	63](#heading=h.a9e8s8ons6le)

[22.2 Sidebar	63](#heading=h.1iaoe8n4j1ol)

[22.3 Main Content Area	63](#heading=h.krzxrzb6hitp)

[22.4 Detail Drawer	63](#heading=h.relprj5zc2b1)

[22.5 Footer	63](#heading=h.an6d0aqms8oe)

[22.6 Navigation Hierarchy	63](#heading=h.r00mcqhkh6pn)

[23\. Sidebar Taxonomy	65](#heading=h.gthigbwb5y2r)

[23.1 The Six Standard Categories	65](#heading=h.cmnjz1yfcp1z)

[23.2 Admin Workspace Sidebar	65](#heading=h.5a12i4yo3rzw)

[23.3 Industry Workspace Sidebar	66](#heading=h.3mifmouapj3v)

[23.4 Artist (Studio) Workspace Sidebar	66](#heading=h.4px3u8brshzv)

[23.5 Fan Workspace Sidebar	66](#heading=h.ah1xxb84a6mp)

[23.6 Reconciliation With the Current Build	67](#heading=h.3gxffcrh1uck)

[23.7 Deep Dive: Tour Studio (Admin → Manage → Touring)	68](#21.-deep-dive:-tour-studio-\(admin-→-manage-→-touring\))

[24\. Universal Search (Command Palette)	70](#22.-universal-search-\(command-palette\))

[25\. Notification Center	71](#23.-notification-center)

[26\. Unified Inbox	71](#24.-unified-inbox)

[27\. Favorites & Pinning	73](#heading=h.sz3vzkce33b7)

[28\. Dashboard Action Cards	73](#28.-dashboard-action-cards)

[29\. Reusable UI Components	75](#29.-reusable-ui-components)

[30\. Design Tokens	75](#30.-design-tokens)

[30.1 Status Colors	75](#30.1-status-colors)

[30.2 Spacing, Typography, Icons	75](#30.2-spacing,-typography,-icons)

[31\. Responsive Layouts	77](#31.-responsive-layouts)

[32\. Accessibility & Keyboard Shortcuts	77](#32.-accessibility-&-keyboard-shortcuts)

[32.1 Keyboard Shortcuts	77](#32.1-keyboard-shortcuts)

[32.2 Accessibility Baseline	77](#32.2-accessibility-baseline)

[33\. Role-Based Rendering Rules	77](#33.-role-based-rendering-rules)

[34\. Interaction Patterns	79](#34.-interaction-patterns)

[35\. System States	79](#35.-system-states)

[36\. Coverage Note	80](#36.-modules-&-there-10-personas)

# **1\. Executive Summary** {#1.-executive-summary}

This document defines the architecture of a unified music technology platform — internally named Music-in-a-Box — that functions as the single source of truth for creation, catalog, metadata, rights, distribution, royalty accounting, and sync licensing. Rather than maintaining separate spreadsheets, manual submission forms, and disconnected third-party tools for each outlet, every partner — a co-writer, a mastering engine, a streaming DSP, a sync agency, a performing rights organization, or a mechanical rights collector — draws from and enriches the same underlying canonical song record.

The platform is positioned as infrastructure for a music business, not simply an upload tool. It is organized as an operating system for a label ("Label OS") with a distribution engine layered on top, a browser-based creative collaboration workspace at the front of the pipeline, and a dedicated sync licensing portal that exposes a searchable, role-gated view of the catalog to sync agents, music supervisors, and publishers.

Strategically, the platform allows the company to present itself to DSPs and rights organizations as a technology company that owns a record label — one that already maintains structured metadata, generates DDEX-compliant deliveries, validates releases before submission, and manages rights and royalty accounting internally — rather than a label asking for access without operational infrastructure to back it up.

## **1.1 Competitive Positioning** {#1.1-competitive-positioning}

Most existing tools in the music industry solve exactly one part of this problem and force the artist or label to re-enter the same song into a second, disconnected system for the next step:

| Platform | What It Solves |
| :---- | :---- |
| BandLab | Creation |
| Soundtrap | Collaboration |
| DistroKid | Distribution |
| Songtradr | Sync |
| DISCO | File sharing |
| Label Engine | Label operations |
| Revelator | Rights and royalties |

Music-in-a-Box is designed to connect all of those workflows around one continuously enriched song record. A song is created, collaborated on, tagged, cleared, distributed, licensed, analyzed, and monetized without ever being recreated in a second disconnected system. That is a materially more ambitious position than "another distributor," and it is the kind of architecture that appeals to labels, publishers, and sync agencies as well as individual artists, because every partner works from the same trusted source of data.

The deeper differentiator is build order. Nearly every comparable company built one product first and bolted the rest on afterward — BandLab started with the studio, DistroKid and FUGA started with distribution, Songtradr started with licensing, DISCO started with file management. Music-in-a-Box is designed the opposite way: outward from a single canonical song record. The song is created inside the platform, collaboration happens there, metadata is generated as part of creation, rights attach automatically, distribution reads the same record, sync licensing reuses the same data, and royalties flow back into that record. That ordering is why the platform can support five distinct commercial products (Section 2.1) without maintaining five separate copies of the same song.

## **1.2 Integration & Conflict Resolution Notes** {#1.2-integration-&-conflict-resolution-notes}

This document consolidates architecture drafted across multiple planning sessions. Where two drafts described the same capability differently, this section records which version is authoritative so the rest of the document is not internally contradictory.

| Area of Overlap | Resolution |
| :---- | :---- |
| Top-level architecture frame | The eight-layer Music-in-a-Box stack (Section 2.1.2) is now the canonical technical architecture, and the five-pillar product packaging (Section 2.1) is the canonical commercial/product framing. The original six-layer pipeline (Artist Dashboard → Catalog → Validation → Delivery → Royalty → Accounting) is preserved as Section 2.1.3 — nothing was discarded, each view is the same system at a different altitude. |
| Document scope and name | This is no longer scoped as a distribution-and-sync document alone. Music-in-a-Box is adopted as the umbrella product name; "Distribution & Sync Licensing Architecture" is retained as the subtitle because distribution and sync remain the two most fully specified subsystems, but the document now documents an enterprise platform of five products (Section 2.1). |
| Database engine | Supabase (Postgres-compatible, with built-in real-time subscriptions) is adopted as the primary database, satisfying the original "PostgreSQL" requirement in Section 2.3 while natively providing the real-time sync layer the Creative Collaboration Hub needs — avoiding two separate databases for one dataset. |
| "Artist Collaboration Hub" vs. "Studio" | Both names refer to the same product. Section 20 keeps the original section title for continuity; "Studio" is used as the product-line name in Section 2.1 and cross-referenced back to Section 20\. |
| Sync clearance workflow vs. "Deal Rooms" | "Deal Rooms" is adopted as the product name for the sync negotiation workflow. Section 7.4 is retitled and expanded to the full Sync Request → Private Workspace → Review → Approve → Negotiate → Contract → Sign → Invoice → Deliver → Usage Tracking → Royalty Tracking flow, which supersedes the earlier seven-step version. |
| Metadata pipeline | The Essentia.js/Librosa → enrichment → taglib-wasm binary-tagging pipeline (Section 20.6) is the authoritative description of how metadata actually gets generated. Section 9.3's audio processing pipeline still governs delivery-readiness checks (loudness, peaks, checksum) and now explicitly plugs in the Section 20.6 analysis step rather than duplicating it. |
| AI-content disclosure | Section 18.2, Section 8.4 (TooLost's native aiAssisted/isAiGeneratedArtwork fields), and Section 20.6's aiCreditsTransparency payload all describe the same requirement. They are cross-referenced rather than redefined: metadata is captured once, at creation, in the Hub, and carried through to every downstream partner untouched. |

# **2\. System Architecture Overview** {#2.-system-architecture-overview}

## **2.1 Music-in-a-Box Product Architecture** {#2.1-music-in-a-box-product-architecture}

Music-in-a-Box is the umbrella platform. Commercially, it packages into five major products, each independently valuable but all reading from and writing to one canonical song record:

1\. Music-in-a-Box

**↓**

2\. Studio — creation and collaboration (Section 20\)

**↓**

3\. Digital asset Mangement — the source of truth every other product references (Section 2.1.1, Section 6\)

**↓**

4\. DistributionOS — validation, DDEX, DSP adapters, delivery (Section 4, Section 8, Section 9\)

**↓**

5\. RightsOS — publishing, PRO, mechanical, neighboring, master, sync rights, licensing (Section 5\)

**↓**

6\. SyncOS — the sync marketplace, Deal Rooms, and A\&R Workspace (Section 7\)

Four cross-cutting services span all five products rather than belonging to one: Royalty (Section 10, Section 14, Section 15), Analytics (Section 13), AI (Section 20.4, Section 20.6, Section 20.13), and API (Section 8).

### **2.1.1 Digital asset Mangement: The Source of Truth** {#2.1.1-digital-asset-mangement:-the-source-of-truth}

Digital asset Mangement is not a sixth product so much as the substrate the other five sit on: artists, albums, singles, tracks, stems, lyrics, artwork, videos, ISRC, UPC, ISWC, IPI, publishing, contracts, splits, ownership, AI disclosure, and version history. Every module — Studio, DistributionOS, RightsOS, SyncOS — references this record instead of maintaining its own copy, which is what makes "enter once, use everywhere" (Section 6\) actually true rather than aspirational.

### **2.1.2 Eight-Layer Technical Stack** {#2.1.2-eight-layer-technical-stack}

At the engineering level, the same five products decompose into eight operating-system layers, each building on the one before it:

1\. Creative OS — Browser DAW, beat marketplace, songwriting, MIDI collaboration, AI music tools, sample library, voice notes, track versions (Studio / Section 20\)

**↓**

2\. Business OS — Identity & accounts for artists, producers, writers, labels, publishers, and sync agents (Section 2.2, Section 7.3)

**↓**

3\. Asset OS — Asset & metadata management: audio/video/artwork/lyrics/stems/MIDI plus ISRC, UPC, ISWC, IPI, credits, splits, AI tags (Digital asset Mangement / Section 6\)

**↓**

4\. Rights OS — Publishing, neighboring rights, PRO registration, mechanical royalties, contracts, licensing (RightsOS / Section 5\)

**↓**

5\. Distribution OS — Per-DSP delivery adapters, DDEX messaging, the TooLost V1 partner integration (DistributionOS / Section 4, Section 8, Section 16\)

**↓**

6\. Licensing OS — The Sync Licensing Portal, Deal Rooms, and A\&R Workspace for music supervisors, brands, studios, agencies, advertisers, game studios, and streamers (SyncOS / Section 7\)

**↓**

7\. Royalty OS — Statement generation, split payments, and royalty-collection-body integration (Section 10, Section 14, Section 15\)

**↓**

8\. Analytics OS / AI OS — Streaming analytics, revenue reporting, and the AI layer that tags mood, genre, structure, and commercial similarity as songs are created (Section 13, Section 20.6, Section 20.13)

### **2.1.3 Six-Layer Request Pipeline** {#2.1.3-six-layer-request-pipeline}

The original six-layer request/delivery pipeline below is the detailed, request-level view of how a release actually moves through Digital asset Mangement, DistributionOS, and the Royalty service above — all three diagrams in this section describe the same system at different altitudes, not three different systems.

1\. Artist Dashboard (Portal)

**↓**

2\. Catalog Management (artists, releases, tracks, assets, metadata, contracts, rights, splits, territories, publishing, ISRC/UPC, lyrics, artwork, Dolby Atmos, Spatial Audio)

**↓**

3\. Validation Engine (DDEX, metadata, artwork, audio, copyright, territory checks)

**↓**

4\. Delivery Engine (per-DSP adapters: Spotify, Apple, Amazon, TikTok, Meta, YouTube, Pandora, Deezer, QQ Music, NetEase, Boomplay, Bandcamp, Qobuz, etc.)

**↓**

5\. Royalty Engine (statements, SoundExchange, MLC, ASCAP, BMI, mechanical, neighboring rights, publishing)

**↓**

6\. Accounting (artist balances, split payments, tax forms, withdrawals)

## **2.2 Platform Modules** {#2.2-platform-modules}

| Module | Description |
| :---- | :---- |
| Artist Portal | Artist/label signup, verification, tax forms, banking, contracts, release calendar |
| Catalog Manager | Artists, albums, singles, EPs, tracks, versions, ISRC, UPC, lyrics, artwork, videos, publishing, credits, samples, ownership, splits, territories |
| Metadata Engine | Central store for all release, track, contributor, and rights metadata (see Section 6\) |
| Artist Collaboration Hub | Browser DAW, real-time collaboration, AI mastering, AI voice synthesis, AI-driven metadata tagging, direct-to-fan monetization, and indie retail distribution, all writing to one canonical song record (see Section 20\) |
| Delivery Engine | Per-DSP XML/DDEX adapters that transform one catalog record into every partner's required feed format; V1 runs on a TooLost white-label adapter while direct DSP integration is built (see Section 8.4, Section 16.1) |
| DDEX Engine | Generates ERN, RIN, MEAD, PIE, and MWN messages automatically |
| Audio Processing | Validation, waveform generation, loudness/peak detection, checksum, fingerprinting, storage, delivery (see Section 9.3, Section 20.6) |
| Artwork Engine | Enforces artwork specification (3000×3000, RGB, JPEG, no URLs/borders/blur) |
| Royalty Engine | Converts DSP reports into per-participant royalty calculations and statements |
| Split Payments | Automatic proportional payment distribution across a release's contributors |
| Rights Manager | Stores master, publishing, neighboring, mechanical, and sync rights, territories, expirations, and licenses |
| Sync Licensing Portal | Role-gated search, Sync Workspace clearance, invoicing, and usage tracking for sync agents and music supervisors (see Section 7\) |
| Analytics | Streams, revenue, geography, devices, followers, playlist adds, saves, Shazams, TikTok videos, revenue by DSP/track/album |
| API | API-first access to every module (see Section 8\) |

## **2.3 Technology Stack** {#2.3-technology-stack}

| Layer | Technology |
| :---- | :---- |
| Frontend | React or Next.js, Tailwind CSS |
| Backend | ASP.NET Core (C\#) or Node.js |
| Database | Supabase (Postgres-compatible, with built-in real-time subscriptions) — see resolution note in Section 1.2 |
| Object Storage | AWS S3, Azure Blob Storage, or Cloudflare R2 (R2 preferred for audio: zero egress fees on streaming/upload-heavy workloads) |
| Search | Elasticsearch or OpenSearch |
| Cache | Redis |
| Background Jobs | Hangfire (.NET) or BullMQ (Node.js) |
| Authentication | OAuth 2.0 / OpenID Connect |
| Containerization | Docker |
| Orchestration (future) | Kubernetes |

### **2.3.1 Creative Collaboration Hub Stack** {#2.3.1-creative-collaboration-hub-stack}

The Creative OS layer (Section 2.1, Section 20\) has its own specialized front-end stack layered on top of the core platform above, since real-time multi-user audio editing has different requirements than a CRUD-style catalog dashboard:

| Layer | Tool / Library |
| :---- | :---- |
| Audio Engine | Tone.js (sequencing, synths, samplers, FX) \+ native Web Audio API |
| Waveform / Timeline UI | Wavesurfer.js |
| Multi-Track DAW Core | web-audio-daw (track layering, grouping, volume, panning) |
| Vocal/Instrument Recording | RecordRTC (WebRTC-based browser recording) |
| Real-Time Data Sync (CRDT) | Yjs (+ @yjs/y-protocols) — conflict-free merging of simultaneous timeline edits |
| WebSocket / Multiplayer Backend | Hocuspocus (self-hosted, built for Yjs) or Liveblocks (managed SaaS, React hooks for presence/cursors) |
| General Real-Time Messaging | Socket.io / WebSockets for chat, invitations, cursor movement |
| Session & Asset Sync | Supabase Realtime (auth, session state, loop-arrangement coordinates) \+ object storage for stems |
| AI Audio Analysis | Essentia.js (client-side BPM/key/loudness/mood) or Librosa/Demucs (server-side structural analysis: intro/verse/chorus boundaries) |
| Binary Metadata Tagging | music-metadata (Node.js read/parse) and taglib-wasm (client-side WASM tag writing — ID3v2/BWF/DDEX-ready headers, artwork embedding) |

Full architecture, workflow, and reference implementation for this stack are documented in Section 20\.

## **2.4 Platform Positioning** {#2.4-platform-positioning}

The long-term shape of the platform extends beyond the company's own catalog:

* Technology Platform: Creative Collaboration Hub · Catalog Management · Metadata Engine · Rights Management · Distribution Engine · Royalty Engine · Analytics · AI Automation · API

* ↳ Serves: Your Label

* ↳ Serves: Independent Labels (white-label, multi-tenant)

* ↳ Serves: Publishers & Creators

A realistic path to direct DSP access is to build the catalog, metadata, royalty, and rights-management platform first; deliver through an existing approved distributor initially (many support white-label or API-based workflows); and apply for direct label/distributor relationships with individual DSPs as catalog volume and operational maturity grow, replacing third-party distribution with direct delivery where agreements become available.

## **2.5 Repository & Deployment Structure** {#2.5-repository-&-deployment-structure}

A Turborepo monorepo is recommended once the platform expands beyond a single app — specifically once the Artist Studio (Creative Collaboration Hub) and the Admin/Distribution panel need to ship and scale independently while still sharing types, UI components, and utilities:

my-audio-platform/

├── apps/

│   ├── web-studio/         \# Next.js client DAW (Tone.js / Web Audio API / Yjs)

│   └── distro-portal/      \# Next.js app handling metadata, payouts, and ingestion

├── packages/

│   ├── ui/                 \# Shared Tailwind knobs, volume sliders, and faders

│   ├── audio-core/         \# Core state machine tracking play, pause, record, and BPM

│   └── ts-config/          \# Standardized TypeScript compiler configurations

├── package.json            \# Root workspace registry

└── turbo.json               \# Fast caching build command hub

# **3\. Development Roadmap** {#3.-development-roadmap}

| Phase | Scope |
| :---- | :---- |
| Phase 1 — Internal Label OS | Artist management, catalog management, metadata management, file storage, release scheduling, rights management, and the Creative Collaboration Hub's Browser DAW / real-time collaboration layer (Section 20\) so songs are created inside the platform, not imported from elsewhere |
| Phase 2 — Distribution Engine (V1 live via TooLost) | DSP adapters, DDEX export, metadata validation, delivery queues, release monitoring; V1 ships on the TooLost white-label API (Section 8.4, Section 16.1) while direct DSP/DDEX capability is built in parallel |
| Phase 3 — Business Intelligence | Analytics, royalty accounting, split payments, statements, revenue dashboards |
| Phase 4 — Platform | Invite other independent labels, white-label portals, public APIs, multi-tenant architecture; direct-to-DSP delivery replaces or supplements the TooLost adapter as agreements are secured |

What makes DSPs and rights organizations take a distributor seriously: consistently high-quality validated metadata, accurate rights ownership, proper ISRCs/UPCs/contributor data, reliable delivery formats (typically DDEX), fast correction workflows, low error rates, copyright compliance, financial stability, and a growing legitimate catalog. Building the platform to demonstrate these capabilities before a direct agreement exists is the core strategy behind Phase 1–2.

# **4\. Distribution Channel Directory** {#4.-distribution-channel-directory}

This directory catalogs every exploitation channel the platform is designed to deliver to or integrate with. Each table lists the access route and a corrected assessment of whether direct, open self-service ingestion actually exists — several channels are commonly overstated as "direct upload" when they in fact require an approved aggregator, label agreement, or platform approval.

## **4.1 Major Streaming Platforms** {#4.1-major-streaming-platforms}

| Platform | Portal / Access Route | Access Reality | Notes |
| :---- | :---- | :---- | :---- |
| Spotify | artists.spotify.com | Requires an approved aggregator/distributor, or a direct label deal at sufficient release volume | No open self-service catalog ingestion |
| Apple Music / iTunes | artists.apple.com | Requires the iTunes/Apple Partner Feed or an approved aggregator | No open self-service ingestion |
| Amazon Music | artists.amazonmusic.com | Amazon Music Direct has existed but eligibility and availability have changed over time | Verify current eligibility before treating as generally open |
| TIDAL | artists.tidal.com | Requires an aggregator or a direct label deal | No open self-service ingestion |
| Deezer | backstage.deezer.com | Requires an aggregator or a direct label deal | No open self-service ingestion |
| Napster | Label relations / direct licensing | Direct label licensing available | Contact label relations team |
| KKBOX | Label partnership (Taiwan/Hong Kong) | Aggregator or direct deal | Major regional DSP |
| Yandex Music | Label partnership (CIS) | Aggregator or direct deal | CIS territories |
| Claro Música | Label partnership (LatAm) | Aggregator or direct deal | Latin America |
| Audiomack | audiomack.com/for-artists | Direct artist/label upload | Open self-service upload |
| Trebel | Label partnership (LatAm/US) | Aggregator or direct deal | Latin America / US |
| Hungama | Label partnership (India) | Aggregator or direct deal | India |
| Wynk Music | Label partnership (India) | Aggregator or direct deal | India |
| Joox | Label partnership (SE Asia) | Aggregator or direct deal | Southeast Asia |
| FLO | Label partnership (Korea) | Aggregator or direct deal | Korea |
| Mdundo | mdundo.com | Direct submission available | Africa |
| Audius | audius.co | Open / wallet-based direct upload | Web3 streaming protocol |

## **4.2 Social & Video Platforms** {#4.2-social-&-video-platforms}

| Platform | Portal / Access Route | Access Reality | Notes |
| :---- | :---- | :---- | :---- |
| YouTube / YouTube Music (Content ID CMS) | studio.youtube.com | Not open — CMS access requires YouTube approval | Free once approved |
| TikTok Commercial Music Library / Sound Partnership | tiktok.com/creators | Business/commercial licensing portal, not a general distribution replacement | Direct sound upload for approved partners |
| Meta (Instagram/Facebook) Rights Manager | rightsmanager.meta.com | Approval required — not a self-service ingestion portal | Must own/administer the catalog |
| Triller | triller.co/artists | Direct artist portal | Free |
| Snapchat Sounds | Licensing partnership | Requires licensing agreement | — |
| Discord Activities (Music Apps) | Developer/partner integration | Requires partner integration | — |
| Twitch Music Library | Licensed library | Not a label upload portal | — |
| Roblox Creator Marketplace | Developer marketplace | License required | — |
| Fortnite Festival / Epic Music Licensing | Direct licensing with Epic Games | Requires direct licensing deal | — |
| CapCut Commercial Music | Business licensing | Requires licensing agreement | — |
| Canva Music Library | Stock licensing | Requires licensing agreement | — |

## **4.3 Download & High-Fidelity Stores** {#4.3-download-&-high-fidelity-stores}

| Platform | Portal / Access Route | Access Reality | Notes |
| :---- | :---- | :---- | :---- |
| Bandcamp | bandcamp.com/label\_dashboard | Direct — full label dashboard | 15% of digital sales / 10% of merch |
| Qobuz | qobuz.com/us-en/label | Direct via Qobuz Label Portal (FTP/web upload) | Direct label deal |
| iTunes Store | artists.apple.com | Via Apple Partner Feed / aggregator only | No open upload |
| Amazon Digital Downloads | artists.amazonmusic.com | Same portal/caveats as Amazon Music | Verify eligibility |
| Beatport | Label/distributor agreement | Typically requires an approved distributor | Electronic/DJ market |
| Traxsource | Label/distributor agreement | Typically requires an approved distributor | House/dance market |
| Juno Download | Label/distributor agreement | Typically requires an approved distributor | — |
| HDtracks | Label/distributor agreement | Typically requires an approved distributor | Hi-res downloads |
| 7digital | Label/distributor agreement | B2B licensing/distribution | — |
| BeatSource | Label/distributor agreement | Typically requires an approved distributor | DJ market |
| Boomkat | Label/distributor agreement | Typically requires an approved distributor | — |

## **4.4 Internet Radio & Non-Interactive** {#4.4-internet-radio-&-non-interactive}

| Platform | Portal / Access Route | Access Reality | Notes |
| :---- | :---- | :---- | :---- |
| Pandora (AMP) | amp.pandora.com | AMP is primarily an artist marketing tool, not a general open delivery portal | Corrected — not fully open |
| SiriusXM | siriusxm.com/music-submissions | Direct music submission portal | Free |
| iHeartRadio | iheart.com/podcasters | Direct RSS/audio upload | Free |
| LiveOne (Slacker) | liveone.com | Direct label submission | Free |
| AccuRadio | accuradio.com | Direct submission via web form | Free |

## **4.5 Asian Platforms** {#4.5-asian-platforms}

| Platform | Portal / Access Route | Access Reality | Notes |
| :---- | :---- | :---- | :---- |
| Tencent Music (QQ, Kugou, Kuwo) | y.tencentmusic.com | Direct via international label portal | Revenue-share model |
| NetEase Cloud Music | music.163.com | Direct via partner portal | — |
| Melon (South Korea) | melon.com | Direct via Label C portal | Requires KOMCA registration |
| Genie Music (South Korea) | genie.co.kr | Direct label upload | — |
| JioSaavn (India) | jiosaavn.com/label-partnership | Direct label portal | — |
| Gaana (India) | gaana.com | Direct label submission | — |
| Anghami (Middle East) | anghami.com | Direct label portal | — |
| Boomplay (Africa/Asia) | boomplay.com | Direct label submission | — |
| AWA (Japan) | awa.fm | Direct label deal | — |
| LINE Music (Japan/Taiwan/Thailand) | music.line.me | Direct label portal | — |
| KKBOX | Label partnership | Aggregator or direct deal | Taiwan/Hong Kong |
| Joox | Label partnership | Aggregator or direct deal | Southeast Asia |
| Bugs\! | Label partnership | Aggregator or direct deal | Korea |
| VIBE | Label partnership | Aggregator or direct deal | Korea |
| Migu Music | Label partnership | Aggregator or direct deal | China |
| Huawei Music | Label partnership | Aggregator or direct deal | China / global Huawei devices |
| Douyin Music | Label partnership | Aggregator or direct deal | China |
| Kanjian Music | Label partnership | Aggregator or direct deal | China |

## **4.6 African Platforms** {#4.6-african-platforms}

| Platform | Portal / Access Route | Access Reality | Notes |
| :---- | :---- | :---- | :---- |
| Boomplay | boomplay.com | Direct label submission | Africa / Asia |
| Mdundo | mdundo.com | Direct submission | Africa |
| UduX | Label partnership | Aggregator or direct deal | Africa |
| Spinlet | Label partnership | Aggregator or direct deal | Africa |
| MTN Music+ | Label partnership | Aggregator or direct deal | Africa |
| Audiomack Africa | audiomack.com/for-artists | Direct artist/label upload | Open self-service |

## **4.7 Latin American Platforms** {#4.7-latin-american-platforms}

| Platform | Portal / Access Route | Access Reality | Notes |
| :---- | :---- | :---- | :---- |
| Claro Música | Label partnership | Aggregator or direct deal | Latin America |
| Sua Música | Label partnership | Aggregator or direct deal | Brazil |
| Palco MP3 | Label partnership | Aggregator or direct deal | Brazil |
| Trebel | Label partnership | Aggregator or direct deal | Latin America / US |

## **4.8 Background Music / B2B** {#4.8-background-music-/-b2b}

| Platform | Portal / Access Route | Access Reality | Notes |
| :---- | :---- | :---- | :---- |
| Soundtrack Your Brand | soundtrackyourbrand.com/label-partners | Direct label partner portal | B2B sync licensing |
| Mood Media | moodmedia.com | Direct music submission | — |
| Cloudcover Music | cloudcovermusic.com | Direct label submission | — |
| PlayNetwork | playnetwork.com | Direct B2B submission | — |

## **4.9 Sync Licensing / Production Music Platforms** {#4.9-sync-licensing-/-production-music-platforms}

These are third-party marketplaces and libraries distinct from the platform's own Sync Licensing Portal (Section 7); they represent additional exploitation and monitoring channels.

| Platform | Type | Notes |
| :---- | :---- | :---- |
| Songtradr | Marketplace / licensing platform | Sync & production-music marketplace |
| Music Gateway | Marketplace / licensing platform | Sync opportunities and pitching |
| DISCO | Delivery/screener platform | Widely used for sync pitching and screeners |
| AudioSparx | Marketplace / licensing platform | Production music library |
| Pond5 | Marketplace / licensing platform | Stock audio and sync |
| Artlist | Marketplace / licensing platform | Subscription sync library |
| Epidemic Sound | Marketplace / licensing platform | Subscription sync library |
| PremiumBeat | Marketplace / licensing platform | Shutterstock-owned sync library |
| Motion Array | Marketplace / licensing platform | Stock audio/video assets |
| Envato Elements | Marketplace / licensing platform | Subscription creative assets |
| AudioJungle | Marketplace / licensing platform | Envato marketplace |
| Shutterstock Music | Marketplace / licensing platform | Stock music licensing |
| Universal Production Music | Production library | Major-affiliated production library |
| APM Music | Production library | Major-affiliated production library |

## **4.10 UGC / Content ID Platforms** {#4.10-ugc-/-content-id-platforms}

These generate substantial royalties through user-generated-content claiming and monetization.

| Platform | Type | Notes |
| :---- | :---- | :---- |
| Facebook Rights Manager | Content-ID style monetization | Requires catalog ownership verification |
| YouTube Content ID | Content-ID system | Access requires YouTube approval |
| TikTok Rights Manager | Content-ID style monetization | Rights/claims management |
| Audible Magic | Audio fingerprinting/identification | Widely used for UGC ID |
| PEX | Rights data & identification | Licensing/analytics for platforms |
| ACRCloud | Audio/video fingerprinting | Identification & monitoring |
| Identifyy | Rights management | Independent rights administration |
| AdRev | Content ID network / CMS | YouTube monetization network |
| BMAT | Music recognition/monitoring | Broadcast & digital monitoring |

## **4.11 Blockchain / Web3 Platforms** {#4.11-blockchain-/-web3-platforms}

| Platform | Type | Notes |
| :---- | :---- | :---- |
| Sound.xyz | Web3 music platform | NFT-based releases |
| Catalog | Web3 music platform | NFT-based releases |
| Royal | Web3 music platform | Fractional royalty ownership |
| Nina | Web3 music platform | Decentralized release protocol |
| Zora | Web3 media platform | NFT/media minting |
| Audius | Web3 streaming protocol | Decentralized streaming |

## **4.12 Social Monetization Programs** {#4.12-social-monetization-programs}

| Program |  | Type | Notes |  |
| :---- | :---- | :---- | :---- | ----- |
| Facebook In-Stream |  | Ad revenue sharing | Video monetization |  |
| Meta Music Revenue Sharing |  | Revenue sharing | Cross-Meta monetization |  |
| Twitch monetization |  | Revenue sharing | Livestream monetization |  |
| YouTube Shorts Revenue Sharing |  | Revenue sharing | Short-form video monetization |  |
| TikTok Pulse |  | Ad revenue sharing | Premium content monetization |  |
| Snapchat Spotlight |  | Revenue sharing | Short-form video monetization |  |
| **Nuuday** | Denmark | A Danish technology group serving over 4 million consumers through six brands (Telmore, YouSee, eesy, etc.). Access generally requires distribution through a partner service. | **Requires Aggregator** — confirm if direct label deals are available. |  |
| **AWA** | Japan | A Japanese music streaming service. Supported for distribution via aggregator services. | **Requires Aggregator** — check for direct label agreements. |  |
| **iMusica** | Latin America (Brazil) | A pioneer in Latin American digital content distribution, managing over 18 million tracks for major mobile operators and music services. A content **aggregator** rather than a standard DSP. | **B2B Aggregator** — you would likely partner with them, not upload directly. |  |
| **Taobao** | China | China's largest e-commerce platform (Alibaba), using music in its live-streaming commerce ecosystem. Music is integrated into product videos and influencer campaigns. Access requires a B2B distribution partner. | **Requires Aggregator** — no direct artist/label upload portal. |  |
| **Fizy** | Turkey | Turkey's premier music streaming platform, operated by Turkcell, with over 10 million users. Features a strong focus on local content and live radio. Access is available through direct feed deals with a DSP. | **Likely Direct Feed** — available for clients with a direct DSP deal. Requires B2B negotiation. |  |
| **FLO Music** | South Korea | A major South Korean streaming platform launched by Dreamus Company (SK Group subsidiary) with over 8.5 million listeners. Access is available through direct deals with major licensing partners (e.g., Merlin). | **Direct Deal** — requires a B2B partnership directly with Dreamus Company. |  |
| **Naver (VIBE)** | South Korea | Operates the 'VIBE' music platform. YG PLUS, a major Korean entertainment company, is the managing agency for VIBE. They also provide 'MIXTAPE', a distribution platform for independent artists. | **Channel Partner** — requires a deal with YG PLUS or other Korean distributors. |  |
| **United Media Agency** | Russia | A Russian content aggregator and distributor founded in 2014 with partnerships like [Mail.ru](https://mail.ru/) Group. | **B2B Aggregator** — a partner organization, not a direct distribution endpoint. |  |

## **4.13 Access Corrections & Caveats** {#4.13-access-corrections-&-caveats}

The following corrections apply across the directory above and should govern how the Delivery Engine (Section 2, Section 10\) classifies each integration:

* Spotify: no open direct-upload portal; ingestion requires an approved delivery partner or a direct licensing agreement for select labels.

* Apple Music / iTunes: no open direct upload; requires an approved encoding/distribution partner or a direct deal.

* Amazon Music: Amazon Music Direct has changed over time and availability is limited — verify current eligibility before treating it as generally open.

* Pandora: AMP is primarily an artist marketing platform, not a general open music delivery portal.

* YouTube Content ID CMS: not openly available; access requires approval by YouTube.

* Meta Rights Manager: approval required; not an open self-service music ingestion portal.

* TikTok Commercial Music Library: intended primarily for business/commercial licensing, not a general replacement for music distribution.

# **5\. Rights Management Documentation** {#5.-rights-management-documentation}

The Rights Manager module stores master rights, publishing rights, neighboring rights, mechanical rights, and synchronization rights, together with territories, expiration dates, ownership, and licenses. It is the system of record that the Royalty Engine, Delivery Engine, and Sync Licensing Portal all read from.

## **5.1 Rights Types Tracked** {#5.1-rights-types-tracked}

* Master Rights

* Publishing Rights

* Neighboring Rights

* Mechanical Rights

* Synchronization Rights

Each right record carries: owner, territory, expiration, ownership percentage, and associated license(s).

## **5.2 Collection Societies — Neighboring Rights** {#5.2-collection-societies-—-neighboring-rights}

| Society | Territory |
| :---- | :---- |
| PPL | United Kingdom |
| Re:Sound | Canada |
| GVL | Germany |
| SENA | Netherlands |
| SCPP | France |
| PPCA | Australia |

## **5.3 Collection Societies — Mechanical Rights** {#5.3-collection-societies-—-mechanical-rights}

| Society | Territory |
| :---- | :---- |
| The MLC | United States |
| Harry Fox Agency | United States |
| MCPS | United Kingdom |
| CMRRA | Canada |
| AMCOS | Australia |

## **5.4 Collection Societies — Performance Rights** {#5.4-collection-societies-—-performance-rights}

| Society | Territory |
| :---- | :---- |
| ASCAP | United States |
| BMI | United States |
| SESAC | United States (invitation only) |
| GMR | United States |
| PRS for Music | United Kingdom |
| SACEM | France |
| GEMA | Germany |
| STIM | Sweden |
| APRA AMCOS | Australia/New Zealand |
| JASRAC | Japan |
| KOMCA | South Korea |
| CASH | Hong Kong |
| MCSC | China |
| SOCAN | Canada |

## **5.5 Identifier Registrations** {#5.5-identifier-registrations}

| Identifier | Purpose | Registrar |
| :---- | :---- | :---- |
| ISRC | Identifies a specific sound recording | usisrc.org / national ISRC agency |
| UPC / EAN | Identifies a release (album/single/EP) | GS1 |
| ISWC | Identifies a musical composition | Performance rights organization |
| ISNI | Identifies a person or organization (party) | ISNI International Agency |
| IPI / IPN (formerly CAE) | Identifies a writer/publisher for royalty administration | PRO/collection society |
| ISCC | Content-based identifier for digital assets | ISCC Foundation |
| DDEX Party ID | Identifies a company/party within DDEX messaging | DDEX |
| GRid | Identifies a specific release for global reporting | IFPI / GRid registrar |

## **5.6 Metadata Registries & Standards** {#5.6-metadata-registries-&-standards}

| Registry / Standard | Purpose |
| :---- | :---- |
| CIS-Net | Cross-society works information network |
| ICE Services | Copyright & royalty data services |
| CWR (Common Works Registration) | Standard for registering compositions with societies |
| DDEX ERN | Electronic Release Notification — delivery messaging |
| DDEX RIN | Recording Information Notification — session/credit metadata |
| DDEX MEAD | Media Enrichment And Description — enhanced metadata |
| DDEX Flat File | Legacy/simplified delivery format |
| Open Music Initiative | Industry rights-data interoperability initiative |

## **5.7 Royalty Collection & Rights-Data Portals** {#5.7-royalty-collection-&-rights-data-portals}

| Platform | Portal | Purpose | Fees |
| :---- | :---- | :---- | :---- |
| SoundExchange | soundexchange.com/register | Non-interactive digital performance royalties (US) | 5% admin fee |
| Music Reports Inc (MRI) | musicreports.com | Mechanical royalty collection from streaming (US) | Admin % fee |
| Shazam | shazam.com/partners | Identification and discovery | Free |
| Musixmatch | artists.musixmatch.com | Lyric display on Spotify/Apple Music | Free |

## **5.8 PRO / Publishing Registration** {#5.8-pro-/-publishing-registration}

These are not distribution portals, but they supply the IPI/CAE numbers and ISWC codes that every DSP and DDEX message requires.

| Organization | Portal | What You Get | Fees |
| :---- | :---- | :---- | :---- |
| ASCAP (US) | ascap.com/join | IPI number, publisher account | $50 one-time (waived for writers) |
| BMI (US) | bmi.com/registration | IPI number, publisher account | Free for writers/publishers |
| SESAC (US) | sesac.com | IPI number | Invitation only |
| PRS for Music (UK) | prsformusic.com | IPI/CAE number | £100 one-time (publisher) |
| SOCAN (Canada) | socan.com | IPI number | $100 one-time (publisher) |
| ISRC Registrar (US) | usisrc.org | ISRC prefix (US-XXX-YY) | Varies |
| UPC Barcodes | gs1.org | UPC barcode (12-digit) | $250–$800 one-time |

## **5.9 Charts & Consumption Reporting** {#5.9-charts-&-consumption-reporting}

| Source | Coverage |
| :---- | :---- |
| Luminate (formerly MRC Data / Nielsen SoundScan) | US consumption & sales data |
| Official Charts Company | United Kingdom charts |
| Oricon | Japan charts |
| Billboard reporting | US charts |
| IFPI reporting | Global industry reporting |

## **5.10 Audio Recognition & Fingerprinting** {#5.10-audio-recognition-&-fingerprinting}

Used for UGC claiming, monitoring, and identification: Gracenote, BMAT, Audible Magic, ACRCloud, PEX.

## **5.11 Lyrics Providers** {#5.11-lyrics-providers}

Beyond Musixmatch: Musixmatch, LyricFind, Genius, LRClib, Apple Lyrics ingestion partners.

## **5.12 Label Management / Integration Partners** {#5.12-label-management-/-integration-partners}

Not distributors, but widely used adjacent systems the platform should be able to interoperate with: FUGA, Label Engine, Revelator, Vydia, Base for Music, SymphonyOS, SourceAudio.

## **5.13 DDEX Delivery Transport** {#5.13-ddex-delivery-transport}

Professional labels deliver DDEX ERN and RIN messages over SFTP, Aspera, or Signiant, in addition to direct API delivery where a DSP supports it.

# **6\. Metadata Specification** {#6.-metadata-specification}

Every field below is captured once — increasingly automatically, at the moment of creation inside the Artist Collaboration Hub (Section 20.6) rather than typed in later — and reused across every export profile: DSP delivery, sync search, PRO registration, mechanical licensing, and production-library ingestion. "Enter once, use everywhere" is the design principle that keeps the platform scalable as partner count grows.

## **6.1 Core Release & Track Metadata** {#6.1-core-release-&-track-metadata}

| Field | Field | Field | Field |
| :---- | :---- | :---- | :---- |
| Artist | Featured Artist | Album Artist | Track Title |
| Version/Mix | Composer | Publisher | Producer |
| Engineer | Mixer | Mastering Engineer | UPC |
| ISRC | ISWC | IPI / CAE | Label |
| Catalog Number | Genre | Subgenre | Mood |
| BPM | Musical Key | Language | P-Line |
| C-Line | Explicit/Clean Indicator | Recording Date | Recording Location |
| Release Date | Original Release Date | Digital Release Date | Pre-Order Date |
| Territories / Territory Restrictions | Copyright Year | Recording Owner | Publishing Administrator |
| Writer Percentages / Splits | Mechanical Splits | Neighboring-Rights Ownership | Start/End Licensing Dates |

## **6.2 Extended Technical / Professional Delivery Fields** {#6.2-extended-technical-/-professional-delivery-fields}

* GRid

* Recording Version

* Session Musicians

* Dolby Atmos Availability

* Apple Digital Masters Status

* Spatial Audio Flag

* Hi-Res Audio Flag

* Artwork Specifications

* Audio Checksum (MD5)

* Delivery Format (DDEX ERN, XML)

## **6.3 Sync-Specific Creative & Legal Metadata** {#6.3-sync-specific-creative-&-legal-metadata}

Sync agencies and music supervisors search on far more than title and ISRC. The Sync Licensing Portal indexes the following fields for every track that has been cleared for sync:

* Mood and emotional descriptors

* Genre and subgenre

* Tempo (BPM)

* Musical key

* Instrumentation

* Vocal / instrumental

* Male / female / mixed vocals

* Language

* Explicit / clean status

* Song structure (intro, build, chorus, outro)

* Similar artists ("sounds like")

* Production quality

* Available versions (instrumental, stems, TV mix, 30s, 60s, no lead vocal, trailer version, etc.)

* Master ownership

* Publishing ownership

* One-stop clearance status

* Contact information

* Territory restrictions

* Exclusivity status

* Sync licensing history

* Keywords and descriptive tags

* Sample-free status (no uncleared samples)

* Availability status (available immediately vs. on hold)

## **6.4 DDEX Message Types Generated** {#6.4-ddex-message-types-generated}

| Message | Purpose |
| :---- | :---- |
| ERN | Electronic Release Notification — the core delivery message |
| RIN | Recording Information Notification — session and credit metadata |
| MEAD | Media Enrichment And Description — enhanced descriptive metadata |
| PIE | Party Identification / relationship messaging |
| MWN | Musical Work Notification — composition-level metadata |
| CWR | Common Works Registration — used for PRO/society registration |

## **6.5 AI Auto-Tagged Fields (Generated While Writing)** {#6.5-ai-auto-tagged-fields-(generated-while-writing)}

Beyond the technical BPM/key/loudness values that Section 20.6's analysis layer extracts automatically, a second AI pass runs while a track is still being written in the Hub, generating descriptive tags no one has to type manually:

* Genre

* Mood

* Emotion

* Instrumentation

* Song sections (hook, chorus, verse, bridge)

* Danceability

* Energy

* Valence

* Keywords

* Commercial similarity

These auto-tagged fields land directly in the Sync-Specific Creative & Legal Metadata set (Section 6.3) and the Advanced Sync Search index (Section 7.2), so a sync agent can filter on mood or commercial similarity for a track the artist finished five minutes ago.

# **7\. SyncOS: Sync Licensing Portal & Marketplace** {#7.-syncos:-sync-licensing-portal-&-marketplace}

SyncOS is a role-gated view into the same catalog database used for DSP delivery, exposing the creative and legal metadata that sync agents, music supervisors, and publishers need — without granting them access to distribution, royalty, or accounting functions. It is scoped as a full marketplace, not a search box: it includes the participants who license music, the Deal Room negotiation workflow, and the A\&R Workspace that gets a song sync-ready in the first place.

## **7.1 Purpose** {#7.1-purpose}

Instead of maintaining a separate spreadsheet or pitch deck for sync, the portal lets a music supervisor query the live catalog directly and receive only tracks that are actually cleared and available for the requested use. Because the Artist Collaboration Hub (Section 20\) publishes the same canonical song record the moment it is finished, a track can appear searchable in SyncOS without anyone re-uploading it a second time.

## **7.2 Advanced Sync Search** {#7.2-advanced-sync-search}

Example query the search engine is designed to answer instantly:

*"Female vocal, indie pop, 95–105 BPM, hopeful mood, clean lyrics, one-stop clearance, instrumental available, worldwide rights, no samples, available immediately."*

This is answerable only if mood, genre, tempo, vocal gender, explicit/clean status, clearance status, available versions, sample-free status, availability, and territory are all structured, indexed fields on every track (Section 6.3) rather than free-text notes.

## **7.3 Role-Based Access** {#7.3-role-based-access}

| User Type | Access |
| :---- | :---- |
| Artist | Upload music, manage profile, view royalties |
| Label Admin | Full catalog management, releases, rights, accounting |
| Sync Agent | Search catalog, preview tracks, view licensing metadata, download approved assets |
| Publisher | View compositions, writer splits, publishing data |
| DSP Partner | Receive delivery packages and metadata |
| Music Supervisor | Search by mood, instrumentation, tempo, and clearance status |
| Accountant | Royalty statements, payments, tax reporting |
| Manager | Invited into Studio/A\&R Workspace projects; views collaborator activity, splits, and release timing on behalf of an artist |
| A\&R | Reviews A\&R Workspace projects, approves a track's readiness for the Sync Marketplace and release scheduling |

## **7.4 Deal Rooms: Sync Request to Royalty Tracking** {#7.4-deal-rooms:-sync-request-to-royalty-tracking}

This is the authoritative version of the clearance workflow (see the resolution note in Section 1.2). Rather than the email back-and-forth a sync request normally involves — for example, a brief from a streaming service or a network requesting a song — the entire negotiation happens inside a private Deal Room shared between the label and the requesting party:

1\. Sync Request — a supervisor, brand, or studio requests a song (Section 7.5) via search or direct brief

**↓**

2\. Private Workspace — a Deal Room is created for that request, scoped to only the relevant parties

**↓**

3\. Review Tracks — the requester previews secure, watermarked candidate tracks with full metadata

**↓**

4\. Approve Versions — the requester selects from available mixes, instrumentals, and stems

**↓**

5\. Negotiate Terms — use, territory, term, and media are negotiated inside the Deal Room, not over email

**↓**

6\. Contract — Rights Manager checks master \+ publishing ownership, one-stop status, and territory restrictions, then generates the license contract

**↓**

7\. Sign — both parties execute the contract inside the platform

**↓**

8\. Invoice — an invoice is generated and tracked against the license

**↓**

9\. Deliver — approved assets (stems, TV mix, cut-downs, trailer version) are released for download

**↓**

10\. Usage Tracking — placement and usage are tracked against the license going forward

**↓**

11\. Royalty Tracking — sync fees and any resulting royalty share flow into the Royalty Engine (Section 10\) against the same canonical song record

License terms, fee, contract, invoice, and usage history are all logged permanently against the track's sync licensing history (Section 6.3) — a Deal Room never produces an artifact that lives only in someone's inbox.

## **7.5 Sync Marketplace Participants** {#7.5-sync-marketplace-participants}

SyncOS is scoped as a complete marketplace connecting the catalog to every category of buyer, not just traditional music supervisors:

| Participant Category |
| :---- |
| Music Supervisors |
| Brands |
| Studios |
| Agencies |
| Advertisers |
| Game Studios |
| Streaming/Network Buyers (e.g., Netflix, Hulu, Prime) |
| Sports Leagues & Broadcasters (e.g., ESPN, NBA, NHL, NFL) |
| Creators |

Each participant category authenticates through the same Role-Based Access model (Section 7.3) and transacts through the same Deal Room mechanism (Section 7.4) — a game studio licensing an instrumental for a trailer and a broadcaster licensing a track for a stadium montage go through an identical, auditable path.

## **7.6 Automatic Sync Package Generation** {#7.6-automatic-sync-package-generation}

Every song should generate a complete sync package the moment its master is approved, with no manual preparation step. This is the delivery-side counterpart to the Automated Metadata Pipeline in Section 20.6:

1\. Master WAV approved

**↓**

2\. Instrumental rendered

**↓**

3\. TV Mix rendered

**↓**

4\. 30-second cut generated

**↓**

5\. 60-second cut generated

**↓**

6\. Stems packaged

**↓**

7\. Lyrics attached

**↓**

8\. Full metadata attached (Section 6\)

**↓**

9\. Mood tags attached (Section 6.5)

**↓**

10\. BPM attached

**↓**

11\. Musical key attached

**↓**

12\. ISRC attached

**↓**

13\. Publishing data attached

**↓**

14\. Master ownership attached

**↓**

15\. One-stop clearance status attached

**↓**

16\. Secure preview links generated

**↓**

17\. Default license terms attached

**↓**

18\. Worldwide availability flag set

**↓**

19\. Package published into the Sync Marketplace (Section 7.5)

Because the package is generated automatically from the canonical record rather than assembled by hand per request, a track becomes fully sync-searchable (Section 7.2) the same day it's mastered.

## **7.7 A\&R Workspace** {#7.7-a&r-workspace}

The A\&R Workspace is SyncOS's front door back into Studio (Section 20.3) — it extends the same real-time collaborative project to include the business-side roles who need to sign off before a song is sync-ready, so a supervisor is reviewing the actual live session rather than a static export:

1\. Producer uploads beat

**↓**

2\. Writer invited

**↓**

3\. Singer invited

**↓**

4\. Engineer invited

**↓**

5\. Manager invited

**↓**

6\. Label invited

**↓**

7\. A\&R invited

**↓**

8\. Music Supervisor invited

Everyone works in the same project, on the same canonical record, with the same permissions model (Section 7.3) — the Music Supervisor's presence in the A\&R Workspace is what triggers eligibility for the Automatic Sync Package (Section 7.6) once the label and A\&R sign off.

# **8\. API Documentation** {#8.-api-documentation}

The platform is designed API-first: every module in Section 2.1 is reachable through the same REST API that powers the web dashboards, so partner integrations, mobile apps, and internal tools all consume one contract.

## **8.1 Core Catalog & Distribution Endpoints** {#8.1-core-catalog-&-distribution-endpoints}

| Method | Endpoint | Description |
| :---- | :---- | :---- |
| POST | /artists | Create/register an artist profile |
| POST | /albums | Create a release (album/EP/single) |
| POST | /tracks | Add a track to a release |
| POST | /deliver | Trigger delivery of a release to one or more DSPs |
| POST | /royalties | Ingest or trigger calculation of a royalty statement period |
| GET | /analytics | Retrieve streaming/revenue analytics |
| GET | /releases | Retrieve catalog release data |

## **8.2 Sync Portal Endpoints (proposed extension)** {#8.2-sync-portal-endpoints-(proposed-extension)}

To support the Sync Licensing Portal described in Section 7, the following endpoints extend the core API surface:

| Method | Endpoint | Description |
| :---- | :---- | :---- |
| GET | /sync/search | Search catalog by creative and legal descriptors (mood, BPM, key, clearance status, etc.) |
| GET | /sync/tracks/{id} | Retrieve full sync metadata and available versions for a track |
| GET | /sync/tracks/{id}/preview | Stream a watermarked preview to an authorized sync agent |
| POST | /sync/license-requests | Submit a license/clearance request for a track |
| GET | /sync/license-requests/{id} | Check the status of a license/clearance request |
| GET | /sync/tracks/{id}/assets | List downloadable approved assets (stems, TV mix, cut-downs) |

## **8.3 Delivery Adapter Pattern** {#8.3-delivery-adapter-pattern}

Every DSP requires a different delivery format — Spotify's feed differs from Apple's, which differs from Amazon's, Tencent's, and Deezer's. Rather than uploading to each platform individually, the Delivery Engine generates a platform-specific XML/DDEX payload per adapter from one canonical catalog record:

1\. Catalog record

**↓**

2\. Spotify Adapter

**↓**

3\. Apple Music Adapter

**↓**

4\. Amazon Music Adapter

**↓**

5\. TikTok Adapter

**↓**

6\. Meta Adapter

**↓**

7\. YouTube Adapter

**↓**

8\. Pandora Adapter

**↓**

9\. Deezer Adapter

**↓**

10\. QQ Music Adapter

**↓**

11\. NetEase Adapter

**↓**

12\. Boomplay Adapter

**↓**

13\. Bandcamp Adapter

**↓**

14\. Qobuz Adapter

Each adapter is responsible for: field mapping to that DSP's schema, authentication/transport (API, SFTP, Aspera, or DDEX ERN), delivery confirmation, and error/rejection handling back to the Catalog Manager.

## **8.4 V1 Distribution Partner API — TooLost** {#8.4-v1-distribution-partner-api-—-toolost}

Consistent with the White-Label Distribution strategy in Section 16.1, the platform ships its first version by routing releases through TooLost's public REST API rather than waiting on direct DSP agreements. A dedicated "TooLost Adapter" behind the Delivery Engine (Section 8.3) translates the canonical catalog record into TooLost's release/track schema and drives it through draft → metadata → delivery → submit, while the rest of the platform (Catalog Manager, Rights Manager, Royalty Engine, Sync Portal) continues operating exactly as designed — the DSP relationship is swappable without touching any other module.

**Connection Details**

| Item | Value |
| :---- | :---- |
| Base URL (production) | https://api.toolost.com/v1 |
| Base URL (sandbox) | https://api-sandbox.toolost.com/v1 (separate credentials, unmetered) |
| Spec | OpenAPI 3.1.0 |
| Auth | OAuth 2.0 Authorization Code flow with PKCE (SHA-256); credentials issued per application from the TooLost Developer Portal |
| Auth URL | https://toolost.com/oauth/authorize |
| Token URL | https://toolost.com/oauth/token |
| Credential placement | Authorization: Bearer header |

**Plans, Quota & Rate Limits**

Production calls are metered per developer account against a monthly included-call quota pooled across all production apps; sandbox traffic is never metered or billed. Every response carries X-Api-Plan, X-Api-Quota-Limit, X-Api-Quota-Used, and X-Api-Quota-Remaining headers, plus standard X-RateLimit-\* / Retry-After burst headers, so the adapter can self-throttle before hitting a 429\.

| Plan | Price/mo | Included calls/mo | Overage/call | Burst (req/min) | Behavior at quota |
| :---- | :---- | :---- | :---- | :---- | :---- |
| Free | $0 | 5,000 | — | 60 | Hard cap — requests blocked (429) |
| Starter | $99 | 250,000 | $0.0008 | 250 | Overage billed |
| Scale | $999 | 3,000,000 | $0.0004 | 1,000 | Overage billed |

A 429 fires either on burst-limit breach (retry after Retry-After seconds) or on monthly-quota exhaustion on the Free plan ({"error":"quota\_exceeded"}). 401s and 429s are never counted against quota; 5xx responses are logged but not billed — the adapter's retry logic should treat those three cases differently rather than backing off uniformly.

**Release & Track Lifecycle Endpoints**

| Method | Endpoint | Purpose | Scope |
| :---- | :---- | :---- | :---- |
| POST | /releases | Create release (draft) | write:releases |
| GET | /releases | List releases (paginated, filterable by status/type/search) | read:releases |
| GET | /releases/{releaseId} | Get a single release | read:releases |
| PATCH | /releases/{releaseId}/metadata | Update release-level metadata (genre, dates, UPC, C/P lines, etc.) | write:releases |
| PATCH | /releases/{releaseId}/delivery | Update target platforms, territories, and delivery options | write:releases |
| PATCH | /releases/{releaseId}/video | Update Music Video release metadata | write:releases |
| POST | /releases/{releaseId}/submit | Submit a completed draft release for review | write:releases |
| DELETE | /releases/{releaseId} | Delete a draft release | write:releases |
| POST | /releases/validate/upc | Validate UPC format and uniqueness | write:releases |
| POST | /releases/validate/isrc | Validate ISRC format and uniqueness | write:releases |

| Method | Endpoint | Purpose | Scope |
| :---- | :---- | :---- | :---- |
| GET | /releases/{releaseId}/tracks | List tracks on a release | read:releases |
| GET | /releases/{releaseId}/tracks/{trackId} | Get a single track | read:releases |
| PUT | /releases/{releaseId}/tracks | Replace the track list for a release | write:releases |
| POST | /releases/{releaseId}/tracks/upload-url | Request a signed upload URL for audio/instrumental/Dolby files | write:releases |
| PATCH | /releases/{releaseId}/tracks/{trackId}/file | Attach an uploaded file to a track | write:releases |

Release status moves through draft → in\_review → live (or takedown\_pending → takedown\_complete). The adapter should treat draft/metadata/delivery/tracks calls as idempotent staging steps and only call POST /releases/{releaseId}/submit once the Validation Engine (Section 9\) has passed the release.

**Reporting, Preferences & Reference Data Endpoints**

| Method | Endpoint | Purpose | Scope |
| :---- | :---- | :---- | :---- |
| GET | /me | Get authenticated user profile | read:profile |
| GET / POST | /preferences/\* | Artist/label preference management and platform-profile linking (Spotify, YouTube, Apple search & link) | preferences scopes |
| GET | /sales/overview | Monthly earnings overview | read:sales |
| GET | /sales/tracks (+ /{isrc}/overview, /channels, /territories) | Track-level earnings and breakdowns | read:sales |
| GET | /sales/releases (+ /{releaseId}/overview, /channels, /territories) | Release-level earnings and breakdowns | read:sales |
| GET | /sales/artists/\* | Artist-level earnings and breakdowns | read:sales |
| GET | /sales/channels (+ /{channel}/overview, /releases, /territories) | Channel/platform-level earnings and breakdowns | read:sales |
| GET | /sales/territories | Aggregated earnings by territory | read:sales |
| GET | /sales/stream-rates (+ /{service}/overview, /territories) | Per-platform stream-rate data | read:sales |
| GET | /analytics/overview, /tracks, /platforms, /usage-discovery, /release-links | Streaming analytics, chart position, and discovery/usage-match data | analytics scopes |
| GET | /lookup/countries | Reference list of countries | none |
| GET | /lookup/platforms | Reference list of deliverable DSPs/stores | none |
| GET | /lookup/genres | Reference list of genres | none |
| GET | /lookup/languages | Reference list of supported lyric/metadata languages | none (auth required) |

The sales and analytics endpoint groups (overview, tracks, releases, artists, channels, territories, stream rates) give the Royalty Engine (Section 10.3) an independently reconcilable feed of TooLost-sourced earnings, separate from whatever royalty files TooLost delivers by file/portal — useful for catching discrepancies between reported and API-visible figures.

**Native AI-Content Fields**

TooLost's own release and track schema already carries AI-disclosure fields — isAiGeneratedArtwork, aiContentApproved, and an aiDocumentation attachment at the release level, plus aiAssisted (with a supporting file) at the track level. This independently validates the AI-metadata requirement in Section 18.2: the adapter should map the platform's own AI-assisted/synthetic-vocal flags directly onto these fields rather than treating AI disclosure as a platform-only concern — TooLost will expect it on every submitted release.

# **9\. Data Validation Rules** {#9.-data-validation-rules}

No release reaches the Delivery Engine without passing the Validation Engine. This is what allows the platform to credibly tell a DSP: "we validate releases before submission."

## **9.1 Validation Engine Modules** {#9.1-validation-engine-modules}

* DDEX Validation

* Metadata Validation

* Artwork Validation

* Audio Validation

* Copyright Checks

* Territory Checks

## **9.2 Artwork Validation Rules** {#9.2-artwork-validation-rules}

* Minimum 3000 × 3000 pixels

* RGB color space

* JPEG format

* No URLs embedded in artwork

* No blurry images

* No borders

## **9.3 Audio Processing Pipeline** {#9.3-audio-processing-pipeline}

1\. WAV upload

**↓**

2\. Validate

**↓**

3\. Generate waveform

**↓**

4\. Loudness analysis

**↓**

5\. Peak detection

**↓**

6\. MD5 checksum

**↓**

7\. Audio fingerprint

**↓**

8\. Store

**↓**

9\. Deliver

For audio created inside the Artist Collaboration Hub, the AI analysis and binary metadata tagging steps detailed in Section 20.6 (Essentia.js/Librosa → taglib-wasm) run between "Validate" and "Store" above, so BPM, key, and AI-disclosure tags are already embedded in the file header before it ever reaches the Delivery Engine.

## **9.4 Metadata Validation Requirements** {#9.4-metadata-validation-requirements}

Every release must carry complete values for the core metadata fields in Section 6.1 before delivery is permitted. Missing ISRC, UPC, IPI/CAE, or rights-ownership data blocks delivery rather than allowing an incomplete record to reach a DSP.

## **9.5 Copyright & Territory Checks** {#9.5-copyright-&-territory-checks}

The Validation Engine cross-references declared rights ownership (Section 5.1) and territory restrictions against each target DSP or sync licensee before allowing delivery or clearance, preventing over-licensing or delivery into a restricted territory.

## **9.6 Access-Reality Validation** {#9.6-access-reality-validation}

Because several "direct upload" claims across the industry overstate what is actually available (Section 4.13), the Delivery Engine's DSP adapter configuration must encode the true access route for each platform — open upload, aggregator-required, or approval-required — so releases are never routed to a channel the platform does not actually have standing to deliver to.

# **10\. Release Workflow** {#10.-release-workflow}

## **10.1 Onboarding** {#10.1-onboarding}

1\. Artist/label signup

**↓**

2\. Verification

**↓**

3\. Tax forms

**↓**

4\. Banking details

**↓**

5\. Contracts executed

**↓**

6\. Release calendar established

## **10.2 End-to-End Release Pipeline** {#10.2-end-to-end-release-pipeline}

1\. Catalog Management — artist, release, and track records created; assets and metadata entered once

**↓**

2\. Validation Engine — DDEX, metadata, artwork, audio, copyright, and territory checks

**↓**

3\. Delivery Engine — per-DSP adapters generate and transmit platform-specific feeds

**↓**

4\. Royalty Engine — DSP reports ingested and calculated into per-participant statements

**↓**

5\. Accounting — artist balances updated, split payments executed, tax forms and withdrawals processed

## **10.3 Royalty Calculation Flow** {#10.3-royalty-calculation-flow}

1\. Platform (DSP) sends monthly report

**↓**

2\. Calculate gross royalty per stream/sale

**↓**

3\. Apply Artist %

**↓**

4\. Apply Producer %

**↓**

5\. Apply Songwriter %

**↓**

6\. Apply Publisher %

**↓**

7\. Apply Neighboring Rights share

**↓**

8\. Generate statement

## **10.4 Split Payment Example** {#10.4-split-payment-example}

| Participant | Share |
| :---- | :---- |
| Producer | 10% |
| Writer | 25% |
| Artist | 40% |
| Label | 25% |

One incoming payment is automatically divided across all participants according to the splits stored in the Rights Manager — no manual reconciliation required.

# **11\. Security Overview** {#11.-security-overview}

The following baseline controls are recommended given the platform's technology stack (Section 2.2) and the sensitivity of the data it holds — financial account details, unreleased audio, contracts, and royalty/payment records.

## **11.1 Identity & Access** {#11.1-identity-&-access}

* OAuth 2.0 / OpenID Connect for all human and service authentication

* Role-based access control aligned to Section 7.3 (Artist, Label Admin, Sync Agent, Publisher, DSP Partner, Music Supervisor, Accountant)

* Least-privilege scoping for API keys issued to DSP and sync partners

* Multi-factor authentication required for Label Admin and Accountant roles

## **11.2 Data Protection** {#11.2-data-protection}

* Encryption in transit (TLS) for all API and delivery traffic, including DDEX transport over SFTP/Aspera/Signiant

* Encryption at rest for object storage (S3/Blob/R2) and the PostgreSQL database

* Audio checksums (MD5) and fingerprinting used to detect tampering or unauthorized substitution (Section 9.3)

* Watermarked previews for unreleased or unlicensed audio served through the Sync Portal (Section 7.4)

## **11.3 Application Security** {#11.3-application-security}

* Input validation at the Validation Engine boundary before any data reaches Catalog Management (Section 9\)

* Secrets management for DSP/partner API credentials, isolated per adapter

* Containerized services (Docker) with image scanning prior to deployment

* Audit logging of rights and split-percentage changes given their direct financial impact

## **11.4 Partner & Third-Party Risk** {#11.4-partner-&-third-party-risk}

Because delivery adapters and MCP/DDEX transport connect to dozens of external DSPs, PROs, and sync marketplaces (Section 4), each integration should be reviewed for its own authentication model and data-sharing scope before being enabled in production.

# **12\. Disaster Recovery Plan** {#12.-disaster-recovery-plan}

A recommended baseline recovery posture for the architecture described in Section 2, to be refined with concrete Recovery Time Objective (RTO) and Recovery Point Objective (RPO) targets once production traffic and contractual SLAs with DSP/sync partners are known.

## **12.1 Backup Strategy** {#12.1-backup-strategy}

* PostgreSQL: automated point-in-time backups plus periodic full snapshots

* Object storage (S3/Blob/R2): versioning enabled so overwritten or deleted audio/artwork assets remain recoverable

* Configuration and adapter mappings (per-DSP field mappings) version-controlled alongside application code

* Cross-region replication of both the database and object storage to protect against a single-region outage

## **12.2 Failure Scenarios & Response** {#12.2-failure-scenarios-&-response}

| Scenario | Response |
| :---- | :---- |
| Database outage | Failover to replica; restore from most recent point-in-time backup if replication has failed |
| Object storage outage | Serve from cross-region replica; re-queue any in-flight deliveries once restored |
| Delivery Engine adapter failure (single DSP) | Isolate the failing adapter; other DSP deliveries continue unaffected; retry queue holds failed deliveries |
| Validation Engine failure | Halt new deliveries platform-wide rather than allow unvalidated releases to reach any DSP |
| Royalty Engine calculation error | Freeze affected statement period before payout; recompute from source DSP reports before releasing split payments |
| Credential/security incident with a partner integration | Revoke and rotate the affected adapter's credentials; suspend that integration until reviewed |

## **12.3 Business Continuity** {#12.3-business-continuity}

* Background job queue (Hangfire/BullMQ) persists pending deliveries and royalty jobs so a service restart resumes rather than loses in-flight work

* Multi-tenant architecture (Phase 4, Section 3\) isolates a single label/tenant's incident from others sharing the platform

* Regular restore drills to confirm backups are actually recoverable, not just captured

# **13\. Analytics & Reporting** {#13.-analytics-&-reporting}

The Analytics module surfaces catalog performance across every channel in Section 4, sourced from the same royalty and delivery data used for accounting.

* Streams

* Revenue

* Countries

* Cities

* Devices

* Followers

* Playlist adds

* Saves

* Shazams

* TikTok videos

* Revenue by DSP

* Revenue by track

* Revenue by album

# **14\. Revenue & Royalty Distribution by Role** {#14.-revenue-&-royalty-distribution-by-role}

The Royalty Engine and Split Payments module (Sections 2.1, 10.3, 10.4) must model two separate income streams — master recording income and composition income — since each is owned, controlled, and paid out through different parties.

## **14.1 Master Recording Income** {#14.1-master-recording-income}

The master recording is typically owned or controlled by the Label and features the Artist.

| Role | How They Are Paid |
| :---- | :---- |
| Record Labels | Master Share (roughly 50–70% of streaming revenue) direct from digital distributors; 50% of satellite/internet radio royalties via SoundExchange as Rights Owner; direct master sync fees for TV/film/game/commercial placements; direct profit on vinyl, CD, cassette, and merchandise sales. |
| Featured Artists | A negotiated percentage of master streaming/sales revenue (roughly 15%–50%+) from the label, often after recoupment of advances; 45% of satellite/internet radio royalties directly from SoundExchange as Featured Artist; the majority of touring and live appearance fees. |
| Producers | An upfront production fee paid before work begins; typically 1%–5% of master streaming/sales revenue ("producer points"), paid out of the artist's share via a Letter of Direction; a share of the artist's SoundExchange royalties if a Letter of Direction (LOD) is on file. |
| Audio Engineers (Mixing/Mastering) | A flat, upfront work-for-hire day-rate or per-song fee; generally no residual royalties or master-ownership backend unless a separate producer or co-writing credit was negotiated. |

## **14.2 Composition Income** {#14.2-composition-income}

The composition is created by songwriters and administered by publishers.

| Role | How They Are Paid |
| :---- | :---- |
| Songwriters | Writer's Share of performance royalties (50%) when a song is broadcast on TV, radio, at live venues, or streamed, paid directly by the PRO (e.g., BMI or ASCAP); a share of the statutory mechanical rate whenever the song is reproduced (streamed, downloaded, or pressed), paid through mechanical collection agencies such as The MLC; an upfront publishing advance if signed to a publisher. |
| Producers (when co-writing) | If a producer created the beat or contributed to melody/arrangement, they are legally a co-songwriter and collect an agreed percentage (commonly 25% or 50%) of all performance and mechanical royalties alongside the lyricist. |

## **14.3 Summary of Payment Sources by Role** {#14.3-summary-of-payment-sources-by-role}

| Role | Primary Payor / Platform |
| :---- | :---- |
| Record Label | Digital distributors, sync licensing deals, SoundExchange (50% share) |
| Featured Artist | The record label (or distributor if independent), SoundExchange (45% share) |
| Producer | The record label (upfront fee \+ master points), BMI/ASCAP (if co-writing) |
| Audio Engineer | The studio, record label, or independent artist (flat day/project rate) |
| Songwriter | BMI or ASCAP (performance), The MLC (mechanicals), publishing administrators |

This role-to-payor mapping should drive how the platform's onboarding flow collects banking, tax, and PRO/publisher registration details in Section 10.1 — each role needs different downstream payment routing, not a single generic "artist payout" record.

# **15\. Often-Overlooked Royalty Streams** {#15.-often-overlooked-royalty-streams}

Beyond the core streaming, sales, and sync income modeled in Section 14, five additional royalty streams are easy to miss when scoping the Royalty Engine but represent real, recurring revenue the platform should track and reconcile on behalf of its catalog.

## **15.1 International Performance (Neighboring Rights)** {#15.1-international-performance-(neighboring-rights)}

Who is paid: record labels and featured artists. Outside the United States, terrestrial AM/FM radio stations must pay record labels and artists when their songs are broadcast — a payment the US does not require domestically. International collection societies collect these neighboring-rights royalties globally and pay them out through agencies such as PPL (UK) or specialized US administrators (see Section 5.2).

## **15.2 Session Musicians & Backup Vocalists (Non-Featured Artists)** {#15.2-session-musicians-&-backup-vocalists-(non-featured-artists)}

Who is paid: session players, background singers, and orchestral musicians. They typically receive an upfront flat fee under a union contract (such as AFM or SAG-AFTRA). Separately, SoundExchange holds back a 5% pool of all digital performance royalties specifically to pay these non-featured artists — they are paid directly from that fund, not by the label.

## **15.3 Sampling Fees & Clearances** {#15.3-sampling-fees-&-clearances}

Who is paid: the original label and the original songwriter. When a new artist samples an older recording, the new artist or label must pay an upfront clearance fee to both the original label and the original publisher. The original rights holders typically also demand a permanent percentage share of the new song's master and publishing royalties going forward — the Rights Manager (Section 5.1) should be able to model this as an ongoing split, not a one-time fee.

## **15.4 Public Performance of the Master (US Venues)** {#15.4-public-performance-of-the-master-(us-venues)}

Who is paid: record labels. While ASCAP and BMI collect money from bars, clubs, and sports stadiums for songwriters, an emerging US framework — via services such as Audiam or SoundExchange brand partnerships — is beginning to collect monetization for the master recording itself when played inside specific commercial businesses and digital spaces.

## **15.5 Content ID & User-Generated Content (UGC)** {#15.5-content-id-&-user-generated-content-(ugc)}

Who is paid: record labels and songwriters. Platforms such as YouTube, TikTok, and Instagram use audio fingerprinting (Section 5.10, Section 4.10) so that whenever a user places a track in the background of their video, Content ID automatically places ads on that video or tracks the views, paying a micro-royalty back to both the label (via its distributor) and the songwriter (via publishing administrators).

# **16\. Distribution Architecture Options** {#16.-distribution-architecture-options}

Building direct delivery pipelines to Spotify and Apple Music from scratch is not realistic without significant capital and licensing history (reinforcing the corrections in Section 4.13). There are two practical routes for how the platform actually gets tracks onto DSPs, and they are not mutually exclusive over time.

## **16.1 White-Label Distribution (B2B SaaS) — V1 Partner: TooLost** {#16.1-white-label-distribution-(b2b-saas)-—-v1-partner:-toolost}

Partnering with an existing supply-chain distributor — such as FUGA, AudioSalad, Eveara, or TooLost — lets that partner handle technical ingestion and delivery to DSPs under the hood, while the platform's own front-end tools remain fully branded as the company's product. This is the fastest path to market and the one consistent with the Phase 1–2 roadmap in Section 3\.

For V1, the platform ships against TooLost's public REST API (full connection details, endpoints, quota, and rate limits in Section 8.4) specifically so releases can go live immediately while the direct-to-DSP and DDEX capability described in Section 16.2 is built in the background. Because the Delivery Engine uses the adapter pattern in Section 8.3, TooLost is one interchangeable adapter — it can run alongside additional white-label partners or be phased out entirely once direct DSP relationships are secured, without changing the Catalog Manager, Rights Manager, or Royalty Engine.

## **16.2 Direct-to-DSP Licensing** {#16.2-direct-to-dsp-licensing}

Once the platform has scaled to thousands of tracks and raised institutional funding, it can apply for direct feeds with Spotify, Apple Music, and Amazon. This improves margins but requires heavier engineering investment to manage DDEX metadata standards (Section 6.4, Section 8.3) end-to-end, matching the Phase 4 platform ambitions in Section 3\.

# **17\. Platform Monetization Models** {#17.-platform-monetization-models}

To differentiate from comparable services (for example, UnitedMasters' subscription or \~10% royalty-split model), the platform can combine two complementary monetization approaches.

## **17.1 The Freemium Creator Funnel** {#17.1-the-freemium-creator-funnel}

Charge a monthly subscription for advanced creation tools — mastering processing limits, generative-voice API usage tiers, AI writing assistants — while offering basic distribution for free. This funnels a wide top of the funnel toward paid tool usage rather than gating distribution itself.

## **17.2 The "Label Services" Split** {#17.2-the-"label-services"-split}

For top-performing independent artists on the platform, offer curation, marketing capital, and playlist pitching in exchange for a 15%–30% cut of their master royalties, while leaving them with 100% of their publishing — mirroring the master/composition income separation modeled in Section 14\.

# **18\. AI-Generated Content: Legal & Rights Bottlenecks** {#18.-ai-generated-content:-legal-&-rights-bottlenecks}

Integrating generative-voice tools (for example, ElevenLabs-style voice synthesis) into the creation workspace introduces rights and compliance risks the platform must design against from the start.

## **18.1 Voice Model Rights** {#18.1-voice-model-rights}

If artists use a generative-voice tool to create synthetic vocals, the platform's Terms of Service must clearly define who owns the resulting audio. If a user clones the voice of a famous artist without permission, the platform could face immediate takedown notices or litigation from major labels.

## **18.2 AI Metadata Tracking** {#18.2-ai-metadata-tracking}

DSPs are increasingly strict about labeling AI-assisted content. The Delivery Engine (Section 8.3) needs automated metadata tags that explicitly declare when a track features synthetic vocals or AI-generated instrumentation, to prevent store rejections — this should be added as a required field alongside the core metadata in Section 6.1.

## **18.3 Automated Split Sheets & Registration** {#18.3-automated-split-sheets-&-registration}

Because tracks are created inside the platform's own workspace, the registration process can be fully automated: the moment a track is finished, the app can generate a digital split sheet and automatically push registration data to ASCAP, BMI, The MLC, and SoundExchange via their developer APIs — extending the Rights Manager (Section 5.1) and the sync/PRO endpoints in Section 8 with a registration-on-completion workflow rather than a manual, after-the-fact filing step.

# **20\. Artist Collaboration Hub** {#20.-artist-collaboration-hub}

The Artist Collaboration Hub is the Creative OS layer of Music-in-a-Box (Section 2.1) — the browser-based environment where an artist, producer, writer, singer, and engineer actually build a release together, rather than just where the platform stores it afterward. This is a full implementation, not an add-on: everything downstream in this document (metadata, rights, distribution, sync, royalties) assumes the canonical song record originates here.

## **20.1 Purpose & Scope** {#20.1-purpose-&-scope}

Instead of directing artists to third-party tools (BandLab for creation, Soundtrap for collaboration, a separate DAW for mixing) and then re-uploading the finished file into a distributor, the Hub is a fully branded, browser-based studio the artist logs into directly. Every stem, take, and edit routes automatically to the label's own catalog and A\&R view — nothing is created outside the platform's reach, and nothing has to be manually re-entered at release time.

## **20.2 Browser DAW Architecture** {#20.2-browser-daw-architecture}

The multi-track recording and editing core is built from open frameworks rather than from scratch, using the stack defined in Section 2.3.1:

| Capability | Tool / Library |
| :---- | :---- |
| Timing, synths, samplers, FX | Tone.js — the standard framework for web audio; wraps the native Web Audio API with a robust clock timeline for sequencers, synths, and built-in studio effects (reverb, delay, compression) |
| Visual multi-track timeline | Wavesurfer.js — renders accurate waveforms, scrubbing, and zoom, matching the feel of a desktop DAW timeline |
| Multi-track layering & mixing | web-audio-daw — a purpose-built repository for adding audio layers, grouping tracks, and adjusting per-track volume and panning |
| Vocal / instrument recording | RecordRTC — a WebRTC media recording library that captures microphone input in high quality and prepares it for upload |
| Premium virtual instruments (optional) | Steinberg VST3 Web SDK — ports professional plugins into WebAssembly so high-end instruments can run inside the custom studio |
| Lightweight sequencer components (optional) | Proton (AudioKit) — an open-source framework for building stylistic, label-branded web sequencers |

## **20.3 Real-Time Collaboration Layer** {#20.3-real-time-collaboration-layer}

The feature that separates this from a single-player web DAW is that two or more collaborators can edit the same session at the same time — the "Soundtrap side" of the design. This requires a conflict-free data-sync layer, not just a shared file:

| Layer | Tool / Behavior |
| :---- | :---- |
| Data synchronization | Yjs (open-source CRDT) — treats the song arrangement (tracks, regions, volume, MIDI notes) as a shared document; if Producer A moves a loop while Producer B changes a volume fader, Yjs merges both changes instantly without overwriting either one |
| WebSocket infrastructure | Hocuspocus (self-hosted, built by the creators of Tiptap) for full stack ownership, or Liveblocks (managed SaaS with ready-made React hooks) for faster time-to-market — relays cursors, MIDI note changes, and chat between collaborators |
| Audio asset sync | Supabase Realtime \+ Cloudflare R2 / AWS S3 — lets every collaborator see and hear a new vocal stem the instant a singer finishes recording it |

This produces three concrete collaborative workflows: live multi-user MIDI arrangement in a shared piano-roll grid; presence cursors so collaborators see exactly which bars a teammate is currently editing; and vocal state locking, where clicking "Record" writes a temporary isRecording flag onto that track node, locking it on every other screen so no one's take gets overwritten mid-capture.

**Reference Implementation: Collaborative Session Hook**

Client-side hook that initializes a shared Yjs document and binds it to a WebSocket provider (Next.js requires this to run entirely client-side):

// apps/web-studio/hooks/useCollaborativeStudio.ts  
'use client';  
import { useEffect, useState } from 'react';  
import \* as Y from 'yjs';  
import { LiveblocksProvider } from '@liveblocks/yjs'; // or a custom Hocuspocus provider  
   
export function useCollaborativeStudio(roomId: string) {  
  const \[sharedTimeline, setSharedTimeline\] \= useState\<Y.Map\<any\> | null\>(null);  
  const \[activeUsers, setActiveUsers\] \= useState\<any\[\]\>(\[\]);  
   
  useEffect(() \=\> {  
    // 1\. Initialize a Yjs collaborative document instance  
    const doc \= new Y.Doc();  
   
    // 2\. Connect the document to the real-time WebSocket broker  
    const provider \= new LiveblocksProvider(roomId, doc);  
   
    // 3\. Define a shared layout map for track configurations  
    const tracksMap \= doc.getMap('studio-tracks-layout');  
    setSharedTimeline(tracksMap);  
   
    // 4\. Listen for real-time remote mutations from other collaborators  
    tracksMap.observe((event) \=\> {  
      // Trigger the Tone.js / Web Audio engine to update track parameters  
    });  
   
    // 5\. Clean up open connections when a collaborator exits the workspace  
    return () \=\> {  
      provider.destroy();  
      doc.destroy();  
    };  
  }, \[roomId\]);  
   
  return { sharedTimeline, activeUsers };  
}

## **20.4 AI Music Tools** {#20.4-ai-music-tools}

Three generative-AI capabilities are embedded directly in the Hub rather than bolted onto delivery, so AI usage is captured at the moment it happens, not reconstructed afterward.

### **20.4.1 Roex AI Mastering** {#20.4.1-roex-ai-mastering}

"Studio-quality masters in minutes, AI-driven."

A collaborator finishes a mix inside the workspace and receives a mastered, delivery-ready master without a separate studio round-trip. This sits at the front of the Audio Processing pipeline (Section 9.3): a mastering pass runs before the WAV is validated, checksummed, and fingerprinted, so the file reaching the Delivery Engine is already loudness- and peak-compliant. The mastering job and its settings are logged against the track record for audit purposes.

### **20.4.2 ElevenLabs AI Voice** {#20.4.2-elevenlabs-ai-voice}

"Voice synthesis and audio AI at scale."

Generative-voice tools let collaborators produce synthetic vocals, voice doubles, or localized vocal takes inside the same workspace. This directly triggers the obligations in Section 18: the Hub captures voice-model consent/ownership at the point of generation (Section 18.1) and writes the AI-assisted flag onto the track the moment synthetic vocals are used (Section 18.2) — not as an afterthought at submission. TooLost's own release schema already expects aiAssisted, isAiGeneratedArtwork, aiContentApproved, and a supporting aiDocumentation file (Section 8.4), so this capture feeds the V1 delivery adapter's required fields directly.

### **20.4.3 Custom AI-Driven Stem & Music Generators** {#20.4.3-custom-ai-driven-stem-&-music-generators}

Beyond third-party AI tools, self-hosted generative models give artists something they can only get from this platform. Audiocraft (Meta's open-source MusicGen/AudioGen, GitHub) can be hosted on the platform's own cloud infrastructure (Hugging Face or AWS) and fine-tuned on the label's back-catalog or house aesthetic, so artists generate unique, royalty-free instrumentals or textures tailored to the label's specific sound rather than a generic public model.

## **20.5 Proprietary Lock-In Strategy (Optional Differentiators)** {#20.5-proprietary-lock-in-strategy-(optional-differentiators)}

Beyond the required infrastructure above, four optional strategies increase the platform's proprietary pull — reasons an artist has to create inside this ecosystem rather than anywhere else. These are differentiators to sequence in after the core Hub ships, not launch-blocking requirements.

| Strategy | Mechanism |
| :---- | :---- |
| Custom Visual DAW (white-label repos) | Deploy the browser DAW as a fully branded, proprietary studio rather than a generic tool, using the web-audio-daw, Steinberg VST3 Web SDK, and Proton (AudioKit) building blocks from Section 20.2 |
| Proprietary "Signature" Sound Kits & HTML5 Samplers | An HTML5 drum-pad/step-sequencer, free to use, loaded exclusively with the label's in-house, unreleased sounds; the hook is that a hit loop made with it must be submitted to the label to clear rights for commercial release |
| Custom AI-Driven Stem & Music Generators | Self-hosted, label-tuned Audiocraft models (Section 20.4.3) that artists cannot access anywhere else |
| Fully Closed Web-Based Remix Portals | An invite-only page exposing isolated stems from the label's catalog through a simple browser mixer (mute/solo/manipulate); an artist's new recording renders and uploads directly into a closed A\&R vault, with no ability to download or leak the raw stems |

## **20.6 Automated Metadata Pipeline** {#20.6-automated-metadata-pipeline}

This is the authoritative metadata pipeline referenced throughout this document (Section 1.2, Section 6, Section 9.3, Section 18.2). No one should have to manually type BPM, key, duration, or LUFS — the system already knows, because it created the song.

1\. Input Track — artist exports the raw WAV mix from the Browser DAW (Section 20.2)

**↓**

2\. AI Analysis Layer — Essentia.js (client-side) or Essentia/Librosa (server-side) extracts BPM, musical key, and structural segments

**↓**

3\. Enrichment & Metadata — the label/artist adds ISRC, artist IDs, and AI-use tags on top of the extracted analysis

**↓**

4\. Binary Tag Injection — music-metadata / taglib-wasm writes the combined data into the file itself (ID3v2/BWF/DDEX-ready headers)

**↓**

5\. Ingestion-Ready Master — the file is dispatched directly to Spotify, Apple, Tidal, and the rest of the Delivery Engine (Section 8.3, Section 8.4)

A second AI pass runs while a track is still being written — generating genre, mood, emotion, instrumentation, song-section/hook detection, danceability, energy, valence, keywords, and commercial similarity automatically (Section 6.5). Combined, these two passes mean a sync agent can search by mood and BPM (Section 7.2) for a track that was finished minutes earlier, with zero manual tagging.

**Reference Implementation: Metadata Aggregation Endpoint**

Server route that reads native file tags, runs the analysis, and compiles the label's proprietary metadata payload — including the AI-disclosure block that maps directly onto TooLost's aiCreditsTransparency-equivalent fields (Section 8.4):

// apps/distro-portal/app/api/generate-metadata/route.ts  
import { NextResponse } from 'next/server';  
import { parseBuffer } from 'music-metadata';  
   
export async function POST(request: Request) {  
  try {  
    const formData \= await request.formData();  
    const audioFile \= formData.get('file') as File;  
    const userDefinedGenre \= formData.get('genre') as string;  
    const isAiAssisted \= formData.get('isAiAssisted') \=== 'true'; // AI-disclosure compliance  
   
    if (\!audioFile) {  
      return NextResponse.json({ error: 'No audio asset detected' }, { status: 400 });  
    }  
   
    const buffer \= Buffer.from(await audioFile.arrayBuffer());  
    const nativeTags \= await parseBuffer(buffer, { mimeType: audioFile.type });  
   
    // Essentia.js / Librosa analysis runs here in production  
    const analyzedBpm \= nativeTags.common.bpm || 120;  
    const analyzedKey \= nativeTags.common.key || 'C Minor';  
   
    const proprietaryLabelMetadata \= {  
      title: nativeTags.common.title || 'Untitled Track',  
      artist: nativeTags.common.artist || 'Unknown Label Creator',  
      album: nativeTags.common.album || 'Single Release',  
      bpm: analyzedBpm,  
      musicalKey: analyzedKey,  
      genre: userDefinedGenre || 'Electronic',  
      isrc: \`US-XXX-YY-${Math.floor(10000 \+ Math.random() \* 90000)}\`,  
      // AI compliance markers mapping directly to DDEX delivery manifests  
      aiCreditsTransparency: {  
        isAiGenerated: false,  
        isAiAssisted: isAiAssisted,  
        assistedCategories: isAiAssisted ? \['composition', 'sound\_generation'\] : \[\],  
      },  
    };  
   
    // Passed to taglib-wasm to inject binary header tags before S3 upload  
    return NextResponse.json({ success: true, metadata: proprietaryLabelMetadata });  
  } catch (error: any) {  
    return NextResponse.json({ error: error.message }, { status: 500 });  
  }  
}

## **20.7 Collaboration Workflow (Beat to Sync-Ready Master)** {#20.7-collaboration-workflow-(beat-to-sync-ready-master)}

End-to-end walkthrough of a song moving through the Hub with zero re-uploading at any step:

1\. Producer logs in, creates a beat in the Browser DAW — no software install

**↓**

2\. Writer is invited into the same session, adds lyrics and melody, leaves comments — every change versions automatically via the Real-Time Collaboration Layer (Section 20.3)

**↓**

3\. Singer logs in, records vocals directly in-browser, stems auto-sync to the session

**↓**

4\. Engineer mixes; the master is uploaded and prior versions are retained (Section 20.10, Track Versions)

**↓**

5\. Metadata fills itself via the Automated Metadata Pipeline (Section 20.6): BPM, key, genre, mood, tempo, length, LUFS, ISRC, UPC, credits, splits, ownership, AI usage, lyrics

**↓**

6\. Release Manager clicks Publish — the release goes out through the Delivery Engine (Section 8.3, Section 8.4) to Spotify, Apple, Amazon, TikTok, Meta, YouTube, QQ, Boomplay, Pandora, and the rest of the Distribution Channel Directory (Section 4\)

**↓**

7\. The same song appears in the Sync Licensing Portal (Section 7\) automatically — instrumental, stems, lyrics, mood, BPM, key, one-stop status, worldwide rights, contact, clearance status, alternate mixes, TV mix, 30-second cut, trailer version, and Dolby Atmos mix are all already indexed, without anyone uploading it a second time

## **20.8 Direct-to-Fan** {#20.8-direct-to-fan}

"Fan monetization beyond streaming."

A direct-to-fan layer gives artists a revenue channel that does not depend on DSP payouts — subscriptions, exclusive content, pre-saves, bundles, and tipping tied directly to an artist's profile in the Artist Portal (Section 2.2). This is the natural home for the "Label Services" split model in Section 17.2: because direct-to-fan revenue is collected by the platform itself rather than reported monthly by a DSP, it can settle through the same Split Payments module (Section 10.4) as master and publishing royalties, on a faster cycle than standard DSP reporting allows.

## **20.9 Indie Retail** {#20.9-indie-retail}

"Vinyl, cassette, and indie record-store reach."

A physical-format channel extends the Distribution Channel Directory (Section 4\) into vinyl, cassette, and indie record-store distribution — pressing-on-demand fulfillment, direct-to-fan physical bundles, and consignment-style reach into independent record stores. Revenue here flows through the same Master Recording Income model in Section 14.1 (physical merchandise profit accrues directly to the rights owner) and should be tracked in Analytics (Section 13\) alongside digital revenue by format, not as a separate, disconnected sales channel.

## **20.10 Additional Creative Tools** {#20.10-additional-creative-tools}

| Tool | Description |
| :---- | :---- |
| Beat Marketplace | Producers list beats inside the Hub for writers and artists to license or purchase; full workflow in Section 20.11 |
| Songwriting Collaboration | Shared lyric/melody editing with comments and automatic versioning; full workflow in Section 20.12 |
| Sample Library | A searchable library of loops and one-shots (including the label's proprietary Signature Sound Kits, Section 20.5) available directly inside session |
| Voice Notes | Quick in-browser scratch recordings for capturing an idea before a full session, attached to the project for later reference |
| Track Versions | Every mix/master pass is retained and timestamped, so the Engineer step in Section 20.7 never overwrites a prior version |
| MIDI Collaboration | Multi-user live piano-roll editing (Section 20.3), letting writers draw notes simultaneously with changes reflected instantly on every screen |

## **20.11 Beat Marketplace (Full Workflow)** {#20.11-beat-marketplace-(full-workflow)}

Beat sales are designed to flow directly into a collaborative project rather than ending at a file download, so a purchased beat starts its life in the platform already rights-clean:

1\. Producer publishes a beat

**↓**

2\. Buyer selects a license type: Exclusive, Non-exclusive, or Custom

**↓**

3\. Split sheet is generated for the beat sale

**↓**

4\. Contract is issued instantly

**↓**

5\. Payment is processed instantly

**↓**

6\. A collaborative project is created automatically in Studio (Section 20.3)

**↓**

7\. The song starts — writer, singer, and engineer can be invited immediately

Because the split sheet and contract are generated at the moment of sale, the producer's ownership share is already recorded in the Rights Manager (Section 5\) before a single lyric is written — there is no separate "add the producer to the splits" step later.

## **20.12 Songwriting Workspace (Full Workflow)** {#20.12-songwriting-workspace-(full-workflow)}

The songwriting side of Studio is a dedicated workspace layered on the Real-Time Collaboration Layer (Section 20.3), covering the full lifecycle of a lyric from idea to cleared composition:

| Workspace Element |
| :---- |
| Lyrics |
| Comments |
| Versions |
| Rhymes |
| References |
| Voice Notes |
| Chord Sheets |
| Copyright |
| Split Sheets |

Split sheets generated here feed the same Rights Manager (Section 5\) and Composition Income model (Section 14.2) used everywhere else in the platform, so a songwriting session and a beat-marketplace purchase (Section 20.11) reconcile into the same ownership record rather than two separate paper trails.

## **20.13 AI Assistant** {#20.13-ai-assistant}

Because the platform already knows everything about a song the moment it exists — who made it, what it sounds like, what's cleared, and what's been done with it before — an AI Assistant layer can proactively surface recommendations rather than wait to be asked:

| Suggestion | What It Does |
| :---- | :---- |
| Metadata, genre, and mood suggestions | Drafts the Section 6.1/6.5 fields for review instead of starting from a blank form |
| Keyword suggestions | Improves discoverability in the Advanced Sync Search index (Section 7.2) |
| DSP optimization suggestions | Flags release-timing or metadata issues likely to affect playlist placement |
| Sync opportunity suggestions | Matches a finished track against open briefs in the Sync Marketplace (Section 7.5) |
| Playlist target suggestions | Surfaces the DSP playlists a track's mood/BPM profile is likely to fit |
| Release date suggestions | Recommends scheduling based on catalog and market patterns |
| Marketing plan suggestions | Drafts a starting promotional plan from the track's own metadata |
| Copyright issue flags | Surfaces likely sample-clearance or rights conflicts before submission (Section 15.3) |
| Split conflict flags | Flags overlapping or inconsistent splits across the Beat Marketplace, Songwriting Workspace, and Rights Manager (Sections 20.11, 20.12, 5\) before a release goes out with a dispute baked in |

## **20.14 How the Hub Fits the Architecture** {#20.14-how-the-hub-fits-the-architecture}

1\. Collaborator uploads or creates a mix in the Artist Collaboration Hub (Section 20.2–20.3)

**↓**

2\. Roex AI Mastering produces a delivery-ready master (Section 20.4.1)

**↓**

3\. ElevenLabs AI Voice (if used) generates synthetic vocals with consent and AI-disclosure metadata captured (Section 20.4.2)

**↓**

4\. Automated Metadata Pipeline extracts and injects BPM, key, and AI-use tags (Section 20.6)

**↓**

5\. AI Assistant (Section 20.13) drafts remaining metadata, keywords, and flags any copyright or split conflicts

**↓**

6\. Catalog Manager stores the finished track with full metadata (Section 6), including AI-assisted flags

**↓**

7\. Validation Engine (Section 9\) checks the release, including AI-content fields required by delivery partners

**↓**

8\. Delivery Engine ships the release via the TooLost V1 adapter (Section 8.4) and, over time, direct DSP feeds (Section 16.2)

**↓**

9\. SyncOS (Section 7\) generates the Automatic Sync Package and indexes the same record — no second upload

**↓**

10\. Direct-to-Fan and Indie Retail channels generate additional revenue outside standard DSP reporting (Section 20.8–20.9)

**↓**

11\. Royalty Engine and Split Payments (Section 10\) reconcile all revenue sources — streaming, sync, direct-to-fan, and physical — into one statement per participant

## **21\. Deep Dive: Tour Studio (Admin → Manage → Touring)** {#21.-deep-dive:-tour-studio-(admin-→-manage-→-touring)}

Touring was specified at a summary level in Portal IA Document Section 3.8 (Calendar, Venues, Booking Requests). This is the full feature and field spec, and it doubles as a worked example of how one sidebar item decomposes into components, fields, and states for the rest of this document.

**Booking: Venue Database**

A searchable venue database (comparable to an Overture/Pollstar-style data feed) rather than a manually maintained venue list.

| Feature | Fields | Presentation |
| :---- | :---- | :---- |
| Venue Directory | Venue name, address, capacity, genre fit, buyer/promoter contact, past show history at this venue | Card grid with a filter sidebar (genre, capacity, region) — same Card Grid \+ Filter pattern as Sync Marketplace browsing in Portal IA Document Section 4.5 |
| Radius Clauses | Clause radius (miles/km), effective date range, affected venues within radius | Attached as a field set on a Booking Request, not a separate screen |

**Booking: Smart Holds Calendar & Offer Sheet**

| Feature | Fields | Presentation |
| :---- | :---- | :---- |
| Smart Holds Calendar | Hold type (first hold/second hold/confirmed), date, venue, competing holds on the same date | Calendar view with color-coded hold levels — the Calendar pattern, extended to show competing holds inline rather than requiring a click-through |
| Offer Sheet | Offer amount, guarantee vs. door split, expiration date, status (sent/countered/accepted/declined) | Kanban board (Sent → Countered → Accepted), same shape as the Booking Requests pipeline in Portal IA Document Section 3.8 |

**Contract Builder**

* Template library of contracts, artist riders, and travel docs, each with e-signature support

* One-click generation from a confirmed booking's existing fields (venue, date, fee) rather than a blank document

* Google Calendar integration to push confirmed dates directly to an artist's or agent's calendar

**Presentation**

A Wizard pattern (Section 10\) — Select Template → Auto-Fill From Booking → Review → Send for Signature — not a single long form, mirroring the New Release Submission wizard in Portal IA Document Section 4.4.

**Online Payments (Deposit & Settlement Collection)**

| Feature | Fields | Presentation |
| :---- | :---- | :---- |
| Deposit Collection | Deposit amount, due date, automated reminder schedule, payment method options offered to the client | List table matching the booking it's attached to, with a status badge (paid/deposit paid/pending) — the exact badge language already used on the live Dashboard |
| Configurable Collection Schedule | Number of installments, due dates per installment, auto-reminder cadence | Form attached to a booking, not a global settings screen |
| Show Settlements | Gross revenue, expenses, promoter split, final settlement amount, settlement date | Detail Drawer opened from a confirmed booking, generated once the show has occurred |

**Tour Analytics**

* Tour Dates (count, by status)

* Tracked Artists (roster currently touring)

* Show Forecasting (projected revenue based on confirmed \+ held dates)

* Bottleneck identification (e.g., holds aging past a threshold without resolution)

**Presentation**

Chart-first Insights view, reusing the same pattern as Analytics elsewhere in the shell — Tour Analytics is not a separate design language, just Touring's data through the standard Chart-First Dashboard component.

**Artist Itinerary Builder**

Travel and flight itineraries attached to a confirmed booking, synced to Google Calendar for the artist and any assigned Crew & Team members (Section 4.2) — this is the point where Touring and Crew & Team intersect: an itinerary has assigned roadies/tour managers, not just an artist.

**Team Management & Task Delegation**

Assign specific bookings or itinerary items to Crew & Team members (Section 4.2) with due dates and status — a lightweight task list scoped to touring, not a general project-management tool.

# **22\. Universal Search (Command Palette)** {#22.-universal-search-(command-palette)}

One search, invoked the same way from any workspace, in the spirit of Linear, Notion, and Slack's command palettes — never a page-local search box.

**Invocation**

⌘K (Mac) / Ctrl+K (Windows), or clicking Search in the Global Header (Section 3.1).

**Searchable Entity Types**

| Entity Type |
| :---- |
| Track |
| Artist |
| Release |
| Contract |
| Deal Room |
| Venue |
| Product |
| Order |
| Project |
| Beat |
| Lyrics |
| Statement |

This list is exactly the set of canonical entities defined across the System Architecture Document and Portal IA Document (Sections 2.1.1, 5, 6, 7\) — Universal Search does not introduce a new index of its own, it queries the same Digital asset Mangement/RightsOS/SyncOS records every workspace already reads from.

**Result Presentation**

Results grouped by entity type, ranked by recency and by the searching user's Favorites (Section 8); each result opens directly into a Detail Drawer (Section 3.4) rather than navigating away from wherever the search was invoked.

**Scoping**

Search results are filtered through the same Access Matrix as every other screen (Portal IA Document, Section 8\) — an Industry user typing a query never sees an Admin-only CMS page in the results, even though the search bar looks identical across workspaces.

# **23\. Notification Center** {#23.-notification-center}

One global notification stream, reached from the bell icon in the Global Header (Section 3.1) — not a separate notification feed per workspace. A user who switches from Studio to Admin does not lose track of a Sync request that came in while they were in Studio.

1\. Distribution failed

**↓**

2\. Artist accepted invite

**↓**

3\. Sync request

**↓**

4\. Deal Room updated

**↓**

5\. Royalty posted

**↓**

6\. Store rejection

**↓**

7\. Booking confirmed

Each event type in the list above is already defined as a status change somewhere in the System Architecture Document or Portal IA Document (delivery status, Deal Room stage, royalty statement posting, booking status) — the Notification Center's job is to surface the change, not define new events of its own.

**Presentation**

Grouped by event type with an unread count badge, filterable, each notification click-through opening the relevant record's Detail Drawer (Section 3.4) — identical mechanics to Universal Search's result handling, since both are ways of jumping to a record from anywhere in the shell.

# **24\. Unified Inbox** {#24.-unified-inbox}

The same consolidation principle applied to messages and required actions: one Inbox instead of separate Admin/Artist/Sync message threads.

| Tab | Contents |
| :---- | :---- |
| Inbox | Direct messages and threads tied to a specific record (a Deal Room negotiation, a Booking Request note) |
| Activity | A chronological feed of everything that happened on records this user follows or owns |
| Mentions | Comments/threads where this user was explicitly tagged |
| Approvals | Anything waiting on this user's sign-off — contracts, split sheets, submitted releases |
| Requests | Incoming asks from another workspace — a sync request, a booking inquiry, a collaboration invite |

# **27\. Favorites & Pinning**

A working set of records a user returns to constantly, independent of which workspace they're in. The reference case: an A\&R Manager tracking a handful of artists, a release, and a live negotiation at the same time.

| Pinned Item |
| :---- |
| Artist A |
| Artist C |
| Release B |
| Deal Room D |

Any entity type from the Universal Search list (Section 5\) can be favorited from its Detail Drawer. Favorites surface in the User menu (Section 3.1) and bias Universal Search ranking (Section 5\) — pinning is not a separate list buried in Settings, it's meant to be faster to reach than searching.

# **28\. Dashboard Action Cards** {#28.-dashboard-action-cards}

The Overview/Dashboard screen in every workspace (Section 4.1) leads with action cards — things that need a decision — rather than only historical metrics like the current Total Revenue / Upcoming Bookings / CRM Contacts / Releases tiles.

| Card | Source |
| :---- | :---- |
| Needs Approval | Contracts, split sheets, or releases awaiting this user's sign-off (feeds from Inbox → Approvals, Section 7\) |
| Metadata Errors | Tracks failing Validation Engine checks (System Architecture Document, Section 9\) |
| DSP Rejections | Store corrections needed (System Architecture Document, Section 9.6; Portal IA Document, Section 4.4) |
| Sync Requests | New requests awaiting a response inside a Deal Room (Section 7.4) |
| Contracts Waiting | Sent but unsigned contracts — booking, sync, or Beat Marketplace splits |
| Split Conflicts | Overlapping/inconsistent splits flagged by the AI Assistant (System Architecture Document, Section 20.13) |
| Royalties Ready | Statements calculated and ready to publish/pay out (System Architecture Document, Section 10\) |
| Artists Awaiting Onboarding | Roster entries with incomplete verification, tax, or banking status (Portal IA Document, Section 3.7) |

Each card shows a count and opens a filtered list on click — the same List Table pattern (Section 10\) used everywhere else, not a bespoke queue view per card type. Existing metric tiles (Total Revenue, Upcoming Bookings, CRM Contacts, Releases) remain above these action cards as the "how are we doing" layer; action cards are the "what do I need to do" layer directly beneath them.

# **29\. Reusable UI Components** {#29.-reusable-ui-components}

This extends the pattern library first defined in Portal IA Document Section 7 with the additional component this document's shell introduces (Wizard) and full definitions for implementation.

| Component | Used For | Behavior |
| :---- | :---- | :---- |
| Table | Sortable/filterable rows for operational queues: Orders, Delivery Status, Offer Sheets | Row click opens a Detail Drawer, never a full navigation |
| Card Grid | Visual browsing: Roster, Venue Directory, Beat Marketplace, Sample Library | Thumbnail-first, hover reveals a quick action |
| Detail Drawer | Inspect/edit one record without leaving the surrounding list | Slides in from the right; the standard destination for Search and Notification click-throughs |
| Wizard | Multi-step creation with validation gating: New Release Submission, Contract Builder | Linear steps, final step disabled until required fields pass validation |
| Calendar | Date-driven data: Tour Calendar, Smart Holds Calendar | Month/week default view, color-coded status |
| Kanban | Multi-stage pipelines: Booking Requests, Offer Sheets, Deal Rooms | Columns are named workflow stages already defined in the relevant OS section |
| Chart-First Dashboard | Anything time-series: Analytics, Tour Analytics, Earnings | Chart on top, supporting table below |

# **30\. Design Tokens** {#30.-design-tokens}

## **30.1 Status Colors** {#30.1-status-colors}

Status badges already appear throughout the live build (confirmed, deposit paid, inquiry, paid, pending, won, new, contacted). These are standardized here as a single semantic palette reused by every status badge in every workspace, rather than each module choosing its own colors:

| Semantic Meaning | Example Statuses | Color Family |
| :---- | :---- | :---- |
| Positive / Confirmed | confirmed, paid, won, accepted, delivered | Blue/Green family |
| In Progress | deposit paid, contacted, pending, in\_review | Amber/Yellow family |
| Needs Attention | rejected, failed, split conflict, overdue | Red family |
| Neutral / New | new, inquiry, draft | Gray family |

## **30.2 Spacing, Typography, Icons** {#30.2-spacing,-typography,-icons}

* Spacing scale: a single base unit (e.g., 4px) with multiples used consistently across cards, tables, and drawers — no per-workspace spacing overrides

* Typography scale: one heading scale and one body scale shared by all four workspaces; only content changes, not type size logic

* Icon system: one icon library across the sidebar, action cards, and status badges (the current build's outline-style icon set is consistent with this and should be kept as the standard)

# **31\. Responsive Layouts** {#31.-responsive-layouts}

| Breakpoint | Behavior |
| :---- | :---- |
| Desktop | Full Global Header, persistent expanded sidebar, multi-column dashboards (as shown in the current build) |
| Tablet | Global Header retained; sidebar collapses to icon-only with labels on hover/tap; dashboard cards reflow to two columns |
| Mobile | Global Header compresses to logo \+ workspace switcher \+ search icon \+ notification icon; sidebar becomes a slide-out drawer triggered from a menu icon; dashboard cards stack to one column; Kanban boards become swipeable single-column stacks |

The Detail Drawer (Section 3.4) becomes a full-screen view on mobile rather than a partial slide-in, since there is no adjacent list context to preserve on a small screen.

# **32\. Accessibility & Keyboard Shortcuts** {#32.-accessibility-&-keyboard-shortcuts}

## **32.1 Keyboard Shortcuts** {#32.1-keyboard-shortcuts}

| Shortcut | Action |
| :---- | :---- |
| ⌘K / Ctrl+K | Open Universal Search (Section 5\) |
| G then a letter (e.g., G D) | Jump to a sidebar section (Dashboard, etc.) without leaving the keyboard |
| Esc | Close the active Detail Drawer or Command Palette |
| ⌘Enter / Ctrl+Enter | Submit the current form/wizard step |

## **32.2 Accessibility Baseline** {#32.2-accessibility-baseline}

* All status colors (Section 11.1) paired with a text label, never color alone, for colorblind-safe status reading

* Full keyboard navigability through sidebar, tables, and the Command Palette

* Detail Drawers and Wizards trap focus while open and return focus to the triggering element on close

* Minimum contrast ratios per WCAG 2.1 AA across the Design Tokens in Section 11

# **33\. Role-Based Rendering Rules** {#33.-role-based-rendering-rules}

The shell renders the same components everywhere, but which sidebar items, action cards, and search results appear is entirely a function of the Access Matrix already defined in Portal IA Document Section 8\. Three rendering rules make that matrix visible in the UI rather than just enforced in the API:

* A sidebar item the user's role cannot access is omitted entirely, not shown-and-disabled — the sidebar taxonomy in Section 4 is a superset per workspace, individually filtered per role.

* An action card (Section 9\) with a zero count for a given role is hidden rather than shown as "0" — Dashboards should shrink to what's relevant, not display empty state clutter for permissions the user doesn't have.

* Universal Search (Section 5\) and the Notification Center (Section 6\) apply the same per-role filter as the sidebar, so switching workspaces never surfaces a result the destination workspace's role wouldn't otherwise show on its own sidebar.

# **34\. Interaction Patterns** {#34.-interaction-patterns}

| Action | Pattern |
| :---- | :---- |
| Create | Always opens a Wizard (Section 10\) if the record requires validation before it can exist meaningfully (a release, a contract); opens a simple inline form if it doesn't (a CMS blog post) |
| Edit | Opens the record's existing Detail Drawer in an editable state; changes save inline rather than requiring a separate "edit mode" screen |
| Approve | A dedicated action on records surfaced via Inbox → Approvals (Section 7\) and the Needs Approval action card (Section 9); always requires the approver to open the Detail Drawer first, never a one-click approve from a list row |
| Publish | Moves a record from draft to live status (a release, a CMS page); always runs the relevant Validation Engine check (System Architecture Document, Section 9\) first and blocks with a clear error state (Section 16\) if it fails |
| Archive | Soft-removes a record from active lists without deleting the underlying canonical record (System Architecture Document, Section 2.1.1) — archived items remain findable via Universal Search (Section 5\) with an "Archived" badge |

# **35\. System States** {#35.-system-states}

| State | Pattern |
| :---- | :---- |
| Loading | Skeleton placeholders matching the shape of the component being loaded (a skeleton Table row, a skeleton Card) — never a generic full-page spinner once the shell itself has rendered |
| Empty | A short explanation of why the list is empty plus the single most relevant Create action (Section 15\) — e.g., an empty Sync Marketplace result set explains the filter is too narrow rather than implying the catalog is empty |
| Success | Inline confirmation at the point of action (a toast or an inline badge change, matching the status-badge language in Section 11.1) rather than a full-page "Success\!" screen |
| Error | Field-level errors inside a Wizard (Section 10\) point at the specific failing field, matching the Validation Engine's own per-field checks (System Architecture Document, Section 9); system-level errors (a failed DSP delivery, System Architecture Document Section 9.6) surface as a Notification (Section 6\) and a Dashboard Action Card (Section 9), not just a page-level banner that disappears on refresh |

# **36\. MODULES & THERE 10 Personas** {#36.-modules-&-there-10-personas}

| \# | Persona | One-line role |
| :---- | :---- | :---- |
| 1 | **Artist / Creator** | Writes, records, releases, sells direct to fans |
| 2 | **Co-Writer / Session Collaborator** | Joins a project for writing, producing, or featuring — needs credit \+ split tracking |
| 3 | **Label / Artist Manager (Admin)** | Oversees a roster, catalog, deals, funding, marketing spend |
| 4 | **Distributor / Aggregator Ops** | Runs ingestion pipelines, enterprise delivery infrastructure at scale |
| 5 | **Music Supervisor (Sync Buyer)** | External user searching a catalog for film/TV/ad placements |
| 6 | **Publisher / Royalty Administrator** | Registers works with PROs/CMOs, collects and reconciles royalties |
| 7 | **Fan / Superfan** | Buys music/access directly from an artist, consumes content |
| 8 | **Booking Agent / Tour Manager** | Books shows, negotiates contracts, settles tours |
| 9 | **Marketing / Promo Specialist** | Runs campaigns — DSP, social, PR, radio, sync-adjacent |
| 10 | **Educator / Student** | Classroom use of the creation tools (Soundtrap/BandLab Education) |

---

# **37\. Portal-by-Portal Feature Hierarchy**

**Portal 1: STUDIO (Creation & Collaboration)**

**Primary:** Artist/Creator, Co-Writer/Collaborator · **Secondary:** Educator/Student

**A. Core DAW**

* Browser-based DAW, no install

* Cross-device cloud sync

* Cross-platform desktop app (Cakewalk-style, VST support)

* Multi-track recording/editing (non-destructive)

* MIDI piano roll editor

* Beat sequencer / drum machine

* Sampler

* 808 instrument (with glide)

* Automation lanes

* Time Restore (undo/version history) 🔗 shared engine with Catalog portal's version nesting

* Priority mixing (paid-tier render queue)

* High-quality/no-watermark downloads

* Save presets & loops

**B. Sounds & Instruments**

* Virtual instrument library

* Beats (pre-built, genre-tagged)

* Loops library

* One-shots library

* Sound effects — sourced from freesound.org 🔗 same freesound integration also used in Catalog portal's stock-SFX search

* Vocal presets

**C. Effects & Mixing**

* Effects library (EQ, reverb, delay, compression, distortion, modulation)

* Effect presets for vocals

* Vocal Cleanup

* Vocal tuning (offline)

* Realtime vocal tuning

**D. AI Tools**

* SongStarter (AI idea generator)

* Splitter (AI stem/vocal separation)

* Mastering — free Grammy-engineer presets \+ selectable mastering styles

* Mix Analysis (AI feedback on a mix) 🔗 shares the AI Mix Analysis engine listed again under Catalog portal for A\&R-side use

* Interactive Transcripts (AI transcription of vocal takes/session audio) 🔗 same transcription engine also powers Podcast sub-portal captions and Catalog's AI lyrics transcription

**E. Writers' Room (the identified gap — not in BandLab or Soundtrap)**

* Shared live-text lyric editor, multi-cursor

* Section tagging synced to arrangement (verse/chorus/bridge)

* Rhyme/syllable tools

* Per-line voice memos

* Lyric version history (separate from audio version history)

* Suggestion mode

* Line-to-timeline sync (click lyric → jump to timestamp)

**F. Collaboration (real-time)**

* Live multi-user co-editing

* Live cursor/presence indicators

* Built-in chat 🔗 same chat primitive reused in Fan Portal's artist/fan chat and Sync Portal's submission feedback threads

* Built-in video chat

* Co-writer collaboration / credit tagging 🔗 feeds Publishing Portal's split-sheet and Royalty Tracker

* Timestamped comments 🔗 shared engine also used in Sync Portal (supervisor feedback) and Catalog Portal (submission review)

**G. Podcast Sub-Suite** (Soundtrap-derived)

* Dedicated podcast recording/editing mode

* Automatic transcription 🔗 same transcription engine as (D)

* Podcast publishing/distribution path → hands off to **Distribution Portal**

**H. Education Mode**

* Virtual classrooms

* Teacher dashboard / assignment distribution

* Live student monitoring

* Curriculum-aligned lesson plans

* School/district licensing

---

# **38\. CATALOG / DIGITAL ASSET MANAGEMENT (Musixbox-style)**

**Primary:** Label/Artist Manager, Distributor Ops · **Secondary:** Artist (own catalog), Music Supervisor (read access)

**A. Storage & Organization**

* Organizes releases, masters, video, graphics, marketing assets in one system

* Custom fields

* Auto-group ALT mixes (automatic \+ manual nesting)

* Duplicate-song detection

* Tag editor (ID3, APE, Vorbis Comments, MP4/ASF, Lyrics3) across MP3/M4A/WMA/FLAC/Opus/Ogg/WAV/AIFF

* Album cover management

* WAV↔AIFF converter 🔗 same conversion utility used in Distribution Portal's delivery pipeline

* CSV metadata import (self-service)

* CSV catalog editing

* Unlimited tracks, multi-seat access

**B. Access Control & Security**

* Password protection

* Expiring URLs

* Assigned URLs (per-recipient links)

* Download controls

* Territory restrictions 🔗 same restriction engine drives Distribution Portal's territory exclusions

* SSO

* Enterprise customization tier

**C. Ingestion & Delivery**

* Distributor ingestion API access

* SSO inboxes for receiving files

* Email Creator (branded submission inbox)

**D. AI Enrichment**

* AI track descriptions

* AI album art generation

* AI BPM & key detection

* AI lyrics transcription 🔗 shares engine with Studio Portal transcripts

* AI stem separation (credit-based) 🔗 same engine as Studio Splitter

* AI mastering 🔗 same engine as Studio Mastering

* AI mix analysis 🔗 same engine as Studio Mix Analysis

**E. Presentation & Access**

* Branded portfolio page with embedded video

* Catalog search (built for external Music Supervisor access — see Portal 5\)

* Analytics (playlist stats, catalog performance) 🔗 same analytics core as Portal 6/8/9

**F. Review Workflow**

* Document attachments

* Timestamped comments 🔗 shared with Studio (F) and Sync (Portal 5\)

* Submission feedback & review

* Autotagging

---

# **39\. SYNC LICENSING MARKETPLACE**

**Primary:** Music Supervisor · **Secondary:** Artist/Label (pitching side), Marketing Specialist

* Catalog search built for supervisors

* Free access tier for verified supervisors

* Submission inbox (supervisor-facing)

* Submission feedback & review 🔗 same review engine as Catalog Portal (F)

* Pitch Pipeline — placement CRM (tracks which songs were pitched where, status)

* In-house sync pitching/negotiation (white-glove service tier)

* Video & lyric bundling for sync deliverables 🔗 pulls directly from Catalog Portal assets

---

# **40\. DISTRIBUTION**

**Primary:** Artist (self-serve), Label · **Secondary:** Distributor Ops (bulk/enterprise)

**A. Delivery**

* Delivery to 45+ DSPs

* Free UPC and ISRC codes

* Video distribution (Apple, Spotify, Tidal, others)

* ProRes cloud video encoding

* Multi-format audio encoding

* Physical distribution (vinyl/CD manufacturing pipeline)

* Music video distribution

* Lyrics inclusion in delivery

* TikTok Official Sound distribution

* 30-second ringtone generator

* Manual review of every upload

* Audio fingerprinting

* Artist profile matching (avoids mis-delivery to wrong Spotify/Apple/Deezer profile)

**B. Release Controls**

* Custom pricing for downloads

* Hide previews during pre-order

* Territory exclusions 🔗 same engine as Catalog Portal territory restrictions

* Online technical support ticketing 🔗 shared support system across all portals

**C. Merch/Print-on-Demand**

* POD merch shop

* Website design & templates

* Artist showcase page 🔗 overlaps with Catalog Portal's branded portfolio page — same rendering engine, different audience (public vs. industry)

---

# **41\. PUBLISHING & ROYALTY ADMINISTRATION**

**Primary:** Publisher/Royalty Administrator · **Secondary:** Artist/Songwriter, Label

* PRO/CMO registration worldwide

* Collection of public performance & mechanical royalties

* Collection of YouTube publishing royalties

* Collection of lyric-use royalties

* Automated validation of acknowledgment files ("Contesting")

* Human-handled conflict resolution

* Automated matching for retroactive "black box" royalty recovery

* Royalty Tracker

* Royalty accounting

* Income tracking

* Agreement Generator (one-click contract drafting) 🔗 same document-generation engine as Touring Portal's Contract Builder

* Clients & License Tracker

* Split-sheet data sourced directly from Studio Portal's co-writer credit tagging (no re-entry)

---

# **42\. DIRECT-TO-FAN / SUPERFAN COMMERCE (EVEN-derived)**

**Primary:** Artist, Fan · **Secondary:** Marketing Specialist (campaign layer)

**A. Artist-Side Setup**

* Email signup, artist/label profile type

* Release upload with artwork \+ custom pricing

* Access-point/tier configuration (define fan rewards per spend level)

* Revenue splits on collaborative releases 🔗 feeds Publishing Portal's Royalty Tracker

* Draft/pending/approved release states

* EVEN Studio-style white-label storefront embed option

* Marketplace-style discovery listing option

**B. Fan Perks (unlockable via purchase)**

* Early/first-listen access

* Exclusive bonus tracks

* Exclusive merch / limited vinyl

* Bespoke visual content

* Concert ticket discounts

* Live Q\&As

* Virtual listening parties

* 1:1 experiences (meet-and-greets, FaceTimes, niche experiences)

**C. Payments**

* Pay-What-You-Want pricing, no subscription

* Multi-method payment (cards, Cash App, Apple Pay, Klarna)

* 130+ currencies, 20+ payment methods

* Daily payouts

* Global payments 🔗 same payment rail as Touring Portal's FlexPay and Publishing Portal's royalty disbursement

**D. Fan App**

* Direct artist↔fan chat 🔗 shared chat engine (Studio Portal F)

* Fan-to-fan community chat

* Offline playback of purchased library

* Cross-device library sync

* Phone-number sign-in

**E. Fan-Facing Campaign Tools** (bridges into Marketing Portal)

* Email campaigns (capped recipient tiers)

* Pre-save campaigns

* Push-style release announcements ("Fan Connect")

**F. Analytics**

* Revenue dashboard

* Streaming-equivalent metrics

* Centralized fan-chat view inside analytics 🔗 same analytics core as Portal 2/8/9

---

# **43\. TOURING & BOOKING BACK OFFICE**

**Primary:** Booking Agent/Tour Manager · **Secondary:** Label/Artist Manager

* TOUR studio workspace

* Searchable venue database (sourced from Overture Maps)

* Discover venue/buyer contacts

* Target venues by genre & capacity

* Venue radius clauses

* Tour dates management

* Tracked artists list

* Show forecasting

* Smart Holds calendar / Offer Sheet workflow

* Configurable deposit-collection schedule

* Contract Builder (one-click, customizable riders/travel docs) 🔗 same doc-gen engine as Publishing Portal's Agreement Generator

* Template library with e-signature

* Google Calendar integration

* Artist itinerary builder

* Travel & flight itineraries

* Online payments — FlexPay (automated deposit reminders, flexible client payment options) 🔗 same payment rail as Portal 6

* Team management / task delegation

* Show settlements

* Analytics (tour growth, bottlenecks) 🔗 same analytics core as Portal 2/6/9

---

# **44\. GLOBAL ADMIN MARKETING & LABEL** 

**Primary:** Super Admin/Platform Operator · **Secondary:** Label/Artist Manager (scoped to own roster), CMS Editor, Support staff Marketing/Promo Specialist, Label · **Secondary:** Artist

* Genre specialist teams (Indie, Classical, Alt Rock, Country, Metal, Hip-Hop, R\&B, Pop, Dance, Latin, Folk, Reggaeton)

* Activity specialists: Out-of-Home campaigns, DSP marketing, in-house studio production, institutional marketing, design, advertising, PR, playlisting, branding, YouTube strategy, radio & TV, A\&R

* Influencer campaigns

* TikTok ad campaigns

* Social media activations

* Email newsletters 🔗 shares send infrastructure with Portal 6's email campaigns

* Market Scanner (opportunity/trend detection)

* Catalog optimization (playlist reach expansion via DSP relationships)

* Flexible funding / advances (retain master rights)

* UGC claim/dispute management (maximize catalog earnings from user-generated content)

* YouTube Content ID monetization

* Expanded rights collection (streamlines publishing/performing royalty flows) 🔗 feeds Publishing Portal

* "Get Signed" dedicated onboarding services for new artists

**A. Roster & Identity Management**

* Master artist/label directory — single source of truth that Studio, Catalog, D2F, Distribution, and Touring all read from (no re-entering an artist's name/profile per portal)

* Roster onboarding & approval workflow (new artist/label sign-up review)

* Role & permission assignment — decides which persona (Co-Writer, Manager, Booking Agent, etc.) gets access to which portal, per artist

* Bulk user management (deactivate accounts, merge duplicate profiles)

* Artist tiering (self-serve indie vs. label-managed vs. enterprise/major)

**B. Discography Command (rolls up Catalog Portal)**

* Master discography view across every artist — releases, tracks, credits, in one searchable index

* Global cross-catalog search (not scoped to one artist's login)

* Bulk metadata editing / bulk rights management across releases

* Catalog health dashboard — flags missing metadata, unregistered works, unresolved rights conflicts escalated from the Publishing Portal

**C. Tours & Dates Command (rolls up Touring Portal)**

* Master tour calendar across every artist/agent, not just one booking agent's view

* Cross-portal date-conflict detection (e.g., a release date colliding with a tour date or a D2F listening party)

* Venue/agent dispute escalation queue

* Global show-settlement oversight

**D. Shop / Commerce Admin**

* Storefront product-catalog admin — merch, POD, vinyl, digital bundles — the admin layer sitting above the D2F Portal's fan-facing store and Distribution Portal's POD pipeline

* Order management, refunds, dispute handling

* Payment-rail configuration (which processors are enabled, per region)

* Pricing rules, promo codes, bundle configuration

* Tax/compliance settings per territory

**E. Label  (multi-imprint operations)**

* Parent-company → sub-label/imprint → artist hierarchy (mirrors how a full-service distributor like Empire manages multiple imprints under one roof)

* Deal-terms management (advances, recoupment schedules, revenue splits) — feeds the Publishing Portal's Royalty Tracker rather than duplicating it

* Cross-portal artist P\&L rollup — aggregates Distribution \+ D2F \+ Sync \+ Touring revenue per artist into one view

* White-label configuration — branding per sub-label/imprint, since D2F (EVEN Studio-style), Distribution's artist pages, and Catalog's branded portfolio pages all support white-labeling already; this is the single place that sets it

**F. Front-End Pages / CMS**

* Public site page builder (drag-and-drop templates)

* Artist showcase page management — bulk-edit across the whole roster instead of one page at a time

* Editorial/news/blog CMS (press releases)

* SEO settings & redirects

* Navigation/menu builder

* Shared media library (press photos, banners, assets reused across storefront, EPK pages, and showcase pages)

* Localization / multi-language content

* Staging → preview → publish workflow

**G. Platform-Wide Operations**

* Global analytics rollup 🔗 sits directly on top of the Analytics core listed in Part 3 — aggregates Catalog, D2F, Touring, and Marketing analytics into one dashboard instead of duplicating metrics

* Unified support ticket queue (every portal's tickets funnel here)

* SSO/identity management \+ audit logs

* Feature-flag / tier-gating control — which persona sees which feature, per pricing plan

* Platform billing/subscription management (if you're running this as SaaS for labels)

* API key management (distributor ingestion API, DSP delivery credentials)

* System-wide notification/alert center

**H. Governance & Compliance**

* Rights-conflict resolution queue (escalated up from the Publishing Portal)

* Territory/licensing compliance oversight

* Content moderation (D2F fan chat, community spaces)

* Data privacy / GDPR-style request handling

---

# **45.Shared Cross-Cutting Systems (build once, mount everywhere)**

| System  | Portals it powers |
| :---- | :---- |
| **Analytics core** | Catalog, D2F, Touring, Marketing |
| **Payments/payout rail** | D2F, Touring, Distribution payouts, Royalty disbursement |
| **Chat/messaging engine** | Studio collab, D2F fan chat, Sync submission threads |
| **Timestamped comments/review engine** | Studio, Catalog, Sync |
| **Document/contract generator** | Publishing (Agreement Generator), Touring (Contract Builder) |
| **AI media-processing pipeline** (stem split, mastering, mix analysis, transcription) | Studio, Catalog |
| **Auth/SSO \+ support ticketing** | All portals |
| **Territory/rights-restriction engine** | Catalog, Distribution |
| **Public-facing page renderer** (branded portfolio / artist showcase / website templates) | Catalog, Distribution, D2F |

---

# **46\. 4 — Persona → Portal Access Matrix**

| Persona | Studio | Catalog | Sync | Distribution | Publishing | D2F | Touring | Marketing |
| :---- | :---- | :---- | :---- | :---- | :---- | :---- | :---- | :---- |
| Artist/Creator | ● | ○ | ○ | ● | ○ | ● | — | ○ |
| Co-Writer/Collaborator | ● | ○ | — | — | ○ | — | — | — |
| Label/Manager | — | ● | ○ | ● | ○ | ○ | ○ | ● |
| Distributor Ops | — | ● | — | ● | — | — | — | — |
| Music Supervisor | — | ○ | ● | — | — | — | — | — |
| Publisher/Royalty Admin | — | — | — | — | ● | — | — | — |
| Fan/Superfan | — | — | — | — | — | ● | — | — |
| Booking Agent | — | — | — | — | — | — | ● | — |
| Marketing Specialist | — | ○ | ○ | — | — | ○ | — | ● |
| Educator/Student | ● (edu mode) | — | — | — | — | — | — | — |

● \= primary user ○ \= secondary/limited access — \= no access

---

**Indie Artist — sidebar**

* **Studio** (StudioOS §20: Browser DAW, MIDI collab, sampler, effects, Track Versions, Voice Notes)

* **Songwriting Workspace** (§20.12: lyrics, comments, versions, rhymes, references, chord sheets, split sheets)

* **Beat Marketplace** (§20.11)

* **AI Tools** (Roex Mastering §20.4.1, ElevenLabs Voice §20.4.2, Audiocraft stem/music gen §20.4.3, AI Assistant §20.13)

* **My Catalog** (their CatalogOS slice — releases, tracks, credits, splits)

* **Distribution** (submit → TooLost V1 adapter §8.4 → DSP status)

* **Rights & Splits** (their Rights Manager view)

* **Royalty / Earnings** (statements, split payments, balances)

* **Direct-to-Fan** (§20.8: subscriptions, exclusives, pre-saves, tipping)

* **Indie Retail** (§20.9: vinyl/cassette/POD)

* **Analytics** (§13)

* **Pod /Shop / Merch/Manage orders**

* **Direct To Fan** 

* **Website / EPK / CMS**

* **Sync Licensing (submit for placement, Deal Room as licensor, sync royalty flow — an artist's dream isn't just the stage, it's the jingle/placement)** 

* **Manage → Touring (self-booking artist's own dates)** 

* **Education Mode (classroom/assignment layer — Educator/Student only)**


**Indie Label \+ Team — sidebar**

* **Dashboard** (Action Cards §28: Needs Approval, Metadata Errors, DSP Rejections, Split Conflicts, Royalties Ready, Artists Awaiting Onboarding)

* **Roster** (Artist Portal §10.1: onboarding, verification, tax, banking, contracts)

* **Catalog Manager** (CatalogOS §2.1.1/§6, full org catalog)

* **A\&R Workspace** (§7.7: reviews live StudioOS sessions, approves sync-readiness)

* **Distribution** (DistributionOS §4/§8/§9: Validation \+ Delivery Engine, TooLost adapter, DDEX)

* **Rights Manager** (RightsOS §5: master/publishing/neighboring/mechanical/sync rights, PRO/CMO status)

* **Royalty & Accounting** (§10, §14, §15: statements, split payments, balances, tax forms)

* **Sync Licensing** (their outbound Deal Room \+ Pitch Pipeline view)

* **Manage → Touring** (§21: Venue Database, Smart Holds Calendar, Offer Sheet, Contract Builder, Team Management, Show Settlements)

* **Marketing / Label Services** (genre specialists, Market Scanner, funding, Content ID)

* **CMS** (branded artist showcase pages, label site)

* **Manage → Touring** (booking on behalf of the roster — same module as Group 1, scoped to multiple artists instead of one) 

* **Admin** (roster permissions, multi-imprint/white-label config, billing) ⚠️ *gap — roadmap-only, not built*

**Sync Agency / Sync Manager — sidebar**

* **Sync Search** (§7.2: mood, BPM, key, vocal gender, clearance, territory — role-gated read into CatalogOS)

* **Deal Rooms** (§7.4: Request → Review → Approve → Negotiate → Contract → Sign → Invoice → Deliver → Usage → Royalty Tracking)

* **Submission Inbox**

* **A\&R Workspace access** (when invited into a specific session, §7.7)

* **Licensing / Usage History** (per track)

