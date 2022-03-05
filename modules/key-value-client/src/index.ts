import Redis from 'ioredis';

class KeyValueDao {
  private client?: Redis;

  constructor(public uri: string) {}

  async connect(): Promise<void> {
    this.client = new Redis(this.uri);
  }

  async disconnect(): Promise<undefined> {
    if (this.client == null) {
      throw new Error('Not connected');
    }

    return this.client.disconnect();
  }

  async set(key: string, value: string): Promise<undefined> {
    if (this.client == null) {
      throw new Error('Not connected');
    }

    return this.client.set(key, value);
  }

  async get(key: string): Promise<string | undefined> {
    if (this.client == null) {
      throw new Error('Not connected');
    }

    return this.client.get(key);
  }

  async delete(key: string): Promise<void> {
    if (this.client == null) {
      throw new Error('Not connected');
    }

    return this.client.del(key);
  }

  async clear(): Promise<undefined> {
    return this.client.flushdb();
  }
}

export default KeyValueDao;
