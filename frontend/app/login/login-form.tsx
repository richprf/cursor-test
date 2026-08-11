'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import { loginSchema, type LoginInput } from '@/lib/validation';
import { authErrorMessage } from '@/lib/auth-errors';
import {
  Alert,
  FieldError,
  GoogleIcon,
  Label,
  Spinner,
  inputClass,
  primaryButtonClass,
  secondaryButtonClass,
} from '@/components/ui';

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
    <div className="space-y-5">
      {formError && <Alert>{formError}</Alert>}

      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <div>
          <Label htmlFor="email">ایمیل</Label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            dir="ltr"
            placeholder="you@example.com"
            className={inputClass}
            disabled={disabled}
            aria-invalid={Boolean(errors.email)}
            {...register('email')}
          />
          <FieldError>{errors.email?.message}</FieldError>
        </div>

        <div>
          <Label htmlFor="password">رمز عبور</Label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            className={inputClass}
            disabled={disabled}
            aria-invalid={Boolean(errors.password)}
            {...register('password')}
          />
          <FieldError>{errors.password?.message}</FieldError>
        </div>

        <button type="submit" className={primaryButtonClass} disabled={disabled}>
          {pending && <Spinner />}
          {pending ? 'در حال ورود…' : 'ورود'}
        </button>
      </form>

      <div className="flex items-center gap-3 text-xs text-muted">
        <span className="h-px flex-1 bg-border" />
        یا
        <span className="h-px flex-1 bg-border" />
      </div>

      <button
        type="button"
        className={secondaryButtonClass}
        disabled={disabled}
        onClick={() => {
          setGooglePending(true);
          // Full redirect to Google; NextAuth returns to `callbackUrl` afterwards.
          void signIn('google', { redirectTo: callbackUrl });
        }}
      >
        {googlePending ? <Spinner /> : <GoogleIcon />}
        ورود با گوگل
      </button>
    </div>
  );
}
