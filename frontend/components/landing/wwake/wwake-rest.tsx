import Image from 'next/image';
import { JOURNAL, TILES } from '@/lib/wwake-data';

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

export function WwakeValues() {
  return (
    <section id="visit" className="ww-values">
      <ul className="ww-value-list">
        <li>
          <h3>
            <span>۱</span> ساخته‌شده در نیویورک
          </h3>
          <p>طلای خالص و سنگ طبیعی با منبع اخلاقی، با دقت انتخاب شده</p>
        </li>
        <li>
          <h3>
            <span>۲</span> ساخته‌شده تا بماند
          </h3>
          <p>طراحی‌شده برای دوام، زیر پوشش گارانتی</p>
        </li>
        <li>
          <h3>
            <span>۳</span> ارسال و مرجوعی
          </h3>
          <p>ارسال و مرجوعی به سراسر جهان، با محاسبهٔ عوارض از ابتدا</p>
        </li>
      </ul>
      <aside className="ww-value-post">
        <Image src="/landing/wwake/j5.jpg" alt="" width={144} height={180} />
        <p>۶ خرداد ۱۴۰۵</p>
        <p>الماس طبیعی و عتیقه: هر سنگ چه چیزی با خود دارد</p>
      </aside>
    </section>
  );
}

export function WwakeTiles() {
  return (
    <section className="ww-tiles">
      {TILES.map((tile) => (
        <a key={tile.title} href={tile.href} className="ww-tile">
          <Image src={tile.image} alt="" width={400} height={500} />
          <span className="ww-link">
            {tile.title}
            {'count' in tile && tile.count ? ` [${tile.count}]` : ''}
          </span>
        </a>
      ))}
    </section>
  );
}

export function WwakeFooter() {
  return (
    <footer className="ww-footer">
      <div className="ww-footer-grid">
        <form className="ww-news" action="#visit">
          <label htmlFor="ww-email">خبرنامه</label>
          <div className="ww-news-row">
            <input id="ww-email" type="email" name="email" placeholder="ایمیل شما" />
            <button type="submit" className="ww-link">
              خبرم کنید
            </button>
          </div>
        </form>
        <div className="ww-footer-menus">
          <div>
            <p>دنبال کنید</p>
            <a href="https://www.instagram.com/wwake/" className="ww-link">
              اینستاگرام
            </a>
            <a href="https://www.facebook.com/WWAKEstudio" className="ww-link">
              فیسبوک
            </a>
            <a href="https://www.tiktok.com/@wwakeworld" className="ww-link">
              تیک‌تاک
            </a>
            <a href="#journal" className="ww-link">
              مطبوعات
            </a>
          </div>
          <div>
            <p>اطلاعات</p>
            <a href="#visit" className="ww-link">
              پرسش‌ها
            </a>
            <a href="/login" className="ww-link">
              تماس
            </a>
            <a href="#visit" className="ww-link">
              بازدید
            </a>
            <a href="#shop" className="ww-link">
              پرو در خانه
            </a>
            <a href="#visit" className="ww-link">
              فروشگاه‌ها
            </a>
            <a href="#journal" className="ww-link">
              همکاری
            </a>
          </div>
          <div>
            <p>منشور</p>
            <a href="#journal" className="ww-link">
              منشور
            </a>
            <a href="#visit" className="ww-link">
              مواد
            </a>
            <a href="#values" className="ww-link">
              راهنمای الماس
            </a>
            <a href="#values" className="ww-link">
              سفارشی
            </a>
            <a href="#journal" className="ww-link">
              میراث
            </a>
            <a href="#journal" className="ww-link">
              دفتر پیوستگی
            </a>
          </div>
        </div>
      </div>
      <p className="ww-wordmark">زرین‌سرمایه</p>
      <div className="ww-legal">
        <span>حریم خصوصی</span>
        <span>شرایط استفاده</span>
        <span>© همهٔ حقوق محفوظ است</span>
      </div>
    </footer>
  );
}
