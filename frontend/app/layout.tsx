import type { Metadata } from 'next';
import { Noto_Sans_Arabic, Poppins } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import './globals.css';

const notoArabic = Noto_Sans_Arabic({
  subsets: ['arabic'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-arabic',
  display: 'swap',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'زرین‌سرمایه | آگهی طلای طلافروشان',
    template: '%s | زرین‌سرمایه',
  },
  description:
    'طلافروش‌ها طلایشان را آگهی می‌کنند؛ شما می‌بینید و از همان مغازه می‌خرید یا با پیک دریافت می‌کنید.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="fa"
      dir="rtl"
      className={`${notoArabic.variable} ${poppins.variable} scroll-smooth`}
      suppressHydrationWarning
    >
      <body className="min-h-dvh antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
