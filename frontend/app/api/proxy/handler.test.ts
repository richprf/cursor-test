import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { accessTokenFromJwt } from '../../../lib/access-token-from-jwt.ts';
import { createProxyHandler, userIdFromAccessToken } from './handler.ts';

function request(path = '/api/proxy/cart', init?: RequestInit) {
  return new Request(`http://localhost:3000${path}`, init);
}

function jwtWithSub(sub: string): string {
  const payload = Buffer.from(JSON.stringify({ sub })).toString('base64url');
  return `eyJhbGciOiJub25lIn0.${payload}.sig`;
}

describe('BFF proxy handler', () => {
  it('returns 401 and does not call Nest when the visitor is signed out', async () => {
    let nestCalls = 0;
    const proxy = createProxyHandler({
      getAccessToken: async () => null,
      nestApiUrl: 'http://nest.test',
      fetchImpl: async () => {
        nestCalls += 1;
        return new Response('should-not-run');
      },
    });

    const response = await proxy(request(), { params: Promise.resolve({ path: ['cart'] }) });

    assert.equal(response.status, 401);
    assert.equal(nestCalls, 0);
    assert.match(await response.text(), /وارد شوید/);
  });

  it('returns 401 and does not call Nest after RefreshTokenExpired', async () => {
    let nestCalls = 0;
    const proxy = createProxyHandler({
      getAccessToken: async () =>
        accessTokenFromJwt({ accessToken: 'stale-access', error: 'RefreshTokenExpired' }),
      nestApiUrl: 'http://nest.test',
      fetchImpl: async () => {
        nestCalls += 1;
        return new Response('should-not-run');
      },
    });

    const response = await proxy(request(), { params: Promise.resolve({ path: ['cart'] }) });

    assert.equal(response.status, 401);
    assert.equal(nestCalls, 0);
  });

  it('forwards method, query, body and Bearer token to Nest and returns its payload', async () => {
    let seen: { url: string; method: string; auth: string | null; body: string } | undefined;
    const proxy = createProxyHandler({
      getAccessToken: async () => 'fresh-access-token',
      nestApiUrl: 'http://nest.test',
      fetchImpl: async (input, init) => {
        const url = String(input);
        const raw = init?.body;
        const body =
          raw instanceof ArrayBuffer
            ? new TextDecoder().decode(raw)
            : raw instanceof Uint8Array
              ? new TextDecoder().decode(raw)
              : '';
        seen = {
          url,
          method: String(init?.method),
          auth: new Headers(init?.headers).get('Authorization'),
          body,
        };
        return new Response(JSON.stringify({ items: [{ productId: 'p1' }], totalItems: 1 }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      },
    });

    const response = await proxy(
      request('/api/proxy/cart?expand=1', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: 'p1' }),
      }),
      { params: Promise.resolve({ path: ['cart'] }) },
    );

    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { items: [{ productId: 'p1' }], totalItems: 1 });
    assert.equal(seen?.method, 'POST');
    assert.equal(seen?.auth, 'Bearer fresh-access-token');
    assert.equal(seen?.url, 'http://nest.test/cart?expand=1');
    assert.equal(seen?.body, JSON.stringify({ productId: 'p1' }));
  });

  it('returns 502 when NestJS is unreachable', async () => {
    const proxy = createProxyHandler({
      getAccessToken: async () => 'fresh-access-token',
      nestApiUrl: 'http://nest.test',
      fetchImpl: async () => {
        throw new Error('ECONNREFUSED');
      },
    });

    const response = await proxy(request(), { params: Promise.resolve({ path: ['cart'] }) });
    assert.equal(response.status, 502);
  });

  it('rejects login/refresh paths even when a session exists', async () => {
    let nestCalls = 0;
    const proxy = createProxyHandler({
      getAccessToken: async () => 'fresh-access-token',
      nestApiUrl: 'http://nest.test',
      fetchImpl: async () => {
        nestCalls += 1;
        return new Response('nope');
      },
    });

    const response = await proxy(request('/api/proxy/auth/login', { method: 'POST' }), {
      params: Promise.resolve({ path: ['auth', 'login'] }),
    });

    assert.equal(response.status, 404);
    assert.equal(nestCalls, 0);
  });

  it('rate-limits by access-token subject before calling Nest', async () => {
    let nestCalls = 0;
    let seenId: string | undefined;
    const proxy = createProxyHandler({
      getAccessToken: async () => jwtWithSub('user-99'),
      nestApiUrl: 'http://nest.test',
      rateLimit: async (identifier) => {
        seenId = identifier;
        return { allowed: false, retryAfterSeconds: 30 };
      },
      fetchImpl: async () => {
        nestCalls += 1;
        return new Response('should-not-run');
      },
    });

    const response = await proxy(request(), { params: Promise.resolve({ path: ['cart'] }) });

    assert.equal(userIdFromAccessToken(jwtWithSub('user-99')), 'user-99');
    assert.equal(seenId, 'user-99');
    assert.equal(response.status, 429);
    assert.equal(response.headers.get('Retry-After'), '30');
    assert.match(await response.text(), /بیش از حد مجاز/);
    assert.equal(nestCalls, 0);
  });

  it('falls back to the client IP when the access token has no subject', async () => {
    let seenId: string | undefined;
    const proxy = createProxyHandler({
      getAccessToken: async () => 'not-a-jwt',
      nestApiUrl: 'http://nest.test',
      rateLimit: async (identifier) => {
        seenId = identifier;
        return { allowed: true };
      },
      fetchImpl: async () => new Response('{}', { headers: { 'Content-Type': 'application/json' } }),
    });

    await proxy(
      request('/api/proxy/cart', { headers: { 'x-forwarded-for': '203.0.113.9, 10.0.0.1' } }),
      { params: Promise.resolve({ path: ['cart'] }) },
    );

    assert.equal(seenId, 'ip:203.0.113.9');
  });

  it('returns 504 when Nest exceeds the proxy timeout', async () => {
    let nestCalls = 0;
    const proxy = createProxyHandler({
      getAccessToken: async () => 'fresh-access-token',
      nestApiUrl: 'http://nest.test',
      timeoutMs: 20,
      fetchImpl: (_input, init) =>
        new Promise((_, reject) => {
          nestCalls += 1;
          init?.signal?.addEventListener('abort', () => {
            const error = new Error('aborted');
            error.name = 'AbortError';
            reject(error);
          });
        }),
    });

    const response = await proxy(request(), { params: Promise.resolve({ path: ['cart'] }) });
    assert.equal(response.status, 504);
    assert.equal(nestCalls, 1);
    assert.match(await response.text(), /زمان پاسخ‌گویی/);
  });
});
