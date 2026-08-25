import { type ReactNode } from 'react';
import { auth } from '@/auth';
import { LenisRoot } from '@/components/landing/lenis-root';
import { WwakeHeader } from '@/components/landing/wwake/wwake-header';
import { WwakeFooter } from '@/components/landing/wwake/wwake-rest';
import '@/app/wwake.css';

export async function AuthShell({ children }: { children: ReactNode }) {
  const session = await auth();
  const accountHref = session ? '/dashboard' : '/login';
  const accountLabel = session ? 'داشبورد' : 'ورود';

  return (
    <LenisRoot>
      <div className="wwake" dir="rtl" lang="fa">
        <WwakeHeader accountHref={accountHref} accountLabel={accountLabel} />
        <main>{children}</main>
        <WwakeFooter />
      </div>
    </LenisRoot>
  );
}
