const buckets = new Map();

export const rateLimit = ({
  windowMs = 60 * 1000,
  max = 30,
  keyPrefix = "global",
} = {}) => {
  return (req, res, next) => {
    const key = `${keyPrefix}:${req.userId || req.ip}`;
    const now = Date.now();
    const bucket = buckets.get(key) || { count: 0, resetAt: now + windowMs };

    if (now > bucket.resetAt) {
      bucket.count = 0;
      bucket.resetAt = now + windowMs;
    }

    bucket.count += 1;
    buckets.set(key, bucket);

    if (bucket.count > max) {
      return res.status(429).json({
        success: false,
        message: "Too many requests. Please try again shortly.",
      });
    }

    next();
  };
};
