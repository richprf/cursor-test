import type { Metadata } from 'next';
import { Vazirmatn } from 'next/font/google';
import './globals.css';

// Persian-first font; `arabic` covers the Persian glyphs, `latin` the emails/ids.
const vazirmatn = Vazirmatn({
  subsets: ['arabic', 'latin'],
  variable: '--font-vazirmatn',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'ورود به حساب | زرین‌سرمایه',
  description: 'خرید و سرمایه‌گذاری طلا — ورود با گوگل یا ایمیل و رمز عبور',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fa" dir="rtl" className={vazirmatn.variable}>
      <body className="min-h-dvh antialiased">{children}</body>
    </html>
  );
}
