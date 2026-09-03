import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { createMemoryRateLimit, envPositiveInt } from './proxy-rate-limit.ts';

describe('createMemoryRateLimit', () => {
  it('allows up to the limit then rejects with Retry-After', async () => {
    let now = 1_000;
    const rateLimit = createMemoryRateLimit({
      limit: 2,
      windowMs: 60_000,
      now: () => now,
    });

    assert.equal((await rateLimit('user-1')).allowed, true);
    assert.equal((await rateLimit('user-1')).allowed, true);
    const blocked = await rateLimit('user-1');
    assert.equal(blocked.allowed, false);
    assert.equal(blocked.retryAfterSeconds, 60);

    assert.equal((await rateLimit('user-2')).allowed, true);
  });

  it('frees a slot after the window elapses', async () => {
    let now = 1_000;
    const rateLimit = createMemoryRateLimit({
      limit: 1,
      windowMs: 1_000,
      now: () => now,
    });

    assert.equal((await rateLimit('user-1')).allowed, true);
    assert.equal((await rateLimit('user-1')).allowed, false);
    now = 2_001;
    assert.equal((await rateLimit('user-1')).allowed, true);
  });
});

describe('envPositiveInt', () => {
  it('falls back when the env var is missing or invalid', () => {
    delete process.env.NEST_PROXY_RATE_LIMIT;
    assert.equal(envPositiveInt('NEST_PROXY_RATE_LIMIT', 90), 90);
    process.env.NEST_PROXY_RATE_LIMIT = '0';
    assert.equal(envPositiveInt('NEST_PROXY_RATE_LIMIT', 90), 90);
    process.env.NEST_PROXY_RATE_LIMIT = '120';
    assert.equal(envPositiveInt('NEST_PROXY_RATE_LIMIT', 90), 120);
    delete process.env.NEST_PROXY_RATE_LIMIT;
  });
});
