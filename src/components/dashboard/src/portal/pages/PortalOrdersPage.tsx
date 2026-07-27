'use client';

import { useState } from 'react';
import { Package, ArrowRight, ShoppingBag, Clock, ChevronDown, ChevronUp, RefreshCw } from 'lucide-react';
import { formatCents, formatDate } from '@/lib/format';
import { useCommerceStore } from '@/lib/commerce-store';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge, StatusBadge } from '@/components/ui/Badge';
import { Link } from '@/lib/router';
import { toast } from '@/components/ui/Toast';

const STATUS_MAP: Record<string, { color: string; label: string }> = {
  pending: { color: 'amber', label: 'Processing' },
  processing: { color: 'blue', label: 'In Progress' },
  shipped: { color: 'green', label: 'Shipped' },
  delivered: { color: 'green', label: 'Delivered' },
};

export default function PortalOrdersPage() {
  const { orders } = useCommerceStore();
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const handleReorder = (orderId: string) => {
    toast('info', 'Re-order feature coming soon! Items will be added to your cart.');
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-3xl font-bold text-neutral-900 mb-6">Purchase History</h1>

      {orders.length === 0 ? (
        <Card className="p-8">
          <div className="text-center">
            <Package size={48} className="text-neutral-200 mx-auto mb-4" />
            <p className="text-lg font-semibold text-neutral-900 mb-2">No orders yet</p>
            <p className="text-sm text-neutral-400 mb-4">When you make a purchase, it will appear here</p>
            <Link to="/portal/shop" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-neutral-900 text-white font-medium hover:bg-neutral-700 transition-colors">
              <ShoppingBag size={16} /> Browse Shop <ArrowRight size={16} />
            </Link>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const isExpanded = expandedOrder === order.id;
            const statusInfo = STATUS_MAP[order.status] ?? { color: 'gray', label: order.status };

            return (
              <Card key={order.id} className="p-5">
                {/* Order header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center">
                      <Package size={18} className="text-neutral-400" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-neutral-900">Order {order.id}</p>
                      <p className="text-xs text-neutral-400">{formatDate(order.createdAt)} · {order.items.length} items</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-sm font-bold text-neutral-900">{formatCents(order.totalCents)}</p>
                      <Badge color={statusInfo.color} className="text-xs">{statusInfo.label}</Badge>
                    </div>
                    <button
                      onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                      className="p-2 rounded-lg hover:bg-neutral-100 transition-colors"
                    >
                      {isExpanded ? <ChevronUp size={16} className="text-neutral-400" /> : <ChevronDown size={16} className="text-neutral-400" />}
                    </button>
                  </div>
                </div>

                {/* Expanded order details */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-neutral-200">
                    <div className="space-y-3">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex items-center gap-3 p-2 rounded-lg bg-neutral-50">
                          <div className="w-12 h-12 rounded-lg bg-neutral-200 overflow-hidden flex-shrink-0">
                            {item.productImage ? (
                              <img src={item.productImage} alt={item.productName} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <ShoppingBag size={16} className="text-neutral-300" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-neutral-900">{item.productName}</p>
                            <p className="text-xs text-neutral-400">Qty: {item.quantity} · {item.size ? `Size: ${item.size}` : ''} {item.color ? `· Color: ${item.color}` : ''}</p>
                          </div>
                          <p className="text-sm font-medium text-neutral-900">{formatCents(item.priceCents * item.quantity)}</p>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <Button variant="outline" className="flex items-center gap-2 text-sm" onClick={() => handleReorder(order.id)}>
                        <RefreshCw size={14} /> Re-order
                      </Button>
                      <div className="text-right">
                        <p className="text-xs text-neutral-400">Total</p>
                        <p className="text-lg font-bold text-neutral-900">{formatCents(order.totalCents)}</p>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
