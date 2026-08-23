import type { Metadata } from 'next';
import { Poppins, Vazirmatn } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import './globals.css';

const vazirmatn = Vazirmatn({
  subsets: ['arabic', 'latin'],
  weight: '700',
  variable: '--font-vazirmatn',
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
    default: 'زرین‌سرمایه | خرید و سرمایه‌گذاری طلا',
    template: '%s | زرین‌سرمایه',
  },
  description: 'خرید، نگهداری و فروش آنلاین طلای ۱۸ عیار با امکان تحویل فیزیکی شمش.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="fa"
      dir="rtl"
      className={`${vazirmatn.variable} ${poppins.variable} scroll-smooth`}
      suppressHydrationWarning
    >
      <body className="min-h-dvh antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
