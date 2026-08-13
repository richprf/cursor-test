import { auth } from '@/auth';
import { SiteHeader } from '@/components/landing/site-header';
import { Hero } from '@/components/landing/hero';
import { TrustBar } from '@/components/landing/trust-bar';
import { Features } from '@/components/landing/features';
import { HowItWorks } from '@/components/landing/how-it-works';
import { PriceChart } from '@/components/landing/price-chart';
import { Testimonials } from '@/components/landing/testimonials';
import { Faq } from '@/components/landing/faq';
import { FinalCta } from '@/components/landing/final-cta';
import { SiteFooter } from '@/components/landing/site-footer';

export const metadata = {
  title: 'خرید و سرمایه‌گذاری طلا',
  description:
    'با زرین‌سرمایه از هر مبلغی طلای ۱۸ عیار بخرید، در خزانهٔ بیمه‌شده نگه دارید و هر لحظه بفروشید یا فیزیکی تحویل بگیرید.',
};

export default async function HomePage() {
  const session = await auth();

  // Signed-in visitors get pointed at their dashboard instead of the sign-up flow.
  const ctaHref = session ? '/dashboard' : '/register';
  const ctaLabel = session ? 'داشبورد' : 'شروع کنید';

  return (
    <>
      <SiteHeader ctaHref={ctaHref} ctaLabel={session ? 'داشبورد' : 'ورود'} />

      <main>
        <Hero ctaHref={ctaHref} ctaLabel={ctaLabel} />
        <TrustBar />
        <Features />
        <HowItWorks />
        <PriceChart />
        <Testimonials />
        <Faq />
        <FinalCta ctaHref={ctaHref} ctaLabel={session ? 'رفتن به داشبورد' : 'ثبت‌نام رایگان'} />
      </main>

      <SiteFooter />
    </>
  );
}
