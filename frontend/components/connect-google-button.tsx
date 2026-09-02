'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { GoogleIcon, Spinner } from '@/components/ui';

export function ConnectGoogleButton({ callbackUrl = '/dashboard' }: { callbackUrl?: string }) {
  const [pending, setPending] = useState(false);

  return (
    <button
      type="button"
      className="inline-flex items-center gap-2 rounded-xl border border-border bg-background-elevated px-3 py-2 text-sm transition hover:border-gold-500/50 hover:bg-surface disabled:opacity-60"
      disabled={pending}
      onClick={() => {
        setPending(true);
        void signIn('google', { redirectTo: callbackUrl });
      }}
    >
      {pending ? <Spinner /> : <GoogleIcon />}
      اتصال حساب گوگل
    </button>
  );
}
