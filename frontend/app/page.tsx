import { auth } from '@/auth';
import { LenisRoot } from '@/components/landing/lenis-root';
import { WwakeHeader } from '@/components/landing/wwake/wwake-header';
import { WwakeHero } from '@/components/landing/wwake/wwake-hero';
import { WwakeIntro, WwakeJournal, WwakeMega, WwakeFooter, WwakeTiles, WwakeValues } from '@/components/landing/wwake/wwake-rest';
import { WwakeList } from '@/components/landing/wwake/wwake-list';
import { WwakeStacking } from '@/components/landing/wwake/wwake-stacking';
import { WwakeShop } from '@/components/landing/wwake/wwake-shop';
import { ECHO_CATEGORIES, VALUE_CATEGORIES } from '@/lib/wwake-data';
import './wwake.css';

export const metadata = {
  title: 'جواهر دست‌ساز',
  description: 'زیبایی از زمین؛ جواهری که ماده و زمان شکلش داده‌اند.',
};

export default async function HomePage() {
  const session = await auth();
  const accountHref = session ? '/dashboard' : '/login';
  const accountLabel = session ? 'داشبورد' : 'ورود';

  return (
    <LenisRoot>
      <div className="wwake" dir="rtl" lang="fa">
        <WwakeHeader accountHref={accountHref} accountLabel={accountLabel} />
        <main>
          <WwakeHero />
          <WwakeIntro />
          <WwakeList
            id="echoes-list"
            heading="معرفی مجموعهٔ تازه، پژواک."
            items={ECHO_CATEGORIES}
          />
          <WwakeStacking />
          <WwakeShop />
          <WwakeMega />
          <WwakeList
            id="values"
            heading="جواهری برای پوشیدن، نگه داشتن و جلو بردن."
            items={VALUE_CATEGORIES}
          />
          <WwakeJournal />
          <WwakeValues />
          <WwakeTiles />
        </main>
        <WwakeFooter />
      </div>
    </LenisRoot>
  );
}
