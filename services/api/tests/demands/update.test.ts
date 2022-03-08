import { Demands, Scenarios, Users } from '.';
import { TestsEnv } from '..';

const env = new TestsEnv();

beforeEach(async () => {
  await env.start();
  await env.dao.prepareDB({
    Users,
    Scenarios,
    Demands,
    Participants: [
      { demand: 'Location/Service', user: 'tstusr', type: 'recipient', payload: {} },
      { demand: 'Location/Service', user: 'tst', type: 'recipient', payload: {} },
      { demand: 'Location/Another', user: 'tst', type: 'recipient', payload: {} },
      { demand: 'Location/Another', user: 'tst2', type: 'donor', payload: {} },
    ],
  });
});
afterEach(async () => env.stop());

const adminSession = { sessionUser: 'tstusr', isSessionUserIsAdmin: true };
const recipientSession = { sessionUser: 'tst', isSessionUserIsAdmin: false };
const notAdminSession = { sessionUser: 'tstusr', isSessionUserIsAdmin: false };

test('admin can update', async () => {
  const response = await env.client.demands.update({
    ...adminSession,
    id: 'Location/Another',
    payload: { some: 'data' },
  });

  expect(response.payload).toStrictEqual({ some: 'data' });
  expect(response.description).toStrictEqual('anthr lct');

  expect(await env.dao.executeOne(`SELECT "payload" FROM "Demands" WHERE id=$1;`, ['Location/Another'])).toStrictEqual({
    payload: { some: 'data' },
  });
});

test('participant can update', async () => {
  const response = await env.client.demands.update({
    ...recipientSession,
    id: 'Location/Another',
    description: 'some descr',
  });
  expect(response.description).toBe('some descr');
});

test('not participant raises 404', async () => {
  await expect(
    env.client.demands.update({ ...notAdminSession, id: 'Location/Another', payload: { some: 'data' } }),
  ).rejects.toThrow('Not found');
});
