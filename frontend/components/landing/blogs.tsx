'use client';

import Image from 'next/image';
import { Reveal, RevealGroup, RevealItem } from './reveal';

const POSTS = [
  {
    title: 'Turning Data into Strategy: The Power of Predictive Analytics',
    date: 'January 8, 2026',
    image: '/landing/work-product.jpg',
    alt: 'نمای محصول جواهرات',
  },
  {
    title: '5 Ways AI Can Streamline Business Operations',
    date: 'January 8, 2026',
    image: '/landing/work-macro.jpg',
    alt: 'نمای نزدیک طلا و جواهر',
  },
  {
    title: 'Human + Machine: Finding the Perfect Balance',
    date: 'January 8, 2026',
    image: '/landing/whatwedo-1.jpg',
    alt: 'ترکیب طلا و جزئیات ظریف',
  },
  {
    title: 'Turning Data into Strategy: The Power of Predictive Analytics',
    date: 'January 8, 2026',
    image: '/landing/whatwedo-2.jpg',
    alt: 'عکس ادیتوریال جواهرات',
  },
] as const;

export function Blogs() {
  return (
    <section id="blog" dir="ltr" className="blogs-v1 scroll-mt-24">
      <div className="blogs-v1-shell">
        <div className="blogs-v1-grid">
          <Reveal className="blogs-v1-left" y={36}>
            <div className="blogs-v1-heading">
              <p className="about-v1-kicker">
                <span className="about-v1-dot" aria-hidden />
                Blog and articles
              </p>
              <h2 className="blogs-v1-title">Latest insights and trends</h2>
              <p className="blogs-v1-desc">
                Whether you’re optimizing today or building for tomorrow we help you move faster with
                confidence.
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
