import { type ReactNode } from 'react';
import { Inter } from 'next/font/google';
import './auth.css';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
});

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className={`${inter.variable} ${inter.className}`} dir="ltr" lang="en">
      {children}
    </div>
  );
}
