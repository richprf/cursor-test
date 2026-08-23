'use client';

import { useState } from 'react';
import Image from 'next/image';
import { toPersianNumber } from '@/lib/format';
import { STACK_PINS } from '@/lib/wwake-data';

export function WwakeStacking() {
  const [active, setActive] = useState(0);

  return (
    <section className="ww-stack">
      <div className="ww-stack-media">
        <Image
          src="/landing/wwake/stack-banner.jpg"
          alt=""
          fill
          sizes="100vw"
          className="hidden md:block"
        />
        <Image
          src="/landing/wwake/stack-portrait.jpg"
          alt=""
          fill
          sizes="100vw"
          className="md:hidden"
        />
        {STACK_PINS.map((pin, index) => (
          <button
            key={pin.index}
            type="button"
            className={`ww-pin${index === active ? ' is-on' : ''}`}
            style={{ left: pin.left, top: pin.top }}
            onMouseEnter={() => setActive(index)}
            onClick={() => setActive(index)}
          >
            {pin.index}.
          </button>
        ))}
      </div>

      <div className="ww-stack-head">
        <h2>گردنبند</h2>
        <a href="#shop" className="ww-link">
          خرید
        </a>
        <span>[۶۹]</span>
      </div>

      <div className="ww-stack-rail">
        {STACK_PINS.map((pin, index) => (
          <button
            key={pin.title}
            type="button"
            className={`ww-stack-item${index === active ? ' is-on' : ''}`}
            onMouseEnter={() => setActive(index)}
            onClick={() => setActive(index)}
          >
            <Image src={pin.image} alt="" width={68} height={85} />
            <span>
              <strong>
                {pin.index} {pin.title}
              </strong>
              <span className="ww-link">خرید</span>
            </span>
          </button>
        ))}
        <div className="ww-pager">
          <button type="button" onClick={() => setActive((i) => (i + STACK_PINS.length - 1) % STACK_PINS.length)}>
            [ &lt; ]
          </button>
          <span>
            [{toPersianNumber(active + 1)}/{toPersianNumber(STACK_PINS.length)}]
          </span>
          <button type="button" onClick={() => setActive((i) => (i + 1) % STACK_PINS.length)}>
            [ &gt; ]
          </button>
        </div>
      </div>
    </section>
  );
}
