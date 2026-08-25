'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import { loginSchema, type LoginInput } from '@/lib/validation';
import { authErrorMessage } from '@/lib/auth-errors';
import { Spinner } from '@/components/ui';

export function LoginForm({
  callbackUrl,
  initialError,
}: {
  callbackUrl: string;
  initialError: string | null;
}) {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(initialError);
  const [googlePending, setGooglePending] = useState(false);
  // Sign-in succeeded and we are waiting for the navigation to `callbackUrl`.
  const [redirecting, setRedirecting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);

    // `redirect: false` keeps the user on the page so errors can be shown inline.
    const result = await signIn('credentials', { ...values, redirect: false });

    if (result?.error) {
      setFormError(authErrorMessage(result.error, result.code));
      return;
    }

    setRedirecting(true);
    router.replace(callbackUrl);
    router.refresh(); // re-render server components with the new session
  });

  const pending = isSubmitting || redirecting;
  const disabled = pending || googlePending;

  return (
    <div className="auth-stack">
      {formError ? <p className="auth-alert">{formError}</p> : null}

      <form onSubmit={onSubmit} className="auth-form" noValidate>
        <div className="auth-field">
          <label htmlFor="email">ایمیل</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            dir="ltr"
            placeholder="ایمیل شما"
            disabled={disabled}
            aria-invalid={Boolean(errors.email)}
            {...register('email')}
          />
          {errors.email?.message ? <p className="auth-field-error">{errors.email.message}</p> : null}
        </div>

        <div className="auth-field">
          <label htmlFor="password">رمز عبور</label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            placeholder="رمز عبور"
            disabled={disabled}
            aria-invalid={Boolean(errors.password)}
            {...register('password')}
          />
          {errors.password?.message ? <p className="auth-field-error">{errors.password.message}</p> : null}
        </div>

        <div className="auth-actions">
          <button type="submit" className="ww-link" disabled={disabled}>
            {pending && <Spinner />}
            {pending ? 'در حال ورود…' : 'ورود'}
          </button>
        </div>
      </form>

      <p className="auth-split">
        <span />
        یا
        <span />
      </p>

      <div className="auth-actions">
        <button
          type="button"
          className="auth-google ww-link"
          disabled={disabled}
          onClick={() => {
            setGooglePending(true);
            // Full redirect to Google; NextAuth returns to `callbackUrl` afterwards.
            void signIn('google', { redirectTo: callbackUrl });
          }}
        >
          {googlePending ? <Spinner /> : null}
          ورود با گوگل
        </button>
      </div>

      <p className="auth-switch">
        حساب ندارید؟{' '}
        <Link href="/register" className="ww-link">
          ثبت‌نام
        </Link>
      </p>
      <Link href="/" className="auth-back ww-link">
        بازگشت به فروشگاه
      </Link>
    </div>
  );
}
