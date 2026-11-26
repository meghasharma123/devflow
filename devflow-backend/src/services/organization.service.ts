import redis from "../config/redis.";
import {
  findOrgFromId,
  updateOrg,
} from "../repositories/organization.repository";

export async function getOrgFromId(id: string) {
  const cacheKey = `org:${id}`;

  // try redis
  try {
    const cachedOrg = await redis.get(cacheKey);

    if (cachedOrg) {
      console.log("Cache HIT");
      return JSON.parse(cachedOrg);
    }
  } catch (error) {
    console.error("Redis GET failed:", error);
  }

  // 2. Fallback to PostgreSQL
  console.log("Fetching from PostgreSQL");

  const org = await findOrgFromId(id);

  if (!org) {
    return null;
  }

  try {
    await redis.set(cacheKey, JSON.stringify(org), { EX: 300 });
  } catch (error) {
    console.error("Redis SET failed:", error);
  }

  return org;
}

export async function updateOrganization(id: string, name: string) {
  const cacheKey = `org:${id}`;
  const org = await updateOrg(id, name);
  await redis.del(cacheKey);
  return org;
}
