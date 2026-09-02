import { auth } from '@/auth';
import { getServerAccessToken } from '@/lib/server-access-token';
import { isSessionAuthError } from '@/lib/session-status';

export const runtime = 'nodejs';

/**
 * Paths Nest will accept through this BFF. Login/refresh/OAuth stay off-limits
 * so a browser script cannot mint or rotate tokens via the proxy.
 */
const ALLOWED_NEST_PATH = /^(auth\/me|auth\/complete-profile|auth\/shop\/logo|wishlist(?:\/[^/]+)?|cart(?:\/[^/]+)?|products(?:\/mine|\/[^/]+)?)$/;

const HOP_BY_HOP = new Set([
  'connection',
  'keep-alive',
  'proxy-authenticate',
  'proxy-authorization',
  'te',
  'trailers',
  'transfer-encoding',
  'upgrade',
  'cookie',
  'host',
  'authorization',
  'content-length',
]);

type RouteContext = { params: Promise<{ path: string[] }> };

async function proxy(req: Request, context: RouteContext): Promise<Response> {
  const session = await auth();
  if (!session?.user?.id || isSessionAuthError(session.error)) {
    return Response.json({ message: 'برای ادامه وارد شوید.' }, { status: 401 });
  }

  const accessToken = await getServerAccessToken(req);
  if (!accessToken) {
    return Response.json({ message: 'برای ادامه وارد شوید.' }, { status: 401 });
  }

  const { path } = await context.params;
  const nestPath = path.join('/');
  if (!nestPath || !ALLOWED_NEST_PATH.test(nestPath)) {
    return Response.json({ message: 'Not found' }, { status: 404 });
  }

  const baseUrl = process.env.NEST_API_URL;
  if (!baseUrl) {
    return Response.json({ message: 'NEST_API_URL is not set' }, { status: 500 });
  }

  const incoming = new URL(req.url);
  const backendUrl = new URL(
    path.map(encodeURIComponent).join('/'),
    baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`,
  );
  backendUrl.search = incoming.search;

  const headers = new Headers();
  headers.set('Authorization', `Bearer ${accessToken}`);
  const contentType = req.headers.get('content-type');
  if (contentType) headers.set('Content-Type', contentType);

  const method = req.method.toUpperCase();
  const body = method === 'GET' || method === 'HEAD' ? undefined : await req.arrayBuffer();

  let upstream: Response;
  try {
    upstream = await fetch(backendUrl, {
      method,
      headers,
      body,
      cache: 'no-store',
    });
  } catch (error) {
    console.error('[bff-proxy] NestJS unreachable', error);
    return Response.json({ message: 'ارتباط با سرور برقرار نشد.' }, { status: 502 });
  }

  const responseHeaders = new Headers();
  upstream.headers.forEach((value, key) => {
    if (HOP_BY_HOP.has(key.toLowerCase())) return;
    if (key.toLowerCase() === 'set-cookie') return;
    responseHeaders.append(key, value);
  });

  return new Response(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers: responseHeaders,
  });
}

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const PATCH = proxy;
export const DELETE = proxy;
