import Link from 'next/link';

export function WwakeHeader({ accountHref, accountLabel }: { accountHref: string; accountLabel: string }) {
  return (
    <header className="ww-header">
      <nav className="ww-header-left">
        <Link href="/shop" className="ww-underline is-desktop">
          فروشگاه
        </Link>
        <Link href="/#values" className="ww-underline is-desktop">
          سفارشی
        </Link>
        <Link href="/#visit" className="ww-underline is-desktop">
          بازدید
        </Link>
        <Link href="/shop" className="ww-underline md:hidden">
          منو
        </Link>
      </nav>

      <Link href="/" className="ww-header-logo" aria-label="پژواک">
        پژواک
      </Link>

      <div className="ww-header-right">
        <Link href="/#journal" className="ww-underline is-desktop">
          جستجو
        </Link>
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
