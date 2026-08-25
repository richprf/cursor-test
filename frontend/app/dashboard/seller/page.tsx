import { BackendError, getMe } from '@/lib/backend';
import { publicAssetPath } from '@/lib/dashboard';
import { requireDashboardSession } from '@/lib/require-dashboard';
import { Alert, Card } from '@/components/ui';
import { Brand } from '@/components/brand';
import { SignOutButton } from '@/components/sign-out-button';
import { ThemeToggleDock } from '@/components/theme-toggle';
import type { BackendUser } from '@/types/api';

export const metadata = { title: 'داشبورد فروشنده' };

export default async function SellerDashboardPage() {
  const session = await requireDashboardSession('SELLER');

  let profile: BackendUser | null = null;
  let profileError: string | null = null;

  try {
    profile = await getMe(session.accessToken);
  } catch (error) {
    if (error instanceof BackendError && error.status === 401) {
      profileError = 'نشست منقضی شده است. دوباره وارد شوید.';
    } else {
      profileError = 'خواندن اطلاعات از سرور NestJS ناموفق بود.';
    }
  }

  const shopName = profile?.shopName ?? session.user.shopName ?? 'مغازه شما';
  const logoSrc = publicAssetPath(profile?.logoUrl ?? session.user.logoUrl);
  const greetingName = profile?.name ?? session.user.name ?? 'فروشنده';

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-7 p-6">
      <ThemeToggleDock />
      <Brand />

      <Card>
        <div className="mb-6 flex items-center gap-4">
          {logoSrc ? (
            // eslint-disable-next-line @next/next/no-img-element -- upload host is rewritten, not in next.config images
            <img
              src={logoSrc}
              alt=""
              className="size-14 rounded-xl object-cover ring-2 ring-gold-500/40"
            />
          ) : session.user.image ? (
            // eslint-disable-next-line @next/next/no-img-element -- avatar host is not configured in next.config
            <img
              src={session.user.image}
              alt=""
              className="size-14 rounded-xl object-cover ring-2 ring-gold-500/40"
            />
          ) : (
            <div className="grid size-14 place-items-center rounded-xl border border-gold-500/30 bg-gold-500/10 text-lg font-semibold text-gold-700">
              {shopName.charAt(0)}
            </div>
          )}
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gold-700">فروشنده</p>
            <h1 className="text-lg font-semibold">{shopName}</h1>
            <p dir="ltr" className="text-sm text-muted">
              {session.user.email}
            </p>
          </div>
        </div>

        <p className="mb-5 text-sm leading-7 text-muted">
          {greetingName} عزیز، خوش آمدید. از اینجا بعداً محصولات و آگهی‌های مغازه را مدیریت می‌کنید.
        </p>

        {profileError && <Alert>{profileError}</Alert>}

        {profile && (
          <dl className="divide-y divide-border/70 rounded-xl border border-border bg-background-elevated text-sm">
            <Row label="نام مغازه" value={shopName} />
            <Row label="نقش" value="فروشنده" />
            <Row
              label="روش ورود"
              value={profile.provider === 'GOOGLE' ? 'گوگل' : 'ایمیل و رمز عبور'}
            />
          </dl>
        )}

        <div className="mt-6">
          <SignOutButton />
        </div>
      </Card>
    </main>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-3">
      <dt className="text-muted">{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}
