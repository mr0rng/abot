import { Demands, Scenarios, Users } from '.';
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
      { demand: 'Location/Service', user: 'tstusr', type: 'recipeint', payload: {} },
      { demand: 'Location/Service', user: 'tst', type: 'recipeint', payload: {} },
      { demand: 'Location/Another', user: 'tst', type: 'recipeint', payload: {} },
    ],
  });

  expect(await env.client.demands.count({ ...session, q: '' })).toStrictEqual({ count: 3 });
  expect(await env.client.demands.count({ ...session, q: 'anthr' })).toStrictEqual({ count: 1 });
  expect(await env.client.demands.count({ ...session, q: '', scenario: 'serv1' })).toStrictEqual({ count: 2 });
  expect(await env.client.demands.count({ ...session, q: '', isActive: true })).toStrictEqual({ count: 3 });
  expect(await env.client.demands.count({ ...session, q: '', isActive: false })).toStrictEqual({ count: 1 });
  expect(await env.client.demands.count({ ...session, q: '', my: true })).toStrictEqual({ count: 1 });
  expect(await env.client.demands.count({ ...session, q: '', my: false })).toStrictEqual({ count: 2 });
  expect(await env.client.demands.count({ ...session, q: '', login: 'tst' })).toStrictEqual({ count: 2 });
  expect(await env.client.demands.count({ ...session, q: '', login: 'q' })).toStrictEqual({ count: 0 });
});

test('isAdmin = FALSE', async () => {
  const session = { sessionUser: 'tstusr', isSessionUserIsAdmin: false };
  await env.dao.prepareDB({
    Users,
    Scenarios,
    Demands,
    Participants: [{ demand: 'Location/Service', user: 'tstusr', type: 'recipeint', payload: {} }],
  });

  expect(await env.client.demands.count({ ...session, q: '', my: true })).toStrictEqual({ count: 1 });
  await expect(env.client.demands.count({ ...session, q: '' })).rejects.toThrow('Forbidden');
  await expect(env.client.demands.count({ ...session, q: '', my: false })).rejects.toThrow('Forbidden');
});
