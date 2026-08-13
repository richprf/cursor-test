import Link from 'next/link';
import { auth } from '@/auth';
import { primaryButtonClass, secondaryButtonClass } from '@/components/ui';
import { Brand } from '@/components/brand';

export default async function HomePage() {
  const session = await auth();

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-9 p-6">
      <Brand />

      <div className="w-full max-w-lg space-y-8 text-center">
        <div className="space-y-3">
          <h1 className="text-2xl font-bold sm:text-3xl">
            سرمایه‌گذاری روی <span className="text-gold-gradient">طلا</span>، ساده و امن
          </h1>
          <p className="text-sm leading-7 text-muted">
            با گوگل یا ایمیل و رمز عبور وارد شوید. NextAuth لایهٔ session است و NestJS منبع اصلی
            کاربران و صادرکنندهٔ توکن دسترسی.
          </p>
        </div>

        <div className="mx-auto flex max-w-xs flex-col gap-3">
          {session ? (
            <Link href="/dashboard" className={primaryButtonClass}>
              رفتن به داشبورد
            </Link>
          ) : (
            <>
              <Link href="/login" className={primaryButtonClass}>
                ورود
              </Link>
              <Link href="/register" className={secondaryButtonClass}>
                ثبت‌نام
              </Link>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
