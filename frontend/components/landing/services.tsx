'use client';

import Image from 'next/image';
import { Reveal, RevealGroup, RevealItem } from './reveal';

const SERVICES = [
  {
    title: 'خرید و سرمایه‌گذاری',
    description: 'از هر مبلغی طلای ۱۸ عیار بخرید؛ بدون حداقل و با مسیر شفاف از ثبت‌نام تا داشبورد.',
    icon: '/landing/icons/ai-fill-neon.svg',
  },
  {
    title: 'قیمت زنده و دیجیتال',
    description: 'نمودار لحظه‌ای و اتصال زنده تا تصمیم خرید و فروش را روی عدد واقعی بگیرید.',
    icon: '/landing/icons/phone-filled.svg',
  },
  {
    title: 'خزانه و تحویل فیزیکی',
    description: 'طلا را در خزانهٔ بیمه‌شده نگه دارید یا هر زمان که خواستید به‌صورت شمش تحویل بگیرید.',
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
              تخصص، بر پایهٔ تجربه
              <br />
              و شناخت بازار طلا
            </h2>
            <p className="services-v1-desc">
              راه‌حل‌هایی شفاف برای خرید، نگهداری و تحویل طلا؛ از قیمت زنده تا تحویل فیزیکی.
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
