import { TestsEnv } from '../..';

const env = new TestsEnv();

beforeEach(async () => env.start());
afterEach(async () => env.stop());

test('main', async () => {
  const { session } = await env.client.user.password.signUp({ login: 'usrlgn', passwordHash: 'hshpwd' });
  const sessionUser = await env.sessions.get(session);

  expect(await env.dao.tableData('Users')).toStrictEqual([
    {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      id: sessionUser!.id,
      isAdmin: false,
      isBanned: false,
      login: 'usrlgn',
      type: 'web',
      payload: { privateKeys: { passwordHash: 'hshpwd' } },
    },
  ]);
  expect(sessionUser).toStrictEqual({
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    id: sessionUser!.id,
    isAdmin: false,
    isBanned: false,
    login: 'usrlgn',
    type: 'web',
    payload: { privateKeys: { passwordHash: 'hshpwd' } },
  });
});

test('duplicate', async () => {
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

  await expect(env.client.user.password.signUp({ login: 'usrlgn', passwordHash: 'hshpwd' })).rejects.toThrow(
    'User already exists',
  );
});
