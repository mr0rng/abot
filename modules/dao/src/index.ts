import { Pool, PoolClient, QueryResult } from 'pg'

import { Config } from '@abot/config'

class DAO {
  private pool: Pool;

  constructor (
    public config: Config
  ) { 
    this.pool = new Pool({
      connectionString: this.config.databases.main.uri,
      max: this.config.databases.main.pool_size
    });
  }

  async execute <T>(sql: string, params?: any[]): Promise<QueryResult<T>> {
    let client: PoolClient | undefined;
    try {
      client = await this.pool.connect();
      return await client.query(sql, params);
    } finally {
      if (client != null) {
        client.release();
      }
    }
  }

  async executeOne <T>(sql: string, params?: any[]): Promise<T> {
    const { rows } = await this.execute<T>(sql, params);
    if (rows.length !== 1) {
      throw new Error(`executeOne: Unexpected number of rows ${rows.length}`);
    }

    return rows[0];
  }

  async end () {
    await this.pool.end()
  }
}

export default DAO;