'use client';

import { useState } from 'react';
import { useRouter } from '@/lib/router';
import { formatDateTime, timeAgo } from '@/lib/format';
import { Card, StatCard } from '@/components/ui/Card';
import { Badge, StatusBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { PageHeader } from '@/components/layout/PageHeader';
import { EmptyState } from '@/components/ui/States';
import { Field, Input, Textarea } from '@/components/ui/Form';
import {
  MessageSquare, Send, ChevronDown, ChevronUp, Search,
  User, Clock, ArrowUpRight, Paperclip, CheckCircle2
} from 'lucide-react';

// ─── Mock Data ────────────────────────────────────────────────────────────────

interface MessageThread {
  id: string;
  recipient: string;
  recipient_org: string;
  subject: string;
  related_deal_id: string | null;
  related_request_id: string | null;
  unread_count: number;
  last_message_at: string;
  status: 'active' | 'resolved' | 'archived';
  messages: ThreadMessage[];
}

interface ThreadMessage {
  id: string;
  sender: string;
  sender_role: 'sync_agent' | 'licensee' | 'legal' | 'operations';
  content: string;
  sent_at: string;
  has_attachment: boolean;
  attachment_name: string | null;
}

const MOCK_THREADS: MessageThread[] = [
  {
    id: 'thread-001',
    recipient: 'Sarah Chen',
    recipient_org: 'Warner Bros. Pictures',
    subject: 'Midnight Skyline — Film Sync Negotiation',
    related_deal_id: 'deal-001',
    related_request_id: null,
    unread_count: 1,
    last_message_at: '2026-02-28T14:30:00Z',
    status: 'active',
    messages: [
      {
        id: 'msg-001-1',
        sender: 'Sarah Chen',
        sender_role: 'licensee',
        content: 'Hi, we\'d like to discuss the sync license for "Midnight Skyline" for our upcoming feature film "Neon Horizons". The scene is a pivotal moment — about 45 seconds of background use in a driving montage. Can we explore options for worldwide rights?',
        sent_at: '2025-11-02T10:00:00Z',
        has_attachment: false,
        attachment_name: null,
      },
      {
        id: 'msg-001-2',
        sender: 'Sync Agent',
        sender_role: 'sync_agent',
        content: 'Thanks for reaching out! "Midnight Skyline" is one-stop clearance, so we can move quickly. For worldwide film sync at 45 seconds background use, our starting fee is $7,500 for a 5-year term. Let me know if that works or if you\'d like to discuss alternative terms.',
        sent_at: '2025-11-08T16:00:00Z',
        has_attachment: true,
        attachment_name: 'Midnight_Skyline_License_Proposal.pdf',
      },
      {
        id: 'msg-001-3',
        sender: 'Sarah Chen',
        sender_role: 'licensee',
        content: 'We appreciate the proposal. Our budget for this spot is tighter — could we explore $5,000 for a 3-year term? We\'re also considering a 2-year option if the fee can come down further. Happy to discuss!',
        sent_at: '2025-11-15T09:00:00Z',
        has_attachment: false,
        attachment_name: null,
      },
      {
        id: 'msg-001-4',
        sender: 'Sync Agent',
        sender_role: 'sync_agent',
        content: 'We can\'t go below $6,500 given the worldwide scope and 5-year term. However, if we restrict territory to NA + EU, we could consider a reduction. Would $6,500 for 5 years (NA+EU territory) work for you?',
        sent_at: '2025-12-01T11:00:00Z',
        has_attachment: false,
        attachment_name: null,
      },
      {
        id: 'msg-001-5',
        sender: 'Sarah Chen',
        sender_role: 'licensee',
        content: 'That\'s getting closer to our target. Let me run this past our production team and legal department. I should have a response by next week. Thanks for being flexible on the territory scope!',
        sent_at: '2025-12-28T14:30:00Z',
        has_attachment: true,
        attachment_name: 'Neon_Horizons_Scene_Ref.mp4',
      },
    ],
  },
  {
    id: 'thread-002',
    recipient: 'James Rodriguez',
    recipient_org: 'HBO Productions',
    subject: 'Electric Pulse — TV Series Sync Request',
    related_deal_id: 'deal-002',
    related_request_id: null,
    unread_count: 0,
    last_message_at: '2025-12-15T12:00:00Z',
    status: 'active',
    messages: [
      {
        id: 'msg-002-1',
        sender: 'James Rodriguez',
        sender_role: 'licensee',
        content: 'We\'re looking for a track for episode 4 of "City Lights" — a high-energy club scene. "Electric Pulse" fits perfectly. Can we license for NA TV broadcast, 3-year term, background use only?',
        sent_at: '2025-12-10T08:00:00Z',
        has_attachment: false,
        attachment_name: null,
      },
      {
        id: 'msg-002-2',
        sender: 'Sync Agent',
        sender_role: 'sync_agent',
        content: 'Great choice! "Electric Pulse" is one-stop clearance via Flux Music Group. For NA TV background use, 3-year term, we\'re proposing $3,200. I\'ve attached the initial proposal document.',
        sent_at: '2025-12-15T12:00:00Z',
        has_attachment: true,
        attachment_name: 'Electric_Pulse_TV_Proposal.pdf',
      },
    ],
  },
  {
    id: 'thread-003',
    recipient: 'Emily Watson',
    recipient_org: 'Nike Global Marketing',
    subject: 'Golden Horizon — Global Campaign Deal Completed',
    related_deal_id: 'deal-003',
    related_request_id: null,
    unread_count: 0,
    last_message_at: '2025-11-20T16:00:00Z',
    status: 'resolved',
    messages: [
      {
        id: 'msg-003-1',
        sender: 'Emily Watson',
        sender_role: 'licensee',
        content: 'We\'d love to use "Golden Horizon" for our "Run Beyond" global campaign — 30-second TV spot and digital ads. Worldwide, 2-year term. What\'s your fee structure?',
        sent_at: '2025-10-15T09:00:00Z',
        has_attachment: false,
        attachment_name: null,
      },
      {
        id: 'msg-003-2',
        sender: 'Sync Agent',
        sender_role: 'sync_agent',
        content: 'For worldwide ad campaign usage across TV + digital, 2-year term, our fee is $5,000. The track has partial clearance — publisher side pending for some co-writing shares, but we can fast-track that for a deal of this size.',
        sent_at: '2025-10-20T14:00:00Z',
        has_attachment: true,
        attachment_name: 'Golden_Horizon_Clearance_Status.pdf',
      },
      {
        id: 'msg-003-3',
        sender: 'Emily Watson',
        sender_role: 'licensee',
        content: 'Could we negotiate a 1-year term at $4,000? Our campaigns typically run 9-12 months.',
        sent_at: '2025-10-28T10:00:00Z',
        has_attachment: false,
        attachment_name: null,
      },
      {
        id: 'msg-003-4',
        sender: 'Sync Agent',
        sender_role: 'sync_agent',
        content: 'After consulting with the rights holders, we can maintain $5,000 for the 2-year worldwide term. This gives you flexibility for extended campaign runs. Deal agreement reached — I\'ll prepare the contract.',
        sent_at: '2025-11-05T15:00:00Z',
        has_attachment: false,
        attachment_name: null,
      },
      {
        id: 'msg-003-5',
        sender: 'Legal Team',
        sender_role: 'legal',
        content: 'Contract executed and countersigned by both parties. License assets (stems, master) will be delivered within 5 business days.',
        sent_at: '2025-11-20T16:00:00Z',
        has_attachment: true,
        attachment_name: 'Golden_Horizon_License_Agreement.pdf',
      },
    ],
  },
  {
    id: 'thread-004',
    recipient: 'Michael Torres',
    recipient_org: 'Ubisoft Entertainment',
    subject: 'Neon Dreams — Game OST License Completed',
    related_deal_id: 'deal-004',
    related_request_id: null,
    unread_count: 0,
    last_message_at: '2025-09-30T10:00:00Z',
    status: 'resolved',
    messages: [
      {
        id: 'msg-004-1',
        sender: 'Michael Torres',
        sender_role: 'licensee',
        content: 'Ubisoft is producing "Cyber Run 2" and we\'d like "Neon Dreams" as an in-game soundtrack track. We need perpetual worldwide game sync rights. What\'s your pricing?',
        sent_at: '2025-08-01T07:00:00Z',
        has_attachment: false,
        attachment_name: null,
      },
      {
        id: 'msg-004-2',
        sender: 'Sync Agent',
        sender_role: 'sync_agent',
        content: 'For perpetual worldwide game sync, our fee is $4,500. Since this is a game (ongoing sales model vs one-time broadcast), perpetual rights are standard. All assets will be provided in required formats.',
        sent_at: '2025-08-10T09:00:00Z',
        has_attachment: true,
        attachment_name: 'Neon_Dreams_Game_Proposal.pdf',
      },
      {
        id: 'msg-004-3',
        sender: 'Michael Torres',
        sender_role: 'licensee',
        content: 'Terms accepted. Please proceed with contract preparation and asset delivery.',
        sent_at: '2025-08-18T11:00:00Z',
        has_attachment: false,
        attachment_name: null,
      },
      {
        id: 'msg-004-4',
        sender: 'Operations',
        sender_role: 'operations',
        content: 'All stems and master files have been delivered in FLAC and WAV formats. Deal marked as completed. Thank you for a smooth transaction!',
        sent_at: '2025-09-30T10:00:00Z',
        has_attachment: true,
        attachment_name: 'Neon_Dreams_Asset_Pack.zip',
      },
    ],
  },
  {
    id: 'thread-005',
    recipient: 'Lisa Park',
    recipient_org: 'Paramount Pictures',
    subject: 'Ocean Breeze — Trailer Sync Counter Offer',
    related_deal_id: 'deal-005',
    related_request_id: null,
    unread_count: 2,
    last_message_at: '2025-12-20T09:00:00Z',
    status: 'active',
    messages: [
      {
        id: 'msg-005-1',
        sender: 'Lisa Park',
        sender_role: 'licensee',
        content: 'Paramount is producing a theatrical trailer for "Deep Blue" and "Ocean Breeze" would be perfect for the opening sequence. We need NA trailer rights for 1 year.',
        sent_at: '2025-12-05T11:00:00Z',
        has_attachment: false,
        attachment_name: null,
      },
      {
        id: 'msg-005-2',
        sender: 'Sync Agent',
        sender_role: 'sync_agent',
        content: 'For NA theatrical trailer, 1-year term, our fee is $2,000. This covers trailer placements across theatrical, digital, and broadcast channels.',
        sent_at: '2025-12-10T14:00:00Z',
        has_attachment: true,
        attachment_name: 'Ocean_Breeze_Trailer_Proposal.pdf',
      },
      {
        id: 'msg-005-3',
        sender: 'Lisa Park',
        sender_role: 'licensee',
        content: 'Our trailer budgets are lean this quarter. Could we work with $1,200 for a 6-month term? We\'re only using it in theatrical channels, not broadcast.',
        sent_at: '2025-12-20T09:00:00Z',
        has_attachment: false,
        attachment_name: null,
      },
    ],
  },
  {
    id: 'thread-006',
    recipient: 'Alex Kim',
    recipient_org: 'Amazon Studios',
    subject: 'Fading Light — Series Opening Theme Discussion',
    related_deal_id: 'deal-006',
    related_request_id: null,
    unread_count: 1,
    last_message_at: '2026-01-02T08:00:00Z',
    status: 'active',
    messages: [
      {
        id: 'msg-006-1',
        sender: 'Alex Kim',
        sender_role: 'licensee',
        content: 'Amazon is developing "Last Signal" and we\'re considering "Fading Light" as the opening theme — featured use, worldwide, 3-year term. This would be prominent placement with credits.',
        sent_at: '2025-12-18T13:00:00Z',
        has_attachment: false,
        attachment_name: null,
      },
      {
        id: 'msg-006-2',
        sender: 'Sync Agent',
        sender_role: 'sync_agent',
        content: 'Featured opening theme placement is a premium use case. For worldwide, 3-year TV series term, we\'re proposing $2,800. This accounts for the featured (vs background) placement and credit requirement.',
        sent_at: '2025-12-22T10:00:00Z',
        has_attachment: true,
        attachment_name: 'Fading_Light_Featured_Theme_Proposal.pdf',
      },
      {
        id: 'msg-006-3',
        sender: 'Alex Kim',
        sender_role: 'licensee',
        content: 'We\'re reviewing the terms. Our legal team needs to add a featured-use clause specifying credit placement (main title sequence). Can you send the contract template with those provisions?',
        sent_at: '2026-01-02T08:00:00Z',
        has_attachment: false,
        attachment_name: null,
      },
    ],
  },
];

const SENDER_ROLE_COLORS: Record<string, string> = {
  sync_agent: 'bg-teal-100 text-teal-700',
  licensee: 'bg-purple-100 text-purple-700',
  legal: 'bg-amber-100 text-amber-700',
  operations: 'bg-green-100 text-green-700',
};

// ─── Page Component ───────────────────────────────────────────────────────────

export function SyncMessagesPage() {
  const { navigate } = useRouter();
  const [selectedThread, setSelectedThread] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [replyText, setReplyText] = useState('');

  const totalUnread = MOCK_THREADS.reduce((s, t) => s + t.unread_count, 0);
  const activeThreads = MOCK_THREADS.filter(t => t.status === 'active').length;
  const resolvedThreads = MOCK_THREADS.filter(t => t.status === 'resolved').length;

  const filteredThreads = searchQuery
    ? MOCK_THREADS.filter(t => {
        const q = searchQuery.toLowerCase();
        return t.subject.toLowerCase().includes(q) || t.recipient.toLowerCase().includes(q) || t.recipient_org.toLowerCase().includes(q);
      })
    : MOCK_THREADS;

  const activeThread = selectedThread ? MOCK_THREADS.find(t => t.id === selectedThread) : null;

  return (
    <div>
      <PageHeader
        title="Messages"
        description="Communication hub for sync licensing negotiations, deal discussions, and licensee correspondence."
        actions={
          <Button variant="primary" size="sm"><MessageSquare size={14} /> New Thread</Button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard label="Unread Messages" value={totalUnread} icon={<MessageSquare size={28} />} trend="Requires attention" />
        <StatCard label="Active Threads" value={activeThreads} icon={<Clock size={28} />} />
        <StatCard label="Resolved" value={resolvedThreads} icon={<CheckCircle2 size={28} />} />
      </div>

      {/* Two-column layout: thread list + detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Thread list */}
        <div className="lg:col-span-4">
          {/* Search */}
          <div className="relative mb-3">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Search threads..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-neutral-200 rounded-lg focus:outline-none focus:border-neutral-400"
            />
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {filteredThreads.map(thread => {
              const isSelected = selectedThread === thread.id;
              const lastMsg = thread.messages[thread.messages.length - 1];
              return (
                <Card
                  key={thread.id}
                  className={`p-4 cursor-pointer transition-all ${isSelected ? 'ring-2 ring-neutral-900' : 'hover:shadow-md'}`}
                  onClick={() => setSelectedThread(thread.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                        thread.unread_count > 0 ? 'bg-teal-100 text-teal-700' : 'bg-neutral-100 text-neutral-600'
                      }`}>
                        {thread.recipient.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-neutral-900 truncate">{thread.recipient}</p>
                        <p className="text-xs text-neutral-500 truncate">{thread.recipient_org}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {thread.unread_count > 0 && (
                        <span className="w-5 h-5 rounded-full bg-teal-500 text-white text-xs font-bold flex items-center justify-center">
                          {thread.unread_count}
                        </span>
                      )}
                      <Badge color={thread.status === 'active' ? 'green' : thread.status === 'resolved' ? 'gray' : 'amber'} size="sm">
                        {thread.status}
                      </Badge>
                    </div>
                  </div>

                  <p className="text-sm font-medium text-neutral-900 truncate">{thread.subject}</p>
                  <p className="text-xs text-neutral-500 truncate mt-0.5">
                    {lastMsg.sender}: {lastMsg.content.substring(0, 80)}…
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs text-neutral-400">{timeAgo(thread.last_message_at)}</p>
                    {thread.related_deal_id && (
                      <Badge color="gray" size="sm">Deal: {thread.related_deal_id}</Badge>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Thread detail */}
        <div className="lg:col-span-8">
          {activeThread ? (
            <Card className="p-5">
              {/* Thread header */}
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-neutral-200">
                <div>
                  <h3 className="text-sm font-semibold text-neutral-900">{activeThread.subject}</h3>
                  <p className="text-xs text-neutral-500">
                    {activeThread.recipient} at {activeThread.recipient_org} · {activeThread.messages.length} messages
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {activeThread.related_deal_id && (
                    <Button variant="ghost" size="sm" onClick={() => navigate('/sync/deals')}>
                      <ArrowUpRight size={14} /> View Deal
                    </Button>
                  )}
                  <Badge color={activeThread.status === 'active' ? 'green' : activeThread.status === 'resolved' ? 'gray' : 'amber'}>
                    {activeThread.status}
                  </Badge>
                </div>
              </div>

              {/* Messages */}
              <div className="space-y-4 max-h-[400px] overflow-y-auto mb-4">
                {activeThread.messages.map(msg => {
                  const roleColor = SENDER_ROLE_COLORS[msg.sender_role] ?? 'bg-neutral-100 text-neutral-700';
                  const isAgent = msg.sender_role === 'sync_agent';
                  return (
                    <div key={msg.id} className={`flex ${isAgent ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] ${isAgent ? 'bg-neutral-900 text-white rounded-xl rounded-br-sm' : 'bg-white border border-neutral-200 rounded-xl rounded-bl-sm shadow-sm'}`}>
                        {/* Sender header */}
                        <div className={`flex items-center gap-2 px-3 pt-3 pb-1 ${isAgent ? 'text-neutral-300' : 'text-neutral-900'}`}>
                          <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium ${isAgent ? 'bg-neutral-700 text-white' : roleColor}`}>
                            {msg.sender}
                          </span>
                          <span className="text-xs opacity-60">{timeAgo(msg.sent_at)}</span>
                        </div>

                        {/* Message body */}
                        <div className={`px-3 pb-3 text-sm ${isAgent ? 'text-neutral-200' : 'text-neutral-700'}`}>
                          {msg.content}
                        </div>

                        {/* Attachment */}
                        {msg.has_attachment && (
                          <div className={`px-3 pb-2 ${isAgent ? 'text-neutral-300' : 'text-neutral-500'}`}>
                            <div className={`flex items-center gap-2 px-2 py-1 rounded-lg text-xs ${isAgent ? 'bg-neutral-800 text-neutral-300' : 'bg-neutral-100 text-neutral-600'}`}>
                              <Paperclip size={12} /> {msg.attachment_name}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Reply box */}
              {activeThread.status === 'active' && (
                <div className="border-t border-neutral-200 pt-4">
                  <Field label="Reply to this thread">
                    <Textarea
                      placeholder="Type your message..."
                      value={replyText}
                      onChange={e => setReplyText(e.target.value)}
                      rows={3}
                      className="w-full"
                    />
                  </Field>
                  <div className="flex items-center gap-2 mt-2">
                    <Button variant="primary" size="sm" onClick={() => { setReplyText(''); }}>
                      <Send size={14} /> Send Reply
                    </Button>
                    <Button variant="secondary" size="sm"><Paperclip size={14} /> Attach File</Button>
                    <Button variant="ghost" size="sm">Mark Resolved</Button>
                  </div>
                </div>
              )}

              {activeThread.status === 'resolved' && (
                <div className="border-t border-neutral-200 pt-3">
                  <p className="text-sm text-neutral-500 flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-green-500" /> This thread has been resolved. You can still reference it for future communications.
                  </p>
                </div>
              )}
            </Card>
          ) : (
            <Card className="p-8">
              <EmptyState
                icon={<MessageSquare size={32} />}
                title="Select a thread"
                description="Choose a conversation from the left panel to view the message history and reply."
              />
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
