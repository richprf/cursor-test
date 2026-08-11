'use server';

import { AuthError } from 'next-auth';
import { signIn } from '@/auth';
import { BackendError, register as registerOnBackend } from '@/lib/backend';
import { registerSchema, type RegisterInput } from '@/lib/validation';

export type RegisterResult = { error: string } | { ok: true };

/**
 * Creates the account on NestJS and immediately starts a session, so the user
 * lands on the dashboard instead of having to log in again.
 */
export async function registerAction(input: RegisterInput): Promise<RegisterResult> {
  const parsed = registerSchema.safeParse(input);
  if (!parsed.success) {
    return { error: 'اطلاعات وارد شده معتبر نیست.' };
  }

  const { email, password, name } = parsed.data;

  try {
    await registerOnBackend({ email, password, name: name || undefined });
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
    // Throws a redirect on success, which Next.js turns into navigation.
    await signIn('credentials', { email, password, redirectTo: '/dashboard' });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: 'حساب ساخته شد، اما ورود خودکار انجام نشد. لطفاً وارد شوید.' };
    }
    throw error;
  }

  return { ok: true };
}
