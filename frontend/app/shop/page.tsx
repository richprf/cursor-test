import { auth } from '@/auth';
import { LenisRoot } from '@/components/landing/lenis-root';
import { WwakeHeader } from '@/components/landing/wwake/wwake-header';
import { WwakeFooter } from '@/components/landing/wwake/wwake-rest';
import { CollectionGrid } from '@/components/shop/collection-grid';
import { SellerListings } from '@/components/shop/seller-listings';
import { listProducts } from '@/lib/backend';
import { getCollection } from '@/lib/wwake-collections';
import '../wwake.css';

export const metadata = {
  title: 'فروشگاه',
  description: 'فهرست قطعه‌های طلا و جواهر؛ همان شبکهٔ مجموعه‌ها.',
};

export default async function ShopPage() {
  const session = await auth();
  const accountHref = session ? '/dashboard' : '/login';
  const accountLabel = session ? 'داشبورد' : 'ورود';
  const collection = getCollection('view-all');
  const listings = await listProducts()
    .then((data) => data.items)
    .catch(() => []);

  return (
    <LenisRoot>
      <div className="wwake" dir="rtl" lang="fa">
        <WwakeHeader accountHref={accountHref} accountLabel={accountLabel} />
        <main>
          <SellerListings items={listings} />
          {collection ? <CollectionGrid collection={collection} /> : null}
        </main>
        <WwakeFooter />
      </div>
    </LenisRoot>
  );
}
