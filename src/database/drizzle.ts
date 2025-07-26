import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';

import { getSecret } from 'astro:env/server'; // eslint-disable-line

const sql = neon(getSecret('DATABASE_URL')!);

export const db = drizzle({ client: sql });
