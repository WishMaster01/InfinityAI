import Redis from "ioredis";

const redisUrl = process.env.REDIS_URL;
export const redis = redisUrl
  ? new Redis(redisUrl, { maxRetriesPerRequest: null, enableReadyCheck: true })
  : null;
export const redisEnabled = Boolean(redis);

export const closeRedis = async () => {
  if (redis) await redis.quit();
};
