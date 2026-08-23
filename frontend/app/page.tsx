import { Instrument_Sans } from 'next/font/google';
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

const instrument = Instrument_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-instrument',
  display: 'swap',
});

export const metadata = {
  title: 'Fine Jewelry Mindfully Made',
  description: 'Beauty from the earth, fine jewelry shaped by material and time.',
};

export default async function HomePage() {
  const session = await auth();
  const accountHref = session ? '/dashboard' : '/login';

  return (
    <LenisRoot>
      <div className={`wwake ${instrument.variable} ${instrument.className}`} dir="ltr" lang="en">
        <WwakeHeader accountHref={accountHref} accountLabel="Account" />
        <main>
          <WwakeHero />
          <WwakeIntro />
          <WwakeList
            id="echoes-list"
            heading="Introducing a new collection, Echoes."
            items={ECHO_CATEGORIES}
          />
          <WwakeStacking />
          <WwakeShop />
          <WwakeMega />
          <WwakeList
            id="values"
            heading="Jewelry to be worn, kept and carried forward."
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
