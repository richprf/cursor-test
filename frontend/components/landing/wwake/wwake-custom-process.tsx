'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { toPersianNumber } from '@/lib/format';
import { CUSTOM_PROCESS } from '@/lib/wwake-custom';
import { AutoPlayVideo } from './auto-play-video';

export function WwakeCustomProcess() {
  const [active, setActive] = useState(0);
  const step = CUSTOM_PROCESS[active] ?? CUSTOM_PROCESS[0];

  return (
    <section className="ww-custom-process">
      <div className="ww-custom-process-grid">
        <div className="ww-custom-process-list">
          <h2>روند طراحی سفارشی</h2>
          {CUSTOM_PROCESS.map((item, index) => (
            <button
              key={item.title}
              type="button"
              className={index === active ? 'is-on' : undefined}
              onClick={() => setActive(index)}
              onMouseEnter={() => setActive(index)}
            >
              <span>{toPersianNumber(index + 1)}</span>
              <strong>{item.title}</strong>
            </button>
          ))}
        </div>

        <div className="ww-custom-process-copy">
          <p>{step.copy}</p>
          {step.links.length ? (
            <p className="ww-custom-ctas">
              {step.links.map((link) => (
                <Link key={link.label} href={link.href} className="ww-link">
                  {link.label}
                </Link>
              ))}
            </p>
          ) : null}
        </div>

        <div className="ww-custom-process-media">
          {'video' in step && step.video ? (
            <AutoPlayVideo src={step.video} poster={step.image} />
          ) : (
            <Image src={step.image} alt="" fill sizes="(min-width: 990px) 28vw, 90vw" />
          )}
        </div>
      </div>
    </section>
  );
}
