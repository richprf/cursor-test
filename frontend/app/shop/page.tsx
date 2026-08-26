import { auth } from '@/auth';
import { LenisRoot } from '@/components/landing/lenis-root';
import { WwakeHeader } from '@/components/landing/wwake/wwake-header';
import { WwakeFooter } from '@/components/landing/wwake/wwake-rest';
import { CollectionGrid } from '@/components/shop/collection-grid';
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

  return (
    <LenisRoot>
      <div className="wwake" dir="rtl" lang="fa">
        <WwakeHeader accountHref={accountHref} accountLabel={accountLabel} />
        <main>{collection ? <CollectionGrid collection={collection} /> : null}</main>
        <WwakeFooter />
      </div>
    </LenisRoot>
  );
}
