import { eq, sql } from 'drizzle-orm';

import { storage } from '@/database/redis';
import { db } from '@/database/drizzle';
import { profilesTable } from '@/database/schema';

const getProfile = async (username: string) => {
  const profiles = await db
    .select()
    .from(profilesTable)
    .where(eq(profilesTable.username, username));
  return profiles[0];
};

const incrementOrCreateVisit = async (username: string) => {
  const profile = await getProfile(username);

  if (!profile) {
    await db.insert(profilesTable).values({ username, visits: 1 });
  } else if (profile.isActive !== false) {
    await db
      .update(profilesTable)
      .set({ visits: sql`${profilesTable.visits} + 1` })
      .where(eq(profilesTable.username, username));
  }
};

const getSourceUrl = (username: string, branch: string) => {
  return `https://raw.githubusercontent.com/${username}/.opn/refs/heads/${branch}/bio.json`;
};

const fetchSource = async (
  username: string,
  branch: string,
): Promise<{ status: number; url: string }> => {
  const url = getSourceUrl(username, branch);
  const res = await fetch(url);

  return { status: res.status, url };
};

const cacheSource = async (key: string, source: string) => {
  await storage.setItem(key, source, { ttl: 60 * 60 });
};

const markProfileInactive = async (username: string) => {
  await db
    .update(profilesTable)
    .set({ isActive: false })
    .where(eq(profilesTable.username, username));
};

export const resolveSource = async (
  username: string,
): Promise<string | null> => {
  const cacheKey = `profile:${username}`;
  const cachedSource = await storage.getItem<string>(cacheKey);

  if (cachedSource) {
    await incrementOrCreateVisit(username);
    return cachedSource;
  }

  const mainResult = await fetchSource(username, 'main');
  if (mainResult.status === 200) {
    await cacheSource(cacheKey, mainResult.url);
    await incrementOrCreateVisit(username);

    return mainResult.url;
  }

  const masterResult = await fetchSource(username, 'master');
  if (masterResult.status === 200) {
    await cacheSource(cacheKey, masterResult.url);
    await incrementOrCreateVisit(username);

    return masterResult.url;
  }

  if (mainResult.status === 404 && masterResult.status === 404) {
    await markProfileInactive(username);
    return null;
  }

  return mainResult.url;
};
