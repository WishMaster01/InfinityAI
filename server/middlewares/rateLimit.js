import { TokenBucketStore } from "../utils/dsa/rateLimiter.js";

const buckets = new TokenBucketStore();
const PLAN_LIMITS = {
  BASIC: { capacity: 5, refillPerSecond: 5 / 60 },
  MODERATE: { capacity: 20, refillPerSecond: 20 / 60 },
  PRO: { capacity: 60, refillPerSecond: 1 },
};

export const rateLimit = ({ keyPrefix = "global", cost = 1 } = {}) => {
  return (req, res, next) => {
    const key = `${keyPrefix}:${req.userId || req.ip}`;
    const limits = PLAN_LIMITS[req.plan] || PLAN_LIMITS.BASIC;
    const result = buckets.consume(key, { ...limits, cost });
    res.setHeader("X-RateLimit-Limit", String(limits.capacity));
    res.setHeader("X-RateLimit-Remaining", String(result.remaining));
    if (!result.allowed) {
      res.setHeader("Retry-After", String(result.retryAfterSeconds));
      return res.status(429).json({
        success: false,
        message: "Plan request limit reached. Please retry later.",
        code: "RATE_LIMITED",
        retryAfterSeconds: result.retryAfterSeconds,
      });
    }
    next();
  };
};
