import { BackendError, getMe } from '@/lib/backend';
import { requireDashboardSession } from '@/lib/require-dashboard';
import { Alert } from '@/components/ui';
import { BuyerOverview } from '@/components/dashboard/buyer-overview';
import { ConnectGoogleButton } from '@/components/connect-google-button';
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
    <>
      <BuyerOverview />

      {profileError && (
        <div className="mb-8">
          <Alert>{profileError}</Alert>
        </div>
      )}

      <section className="overflow-hidden rounded-2xl border border-border/80 bg-surface">
        <div className="flex items-center gap-4 border-b border-border/70 px-6 py-5">
          {session.user.image ? (
            // eslint-disable-next-line @next/next/no-img-element -- avatar host is not configured in next.config
            <img src={session.user.image} alt="" className="size-11 rounded-full object-cover" />
          ) : (
            <div className="grid size-11 place-items-center rounded-full border border-border bg-background-elevated text-sm font-semibold text-gold-700">
              {greetingName.charAt(0)}
            </div>
          )}
          <div>
            <p className="text-[11px] font-medium tracking-[0.18em] text-muted">حساب خریدار</p>
            <h2 className="text-base font-medium">{greetingName}</h2>
          </div>
        </div>

        {profile && (
          <dl>
            <Row label="نام" value={profile.name ?? '—'} />
            <Row label="ایمیل" value={profile.email} mono />
            <Row label="نقش" value="خریدار" />
            <Row
              label="روش ورود"
              value={profile.provider === 'GOOGLE' ? 'گوگل' : 'ایمیل و رمز عبور'}
            />
            {profile.provider === 'CREDENTIALS' && !profile.googleLinked ? (
              <div className="flex items-center justify-between gap-6 px-6 py-4">
                <dt className="text-sm text-muted">حساب گوگل</dt>
                <dd>
                  <ConnectGoogleButton callbackUrl="/dashboard/buyer" />
                </dd>
              </div>
            ) : null}
          </dl>
        )}
      </section>
    </>
  );
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-6 border-b border-border/60 px-6 py-4 last:border-b-0">
      <dt className="text-sm text-muted">{label}</dt>
      <dd className={`text-sm ${mono ? 'font-mono text-xs' : ''}`} dir={mono ? 'ltr' : undefined}>
        {value}
      </dd>
    </div>
  );
}
