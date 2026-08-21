'use client';

import { CHART_POINTS } from '@/lib/gold-price';
import { Section, SectionHeading } from './section';
import { Reveal } from './reveal';
import { useGoldPrice } from './gold-price-provider';
import { LivePriceHeadline } from './live-price';
import { LiveGoldChart } from './live-gold-chart';
import { GoldBarVisual } from './gold-bar-visual';

function toPersianCount(value: number): string {
  return value.toLocaleString('en-US').replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[Number(d)]);
}

export function PriceChart() {
  const { intervalMs, simulated, status } = useGoldPrice();

  return (
    <Section id="prices">
      <SectionHeading
        eyebrow="بازار طلا"
        title="قیمت‌ها را لحظه‌ای دنبال کنید"
        description={
          simulated
            ? 'نمودار مستقیماً به فید WebSocket وصل است و با هر قیمت جدید به‌روز می‌شود. در این نسخه فید روی سرور شبیه‌سازی شده است.'
            : 'نمودار مستقیماً به فید WebSocket وصل است و با هر قیمت جدید از بازار به‌روز می‌شود.'
        }
      />

      <div className="grid gap-4 lg:grid-cols-12">
        <Reveal className="lg:col-span-8" y={30}>
          <article className="border border-foreground/15 bg-surface p-5 sm:p-7">
            <div className="mb-2 flex items-center justify-between gap-3 text-[11px] uppercase tracking-[0.18em] text-muted">
              <span>طلای ۱۸ عیار · زنده</span>
              <a href="#how-it-works" className="tracking-tight text-foreground hover:text-gold-700">
                {'>'}مشاهده مسیر خرید{'<'}
              </a>
            </div>

            <LivePriceHeadline />
            <LiveGoldChart />

            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-[11px] text-muted">
              <span>بازهٔ نمایش: {toPersianCount(CHART_POINTS)} به‌روزرسانی اخیر</span>
              <span className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1 ${status === 'live' ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}
                >
                  <span className="size-1.5 rounded-full bg-current" aria-hidden />
                  {status === 'live'
                    ? 'نمودار زنده'
                    : status === 'connecting'
                      ? 'در حال اتصال نمودار…'
                      : 'آخرین دادهٔ دریافتی'}
                </span>
                <span>•</span>
                <span>هر {toPersianCount(Math.round(intervalMs / 1000))} ثانیه یک نقطهٔ جدید</span>
              </span>
            </div>
          </article>
        </Reveal>

        <Reveal className="lg:col-span-4" delay={0.1} y={40}>
          <article className="flex h-full flex-col justify-between border border-foreground/15 bg-background-elevated p-6 sm:p-8">
            <div>
              <p className="text-[11px] uppercase tracking-[0.18em] text-muted">۰۱ — پنل بازار</p>
              <h3 className="mt-6 text-3xl font-semibold tracking-tight">همان قیمت، همان لحظه.</h3>
              <p className="mt-4 text-sm leading-7 text-muted">
                فید قیمت روی سرور تیک می‌فرستد و کلاینت همان را روی نمودار می‌نشاند؛ بدون تازه‌سازی صفحه.
              </p>
            </div>
            <GoldBarVisual className="mx-auto mt-8 w-full max-w-[220px]" />
          </article>
        </Reveal>
      </div>
    </Section>
  );
}
