import ApiClient from '@abot/api-client';
import config from '@abot/config';
import TestsDAO from '@abot/dao/target/tests';
import { User } from '@abot/model';

import Application from '../src/app';
import { TestSessionDAO } from '../src/sessions';

export class TestsEnv {
  public application: Application = undefined as unknown as Application;
  public dao: TestsDAO = undefined as unknown as TestsDAO;
  public client: ApiClient = undefined as unknown as ApiClient;
  public sessions: TestSessionDAO = undefined as unknown as TestSessionDAO;

  async start() {
    this.application = new Application(config);
    this.dao = new TestsDAO(config);
    this.client = new ApiClient(config);
    this.sessions = new TestSessionDAO(config);

    await this.sessions.start();
    await this.client.start();
    await this.application.start();

    await this.dao.clear();
    await this.sessions.clear();
  }

  async stop() {
    await this.dao.end();
    await this.sessions.end();
    await this.client.end();
    await this.application.end();
  }

  async createSession(userPartial: Partial<User> = {}): Promise<string> {
    const user = {
      id: 'tst',
      login: 'tstlgn',
      type: 'web',
      isAdmin: true,
      isBanned: false,
      payload: {
        privateKeys: { passwordHash: 'testasgas' },
        a: 12,
      },
      ...userPartial,
    } as User;
    await this.dao.prepareDB({ Users: [user] });

    const session = await this.sessions.create(user);
    return session;
  }
}
