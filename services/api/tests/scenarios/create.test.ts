import { TestsEnv } from '..';

const env = new TestsEnv();

beforeEach(async () => env.start());
afterEach(async () => env.stop());

test('main', async () => {
  await env.client.scenarios.create({
    sessionUser: 'qwe123',
    isSessionUserIsAdmin: true,
    id: '2-new',
    description: 'new desc',
    payload: { a: 2 },
  });

  expect(await env.dao.tableData('Scenarios', 'id')).toStrictEqual([
    { id: '2-new', description: 'new desc', isDeleted: false, payload: { a: 2 } },
  ]);
});

test('isAdmin=false', async () => {
  await expect(
    env.client.scenarios.create({
      sessionUser: 'qwe123',
      isSessionUserIsAdmin: false,
      id: '2-new',
      description: 'new desc',
      payload: { a: 2 },
    }),
  ).rejects.toThrow('Forbidden');
});

test('duplicate', async () => {
  await env.client.scenarios.create({
    sessionUser: 'qwe123',
    isSessionUserIsAdmin: true,
    id: '2-new',
    description: 'new desc',
    payload: { a: 2 },
  });

  await expect(
    env.client.scenarios.create({
      sessionUser: 'qwe123',
      isSessionUserIsAdmin: true,
      id: '2-new',
      description: 'new desc',
      payload: { a: 2 },
    }),
  ).rejects.toThrow('Scenario already exists');
});
