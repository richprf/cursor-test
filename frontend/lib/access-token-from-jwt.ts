/**
 * Maps the decoded Auth.js JWT (from `getToken`, never from `auth()`) to the
 * Nest access token. Any `token.error` means the pair is unusable — do not
 * forward a stale Bearer token to NestJS.
 */
export function accessTokenFromJwt(
  token: { accessToken?: unknown; error?: unknown } | null,
): string | null {
  if (!token || token.error) {
    return null;
  }
  return typeof token.accessToken === 'string' && token.accessToken.length > 0
    ? token.accessToken
    : null;
}
