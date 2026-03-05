import { NextResponse } from 'next/server';

interface RateLimitEntry {
  timestamps: number[];
}

const store = new Map<string, RateLimitEntry>();

const CLEANUP_INTERVAL = 60_000;
let lastCleanup = Date.now();

function cleanup(windowMs: number) {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  lastCleanup = now;
  const cutoff = now - windowMs;
  for (const [key, entry] of store) {
    entry.timestamps = entry.timestamps.filter((t) => t > cutoff);
    if (entry.timestamps.length === 0) store.delete(key);
  }
}

export interface RateLimitConfig {
  /** Max requests allowed in the window. */
  limit: number;
  /** Time window in milliseconds. */
  windowMs: number;
}

const PRESETS = {
  /** Expensive endpoints — embedding generation, similarity search. */
  expensive: { limit: 15, windowMs: 60_000 } as RateLimitConfig,
  /** Standard write operations — add, update, remove. */
  write: { limit: 30, windowMs: 60_000 } as RateLimitConfig,
  /** Read-heavy endpoints — library list. */
  read: { limit: 60, windowMs: 60_000 } as RateLimitConfig,
} as const;

export { PRESETS as rateLimitPresets };

/**
 * Sliding-window rate limiter. Returns null if under limit,
 * or a 429 NextResponse if over limit.
 */
export function rateLimit(
  identifier: string,
  config: RateLimitConfig,
): NextResponse | null {
  cleanup(config.windowMs);

  const now = Date.now();
  const cutoff = now - config.windowMs;
  let entry = store.get(identifier);

  if (!entry) {
    entry = { timestamps: [] };
    store.set(identifier, entry);
  }

  entry.timestamps = entry.timestamps.filter((t) => t > cutoff);

  if (entry.timestamps.length >= config.limit) {
    const oldestInWindow = entry.timestamps[0];
    const retryAfterSec = Math.ceil((oldestInWindow + config.windowMs - now) / 1000);

    return NextResponse.json(
      {
        success: false,
        error: 'Too many requests. Please slow down.',
        code: 'RATE_LIMITED',
        retry_after: retryAfterSec,
      },
      {
        status: 429,
        headers: {
          'Retry-After': String(retryAfterSec),
          'X-RateLimit-Limit': String(config.limit),
          'X-RateLimit-Remaining': '0',
        },
      },
    );
  }

  entry.timestamps.push(now);
  return null;
}
