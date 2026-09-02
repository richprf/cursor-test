export type SessionAuthError = 'AccessTokenExpired' | 'RefreshTokenExpired';

/**
 * True when the NextAuth cookie is present but the Nest access/refresh pair
 * can no longer be used.
 */
export function isSessionAuthError(error: string | undefined): error is SessionAuthError {
  return error === 'AccessTokenExpired' || error === 'RefreshTokenExpired';
}

export function hasUsableAccessToken(session: {
  accessToken?: string;
  error?: string;
} | null | undefined): session is { accessToken: string; error?: string } {
  return Boolean(session?.accessToken) && !isSessionAuthError(session?.error);
}
