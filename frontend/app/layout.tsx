import type { Metadata } from 'next';
import { Vazirmatn } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import './globals.css';

const vazirmatn = Vazirmatn({
  subsets: ['arabic', 'latin'],
  variable: '--font-vazirmatn',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'زرین‌سرمایه | خرید و سرمایه‌گذاری طلا',
    template: '%s | زرین‌سرمایه',
  },
  description: 'خرید، نگهداری و فروش آنلاین طلای ۱۸ عیار با امکان تحویل فیزیکی شمش.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fa" dir="rtl" className={`${vazirmatn.variable} scroll-smooth`} suppressHydrationWarning>
      <body className="min-h-dvh antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
