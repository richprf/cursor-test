import Image from 'next/image';
import Link from 'next/link';
import {
  CUSTOM_GALLERY_COLOR,
  CUSTOM_GALLERY_DIAMOND,
  CUSTOM_HERO_SLIDES,
  CUSTOM_PROCESS,
  CUSTOM_VALUES,
} from '@/lib/wwake-custom';
import { WwakeCustomHero } from './wwake-custom-hero';
import { WwakeCustomShop } from './wwake-custom-shop';
import { WwakeCustomFaq } from './wwake-custom-faq';

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

export function WwakeCustomPage() {
  return (
    <>
      <WwakeCustomHero />

      <section className="ww-intro ww-custom-intro">
        <h2>سفارشی پژواک</h2>
        <p>
          بعضی لحظه‌ها را باید نگه داشت، پوشید، جلو برد. کار سفارشی از همین‌جا آغاز می‌شود: غریزهٔ ساختن چیزی پر از معنا —
          انگشتر نامزدی، قطعه‌ای برای یک آستانه، یا چیزی یکسره از آنِ شما. از کارگاه، داستان شما پی می‌شود؛ کمک می‌کنیم به
          قطعه‌ای بدل شود که بی‌چون‌وچرا مال شماست. آنچه برایتان معنا دارد، در موادی که می‌مانند، تا در زندگی همراهتان باشد.
        </p>
        <Ctas />
      </section>

      {CUSTOM_VALUES.map((item, index) => (
        <article key={item.title} className={`ww-custom-split${index % 2 ? ' is-flip' : ''}`}>
          <div className="ww-custom-split-media">
            <Image src={item.image} alt="" width={1200} height={1500} />
          </div>
          <div className="ww-custom-split-copy">
            <h2>{item.title}</h2>
            <p>{item.copy}</p>
          </div>
        </article>
      ))}

      <section className="ww-custom-process">
        <h2>روند طراحی سفارشی</h2>
        <div className="ww-custom-steps">
          {CUSTOM_PROCESS.map((step, index) => (
            <article key={step.title} className={`ww-custom-step${index % 2 ? ' is-flip' : ''}`}>
              <div className="ww-custom-step-media">
                <Image src={step.image} alt="" width={1200} height={1500} />
              </div>
              <div className="ww-custom-step-copy">
                <h3>{step.title}</h3>
                <p>{step.copy}</p>
                {step.links.length ? (
                  <p className="ww-custom-ctas">
                    {step.links.map((link) => (
                      <Link key={link.label} href={link.href} className="ww-link">
                        {link.label}
                      </Link>
                    ))}
                  </p>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </section>

      <WwakeCustomShop />

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

      <section className="ww-intro ww-custom-note">
        <p>
          قطعه‌های سفارشی از تأیید طرح تا تحویل ۸ تا ۱۰ هفته شکل می‌گیرند. از بازتصور طرح‌های موجود و ساخت تک‌نسخه تا بازتنظیم
          سنگ میراث و ساختن مجموعه در زمان، خدمات را پوشش می‌دهیم. متخصصان هر مرحله را هدایت می‌کنند و شما را در جریان نگه
          می‌دارند.
        </p>
        <Ctas />
      </section>

      <section className="ww-custom-gallery">
        <h2>گالری الماس سفارشی</h2>
        <div className="ww-custom-gallery-grid">
          {CUSTOM_GALLERY_DIAMOND.map((src) => (
            <Image key={src} src={src} alt="" width={800} height={1000} />
          ))}
        </div>
      </section>

      <section className="ww-custom-gallery">
        <h2>گالری سنگ رنگی سفارشی</h2>
        <div className="ww-custom-gallery-grid">
          {CUSTOM_GALLERY_COLOR.map((src) => (
            <Image key={src} src={src} alt="" width={800} height={1000} />
          ))}
        </div>
      </section>

      <div className="ww-custom-faq-wrap">
        <Ctas />
        <WwakeCustomFaq />
      </div>
    </>
  );
}
