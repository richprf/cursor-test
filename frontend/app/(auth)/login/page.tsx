import { authErrorMessage } from '@/lib/auth-errors';
import { AuthFrame } from '@/components/auth/auth-frame';
import { LoginForm } from './login-form';

export const metadata = { title: 'Log in' };

/** NextAuth redirects failed sign-ins back here with `?error=` and sometimes `?code=`. */
export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string; error?: string; code?: string }>;
}) {
  const { callbackUrl, error, code } = await searchParams;

  return (
    <AuthFrame title="Log in">
      <LoginForm
        // Only allow relative paths, so `?callbackUrl=` can't bounce users off-site.
        callbackUrl={isSafeRelativePath(callbackUrl) ? callbackUrl : '/dashboard'}
        initialError={authErrorMessage(error, code)}
      />
    </AuthFrame>
  );
}

function isSafeRelativePath(value?: string): value is string {
  return Boolean(value?.startsWith('/') && !value.startsWith('//'));
}
