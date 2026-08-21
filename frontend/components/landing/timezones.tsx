'use client';

import { useEffect, useState } from 'react';
import { Section } from './section';
import { Reveal } from './reveal';

const ZONES = [
  { id: 'tehran', label: 'تهران (دفتر)', tz: 'Asia/Tehran' },
  { id: 'dubai', label: 'دبی', tz: 'Asia/Dubai' },
  { id: 'istanbul', label: 'استانبول', tz: 'Europe/Istanbul' },
  { id: 'london', label: 'لندن', tz: 'Europe/London' },
  { id: 'newyork', label: 'نیویورک', tz: 'America/New_York' },
];

function formatTime(timeZone: string, now: Date) {
  return new Intl.DateTimeFormat('fa-IR', {
    timeZone,
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(now);
}

export function Timezones() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <Section id="timezones" className="min-h-[70dvh]">
      <Reveal y={48} className="max-w-4xl">
        <h2 className="display-tight text-[clamp(1.9rem,4.8vw,4rem)] font-semibold">
          <span className="text-muted">کجا هستیم. </span>
          در چند منطقهٔ زمانی کار می‌کنیم.
        </h2>
      </Reveal>

      <ul className="mt-16 divide-y divide-foreground/15 border-y border-foreground/15">
        {ZONES.map((zone) => (
          <li key={zone.id} className="flex items-baseline justify-between gap-6 py-6">
            <span className="text-lg font-medium sm:text-2xl">{zone.label}</span>
            <span className="tabular-nums text-xl text-muted sm:text-3xl">
              ({formatTime(zone.tz, now)})
            </span>
          </li>
        ))}
      </ul>
    </Section>
  );
}
