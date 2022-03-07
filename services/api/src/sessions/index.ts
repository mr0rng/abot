import { v4 } from 'uuid';

import { Config } from '@abot/config';
import KeyValueDao from '@abot/key-value-client';
import { User } from '@abot/model';

export default class SessionDAO {
  protected client: KeyValueDao;

  constructor(config: Config) {
    this.client = new KeyValueDao(config.sessions.uri);
    this.admin_key = config.sessions.admin_key;
  }

  async start(): Promise<void> {
    return this.client.connect();
  }

  async end(): Promise<void> {
    await this.client.disconnect();
  }

  async create(user: User): Promise<string> {
    const result = v4();
    await this.client.set(result, JSON.stringify(user));

    return result;
  }

  async get(key: string): Promise<User | undefined> {
    if (key == this.admin_key) {
      return {
        login: 'api_admin',
        isAdmin: true
      } as User;
    }
    const serialized = await this.client.get(key);
    return serialized == null ? undefined : (JSON.parse(serialized) as User);
  }

  async delete(key: string): Promise<void> {
    await this.client.delete(key);
  }
}

export class TestSessionDAO extends SessionDAO {
  async clear(): Promise<undefined> {
    return this.client.clear();
  }
}
