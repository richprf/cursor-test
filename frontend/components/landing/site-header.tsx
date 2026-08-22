'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { Brand } from '@/components/brand';
import { ThemeToggle } from '@/components/theme-toggle';
import { gsap } from '@/lib/gsap';
import { GSAP_EASE, TIMING } from '@/lib/motion';

export const NAV_LINKS = [
  { href: '#about', label: 'درباره ما' },
  { href: '#services', label: 'خدمات' },
  { href: '#features', label: 'ویژگی‌ها' },
  { href: '#work', label: 'نمونه‌کار' },
  { href: '#how-it-works', label: 'نحوهٔ کار' },
  { href: '#prices', label: 'قیمت طلا' },
  { href: '#faq', label: 'سوالات' },
];

export function SiteHeader({ ctaHref, ctaLabel }: { ctaHref: string; ctaLabel: string }) {
  const headerRef = useRef<HTMLElement>(null);
  const lastY = useRef(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [overHero, setOverHero] = useState(true);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    const onScroll = () => {
      const y = window.scrollY;
      setOverHero(y < 72);
      if (isMenuOpen || y < 48) {
        gsap.to(header, { y: 0, duration: TIMING.nav, ease: GSAP_EASE.power2Out, overwrite: true });
        lastY.current = y;
        return;
      }
      const goingDown = y > lastY.current + 2;
      gsap.to(header, {
        y: goingDown ? -110 : 0,
        duration: TIMING.nav,
        ease: GSAP_EASE.power2Out,
        overwrite: true,
      });
      lastY.current = y;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [isMenuOpen]);

  const onHero = overHero && !isMenuOpen;

  return (
    <header
      ref={headerRef}
      className={`fixed inset-x-0 top-0 z-50 will-change-transform ${
        onHero ? 'text-white' : 'border-b border-foreground/10 bg-background/90 text-foreground backdrop-blur-md'
      }`}
    >
      <div className="mx-auto flex h-[49px] w-full max-w-[1600px] items-center justify-between gap-4 px-6">
        <Link href="/" aria-label="زرین‌سرمایه">
          <Brand compact />
        </Link>

        <nav className="hidden items-center gap-7 text-[13px] font-medium tracking-tight lg:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`relative ps-3 transition before:absolute before:start-0 before:top-1/2 before:size-1.5 before:-translate-y-1/2 before:rounded-full before:bg-gold-500 before:opacity-0 hover:before:opacity-100 ${
                onHero ? 'text-white/75 hover:text-white' : 'text-foreground/70 hover:text-foreground'
              }`}
              style={{ transitionDuration: `${TIMING.hoverCopy}s`, transitionTimingFunction: 'cubic-bezier(0.165, 0.84, 0.44, 1)' }}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle className="rounded-none border-current/20 bg-transparent" />
          <Link
            href={ctaHref}
            className={`border px-3.5 py-1.5 text-xs font-semibold tracking-tight ${
              onHero ? 'border-white/30' : 'border-foreground/25'
            }`}
          >
            {ctaLabel}
          </Link>
          <button
            type="button"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-expanded={isMenuOpen}
            aria-label={isMenuOpen ? 'بستن منو' : 'باز کردن منو'}
            className="grid size-9 place-items-center border border-current/30 lg:hidden"
          >
            {isMenuOpen ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <nav className="border-t border-foreground/10 bg-background text-foreground lg:hidden">
          <ul className="flex flex-col gap-1 px-6 py-4">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="block py-2.5 text-sm text-muted hover:text-foreground"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
