import { auth } from '@/auth';
import { LenisRoot } from '@/components/landing/lenis-root';
import { WwakeHeader } from '@/components/landing/wwake/wwake-header';
import { WwakeFooter } from '@/components/landing/wwake/wwake-rest';
import { WwakeCustomPage } from '@/components/landing/wwake/wwake-custom';
import '../wwake.css';

export const metadata = {
  title: 'جواهر و انگشتر نامزدی سفارشی',
  description: 'کار سفارشی پژواک: انگشتر نامزدی، بازتنظیم میراث، و قطعه‌ای که داستان شما را شکل می‌دهد.',
};

export default async function CustomPage() {
  const session = await auth();
  const accountHref = session ? '/dashboard' : '/login';
  const accountLabel = session ? 'داشبورد' : 'ورود';

  return (
    <LenisRoot>
      <div className="wwake" dir="rtl" lang="fa">
        <WwakeHeader accountHref={accountHref} accountLabel={accountLabel} />
        <main>
          <WwakeCustomPage />
        </main>
        <WwakeFooter />
      </div>
    </LenisRoot>
  );
}
