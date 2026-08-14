import Link from 'next/link';
import { Mail } from 'lucide-react';
import { Brand } from '@/components/brand';

const LINK_GROUPS = [
  {
    title: 'محصول',
    links: [
      { href: '#features', label: 'ویژگی‌ها' },
      { href: '#how-it-works', label: 'نحوهٔ کار' },
      { href: '#prices', label: 'قیمت طلا' },
      { href: '#faq', label: 'سوالات متداول' },
    ],
  },
  {
    title: 'حساب کاربری',
    links: [
      { href: '/login', label: 'ورود' },
      { href: '/register', label: 'ثبت‌نام' },
      { href: '/dashboard', label: 'داشبورد' },
    ],
  },
  {
    title: 'پشتیبانی',
    links: [
      { href: 'mailto:support@example.com', label: 'ایمیل پشتیبانی' },
      { href: 'tel:+982100000000', label: 'تلفن ۲۴ ساعته' },
    ],
  },
];

// Replace with the brand's real profiles before launch. lucide-react no longer ships
// brand marks, so Instagram and Telegram are drawn below in the same stroke style.
const SOCIALS = [
  { href: 'https://instagram.com', label: 'اینستاگرام', icon: InstagramIcon },
  { href: 'https://telegram.org', label: 'تلگرام', icon: TelegramIcon },
  { href: 'mailto:support@example.com', label: 'ایمیل', icon: Mail },
];

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      aria-hidden
    >
      <rect x="3" y="3" width="18" height="18" rx="5.5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.3" cy="6.7" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

function TelegramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M21.5 3.2 2.9 10.4a.6.6 0 0 0 .05 1.13l4.5 1.5 1.7 5a.6.6 0 0 0 1.03.2l2.3-2.5 4.3 3.2a.6.6 0 0 0 .94-.33l3.6-14.7a.6.6 0 0 0-.82-.7z" />
      <path d="m7.45 13.03 12.3-8.6-7.3 9.83" />
    </svg>
  );
}

export function SiteFooter() {
  const persianYear = new Intl.DateTimeFormat('fa-IR-u-ca-persian', { year: 'numeric' }).format(
    new Date(),
  );

  return (
    <footer className="border-t border-border bg-background-elevated">
      <div className="mx-auto w-full max-w-6xl px-5 py-12 sm:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div className="space-y-4">
            <div className="flex justify-start">
              <Brand />
            </div>
            <p className="max-w-xs text-sm leading-7 text-muted">
              خرید، نگهداری و فروش طلای ۱۸ عیار به‌صورت آنلاین؛ با امکان تحویل فیزیکی شمش.
            </p>
            <div className="flex gap-2">
              {SOCIALS.map((social) => (
                <a
                  key={social.href}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={social.label}
                  className="grid size-9 place-items-center rounded-xl border border-border text-muted transition hover:border-gold-500/40 hover:text-gold-700"
                >
                  <social.icon className="size-4" aria-hidden />
                </a>
              ))}
            </div>
          </div>

          {LINK_GROUPS.map((group) => (
            <nav key={group.title} aria-label={group.title}>
              <h2 className="text-sm font-semibold">{group.title}</h2>
              <ul className="mt-4 space-y-3 text-sm text-muted">
                {group.links.map((link) => (
                  <li key={link.href}>
                    {link.href.startsWith('/') ? (
                      <Link href={link.href} className="transition hover:text-gold-700">
                        {link.label}
                      </Link>
                    ) : (
                      <a href={link.href} className="transition hover:text-gold-700">
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 text-xs text-muted sm:flex-row">
          <p>© {persianYear} زرین‌سرمایه — تمامی حقوق محفوظ است.</p>
          <p>ارقام و نمودارهای این صفحه نمایشی است.</p>
        </div>
      </div>
    </footer>
  );
}
