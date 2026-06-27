export class TokenBucketStore {
  constructor({ now = () => Date.now(), idleTtlMs = 15 * 60 * 1000 } = {}) {
    this.buckets = new Map();
    this.now = now;
    this.idleTtlMs = idleTtlMs;
    this.operations = 0;
  }

  consume(key, { capacity, refillPerSecond, cost = 1 }) {
    const now = this.now();
    const previous = this.buckets.get(key) || {
      tokens: capacity,
      updatedAt: now,
      lastSeenAt: now,
    };
    const elapsedSeconds = Math.max(0, now - previous.updatedAt) / 1000;
    const available = Math.min(
      capacity,
      previous.tokens + elapsedSeconds * refillPerSecond,
    );
    const allowed = available >= cost;
    const tokens = allowed ? available - cost : available;
    this.buckets.set(key, { tokens, updatedAt: now, lastSeenAt: now });
    if (++this.operations % 500 === 0) this.#sweep(now);
    return {
      allowed,
      remaining: Math.floor(tokens),
      retryAfterSeconds: allowed
        ? 0
        : Math.max(1, Math.ceil((cost - tokens) / refillPerSecond)),
    };
  }

  #sweep(now) {
    for (const [key, bucket] of this.buckets) {
      if (now - bucket.lastSeenAt > this.idleTtlMs) this.buckets.delete(key);
    }
  }
}
