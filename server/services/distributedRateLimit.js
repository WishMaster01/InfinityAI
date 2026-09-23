import { redis } from "../configs/redis.js";
import { TokenBucketStore } from "../utils/dsa/rateLimiter.js";

const localStore = new TokenBucketStore();
const script = `local current = redis.call('INCRBY', KEYS[1], ARGV[1]); if current == tonumber(ARGV[1]) then redis.call('EXPIRE', KEYS[1], ARGV[2]) end; return current`;

export const consumeDistributed = async (
  key,
  { capacity, windowSeconds, cost = 1 },
) => {
  if (!redis)
    return localStore.consume(key, {
      capacity,
      refillPerSecond: capacity / windowSeconds,
      cost,
    });
  const current = Number(
    await redis.eval(script, 1, `ratelimit:${key}`, cost, windowSeconds),
  );
  const allowed = current <= capacity;
  return {
    allowed,
    remaining: Math.max(0, capacity - current),
    retryAfterSeconds: allowed ? 0 : windowSeconds,
  };
};
