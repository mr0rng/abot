import { TestsEnv } from '../..';

const env = new TestsEnv();

beforeEach(() => env.start());
afterEach(() => env.stop());

test('main', async () => {
  const user = await env.client.user.telegram.signUp({ 
    session: env.config.sessions.admin_key,
    login: 'usrlgn', 
    telegramId: 'telegram-id' 
  });

  expect(user).toStrictEqual({
    isAdmin: false,
    login: 'usrlgn',
    type: 'telegram',
    payload: { telegramId: 'telegram-id' }
  });
});

test('duplicate web', async () => {
  await env.dao.prepareDB({
    Users: [
      {
        id: 'asd',
        isAdmin: false,
        isBanned: false,
        login: 'usrlgn',
        type: 'web',
        payload: { privateKeys: { passwordHash: 'hshpwd' } },
      },
    ],
  });

  const signUpRequest = {
    session: env.config.sessions.admin_key,
    login: 'usrlgn', 
    telegramId: 'telegram-id' 
  }
  await expect(env.client.user.telegram.signUp(signUpRequest)).rejects.toThrow(
    'User already exists',
  );
});
