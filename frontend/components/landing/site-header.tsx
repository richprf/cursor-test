'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Brand } from '@/components/brand';
import { ThemeToggle } from '@/components/theme-toggle';
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
      className={`fixed inset-x-0 top-0 z-50 theme-fade transition-colors duration-300 ${
        isScrolled || isMenuOpen
          ? 'border-b border-foreground/15 bg-background/95 backdrop-blur-md'
          : 'border-b border-transparent'
      }`}
    >
      <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between gap-4 px-5 sm:px-8 lg:px-12">
        <Link href="/" aria-label="زرین‌سرمایه">
          <Brand compact />
        </Link>

        <nav className="hidden items-center gap-8 text-[13px] font-medium tracking-tight text-muted lg:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="relative ps-3 transition hover:text-foreground before:absolute before:start-0 before:top-1/2 before:size-1.5 before:-translate-y-1/2 before:rounded-full before:bg-gold-500 before:opacity-0 before:transition-opacity hover:before:opacity-100"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle className="rounded-none" />
          <Link
            href={ctaHref}
            className="border border-foreground/20 px-3.5 py-1.5 text-xs font-semibold tracking-tight transition hover:border-gold-500 hover:text-gold-700"
          >
            {ctaLabel}
          </Link>

          <button
            type="button"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-expanded={isMenuOpen}
            aria-label={isMenuOpen ? 'بستن منو' : 'باز کردن منو'}
            className="grid size-9 place-items-center border border-foreground/15 text-muted transition hover:text-gold-700 lg:hidden"
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
            className="overflow-hidden border-t border-foreground/10 lg:hidden"
          >
            <ul className="mx-auto flex w-full max-w-7xl flex-col gap-1 px-5 py-4 sm:px-8">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-1 py-2.5 text-sm text-muted transition hover:text-foreground"
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
