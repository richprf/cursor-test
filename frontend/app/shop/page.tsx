import { auth } from '@/auth';
import { LenisRoot } from '@/components/landing/lenis-root';
import { WwakeHeader } from '@/components/landing/wwake/wwake-header';
import { WwakeFooter } from '@/components/landing/wwake/wwake-rest';
import { GoldList } from '@/components/shop/gold-list';
import '../wwake.css';

export const metadata = {
  title: 'لیست طلا و جواهر',
  description: 'فهرست قطعه‌های طلا و جواهر با خانه‌های متفاوت؛ همان عکس‌های مجموعه.',
};

export default async function ShopPage() {
  const session = await auth();
  const accountHref = session ? '/dashboard' : '/login';
  const accountLabel = session ? 'داشبورد' : 'ورود';

  return (
    <LenisRoot>
      <div className="wwake" dir="rtl" lang="fa">
        <WwakeHeader accountHref={accountHref} accountLabel={accountLabel} />
        <main>
          <GoldList />
        </main>
        <WwakeFooter />
      </div>
    </LenisRoot>
  );
}
