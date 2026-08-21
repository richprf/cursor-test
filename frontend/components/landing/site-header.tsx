'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Brand } from '@/components/brand';
import { ThemeToggle } from '@/components/theme-toggle';
import { EASE_OUT } from './reveal';

export const NAV_LINKS = [
  { href: '#features', label: 'ویژگی‌ها' },
  { href: '#work', label: 'نمونه‌کار' },
  { href: '#how-it-works', label: 'نحوهٔ کار' },
  { href: '#prices', label: 'قیمت طلا' },
  { href: '#faq', label: 'سوالات' },
];

export function SiteHeader({ ctaHref, ctaLabel }: { ctaHref: string; ctaLabel: string }) {
  const [hidden, setHidden] = useState(false);
  const [overHero, setOverHero] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const lastY = useRef(0);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (latest) => {
    const previous = lastY.current;
    lastY.current = latest;
    setOverHero(latest < 72);
    if (isMenuOpen) {
      setHidden(false);
      return;
    }
    if (latest < 48) {
      setHidden(false);
      return;
    }
    setHidden(latest > previous && latest - previous > 2);
  });

  const onHero = overHero && !isMenuOpen;

  return (
    <motion.header
      animate={{ y: hidden ? '-110%' : '0%' }}
      transition={{ duration: 0.45, ease: EASE_OUT }}
      className={`fixed inset-x-0 top-0 z-50 ${
        onHero ? 'text-white' : 'border-b border-foreground/10 bg-background/90 text-foreground backdrop-blur-md'
      }`}
    >
      <div className="mx-auto flex h-14 w-full max-w-[1600px] items-center justify-between gap-4 px-5 sm:px-8 lg:px-10">
        <Link href="/" aria-label="زرین‌سرمایه">
          <Brand compact />
        </Link>

        <nav className="hidden items-center gap-7 text-[13px] font-medium tracking-tight lg:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`relative ps-3 transition before:absolute before:start-0 before:top-1/2 before:size-1.5 before:-translate-y-1/2 before:rounded-full before:bg-gold-500 before:opacity-0 before:transition-opacity hover:before:opacity-100 ${
                onHero ? 'text-white/75 hover:text-white' : 'text-foreground/70 hover:text-foreground'
              }`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle className="rounded-none border-current/20 bg-transparent" />
          <Link
            href={ctaHref}
            className={`border px-3.5 py-1.5 text-xs font-semibold tracking-tight transition hover:border-gold-500 ${
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

      <AnimatePresence initial={false}>
        {isMenuOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE_OUT }}
            className="overflow-hidden border-t border-foreground/10 bg-background text-foreground lg:hidden"
          >
            <ul className="flex flex-col gap-1 px-5 py-4">
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
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
