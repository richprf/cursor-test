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

const DEFAULT_TIMEOUT_MS = 12_000;

export type ProxyContext = { params: Promise<{ path: string[] }> };

export type RateLimitDecision = { allowed: boolean; retryAfterSeconds?: number };

export type ProxyDeps = {
  getAccessToken: (req: Request) => Promise<string | null>;
  fetchImpl?: typeof fetch;
  nestApiUrl?: string;
  rateLimit?: (identifier: string) => Promise<RateLimitDecision>;
  timeoutMs?: number;
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

    if (deps.rateLimit) {
      const identifier = proxyRateLimitIdentifier(req, accessToken);
      const decision = await deps.rateLimit(identifier);
      if (!decision.allowed) {
        const retryAfterSeconds = decision.retryAfterSeconds ?? 60;
        return Response.json(
          { message: 'تعداد درخواست‌های شما بیش از حد مجاز است. کمی صبر کنید.' },
          { status: 429, headers: { 'Retry-After': String(retryAfterSeconds) } },
        );
      }
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
    const timeoutMs = deps.timeoutMs ?? envTimeoutMs();

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    let upstream: Response;
    try {
      upstream = await fetchImpl(backendUrl, {
        method,
        headers,
        body,
        cache: 'no-store',
        signal: controller.signal,
      });
    } catch (error) {
      if (isAbortError(error)) {
        return Response.json({ message: 'زمان پاسخ‌گویی سرور به پایان رسید.' }, { status: 504 });
      }
      console.error('[bff-proxy] NestJS unreachable', error);
      return Response.json({ message: 'ارتباط با سرور برقرار نشد.' }, { status: 502 });
    } finally {
      clearTimeout(timeoutId);
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

export function proxyRateLimitIdentifier(req: Request, accessToken: string): string {
  return userIdFromAccessToken(accessToken) ?? `ip:${clientIpFromRequest(req)}`;
}

export function userIdFromAccessToken(accessToken: string): string | null {
  const parts = accessToken.split('.');
  if (parts.length < 2 || !parts[1]) return null;
  try {
    const padded = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const json = Buffer.from(padded, 'base64').toString('utf8');
    const payload = JSON.parse(json) as { sub?: unknown };
    return typeof payload.sub === 'string' && payload.sub.length > 0 ? payload.sub : null;
  } catch {
    return null;
  }
}

export function clientIpFromRequest(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    const first = forwarded.split(',')[0]?.trim();
    if (first) return first;
  }
  return req.headers.get('x-real-ip')?.trim() || 'unknown';
}

function envTimeoutMs(): number {
  const raw = process.env.NEST_PROXY_TIMEOUT_MS;
  const value = raw ? Number(raw) : NaN;
  return Number.isFinite(value) && value > 0 ? Math.floor(value) : DEFAULT_TIMEOUT_MS;
}

function isAbortError(error: unknown): boolean {
  return typeof error === 'object' && error !== null && 'name' in error && (error as { name: unknown }).name === 'AbortError';
}
