import { createClient } from "redis";

const redis = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6739",
});

redis.on("error", (err) => {
  console.log("Redis client error: ", err);
});

export const connectRedis = async () => {
  if (!redis.isOpen) {
    await redis.connect();
    console.log("Redis connected successfully!");
  }
};

export default redis;