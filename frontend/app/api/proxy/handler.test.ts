import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { accessTokenFromJwt } from '../../../lib/access-token-from-jwt.ts';
import { createProxyHandler } from './handler.ts';

function request(path = '/api/proxy/cart', init?: RequestInit) {
  return new Request(`http://localhost:3000${path}`, init);
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
});
