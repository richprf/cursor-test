import { redirect } from 'next/navigation';
import type { Session } from 'next-auth';
import { auth } from '@/auth';
import type { AccountRole } from '@/types/api';

type AuthedSession = Session & { accessToken: string };

export async function requireDashboardSession(expected: AccountRole): Promise<AuthedSession> {
  const session = await auth();

  if (!session?.accessToken || session.error === 'AccessTokenExpired') {
    redirect('/login?error=SessionRequired');
  }

  if (session.user.onboardingComplete === false) {
    redirect('/complete-profile');
  }

  if (expected === 'SELLER' && session.user.role !== 'SELLER') {
    redirect('/dashboard/buyer');
  }

  if (expected === 'BUYER' && session.user.role === 'SELLER') {
    redirect('/dashboard/seller');
  }

  return session as AuthedSession;
}
