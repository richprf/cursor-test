import { auth } from '@/auth';
import { getGoldPriceSnapshot } from '@/lib/backend';
import { createFallbackSnapshot, type GoldPriceSnapshot } from '@/lib/gold-price';
import { GoldPriceProvider } from '@/components/landing/gold-price-provider';
import { LenisRoot } from '@/components/landing/lenis-root';
import { Preloader } from '@/components/landing/preloader';
import { StudioCursor } from '@/components/landing/studio-cursor';
import { SiteHeader } from '@/components/landing/site-header';
import { Hero } from '@/components/landing/hero';
import { Partnerships } from '@/components/landing/partnerships';
import { AboutUs } from '@/components/landing/about-us';
import { Services } from '@/components/landing/services';
import { Features } from '@/components/landing/features';
import { HowWeWork } from '@/components/landing/how-we-work';
import { Blogs } from '@/components/landing/blogs';
import { SiteFooter } from '@/components/landing/site-footer';

export const metadata = {
  title: 'آگهی طلای طلافروشان',
  description:
    'زرین‌سرمایه خودش طلا نمی‌فروشد. مغازه‌دارها لیست می‌کنند، مشتری می‌بیند و حضوری می‌خرد یا پیک می‌گیرد.',
};

export default async function HomePage() {
  const [session, priceSnapshot] = await Promise.all([auth(), loadPriceSnapshot()]);

  // Signed-in visitors get pointed at their dashboard instead of the sign-up flow.
  const ctaHref = session ? '/dashboard' : '/register';
  const ctaLabel = session ? 'داشبورد' : 'شروع کنید';

  return (
    <GoldPriceProvider initialSnapshot={priceSnapshot}>
      <LenisRoot>
        <div className="landing-root">
          <Preloader />
          <StudioCursor />
          <SiteHeader ctaHref={ctaHref} ctaLabel={session ? 'داشبورد' : 'ورود'} />

          <main>
            <Hero ctaHref={ctaHref} ctaLabel={ctaLabel} />
            <Partnerships />
            <AboutUs />
            <Services />
            <Features />
            <HowWeWork />
            <Blogs />
          </main>

          <SiteFooter />
        </div>
      </LenisRoot>
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
