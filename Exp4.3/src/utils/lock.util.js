import { v4 as uuidv4 } from "uuid";
import { getRedisClient } from "../config/redis.js";

const LOCK_TTL = 10; // seconds

export const acquireLock = async (key) => {
  const client = getRedisClient();
  const token = uuidv4();

  const result = await client.set(key, token, {
    NX: true,
    EX: LOCK_TTL,
  });

  if (!result) return null;

  return token;
};

export const releaseLock = async (key, token) => {
  const client = getRedisClient();

  const currentToken = await client.get(key);

  if (currentToken === token) {
    await client.del(key);
  }
};