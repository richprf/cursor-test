'use client';

import { useEffect } from 'react';
import { signOut, useSession } from 'next-auth/react';

/**
 * When Nest can no longer refresh the access token, drop the NextAuth cookie and
 * send the user back to login instead of leaving a half-dead session around.
 */
export function SessionErrorHandler() {
  const { data: session } = useSession();

  useEffect(() => {
    if (!session?.error) return;
    void signOut({ callbackUrl: '/login?error=SessionExpired' });
  }, [session?.error]);

  return null;
}
