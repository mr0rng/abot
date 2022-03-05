import { TestsEnv } from '..';

const env = new TestsEnv();

beforeEach(() => env.start());
afterEach(() => env.stop());

test('main', async () => {
  const session = await env.createSession({ isAdmin: true });

  await env.client.scenarios.create({ session, id: '2-new', description: 'new desc', payload: { a: 2 } });

  expect(await env.dao.tableData('Scenarios', 'id')).toStrictEqual([
    { id: '2-new', description: 'new desc', isDeleted: false, payload: { a: 2 } },
  ]);
});

test('duplicate', async () => {
  const session = await env.createSession({ isAdmin: true });
  await env.client.scenarios.create({ session, id: '2-new', description: 'new desc', payload: { a: 2 } });

  await expect(
    env.client.scenarios.create({ session, id: '2-new', description: 'new desc', payload: { a: 2 } }),
  ).rejects.toThrow('Scenario already exists');
});

test('main isAdmin=false', async () => {
  const session = await env.createSession({ isAdmin: false });

  await expect(
    env.client.scenarios.create({ session, id: '2-new', description: 'new desc', payload: { a: 2 } }),
  ).rejects.toThrow('Forbidden');
});

test('main invalid session', async () => {
  await expect(
    env.client.scenarios.create({ session: 'invl', id: '2-new', description: 'new desc', payload: { a: 2 } }),
  ).rejects.toThrow('Forbidden');
});
