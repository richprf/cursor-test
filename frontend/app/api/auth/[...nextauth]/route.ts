import { handlers } from '@/auth';
import type { NextRequest } from 'next/server';

const TOKEN_KEYS = new Set(['accessToken', 'refreshToken', 'accessTokenExpires']);

function stripSecrets(value: unknown): unknown {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return value;
  const out: Record<string, unknown> = {};
  for (const [key, entry] of Object.entries(value as Record<string, unknown>)) {
    if (TOKEN_KEYS.has(key)) continue;
    out[key] = key === 'user' ? stripSecrets(entry) : entry;
  }
  return out;
}

/**
 * NextAuth endpoints. GET /api/auth/session is sanitized so a Nest access token
 * cannot leak even if a future session callback copies it back onto `session`.
 */
export async function GET(req: NextRequest) {
  const response = await handlers.GET(req);
  const pathname = new URL(req.url).pathname.replace(/\/$/, '');
  if (!pathname.endsWith('/session')) return response;

  const body: unknown = await response.clone().json().catch(() => null);
  if (!body) return response;

  const headers = new Headers(response.headers);
  headers.delete('content-length');
  headers.set('content-type', 'application/json');
  return new Response(JSON.stringify(stripSecrets(body)), {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

export const POST = handlers.POST;
