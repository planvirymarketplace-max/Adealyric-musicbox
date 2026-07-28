'use client';

import { Calendar, DollarSign, Users, Disc3, ArrowUpRight } from 'lucide-react';
import { useRouter } from '@/lib/router';
import { Card, StatCard } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/Badge';
import { PageHeader } from '@/components/layout/PageHeader';
import { formatCents, formatDate } from '@/lib/format';
import { mockBookings, mockInquiries, mockOrders, mockReleases } from '@/lib/mock-data';

export default function DashboardPage() {
  const { navigate } = useRouter();

  const revenue = mockOrders.filter((o) => o.status === 'paid').reduce((sum, o) => sum + o.amount_total_cents, 0);
  const upcomingBookings = mockBookings.slice(0, 5);
  const recentInquiries = mockInquiries.slice(0, 5);
  const recentOrders = mockOrders.slice(0, 5);

  return (
    <div>
      <PageHeader title="Dashboard" description="Overview of your music business operations" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Revenue" value={formatCents(revenue)} icon={<DollarSign size={28} />} trend="All time" />
        <StatCard label="Upcoming Bookings" value={mockBookings.length} icon={<Calendar size={28} />} />
        <StatCard label="CRM Contacts" value={6} icon={<Users size={28} />} />
        <StatCard label="Releases" value={mockReleases.length} icon={<Disc3 size={28} />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-neutral-900">Upcoming Bookings</h3>
            <button onClick={() => navigate('/admin/bookings/pipeline')} className="text-sm text-neutral-500 hover:text-neutral-900 flex items-center gap-1">View all <ArrowUpRight size={14} /></button>
          </div>
          {upcomingBookings.length === 0 ? <p className="text-sm text-neutral-400 py-8 text-center">No upcoming bookings</p> : (
            <div className="space-y-3">
              {upcomingBookings.map((b) => (
                <button key={b.id} onClick={() => navigate(`/admin/bookings/${b.id}`)} className="flex items-center justify-between p-3 rounded-lg hover:bg-neutral-50 transition-colors w-full text-left">
                  <div><p className="text-sm font-medium text-neutral-900">{b.event_name}</p><p className="text-xs text-neutral-500">{b.venue_name} · {formatDate(b.event_date)}</p></div>
                  <StatusBadge status={b.status} />
                </button>
              ))}
            </div>
          )}
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-neutral-900">Recent Inquiries</h3>
            <button onClick={() => navigate('/admin/bookings/inquiries')} className="text-sm text-neutral-500 hover:text-neutral-900 flex items-center gap-1">View all <ArrowUpRight size={14} /></button>
          </div>
          {recentInquiries.length === 0 ? <p className="text-sm text-neutral-400 py-8 text-center">No inquiries yet</p> : (
            <div className="space-y-3">
              {recentInquiries.map((inq) => (
                <div key={inq.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-neutral-50 transition-colors">
                  <div><p className="text-sm font-medium text-neutral-900">{inq.contact_name}</p><p className="text-xs text-neutral-500">{inq.event_name ?? 'General inquiry'}</p></div>
                  <StatusBadge status={inq.status} />
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-neutral-900">Recent Orders</h3>
            <button onClick={() => navigate('/admin/shop/orders')} className="text-sm text-neutral-500 hover:text-neutral-900 flex items-center gap-1">View all <ArrowUpRight size={14} /></button>
          </div>
          {recentOrders.length === 0 ? <p className="text-sm text-neutral-400 py-8 text-center">No orders yet</p> : (
            <div className="space-y-3">
              {recentOrders.map((o) => (
                <div key={o.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-neutral-50 transition-colors">
                  <div><p className="text-sm font-medium text-neutral-900">{formatCents(o.amount_total_cents)}</p><p className="text-xs text-neutral-500">{formatDate(o.created_at)}</p></div>
                  <StatusBadge status={o.status} />
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card className="p-5">
          <h3 className="font-semibold text-neutral-900 mb-4">Pipeline Summary</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-neutral-50"><span className="text-sm text-neutral-600">New Inquiries</span><span className="text-sm font-semibold text-neutral-900">{mockInquiries.filter((i) => i.status === 'new').length}</span></div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-neutral-50"><span className="text-sm text-neutral-600">Confirmed Bookings</span><span className="text-sm font-semibold text-neutral-900">{mockBookings.filter((b) => ['confirmed', 'deposit_paid'].includes(b.status)).length}</span></div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-neutral-50"><span className="text-sm text-neutral-600">Paid Orders</span><span className="text-sm font-semibold text-neutral-900">{mockOrders.filter((o) => o.status === 'paid').length}</span></div>
          </div>
        </Card>
      </div>
    </div>
  );
}
