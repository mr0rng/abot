import path from 'path';

import config from '@abot/config';
import { migrate } from "postgres-migrations";
import pg from "pg";

(async () => {
  let client = undefined;

  try {
    client = new pg.Client(config.databases.main.uri);
    await client.connect();
    console.log("db/main: Start migrations");
    await migrate({ client }, path.join(process.cwd(), "migrations"));
    console.log("db/main: All migrations applied");
  } finally {
    if (client) {
      await client.end();
    }
  }
})();
