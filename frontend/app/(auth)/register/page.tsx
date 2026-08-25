import Link from 'next/link';
import { RegisterForm } from './register-form';

export const metadata = { title: 'ثبت‌نام' };

export default function RegisterPage() {
  return (
    <section className="auth-page">
      <div className="auth-panel">
        <Link href="/" className="auth-brand">
          پژواک
        </Link>
        <h1>ساخت حساب</h1>
        <p className="auth-lead">حساب بسازید؛ مشتری باشید یا طلافروش.</p>
        <RegisterForm />
      </div>
    </section>
  );
}
