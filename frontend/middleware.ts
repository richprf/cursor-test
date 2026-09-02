import { NextResponse, type NextRequest } from 'next/server';
import { auth } from '@/auth';
import { rateLimitAuthRoute } from '@/lib/auth-rate-limit';
import { dashboardPath } from '@/lib/dashboard';
import { hasUsableAccessToken } from '@/lib/session-status';

const PROTECTED_PREFIXES = ['/dashboard'];
const GUEST_ONLY_PATHS = ['/login', '/register'];

/**
 * Sends signed-out visitors to `/login` (remembering where they were headed) and
 * keeps signed-in users away from the login/register pages.
 *
 * After Google's first sign-in the account is still missing a role, so those
 * sessions are sent to `/complete-profile` instead of a dashboard.
 */
const sessionGate = auth((req) => {
  const { pathname, search } = req.nextUrl;
  const isSignedIn = hasUsableAccessToken(req.auth);
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

export default function middleware(req: NextRequest) {
  const limited = rateLimitAuthRoute(req);
  if (limited) return limited;

  // Do not wrap NextAuth's own handlers in `auth()` — they manage the session cookie.
  if (req.nextUrl.pathname.startsWith('/api/auth')) {
    return NextResponse.next();
  }

  return sessionGate(req, undefined as never);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
