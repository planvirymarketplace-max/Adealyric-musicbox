import { AlbumDetailPage, ProductDetailPage } from '@/components/adea/Shop';
import { SHOP_ALBUMS, ALL_PRODUCTS } from '@/lib/catalog';
import { SiteHeader, SiteFooter } from '@/components/adea/SiteChrome';

interface Props {
  params: Promise<{ id: string }> | { id: string };
}

export default async function ShopDetailPage({ params }: Props) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  const isAlbum = SHOP_ALBUMS.some((a) => a.slug === id);
  const isProduct = ALL_PRODUCTS.some((p) => p.slug === id);

  return (
    <div className="bg-white text-black">
      <SiteHeader />
      {isAlbum ? (
        <AlbumDetailPage slug={id} />
      ) : isProduct ? (
        <ProductDetailPage slug={id} />
      ) : (
        <div className="flex min-h-screen items-center justify-center bg-white">
          <p className="text-sm text-black">Item not found.</p>
        </div>
      )}
      <SiteFooter />
    </div>
  );
}
