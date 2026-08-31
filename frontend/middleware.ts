import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { dashboardPath } from '@/lib/dashboard';

const PROTECTED_PREFIXES = ['/dashboard'];
const GUEST_ONLY_PATHS = ['/login', '/register'];

/**
 * Sends signed-out visitors to `/login` (remembering where they were headed) and
 * keeps signed-in users away from the login/register pages.
 *
 * After Google's first sign-in the account is still missing a role, so those
 * sessions are sent to `/complete-profile` instead of a dashboard.
 */
export default auth((req) => {
  const { pathname, search } = req.nextUrl;
  const isSignedIn = Boolean(req.auth) && req.auth?.error !== 'AccessTokenExpired';
  const role = req.auth?.user?.role;
  const needsOnboarding = isSignedIn && req.auth?.user?.onboardingComplete === false;
  const home = needsOnboarding ? '/complete-profile' : dashboardPath(role);

  if (pathname === '/complete-profile') {
    if (!isSignedIn) {
      const loginUrl = new URL('/login', req.nextUrl);
      loginUrl.searchParams.set('callbackUrl', '/complete-profile');
      return NextResponse.redirect(loginUrl);
    }
    if (!needsOnboarding) {
      return NextResponse.redirect(new URL(home, req.nextUrl));
    }
    return NextResponse.next();
  }

  const isProtected = PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );

  if (isProtected && !isSignedIn) {
    const loginUrl = new URL('/login', req.nextUrl);
    loginUrl.searchParams.set('callbackUrl', `${pathname}${search}`);
    return NextResponse.redirect(loginUrl);
  }

  if (isProtected && needsOnboarding) {
    return NextResponse.redirect(new URL('/complete-profile', req.nextUrl));
  }

  if (isSignedIn && (pathname === '/dashboard' || pathname === '/dashboard/')) {
    return NextResponse.redirect(new URL(home, req.nextUrl));
  }

  if (isSignedIn && pathname.startsWith('/dashboard/seller') && role !== 'SELLER') {
    return NextResponse.redirect(new URL(home, req.nextUrl));
  }

  if (isSignedIn && pathname.startsWith('/dashboard/buyer') && role === 'SELLER') {
    return NextResponse.redirect(new URL('/dashboard/seller', req.nextUrl));
  }

  if (isSignedIn && GUEST_ONLY_PATHS.includes(pathname)) {
    return NextResponse.redirect(new URL(home, req.nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  // Skip the NextAuth route handlers, static assets and image optimizer.
  matcher: ['/((?!api/auth|_next/static|_next/image|favicon.ico).*)'],
};
