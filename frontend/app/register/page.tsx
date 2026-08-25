import { AuthShell } from '@/components/auth/auth-shell';
import { RegisterForm } from './register-form';

export const metadata = { title: 'ثبت‌نام' };

export default function RegisterPage() {
  return (
    <AuthShell>
      <section className="auth-page">
        <div className="auth-panel">
          <h1>ساخت حساب</h1>
          <p className="auth-lead">حساب بسازید؛ مشتری باشید یا طلافروش.</p>
          <RegisterForm />
        </div>
      </section>
    </AuthShell>
  );
}
