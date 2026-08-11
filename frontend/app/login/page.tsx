import Link from 'next/link';
import { authErrorMessage } from '@/lib/auth-errors';
import { Card } from '@/components/ui';
import { LoginForm } from './login-form';

export const metadata = { title: 'ورود | NextAuth + NestJS' };

/** NextAuth redirects failed sign-ins back here with `?error=` and sometimes `?code=`. */
export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string; error?: string; code?: string }>;
}) {
  const { callbackUrl, error, code } = await searchParams;

  return (
    <main className="flex min-h-dvh items-center justify-center p-6">
      <Card>
        <div className="mb-6 space-y-1.5">
          <h1 className="text-xl font-semibold">ورود به حساب</h1>
          <p className="text-sm text-muted">با ایمیل و رمز عبور یا حساب گوگل خود وارد شوید.</p>
        </div>

        <LoginForm
          // Only allow relative paths, so `?callbackUrl=` can't bounce users off-site.
          callbackUrl={isSafeRelativePath(callbackUrl) ? callbackUrl : '/dashboard'}
          initialError={authErrorMessage(error, code)}
        />

        <p className="mt-6 text-center text-sm text-muted">
          حساب ندارید؟{' '}
          <Link href="/register" className="font-medium text-indigo-600 hover:underline dark:text-indigo-400">
            ثبت‌نام کنید
          </Link>
        </p>
      </Card>
    </main>
  );
}

function isSafeRelativePath(value?: string): value is string {
  return Boolean(value?.startsWith('/') && !value.startsWith('//'));
}
