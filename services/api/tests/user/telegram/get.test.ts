import { TestsEnv } from '../..';

const env = new TestsEnv();

beforeEach(async () => env.start());
afterEach(async () => env.stop());

test.skip('get finds user', async () => {
  await env.dao.prepareDB({
    Users: [
      {
        id: 'asd',
        isAdmin: false,
        isBanned: false,
        login: 'usrlgn',
        type: 'telegram',
        payload: { telegramId: 'telegram-id' },
      },
    ],
  });

  const user = await env.client.user.telegram.get({
    session: env.config.sessions.admin_key,
    telegramId: 'telegram-id',
  });

  expect(user).toStrictEqual({
    isAdmin: false,
    login: 'usrlgn',
    type: 'telegram',
    payload: { telegramId: 'telegram-id' },
  });
});

test.skip('get finds only telegram users', async () => {
  await env.dao.prepareDB({
    Users: [
      {
        id: 'asd',
        isAdmin: false,
        isBanned: false,
        login: 'usrlgn',
        type: 'web',
        payload: {
          telegramId: 'telegram-id',
          privateKeys: { passwordHash: 'hshpwd' },
        },
      },
    ],
  });

  await expect(
    env.client.user.telegram.get({
      session: env.config.sessions.admin_key,
      telegramId: 'telegram-id',
    }),
  ).rejects.toThrow('Not Found');
});
