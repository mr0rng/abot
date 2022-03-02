import path from 'path';

import config from '@abot/config';
import { migrate } from "postgres-migrations";
import pg from "pg";

(async () => {
  const client = new pg.Client(config.databases.main.uri);
  await client.connect()

  try {
    await migrate({ client }, path.join(process.cwd(), "migrations"));
    console.log("db/main: All migrations applied")
  } catch(e) {
    console.error("db/main:", e);
  } finally {
    await client.end()
  }
})();