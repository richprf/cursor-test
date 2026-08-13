'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Brand } from '@/components/brand';
import { EASE_OUT } from './reveal';

const NAV_LINKS = [
  { href: '#features', label: 'ویژگی‌ها' },
  { href: '#how-it-works', label: 'نحوهٔ کار' },
  { href: '#prices', label: 'قیمت طلا' },
  { href: '#faq', label: 'سوالات متداول' },
];

export function SiteHeader({ ctaHref, ctaLabel }: { ctaHref: string; ctaLabel: string }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { scrollY } = useScroll();

  // The bar only gets its background once the page has moved.
  useMotionValueEvent(scrollY, 'change', (latest) => setIsScrolled(latest > 24));

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        isScrolled || isMenuOpen
          ? 'border-b border-border/80 bg-background/85 backdrop-blur-xl'
          : 'border-b border-transparent'
      }`}
    >
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-5 py-3.5 sm:px-8">
        <Link href="/" aria-label="زرین‌سرمایه">
          <Brand />
        </Link>

        <nav className="hidden items-center gap-7 text-sm text-muted lg:flex">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} className="transition hover:text-gold-300">
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href={ctaHref}
            className="rounded-xl border border-gold-500/30 bg-gold-500/[0.08] px-4 py-2 text-sm font-semibold text-gold-300 transition hover:border-gold-500/60 hover:bg-gold-500/[0.14]"
          >
            {ctaLabel}
          </Link>

          <button
            type="button"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-expanded={isMenuOpen}
            aria-label={isMenuOpen ? 'بستن منو' : 'باز کردن منو'}
            className="grid size-9 place-items-center rounded-xl border border-border text-muted transition hover:text-gold-300 lg:hidden"
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
            className="overflow-hidden lg:hidden"
          >
            <ul className="mx-auto flex w-full max-w-6xl flex-col gap-1 px-5 pb-4 sm:px-8">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="block rounded-xl px-3 py-2.5 text-sm text-muted transition hover:bg-white/[0.04] hover:text-gold-300"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
