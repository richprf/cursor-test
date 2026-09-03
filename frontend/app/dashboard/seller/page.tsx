import { BackendError, getMe, listMyProducts } from '@/lib/backend';
import { publicAssetPath } from '@/lib/dashboard';
import { requireDashboardSession } from '@/lib/require-dashboard';
import { getServerAccessTokenFromHeaders } from '@/lib/server-auth';
import { Alert } from '@/components/ui';
import { KpiCard, Verdict } from '@/components/dashboard/kpi-card';
import { Sparkline } from '@/components/dashboard/sparkline';
import { toPersianNumber } from '@/lib/format';
import { ConnectGoogleButton } from '@/components/connect-google-button';
import { Box, CircleDollarSign, Receipt, Store } from 'lucide-react';
import type { BackendUser } from '@/types/api';

export const metadata = { title: 'داشبورد فروشنده' };

export default async function SellerDashboardPage() {
  const session = await requireDashboardSession('SELLER');
  const accessToken = await getServerAccessTokenFromHeaders();

  let profile: BackendUser | null = null;
  let profileError: string | null = null;
  let productCount = 0;

  try {
    if (!accessToken) {
      throw new BackendError(401, 'Missing access token');
    }
    profile = await getMe(accessToken);
  } catch (error) {
    if (error instanceof BackendError && error.status === 401) {
      profileError = 'نشست منقضی شده است. دوباره وارد شوید.';
    } else {
      profileError = 'خواندن اطلاعات از سرور NestJS ناموفق بود.';
    }
  }

  try {
    productCount = accessToken ? (await listMyProducts(accessToken)).items.length : 0;
  } catch {
    productCount = 0;
  }

  const shopName = profile?.shopName ?? session.user.shopName ?? 'مغازه شما';
  const logoSrc = publicAssetPath(profile?.logoUrl ?? session.user.logoUrl);
  const greetingName = profile?.name ?? session.user.name ?? 'فروشنده';
  const emptyTrend = [0, 0, 0, 0, 0, 0];

  return (
    <>
      <div className="mb-10 flex items-start gap-5">
        {logoSrc ? (
          // eslint-disable-next-line @next/next/no-img-element -- upload host is rewritten, not in next.config images
          <img src={logoSrc} alt="" className="size-16 rounded-2xl object-cover ring-1 ring-border" />
        ) : session.user.image ? (
          // eslint-disable-next-line @next/next/no-img-element -- avatar host is not configured in next.config
          <img src={session.user.image} alt="" className="size-16 rounded-2xl object-cover ring-1 ring-border" />
        ) : (
          <div className="grid size-16 place-items-center rounded-2xl border border-border bg-surface text-xl font-semibold text-gold-700">
            {shopName.charAt(0)}
          </div>
        )}
        <Verdict
          eyebrow="مغازه"
          value={shopName}
          detail={
            <>
              {greetingName} عزیز، خوش آمدید. محصولات طلا را از بخش محصولات مدیریت کنید.
            </>
          }
        />
      </div>

      {profileError && (
        <div className="mb-8">
          <Alert>{profileError}</Alert>
        </div>
      )}

      <div className="mb-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          icon={<CircleDollarSign className="size-4" aria-hidden />}
          label="فروش"
          value={<span dir="ltr">$0.00</span>}
          hint="هنوز سفارشی ثبت نشده است"
          trend={<Sparkline points={emptyTrend} className="text-gold-600" />}
        />
        <KpiCard
          icon={<Box className="size-4" aria-hidden />}
          label="محصولات"
          value={toPersianNumber(productCount)}
          hint={productCount ? 'قطعه در کاتالوگ مغازه' : 'کاتالوگ مغازه هنوز خالی است'}
          trend={<Sparkline points={emptyTrend} className="text-gold-600" />}
        />
        <KpiCard
          icon={<Receipt className="size-4" aria-hidden />}
          label="سفارش‌ها"
          value={toPersianNumber(0)}
          hint="وقتی خریدی انجام شود اینجا دیده می‌شود"
          trend={<Sparkline points={emptyTrend} className="text-gold-600" />}
        />
        <KpiCard
          icon={<Store className="size-4" aria-hidden />}
          label="وضعیت"
          value="فعال"
          hint={profile?.provider === 'GOOGLE' ? 'ورود با گوگل' : 'ورود با ایمیل'}
        />
      </div>

      {profile && (
        <section className="overflow-hidden rounded-2xl border border-border/80 bg-surface">
          <div className="border-b border-border/70 px-6 py-4">
            <h2 className="text-sm font-medium">جزئیات حساب</h2>
          </div>
          <dl>
            <Row label="نام مغازه" value={shopName} />
            <Row label="نقش" value="فروشنده" />
            <Row
              label="روش ورود"
              value={profile.provider === 'GOOGLE' ? 'گوگل' : 'ایمیل و رمز عبور'}
            />
            {profile.provider === 'CREDENTIALS' && !profile.googleLinked ? (
              <div className="flex items-center justify-between gap-6 px-6 py-4">
                <dt className="text-sm text-muted">حساب گوگل</dt>
                <dd>
                  <ConnectGoogleButton callbackUrl="/dashboard/seller" />
                </dd>
              </div>
            ) : null}
          </dl>
        </section>
      )}
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-6 border-b border-border/60 px-6 py-4 last:border-b-0">
      <dt className="text-sm text-muted">{label}</dt>
      <dd className="text-sm">{value}</dd>
    </div>
  );
}
