import Image from 'next/image';
import Link from 'next/link';
import {
  CUSTOM_GALLERY_COLOR,
  CUSTOM_GALLERY_DIAMOND,
  CUSTOM_HERO_SLIDES,
  CUSTOM_VALUES,
  type CustomMedia,
} from '@/lib/wwake-custom';
import { WwakeCustomHero } from './wwake-custom-hero';
import { WwakeCustomShop } from './wwake-custom-shop';
import { WwakeCustomProcess } from './wwake-custom-process';
import { WwakeCustomFaq } from './wwake-custom-faq';
import { AutoPlayVideo } from './auto-play-video';

function Ctas() {
  return (
    <p className="ww-custom-ctas">
      <Link href="/login" className="ww-link">
        شروع پروژهٔ سفارشی
      </Link>
      <Link href="/#visit" className="ww-link">
        رزرو وقت
      </Link>
    </p>
  );
}

function MediaTile({ item }: { item: CustomMedia }) {
  return (
    <span className="ww-custom-tile">
      {item.video ? (
        <AutoPlayVideo src={item.video} poster={item.image} />
      ) : (
        <Image src={item.image} alt="" fill sizes="22vw" />
      )}
    </span>
  );
}

function Gallery({ title, items }: { title: string; items: CustomMedia[] }) {
  return (
    <section className="ww-custom-gallery">
      <h2>{title}</h2>
      <div className="ww-custom-gallery-grid" data-lenis-prevent>
        {items.map((item, index) => (
          <MediaTile key={`${item.image}-${index}`} item={item} />
        ))}
      </div>
    </section>
  );
}

export function WwakeCustomPage() {
  return (
    <div className="ww-custom-page">
      <WwakeCustomHero />

      <section className="ww-custom-intro">
        <h2>سفارشی پژواک</h2>
        <p>
          بعضی لحظه‌ها را باید نگه داشت، پوشید، جلو برد. کار سفارشی از همین‌جا آغاز می‌شود: غریزهٔ ساختن چیزی پر از معنا —
          انگشتر نامزدی، قطعه‌ای برای یک آستانه، یا چیزی یکسره از آنِ شما. از کارگاه، داستان شما پی می‌شود؛ کمک می‌کنیم به
          قطعه‌ای بدل شود که بی‌چون‌وچرا مال شماست. آنچه برایتان معنا دارد، در موادی که می‌مانند، تا در زندگی همراهتان باشد.
        </p>
        <Ctas />
      </section>

      <section className="ww-custom-values">
        {CUSTOM_VALUES.map((item) => (
          <article key={item.title}>
            <div className="ww-custom-values-media">
              <Image src={item.image} alt="" fill sizes="(min-width: 990px) 22vw, 45vw" />
            </div>
            <h2>{item.title}</h2>
            <p>{item.copy}</p>
          </article>
        ))}
      </section>

      <WwakeCustomProcess />
      <WwakeCustomShop />

      <section className="ww-custom-banner">
        <div className="ww-custom-banner-media">
          <AutoPlayVideo
            src="/landing/wwake/custom/banner.mp4"
            poster="/landing/wwake/custom/banner.jpg"
          />
        </div>
      </section>

      <section className="ww-custom-paths">
        {CUSTOM_HERO_SLIDES.map((slide) => (
          <article key={slide.index}>
            <h3>
              <span>{slide.index}</span>
              <span>{slide.heading}</span>
            </h3>
            <p>{slide.copy}</p>
          </article>
        ))}
      </section>

      <section className="ww-custom-note">
        <p>
          قطعه‌های سفارشی از تأیید طرح تا تحویل ۸ تا ۱۰ هفته شکل می‌گیرند. از بازتصور طرح‌های موجود و ساخت تک‌نسخه تا بازتنظیم
          سنگ میراث و ساختن مجموعه در زمان، خدمات را پوشش می‌دهیم. متخصصان هر مرحله را هدایت می‌کنند و شما را در جریان نگه
          می‌دارند.
        </p>
        <Ctas />
      </section>

      <Gallery title="گالری الماس سفارشی" items={[...CUSTOM_GALLERY_DIAMOND]} />
      <Gallery title="گالری سنگ رنگی سفارشی" items={[...CUSTOM_GALLERY_COLOR]} />

      <div className="ww-custom-faq-wrap">
        <Ctas />
        <WwakeCustomFaq />
      </div>
    </div>
  );
}
