import { getSecret } from 'astro:env/server'; // eslint-disable-line

import { createStorage } from 'unstorage';

import upstash from 'unstorage/drivers/upstash';

export const storage = createStorage({
  driver: upstash({
    base: 'opn',
    token: getSecret('UPSTASH_REDIS_TOKEN'),
    url: getSecret('UPSTASH_REDIS_URL'),
  }),
});
