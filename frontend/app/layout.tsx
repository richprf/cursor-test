import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ورود به حساب | NextAuth + NestJS',
  description: 'احراز هویت با گوگل و ایمیل/رمز عبور روی Next.js و NestJS',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fa" dir="rtl">
      <body className="min-h-dvh antialiased">{children}</body>
    </html>
  );
}
