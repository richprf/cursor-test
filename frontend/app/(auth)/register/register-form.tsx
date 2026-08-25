'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import { registerSchema, type RegisterInput } from '@/lib/validation';
import { AccountTypeFields } from '@/components/auth/account-type-fields';
import { GoogleIcon, Spinner } from '@/components/ui';
import { registerAction } from './actions';

export function RegisterForm() {
  const [formError, setFormError] = useState<string | null>(null);
  const [googlePending, setGooglePending] = useState(false);
  const [logo, setLogo] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '', role: 'BUYER', shopName: '' },
  });

  const role = watch('role');

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);
    const formData = new FormData();
    formData.set('name', values.name ?? '');
    formData.set('email', values.email);
    formData.set('password', values.password);
    formData.set('role', values.role);
    formData.set('shopName', values.shopName ?? '');
    if (logo) formData.set('logo', logo);

    const result = await registerAction(formData);
    if ('error' in result) {
      setFormError(result.error);
    }
    // On success the server action redirects to the role dashboard.
  });

  const disabled = isSubmitting || googlePending;

  return (
    <>
      {formError ? <p className="shop-auth-alert">{formError}</p> : null}

      <form onSubmit={onSubmit} className="shop-auth-form" noValidate>
        <AccountTypeFields
          role={role}
          onRoleChange={(next) => setValue('role', next, { shouldValidate: true })}
          shopName={register('shopName')}
          shopNameError={errors.shopName}
          onLogoChange={setLogo}
          logoFileName={logo?.name ?? null}
          disabled={disabled}
        />

        <div className="shop-auth-field">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            autoComplete="name"
            placeholder="Name"
            disabled={disabled}
            {...register('name')}
          />
          {errors.name?.message ? <p className="shop-auth-field-error">{errors.name.message}</p> : null}
        </div>

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
            autoComplete="new-password"
            placeholder="Password"
            disabled={disabled}
            aria-invalid={Boolean(errors.password)}
            {...register('password')}
          />
          {errors.password?.message ? <p className="shop-auth-field-error">{errors.password.message}</p> : null}
        </div>

        <button type="submit" className="shop-auth-submit" disabled={disabled}>
          {isSubmitting && <Spinner />}
          {isSubmitting ? 'Creating account…' : 'Continue'}
        </button>
      </form>

      <p className="shop-auth-or">or</p>

      <button
        type="button"
        className="shop-auth-google"
        disabled={disabled}
        onClick={() => {
          setGooglePending(true);
          void signIn('google', { redirectTo: '/dashboard' });
        }}
      >
        {googlePending ? <Spinner /> : <GoogleIcon />}
        Continue with Google
      </button>

      <p className="shop-auth-switch">
        Already have an account? <Link href="/login">Log in</Link>
      </p>
      <p className="shop-auth-legal">
        <Link href="/">Privacy</Link>
        {' · '}
        <Link href="/">Terms of service</Link>
      </p>
    </>
  );
}
