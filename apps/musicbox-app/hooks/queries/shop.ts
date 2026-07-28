import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type { ShopProduct, ShopOrder } from '@/types/database';

// ── Query keys ──
const keys = {
  products: (artistId?: string) => ['shop', 'products', artistId] as const,
  product: (id: string) => ['shop', 'product', id] as const,
  orders: (artistId?: string) => ['shop', 'orders', artistId] as const,
  order: (id: string) => ['shop', 'order', id] as const,
};

// ── Products ──
export function useShopProducts(artistId?: string) {
  return useQuery<ShopProduct[]>({
    queryKey: keys.products(artistId),
    queryFn: () => apiClient.get<ShopProduct[]>('/api/shop/products', { artistId }),
  });
}

export function useShopProduct(id: string) {
  return useQuery<ShopProduct>({
    queryKey: keys.product(id),
    queryFn: () => apiClient.get<ShopProduct>(`/api/shop/products/${id}`),
    enabled: !!id,
  });
}

export function useCreateProduct() {
  const qc = useQueryClient();
  return useMutation<ShopProduct, unknown, Partial<ShopProduct>>({
    mutationFn: (body) => apiClient.post<ShopProduct>('/api/shop/products', body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['shop', 'products'] }),
  });
}

export function useUpdateProduct() {
  const qc = useQueryClient();
  return useMutation<ShopProduct, unknown, { id: string; data: Partial<ShopProduct> }>({
    mutationFn: ({ id, data }) => apiClient.put<ShopProduct>(`/api/shop/products/${id}`, data),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: keys.product(id) });
      qc.invalidateQueries({ queryKey: ['shop', 'products'] });
    },
  });
}

// ── Orders ──
export function useOrders(artistId?: string) {
  return useQuery<ShopOrder[]>({
    queryKey: keys.orders(artistId),
    queryFn: () => apiClient.get<ShopOrder[]>('/api/shop/orders', { artistId }),
  });
}

export function useOrder(id: string) {
  return useQuery<ShopOrder>({
    queryKey: keys.order(id),
    queryFn: () => apiClient.get<ShopOrder>(`/api/shop/orders/${id}`),
    enabled: !!id,
  });
}

export function useCreateOrder() {
  const qc = useQueryClient();
  return useMutation<ShopOrder, unknown, { productId: string; quantity: number; fanEmail: string }>({
    mutationFn: (body) => apiClient.post<ShopOrder>('/api/shop/orders', body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['shop', 'orders'] }),
  });
}
