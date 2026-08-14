import { auth } from '@/auth';
import { getGoldPriceSnapshot } from '@/lib/backend';
import { createFallbackSnapshot, type GoldPriceSnapshot } from '@/lib/gold-price';
import { GoldPriceProvider } from '@/components/landing/gold-price-provider';
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
  const [session, priceSnapshot] = await Promise.all([auth(), loadPriceSnapshot()]);

  // Signed-in visitors get pointed at their dashboard instead of the sign-up flow.
  const ctaHref = session ? '/dashboard' : '/register';
  const ctaLabel = session ? 'داشبورد' : 'شروع کنید';

  return (
    <GoldPriceProvider initialSnapshot={priceSnapshot}>
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
    </GoldPriceProvider>
  );
}

/** A price on first paint is nice to have, not worth failing the page for. */
async function loadPriceSnapshot(): Promise<GoldPriceSnapshot> {
  try {
    return await getGoldPriceSnapshot();
  } catch (error) {
    console.error('[landing] gold price snapshot unavailable', error);
    return createFallbackSnapshot();
  }
}
