'use client';

import { useState } from 'react';
import { useRouter } from '@/lib/router';
import { useProAuth } from '@/lib/auth';
import { formatDate, formatDateTime } from '@/lib/format';
import { Badge, StatusBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { PageHeader } from '@/components/layout/PageHeader';
import { EmptyState } from '@/components/ui/States';
import { mockPortalNotifications, mockPortalRequests } from '@/lib/mock-data';
import { MessageSquare, Send, ChevronDown, ChevronUp, Clock, FileText, Inbox, Bell } from 'lucide-react';

export default function LabelMessages() {
  const { portalUser } = useProAuth();
  const { navigate } = useRouter();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [tab, setTab] = useState<'notifications' | 'requests'>('notifications');

  if (!portalUser) return null;

  const notifications = mockPortalNotifications;
  const requests = mockPortalRequests.filter(r => r.type === 'sync');

  const unreadCount = notifications.filter(n => !n.read_at).length;

  return (
    <div>
      <PageHeader title="Messages" description="Direct communication with the artist team — notifications, request updates, and deal discussions." actions={<Button variant="primary" size="sm"><Send size={16} /> New Message</Button>} />

      {/* Tab switcher */}
      <div className="flex items-center gap-2 mb-4">
        <Button variant={tab === 'notifications' ? 'primary' : 'secondary'} size="sm" onClick={() => setTab('notifications')}>
          <Bell size={14} /> Notifications ({unreadCount} unread)
        </Button>
        <Button variant={tab === 'requests' ? 'primary' : 'secondary'} size="sm" onClick={() => setTab('requests')}>
          <Inbox size={14} /> Request Updates ({requests.length})
        </Button>
      </div>

      {tab === 'notifications' ? (
        <div className="space-y-3">
          {notifications.length === 0 ? (
            <Card className="p-8">
              <EmptyState title="No notifications" description="You'll receive notifications when sync requests are submitted, approved, or completed." />
            </Card>
          ) : (
            notifications.map(notif => {
              const isExpanded = expandedId === notif.id;
              return (
                <Card key={notif.id} className={`p-4 ${!notif.read_at ? 'border-l-4 border-l-blue-500' : ''}`}>
                  <div className="flex items-center justify-between cursor-pointer" onClick={() => setExpandedId(isExpanded ? null : notif.id)}>
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${notif.type === 'request' ? 'bg-blue-50' : notif.type === 'deal' ? 'bg-green-50' : 'bg-neutral-50'}`}>
                        {notif.type === 'request' ? <FileText size={16} className="text-blue-600" /> : notif.type === 'deal' ? <MessageSquare size={16} className="text-green-600" /> : <Bell size={16} className="text-neutral-500" />}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-neutral-900">{notif.body}</p>
                        <p className="text-xs text-neutral-500 mt-0.5">{formatDate(notif.created_at)} · {notif.related_entity_type ?? 'General'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {!notif.read_at && <Badge color="blue">Unread</Badge>}
                      <button className="text-neutral-400">{isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}</button>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-neutral-200 space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 rounded-lg bg-neutral-50"><p className="text-xs text-neutral-400">Type</p><p className="text-sm text-neutral-900 capitalize">{notif.type}</p></div>
                        <div className="p-3 rounded-lg bg-neutral-50"><p className="text-xs text-neutral-400">Related</p><p className="text-sm text-neutral-900">{notif.related_entity_type ?? '—'} #{notif.related_entity_id?.slice(0, 8) ?? '—'}</p></div>
                      </div>
                      <div className="flex items-center gap-2">
                        {notif.related_entity_type === 'sync_request' && <Button variant="primary" size="sm" onClick={() => navigate('/pro/dashboard/label/requests')}>View Request</Button>}
                        {notif.related_entity_type === 'sync_license' && <Button variant="primary" size="sm" onClick={() => navigate('/pro/dashboard/label/deals')}>View Deal</Button>}
                        <Button variant="secondary" size="sm">Mark as Read</Button>
                      </div>
                    </div>
                  )}
                </Card>
              );
            })
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {requests.length === 0 ? (
            <Card className="p-8">
              <EmptyState title="No request updates" description="Request activity updates will appear here as your sync requests progress through the clearance workflow." />
            </Card>
          ) : (
            requests.map(req => (
              <Card key={req.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center"><FileText size={16} className="text-purple-600" /></div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-neutral-900">{(req.payload as Record<string, unknown>)?.usageType as string ?? 'Sync Request'}</p>
                      <p className="text-xs text-neutral-500">{formatDate(req.created_at)} · Territory: {(req.payload as Record<string, unknown>)?.territory as string ?? '—'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={req.status} />
                    <Button variant="ghost" size="sm" onClick={() => navigate('/pro/dashboard/label/requests')}>View</Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Quick reply section */}
      <Card className="p-5 mt-6">
        <h3 className="font-semibold text-neutral-900 mb-3">Send a Message</h3>
        <textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message to the artist team…"
          className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-300"
          rows={3}
        />
        <div className="flex items-center gap-3 mt-3">
          <Button variant="primary" size="sm"><Send size={14} /> Send Message</Button>
          <Button variant="secondary" size="sm">Attach Document</Button>
        </div>
      </Card>
    </div>
  );
}
