'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, type RegisterInput } from '@/lib/validation';
import { Spinner } from '@/components/ui';
import { registerAction } from './actions';

export function RegisterForm() {
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '' },
  });

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);
    const result = await registerAction(values);
    if ('error' in result) {
      setFormError(result.error);
    }
    // On success the server action redirects to /dashboard.
  });

  return (
    <div className="auth-stack">
      {formError ? <p className="auth-alert">{formError}</p> : null}

      <form onSubmit={onSubmit} className="auth-form" noValidate>
        <div className="auth-field">
          <label htmlFor="name">نام</label>
          <input
            id="name"
            type="text"
            autoComplete="name"
            placeholder="نام (اختیاری)"
            disabled={isSubmitting}
            {...register('name')}
          />
          {errors.name?.message ? <p className="auth-field-error">{errors.name.message}</p> : null}
        </div>

        <div className="auth-field">
          <label htmlFor="email">ایمیل</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            dir="ltr"
            placeholder="ایمیل شما"
            disabled={isSubmitting}
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
            autoComplete="new-password"
            placeholder="رمز عبور"
            disabled={isSubmitting}
            aria-invalid={Boolean(errors.password)}
            {...register('password')}
          />
          {errors.password?.message ? <p className="auth-field-error">{errors.password.message}</p> : null}
        </div>

        <div className="auth-actions">
          <button type="submit" className="ww-link" disabled={isSubmitting}>
            {isSubmitting && <Spinner />}
            {isSubmitting ? 'در حال ساخت حساب…' : 'ثبت‌نام'}
          </button>
        </div>
      </form>

      <p className="auth-switch">
        حساب دارید؟{' '}
        <Link href="/login" className="ww-link">
          ورود
        </Link>
      </p>
      <Link href="/" className="auth-back ww-link">
        بازگشت به فروشگاه
      </Link>
    </div>
  );
}
