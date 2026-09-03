'use server';

import { AuthError } from 'next-auth';
import { redirect, unstable_rethrow } from 'next/navigation';
import { signIn } from '@/auth';
import { BackendError, register as registerOnBackend, uploadShopLogo } from '@/lib/backend';
import { dashboardPath } from '@/lib/dashboard';
import { registerSchema } from '@/lib/validation';
import { getServerAccessTokenFromHeaders } from '@/lib/server-auth';

export type RegisterResult = { error: string } | { ok: true };

const MAX_LOGO_BYTES = 2 * 1024 * 1024;

/**
 * Creates the account on NestJS and immediately starts a session, so the user
 * lands on the dashboard instead of having to log in again.
 */
export async function registerAction(formData: FormData): Promise<RegisterResult> {
  const parsed = registerSchema.safeParse({
    name: String(formData.get('name') ?? ''),
    email: String(formData.get('email') ?? ''),
    password: String(formData.get('password') ?? ''),
    role: formData.get('role'),
    shopName: String(formData.get('shopName') ?? ''),
  });
  if (!parsed.success) {
    return { error: 'اطلاعات وارد شده معتبر نیست.' };
  }

  const logo = fileFromForm(formData.get('logo'));
  if (logo && logo.size > MAX_LOGO_BYTES) {
    return { error: 'حجم لوگو باید حداکثر ۲ مگابایت باشد.' };
  }

  const { email, password, name, role, shopName } = parsed.data;

  try {
    await registerOnBackend({
      email,
      password,
      name: name || undefined,
      role,
      shopName: role === 'SELLER' ? shopName || undefined : undefined,
    });
  } catch (error) {
    if (error instanceof BackendError) {
      if (error.status === 409) return { error: 'این ایمیل قبلاً ثبت شده است.' };
      if (error.status === 429) return { error: 'درخواست‌های زیادی ارسال شد. کمی بعد تلاش کنید.' };
      return { error: error.message };
    }
    console.error('[register] backend unreachable', error);
    return { error: 'ارتباط با سرور برقرار نشد. لطفاً بعداً دوباره تلاش کنید.' };
  }

  try {
    // `redirect: false` avoids Auth.js throwing NEXT_REDIRECT inside this action.
    // That throw, when the action is awaited from a client component, shows up as
    // Next.js "Internal Server Error" even though the account was created.
    await signIn('credentials', { email, password, redirect: false });
  } catch (error) {
    unstable_rethrow(error);
    if (error instanceof AuthError) {
      return { error: 'حساب ساخته شد، اما ورود خودکار انجام نشد. لطفاً وارد شوید.' };
    }
    console.error('[register] auto sign-in failed', error);
    return { error: 'حساب ساخته شد، اما ورود خودکار انجام نشد. لطفاً وارد شوید.' };
  }

  if (logo && role === 'SELLER') {
    const accessToken = await getServerAccessTokenFromHeaders();
    if (accessToken) {
      try {
        await uploadShopLogo(accessToken, logo);
      } catch (error) {
        console.error('[register] logo upload failed', error);
      }
    }
  }

  redirect(dashboardPath(role));
}

function fileFromForm(value: FormDataEntryValue | null): File | null {
  return value instanceof File && value.size > 0 ? value : null;
}
