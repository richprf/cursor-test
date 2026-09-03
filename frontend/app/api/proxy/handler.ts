/**
 * Paths Nest will accept through this BFF. Login/refresh/OAuth stay off-limits
 * so a browser script cannot mint or rotate tokens via the proxy.
 */
export const ALLOWED_NEST_PATH =
  /^(auth\/me|auth\/complete-profile|auth\/shop\/logo|wishlist(?:\/[^/]+)?|cart(?:\/[^/]+)?|products(?:\/mine|\/[^/]+)?)$/;

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

export type ProxyContext = { params: Promise<{ path: string[] }> };

export type ProxyDeps = {
  getAccessToken: (req: Request) => Promise<string | null>;
  fetchImpl?: typeof fetch;
  nestApiUrl?: string;
};

export function createProxyHandler(deps: ProxyDeps) {
  const fetchImpl = deps.fetchImpl ?? fetch;

  return async function proxy(req: Request, context: ProxyContext): Promise<Response> {
    const accessToken = await deps.getAccessToken(req);
    if (!accessToken) {
      return Response.json({ message: 'برای ادامه وارد شوید.' }, { status: 401 });
    }

    const { path } = await context.params;
    const nestPath = path.join('/');
    if (!nestPath || !ALLOWED_NEST_PATH.test(nestPath)) {
      return Response.json({ message: 'Not found' }, { status: 404 });
    }

    const baseUrl = deps.nestApiUrl ?? process.env.NEST_API_URL;
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
      upstream = await fetchImpl(backendUrl, {
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
  };
}
