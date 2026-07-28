'use client';

import { useState } from 'react';
import { useProAuth } from '@/lib/auth';
import { useRouter } from '@/lib/router';
import { toast } from '@/components/ui/Toast';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { PageHeader } from '@/components/layout/PageHeader';
import { Field, Input, Select, Textarea } from '@/components/ui/Form';
import { Send, Clock, CheckCircle2, FileText } from 'lucide-react';

export default function LabelCustomWrite() {
  const { portalUser } = useProAuth();
  const { navigate } = useRouter();
  const [form, setForm] = useState({
    brief: '',
    genre: '',
    mood: '',
    tempo: '',
    budget: '',
    deadline: '',
    territory: '',
    media: '',
    referenceLinks: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!portalUser) return null;

  const submit = () => {
    if (!form.brief) { toast('error', 'Project brief is required'); return; }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      toast('success', 'Custom write request submitted!');
    }, 1200);
  };

  if (submitted) {
    return (
      <div>
        <PageHeader title="Custom Write Request" description="Request a custom composition for your project" />
        <Card className="p-8">
          <div className="flex flex-col items-center text-center">
            <CheckCircle2 size={48} className="text-green-500 mb-4" />
            <p className="text-lg font-semibold text-neutral-900">Request Submitted</p>
            <p className="text-sm text-neutral-500 mt-2 max-w-md">Your custom write request has been submitted to the artist team. They will review your brief and get back to you with proposals, timelines, and pricing.</p>
            <div className="flex items-center gap-3 mt-6">
              <Button variant="primary" onClick={() => setSubmitted(false)}>Submit Another</Button>
              <Button variant="secondary" onClick={() => navigate('/pro/dashboard/label/requests')}>View Requests</Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Custom Write Request" description="Request a custom composition tailored to your project's specific needs. The artist team will review and respond with proposals." />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="space-y-5">
              <Field label="Project Brief" required>
                <Textarea value={form.brief} onChange={(e) => setForm({ ...form, brief: e.target.value })} placeholder="Describe the type of music you need — scene description, emotional arc, timing requirements, visual context…" rows={5} />
              </Field>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Genre Preference">
                  <Select value={form.genre} onChange={(e) => setForm({ ...form, genre: e.target.value })} options={[
                    { value: '', label: 'Any genre' }, { value: 'electronic', label: 'Electronic' }, { value: 'hip-hop', label: 'Hip-Hop' }, { value: 'pop', label: 'Pop' }, { value: 'rnb', label: 'R&B' }, { value: 'ambient', label: 'Ambient' }, { value: 'techno', label: 'Techno' }, { value: 'house', label: 'House' }, { value: 'rock', label: 'Rock' }, { value: 'cinematic', label: 'Cinematic/Orchestral' },
                  ]} />
                </Field>
                <Field label="Mood / Energy">
                  <Select value={form.mood} onChange={(e) => setForm({ ...form, mood: e.target.value })} options={[
                    { value: '', label: 'Any mood' }, { value: 'uplifting', label: 'Uplifting / Hopeful' }, { value: 'energetic', label: 'Energetic / Driving' }, { value: 'dark', label: 'Dark / Tense' }, { value: 'dreamy', label: 'Dreamy / Ethereal' }, { value: 'epic', label: 'Epic / Grand' }, { value: 'chill', label: 'Chill / Relaxed' }, { value: 'aggressive', label: 'Aggressive / Intense' },
                  ]} />
                </Field>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Field label="Tempo (BPM)">
                  <Input type="number" value={form.tempo} onChange={(e) => setForm({ ...form, tempo: e.target.value })} placeholder="e.g. 120" />
                </Field>
                <Field label="Budget Range (USD)">
                  <Input value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} placeholder="e.g. $500-$2,000" />
                </Field>
                <Field label="Deadline">
                  <Input type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} />
                </Field>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Territory">
                  <Select value={form.territory} onChange={(e) => setForm({ ...form, territory: e.target.value })} options={[
                    { value: '', label: 'Select territory' }, { value: 'worldwide', label: 'Worldwide' }, { value: 'us', label: 'US Only' }, { value: 'uk_eu', label: 'UK/EU' }, { value: 'na', label: 'North America' },
                  ]} />
                </Field>
                <Field label="Media Type">
                  <Select value={form.media} onChange={(e) => setForm({ ...form, media: e.target.value })} options={[
                    { value: '', label: 'Select media' }, { value: 'film', label: 'Film' }, { value: 'tv', label: 'TV Series' }, { value: 'ad', label: 'Commercial/Ad' }, { value: 'game', label: 'Video Game' }, { value: 'web', label: 'Web/Digital' }, { value: 'podcast', label: 'Podcast' },
                  ]} />
                </Field>
              </div>

              <Field label="Reference Links">
                <Textarea value={form.referenceLinks} onChange={(e) => setForm({ ...form, referenceLinks: e.target.value })} placeholder="Paste links to reference tracks, scenes, or inspiration…" rows={2} />
              </Field>

              <Button variant="primary" className="w-full" onClick={submit} disabled={loading}>
                {loading ? 'Submitting…' : <><Send size={16} /> Submit Custom Write Request</>}
              </Button>
            </div>
          </Card>
        </div>

        {/* Info sidebar */}
        <div className="space-y-4">
          <Card className="p-5">
            <h3 className="font-semibold text-neutral-900 mb-3">How It Works</h3>
            <div className="space-y-3">
              {[
                { step: '1', title: 'Submit Your Brief', desc: 'Describe your project, the scene, and the type of music you need.' },
                { step: '2', title: 'Artist Team Reviews', desc: 'The team evaluates your brief and confirms feasibility, timeline, and budget.' },
                { step: '3', title: 'Composition & Delivery', desc: 'Custom tracks are created, mastered, and delivered with full sync clearance documentation.' },
              ].map(item => (
                <div key={item.step} className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-neutral-900 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">{item.step}</div>
                  <div>
                    <p className="text-sm font-medium text-neutral-900">{item.title}</p>
                    <p className="text-xs text-neutral-500 mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
          <Card className="p-5">
            <h3 className="font-semibold text-neutral-900 mb-3">What You Get</h3>
            <div className="space-y-2">
              {['Full sync clearance (one-stop)', 'Stems & instrumental versions', 'High-quality mastered files', 'License contract & invoice', 'Territory-specific licensing'].map(item => (
                <div key={item} className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-green-500" />
                  <p className="text-sm text-neutral-700">{item}</p>
                </div>
              ))}
            </div>
          </Card>
          <Card className="p-5">
            <h3 className="font-semibold text-neutral-900 mb-3">Typical Timeline</h3>
            <div className="space-y-2">
              {[
                { icon: <Clock size={14} />, label: 'Brief review: 1-3 business days' },
                { icon: <FileText size={14} />, label: 'Composition: 5-10 business days' },
                { icon: <CheckCircle2 size={14} />, label: 'Delivery & clearance: 1-2 days' },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-2 text-sm text-neutral-600">
                  {item.icon} {item.label}
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
