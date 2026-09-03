'use client';

import { useState } from 'react';
import { CUSTOM_FAQ } from '@/lib/wwake-custom';
import { toPersianNumber } from '@/lib/format';

export function WwakeCustomFaq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="ww-custom-faq">
      <h2>پرسش‌ها</h2>
      <div className="ww-accordion">
        {CUSTOM_FAQ.map((item, index) => {
          const isOpen = open === index;
          return (
            <div key={item.q}>
              <button
                type="button"
                className="ww-acc-head"
                onClick={() => setOpen(isOpen ? null : index)}
              >
                <span>{toPersianNumber(index + 1)}</span>
                <span className="ww-acc-title">{item.q}</span>
                <span className="ww-acc-count">{isOpen ? '[−]' : '[+]'}</span>
              </button>
              {isOpen ? (
                <div className="ww-acc-body ww-custom-faq-body">
                  <p>{item.a}</p>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}
