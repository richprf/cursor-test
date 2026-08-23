'use client';

import Image from 'next/image';
import { Reveal, RevealGroup, RevealItem } from './reveal';

const POSTS = [
  {
    title: 'چطور طلای آگهی‌شده را از خود طلافروش بخرید',
    date: '۸ ژانویه ۲۰۲۶',
    image: '/landing/work-product.jpg',
    alt: 'نمای محصول جواهرات',
  },
  {
    title: 'پیک طلا: از مغازه تا در خانه',
    date: '۸ ژانویه ۲۰۲۶',
    image: '/landing/work-macro.jpg',
    alt: 'نمای نزدیک طلا و جواهر',
  },
  {
    title: 'طلافروش‌ها چطور روی زرین‌سرمایه آگهی می‌گذارند',
    date: '۸ ژانویه ۲۰۲۶',
    image: '/landing/whatwedo-1.jpg',
    alt: 'ترکیب طلا و جزئیات ظریف',
  },
  {
    title: 'خرید حضوری یا پیک؛ کدام برای شما بهتر است',
    date: '۸ ژانویه ۲۰۲۶',
    image: '/landing/whatwedo-2.jpg',
    alt: 'عکس ادیتوریال جواهرات',
  },
] as const;

export function Blogs() {
  return (
    <section id="blog" className="blogs-v1 scroll-mt-24">
      <div className="blogs-v1-shell">
        <div className="blogs-v1-grid">
          <Reveal className="blogs-v1-left" y={36}>
            <div className="blogs-v1-heading">
              <p className="about-v1-kicker">
                <span className="about-v1-dot" aria-hidden />
                وبلاگ و مقالات
              </p>
              <h2 className="blogs-v1-title">راهنمای آگهی و خرید از طلافروش</h2>
              <p className="blogs-v1-desc">
                از ثبت آگهی مغازه تا خرید حضوری یا پیک؛ همین‌جا بخوانید.
              </p>
            </div>
          </Reveal>

          <RevealGroup className="blogs-v1-list" stagger={0.08}>
            {POSTS.map((post, index) => (
              <RevealItem key={`${post.title}-${index}`}>
                <a href="#blog" className="blogs-v1-card">
                  <div className="blogs-v1-img">
                    <Image
                      src={post.image}
                      alt={post.alt}
                      fill
                      sizes="(min-width: 992px) 28vw, 90vw"
                      className="blogs-v1-photo"
                    />
                  </div>
                  <div className="blogs-v1-info">
                    <p className="blogs-v1-date">{post.date}</p>
                    <h3 className="blogs-v1-card-title">{post.title}</h3>
                  </div>
                </a>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </div>
    </section>
  );
}
