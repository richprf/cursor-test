import Link from 'next/link';
import { authErrorMessage } from '@/lib/auth-errors';
import { Card, ShieldIcon } from '@/components/ui';
import { Brand } from '@/components/brand';
import { LoginForm } from './login-form';

export const metadata = { title: 'ورود' };

/** NextAuth redirects failed sign-ins back here with `?error=` and sometimes `?code=`. */
export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string; error?: string; code?: string }>;
}) {
  const { callbackUrl, error, code } = await searchParams;

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-7 p-6">
      <Brand />

      <Card>
        <div className="mb-7 space-y-2 text-center">
          <h1 className="text-xl font-bold">ورود به حساب</h1>
          <p className="text-sm leading-6 text-muted">
            برای خرید و مدیریت طلای خود، با ایمیل یا حساب گوگل وارد شوید.
          </p>
        </div>

        <LoginForm
          // Only allow relative paths, so `?callbackUrl=` can't bounce users off-site.
          callbackUrl={isSafeRelativePath(callbackUrl) ? callbackUrl : '/dashboard'}
          initialError={authErrorMessage(error, code)}
        />

        <p className="mt-7 text-center text-sm text-muted">
          حساب ندارید؟{' '}
          <Link href="/register" className="font-medium text-gold-700 hover:text-gold-800">
            ثبت‌نام کنید
          </Link>
        </p>
      </Card>

      <p className="flex items-center gap-1.5 text-xs text-muted">
        <ShieldIcon className="size-3.5 text-gold-700" />
        ورود شما روی بستر رمزنگاری‌شده انجام می‌شود.
      </p>
    </main>
  );
}

function isSafeRelativePath(value?: string): value is string {
  return Boolean(value?.startsWith('/') && !value.startsWith('//'));
}
