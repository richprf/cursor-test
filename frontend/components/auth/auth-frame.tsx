import Link from 'next/link';
import Image from 'next/image';
import { type ReactNode } from 'react';

export function AuthFrame({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="shop-auth">
      <section className="shop-auth-pane">
        <Link href="/" className="shop-auth-logo">
          پژواک
        </Link>
        <div className="shop-auth-card">
          <h1>{title}</h1>
          {children}
        </div>
      </section>
      <aside className="shop-auth-media" aria-hidden>
        <Image src="/landing/wwake/auth-side.jpg" alt="" fill priority sizes="50vw" />
      </aside>
    </div>
  );
}
