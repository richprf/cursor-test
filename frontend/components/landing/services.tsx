'use client';

import Image from 'next/image';
import { Reveal, RevealGroup, RevealItem } from './reveal';

const SERVICES = [
  {
    title: 'آگهی طلافروشان',
    description: 'مغازه‌دار طلاهایش را خودش لیست می‌کند؛ قیمت و مشخصات از همان فروشنده است.',
    icon: '/landing/icons/ai-fill-neon.svg',
  },
  {
    title: 'مشاهده و مقایسه',
    description: 'مشتری آگهی‌ها را می‌بیند، مقایسه می‌کند و همان طلافروش را انتخاب می‌کند.',
    icon: '/landing/icons/phone-filled.svg',
  },
  {
    title: 'حضوری یا پیک',
    description: 'از همان مغازه بخرید، یا ما طلا را برایتان با پیک می‌آوریم.',
    icon: '/landing/icons/box-fill.svg',
  },
];

export function Services() {
  return (
    <section id="services" className="services-v1 scroll-mt-24">
      <div className="services-v1-shell">
        <Reveal className="services-v1-heading" y={36}>
          <div className="services-v1-title">
            <p className="about-v1-kicker">
              <span className="about-v1-dot" aria-hidden />
              خدمات
            </p>
            <h2 className="services-v1-headline">
              پلی میان طلافروش
              <br />
              و مشتری
            </h2>
            <p className="services-v1-desc">
              آگهی بگذارید، ببینید، حضوری بخرید یا پیک بگیرید. پژواک خودش طلا نمی‌فروشد.
            </p>
          </div>
          <a href="#features" className="about-v1-btn">
            مشاهدهٔ خدمات
          </a>
        </Reveal>

        <RevealGroup className="services-v1-grid" stagger={0.1}>
          {SERVICES.map((service) => (
            <RevealItem key={service.title}>
              <article className="services-v1-card">
                <div className="services-v1-card-heading">
                  <span className="services-v1-icon" aria-hidden>
                    <Image src={service.icon} alt="" width={24} height={24} />
                  </span>
                  <h3 className="services-v1-card-title">{service.title}</h3>
                </div>
                <p className="services-v1-card-desc">{service.description}</p>
              </article>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
