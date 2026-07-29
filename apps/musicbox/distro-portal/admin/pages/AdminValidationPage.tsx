'use client';

import { useState } from 'react';
import { Card, StatCard } from '@/components/ui/Card';
import { Badge, StatusBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { PageHeader } from '@/components/layout/PageHeader';
import { EmptyState } from '@/components/ui/States';
import { toast } from '@/components/ui/Toast';
import {
  CheckCircle2, XCircle, AlertTriangle, Clock, Shield, Disc3,
  FileText, ChevronDown, ChevronRight, Info, Eye, Zap
} from 'lucide-react';

// ── MOCK DATA ──

// 3 releases with different validation scores
const MOCK_RELEASES = [
  { id: 'rel-1', title: 'Midnight Echoes', type: 'Album', status: 'released', validation_score: 95 },
  { id: 'rel-2', title: 'Neon Dreams', type: 'EP', status: 'released', validation_score: 72 },
  { id: 'rel-3', title: 'Golden Hour', type: 'Single', status: 'pending_release', validation_score: 38 },
];

// Validation checks per release (25 checks per release: 6 DDEX + 8 Metadata + 4 Artwork + 3 Audio + 2 Copyright + 2 Territory)
type CheckStatus = 'pass' | 'fail' | 'warning' | 'pending';

interface ValidationCheck {
  id: string;
  release_id: string;
  check_type: string;
  check_name: string;
  status: CheckStatus;
  message: string;
  checked_at: string;
}

const MOCK_VALIDATION_CHECKS: ValidationCheck[] = [
  // ── Release 1: Midnight Echoes (95% — mostly passing) ──
  // DDEX (6 checks)
  { id: 'vc-1-1', release_id: 'rel-1', check_type: 'ddex', check_name: 'ERN XML Schema Valid', status: 'pass', message: 'DDEX ERN XML schema validation passed — all required elements present', checked_at: '2025-06-12T10:30:00Z' },
  { id: 'vc-1-2', release_id: 'rel-1', check_type: 'ddex', check_name: 'MessageHeader Complete', status: 'pass', message: 'MessageHeader contains all required fields (MessageThreadId, MessageId, Sender/Receiver)', checked_at: '2025-06-12T10:30:00Z' },
  { id: 'vc-1-3', release_id: 'rel-1', check_type: 'ddex', check_name: 'ResourceList Valid', status: 'pass', message: 'ResourceList contains all expected resources with valid references', checked_at: '2025-06-12T10:30:00Z' },
  { id: 'vc-1-4', release_id: 'rel-1', check_type: 'ddex', check_name: 'DealTerms Complete', status: 'pass', message: 'All DealTerms have valid CommercialModelType, TerritoryCode, and UseType', checked_at: '2025-06-12T10:30:00Z' },
  { id: 'vc-1-5', release_id: 'rel-1', check_type: 'ddex', check_name: 'ICPN/GRid Present', status: 'pass', message: 'ICPN (EAN/UPC) and GRid identifiers present and valid format', checked_at: '2025-06-12T10:30:00Z' },
  { id: 'vc-1-6', release_id: 'rel-1', check_type: 'ddex', check_name: 'PartyIdentifiers Valid', status: 'warning', message: 'Some PartyIdentifiers missing DDEX Party ID — will use fallback lookup', checked_at: '2025-06-12T10:30:00Z' },

  // Metadata (8 checks)
  { id: 'vc-1-7', release_id: 'rel-1', check_type: 'metadata', check_name: 'Title Length Valid', status: 'pass', message: 'Release title within 1-100 character limit', checked_at: '2025-06-12T10:30:00Z' },
  { id: 'vc-1-8', release_id: 'rel-1', check_type: 'metadata', check_name: 'Genre Codes Present', status: 'pass', message: 'Genre codes present for all tracks — matching DDEX genre taxonomy', checked_at: '2025-06-12T10:30:00Z' },
  { id: 'vc-1-9', release_id: 'rel-1', check_type: 'metadata', check_name: 'ISRC Unique Per Track', status: 'pass', message: 'All tracks have unique, valid ISRC codes', checked_at: '2025-06-12T10:30:00Z' },
  { id: 'vc-1-10', release_id: 'rel-1', check_type: 'metadata', check_name: 'Artist Credits Complete', status: 'pass', message: 'Artist credits present for all tracks with proper DisplayArtist sequencing', checked_at: '2025-06-12T10:30:00Z' },
  { id: 'vc-1-11', release_id: 'rel-1', check_type: 'metadata', check_name: 'Language Code Present', status: 'pass', message: 'Language code present on all text elements (en, es, etc.)', checked_at: '2025-06-12T10:30:00Z' },
  { id: 'vc-1-12', release_id: 'rel-1', check_type: 'metadata', check_name: 'PLine/CLine Present', status: 'pass', message: 'PLine (phonographic) and CLine (copyright) present with valid year', checked_at: '2025-06-12T10:30:00Z' },
  { id: 'vc-1-13', release_id: 'rel-1', check_type: 'metadata', check_name: 'Release Date Valid', status: 'pass', message: 'OriginalReleaseDate and ReleaseDate within valid range', checked_at: '2025-06-12T10:30:00Z' },
  { id: 'vc-1-14', release_id: 'rel-1', check_type: 'metadata', check_name: 'Track Duration Provided', status: 'pass', message: 'Duration provided for all tracks in ISO 8601 format', checked_at: '2025-06-12T10:30:00Z' },

  // Artwork (4 checks)
  { id: 'vc-1-15', release_id: 'rel-1', check_type: 'artwork', check_name: 'Resolution ≥ 3000×3000', status: 'pass', message: 'Artwork resolution: 4000×4000 — meets minimum 3000×3000 requirement', checked_at: '2025-06-12T10:30:00Z' },
  { id: 'vc-1-16', release_id: 'rel-1', check_type: 'artwork', check_name: 'RGB JPEG Format', status: 'pass', message: 'Artwork is RGB JPEG format — color mode and format valid', checked_at: '2025-06-12T10:30:00Z' },
  { id: 'vc-1-17', release_id: 'rel-1', check_type: 'artwork', check_name: 'No URLs in Artwork', status: 'pass', message: 'No URLs, websites, or social media handles detected in artwork', checked_at: '2025-06-12T10:30:00Z' },
  { id: 'vc-1-18', release_id: 'rel-1', check_type: 'artwork', check_name: 'No Borders/Blur', status: 'pass', message: 'Artwork has no borders, no blur, and is not pixelated', checked_at: '2025-06-12T10:30:00Z' },

  // Audio (3 checks)
  { id: 'vc-1-19', release_id: 'rel-1', check_type: 'audio', check_name: 'Loudness -14 LUFS ±1', status: 'pass', message: 'Track loudness: -14.2 LUFS — within acceptable range', checked_at: '2025-06-12T10:30:00Z' },
  { id: 'vc-1-20', release_id: 'rel-1', check_type: 'audio', check_name: 'Peak Level ≤ -1 dBTP', status: 'pass', message: 'True peak: -1.3 dBTP — within limit', checked_at: '2025-06-12T10:30:00Z' },
  { id: 'vc-1-21', release_id: 'rel-1', check_type: 'audio', check_name: 'Checksum Valid', status: 'pass', message: 'Audio file checksum (MD5) matches expected value', checked_at: '2025-06-12T10:30:00Z' },

  // Copyright (2 checks)
  { id: 'vc-1-22', release_id: 'rel-1', check_type: 'copyright', check_name: 'Copyright Notice Present', status: 'pass', message: 'Copyright notice (© and ℗) present in metadata', checked_at: '2025-06-12T10:30:00Z' },
  { id: 'vc-1-23', release_id: 'rel-1', check_type: 'copyright', check_name: 'Rights Holder Declared', status: 'pass', message: 'Rights holder (copyright owner) declared in metadata', checked_at: '2025-06-12T10:30:00Z' },

  // Territory (2 checks)
  { id: 'vc-1-24', release_id: 'rel-1', check_type: 'territory', check_name: 'Territory Codes Valid', status: 'pass', message: 'All territory codes use ISO 3166-1 alpha-2 format', checked_at: '2025-06-12T10:30:00Z' },
  { id: 'vc-1-25', release_id: 'rel-1', check_type: 'territory', check_name: 'Worldwide or Explicit List', status: 'pass', message: 'Territory defined as Worldwide or explicit country list', checked_at: '2025-06-12T10:30:00Z' },

  // ── Release 2: Neon Dreams (72% — several failures) ──
  // DDEX (6 checks)
  { id: 'vc-2-1', release_id: 'rel-2', check_type: 'ddex', check_name: 'ERN XML Schema Valid', status: 'pass', message: 'DDEX ERN XML schema validation passed', checked_at: '2025-06-10T08:00:00Z' },
  { id: 'vc-2-2', release_id: 'rel-2', check_type: 'ddex', check_name: 'MessageHeader Complete', status: 'pass', message: 'MessageHeader contains all required fields', checked_at: '2025-06-10T08:00:00Z' },
  { id: 'vc-2-3', release_id: 'rel-2', check_type: 'ddex', check_name: 'ResourceList Valid', status: 'fail', message: 'Track 2 missing ISRC code — ResourceList incomplete', checked_at: '2025-06-10T08:00:00Z' },
  { id: 'vc-2-4', release_id: 'rel-2', check_type: 'ddex', check_name: 'DealTerms Complete', status: 'pass', message: 'All DealTerms have valid CommercialModelType and TerritoryCode', checked_at: '2025-06-10T08:00:00Z' },
  { id: 'vc-2-5', release_id: 'rel-2', check_type: 'ddex', check_name: 'ICPN/GRid Present', status: 'pass', message: 'ICPN identifier present and valid', checked_at: '2025-06-10T08:00:00Z' },
  { id: 'vc-2-6', release_id: 'rel-2', check_type: 'ddex', check_name: 'PartyIdentifiers Valid', status: 'warning', message: '3 contributors missing DDEX Party IDs', checked_at: '2025-06-10T08:00:00Z' },

  // Metadata (8 checks)
  { id: 'vc-2-7', release_id: 'rel-2', check_type: 'metadata', check_name: 'Title Length Valid', status: 'pass', message: 'Release title valid length', checked_at: '2025-06-10T08:00:00Z' },
  { id: 'vc-2-8', release_id: 'rel-2', check_type: 'metadata', check_name: 'Genre Codes Present', status: 'pass', message: 'Genre codes present', checked_at: '2025-06-10T08:00:00Z' },
  { id: 'vc-2-9', release_id: 'rel-2', check_type: 'metadata', check_name: 'ISRC Unique Per Track', status: 'fail', message: 'Track 2 ISRC is missing — all tracks must have unique ISRC codes', checked_at: '2025-06-10T08:00:00Z' },
  { id: 'vc-2-10', release_id: 'rel-2', check_type: 'metadata', check_name: 'Artist Credits Complete', status: 'pass', message: 'Artist credits present for all tracks', checked_at: '2025-06-10T08:00:00Z' },
  { id: 'vc-2-11', release_id: 'rel-2', check_type: 'metadata', check_name: 'Language Code Present', status: 'fail', message: 'Track 3 lyrics missing language code — required for DDEX compliance', checked_at: '2025-06-10T08:00:00Z' },
  { id: 'vc-2-12', release_id: 'rel-2', check_type: 'metadata', check_name: 'PLine/CLine Present', status: 'pass', message: 'PLine and CLine present', checked_at: '2025-06-10T08:00:00Z' },
  { id: 'vc-2-13', release_id: 'rel-2', check_type: 'metadata', check_name: 'Release Date Valid', status: 'pass', message: 'Release date valid', checked_at: '2025-06-10T08:00:00Z' },
  { id: 'vc-2-14', release_id: 'rel-2', check_type: 'metadata', check_name: 'Track Duration Provided', status: 'warning', message: 'Track 4 duration estimated — may not match actual audio length', checked_at: '2025-06-10T08:00:00Z' },

  // Artwork (4 checks)
  { id: 'vc-2-15', release_id: 'rel-2', check_type: 'artwork', check_name: 'Resolution ≥ 3000×3000', status: 'pass', message: 'Artwork resolution: 3500×3500 — meets minimum', checked_at: '2025-06-10T08:00:00Z' },
  { id: 'vc-2-16', release_id: 'rel-2', check_type: 'artwork', check_name: 'RGB JPEG Format', status: 'fail', message: 'Artwork is CMYK format — must be RGB for all DSPs', checked_at: '2025-06-10T08:00:00Z' },
  { id: 'vc-2-17', release_id: 'rel-2', check_type: 'artwork', check_name: 'No URLs in Artwork', status: 'pass', message: 'No URLs detected in artwork', checked_at: '2025-06-10T08:00:00Z' },
  { id: 'vc-2-18', release_id: 'rel-2', check_type: 'artwork', check_name: 'No Borders/Blur', status: 'warning', message: 'Artwork has slight border on bottom edge — may cause rejection from some DSPs', checked_at: '2025-06-10T08:00:00Z' },

  // Audio (3 checks)
  { id: 'vc-2-19', release_id: 'rel-2', check_type: 'audio', check_name: 'Loudness -14 LUFS ±1', status: 'pass', message: 'Track loudness: -14.0 LUFS', checked_at: '2025-06-10T08:00:00Z' },
  { id: 'vc-2-20', release_id: 'rel-2', check_type: 'audio', check_name: 'Peak Level ≤ -1 dBTP', status: 'fail', message: 'Track 3 true peak: +0.2 dBTP — exceeds -1 dBTP limit, will cause clipping on normalization', checked_at: '2025-06-10T08:00:00Z' },
  { id: 'vc-2-21', release_id: 'rel-2', check_type: 'audio', check_name: 'Checksum Valid', status: 'pass', message: 'Audio checksums match', checked_at: '2025-06-10T08:00:00Z' },

  // Copyright (2 checks)
  { id: 'vc-2-22', release_id: 'rel-2', check_type: 'copyright', check_name: 'Copyright Notice Present', status: 'pass', message: 'Copyright notice present', checked_at: '2025-06-10T08:00:00Z' },
  { id: 'vc-2-23', release_id: 'rel-2', check_type: 'copyright', check_name: 'Rights Holder Declared', status: 'pass', message: 'Rights holder declared', checked_at: '2025-06-10T08:00:00Z' },

  // Territory (2 checks)
  { id: 'vc-2-24', release_id: 'rel-2', check_type: 'territory', check_name: 'Territory Codes Valid', status: 'pass', message: 'All territory codes valid ISO 3166-1 format', checked_at: '2025-06-10T08:00:00Z' },
  { id: 'vc-2-25', release_id: 'rel-2', check_type: 'territory', check_name: 'Worldwide or Explicit List', status: 'pass', message: 'Territory defined as Worldwide', checked_at: '2025-06-10T08:00:00Z' },

  // ── Release 3: Golden Hour (38% — many failures) ──
  // DDEX (6 checks)
  { id: 'vc-3-1', release_id: 'rel-3', check_type: 'ddex', check_name: 'ERN XML Schema Valid', status: 'fail', message: 'DDEX ERN XML schema validation failed — missing required element <ReleaseResourceReferenceList>', checked_at: '2025-06-14T15:00:00Z' },
  { id: 'vc-3-2', release_id: 'rel-3', check_type: 'ddex', check_name: 'MessageHeader Complete', status: 'fail', message: 'MessageHeader missing SenderPartyId — delivery will be rejected by all DSPs', checked_at: '2025-06-14T15:00:00Z' },
  { id: 'vc-3-3', release_id: 'rel-3', check_type: 'ddex', check_name: 'ResourceList Valid', status: 'fail', message: 'ResourceList references non-existent resources — 3 broken references detected', checked_at: '2025-06-14T15:00:00Z' },
  { id: 'vc-3-4', release_id: 'rel-3', check_type: 'ddex', check_name: 'DealTerms Complete', status: 'fail', message: '2 DealTerms missing TerritoryCode — distribution scope undefined', checked_at: '2025-06-14T15:00:00Z' },
  { id: 'vc-3-5', release_id: 'rel-3', check_type: 'ddex', check_name: 'ICPN/GRid Present', status: 'pending', message: 'ICPN/GRid identifiers not yet assigned — pending catalog registration', checked_at: '2025-06-14T15:00:00Z' },
  { id: 'vc-3-6', release_id: 'rel-3', check_type: 'ddex', check_name: 'PartyIdentifiers Valid', status: 'fail', message: 'All PartyIdentifiers missing — no sender, recipient, or contributor IDs', checked_at: '2025-06-14T15:00:00Z' },

  // Metadata (8 checks)
  { id: 'vc-3-7', release_id: 'rel-3', check_type: 'metadata', check_name: 'Title Length Valid', status: 'pass', message: 'Release title valid', checked_at: '2025-06-14T15:00:00Z' },
  { id: 'vc-3-8', release_id: 'rel-3', check_type: 'metadata', check_name: 'Genre Codes Present', status: 'fail', message: 'No genre codes provided — required by all DSPs', checked_at: '2025-06-14T15:00:00Z' },
  { id: 'vc-3-9', release_id: 'rel-3', check_type: 'metadata', check_name: 'ISRC Unique Per Track', status: 'fail', message: 'No ISRC codes assigned — must register with IFPI before delivery', checked_at: '2025-06-14T15:00:00Z' },
  { id: 'vc-3-10', release_id: 'rel-3', check_type: 'metadata', check_name: 'Artist Credits Complete', status: 'fail', message: 'Artist credits missing for 2 tracks — DisplayArtist sequence incomplete', checked_at: '2025-06-14T15:00:00Z' },
  { id: 'vc-3-11', release_id: 'rel-3', check_type: 'metadata', check_name: 'Language Code Present', status: 'fail', message: 'No language codes on any text elements', checked_at: '2025-06-14T15:00:00Z' },
  { id: 'vc-3-12', release_id: 'rel-3', check_type: 'metadata', check_name: 'PLine/CLine Present', status: 'fail', message: 'PLine and CLine completely missing — legal requirement for distribution', checked_at: '2025-06-14T15:00:00Z' },
  { id: 'vc-3-13', release_id: 'rel-3', check_type: 'metadata', check_name: 'Release Date Valid', status: 'pending', message: 'Release date not set — pending official announcement', checked_at: '2025-06-14T15:00:00Z' },
  { id: 'vc-3-14', release_id: 'rel-3', check_type: 'metadata', check_name: 'Track Duration Provided', status: 'warning', message: 'Track durations estimated from file sizes — may be inaccurate', checked_at: '2025-06-14T15:00:00Z' },

  // Artwork (4 checks)
  { id: 'vc-3-15', release_id: 'rel-3', check_type: 'artwork', check_name: 'Resolution ≥ 3000×3000', status: 'fail', message: 'Artwork resolution: 1500×1500 — below 3000×3000 minimum requirement', checked_at: '2025-06-14T15:00:00Z' },
  { id: 'vc-3-16', release_id: 'rel-3', check_type: 'artwork', check_name: 'RGB JPEG Format', status: 'fail', message: 'Artwork is PNG format with transparency — must be RGB JPEG', checked_at: '2025-06-14T15:00:00Z' },
  { id: 'vc-3-17', release_id: 'rel-3', check_type: 'artwork', check_name: 'No URLs in Artwork', status: 'fail', message: 'Instagram handle "@artist_name" detected in artwork — must be removed', checked_at: '2025-06-14T15:00:00Z' },
  { id: 'vc-3-18', release_id: 'rel-3', check_type: 'artwork', check_name: 'No Borders/Blur', status: 'fail', message: 'Artwork has visible border (8px) and is slightly blurred', checked_at: '2025-06-14T15:00:00Z' },

  // Audio (3 checks)
  { id: 'vc-3-19', release_id: 'rel-3', check_type: 'audio', check_name: 'Loudness -14 LUFS ±1', status: 'fail', message: 'Track loudness: -8.5 LUFS — significantly above target, will be heavily normalized by DSPs', checked_at: '2025-06-14T15:00:00Z' },
  { id: 'vc-3-20', release_id: 'rel-3', check_type: 'audio', check_name: 'Peak Level ≤ -1 dBTP', status: 'fail', message: 'True peak: +2.1 dBTP — severe clipping risk, will be rejected by Spotify and Apple Music', checked_at: '2025-06-14T15:00:00Z' },
  { id: 'vc-3-21', release_id: 'rel-3', check_type: 'audio', check_name: 'Checksum Valid', status: 'pending', message: 'Checksum not computed — audio files not yet finalized', checked_at: '2025-06-14T15:00:00Z' },

  // Copyright (2 checks)
  { id: 'vc-3-22', release_id: 'rel-3', check_type: 'copyright', check_name: 'Copyright Notice Present', status: 'fail', message: 'No copyright notice in metadata — required for legal compliance', checked_at: '2025-06-14T15:00:00Z' },
  { id: 'vc-3-23', release_id: 'rel-3', check_type: 'copyright', check_name: 'Rights Holder Declared', status: 'fail', message: 'No rights holder declared — ownership unclear, cannot distribute', checked_at: '2025-06-14T15:00:00Z' },

  // Territory (2 checks)
  { id: 'vc-3-24', release_id: 'rel-3', check_type: 'territory', check_name: 'Territory Codes Valid', status: 'fail', message: 'Territory codes use non-standard format — must be ISO 3166-1 alpha-2', checked_at: '2025-06-14T15:00:00Z' },
  { id: 'vc-3-25', release_id: 'rel-3', check_type: 'territory', check_name: 'Worldwide or Explicit List', status: 'fail', message: 'Territory not defined — distribution scope completely missing', checked_at: '2025-06-14T15:00:00Z' },
];

// Validation rules reference (Section 9.2)
const VALIDATION_RULES = [
  { category: 'Artwork', rules: ['Minimum 3000×3000 pixels', 'RGB color mode (no CMYK)', 'JPEG format (no PNG with transparency)', 'No URLs, websites, or social handles', 'No borders or blurred edges', 'Square aspect ratio (1:1)'] },
  { category: 'Audio', rules: ['-14 LUFS integrated loudness ±1 dB', 'True peak ≤ -1 dBTP', 'MD5 checksum for file integrity', 'WAV or FLAC source (lossless)', 'No silence gaps > 2 seconds at start/end'] },
  { category: 'Metadata', rules: ['ISRC per track (unique)', 'Genre code from DDEX taxonomy', 'Language code on all text fields', 'PLine and CLine with year', 'Artist credits with DisplayArtist sequence'] },
  { category: 'DDEX', rules: ['ERN XML schema validation', 'MessageHeader with all required fields', 'ResourceList with valid references', 'DealTerms with CommercialModelType + TerritoryCode', 'ICPN/GRid identifiers', 'PartyIdentifiers for all contributors'] },
  { category: 'Copyright', rules: ['© and ℗ notices in metadata', 'Rights holder declared', 'No disputed ownership flags'] },
  { category: 'Territory', rules: ['ISO 3166-1 alpha-2 territory codes', 'Worldwide or explicit country list', 'No overlapping territory declarations'] },
];

const CHECK_TYPE_GROUPS = ['ddex', 'metadata', 'artwork', 'audio', 'copyright', 'territory'];

export function AdminValidationPage() {
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    'rel-1': true, 'rel-2': true, 'rel-3': true,
  });
  const [showRules, setShowRules] = useState(false);

  // Overall stats
  const allChecks = MOCK_VALIDATION_CHECKS;
  const totalChecks = allChecks.length;
  const passing = allChecks.filter(c => c.status === 'pass').length;
  const failing = allChecks.filter(c => c.status === 'fail').length;
  const warnings = allChecks.filter(c => c.status === 'warning').length;
  const pending = allChecks.filter(c => c.status === 'pending').length;

  const statusIcon = (status: CheckStatus) => {
    if (status === 'pass') return <CheckCircle2 size={16} className="text-green-500" />;
    if (status === 'fail') return <XCircle size={16} className="text-red-500" />;
    if (status === 'warning') return <AlertTriangle size={16} className="text-amber-500" />;
    return <Clock size={16} className="text-neutral-400" />;
  };

  const typeColor = (type: string) =>
    type === 'ddex' ? 'teal' : type === 'metadata' ? 'purple' : type === 'artwork' ? 'pink' : type === 'audio' ? 'blue' : type === 'copyright' ? 'amber' : 'gray';

  return (
    <div>
      <PageHeader title="Validation Engine" description="Track DDEX, metadata, artwork, audio, copyright, and territory validation status per release." actions={
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={() => setShowRules(!showRules)}>
            <Info size={14} /> {showRules ? 'Hide Rules' : 'Show Rules'}
          </Button>
          <Button variant="primary" size="sm" onClick={() => toast('info', 'Re-validation trigger coming soon')}>
            <Zap size={14} /> Re-validate All
          </Button>
        </div>
      } />

      {/* Overall stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <StatCard label="Total Releases" value={MOCK_RELEASES.length} icon={<Disc3 size={28} />} />
        <StatCard label="Passed Checks" value={passing} icon={<CheckCircle2 size={28} />} />
        <StatCard label="Failing Checks" value={failing} icon={<XCircle size={28} />} />
        <StatCard label="Warnings" value={warnings} icon={<AlertTriangle size={28} />} />
        <StatCard label="Pending" value={pending} icon={<Clock size={28} />} />
      </div>

      {/* Validation Rules Reference */}
      {showRules && (
        <Card className="p-5 mb-6">
          <h3 className="font-semibold text-neutral-900 mb-4">Validation Rules Reference (Section 9.2)</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {VALIDATION_RULES.map(group => (
              <div key={group.category} className="p-3 rounded-lg bg-neutral-50 border border-neutral-200">
                <p className="font-medium text-neutral-900 text-sm mb-2">{group.category}</p>
                <ul className="space-y-1">
                  {group.rules.map((rule, i) => (
                    <li key={i} className="text-xs text-neutral-600 flex items-center gap-1.5">
                      <CheckCircle2 size={12} className="text-neutral-400" />
                      {rule}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Release validation groups */}
      <div className="space-y-4">
        {MOCK_RELEASES.map(release => {
          const checks = allChecks.filter(c => c.release_id === release.id);
          const score = release.validation_score;
          const hasFailing = checks.some(c => c.status === 'fail');
          const passCount = checks.filter(c => c.status === 'pass').length;
          const failCount = checks.filter(c => c.status === 'fail').length;
          const warnCount = checks.filter(c => c.status === 'warning').length;
          const pendCount = checks.filter(c => c.status === 'pending').length;

          const isExpanded = expandedGroups[release.id] ?? true;
          const toggle = () => setExpandedGroups(prev => ({ ...prev, [release.id]: !prev[release.id] }));

          // Group checks by type
          const groupedChecks = CHECK_TYPE_GROUPS.map(type => ({
            type,
            checks: checks.filter(c => c.check_type === type),
          })).filter(g => g.checks.length > 0);

          return (
            <Card key={release.id} className="p-5">
              {/* Release header */}
              <button
                onClick={toggle}
                className="flex items-center justify-between w-full text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-neutral-200 to-neutral-300 flex items-center justify-center">
                    <Disc3 size={16} className="text-neutral-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-neutral-900">{release.title}</p>
                    <p className="text-xs text-neutral-500">{release.type} · {release.status}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {/* Summary mini badges */}
                  <Badge color="green" size="sm">{passCount} pass</Badge>
                  {failCount > 0 && <Badge color="red" size="sm">{failCount} fail</Badge>}
                  {warnCount > 0 && <Badge color="amber" size="sm">{warnCount} warning</Badge>}
                  {pendCount > 0 && <Badge color="gray" size="sm">{pendCount} pending</Badge>}

                  {/* Score */}
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold ${
                    score >= 90 ? 'bg-green-100 text-green-700' :
                    score >= 60 ? 'bg-amber-100 text-amber-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {score}%
                  </div>
                  {hasFailing && <Badge color="red" size="md">Blocked</Badge>}
                  <span className="text-neutral-400">
                    {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                  </span>
                </div>
              </button>

              {isExpanded && (
                <div className="mt-4 space-y-4">
                  {groupedChecks.map(group => (
                    <div key={group.type}>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge color={typeColor(group.type)} size="md">{group.type}</Badge>
                        <p className="text-xs text-neutral-500">{group.checks.length} checks</p>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-neutral-200">
                              <th className="text-left py-1.5 px-2 font-medium text-neutral-500 text-xs">Check</th>
                              <th className="text-left py-1.5 px-2 font-medium text-neutral-500 text-xs">Status</th>
                              <th className="text-left py-1.5 px-2 font-medium text-neutral-500 text-xs">Message</th>
                              <th className="text-left py-1.5 px-2 font-medium text-neutral-500 text-xs">Checked At</th>
                            </tr>
                          </thead>
                          <tbody>
                            {group.checks.map(c => (
                              <tr key={c.id} className={`border-b border-neutral-100 ${
                                c.status === 'fail' ? 'bg-red-50/30' :
                                c.status === 'warning' ? 'bg-amber-50/30' : ''
                              }`}>
                                <td className="py-1.5 px-2 text-neutral-900 text-xs font-medium">{c.check_name}</td>
                                <td className="py-1.5 px-2">
                                  <div className="flex items-center gap-1">
                                    {statusIcon(c.status)}
                                    <Badge
                                      color={c.status === 'pass' ? 'green' : c.status === 'fail' ? 'red' : c.status === 'warning' ? 'amber' : 'gray'}
                                      size="sm"
                                    >
                                      {c.status}
                                    </Badge>
                                  </div>
                                </td>
                                <td className="py-1.5 px-2 text-neutral-600 text-xs max-w-md">{c.message}</td>
                                <td className="py-1.5 px-2 text-neutral-500 text-xs">{c.checked_at.split('T')[0]}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
