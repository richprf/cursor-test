import { BackendError, getMe } from '@/lib/backend';
import { requireDashboardSession } from '@/lib/require-dashboard';
import { Alert, Card } from '@/components/ui';
import { Brand } from '@/components/brand';
import { SignOutButton } from '@/components/sign-out-button';
import { ThemeToggleDock } from '@/components/theme-toggle';
import type { BackendUser } from '@/types/api';

export const metadata = { title: 'داشبورد خریدار' };

export default async function BuyerDashboardPage() {
  const session = await requireDashboardSession('BUYER');

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

  const greetingName = profile?.name ?? session.user.name ?? 'خریدار';

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-7 p-6">
      <ThemeToggleDock />
      <Brand />

      <Card>
        <div className="mb-6 flex items-center gap-4">
          {session.user.image ? (
            // eslint-disable-next-line @next/next/no-img-element -- avatar host is not configured in next.config
            <img
              src={session.user.image}
              alt=""
              className="size-12 rounded-full ring-2 ring-gold-500/40"
            />
          ) : (
            <div className="grid size-12 place-items-center rounded-full border border-gold-500/30 bg-gold-500/10 text-lg font-semibold text-gold-700">
              {greetingName.charAt(0)}
            </div>
          )}
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gold-700">خریدار</p>
            <h1 className="text-lg font-semibold">{greetingName}</h1>
            <p dir="ltr" className="text-sm text-muted">
              {session.user.email}
            </p>
          </div>
        </div>

        <p className="mb-5 text-sm leading-7 text-muted">
          خوش آمدید. از اینجا بعداً سفارش‌ها و آگهی‌هایی که دنبال می‌کنید را می‌بینید.
        </p>

        {profileError && <Alert>{profileError}</Alert>}

        {profile && (
          <dl className="divide-y divide-border/70 rounded-xl border border-border bg-background-elevated text-sm">
            <Row label="نام" value={profile.name ?? '—'} />
            <Row label="ایمیل" value={profile.email} mono />
            <Row label="نقش" value="خریدار" />
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

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-3">
      <dt className="text-muted">{label}</dt>
      <dd className={mono ? 'font-mono text-xs' : ''} dir={mono ? 'ltr' : undefined}>
        {value}
      </dd>
    </div>
  );
}
