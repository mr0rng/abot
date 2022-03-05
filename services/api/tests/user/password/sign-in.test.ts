import { TestsEnv } from '../..';

const env = new TestsEnv();

beforeEach(() => env.start());
afterEach(() => env.stop());

test('main', async () => {
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

  const { session } = await env.client.user.password.signIn({ login: 'usrlgn', passwordHash: 'hshpwd' });
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

test('invalid login or passwordHash', async () => {
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

  await expect(env.client.user.password.signIn({ login: 'invld', passwordHash: 'hshpwd' })).rejects.toThrow(
    'Forbidden',
  );
  await expect(env.client.user.password.signIn({ login: 'invld', passwordHash: 'hshpwd' })).rejects.toThrow(
    'Forbidden',
  );
});
