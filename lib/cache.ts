import { Redis } from "@upstash/redis";

// If Upstash env vars aren't set (e.g. during local dev without Redis),
// fall through to a no-op cache so the app still works.
let redis: Redis | null = null;

if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });
}

/**
 * Fetch from cache, or call loader and store the result.
 *
 * @param key   Cache key — must be unique per dataset + view + params
 * @param ttl   Time-to-live in seconds (default 30)
 * @param loader  Async function that fetches fresh data
 */
export async function withCache<T>(
  key: string,
  ttl: number,
  loader: () => Promise<T>
): Promise<T> {
  if (!redis) return loader();

  const cached = await redis.get<T>(key);
  if (cached !== null) return cached;

  const fresh = await loader();
  await redis.set(key, fresh, { ex: ttl });
  return fresh;
}

/**
 * Invalidate a specific cache key — call after any write that changes data.
 */
export async function invalidate(key: string): Promise<void> {
  if (!redis) return;
  await redis.del(key);
}

/**
 * Build a consistent cache key from the reader params.
 */
export function readerKey(
  dataset: string,
  view: string,
  extras: Record<string, string | number | undefined> = {}
): string {
  const parts = [`reader`, dataset, view];
  for (const [k, v] of Object.entries(extras)) {
    if (v !== undefined) parts.push(`${k}:${v}`);
  }
  return parts.join(":");
}
