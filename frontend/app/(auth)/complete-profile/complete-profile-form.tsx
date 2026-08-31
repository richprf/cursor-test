'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { completeProfileSchema, type CompleteProfileInput } from '@/lib/validation';
import { AccountTypeFields } from '@/components/auth/account-type-fields';
import { Spinner } from '@/components/ui';
import { completeProfileAction } from './actions';

export function CompleteProfileForm() {
  const [formError, setFormError] = useState<string | null>(null);
  const [logo, setLogo] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CompleteProfileInput>({
    resolver: zodResolver(completeProfileSchema),
    defaultValues: { role: 'BUYER', shopName: '' },
  });

  const role = watch('role');

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);
    const formData = new FormData();
    formData.set('role', values.role);
    formData.set('shopName', values.shopName ?? '');
    if (logo) formData.set('logo', logo);

    const result = await completeProfileAction(formData);
    if (result?.error) {
      setFormError(result.error);
    }
  });

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
          disabled={isSubmitting}
        />

        <button type="submit" className="shop-auth-submit" disabled={isSubmitting}>
          {isSubmitting && <Spinner />}
          {isSubmitting ? 'Saving…' : 'Continue'}
        </button>
      </form>
    </>
  );
}
