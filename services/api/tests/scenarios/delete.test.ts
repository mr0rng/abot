import { TestsEnv } from '..';

const env = new TestsEnv();

beforeEach(async () => env.start());
afterEach(async () => env.stop());

test('main', async () => {
  await env.dao.prepareDB({
    Scenarios: [{ id: 'mainid', description: '', payload: { a: 2 }, isDeleted: false }],
  });

  await env.client.scenarios.delete({ sessionUser: 'qwe123', isSessionUserIsAdmin: true, id: 'mainid' });

  expect(await env.dao.tableData('Scenarios', 'id')).toStrictEqual([
    { id: 'mainid', description: '', isDeleted: true, payload: { a: 2 } },
  ]);
});

test('main isAdmin=false', async () => {
  await env.dao.prepareDB({
    Scenarios: [{ id: '2-new', description: '', payload: { a: 1 }, isDeleted: false }],
  });

  await expect(
    env.client.scenarios.delete({ sessionUser: 'qwe123', isSessionUserIsAdmin: false, id: '2-new' }),
  ).rejects.toThrow('Forbidden');
});

test('invalid id', async () => {
  await expect(
    env.client.scenarios.delete({ sessionUser: 'qwe123', isSessionUserIsAdmin: true, id: 'invld' }),
  ).rejects.toThrow('Scenario not found');
});
