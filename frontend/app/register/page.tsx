import Link from 'next/link';
import { Card } from '@/components/ui';
import { Brand } from '@/components/brand';
import { RegisterForm } from './register-form';

export const metadata = { title: 'ثبت‌نام | زرین‌سرمایه' };

export default function RegisterPage() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-7 p-6">
      <Brand />

      <Card>
        <div className="mb-7 space-y-2 text-center">
          <h1 className="text-xl font-bold">ساخت حساب کاربری</h1>
          <p className="text-sm leading-6 text-muted">
            در چند ثانیه حساب بسازید و سرمایه‌گذاری روی طلا را شروع کنید.
          </p>
        </div>

        <RegisterForm />

        <p className="mt-7 text-center text-sm text-muted">
          حساب دارید؟{' '}
          <Link href="/login" className="font-medium text-gold-300 hover:text-gold-100">
            وارد شوید
          </Link>
        </p>
      </Card>
    </main>
  );
}
