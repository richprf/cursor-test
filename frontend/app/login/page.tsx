import { AuthShell } from '@/components/auth/auth-shell';
import { authErrorMessage } from '@/lib/auth-errors';
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
    <AuthShell>
      <section className="auth-page">
        <div className="auth-panel">
          <h1>ورود به حساب</h1>
          <p className="auth-lead">با ایمیل یا گوگل وارد شوید.</p>
          <LoginForm
            // Only allow relative paths, so `?callbackUrl=` can't bounce users off-site.
            callbackUrl={isSafeRelativePath(callbackUrl) ? callbackUrl : '/dashboard'}
            initialError={authErrorMessage(error, code)}
          />
        </div>
      </section>
    </AuthShell>
  );
}

function isSafeRelativePath(value?: string): value is string {
  return Boolean(value?.startsWith('/') && !value.startsWith('//'));
}
