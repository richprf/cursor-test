import { NextResponse, type NextRequest } from 'next/server';

const WINDOW_MS = 60_000;
const STRICT_LIMIT = 20;
const SESSION_LIMIT = 120;

const STRICT_PATH = /^\/api\/auth\/(signin|signout|callback)(\/|$)/;

type Bucket = { timestamps: number[] };

const hits = new Map<string, Bucket>();

function clientIp(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    const first = forwarded.split(',')[0]?.trim();
    if (first) return first;
  }
  return req.headers.get('x-real-ip')?.trim() || 'unknown';
}

function take(key: string, limit: number, now: number): boolean {
  const bucket = hits.get(key) ?? { timestamps: [] };
  bucket.timestamps = bucket.timestamps.filter((stamp) => now - stamp < WINDOW_MS);
  if (bucket.timestamps.length >= limit) {
    hits.set(key, bucket);
    return false;
  }
  bucket.timestamps.push(now);
  hits.set(key, bucket);
  return true;
}

/**
 * Browser-facing limiter for NextAuth routes. NestJS still rate-limits `/auth/login`
 * by email; this one counts the visitor IP on `/api/auth/*`.
 */
export function rateLimitAuthRoute(req: NextRequest): NextResponse | null {
  const { pathname } = req.nextUrl;
  if (!pathname.startsWith('/api/auth')) return null;

  const ip = clientIp(req);
  const now = Date.now();
  const strict = STRICT_PATH.test(pathname);
  const limit = strict ? STRICT_LIMIT : SESSION_LIMIT;
  const allowed = take(`${strict ? 'strict' : 'loose'}:${ip}:${pathname.split('/').slice(0, 4).join('/')}`, limit, now);

  if (allowed) return null;

  return NextResponse.json(
    { message: 'Too many requests. Try again in a minute.' },
    { status: 429, headers: { 'Retry-After': '60' } },
  );
}
