import Link from 'next/link';
import { Card } from '@/components/ui';
import { RegisterForm } from './register-form';

export const metadata = { title: 'ثبت‌نام | NextAuth + NestJS' };

export default function RegisterPage() {
  return (
    <main className="flex min-h-dvh items-center justify-center p-6">
      <Card>
        <div className="mb-6 space-y-1.5">
          <h1 className="text-xl font-semibold">ساخت حساب کاربری</h1>
          <p className="text-sm text-muted">با ایمیل و رمز عبور ثبت‌نام کنید.</p>
        </div>

        <RegisterForm />

        <p className="mt-6 text-center text-sm text-muted">
          حساب دارید؟{' '}
          <Link href="/login" className="font-medium text-indigo-600 hover:underline dark:text-indigo-400">
            وارد شوید
          </Link>
        </p>
      </Card>
    </main>
  );
}
