'use client';

import { useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';

export function useSignedIn() {
  const { data: session } = useSession();
  return Boolean(session?.accessToken) && session?.error !== 'AccessTokenExpired';
}

/** Guests are sent to login before a cart/wishlist mutation hits the API. */
export function useRequireSignIn() {
  const signedIn = useSignedIn();
  const router = useRouter();
  const pathname = usePathname();

  return useCallback(() => {
    if (signedIn) return true;
    const next = pathname && pathname !== '/login' ? pathname : '/dashboard/buyer';
    router.push(`/login?callbackUrl=${encodeURIComponent(next)}`);
    return false;
  }, [signedIn, pathname, router]);
}
