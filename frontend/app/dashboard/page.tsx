import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { dashboardPath } from '@/lib/dashboard';

export const metadata = { title: 'داشبورد' };

/** `/dashboard` is only a router: send each role to its own page. */
export default async function DashboardIndexPage() {
  const session = await auth();

  if (!session?.accessToken || session.error === 'AccessTokenExpired') {
    redirect('/login?error=SessionRequired');
  }

  if (session.user.onboardingComplete === false) {
    redirect('/complete-profile');
  }

  redirect(dashboardPath(session.user.role));
}
