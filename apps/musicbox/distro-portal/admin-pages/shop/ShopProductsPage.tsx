'use client';

import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ShoppingBag } from 'lucide-react';
import { formatCents } from '@/lib/format';
import { mockShopProducts } from '@/lib/mock-data';

export default function ShopProductsPage() {
  const products = mockShopProducts;

  return (
    <div>
      <PageHeader title="Shop Products" description="Manage merch and digital products" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((p) => (
          <Card className="p-5" key={p.id}>
            <div className="flex items-start gap-3">
              <div className="w-14 h-14 rounded-lg bg-neutral-100 flex items-center justify-center flex-shrink-0"><ShoppingBag size={24} className="text-neutral-300" /></div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-neutral-900">{p.title}</p>
                <p className="text-xs text-neutral-500 mt-0.5">{p.category ?? '—'} · {formatCents(Math.round(p.price * 100))}</p>
                <div className="flex items-center gap-1.5 mt-2">
                  <Badge color={p.is_active ? 'green' : 'gray'}>{p.is_active ? 'Active' : 'Inactive'}</Badge>
                  {p.inventory_count <= 5 && p.inventory_count > 0 && <Badge color="amber">Low stock</Badge>}
                  {p.inventory_count === 0 && <Badge color="red">Sold out</Badge>}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
