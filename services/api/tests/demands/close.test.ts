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
const donorSession = { sessionUser: 'tst2', isSessionUserIsAdmin: false };

test('admin can close', async () => {
  await env.client.demands.close({ ...adminSession, id: 'Location/Another'});
  expect(
    await env.dao.executeOne(`SELECT "status" FROM "Demands" WHERE id=$1;`, ['Location/Another'])
  ).toStrictEqual({'status': 'closed'});
});

test('wrong id raises 404', async () => {
  await expect(env.client.demands.close({ ...adminSession, id: 'BLAH'})).rejects.toThrow('Not found');
});

test('Recipient can close', async () => {
  await env.client.demands.close({ ...recipientSession, id: 'Location/Another'});
  expect(
    await env.dao.executeOne(`SELECT "status" FROM "Demands" WHERE id=$1;`, ['Location/Another'])
  ).toStrictEqual({'status': 'closed'});
});

test('Donor cannot close', async () => {
  await expect(env.client.demands.close({ ...donorSession, id: 'Location/Another'})).rejects.toThrow('Not found');
})
