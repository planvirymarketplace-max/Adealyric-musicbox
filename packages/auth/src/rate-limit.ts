interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
}

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

// Default rate limits per tenant plan
const RATE_LIMITS: Record<string, RateLimitConfig> = {
  free: { windowMs: 60000, maxRequests: 100 }, // 100 requests per minute
  pro: { windowMs: 60000, maxRequests: 1000 }, // 1000 requests per minute
  enterprise: { windowMs: 60000, maxRequests: 10000 }, // 10000 requests per minute
};

// In-memory store for rate limits (in production, use Redis)
const rateLimitStore = new Map<string, RateLimitEntry>();

/**
 * Check if a request should be rate limited
 */
export function checkRateLimit(
  organizationId: string,
  plan: string = 'free'
): { allowed: boolean; remaining: number; resetAt: number } {
  const config = RATE_LIMITS[plan] || RATE_LIMITS.free;
  const key = `${organizationId}`;
  const now = Date.now();

  let entry = rateLimitStore.get(key);

  // Reset if window has passed
  if (!entry || now > entry.resetAt) {
    entry = {
      count: 0,
      resetAt: now + config.windowMs,
    };
    rateLimitStore.set(key, entry);
  }

  // Check if limit exceeded
  if (entry.count >= config.maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: entry.resetAt,
    };
  }

  // Increment counter
  entry.count++;
  rateLimitStore.set(key, entry);

  return {
    allowed: true,
    remaining: config.maxRequests - entry.count,
    resetAt: entry.resetAt,
  };
}

/**
 * Get rate limit headers for response
 */
export function getRateLimitHeaders(result: {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}) {
  return {
    'X-RateLimit-Limit': '100',
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': new Date(result.resetAt).toISOString(),
  };
}

/**
 * Clean up expired rate limit entries
 */
export function cleanupRateLimits() {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetAt) {
      rateLimitStore.delete(key);
    }
  }
}

// Run cleanup every minute
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupRateLimits, 60000);
}
