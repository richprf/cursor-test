import type { NextRequest } from 'next/server';
import { getServerAccessToken } from '@/lib/server-auth';
import { createProxyHandler } from '../handler';

export const runtime = 'nodejs';

const proxy = createProxyHandler({
  getAccessToken: (req) => getServerAccessToken(req as NextRequest),
});

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const PATCH = proxy;
export const DELETE = proxy;
