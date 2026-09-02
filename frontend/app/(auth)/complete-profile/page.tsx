import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { AuthFrame } from '@/components/auth/auth-frame';
import { dashboardPath } from '@/lib/dashboard';
import { hasUsableAccessToken } from '@/lib/session-status';
import { CompleteProfileForm } from './complete-profile-form';

export const metadata = { title: 'Complete your profile' };

export default async function CompleteProfilePage() {
  const session = await auth();

  if (!hasUsableAccessToken(session)) {
    redirect('/login?error=SessionRequired');
  }

  if (session.user.onboardingComplete !== false) {
    redirect(dashboardPath(session.user.role));
  }

  return (
    <AuthFrame title="Complete your profile">
      <p className="shop-auth-lead">
        Google signed you in. Choose whether you are buying or selling — and if you sell, add your
        shop name.
      </p>
      <CompleteProfileForm />
    </AuthFrame>
  );
}
