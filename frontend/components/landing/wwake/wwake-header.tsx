import Link from 'next/link';

export function WwakeHeader({ accountHref, accountLabel }: { accountHref: string; accountLabel: string }) {
  return (
    <header className="ww-header">
      <nav className="ww-header-left">
        <a href="#shop" className="ww-underline is-desktop">
          فروشگاه
        </a>
        <a href="#values" className="ww-underline is-desktop">
          سفارشی
        </a>
        <a href="#visit" className="ww-underline is-desktop">
          بازدید
        </a>
        <a href="#shop" className="ww-underline md:hidden">
          منو
        </a>
      </nav>

      <Link href="/" className="ww-header-logo" aria-label="زرین‌سرمایه">
        زرین‌سرمایه
      </Link>

      <div className="ww-header-right">
        <a href="#journal" className="ww-underline is-desktop">
          جستجو
        </a>
        <span className="ww-underline is-desktop">$ US</span>
        <Link href={accountHref} className="ww-underline">
          {accountLabel}
        </Link>
        <span className="ww-header-cart">
          سبد <span>[۰]</span>
        </span>
      </div>
    </header>
  );
}
