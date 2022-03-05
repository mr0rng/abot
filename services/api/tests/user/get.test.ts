import { TestsEnv } from '..';

const env = new TestsEnv();

beforeEach(() => env.start());
afterEach(() => env.stop());

test('main', async () => {
  const sessionId = await env.createSession();

  expect(await env.client.user.get({ session: sessionId })).toStrictEqual({
    type: 'web',
    login: 'tstlgn',
    isAdmin: true,
    payload: { a: 12 },
  });
});

test('invalid session', async () => {
  await expect(env.client.user.get({ session: 'invld' })).rejects.toThrow('Session not found');
});
