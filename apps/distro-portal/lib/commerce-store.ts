'use client';

import { create } from 'zustand';

// ============ TYPES ============

export type ProductFamily = 'BlankApparel' | 'PrintOnDemand' | 'Beauty' | 'Bags' | 'Music' | 'FinishedMerch';

export interface CatalogProduct {
  id: string;
  name: string;
  slug: string;
  description: string;
  productFamily: ProductFamily;
  category: string;
  subcategory?: string;
  sku: string;
  fabric?: string;
  availableSizes: string[];
  availableColors: { name: string; hex: string }[];
  wholesalePriceCents: number;
  retailPriceCents: number;
  badges: string[];
  images: string[];
  sizeGuide: Record<string, Record<string, string>>;
  isPublished: boolean;
  inventoryCount: number;
  concernTags?: string[];
  material?: string;
  dimensions?: string;
  sortOrder: number;
}

export interface CartItem {
  id: string;
  productId: string;
  product: CatalogProduct;
  quantity: number;
  size: string;
  color: string;
}

export interface WalletState {
  balanceCents: number;
  transactions: WalletTransaction[];
}

export interface WalletTransaction {
  id: string;
  type: 'deposit' | 'purchase' | 'refund';
  amountCents: number;
  description: string;
  createdAt: string;
}

export interface PurchaseOrder {
  id: string;
  items: OrderLineItem[];
  totalCents: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  createdAt: string;
}

export interface OrderLineItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  size: string;
  color: string;
  priceCents: number;
}

// ============ COMMERCE STORE (Zustand + localStorage) ============

interface CommerceStore {
  // Cart
  cart: CartItem[];
  addToCart: (product: CatalogProduct, size: string, color: string, quantity?: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: () => number;
  cartItemCount: () => number;

  // Wallet
  wallet: WalletState;
  topUpWallet: (amountCents: number) => void;
  spendFromWallet: (amountCents: number, description: string) => void;
  refundToWallet: (amountCents: number, description: string) => void;

  // Orders
  orders: PurchaseOrder[];
  placeOrder: () => PurchaseOrder | null;
  reorder: (orderId: string) => void;
}

const LOCALSTORAGE_KEY = 'adea-commerce';

function loadState(): Partial<CommerceStore> {
  try {
    const stored = localStorage.getItem(LOCALSTORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        cart: parsed.cart ?? [],
        wallet: parsed.wallet ?? { balanceCents: 25000, transactions: [
          { id: 'wt-1', type: 'deposit', amountCents: 25000, description: 'Initial wallet top-up', createdAt: '2026-07-01' },
        ] },
        orders: parsed.orders ?? [],
      };
    }
  } catch { /* ignore */ }
  return {};
}

function saveState(state: { cart: CartItem[]; wallet: WalletState; orders: PurchaseOrder[] }) {
  try {
    localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(state));
  } catch { /* ignore */ }
}

export const useCommerceStore = create<CommerceStore>((set, get) => {
  const initial = loadState();

  return {
    // Cart
    cart: (initial.cart as CartItem[]) ?? [],
    addToCart: (product, size, color, quantity = 1) => {
      const existing = get().cart.find(
        (item) => item.productId === product.id && item.size === size && item.color === color
      );
      if (existing) {
        set((state) => ({
          cart: state.cart.map((item) =>
            item.id === existing.id ? { ...item, quantity: item.quantity + quantity } : item
          ),
        }));
      } else {
        const newItem: CartItem = {
          id: `cart-${Date.now()}-${Math.random().toString(36).slice(2)}`,
          productId: product.id,
          product,
          quantity,
          size,
          color,
        };
        set((state) => ({ cart: [...state.cart, newItem] }));
      }
      const s = get();
      saveState({ cart: s.cart, wallet: s.wallet, orders: s.orders });
    },
    removeFromCart: (cartItemId) => {
      set((state) => ({ cart: state.cart.filter((item) => item.id !== cartItemId) }));
      const s = get();
      saveState({ cart: s.cart, wallet: s.wallet, orders: s.orders });
    },
    updateQuantity: (cartItemId, quantity) => {
      if (quantity <= 0) {
        get().removeFromCart(cartItemId);
        return;
      }
      set((state) => ({
        cart: state.cart.map((item) => item.id === cartItemId ? { ...item, quantity } : item),
      }));
      const s = get();
      saveState({ cart: s.cart, wallet: s.wallet, orders: s.orders });
    },
    clearCart: () => {
      set({ cart: [] });
      const s = get();
      saveState({ cart: [], wallet: s.wallet, orders: s.orders });
    },
    cartTotal: () => {
      return get().cart.reduce((total, item) => total + item.product.retailPriceCents * item.quantity, 0);
    },
    cartItemCount: () => {
      return get().cart.reduce((count, item) => count + item.quantity, 0);
    },

    // Wallet
    wallet: (initial.wallet as WalletState) ?? {
      balanceCents: 25000,
      transactions: [
        { id: 'wt-1', type: 'deposit', amountCents: 25000, description: 'Initial wallet top-up', createdAt: '2026-07-01' },
      ],
    },
    topUpWallet: (amountCents) => {
      const tx: WalletTransaction = {
        id: `wt-${Date.now()}`,
        type: 'deposit',
        amountCents,
        description: `Wallet top-up: ${formatCentsLocal(amountCents)}`,
        createdAt: new Date().toISOString().slice(0, 10),
      };
      set((state) => ({
        wallet: {
          balanceCents: state.wallet.balanceCents + amountCents,
          transactions: [tx, ...state.wallet.transactions],
        },
      }));
      const s = get();
      saveState({ cart: s.cart, wallet: s.wallet, orders: s.orders });
    },
    spendFromWallet: (amountCents, description) => {
      const tx: WalletTransaction = {
        id: `wt-${Date.now()}`,
        type: 'purchase',
        amountCents,
        description,
        createdAt: new Date().toISOString().slice(0, 10),
      };
      set((state) => ({
        wallet: {
          balanceCents: state.wallet.balanceCents - amountCents,
          transactions: [tx, ...state.wallet.transactions],
        },
      }));
      const s = get();
      saveState({ cart: s.cart, wallet: s.wallet, orders: s.orders });
    },
    refundToWallet: (amountCents, description) => {
      const tx: WalletTransaction = {
        id: `wt-${Date.now()}`,
        type: 'refund',
        amountCents,
        description,
        createdAt: new Date().toISOString().slice(0, 10),
      };
      set((state) => ({
        wallet: {
          balanceCents: state.wallet.balanceCents + amountCents,
          transactions: [tx, ...state.wallet.transactions],
        },
      }));
      const s = get();
      saveState({ cart: s.cart, wallet: s.wallet, orders: s.orders });
    },

    // Orders
    orders: (initial.orders as PurchaseOrder[]) ?? [],
    placeOrder: () => {
      const { cart, wallet } = get();
      if (cart.length === 0) return null;
      const total = cart.reduce((t, item) => t + item.product.retailPriceCents * item.quantity, 0);
      if (wallet.balanceCents < total) return null;

      const order: PurchaseOrder = {
        id: `ord-${Date.now()}`,
        items: cart.map((item) => ({
          id: `oli-${Date.now()}-${Math.random().toString(36).slice(2)}`,
          productId: item.productId,
          productName: item.product.name,
          productImage: item.product.images[0] ?? '',
          quantity: item.quantity,
          size: item.size,
          color: item.color,
          priceCents: item.product.retailPriceCents,
        })),
        totalCents: total,
        status: 'pending',
        createdAt: new Date().toISOString().slice(0, 10),
      };

      // Spend from wallet
      get().spendFromWallet(total, `Order ${order.id}`);

      // Clear cart and add order
      set((state) => ({ orders: [order, ...state.orders], cart: [] }));
      const s = get();
      saveState({ cart: [], wallet: s.wallet, orders: s.orders });
      return order;
    },
    reorder: (orderId) => {
      const order = get().orders.find((o) => o.id === orderId);
      if (!order) return;
      // Just add items back to cart - we'll need to look up products
      // For reorder we simulate by finding matching products from catalog
      // The actual cart needs product references, so we'll skip this for now
      // and just toast that the reorder was placed
    },
  };
});

function formatCentsLocal(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}
