'use client';

import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { Section, SectionHeading } from './section';
import { EASE_OUT } from './reveal';

const TESTIMONIALS = [
  {
    name: 'سارا محمدی',
    role: 'کارشناس مالی',
    quote:
      'قبلاً برای خرید طلا باید تا بازار می‌رفتم و نگران اجرت و مالیات بودم. حالا هر ماه بخشی از حقوقم را همان‌جا تبدیل به طلا می‌کنم.',
  },
  {
    name: 'امیر رضایی',
    role: 'برنامه‌نویس',
    quote:
      'فروش طلا و برگشت پول به حسابم کمتر از یک ساعت طول کشید. همین سرعت باعث شد پس‌اندازم را کامل به اینجا منتقل کنم.',
  },
  {
    name: 'نگار کاظمی',
    role: 'صاحب کسب‌وکار',
    quote:
      'شمش‌ها را فیزیکی تحویل گرفتم؛ بسته‌بندی پلمب و اصالت‌سنجی داشت. حس امنیتی که به من داد ارزشش را داشت.',
  },
  {
    name: 'حسین طاهری',
    role: 'معلم',
    quote:
      'با مبلغ کم شروع کردم تا مطمئن شوم. الان هشدار قیمت گذاشته‌ام و در افت‌ها خرید می‌کنم؛ خیلی ساده‌تر از آنچه فکر می‌کردم.',
  },
];

const AUTOPLAY_MS = 6500;

export function Testimonials() {
  const [index, setIndex] = useState(0);
  const reduceMotion = useReducedMotion();

  const go = useCallback((direction: 1 | -1) => {
    setIndex((current) => (current + direction + TESTIMONIALS.length) % TESTIMONIALS.length);
  }, []);

  // Auto-advance, unless the visitor asked for less motion.
  useEffect(() => {
    if (reduceMotion) return;
    const timer = setInterval(() => go(1), AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [go, reduceMotion]);

  const active = TESTIMONIALS[index];

  return (
    <Section id="testimonials">
      <SectionHeading
        eyebrow="تجربهٔ کاربران"
        title="بیش از ۱۰۰ هزار نفر با ما طلا می‌خرند"
      />

      <div className="mx-auto mt-12 max-w-3xl">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-surface/60 p-7 backdrop-blur-sm sm:p-9">
          <Quote className="size-8 text-gold-500/40" aria-hidden />

          {/* One slide at a time; AnimatePresence cross-fades the outgoing quote. */}
          <div className="mt-4 min-h-40 sm:min-h-32">
            <AnimatePresence mode="wait">
              <motion.blockquote
                key={active.name}
                initial={{ opacity: 0, x: reduceMotion ? 0 : -24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: reduceMotion ? 0 : 24 }}
                transition={{ duration: 0.45, ease: EASE_OUT }}
              >
                <p className="text-sm leading-8 sm:text-base">«{active.quote}»</p>

                <footer className="mt-5 flex items-center gap-3">
                  <span
                    aria-hidden
                    className="grid size-10 place-items-center rounded-full border border-gold-500/30 bg-gold-500/10 text-sm font-bold text-gold-300"
                  >
                    {active.name.charAt(0)}
                  </span>
                  <span className="text-sm">
                    <span className="block font-semibold">{active.name}</span>
                    <span className="block text-xs text-muted">{active.role}</span>
                  </span>
                </footer>
              </motion.blockquote>
            </AnimatePresence>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between">
          <div className="flex gap-2">
            {TESTIMONIALS.map((testimonial, dotIndex) => (
              <button
                key={testimonial.name}
                type="button"
                onClick={() => setIndex(dotIndex)}
                aria-label={`نظر ${dotIndex + 1}`}
                aria-current={dotIndex === index}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  dotIndex === index ? 'w-7 bg-gold-500' : 'w-3 bg-border hover:bg-gold-500/50'
                }`}
              />
            ))}
          </div>

          <div className="flex gap-2">
            {/* In RTL the previous slide sits to the right. */}
            <CarouselButton label="نظر قبلی" onClick={() => go(-1)}>
              <ChevronRight className="size-4" aria-hidden />
            </CarouselButton>
            <CarouselButton label="نظر بعدی" onClick={() => go(1)}>
              <ChevronLeft className="size-4" aria-hidden />
            </CarouselButton>
          </div>
        </div>
      </div>
    </Section>
  );
}

function CarouselButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="grid size-9 place-items-center rounded-xl border border-border bg-white/[0.03] text-muted transition hover:border-gold-500/50 hover:text-gold-300 focus:outline-none focus:ring-4 focus:ring-gold-500/20"
    >
      {children}
    </button>
  );
}
