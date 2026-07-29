'use client';

import { useState, useCallback, useMemo } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { PageHeader } from '@/components/layout/PageHeader';
import { Field, Input, Select, Textarea } from '@/components/ui/Form';
import { toast } from '@/components/ui/Toast';
import { Progress } from '@/components/ui/progress';
import {
  Disc3, Music, Music2, Radio, Mic2, Volume2, Layers, Plus, Trash2,
  Upload, CheckCircle2, Circle, ChevronLeft, ChevronRight, Shield,
  Globe, Send, Link2, ExternalLink, AlertTriangle, FileText,
  Sparkles, Image as ImageIcon, User, XCircle, Clock, Zap,
  Share2, Megaphone, ArrowRight, Info, Cpu, Headphones
} from 'lucide-react';

// ── TYPES ──

type ReleaseType = 'album' | 'ep' | 'single' | 'mixtape' | 'compilation' | 'live_album';
type WizardStep = 1 | 2 | 3 | 4 | 5;

interface TrackEntry {
  id: string;
  title: string;
  isrc: string;
  duration: string;
  audioFile: string;
  aiAssisted: boolean;
}

interface CreditSplit {
  role: string;
  name: string;
  splitPct: string;
}

interface SongLinkEntry {
  platform: string;
  url: string;
  type: 'pre-save' | 'pre-order' | 'announcement' | 'smart-link';
}

// ── RELEASE TYPE OPTIONS (IA Section 16 Step 1) ──

const RELEASE_TYPES: { value: ReleaseType; label: string; desc: string; icon: React.ReactNode; trackRange: string }[] = [
  { value: 'album', label: 'Album', desc: 'Full-length body of work', icon: <Disc3 size={24} />, trackRange: '7+ tracks' },
  { value: 'ep', label: 'EP', desc: 'Extended play release', icon: <Music size={24} />, trackRange: '2–6 tracks' },
  { value: 'single', label: 'Single', desc: 'One-track standalone release', icon: <Music2 size={24} />, trackRange: '1 track' },
  { value: 'mixtape', label: 'Mixtape', desc: 'Curated or unofficial collection', icon: <Radio size={24} />, trackRange: 'Any' },
  { value: 'compilation', label: 'Compilation', desc: 'Multi-artist or retrospective set', icon: <Layers size={24} />, trackRange: 'Any' },
  { value: 'live_album', label: 'Live Album', desc: 'Recorded from a live performance', icon: <Volume2 size={24} />, trackRange: 'Any' },
];

// ── DSP PLATFORMS (IA Section 16 Step 4 + Section 8.4 TooLost V1) ──

const DSP_PLATFORMS = [
  { id: 'spotify', name: 'Spotify', category: 'Streaming', deliveryFormat: 'DDEX ERN/XML' },
  { id: 'apple_music', name: 'Apple Music', category: 'Streaming', deliveryFormat: 'DDEX ERN/XML' },
  { id: 'amazon_music', name: 'Amazon Music', category: 'Streaming', deliveryFormat: 'DDEX ERN/XML' },
  { id: 'youtube_music', name: 'YouTube Music', category: 'Streaming', deliveryFormat: 'DDEX ERN/XML' },
  { id: 'tiktok', name: 'TikTok', category: 'Social', deliveryFormat: 'API' },
  { id: 'meta', name: 'Meta (Facebook/Instagram)', category: 'Social', deliveryFormat: 'API' },
  { id: 'pandora', name: 'Pandora', category: 'Streaming', deliveryFormat: 'DDEX ERN/XML' },
  { id: 'tidal', name: 'Tidal', category: 'Streaming', deliveryFormat: 'DDEX ERN/XML' },
  { id: 'deezer', name: 'Deezer', category: 'Streaming', deliveryFormat: 'DDEX ERN/XML' },
  { id: 'soundcloud', name: 'SoundCloud', category: 'Streaming', deliveryFormat: 'API' },
  { id: 'toolost_v1', name: 'TooLost V1', category: 'Partner', deliveryFormat: 'DDEX ERN/XML' },
];

const TERRITORY_REGIONS = [
  { id: 'WW', label: 'Worldwide', desc: 'All territories' },
  { id: 'US', label: 'United States', desc: 'US only' },
  { id: 'EU', label: 'European Union', desc: 'EU member states' },
  { id: 'UK', label: 'United Kingdom', desc: 'UK only' },
  { id: 'LATAM', label: 'Latin America', desc: 'Central & South America' },
  { id: 'APAC', label: 'Asia-Pacific', desc: 'APAC region' },
  { id: 'AFRICA', label: 'Africa', desc: 'All African territories' },
];

const DELIVERY_MODES = [
  { id: 'standard', label: 'Standard Delivery', desc: 'Normal processing via TooLost V1 adapter (Section 8.4)' },
  { id: 'express', label: 'Express Delivery', desc: 'Priority processing — expedited queue' },
  { id: 'hold', label: 'Hold for Review', desc: 'Pause delivery until manual QA review (Section 9 validation)' },
];

// ── SONG LINK PLATFORMS (IA Section 16 Step 5) ──

const SONG_LINK_PLATFORMS = [
  'Spotify', 'Apple Music', 'YouTube Music', 'Amazon Music',
  'Tidal', 'Deezer', 'Pandora', 'SoundCloud',
];

const SOCIAL_PLATFORMS = [
  'Instagram', 'Twitter/X', 'Facebook', 'TikTok', 'YouTube',
  'Threads', 'Reddit',
];

// ── GENRES ──

const GENRES = [
  'Electronic', 'Pop', 'R&B', 'Hip-Hop', 'Rock', 'Jazz',
  'Classical', 'Folk', 'Country', 'Latin', 'Metal', 'Indie',
  'Alternative', 'Dance', 'Ambient', 'Lo-Fi', 'Afrobeats',
  'Reggae', 'Soul', 'Blues', 'Punk', 'Experimental',
];

const CREDIT_ROLES = [
  'Primary Artist', 'Featured Artist', 'Producer', 'Co-Producer',
  'Songwriter', 'Composer', 'Lyricist', 'Mix Engineer',
  'Mastering Engineer', 'Executive Producer', 'A&R', 'Vocalist',
  'Instrumentalist', 'DJ', 'Remixer',
];

// ── STEP DEFINITIONS ──

const STEPS: { step: WizardStep; label: string; shortLabel: string; desc: string }[] = [
  { step: 1, label: 'Release Type', shortLabel: 'Type', desc: 'What kind of release is this?' },
  { step: 2, label: 'Tracks', shortLabel: 'Tracks', desc: 'Add tracks, upload audio, enter ISRC per track' },
  { step: 3, label: 'Metadata', shortLabel: 'Metadata', desc: 'Release title, artist, genre, UPC, artwork, credits & splits, AI disclosure' },
  { step: 4, label: 'Platform Targeting', shortLabel: 'Platforms', desc: 'Select target DSPs, territory selection, delivery mode' },
  { step: 5, label: 'Song Links', shortLabel: 'Links', desc: 'Pre-save links, social announcements, smart links' },
];

// ── UTILITY ──

let trackIdCounter = 1;
function nextTrackId() { return `track-${trackIdCounter++}`; }

// ══════════════════════════════════════════════════════
//  MAIN COMPONENT
// ══════════════════════════════════════════════════════

export function AdminNewReleaseWizard() {
  // ── Wizard state ──
  const [currentStep, setCurrentStep] = useState<WizardStep>(1);
  const [completedSteps, setCompletedSteps] = useState<Set<WizardStep>>(new Set());

  // ── Step 1: Release Type ──
  const [releaseType, setReleaseType] = useState<ReleaseType | ''>('');

  // ── Step 2: Tracks ──
  const [tracks, setTracks] = useState<TrackEntry[]>([
    { id: nextTrackId(), title: '', isrc: '', duration: '', audioFile: '', aiAssisted: false },
  ]);

  // ── Step 3: Metadata ──
  const [metadata, setMetadata] = useState({
    title: '',
    subtitle: '',
    artistName: '',
    genre: '',
    subGenre: '',
    releaseDate: '',
    upc: '',
    cLine: '',
    pLine: '',
    labelName: '',
    notes: '',
  });
  const [artworkFile, setArtworkFile] = useState<string>('');
  const [credits, setCredits] = useState<CreditSplit[]>([
    { role: 'Primary Artist', name: '', splitPct: '100' },
  ]);
  const [isAiAssisted, setIsAiAssisted] = useState(false);
  const [aiDescription, setAiDescription] = useState('');

  // ── Step 4: Platform Targeting ──
  const [selectedDSPs, setSelectedDSPs] = useState<string[]>([]);
  const [selectedTerritories, setSelectedTerritories] = useState<string[]>(['WW']);
  const [deliveryMode, setDeliveryMode] = useState('standard');

  // ── Step 5: Song Links ──
  const [songLinks, setSongLinks] = useState<SongLinkEntry[]>([]);
  const [smartLinkUrl, setSmartLinkUrl] = useState('');
  const [socialAnnouncements, setSocialAnnouncements] = useState<{ platform: string; url: string }[]>([]);

  // ── Validation errors ──
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // ── Step completion check ──
  const stepCompleted = useCallback((step: WizardStep): boolean => {
    switch (step) {
      case 1: return releaseType !== '';
      case 2: return tracks.length > 0 && tracks.every(t => t.title.trim() !== '');
      case 3: return metadata.title.trim() !== '' && metadata.artistName.trim() !== '' && metadata.genre !== '' && metadata.releaseDate !== '' && metadata.upc.trim() !== '';
      case 4: return selectedDSPs.length > 0 && selectedTerritories.length > 0;
      case 5: return true; // Optional step — no required fields
    }
  }, [releaseType, tracks, metadata, selectedDSPs, selectedTerritories]);

  // ── Validate current step before advancing ──
  const validateStep = useCallback((step: WizardStep): string[] => {
    const errors: string[] = [];
    switch (step) {
      case 1:
        if (!releaseType) errors.push('Select a release type before continuing');
        break;
      case 2:
        if (tracks.length === 0) errors.push('Add at least one track');
        tracks.forEach((t, i) => {
          if (!t.title.trim()) errors.push(`Track ${i + 1}: Title is required`);
        });
        // ISRC format check (optional but validate format if provided)
        tracks.forEach((t, i) => {
          if (t.isrc.trim() && !/^[A-Z]{2}[A-Z0-9]{3}[0-9]{7}$/.test(t.isrc.trim())) {
            errors.push(`Track ${i + 1}: ISRC format should be XXXXX0123456 (2-letter country + 3-digit registrant + 7-digit ID)`);
          }
        });
        break;
      case 3:
        if (!metadata.title.trim()) errors.push('Release title is required');
        if (!metadata.artistName.trim()) errors.push('Artist name is required');
        if (!metadata.genre) errors.push('Genre is required');
        if (!metadata.releaseDate) errors.push('Release date is required');
        if (!metadata.upc.trim()) errors.push('UPC is required');
        if (metadata.upc.trim() && !/^\d{12,13}$/.test(metadata.upc.trim())) {
          errors.push('UPC must be 12 or 13 digits');
        }
        if (!artworkFile) errors.push('Cover artwork is required (minimum 3000×3000px)');
        if (isAiAssisted && !aiDescription.trim()) {
          errors.push('AI disclosure: When AI-assisted is enabled, a description of AI usage is required (Section 18.2)');
        }
        // Credits validation
        const totalSplit = credits.reduce((sum, c) => sum + (parseFloat(c.splitPct) || 0), 0);
        if (credits.some(c => !c.name.trim())) {
          errors.push('All credit entries must have a name');
        }
        if (Math.abs(totalSplit - 100) > 0.5) {
          errors.push(`Credit splits must total 100% (currently ${totalSplit}%)`);
        }
        break;
      case 4:
        if (selectedDSPs.length === 0) errors.push('Select at least one DSP for delivery');
        if (selectedTerritories.length === 0) errors.push('Select at least one territory');
        break;
      case 5:
        // Optional — no validation errors
        break;
    }
    return errors;
  }, [releaseType, tracks, metadata, artworkFile, isAiAssisted, aiDescription, credits, selectedDSPs, selectedTerritories]);

  // ── Navigation ──
  const canAdvance = useMemo(() => {
    const errors = validateStep(currentStep);
    return errors.length === 0;
  }, [currentStep, validateStep]);

  const goNext = useCallback(() => {
    const errors = validateStep(currentStep);
    if (errors.length > 0) {
      setValidationErrors(errors);
      toast('error', `${errors.length} validation issues — please fix before continuing`);
      return;
    }
    setValidationErrors([]);
    setCompletedSteps(prev => new Set([...prev, currentStep]));
    if (currentStep < 5) {
      setCurrentStep((currentStep + 1) as WizardStep);
    }
  }, [currentStep, validateStep]);

  const goBack = useCallback(() => {
    setValidationErrors([]);
    if (currentStep > 1) {
      setCurrentStep((currentStep - 1) as WizardStep);
    }
  }, [currentStep]);

  const goToStep = useCallback((step: WizardStep) => {
    // Can only jump to completed steps or the next available step
    if (completedSteps.has(step) || step <= currentStep) {
      setValidationErrors([]);
      setCurrentStep(step);
    }
  }, [completedSteps, currentStep]);

  // ── Track operations ──
  const addTrack = useCallback(() => {
    setTracks(prev => [...prev, { id: nextTrackId(), title: '', isrc: '', duration: '', audioFile: '', aiAssisted: false }]);
  }, []);

  const removeTrack = useCallback((idx: number) => {
    if (tracks.length <= 1) return;
    setTracks(prev => prev.filter((_, i) => i !== idx));
  }, [tracks.length]);

  const updateTrack = useCallback((idx: number, field: keyof TrackEntry, value: string | boolean) => {
    setTracks(prev => prev.map((t, i) => i === idx ? { ...t, [field]: value } : t));
  }, []);

  // ── Credit operations ──
  const addCredit = useCallback(() => {
    setCredits(prev => [...prev, { role: '', name: '', splitPct: '0' }]);
  }, []);

  const removeCredit = useCallback((idx: number) => {
    setCredits(prev => prev.filter((_, i) => i !== idx));
  }, []);

  const updateCredit = useCallback((idx: number, field: keyof CreditSplit, value: string) => {
    setCredits(prev => prev.map((c, i) => i === idx ? { ...c, [field]: value } : c));
  }, []);

  // ── DSP toggle ──
  const toggleDSP = useCallback((dspId: string) => {
    setSelectedDSPs(prev => prev.includes(dspId) ? prev.filter(d => d !== dspId) : [...prev, dspId]);
  }, []);

  // ── Territory toggle ──
  const toggleTerritory = useCallback((territoryId: string) => {
    if (territoryId === 'WW') {
      setSelectedTerritories(prev => prev.includes('WW') ? [] : ['WW']);
    } else {
      setSelectedTerritories(prev => {
        const withoutWW = prev.filter(t => t !== 'WW');
        return withoutWW.includes(territoryId) ? withoutWW.filter(t => t !== territoryId) : [...withoutWW, territoryId];
      });
    }
  }, []);

  // ── Song link operations ──
  const addSongLink = useCallback((type: SongLinkEntry['type']) => {
    setSongLinks(prev => [...prev, { platform: '', url: '', type }]);
  }, []);

  const removeSongLink = useCallback((idx: number) => {
    setSongLinks(prev => prev.filter((_, i) => i !== idx));
  }, []);

  const updateSongLink = useCallback((idx: number, field: keyof SongLinkEntry, value: string) => {
    setSongLinks(prev => prev.map((l, i) => i === idx ? { ...l, [field]: value } : l));
  }, []);

  // ── Social announcement operations ──
  const addSocialAnnouncement = useCallback(() => {
    setSocialAnnouncements(prev => [...prev, { platform: '', url: '' }]);
  }, []);

  const removeSocialAnnouncement = useCallback((idx: number) => {
    setSocialAnnouncements(prev => prev.filter((_, i) => i !== idx));
  }, []);

  const updateSocialAnnouncement = useCallback((idx: number, field: 'platform' | 'url', value: string) => {
    setSocialAnnouncements(prev => prev.map((s, i) => i === idx ? { ...s, [field]: value } : s));
  }, []);

  // ── Submit for Validation (Section 9 Validation Engine) ──
  const submitForValidation = useCallback(() => {
    const allErrors = validateStep(currentStep);
    if (allErrors.length > 0) {
      setValidationErrors(allErrors);
      toast('error', `Cannot submit — ${allErrors.length} validation issues remain`);
      return;
    }

    // Mark all steps as completed
    setCompletedSteps(new Set([1, 2, 3, 4, 5]));
    toast('success', 'Release submitted for validation via Section 9 Validation Engine. Delivery pipeline will begin after QA approval.');
  }, [currentStep, validateStep]);

  // ── Progress percentage ──
  const progressPct = useMemo(() => {
    const base = ((currentStep - 1) / 4) * 80; // 80% for step progress
    const completionBonus = completedSteps.size / 5 * 20; // 20% for completion
    return Math.min(base + completionBonus, 100);
  }, [currentStep, completedSteps]);

  // ══════════════════════════════════════════════════════
  //  RENDER
  // ══════════════════════════════════════════════════════

  const selectedReleaseType = RELEASE_TYPES.find(rt => rt.value === releaseType);

  return (
    <div className="space-y-6">
      <PageHeader
        title="New Release Wizard"
        description="Discography publishing flow — from release type through platform targeting (IA Section 12 & 16)"
        actions={
          <Badge color="teal" size="md">
            <FileText size={14} /> Section 12 Spec
          </Badge>
        }
      />

      {/* ── Progress Bar ── */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-neutral-700">Step {currentStep} of 5</span>
          <span className="text-sm text-neutral-500">{Math.round(progressPct)}% complete</span>
        </div>
        <Progress value={progressPct} className="h-2" />
      </Card>

      {/* ── Step Indicator ── */}
      <div className="flex items-stretch gap-2 overflow-x-auto pb-1">
        {STEPS.map((s) => {
          const isCompleted = completedSteps.has(s.step);
          const isCurrent = currentStep === s.step;
          const isAccessible = isCompleted || s.step <= currentStep;
          return (
            <button
              key={s.step}
              onClick={() => isAccessible && goToStep(s.step)}
              disabled={!isAccessible}
              className={`flex flex-col items-start gap-1 px-4 py-3 rounded-xl border transition-all min-w-[140px] ${
                isCurrent
                  ? 'bg-neutral-900 text-white border-neutral-900 shadow-md'
                  : isCompleted
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                  : isAccessible
                  ? 'bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50'
                  : 'bg-neutral-50 text-neutral-300 border-neutral-100 cursor-not-allowed'
              }`}
            >
              <div className="flex items-center gap-2">
                {isCompleted ? <CheckCircle2 size={16} /> : isCurrent ? <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">{s.step}</span> : <Circle size={16} />}
                <span className="text-sm font-semibold">{s.shortLabel}</span>
              </div>
              <span className={`text-xs leading-tight ${isCurrent ? 'text-white/70' : 'text-neutral-400'}`}>{s.desc}</span>
            </button>
          );
        })}
      </div>

      {/* ── Validation Errors Banner ── */}
      {validationErrors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={18} className="text-red-600" />
            <span className="text-sm font-semibold text-red-800">{validationErrors.length} validation issues</span>
          </div>
          <ul className="space-y-1">
            {validationErrors.map((err, i) => (
              <li key={i} className="text-sm text-red-700 flex items-center gap-2">
                <XCircle size={14} className="text-red-400" />
                {err}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ══════════════════════════════════════════════
          STEP 1: RELEASE TYPE
          ══════════════════════════════════════════════ */}
      {currentStep === 1 && (
        <Card className="p-6">
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-neutral-900">Select Release Type</h2>
            <p className="text-sm text-neutral-500 mt-1">
              This determines the track count expectations, metadata requirements, and how DSPs categorize your release (IA Section 3.6 & 16 Step 1).
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
            {RELEASE_TYPES.map(rt => (
              <button
                key={rt.value}
                onClick={() => { setReleaseType(rt.value); setValidationErrors([]); }}
                className={`flex flex-col items-center gap-3 p-5 rounded-xl border-2 transition-all ${
                  releaseType === rt.value
                    ? 'bg-neutral-900 text-white border-neutral-900 shadow-lg scale-[1.02]'
                    : 'bg-white text-neutral-700 border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50'
                }`}
              >
                <div className={`${
                  releaseType === rt.value ? 'text-white' : 'text-neutral-400'
                }`}>
                  {rt.icon}
                </div>
                <span className="text-sm font-bold">{rt.label}</span>
                <span className={`text-xs ${
                  releaseType === rt.value ? 'text-white/70' : 'text-neutral-400'
                }`}>{rt.desc}</span>
                <Badge color={releaseType === rt.value ? 'teal' : 'gray'} size="sm">{rt.trackRange}</Badge>
              </button>
            ))}
          </div>

          {/* Selection summary */}
          {releaseType && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 mb-6">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={18} className="text-emerald-600" />
                <span className="text-sm font-semibold text-emerald-800">
                  Selected: {selectedReleaseType?.label}
                </span>
                <Badge color="green" size="sm">{selectedReleaseType?.trackRange}</Badge>
              </div>
              <p className="text-xs text-emerald-600 mt-1">{selectedReleaseType?.desc}</p>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
            <Button variant="ghost" disabled>
              <ChevronLeft size={16} /> Back
            </Button>
            <Button variant="primary" onClick={goNext} disabled={!releaseType}>
              Continue to Tracks <ChevronRight size={16} />
            </Button>
          </div>
        </Card>
      )}

      {/* ══════════════════════════════════════════════
          STEP 2: TRACKS
          ══════════════════════════════════════════════ */}
      {currentStep === 2 && (
        <Card className="p-6">
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-neutral-900">Track Listing</h2>
            <p className="text-sm text-neutral-500 mt-1">
              Add tracks for your <Badge color="teal" size="sm">{selectedReleaseType?.label || releaseType}</Badge>.
              Each track requires a title. ISRC codes and audio files are optional at this stage but required before validation (Section 9).
            </p>
          </div>

          {/* Track list */}
          <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1 mb-4">
            {tracks.map((track, idx) => (
              <div key={track.id} className={`p-4 rounded-xl border ${
                track.title.trim() ? 'border-neutral-200 bg-white' : 'border-red-200 bg-red-50/30'
              } transition-colors`}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center text-sm font-bold text-neutral-500">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <Field label="Track Title" required>
                      <Input
                        value={track.title}
                        onChange={e => updateTrack(idx, 'title', e.target.value)}
                        placeholder={`Track ${idx + 1} title`}
                        className="bg-white"
                      />
                    </Field>
                  </div>
                  {tracks.length > 1 && (
                    <button
                      onClick={() => removeTrack(idx)}
                      className="p-2 rounded-lg hover:bg-red-50 text-neutral-400 hover:text-red-600 transition-colors"
                      title="Remove track"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <Field label="ISRC Code" hint="Format: USABC1234567">
                    <Input
                      value={track.isrc}
                      onChange={e => updateTrack(idx, 'isrc', e.target.value)}
                      placeholder="USXXX1234567"
                      className="bg-white"
                    />
                  </Field>
                  <Field label="Duration" hint="MM:SS format">
                    <Input
                      value={track.duration}
                      onChange={e => updateTrack(idx, 'duration', e.target.value)}
                      placeholder="3:45"
                      className="bg-white"
                    />
                  </Field>
                  <Field label="Audio File">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => updateTrack(idx, 'audioFile', `audio-track-${idx + 1}.wav`)}
                      >
                        <Upload size={14} /> Upload
                      </Button>
                      {track.audioFile && (
                        <Badge color="green" size="sm">
                          <Headphones size={12} /> {track.audioFile}
                        </Badge>
                      )}
                    </div>
                  </Field>
                </div>

                {/* AI Assisted toggle per track (Section 18.2) */}
                <div className="flex items-center gap-3 mt-3 p-3 rounded-lg bg-neutral-50 border border-neutral-100">
                  <Cpu size={16} className="text-neutral-400" />
                  <div className="flex-1">
                    <p className="text-xs font-medium text-neutral-700">AI-Assisted Production (Section 18.2)</p>
                    <p className="text-xs text-neutral-400">Flag if this track used AI tools in creation</p>
                  </div>
                  <button
                    onClick={() => updateTrack(idx, 'aiAssisted', !track.aiAssisted)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                      track.aiAssisted
                        ? 'bg-purple-600 text-white'
                        : 'bg-neutral-200 text-neutral-500 hover:bg-neutral-300'
                    }`}
                  >
                    {track.aiAssisted ? 'AI Assisted' : 'Not AI'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add track button */}
          <button
            onClick={addTrack}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-neutral-200 text-sm font-medium text-neutral-600 hover:bg-neutral-50 hover:border-neutral-300 transition-colors mb-6"
          >
            <Plus size={16} /> Add Track
          </button>

          {/* Track count summary */}
          <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-100 mb-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Music2 size={16} className="text-neutral-400" />
                <span className="text-sm font-medium text-neutral-700">{tracks.length} tracks</span>
              </div>
              <Badge color="gray" size="sm">{selectedReleaseType?.label || 'Unselected'}</Badge>
              <Badge color={tracks.every(t => t.title.trim()) ? 'green' : 'amber'} size="sm">
                {tracks.every(t => t.title.trim()) ? 'All titled' : 'Missing titles'}
              </Badge>
              {tracks.some(t => t.aiAssisted) && (
                <Badge color="purple" size="sm">
                  <Cpu size={12} /> AI tracks: {tracks.filter(t => t.aiAssisted).length}
                </Badge>
              )}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
            <Button variant="secondary" onClick={goBack}>
              <ChevronLeft size={16} /> Release Type
            </Button>
            <Button variant="primary" onClick={goNext} disabled={!tracks.every(t => t.title.trim())}>
              Continue to Metadata <ChevronRight size={16} />
            </Button>
          </div>
        </Card>
      )}

      {/* ══════════════════════════════════════════════
          STEP 3: METADATA
          ══════════════════════════════════════════════ */}
      {currentStep === 3 && (
        <Card className="p-6">
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-neutral-900">Metadata & Artwork</h2>
            <p className="text-sm text-neutral-500 mt-1">
              Full release metadata per IA Section 6. UPC, C-Line, P-Line, genre, artwork, credits & splits, and AI disclosure (Section 18.2 isAiAssisted flag).
            </p>
          </div>

          {/* Core metadata grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <Field label="Release Title" required>
              <Input
                value={metadata.title}
                onChange={e => setMetadata({ ...metadata, title: e.target.value })}
                placeholder="Midnight Echoes"
                className="bg-white"
              />
            </Field>
            <Field label="Subtitle / Version">
              <Input
                value={metadata.subtitle}
                onChange={e => setMetadata({ ...metadata, subtitle: e.target.value })}
                placeholder="Deluxe Edition"
                className="bg-white"
              />
            </Field>
            <Field label="Primary Artist" required>
              <Input
                value={metadata.artistName}
                onChange={e => setMetadata({ ...metadata, artistName: e.target.value })}
                placeholder="Adea Lyric"
                className="bg-white"
              />
            </Field>
            <Field label="Genre" required>
              <Select
                value={metadata.genre}
                onChange={e => setMetadata({ ...metadata, genre: e.target.value })}
                className="bg-white"
              >
                <option value="">Select genre</option>
                {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
              </Select>
            </Field>
            <Field label="Sub-Genre">
              <Input
                value={metadata.subGenre}
                onChange={e => setMetadata({ ...metadata, subGenre: e.target.value })}
                placeholder="Synthwave, Dark Pop"
                className="bg-white"
              />
            </Field>
            <Field label="Release Date" required>
              <Input
                type="date"
                value={metadata.releaseDate}
                onChange={e => setMetadata({ ...metadata, releaseDate: e.target.value })}
                className="bg-white"
              />
            </Field>
            <Field label="UPC (Universal Product Code)" required hint="12 or 13 digits">
              <Input
                value={metadata.upc}
                onChange={e => setMetadata({ ...metadata, upc: e.target.value })}
                placeholder="012345678901"
                className="bg-white"
              />
            </Field>
            <Field label="C-Line (Copyright)" hint="℗ Year CopyrightHolder">
              <Input
                value={metadata.cLine}
                onChange={e => setMetadata({ ...metadata, cLine: e.target.value })}
                placeholder="℗ 2026 Adea Lyric LLC"
                className="bg-white"
              />
            </Field>
            <Field label="P-Line (Phonogram)" hint="© Year CopyrightHolder">
              <Input
                value={metadata.pLine}
                onChange={e => setMetadata({ ...metadata, pLine: e.target.value })}
                placeholder="© 2026 Adea Lyric LLC"
                className="bg-white"
              />
            </Field>
            <Field label="Label Name">
              <Input
                value={metadata.labelName}
                onChange={e => setMetadata({ ...metadata, labelName: e.target.value })}
                placeholder="Lyric Records"
                className="bg-white"
              />
            </Field>
          </div>

          {/* Artwork upload */}
          <div className="mb-6">
            <Field label="Cover Artwork" required hint="Minimum 3000×3000px, JPG or PNG, square aspect ratio">
              <div className="flex items-start gap-6">
                <div className="w-40 h-40 rounded-xl border-2 border-dashed border-neutral-300 flex items-center justify-center bg-neutral-50 overflow-hidden">
                  {artworkFile ? (
                    <div className="w-full h-full bg-gradient-to-br from-purple-500 to-teal-500 flex items-center justify-center">
                      <ImageIcon size={32} className="text-white/80" />
                      <div className="absolute bottom-2 right-2">
                        <CheckCircle2 size={16} className="text-white" />
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <ImageIcon size={28} className="text-neutral-300 mx-auto" />
                      <p className="text-xs text-neutral-400 mt-2">No artwork</p>
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <Button variant="secondary" onClick={() => setArtworkFile('cover-art-3000x3000.jpg')}>
                    <Upload size={16} /> Upload Artwork
                  </Button>
                  {artworkFile && (
                    <div className="space-y-1">
                      <Badge color="green" size="sm">
                        <CheckCircle2 size={12} /> {artworkFile}
                      </Badge>
                      <p className="text-xs text-neutral-500">3000×3000px • JPG • 2.4 MB</p>
                    </div>
                  )}
                  <p className="text-xs text-neutral-400">Accepted: JPG, PNG • Min 3000×3000px • Square ratio</p>
                </div>
              </div>
            </Field>
          </div>

          {/* Credits & Splits */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-semibold text-neutral-900">Credits & Splits</h3>
                <p className="text-xs text-neutral-500">Define roles and revenue splits for each contributor. Splits must total 100%.</p>
              </div>
              <button
                onClick={addCredit}
                className="flex items-center gap-1 text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors"
              >
                <Plus size={14} /> Add Credit
              </button>
            </div>

            <div className="space-y-2 max-h-[240px] overflow-y-auto pr-1">
              {credits.map((credit, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 rounded-lg bg-neutral-50 border border-neutral-100">
                  <Select
                    value={credit.role}
                    onChange={e => updateCredit(idx, 'role', e.target.value)}
                    className="w-36 bg-white"
                  >
                    <option value="">Role</option>
                    {CREDIT_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                  </Select>
                  <Input
                    value={credit.name}
                    onChange={e => updateCredit(idx, 'name', e.target.value)}
                    placeholder="Contributor name"
                    className="flex-1 bg-white"
                  />
                  <div className="flex items-center gap-1 w-24">
                    <Input
                      value={credit.splitPct}
                      onChange={e => updateCredit(idx, 'splitPct', e.target.value)}
                      placeholder="0"
                      className="w-16 bg-white text-right"
                    />
                    <span className="text-xs text-neutral-400">%</span>
                  </div>
                  {credits.length > 1 && (
                    <button
                      onClick={() => removeCredit(idx)}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-neutral-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Split summary */}
            <div className="flex items-center gap-3 mt-2">
              <span className="text-xs text-neutral-500">Total splits:</span>
              <Badge
                color={Math.abs(credits.reduce((s, c) => s + (parseFloat(c.splitPct) || 0), 0) - 100) < 0.5 ? 'green' : 'amber'}
                size="sm"
              >
                {credits.reduce((s, c) => s + (parseFloat(c.splitPct) || 0), 0)}%
              </Badge>
              {Math.abs(credits.reduce((s, c) => s + (parseFloat(c.splitPct) || 0), 0) - 100) < 0.5 ? (
                <span className="text-xs text-green-600">Balanced</span>
              ) : (
                <span className="text-xs text-amber-600">Must total 100%</span>
              )}
            </div>
          </div>

          {/* AI Disclosure (Section 18.2) */}
          <div className="mb-6">
            <div className={`p-5 rounded-xl border-2 transition-colors ${
              isAiAssisted
                ? 'bg-purple-50 border-purple-300'
                : 'bg-neutral-50 border-neutral-200'
            }`}>
              <div className="flex items-center gap-3 mb-3">
                <Cpu size={20} className={isAiAssisted ? 'text-purple-600' : 'text-neutral-400'} />
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-neutral-900">AI Disclosure (Section 18.2)</h3>
                  <p className="text-xs text-neutral-500">
                    Required per IA Section 18.2 — flag this release if AI tools were used in creation, composition, or production.
                  </p>
                </div>
                <button
                  onClick={() => { setIsAiAssisted(!isAiAssisted); if (!isAiAssisted) setAiDescription(''); }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isAiAssisted
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'bg-neutral-200 text-neutral-600 hover:bg-neutral-300'
                  }`}
                >
                  {isAiAssisted ? 'AI Assisted ✓' : 'Not AI Assisted'}
                </button>
              </div>

              {isAiAssisted && (
                <Field label="AI Usage Description" required hint="Describe which AI tools were used and how (required when isAiAssisted=true)">
                  <Textarea
                    value={aiDescription}
                    onChange={e => setAiDescription(e.target.value)}
                    placeholder="e.g., 'Suno AI was used to generate the melody for Track 3; lyrics were human-written; AI-assisted mixing on Tracks 1–5'"
                    className="bg-white"
                    rows={3}
                  />
                </Field>
              )}
            </div>
          </div>

          {/* Internal notes */}
          <div className="mb-6">
            <Field label="Internal Notes" hint="Not shown to fans — for internal tracking">
              <Textarea
                value={metadata.notes}
                onChange={e => setMetadata({ ...metadata, notes: e.target.value })}
                placeholder="Internal notes about this release…"
                className="bg-white"
                rows={2}
              />
            </Field>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
            <Button variant="secondary" onClick={goBack}>
              <ChevronLeft size={16} /> Tracks
            </Button>
            <Button variant="primary" onClick={goNext}>
              Continue to Platforms <ChevronRight size={16} />
            </Button>
          </div>
        </Card>
      )}

      {/* ══════════════════════════════════════════════
          STEP 4: PLATFORM TARGETING
          ══════════════════════════════════════════════ */}
      {currentStep === 4 && (
        <Card className="p-6">
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-neutral-900">Platform Targeting & Delivery</h2>
            <p className="text-sm text-neutral-500 mt-1">
              This step hands off to the existing Distribution submission flow (IA Section 4.4 & Section 8.4 TooLost V1 adapter). One validation engine, one delivery status source — referenced from Discography (Section 12).
            </p>
          </div>

          {/* DSP Selection */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-semibold text-neutral-900">Select Target DSPs</h3>
                <p className="text-xs text-neutral-500">Choose the digital service providers for this release&apos;s delivery.</p>
              </div>
              <Badge color="teal" size="sm">{selectedDSPs.length} selected</Badge>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {DSP_PLATFORMS.map(dsp => {
                const isSelected = selectedDSPs.includes(dsp.id);
                const isTooLost = dsp.id === 'toolost_v1';
                return (
                  <button
                    key={dsp.id}
                    onClick={() => toggleDSP(dsp.id)}
                    className={`flex flex-col items-start gap-2 p-4 rounded-xl border-2 transition-all ${
                      isTooLost && isSelected
                        ? 'bg-teal-900 text-white border-teal-700 shadow-md'
                        : isTooLost && !isSelected
                        ? 'bg-teal-50 text-teal-700 border-teal-200 hover:border-teal-400'
                        : isSelected
                        ? 'bg-neutral-900 text-white border-neutral-900 shadow-md'
                        : 'bg-white text-neutral-600 border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50'
                    }`}
                  >
                    <div className="flex items-center gap-2 w-full">
                      {isSelected ? <CheckCircle2 size={16} /> : <Circle size={16} />}
                      <span className="text-sm font-semibold">{dsp.name}</span>
                      {isTooLost && <Badge color={isSelected ? 'teal' : 'gray'} size="sm">V1</Badge>}
                    </div>
                    <div className="flex items-center gap-2 text-xs w-full">
                      <Badge color={isSelected ? 'gray' : 'gray'} size="sm">{dsp.category}</Badge>
                      <span className={isSelected ? 'text-white/50' : 'text-neutral-400'}>{dsp.deliveryFormat}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* TooLost V1 integration note */}
          {selectedDSPs.includes('toolost_v1') && (
            <div className="p-4 rounded-xl bg-teal-50 border border-teal-200 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <ExternalLink size={16} className="text-teal-600" />
                <span className="text-sm font-semibold text-teal-800">TooLost V1 Partner Integration (Section 8.4)</span>
              </div>
              <p className="text-xs text-teal-700">
                Direct integration via TooLost API v1 — catalog sync + delivery pipeline. Delivery uses DDEX ERN/XML format with API Key authentication. This Discography wizard hands off to the existing Distribution submission flow at this step.
              </p>
            </div>
          )}

          {/* Territory Selection */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-semibold text-neutral-900">Territory Selection</h3>
                <p className="text-xs text-neutral-500">Choose where this release will be available. Worldwide overrides individual selections.</p>
              </div>
              <Badge color="green" size="sm">
                <Globe size={12} /> {selectedTerritories.includes('WW') ? 'Worldwide' : selectedTerritories.join(', ')}
              </Badge>
            </div>

            <div className="flex flex-wrap gap-3">
              {TERRITORY_REGIONS.map(terr => {
                const isSelected = selectedTerritories.includes(terr.id);
                const isWW = terr.id === 'WW';
                return (
                  <button
                    key={terr.id}
                    onClick={() => toggleTerritory(terr.id)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-xl border transition-all ${
                      isWW && isSelected
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                        : isSelected
                        ? 'bg-neutral-900 text-white border-neutral-900 shadow-sm'
                        : 'bg-white text-neutral-600 border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50'
                    }`}
                  >
                    <Globe size={16} />
                    <span className="text-sm font-medium">{terr.label}</span>
                    <span className={`text-xs ${isSelected ? (isWW ? 'text-white/70' : 'text-white/70') : 'text-neutral-400'}`}>{terr.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Delivery Mode */}
          <div className="mb-6">
            <div className="mb-3">
              <h3 className="text-sm font-semibold text-neutral-900">Delivery Mode</h3>
              <p className="text-xs text-neutral-500">Choose how this release is processed through the delivery pipeline.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {DELIVERY_MODES.map(mode => {
                const isSelected = deliveryMode === mode.id;
                return (
                  <button
                    key={mode.id}
                    onClick={() => setDeliveryMode(mode.id)}
                    className={`flex flex-col items-start gap-2 p-4 rounded-xl border-2 transition-all ${
                      isSelected
                        ? 'bg-neutral-900 text-white border-neutral-900 shadow-md'
                        : 'bg-white text-neutral-600 border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {mode.id === 'standard' && <Send size={16} />}
                      {mode.id === 'express' && <Zap size={16} />}
                      {mode.id === 'hold' && <Shield size={16} />}
                      <span className="text-sm font-semibold">{mode.label}</span>
                    </div>
                    <span className={`text-xs leading-tight ${isSelected ? 'text-white/70' : 'text-neutral-400'}`}>{mode.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Platform targeting summary */}
          <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-100 mb-4">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <Send size={16} className="text-neutral-400" />
                <span className="text-sm font-medium text-neutral-700">Delivery Summary</span>
              </div>
              <Badge color="teal" size="sm">{selectedDSPs.length} DSPs</Badge>
              <Badge color="green" size="sm">
                <Globe size={12} />
                {selectedTerritories.includes('WW') ? 'Worldwide' : selectedTerritories.join(', ')}
              </Badge>
              <Badge color="gray" size="sm">
                {DELIVERY_MODES.find(m => m.id === deliveryMode)?.label}
              </Badge>
              {selectedDSPs.includes('toolost_v1') && (
                <Badge color="teal" size="sm">TooLost V1 ✓</Badge>
              )}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
            <Button variant="secondary" onClick={goBack}>
              <ChevronLeft size={16} /> Metadata
            </Button>
            <Button variant="primary" onClick={goNext} disabled={selectedDSPs.length === 0}>
              Continue to Song Links <ChevronRight size={16} />
            </Button>
          </div>
        </Card>
      )}

      {/* ══════════════════════════════════════════════
          STEP 5: SONG LINKS
          ══════════════════════════════════════════════ */}
      {currentStep === 5 && (
        <Card className="p-6">
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-neutral-900">Song Links & Pre-Save</h2>
            <p className="text-sm text-neutral-500 mt-1">
              Add pre-save links, pre-order links, social media announcement links, and configure your smart link (song.link / odesli) for fan discovery.
            </p>
          </div>

          {/* Pre-Save & Pre-Order Links */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-semibold text-neutral-900">Pre-Save & Pre-Order Links</h3>
                <p className="text-xs text-neutral-500">Spotify pre-save, Apple Music pre-order, and other DSP early-access links.</p>
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" size="sm" onClick={() => addSongLink('pre-save')}>
                  <Plus size={14} /> Pre-Save
                </Button>
                <Button variant="secondary" size="sm" onClick={() => addSongLink('pre-order')}>
                  <Plus size={14} /> Pre-Order
                </Button>
              </div>
            </div>

            {songLinks.filter(l => l.type === 'pre-save' || l.type === 'pre-order').length === 0 ? (
              <div className="p-8 rounded-xl bg-neutral-50 border border-neutral-100 text-center">
                <Link2 size={24} className="text-neutral-300 mx-auto mb-2" />
                <p className="text-sm text-neutral-500">No pre-save or pre-order links added yet</p>
                <p className="text-xs text-neutral-400">Click "Pre-Save" or "Pre-Order" above to add links</p>
              </div>
            ) : (
              <div className="space-y-2">
                {songLinks.filter(l => l.type === 'pre-save' || l.type === 'pre-order').map((link, idx) => {
                  const realIdx = songLinks.indexOf(link);
                  return (
                    <div key={realIdx} className="flex items-center gap-3 p-3 rounded-lg bg-neutral-50 border border-neutral-100">
                      <Badge color={link.type === 'pre-save' ? 'teal' : 'blue'} size="sm">
                        {link.type === 'pre-save' ? 'Pre-Save' : 'Pre-Order'}
                      </Badge>
                      <Select
                        value={link.platform}
                        onChange={e => updateSongLink(realIdx, 'platform', e.target.value)}
                        className="w-36 bg-white"
                      >
                        <option value="">Platform</option>
                        {SONG_LINK_PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
                      </Select>
                      <Input
                        value={link.url}
                        onChange={e => updateSongLink(realIdx, 'url', e.target.value)}
                        placeholder="https://open.spotify.com/pre-save/..."
                        className="flex-1 bg-white"
                      />
                      <button
                        onClick={() => removeSongLink(realIdx)}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-neutral-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Social Media Announcement Links */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-semibold text-neutral-900">Social Media Announcement Links</h3>
                <p className="text-xs text-neutral-500">Links to your social posts announcing this release.</p>
              </div>
              <Button variant="secondary" size="sm" onClick={addSocialAnnouncement}>
                <Plus size={14} /> Add Announcement
              </Button>
            </div>

            {socialAnnouncements.length === 0 ? (
              <div className="p-8 rounded-xl bg-neutral-50 border border-neutral-100 text-center">
                <Megaphone size={24} className="text-neutral-300 mx-auto mb-2" />
                <p className="text-sm text-neutral-500">No announcement links added yet</p>
                <p className="text-xs text-neutral-400">Click "Add Announcement" to link your social posts</p>
              </div>
            ) : (
              <div className="space-y-2">
                {socialAnnouncements.map((ann, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 rounded-lg bg-neutral-50 border border-neutral-100">
                    <Megaphone size={14} className="text-neutral-400" />
                    <Select
                      value={ann.platform}
                      onChange={e => updateSocialAnnouncement(idx, 'platform', e.target.value)}
                      className="w-36 bg-white"
                    >
                      <option value="">Platform</option>
                      {SOCIAL_PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
                    </Select>
                    <Input
                      value={ann.url}
                      onChange={e => updateSocialAnnouncement(idx, 'url', e.target.value)}
                      placeholder="https://instagram.com/p/..."
                      className="flex-1 bg-white"
                    />
                    <button
                      onClick={() => removeSocialAnnouncement(idx)}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-neutral-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Smart Link (Odesli / song.link) */}
          <div className="mb-6">
            <div className="mb-3">
              <h3 className="text-sm font-semibold text-neutral-900">Smart Link (Odesli / song.link)</h3>
              <p className="text-xs text-neutral-500">
                Auto-generated multi-platform link that shows fans all available streaming/purchase options in one page.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-teal-50 border border-teal-200">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-teal-600 flex items-center justify-center">
                  <Share2 size={20} className="text-white" />
                </div>
                <div className="flex-1">
                  <Field label="Odesli / song.link URL">
                    <Input
                      value={smartLinkUrl}
                      onChange={e => setSmartLinkUrl(e.target.value)}
                      placeholder="https://song.link/abc123 or https://odesli.co/abc123"
                      className="bg-white"
                    />
                  </Field>
                </div>
              </div>
              {smartLinkUrl && (
                <div className="flex items-center gap-2 mt-3">
                  <Badge color="teal" size="sm">
                    <Share2 size={12} /> Smart link configured
                  </Badge>
                  <a href={smartLinkUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-teal-600 hover:text-teal-800 flex items-center gap-1">
                    Preview <ExternalLink size={12} />
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* All song links (non pre-save/pre-order) */}
          {songLinks.filter(l => l.type !== 'pre-save' && l.type !== 'pre-order').length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-neutral-900 mb-3">Additional Streaming Links</h3>
              <div className="space-y-2">
                {songLinks.filter(l => l.type !== 'pre-save' && l.type !== 'pre-order').map((link, idx) => {
                  const realIdx = songLinks.indexOf(link);
                  return (
                    <div key={realIdx} className="flex items-center gap-3 p-3 rounded-lg bg-neutral-50 border border-neutral-100">
                      <Badge color="gray" size="sm">Streaming</Badge>
                      <Select
                        value={link.platform}
                        onChange={e => updateSongLink(realIdx, 'platform', e.target.value)}
                        className="w-36 bg-white"
                      >
                        <option value="">Platform</option>
                        {SONG_LINK_PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
                      </Select>
                      <Input
                        value={link.url}
                        onChange={e => updateSongLink(realIdx, 'url', e.target.value)}
                        placeholder="https://..."
                        className="flex-1 bg-white"
                      />
                      <button onClick={() => removeSongLink(realIdx)} className="p-1.5 rounded-lg hover:bg-red-50 text-neutral-400 hover:text-red-600 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Links summary */}
          <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-100 mb-4">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <Link2 size={16} className="text-neutral-400" />
                <span className="text-sm font-medium text-neutral-700">Links Summary</span>
              </div>
              <Badge color="teal" size="sm">
                {songLinks.filter(l => l.type === 'pre-save').length} pre-saves
              </Badge>
              <Badge color="blue" size="sm">
                {songLinks.filter(l => l.type === 'pre-order').length} pre-orders
              </Badge>
              <Badge color="gray" size="sm">
                {socialAnnouncements.length} announcements
              </Badge>
              {smartLinkUrl && (
                <Badge color="teal" size="sm">
                  <Share2 size={12} /> Smart link ✓
                </Badge>
              )}
            </div>
          </div>

          {/* Navigation + Submit */}
          <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
            <Button variant="secondary" onClick={goBack}>
              <ChevronLeft size={16} /> Platform Targeting
            </Button>
            <div className="flex items-center gap-3">
              {/* Submit for Validation (Section 9) */}
              <Button variant="primary" onClick={submitForValidation} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                <Shield size={16} /> Submit for Validation
              </Button>
            </div>
          </div>

          {/* Section 9 reference */}
          <div className="mt-4 p-4 rounded-xl bg-emerald-50 border border-emerald-200">
            <div className="flex items-center gap-2 mb-2">
              <Shield size={16} className="text-emerald-600" />
              <span className="text-sm font-semibold text-emerald-800">Section 9 Validation Engine</span>
            </div>
            <p className="text-xs text-emerald-700">
              This release will be submitted to the Validation Engine (Section 9) for QA checks including DDEX schema validation, metadata completeness, artwork specs, audio format compliance, copyright line verification, and territory rule compliance. The Distribution&apos;s existing submission flow (Section 4.4) handles delivery — one validation engine, one delivery status source, referenced from two places in the sidebar.
            </p>
            <div className="flex items-center gap-2 mt-2">
              <Badge color="green" size="sm">25 validation checks</Badge>
              <Badge color="gray" size="sm">DDEX ERN/XML</Badge>
              <Badge color="teal" size="sm">TooLost V1 pipeline</Badge>
            </div>
          </div>
        </Card>
      )}

      {/* ── Sidebar reference note ── */}
      <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-100">
        <div className="flex items-center gap-2 mb-1">
          <Info size={14} className="text-neutral-400" />
          <span className="text-xs font-medium text-neutral-600">IA Section 12 — Discography Publishing Flow</span>
        </div>
        <p className="text-xs text-neutral-400">
          This wizard matches the pattern specified for Distribution&apos;s New Release Submission (Section 4.4). Platform targeting and delivery status reference the TooLost adapter (Section 8.4). At Step 4, this flow hands off to the existing submission pipeline — one validation engine, one delivery status source.
        </p>
      </div>
    </div>
  );
}

export default AdminNewReleaseWizard;
