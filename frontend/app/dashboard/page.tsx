import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { BackendError, getMe } from '@/lib/backend';
import { Alert, Card } from '@/components/ui';
import { Brand } from '@/components/brand';
import { SignOutButton } from '@/components/sign-out-button';
import type { BackendUser } from '@/types/api';

export const metadata = { title: 'داشبورد' };

/**
 * Protected page. `middleware.ts` already bounces anonymous visitors, and this
 * server-side check is the second line of defence (and what protects direct
 * requests that bypass the matcher).
 */
export default async function DashboardPage() {
  const session = await auth();

  if (!session?.accessToken || session.error === 'AccessTokenExpired') {
    redirect('/login?error=SessionRequired');
  }

  // Proves the whole point of the setup: the NestJS token works on NestJS routes.
  let profile: BackendUser | null = null;
  let profileError: string | null = null;

  try {
    profile = await getMe(session.accessToken);
  } catch (error) {
    if (error instanceof BackendError && error.status === 401) {
      redirect('/login?error=SessionRequired');
    }
    profileError = 'خواندن اطلاعات از سرور NestJS ناموفق بود.';
  }

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-7 p-6">
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
            <div className="grid size-12 place-items-center rounded-full border border-gold-500/30 bg-gold-500/10 text-lg font-semibold text-gold-300">
              {(session.user.name ?? session.user.email ?? '?').charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <h1 className="text-lg font-semibold">{session.user.name ?? 'کاربر'}</h1>
            <p dir="ltr" className="text-sm text-muted">
              {session.user.email}
            </p>
          </div>
        </div>

        {profileError && <Alert>{profileError}</Alert>}

        {profile && (
          <dl className="divide-y divide-border/70 rounded-xl border border-border bg-background-elevated/60 text-sm">
            <Row label="شناسه کاربر" value={profile.id} mono />
            <Row label="نقش" value={profile.role} />
            <Row label="روش ثبت‌نام" value={profile.provider === 'GOOGLE' ? 'گوگل' : 'ایمیل و رمز عبور'} />
          </dl>
        )}

        <p className="mt-5 text-xs leading-6 text-muted">
          این اطلاعات از مسیر محافظت‌شدهٔ{' '}
          <code dir="ltr" className="text-gold-300/90">
            GET /auth/me
          </code>{' '}
          و با هدر{' '}
          <code dir="ltr" className="text-gold-300/90">
            Authorization: Bearer …
          </code>{' '}
          از NestJS خوانده شده است.
        </p>

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
