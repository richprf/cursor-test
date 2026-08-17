'use client';

import { CHART_POINTS } from '@/lib/gold-price';
import { Section, SectionHeading } from './section';
import { Reveal } from './reveal';
import { useGoldPrice } from './gold-price-provider';
import { LivePriceHeadline } from './live-price';
import { LiveGoldChart } from './live-gold-chart';

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

      <Reveal className="mt-12" y={30}>
        <div className="rounded-3xl border border-border bg-surface p-5 shadow-xl shadow-black/[0.06] theme-fade sm:p-7">
          <LivePriceHeadline />

          <LiveGoldChart />

          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-[11px] text-muted">
            <span>بازهٔ نمایش: {toPersianCount(CHART_POINTS)} به‌روزرسانی اخیر</span>
            <span className="flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1 ${status === 'live' ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}
              >
                <span className="size-1.5 rounded-full bg-current" aria-hidden />
                {status === 'live' ? 'نمودار زنده' : status === 'connecting' ? 'در حال اتصال نمودار…' : 'آخرین دادهٔ دریافتی'}
              </span>
              <span>•</span>
              <span>هر {toPersianCount(Math.round(intervalMs / 1000))} ثانیه یک نقطهٔ جدید</span>
            </span>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
