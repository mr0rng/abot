import KeyValueDao from "@abot/key-value-client";
import { Config } from "@abot/config";
import { User } from "@abot/model";
import { v4 } from 'uuid';


type Session = Omit<User, "passwordHash">;


class SessionDao {
    client: KeyValueDao;

    constructor(config: Config) {
        this.client = new KeyValueDao(config.sessions.uri);
    }

    async start(): Promise<undefined> {
        return await this.client.connect();
    }

    async end(): Promise<undefined> {
        return await this.client.disconnect();
    }

    async create_session(session: Session): Promise<string> {
        const serialized = JSON.stringify(session);
        const key = v4();
        await this.client.set(key, serialized);
        return key;
    }

    async get_session(key: string): Promise<Session> {
        const serialized = await this.client.get(key);
        return JSON.parse(serialized) as Session;
    }

    async drop_session(key: string): Promise<undefined> {
        return await this.client.delete(key);
    }
}


export { SessionDao, Session };
