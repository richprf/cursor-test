'use client';

import Image from 'next/image';

export function CatalogThumb({ src, alt }: { src: string; alt: string }) {
  if (!src) return null;
  if (src.startsWith('/uploads/') || src.startsWith('http://') || src.startsWith('https://')) {
    // eslint-disable-next-line @next/next/no-img-element -- upload host is rewritten, not in next.config images
    return <img src={src} alt={alt} className="size-full object-cover" />;
  }
  return <Image src={src} alt={alt} fill sizes="48px" className="object-cover" />;
}
