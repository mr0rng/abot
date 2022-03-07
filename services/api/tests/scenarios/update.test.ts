import { TestsEnv } from '..';

const env = new TestsEnv();

beforeEach(() => env.start());
afterEach(() => env.stop());

test('main', async () => {
  await env.dao.prepareDB({
    Scenarios: [{ id: 'mainid', description: '', payload: { a: 1, b: 2 }, isDeleted: false }],
  });

  await env.client.scenarios.update({
    sessionUser: 'qwe',
    isSessionUserIsAdmin: true,
    id: 'mainid',
    description: 'new desc',
    payload: { a: 2 },
  });

  expect(await env.dao.tableData('Scenarios', 'id')).toStrictEqual([
    { id: 'mainid', description: 'new desc', isDeleted: false, payload: { a: 2 } },
  ]);
});

test('main isAdmin=false', async () => {
  await env.dao.prepareDB({
    Scenarios: [{ id: '2-new', description: '', payload: { a: 1 }, isDeleted: false }],
  });

  await expect(
    env.client.scenarios.update({
      sessionUser: 'qwe',
      isSessionUserIsAdmin: false,
      id: '2-new',
      description: 'new desc',
      payload: { a: 2 },
    }),
  ).rejects.toThrow('Forbidden');
});

test('invalid id', async () => {
  await expect(
    env.client.scenarios.update({
      sessionUser: 'qwe',
      isSessionUserIsAdmin: true,
      id: 'invld',
      description: 'new desc',
      payload: { a: 2 },
    }),
  ).rejects.toThrow('Scenario not found');
});
