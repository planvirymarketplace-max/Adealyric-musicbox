'use client';

import { useState } from 'react';
import { ShoppingBag, Trash2, Minus, Plus, ArrowLeft, ArrowRight, X } from 'lucide-react';
import { formatCents } from '@/lib/format';
import { useCommerceStore } from '@/lib/commerce-store';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Link } from '@/lib/router';
import { toast } from '@/components/ui/Toast';

export default function PortalCartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart, cartTotal, placeOrder } = useCommerceStore();
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const total = cartTotal();
  const walletBalance = useCommerceStore().wallet.balanceCents;
  const canCheckout = cart.length > 0 && walletBalance >= total;

  const handleCheckout = () => {
    if (!canCheckout) {
      toast('error', 'Insufficient wallet balance. Please top up your wallet first.');
      return;
    }
    const order = placeOrder();
    if (order) {
      toast('success', `Order placed! Total: ${formatCents(order.totalCents)}`);
      setCheckoutOpen(false);
    } else {
      toast('error', 'Could not place order. Please try again.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-neutral-900">Cart</h1>
        {cart.length > 0 && (
          <button onClick={clearCart} className="text-sm text-neutral-500 hover:text-red-600 transition-colors flex items-center gap-1">
            <Trash2 size={14} /> Clear Cart
          </button>
        )}
      </div>

      {cart.length === 0 ? (
        <Card className="p-8">
          <div className="text-center">
            <ShoppingBag size={48} className="text-neutral-200 mx-auto mb-4" />
            <p className="text-lg font-semibold text-neutral-900 mb-2">Your cart is empty</p>
            <p className="text-sm text-neutral-400 mb-4">Browse the shop to find items you love</p>
            <Link to="/portal/shop" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-neutral-900 text-white font-medium hover:bg-neutral-700 transition-colors">
              <ShoppingBag size={16} /> Shop Now <ArrowRight size={16} />
            </Link>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <Card key={item.id} className="p-4">
                <div className="flex items-start gap-4">
                  {/* Product image */}
                  <div className="w-16 h-16 rounded-lg bg-neutral-100 overflow-hidden flex-shrink-0">
                    {item.product.images[0] ? (
                      <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingBag size={20} className="text-neutral-300" />
                      </div>
                    )}
                  </div>

                  {/* Product info */}
                  <div className="flex-1 min-w-0">
                    <Link to={`/portal/shop/${item.product.id}`} className="text-sm font-semibold text-neutral-900 hover:text-neutral-700 transition-colors">
                      {item.product.name}
                    </Link>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      {item.product.category} · {item.product.productFamily === 'Beauty' || item.product.productFamily === 'Bags' ? '' : `Size: ${item.size}`}
                      {item.color && ` · Color: ${item.color}`}
                    </p>

                    {/* Size/Color badges */}
                    <div className="flex items-center gap-1.5 mt-2">
                      {item.size && item.product.productFamily !== 'Beauty' && item.product.productFamily !== 'Bags' && (
                        <Badge color="gray" className="text-xs">Size: {item.size}</Badge>
                      )}
                      {item.color && (
                        <Badge color="gray" className="text-xs flex items-center gap-1">
                          <span className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: item.product.availableColors.find(c => c.name === item.color)?.hex ?? '#808080' }} />
                          {item.color}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Quantity + Price */}
                  <div className="flex flex-col items-end gap-2">
                    <p className="text-lg font-bold text-neutral-900">{formatCents(item.product.retailPriceCents * item.quantity)}</p>
                    {item.quantity > 1 && (
                      <p className="text-xs text-neutral-400">{formatCents(item.product.retailPriceCents)} each</p>
                    )}
                    <div className="flex items-center gap-1">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-7 h-7 rounded-lg bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center transition-colors">
                        <Minus size={14} className="text-neutral-500" />
                      </button>
                      <span className="text-sm font-medium text-neutral-900 w-6 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-7 h-7 rounded-lg bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center transition-colors">
                        <Plus size={14} className="text-neutral-500" />
                      </button>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className="text-xs text-neutral-400 hover:text-red-600 transition-colors flex items-center gap-1">
                      <Trash2 size={12} /> Remove
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Cart summary */}
          <div>
            <Card className="p-6">
              <h3 className="text-sm font-semibold text-neutral-900 mb-4">Order Summary</h3>
              <div className="space-y-3 mb-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center justify-between text-sm">
                    <span className="text-neutral-600 truncate max-w-[150px]">{item.product.name} × {item.quantity}</span>
                    <span className="text-neutral-900 font-medium">{formatCents(item.product.retailPriceCents * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-neutral-200 pt-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-600">Subtotal</span>
                  <span className="text-sm font-semibold text-neutral-900">{formatCents(total)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-600">Shipping</span>
                  <span className="text-sm text-neutral-900">Free</span>
                </div>
                <div className="flex items-center justify-between border-t border-neutral-200 pt-2">
                  <span className="text-sm font-semibold text-neutral-900">Total</span>
                  <span className="text-lg font-bold text-neutral-900">{formatCents(total)}</span>
                </div>
              </div>

              {/* Wallet balance info */}
              <div className="mt-4 p-3 rounded-lg bg-neutral-50 border border-neutral-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-neutral-400">Wallet Balance</span>
                  <span className="text-sm font-medium text-neutral-900">{formatCents(walletBalance)}</span>
                </div>
                {walletBalance < total && (
                  <div className="mt-2">
                    <p className="text-xs text-red-500">Insufficient balance. Need {formatCents(total - walletBalance)} more.</p>
                    <Link to="/portal/wallet" className="text-xs text-emerald-600 hover:underline mt-1 inline-flex items-center gap-1">
                      Top up wallet <ArrowRight size={12} />
                    </Link>
                  </div>
                )}
              </div>

              <Button
                variant="primary"
                className="w-full mt-4 bg-neutral-900 text-white hover:bg-neutral-700 flex items-center justify-center gap-2"
                onClick={() => setCheckoutOpen(true)}
                disabled={!canCheckout}
              >
                Checkout <ArrowRight size={16} />
              </Button>

              <Link to="/portal/shop" className="flex items-center gap-1 text-sm text-neutral-500 hover:text-neutral-900 mt-3 transition-colors">
                <ArrowLeft size={14} /> Continue Shopping
              </Link>
            </Card>
          </div>
        </div>
      )}

      {/* Checkout confirmation modal */}
      {checkoutOpen && (
        <Modal title="Confirm Purchase" onClose={() => setCheckoutOpen(false)}>
          <div className="p-6 space-y-4">
            <p className="text-sm text-neutral-600">You are about to purchase the following items:</p>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center justify-between text-sm">
                  <span className="text-neutral-700">{item.product.name} × {item.quantity}</span>
                  <span className="font-medium text-neutral-900">{formatCents(item.product.retailPriceCents * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-neutral-200 pt-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-neutral-900">Total</span>
                <span className="text-lg font-bold text-neutral-900">{formatCents(total)}</span>
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs text-neutral-400">Paid from wallet</span>
                <span className="text-xs text-neutral-500">{formatCents(walletBalance)} available</span>
              </div>
            </div>
            <Button variant="primary" className="w-full bg-emerald-600 text-white hover:bg-emerald-700" onClick={handleCheckout}>
              Confirm & Pay
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}
