'use server';

import { AuthError } from 'next-auth';
import { redirect, unstable_rethrow } from 'next/navigation';
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

  redirect('/dashboard');
}
