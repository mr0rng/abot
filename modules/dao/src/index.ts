import { Pool, PoolClient, QueryResult } from 'pg';

import { Config } from '@abot/config';

class DAOError extends Error {}
class UnexpectedNumberOfRows extends DAOError {
  isUnexpectedNumberOfRows = true;
}

class DAO {
  private pool: Pool;

  constructor(public config: Config) {
    this.pool = new Pool({
      connectionString: this.config.databases.main.uri,
      max: this.config.databases.main.pool_size,
    });
  }

  async execute<T>(sql: string, params?: unknown[]): Promise<QueryResult<T>> {
    let client: PoolClient | undefined;
    try {
      client = await this.pool.connect();
      return client.query(sql, params);
    } finally {
      if (client != null) {
        client.release();
      }
    }
  }

  async executeOne<T>(sql: string, params?: unknown[]): Promise<T> {
    const { rows } = await this.execute<T>(sql, params);
    if (rows.length !== 1) {
      throw new UnexpectedNumberOfRows(`executeOne: Unexpected number of rows ${rows.length}`);
    }

    return rows[0];
  }

  async end() {
    await this.pool.end();
  }
}

export default DAO;

export { UnexpectedNumberOfRows, DAOError };
