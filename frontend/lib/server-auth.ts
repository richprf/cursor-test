import { headers } from 'next/headers';
import { getToken } from 'next-auth/jwt';
import { NextRequest } from 'next/server';
import { accessTokenFromJwt } from '@/lib/access-token-from-jwt';

export { accessTokenFromJwt };

/**
 * Server-only helper: decode the encrypted Auth.js JWT cookie.
 *
 * `auth()` returns `callbacks.session`, which deliberately omits `accessToken`.
 * Route Handlers must call `getToken()` instead. Never import this module from
 * a `'use client'` file, and never send the result to the browser.
 */
export async function getServerAccessToken(req: NextRequest): Promise<string | null> {
  const secret = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET;
  if (!secret) {
    throw new Error('NEXTAUTH_SECRET is not set — copy .env.local.example to .env.local');
  }

  const token = await getToken({
    req,
    secret,
    secureCookie: useSecureAuthCookie(req),
  });

  return accessTokenFromJwt(token);
}

/**
 * Same decode for Server Components / Server Actions that have no `NextRequest`.
 * Still server-only — not for client components.
 */
export async function getServerAccessTokenFromHeaders(): Promise<string | null> {
  const headerList = await headers();
  return getServerAccessToken(new NextRequest('http://127.0.0.1/api/proxy', { headers: headerList }));
}

function useSecureAuthCookie(req: NextRequest): boolean {
  const proto = req.headers.get('x-forwarded-proto');
  if (proto) return proto.split(',')[0]?.trim() === 'https';
  if (req.nextUrl.protocol === 'https:') return true;
  const url = process.env.AUTH_URL ?? process.env.NEXTAUTH_URL ?? '';
  return url.startsWith('https://');
}
