'use client';

import { formatCents, formatDate } from '@/lib/format';
import { Badge } from '@/components/ui/Badge';
import { mockSpendEntries } from '@/lib/mock-data';

export default function AdminSpend() {
  const entries = mockSpendEntries;

  const revenue = entries.filter((e) => e.direction === 'revenue').reduce((s, e) => s + e.amount, 0);
  const expenses = entries.filter((e) => e.direction === 'expense').reduce((s, e) => s + e.amount, 0);

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-white">Spend & Financials</h1><p className="mt-1 text-sm text-white/50">Track revenue, expenses, and financial activity</p></div>
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white/5 border border-white/10 rounded-xl p-5"><p className="text-sm font-medium text-white/50">Revenue</p><p className="mt-2 text-2xl font-semibold text-green-400">{formatCents(revenue)}</p></div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-5"><p className="text-sm font-medium text-white/50">Expenses</p><p className="mt-2 text-2xl font-semibold text-red-400">{formatCents(expenses)}</p></div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-5"><p className="text-sm font-medium text-white/50">Net</p><p className="mt-2 text-2xl font-semibold text-white">{formatCents(revenue - expenses)}</p></div>
      </div>
      <div className="space-y-3">
        {entries.map((e) => (
          <div key={e.id} className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between">
            <div><p className="text-sm font-medium text-white">{e.notes ?? e.category}</p><p className="text-xs text-white/40 mt-0.5">{e.category} · {formatDate(e.occurred_on)}</p></div>
            <div className="text-right"><Badge color={e.direction === 'revenue' ? 'green' : 'red'}>{e.direction}</Badge><p className="text-sm font-semibold text-white mt-1">{formatCents(e.amount)}</p></div>
          </div>
        ))}
      </div>
    </div>
  );
}
