/**
 * In-memory sliding window used by `/api/proxy/*`. Identifier is the user id
 * when the Nest JWT has a `sub`, otherwise the client IP.
 */

export type RateLimitDecision = { allowed: boolean; retryAfterSeconds?: number };

export type MemoryRateLimitOptions = {
  limit: number;
  windowMs: number;
  now?: () => number;
};

type Bucket = { timestamps: number[] };

export function envPositiveInt(name: string, fallback: number): number {
  const raw = process.env[name];
  if (!raw) return fallback;
  const value = Number(raw);
  return Number.isFinite(value) && value > 0 ? Math.floor(value) : fallback;
}

export function createMemoryRateLimit(
  options: MemoryRateLimitOptions,
): (identifier: string) => Promise<RateLimitDecision> {
  const hits = new Map<string, Bucket>();
  const now = options.now ?? Date.now;

  return async (identifier: string): Promise<RateLimitDecision> => {
    const at = now();
    const bucket = hits.get(identifier) ?? { timestamps: [] };
    bucket.timestamps = bucket.timestamps.filter((stamp) => at - stamp < options.windowMs);
    if (bucket.timestamps.length >= options.limit) {
      hits.set(identifier, bucket);
      const oldest = bucket.timestamps[0] ?? at;
      const retryAfterSeconds = Math.max(1, Math.ceil((options.windowMs - (at - oldest)) / 1000));
      return { allowed: false, retryAfterSeconds };
    }
    bucket.timestamps.push(at);
    hits.set(identifier, bucket);
    return { allowed: true };
  };
}

export function createProxyRateLimitFromEnv(): (identifier: string) => Promise<RateLimitDecision> {
  return createMemoryRateLimit({
    limit: envPositiveInt('NEST_PROXY_RATE_LIMIT', 90),
    windowMs: envPositiveInt('NEST_PROXY_RATE_WINDOW_MS', 60_000),
  });
}
