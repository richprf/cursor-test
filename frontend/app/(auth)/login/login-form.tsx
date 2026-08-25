'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import { loginSchema, type LoginInput } from '@/lib/validation';
import { authErrorMessage } from '@/lib/auth-errors';
import { GoogleIcon, Spinner } from '@/components/ui';

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
    <>
      {formError ? <p className="shop-auth-alert">{formError}</p> : null}

      <form onSubmit={onSubmit} className="shop-auth-form" noValidate>
        <div className="shop-auth-field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            dir="ltr"
            placeholder="Email"
            disabled={disabled}
            aria-invalid={Boolean(errors.email)}
            {...register('email')}
          />
          {errors.email?.message ? <p className="shop-auth-field-error">{errors.email.message}</p> : null}
        </div>

        <div className="shop-auth-field">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            placeholder="Password"
            disabled={disabled}
            aria-invalid={Boolean(errors.password)}
            {...register('password')}
          />
          {errors.password?.message ? <p className="shop-auth-field-error">{errors.password.message}</p> : null}
        </div>

        <button type="submit" className="shop-auth-submit" disabled={disabled}>
          {pending && <Spinner />}
          {pending ? 'Signing in…' : 'Continue'}
        </button>
      </form>

      <p className="shop-auth-or">or</p>

      <button
        type="button"
        className="shop-auth-google"
        disabled={disabled}
        onClick={() => {
          setGooglePending(true);
          // Full redirect to Google; NextAuth returns to `callbackUrl` afterwards.
          void signIn('google', { redirectTo: callbackUrl });
        }}
      >
        {googlePending ? <Spinner /> : <GoogleIcon />}
        Continue with Google
      </button>

      <p className="shop-auth-switch">
        Don&apos;t have an account? <Link href="/register">Create account</Link>
      </p>
      <p className="shop-auth-legal">
        <Link href="/">Privacy</Link>
        {' · '}
        <Link href="/">Terms of service</Link>
      </p>
    </>
  );
}
