'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { toPersianNumber } from '@/lib/format';
import { STACK_PINS } from '@/lib/wwake-data';
import { collectionHref } from '@/lib/wwake-collections';

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
        <Link href={collectionHref('necklaces')} className="ww-link">
          خرید
        </Link>
        <span>[۶۹]</span>
      </div>

      <div className="ww-stack-rail">
        {STACK_PINS.map((pin, index) => (
          <div
            key={pin.title}
            className={`ww-stack-item${index === active ? ' is-on' : ''}`}
            onMouseEnter={() => setActive(index)}
            onClick={() => setActive(index)}
            role="button"
            tabIndex={0}
          >
            <Image src={pin.image} alt="" width={68} height={85} />
            <span>
              <strong>
                {pin.index} {pin.title}
              </strong>
              <Link href={collectionHref('necklaces')} className="ww-link" onClick={(event) => event.stopPropagation()}>
                خرید
              </Link>
            </span>
          </div>
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
