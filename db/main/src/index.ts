import path from 'path';
import pg, { Client } from 'pg';
import { migrate } from 'postgres-migrations';

import config from '@abot/config';

(async () => {
  let client: Client | undefined = undefined;

  try {
    client = new pg.Client(config.databases.main.uri);
    await client.connect();
    // eslint-disable-next-line no-console
    console.log('db/main: Start migrations');
    await migrate({ client }, path.join(process.cwd(), 'migrations'));
    // eslint-disable-next-line no-console
    console.log('db/main: All migrations applied');
  } finally {
    if (client) {
      await client.end();
    }
  }
})();
