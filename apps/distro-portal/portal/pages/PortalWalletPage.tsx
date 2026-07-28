'use client';

import { useState } from 'react';
import { Wallet, ArrowUpRight, ArrowDownRight, CreditCard, Plus, Clock, DollarSign } from 'lucide-react';
import { formatCents } from '@/lib/format';
import { useCommerceStore } from '@/lib/commerce-store';
import { Button } from '@/components/ui/Button';
import { Card, StatCard } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Field, Input } from '@/components/ui/Form';
import { PageHeader } from '@/components/layout/PageHeader';
import { toast } from '@/components/ui/Toast';

export default function PortalWalletPage() {
  const { wallet, topUpWallet } = useCommerceStore();
  const [topUpOpen, setTopUpOpen] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState('');

  const handleTopUp = () => {
    const amount = parseFloat(topUpAmount);
    if (isNaN(amount) || amount <= 0) {
      toast('error', 'Please enter a valid amount');
      return;
    }
    topUpWallet(Math.round(amount * 100));
    toast('success', `Added ${formatCents(Math.round(amount * 100))} to your wallet`);
    setTopUpOpen(false);
    setTopUpAmount('');
  };

  const txIcons: Record<string, React.ReactNode> = {
    deposit: <ArrowUpRight size={16} className="text-emerald-500" />,
    purchase: <ArrowDownRight size={16} className="text-neutral-500" />,
    refund: <ArrowUpRight size={16} className="text-amber-500" />,
  };

  const txColors: Record<string, string> = {
    deposit: 'bg-emerald-50',
    purchase: 'bg-neutral-50',
    refund: 'bg-amber-50',
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <PageHeader title="My Wallet" description="Manage your balance and payment methods" />

      {/* Balance card */}
      <Card className="p-6 mb-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-emerald-50 flex items-center justify-center">
              <Wallet size={28} className="text-emerald-600" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-neutral-400">Available Balance</p>
              <p className="text-3xl font-bold text-neutral-900">{formatCents(wallet.balanceCents)}</p>
              <p className="text-xs text-neutral-400 mt-1">USD · Fan Wallet</p>
            </div>
          </div>
          <Button variant="primary" className="flex items-center gap-2 bg-emerald-600 text-white hover:bg-emerald-700" onClick={() => setTopUpOpen(true)}>
            <Plus size={16} /> Top Up
          </Button>
        </div>
      </Card>

      {/* Linked payment methods (placeholders) */}
      <Card className="p-6 mb-6">
        <h3 className="text-sm font-semibold text-neutral-900 mb-4">Linked Payment Methods</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-lg bg-neutral-50 border border-neutral-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-7 rounded bg-gradient-to-br from-neutral-700 to-neutral-900 flex items-center justify-center text-white text-xs font-bold">VISA</div>
              <div>
                <p className="text-sm text-neutral-900">Visa ending in 4242</p>
                <p className="text-xs text-neutral-400">Expires 12/2027</p>
              </div>
            </div>
            <Badge color="green">Default</Badge>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg bg-neutral-50 border border-neutral-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-7 rounded bg-gradient-to-br from-neutral-400 to-neutral-600 flex items-center justify-center text-white text-xs font-bold">MC</div>
              <div>
                <p className="text-sm text-neutral-900">Mastercard ending in 8888</p>
                <p className="text-xs text-neutral-400">Expires 08/2026</p>
              </div>
            </div>
            <Badge color="gray">Backup</Badge>
          </div>
          <button className="flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-900 transition-colors">
            <CreditCard size={14} /> + Add payment method
          </button>
        </div>
      </Card>

      {/* Transaction history */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-neutral-900">Recent Transactions</h3>
          <span className="text-xs text-neutral-400">{wallet.transactions.length} transactions</span>
        </div>
        {wallet.transactions.length === 0 ? (
          <div className="text-center py-8">
            <Clock size={32} className="text-neutral-200 mx-auto mb-3" />
            <p className="text-sm text-neutral-400">No transactions yet</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {wallet.transactions.map((tx) => (
              <div key={tx.id} className={`flex items-center justify-between p-3 rounded-lg ${txColors[tx.type] ?? 'bg-neutral-50'}`}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-white shadow-sm">
                    {txIcons[tx.type] ?? <DollarSign size={16} />}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-neutral-900">{tx.description}</p>
                    <p className="text-xs text-neutral-400">{tx.createdAt}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-semibold ${tx.type === 'purchase' ? 'text-neutral-600' : 'text-emerald-600'}`}>
                    {tx.type === 'purchase' ? '-' : '+'}{formatCents(tx.amountCents)}
                  </p>
                  <Badge color={tx.type === 'deposit' ? 'green' : tx.type === 'refund' ? 'amber' : 'gray'} className="text-xs">
                    {tx.type}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Top Up Modal */}
      {topUpOpen && (
        <Modal title="Top Up Wallet" onClose={() => setTopUpOpen(false)}>
          <div className="p-6 space-y-4">
            <Field label="Amount (USD)">
              <Input
                type="number"
                value={topUpAmount}
                onChange={(e) => setTopUpAmount(e.target.value)}
                placeholder="25.00"
                min="1"
                step="1"
              />
            </Field>
            <div className="flex gap-2">
              {[10, 25, 50, 100].map((preset) => (
                <button
                  key={preset}
                  onClick={() => setTopUpAmount(String(preset))}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-neutral-100 text-neutral-700 hover:bg-neutral-200 transition-colors"
                >
                  ${preset}
                </button>
              ))}
            </div>
            <p className="text-xs text-neutral-400">Funds will be added to your wallet immediately</p>
            <Button variant="primary" className="w-full bg-emerald-600 text-white hover:bg-emerald-700" onClick={handleTopUp}>
              Add Funds
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}
