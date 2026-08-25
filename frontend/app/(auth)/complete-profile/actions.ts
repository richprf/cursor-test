'use server';

import { redirect } from 'next/navigation';
import { auth, unstable_update } from '@/auth';
import { BackendError, completeProfile, uploadShopLogo } from '@/lib/backend';
import { dashboardPath } from '@/lib/dashboard';
import { completeProfileSchema } from '@/lib/validation';

export type CompleteProfileResult = { error: string };

const MAX_LOGO_BYTES = 2 * 1024 * 1024;

export async function completeProfileAction(formData: FormData): Promise<CompleteProfileResult> {
  const session = await auth();
  if (!session?.accessToken || session.error === 'AccessTokenExpired') {
    redirect('/login?error=SessionRequired');
  }

  const parsed = completeProfileSchema.safeParse({
    role: formData.get('role'),
    shopName: String(formData.get('shopName') ?? ''),
  });
  if (!parsed.success) {
    return { error: 'اطلاعات وارد شده معتبر نیست.' };
  }

  const logo = formData.get('logo');
  const file = logo instanceof File && logo.size > 0 ? logo : null;
  if (file && file.size > MAX_LOGO_BYTES) {
    return { error: 'حجم لوگو باید حداکثر ۲ مگابایت باشد.' };
  }

  const { role, shopName } = parsed.data;

  try {
    await completeProfile(session.accessToken, {
      role,
      shopName: role === 'SELLER' ? shopName || undefined : undefined,
    });
  } catch (error) {
    if (error instanceof BackendError) {
      if (error.status === 401) redirect('/login?error=SessionRequired');
      if (error.status === 429) return { error: 'درخواست‌های زیادی ارسال شد. کمی بعد تلاش کنید.' };
      return { error: error.message };
    }
    console.error('[complete-profile] backend unreachable', error);
    return { error: 'ارتباط با سرور برقرار نشد. لطفاً بعداً دوباره تلاش کنید.' };
  }

  if (file && role === 'SELLER') {
    try {
      await uploadShopLogo(session.accessToken, file);
    } catch (error) {
      console.error('[complete-profile] logo upload failed', error);
    }
  }

  await unstable_update({});
  redirect(dashboardPath(role));
}
