'use client';

import { toPersianNumber } from '@/lib/format';
import { useGoldPrice } from './gold-price-provider';

const TICKER_ITEMS = [
  'خرید طلای آب‌شده با کارمزد صفر',
  '۱۰۰٬۰۰۰+ کاربر فعال',
  '۴٬۲۰۰ میلیارد تومان ارزش طلای نگهداری‌شده',
  '۱۰۰٪ تحویل فیزیکی تضمین‌شده',
  'پشتیبانی و معاملهٔ ۲۴ ساعته',
  'بدون حداقل مبلغ',
];

export function TrustBar() {
  const { current, status } = useGoldPrice();
  const live =
    status === 'live'
      ? `قیمت زنده طلای ۱۸ عیار ${toPersianNumber(current.price)} تومان`
      : 'در حال اتصال به فید قیمت';

  const row = [live, ...TICKER_ITEMS];

  return (
    <div className="overflow-hidden border-b border-foreground/10 bg-foreground py-3.5 text-background">
      <div className="flex w-max animate-marquee" dir="ltr">
        {[0, 1].map((copy) => (
          <div
            key={copy}
            className="flex shrink-0 items-center"
            aria-hidden={copy === 1 || undefined}
          >
            {row.map((item) => (
              <span
                key={`${copy}-${item}`}
                dir="rtl"
                className="flex items-center px-8 text-xs font-medium tracking-[0.16em]"
              >
                <span className="ms-6 text-gold-500" aria-hidden>
                  +
                </span>
                {item}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
