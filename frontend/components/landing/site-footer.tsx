import Link from 'next/link';
import Image from 'next/image';
import { Reveal } from './reveal';

const PAGE_COLUMNS = [
  {
    title: 'PAGES',
    links: [
      { href: '/', label: 'HOME V.1' },
      { href: '/', label: 'HOME V.2' },
      { href: '/', label: 'HOME V.3' },
      { href: '#services', label: 'SERVICES' },
    ],
  },
  {
    title: 'PAGES',
    links: [
      { href: '#about', label: 'About V.1' },
      { href: '#about', label: 'About V.2' },
      { href: '#about', label: 'About V.3' },
      { href: '#work', label: 'LICENSING' },
    ],
  },
  {
    title: 'PAGES',
    links: [
      { href: '/login', label: 'Contact V.1' },
      { href: '/register', label: 'Contact V.2' },
      { href: '/dashboard', label: 'Contact V.3' },
      { href: '#blog', label: 'BLOGS' },
    ],
  },
] as const;

const SOCIALS = [
  { href: 'https://instagram.com', label: 'Instagram', icon: '/landing/footer/instagram.svg' },
  { href: 'https://facebook.com', label: 'Facebook', icon: '/landing/footer/facebook.svg' },
  { href: 'https://linkedin.com', label: 'LinkedIn', icon: '/landing/footer/linkedin.svg' },
  { href: 'https://x.com', label: 'X', icon: '/landing/footer/twitter.svg' },
] as const;

function FooterLink({ href, label }: { href: string; label: string }) {
  if (href.startsWith('/')) {
    return (
      <Link href={href} className="footer-v1-link">
        {label}
      </Link>
    );
  }

  return (
    <a href={href} className="footer-v1-link">
      {label}
    </a>
  );
}

export function SiteFooter() {
  return (
    <footer dir="ltr" className="footer-v1">
      <div className="footer-v1-shell">
        <div className="footer-v1-layout">
          <Reveal y={28}>
            <Link href="/" aria-label="زرین‌سرمایه" className="footer-v1-logo-link">
              <Image
                src="/landing/footer/footer-logo.svg"
                alt=""
                width={106}
                height={28}
                className="footer-v1-logo"
                unoptimized
              />
            </Link>
          </Reveal>

          <Reveal className="footer-v1-list" y={36} delay={0.06}>
            {PAGE_COLUMNS.map((column, index) => (
              <div key={`${column.title}-${index}`} className="footer-v1-column">
                <p>{column.title}</p>
                {column.links.map((link) => (
                  <FooterLink key={link.label} href={link.href} label={link.label} />
                ))}
              </div>
            ))}

            <div className="footer-v1-contact">
              <p>COMPANY</p>
              <div className="footer-v1-contact-data">
                <p className="footer-v1-address">
                  752 New South Headr Rd
                  <br />
                  Triple Bay SWFW 3148, New York
                </p>
                <div className="footer-v1-socials">
                  {SOCIALS.map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      aria-label={social.label}
                      className="footer-v1-icon"
                    >
                      <Image
                        src={social.icon}
                        alt=""
                        width={20}
                        height={20}
                        className="footer-v1-social"
                        unoptimized
                      />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        <Image
          src="/landing/footer/footer-wordmark.svg"
          alt="Upmind"
          width={1189}
          height={235}
          className="footer-v1-wordmark"
          unoptimized
        />
      </div>
    </footer>
  );
}
