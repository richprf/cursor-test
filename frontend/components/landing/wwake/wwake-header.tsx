import Link from 'next/link';

function Wordmark({ className = '' }: { className?: string }) {
  return (
    <svg className={className} width="41" height="20" viewBox="0 0 41 20" fill="none" aria-hidden>
      <path
        d="M41 0H40.5246L34.3892 17.1044L28.0546 0H27.5791L21.4723 17.0249L15.2263 0H14.7508L8.61541 17.1044L2.2166 0.121209H0L7.57685 20H7.98195L8.81811 17.6917L8.82899 17.6714L8.82716 17.6664L14.0638 3.20931L20.4052 20H20.8103L26.9206 3.13041L33.3505 20H33.7557L34.5918 17.6916L34.6028 17.6714L34.6008 17.6664L41 0Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function WwakeHeader({ accountHref, accountLabel }: { accountHref: string; accountLabel: string }) {
  return (
    <header className="ww-header">
      <nav className="ww-header-left">
        <a href="#shop" className="ww-underline is-desktop">
          Shop
        </a>
        <a href="#values" className="ww-underline is-desktop">
          Custom
        </a>
        <a href="#visit" className="ww-underline is-desktop">
          Visit Us
        </a>
        <a href="#shop" className="ww-underline md:hidden">
          Menu
        </a>
      </nav>

      <Link href="/" className="ww-header-logo" aria-label="Home">
        <Wordmark />
      </Link>

      <div className="ww-header-right">
        <a href="#journal" className="ww-underline is-desktop">
          Search
        </a>
        <span className="ww-underline is-desktop">$ US</span>
        <Link href={accountHref} className="ww-underline">
          {accountLabel}
        </Link>
        <span className="ww-header-cart">
          Cart <span>[0]</span>
        </span>
      </div>
    </header>
  );
}
