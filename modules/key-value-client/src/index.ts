import Redis from 'ioredis';


class KeyValueDao {
  private client?: Redis;

    constructor(
        public uri: string
    ) { }

    async connect(): Promise<void> {
        this.client = new Redis(this.uri);
    }

    async disconnect(): Promise<undefined> {
        if (this.client == null) {
            throw new Error('Not connected');
        }

        return await this.client.disconnect();
    }

    async set(key: string, value: string): Promise<undefined> {
        if (this.client == null) {
            throw new Error('Not connected');
        }

        return await this.client.set(key, value);
    }

    async get(key: string): Promise<string> {
        if (this.client == null) {
            throw new Error('Not connected');
        }

        return await this.client.get(key);
    }

    async delete(key: string): Promise<undefined> {
        if (this.client == null) {
            throw new Error('Not connected');
        }

        return await this.client.del(key);
    }

    async clear(): Promise<undefined> {
        return await this.client.flushdb();
    }
}


export default KeyValueDao;
