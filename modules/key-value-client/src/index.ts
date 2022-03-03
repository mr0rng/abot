import Redis from 'ioredis';


class KeyValueDao {
    private client: Redis;

    constructor (
        public uri: string
    ) {
        this.client = new Redis(uri);
    }

    async connect(): Promise<undefined> {
        return undefined;
    }

    async disconnect(): Promise<undefined> {
        return await this.client.disconnect();
    }

    async set(key: string, value: string): Promise<undefined> {
        return await this.client.set(key, value);
    }

    async get(key: string): Promise<string> {
        return await this.client.get(key);
    }

    async delete(key: string): Promise<undefined> {
        return await this.client.del(key);
    }
}


export default KeyValueDao;
