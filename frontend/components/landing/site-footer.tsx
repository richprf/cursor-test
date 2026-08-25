import Link from 'next/link';
import Image from 'next/image';
import { Brand } from '@/components/brand';
import { Reveal } from './reveal';

const PAGE_COLUMNS = [
  {
    title: 'صفحات',
    links: [
      { href: '/', label: 'خانه' },
      { href: '#partners', label: 'همکاری‌ها' },
      { href: '#services', label: 'خدمات' },
      { href: '#features', label: 'ویژگی‌ها' },
    ],
  },
  {
    title: 'صفحات',
    links: [
      { href: '#about', label: 'درباره ما' },
      { href: '#work', label: 'نحوهٔ کار' },
      { href: '#blog', label: 'مقالات' },
      { href: '#features', label: 'مجوزها' },
    ],
  },
  {
    title: 'حساب',
    links: [
      { href: '/login', label: 'ورود' },
      { href: '/register', label: 'ثبت‌نام' },
      { href: '/dashboard', label: 'داشبورد' },
      { href: '#blog', label: 'وبلاگ' },
    ],
  },
] as const;

const SOCIALS = [
  { href: 'https://instagram.com', label: 'اینستاگرام', icon: '/landing/footer/instagram.svg' },
  { href: 'https://facebook.com', label: 'فیسبوک', icon: '/landing/footer/facebook.svg' },
  { href: 'https://linkedin.com', label: 'لینکدین', icon: '/landing/footer/linkedin.svg' },
  { href: 'https://x.com', label: 'ایکس', icon: '/landing/footer/twitter.svg' },
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
    <footer className="footer-v1">
      <div className="footer-v1-shell">
        <div className="footer-v1-layout">
          <Reveal y={28}>
            <Link href="/" aria-label="پژواک" className="footer-v1-logo-link">
              <Brand compact />
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
              <p>شرکت</p>
              <div className="footer-v1-contact-data">
                <p className="footer-v1-address">
                  ۷۵۲ جادهٔ نیو ساوت هدر
                  <br />
                  تریپل‌بی، نیویورک
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

        <p className="footer-v1-wordmark">پژواک</p>
      </div>
    </footer>
  );
}
