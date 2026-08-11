import { NextResponse } from 'next/server';
import { auth } from '@/auth';

const PROTECTED_PREFIXES = ['/dashboard'];
const GUEST_ONLY_PATHS = ['/login', '/register'];

/**
 * Sends signed-out visitors to `/login` (remembering where they were headed) and
 * keeps signed-in users away from the login/register pages.
 */
export default auth((req) => {
  const { pathname, search } = req.nextUrl;
  const isSignedIn = Boolean(req.auth) && req.auth?.error !== 'AccessTokenExpired';

  const isProtected = PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );

  if (isProtected && !isSignedIn) {
    const loginUrl = new URL('/login', req.nextUrl);
    loginUrl.searchParams.set('callbackUrl', `${pathname}${search}`);
    return NextResponse.redirect(loginUrl);
  }

  if (isSignedIn && GUEST_ONLY_PATHS.includes(pathname)) {
    return NextResponse.redirect(new URL('/dashboard', req.nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  // Skip the NextAuth route handlers, static assets and image optimizer.
  matcher: ['/((?!api/auth|_next/static|_next/image|favicon.ico).*)'],
};
