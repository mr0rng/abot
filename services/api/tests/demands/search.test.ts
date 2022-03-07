import { Demands, DemandsUTC, Scenarios, Users } from '.';
import { TestsEnv } from '..';

const env = new TestsEnv();

beforeEach(() => env.start());
afterEach(() => env.stop());

test('main', async () => {
  const session = { sessionUser: 'tstusr', isSessionUserIsAdmin: true };
  await env.dao.prepareDB({
    Users,
    Scenarios,
    Demands,
    Participants: [
      { demand: 'Location/Service', user: 'tstusr', type: 'recipient', payload: {} },
      { demand: 'Location/Service', user: 'tst', type: 'recipient', payload: {} },
      { demand: 'Location/Another', user: 'tst', type: 'recipient', payload: {} },
    ],
  });

  expect((await env.client.demands.search({ ...session, q: '', limit: 10, offset: 0 })).sort()).toStrictEqual(
    [DemandsUTC[0], DemandsUTC[1], DemandsUTC[2]].sort(),
  );
  expect(await env.client.demands.search({ ...session, q: '', limit: 1, offset: 0 })).toStrictEqual([DemandsUTC[0]]);
  expect(await env.client.demands.search({ ...session, q: 'anthr', limit: 10, offset: 0 })).toStrictEqual([
    DemandsUTC[1],
  ]);
  expect(await env.client.demands.search({ ...session, q: '', scenario: 'serv1', limit: 10, offset: 0 })).toStrictEqual(
    [DemandsUTC[0], DemandsUTC[2]],
  );
  expect(await env.client.demands.search({ ...session, q: '', isActive: true, limit: 10, offset: 0 })).toStrictEqual([
    DemandsUTC[0],
    DemandsUTC[1],
    DemandsUTC[2],
  ]);
  expect(await env.client.demands.search({ ...session, q: '', isActive: false, limit: 10, offset: 0 })).toStrictEqual([
    DemandsUTC[3],
  ]);
  expect(await env.client.demands.search({ ...session, q: '', my: true, limit: 10, offset: 0 })).toStrictEqual([
    DemandsUTC[0],
  ]);
  expect(await env.client.demands.search({ ...session, q: '', login: 'tst', limit: 10, offset: 0 })).toStrictEqual([
    DemandsUTC[0],
    DemandsUTC[1],
  ]);
  expect(await env.client.demands.search({ ...session, q: '', login: 'q', limit: 10, offset: 0 })).toStrictEqual([]);
});

test('isAdmin = FALSE', async () => {
  const session = { sessionUser: 'tstusr', isSessionUserIsAdmin: false };
  await env.dao.prepareDB({
    Users,
    Scenarios,
    Demands,
    Participants: [{ demand: 'Location/Service', user: 'tstusr', type: 'recipient', payload: {} }],
  });

  expect(await env.client.demands.search({ ...session, q: '', my: true, limit: 10, offset: 0 })).toStrictEqual([
    DemandsUTC[0],
  ]);
  await expect(env.client.demands.search({ ...session, q: '', limit: 10, offset: 0 })).rejects.toThrow('Forbidden');
  await expect(env.client.demands.search({ ...session, q: '', my: false, limit: 10, offset: 0 })).rejects.toThrow(
    'Forbidden',
  );
});
