import { headers } from 'next/headers';
import { getToken } from 'next-auth/jwt';
import { isSessionAuthError } from '@/lib/session-status';

/**
 * Reads the Nest access token from the encrypted Auth.js JWT cookie.
 *
 * This is server-only: `/api/auth/session` never includes `accessToken`, so
 * browser JS (and XSS) cannot see it. Call `auth()` first when you also need
 * the jwt callback to rotate a near-expiry access token onto the cookie.
 */
export async function getServerAccessToken(req?: Request): Promise<string | null> {
  const secret = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET;
  if (!secret) {
    throw new Error('AUTH_SECRET is not set — copy .env.local.example to .env.local');
  }

  const headerSource = req?.headers ?? (await headers());
  const token = await getToken({
    req: { headers: headerSource },
    secret,
    secureCookie: useSecureAuthCookie(headerSource),
  });

  if (!token?.accessToken || isSessionAuthError(token.error)) {
    return null;
  }

  return token.accessToken;
}

function useSecureAuthCookie(headerSource: Headers): boolean {
  const proto = headerSource.get('x-forwarded-proto');
  if (proto) return proto.split(',')[0]?.trim() === 'https';
  const url = process.env.AUTH_URL ?? process.env.NEXTAUTH_URL ?? '';
  return url.startsWith('https://');
}
