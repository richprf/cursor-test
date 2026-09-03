export type SessionAuthError = 'AccessTokenExpired' | 'RefreshTokenExpired';

/**
 * True when the NextAuth cookie is present but the Nest access/refresh pair
 * can no longer be used.
 */
export function isSessionAuthError(error: string | undefined): error is SessionAuthError {
  return error === 'AccessTokenExpired' || error === 'RefreshTokenExpired';
}

/**
 * Signed-in with a usable Nest session. The access token itself stays in the
 * encrypted JWT cookie and is never copied onto the client session object.
 */
export function hasUsableAccessToken<
  T extends { user?: { id?: string | null }; error?: string },
>(session: T | null | undefined): session is T {
  return Boolean(session?.user?.id) && !isSessionAuthError(session?.error);
}
