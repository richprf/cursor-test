'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, type RegisterInput } from '@/lib/validation';
import { Alert, FieldError, Label, Spinner, inputClass, primaryButtonClass } from '@/components/ui';
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
    <div className="space-y-5">
      {formError && <Alert>{formError}</Alert>}

      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <div>
          <Label htmlFor="name">نام (اختیاری)</Label>
          <input
            id="name"
            type="text"
            autoComplete="name"
            placeholder="نام و نام خانوادگی"
            className={inputClass}
            disabled={isSubmitting}
            {...register('name')}
          />
          <FieldError>{errors.name?.message}</FieldError>
        </div>

        <div>
          <Label htmlFor="email">ایمیل</Label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            dir="ltr"
            placeholder="you@example.com"
            className={inputClass}
            disabled={isSubmitting}
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
            autoComplete="new-password"
            placeholder="حداقل ۸ کاراکتر"
            className={inputClass}
            disabled={isSubmitting}
            aria-invalid={Boolean(errors.password)}
            {...register('password')}
          />
          <FieldError>{errors.password?.message}</FieldError>
        </div>

        <button type="submit" className={primaryButtonClass} disabled={isSubmitting}>
          {isSubmitting && <Spinner />}
          {isSubmitting ? 'در حال ساخت حساب…' : 'ثبت‌نام'}
        </button>
      </form>
    </div>
  );
}
