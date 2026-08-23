import Image from 'next/image';
import { JOURNAL } from '@/lib/wwake-data';

export function WwakeIntro() {
  return (
    <section id="echoes" className="ww-intro">
      <h2>مجموعهٔ پژواک</h2>
      <p>
        مجموعه‌ای تازه از هم‌زمانی‌هایی که درست زیر سطح پنهان‌اند: تکه‌ای توری، مرواریدی دانه، قطعه‌ای طلا؛ پیوندهایی که
        همیشه بوده‌اند و منتظر دیده شدن. هر قطعه جهانی است برای خودش، و بخشی از گفت‌وگویی بزرگ‌تر با بقیه — اشاره‌هایی که
        به آن‌ها برمی‌گردیم و پاسخ می‌دهیم.
      </p>
      <a href="#shop" className="ww-link">
        کشف مجموعه
      </a>
    </section>
  );
}

export function WwakeMega() {
  return (
    <section className="ww-mega">
      <article className="ww-mega-item">
        <Image src="/landing/wwake/aqua.jpg" alt="" width={1200} height={1500} />
        <div className="ww-mega-copy">
          <h2>آکوامارین</h2>
          <a href="#shop" className="ww-link">
            خرید [۱۰]
          </a>
          <p>
            آکوامارین نامش را از چیزی گرفته که شبیه آن است: نه عمق تاریک دریا، که آب‌های شفاف کم‌عمق جایی که نور از آن
            می‌گذرد. از آبی آسمان تا فیروزه‌ای‌سبز، آکوامارین گونه‌ای از بریل است؛ همان کانی که نخستین عدسی عینک را در
            اروپا از آن تراشیدند.
          </p>
          <a href="#shop" className="ww-link">
            خرید آکوامارین
          </a>
        </div>
      </article>
      <article className="ww-mega-item">
        <Image src="/landing/wwake/moon.jpg" alt="" width={1200} height={1500} />
        <div className="ww-mega-copy">
          <h2>مون‌استون</h2>
          <a href="#shop" className="ww-link">
            خرید [۱۴]
          </a>
          <p>
            مون‌استون درخشش خودش را می‌گیرد، در چیدمانی نامتقارن. هر قطعه جهانی است برای خودش؛ یک‌بار در ساختن شکل
            می‌گیرد و بار دیگر در هر بار پوشیدن.
          </p>
          <a href="#shop" className="ww-link">
            خرید مون‌استون
          </a>
        </div>
      </article>
    </section>
  );
}

export function WwakeJournal() {
  return (
    <section id="journal" className="ww-journal">
      <div className="ww-journal-intro">
        <h2>دفتر پیوستگی</h2>
        <a href="#journal" className="ww-link">
          خرید [۳۳۴]
        </a>
        <p>
          جواهر در پیوستگی‌ای زندگی می‌کند که از زمین آغاز می‌شود و از دست هر کسی که میان راه است می‌گذرد. باور ما این
          است که جواهر پیوند با زمین است و با کسانی که در مسیر شکلش می‌دهند. هر قطعه از ماده‌ای آغاز می‌شود که از زمین
          آمده، با دانش و مراقبت دست‌های بسیار شکل گرفته، و از استخراج و ساخت تا پوشیدن و گردآوری، در زندگی‌ها و
          جامعه‌ها حرکت می‌کند.
        </p>
        <p>
          دفتر پیوستگی این مسیر زنده را از پنج نگاه دنبال می‌کند: از زمین. از کارگاه. روی بدن. در طول یک عمر. با دیگران.
        </p>
        <a href="#journal" className="ww-link">
          بیشتر بخوانید
        </a>
      </div>
      <div className="ww-journal-track">
        {JOURNAL.map((entry) => (
          <article key={entry.title} className="ww-journal-card">
            <h3>{entry.title}</h3>
            <time>{entry.date}</time>
            <Image src={entry.image} alt="" width={286} height={358} />
          </article>
        ))}
      </div>
    </section>
  );
}

const FOOTER_TILES = [
  { title: 'View All', count: '334', image: '/landing/wwake/tile-view.jpg', href: '/shop' },
  { title: 'Ceremonial', count: '123', image: '/landing/wwake/tile-ceremonial.jpg', href: '#values' },
  { title: 'One Of A Kinds', count: '46', image: '/landing/wwake/tile-ooak.jpg', href: '#values' },
  { title: 'Personalized & Bespoke Rings', count: '47', image: '/landing/wwake/tile-personal.jpg', href: '#values' },
  { title: 'Visit Us', image: '/landing/wwake/tile-visit.jpg', href: '#visit' },
  { title: 'Custom', image: '/landing/wwake/tile-custom.jpg', href: '#values' },
  { title: 'Ethos', image: '/landing/wwake/tile-ethos.jpg', href: '#journal' },
  { title: 'Materials', image: '/landing/wwake/tile-materials.jpg', href: '#visit' },
] as const;

function WwakeMark() {
  return (
    <svg className="ww-wordmark" width="320" height="73" viewBox="0 0 320 73" fill="none" aria-label="WWAKE">
      <path d="M171.221 11.3768L184.256 45.0036H158.829L175.41 0H173.652L147.133 72.6855H148.63L151.721 64.296L151.755 64.2046L158.288 46.4717H184.826L194.989 72.6855H202.798L175.411 0L171.221 11.3768Z" fill="#ECF0EB" />
      <path d="M151.558 0H149.801L127.121 62.1622L103.705 0H101.947L79.3733 61.873L56.2847 0H54.527L31.8472 62.1622L8.19376 0.440506H0L28.0082 72.6855H29.5056L32.5965 64.2966L32.6368 64.2225L32.63 64.2046L51.9875 11.6635L75.4286 72.6855H76.9261L99.5133 11.3768L123.282 72.6855H124.779L127.87 64.296L127.911 64.2225L127.903 64.2046L151.558 0Z" fill="#ECF0EB" />
      <path d="M264.072 2.21682e-06L262.208 0.0207912L229.327 33.4757L227.922 34.9269V0.105411H220.11V72.7416H227.922V40.5039L259.609 72.7416H270.346L231.353 33.468L264.072 2.21682e-06Z" fill="#ECF0EB" />
      <path d="M320 1.57393V0.105411H285.113V72.7416H320V71.1595H292.924V34.7205H320V33.2523H292.924V1.57393H320Z" fill="#ECF0EB" />
    </svg>
  );
}

export function WwakeFooter() {
  return (
    <footer className="ww-footer" dir="ltr" lang="en">
      <section id="visit" className="ww-values">
        <ul className="ww-value-list">
          <li>
            <h3>
              <span>1</span>
              <span>Made In New York</span>
            </h3>
            <p>Ethically sourced solid gold and natural stones, selected with care</p>
          </li>
          <li>
            <h3>
              <span>2</span>
              <span>Crafted To Last</span>
            </h3>
            <p>Designed for longevity, covered under warranty</p>
          </li>
          <li>
            <h3>
              <span>3</span>
              <span>Shipping & Returns</span>
            </h3>
            <p>Worldwide shipping and returns, with duties calculated upfront</p>
          </li>
        </ul>
        <aside className="ww-value-post">
          <div>
            <p>27 05 2026</p>
            <a href="#journal" className="ww-underline">
              Natural and Antique Diamonds: What Each Stone Carries
            </a>
            <p className="ww-value-type">
              <span>Type</span>
              <span>From The Earth</span>
            </p>
            <p className="ww-value-excerpt">
              A guide to natural diamonds, antique cuts, and the histories held in stones shaped by both geological time...
            </p>
          </div>
          <Image src="/landing/wwake/j5.jpg" alt="" width={144} height={180} />
        </aside>
      </section>

      <section className="ww-tiles" aria-label="Collections">
        {FOOTER_TILES.map((tile) => (
          <a key={tile.title} href={tile.href} className="ww-tile">
            <span className="ww-tile-media">
              <Image src={tile.image} alt="" fill sizes="(min-width: 990px) 12vw, 22vw" />
            </span>
            <span className="ww-tile-copy">
              <span className="ww-link">{tile.title}</span>
              {'count' in tile && tile.count ? <span>[{tile.count}]</span> : null}
            </span>
          </a>
        ))}
      </section>

      <div className="ww-footer-bottom">
        <form className="ww-news" action="#visit">
          <label htmlFor="ww-email">Newsletter</label>
          <div className="ww-news-row">
            <input id="ww-email" type="email" name="email" placeholder="Your email here" />
            <button type="submit" className="ww-link">
              Get notified
            </button>
          </div>
        </form>

        <div className="ww-footer-menus">
          <div>
            <p>Follow</p>
            <a href="https://www.instagram.com/wwake/" className="ww-link">
              <span>Instagram</span>
            </a>
            <a href="https://www.facebook.com/WWAKEstudio" className="ww-link">
              <span>Facebook</span>
            </a>
            <a href="https://www.tiktok.com/@wwakeworld" className="ww-link">
              <span>Tiktok</span>
            </a>
            <a href="#journal" className="ww-link">
              <span>Press</span>
            </a>
          </div>
          <div>
            <p>Information</p>
            <a href="#visit" className="ww-link">
              <span>FAQ&apos;s</span>
            </a>
            <a href="/login" className="ww-link">
              <span>Contact</span>
            </a>
            <a href="#visit" className="ww-link">
              <span>Visit Us</span>
            </a>
            <a href="#shop" className="ww-link">
              <span>Try At Home</span>
            </a>
            <a href="#visit" className="ww-link">
              <span>Stockists</span>
            </a>
            <a href="#journal" className="ww-link">
              <span>Careers</span>
            </a>
          </div>
          <div>
            <p>Ethos</p>
            <a href="#journal" className="ww-link">
              <span>Ethos</span>
            </a>
            <a href="#visit" className="ww-link">
              <span>Materials</span>
            </a>
            <a href="#values" className="ww-link">
              <span>Diamond Guide</span>
            </a>
            <a href="#values" className="ww-link">
              <span>Custom</span>
            </a>
            <a href="#journal" className="ww-link">
              <span>Heirloom</span>
            </a>
            <a href="#journal" className="ww-link">
              <span>Continuum Journal</span>
            </a>
          </div>
        </div>

        <div className="ww-footer-brand">
          <WwakeMark />
          <div className="ww-legal">
            <a href="#visit" className="ww-underline">
              Privacy policy
            </a>
            <a href="#visit" className="ww-underline">
              Terms of services
            </a>
            <span>© All rights reserved Wwake</span>
            <span className="ww-credits">
              Credits
              <span className="ww-credits-info">
                <span>
                  <em>Design</em> Thomas Hervé Studio
                </span>
                <span>
                  <em>Development</em> Symediane
                </span>
                <span>
                  <em>Strategy</em> Margueritte Kruger
                </span>
              </span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
