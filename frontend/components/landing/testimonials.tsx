'use client';

import { Quote } from 'lucide-react';
import { Section, SectionHeading } from './section';
import { RevealGroup, RevealItem } from './reveal';

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

export function Testimonials() {
  return (
    <Section id="testimonials">
      <SectionHeading
        eyebrow="تجربهٔ کاربران"
        title="بیش از ۱۰۰ هزار نفر با ما طلا می‌خرند"
      />

      <RevealGroup className="grid gap-4 sm:grid-cols-2">
        {TESTIMONIALS.map((item, index) => (
          <RevealItem key={item.name} className={index % 2 === 1 ? 'sm:mt-8' : undefined}>
            <article className="flex h-full flex-col justify-between border border-foreground/15 bg-surface p-7 sm:p-9">
              <Quote className="size-7 text-gold-500/50" aria-hidden />
              <blockquote className="mt-6">
                <p className="text-lg font-medium leading-9 tracking-tight sm:text-xl">
                  «{item.quote}»
                </p>
                <footer className="mt-8 text-sm">
                  <span className="block font-semibold">{item.name}</span>
                  <span className="block text-muted">{item.role}</span>
                </footer>
              </blockquote>
              <p className="mt-8 text-xs tracking-tight text-gold-700">
                {'>'}
                {item.name}
                {'<'}
              </p>
            </article>
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}
