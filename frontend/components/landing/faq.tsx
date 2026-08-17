'use client';

import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { Section, SectionHeading } from './section';
import { EASE_OUT } from './reveal';

const FAQS = [
  {
    question: 'طلای خریداری‌شده کجا نگهداری می‌شود؟',
    answer:
      'طلای شما به‌صورت شمش در خزانهٔ بانکی نگهداری و تا سقف کامل ارزش آن بیمه می‌شود. هر زمان بخواهید می‌توانید درخواست تحویل فیزیکی ثبت کنید.',
  },
  {
    question: 'حداقل مبلغ برای خرید چقدر است؟',
    answer:
      'حداقلی وجود ندارد؛ می‌توانید از مبالغ کوچک شروع کنید و به‌صورت پله‌ای خرید خود را افزایش دهید.',
  },
  {
    question: 'کارمزد خرید و فروش چقدر است؟',
    answer:
      'خرید و فروش طلای آب‌شده بدون کارمزد انجام می‌شود و تنها اختلاف قیمت خرید و فروش بازار اعمال می‌گردد. کارمزد تحویل فیزیکی پیش از ثبت درخواست به شما نمایش داده می‌شود.',
  },
  {
    question: 'فروش طلا چقدر طول می‌کشد؟',
    answer:
      'فروش در همان لحظه انجام می‌شود و مبلغ به کیف پول شما واریز می‌گردد. برداشت به حساب بانکی بسته به زمان تسویهٔ بانکی، از چند دقیقه تا چند ساعت زمان می‌برد.',
  },
  {
    question: 'آیا می‌توانم با حساب گوگل وارد شوم؟',
    answer:
      'بله. ورود با گوگل و همچنین ورود با ایمیل و رمز عبور پشتیبانی می‌شود و در هر دو حالت حساب شما یکی است.',
  },
];

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const reduceMotion = useReducedMotion();

  return (
    <Section id="faq">
      <SectionHeading eyebrow="سوالات متداول" title="پاسخ سوال‌های پرتکرار" />

      <div className="mx-auto mt-12 max-w-3xl divide-y divide-border overflow-hidden rounded-3xl border border-border bg-surface shadow-lg shadow-black/[0.05] theme-fade">
        {FAQS.map((faq, index) => {
          const isOpen = openIndex === index;

          return (
            <div key={faq.question}>
              <h3>
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-panel-${index}`}
                  className="flex w-full items-center justify-between gap-4 px-5 py-5 text-right text-sm font-semibold transition hover:text-gold-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-gold-500/20 sm:px-6"
                >
                  {faq.question}
                  <motion.span
                    aria-hidden
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.3, ease: EASE_OUT }}
                    className={`grid size-7 shrink-0 place-items-center rounded-lg border transition-colors ${
                      isOpen
                        ? 'border-gold-500/50 bg-gold-500/10 text-gold-700'
                        : 'border-border text-muted'
                    }`}
                  >
                    <Plus className="size-4" />
                  </motion.span>
                </button>
              </h3>

              {/* Height animation is what makes an accordion feel right, so it is the
                  one place on the page where a layout property is animated. */}
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    id={`faq-panel-${index}`}
                    key="panel"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{
                      duration: reduceMotion ? 0 : 0.35,
                      ease: EASE_OUT,
                    }}
                    className="overflow-hidden"
                  >
                    <p className="px-5 pb-5 text-sm leading-8 text-muted sm:px-6">{faq.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
