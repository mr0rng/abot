import { TestsEnv } from '..';

const env = new TestsEnv();

beforeEach(() => env.start());
afterEach(() => env.stop());

test('main', async () => {
  const session = await env.createSession({ isAdmin: true });
  await env.dao.prepareDB({
    Scenarios: [{ id: 'mainid', description: '', payload: { a: 2 }, isDeleted: false }],
  });

  await env.client.scenarios.delete({ session, id: 'mainid' });

  expect(await env.dao.tableData('Scenarios', 'id')).toStrictEqual([
    { id: 'mainid', description: '', isDeleted: true, payload: { a: 2 } },
  ]);
});

test('invalid id', async () => {
  const session = await env.createSession({ isAdmin: true });
  await expect(env.client.scenarios.delete({ session, id: 'invld' })).rejects.toThrow('Scenario not found');
});

test('main isAdmin=false', async () => {
  const session = await env.createSession({ isAdmin: false });
  await env.dao.prepareDB({
    Scenarios: [{ id: '2-new', description: '', payload: { a: 1 }, isDeleted: false }],
  });

  await expect(env.client.scenarios.delete({ session, id: '2-new' })).rejects.toThrow('Forbidden');
});

test('main invalid session', async () => {
  await expect(env.client.scenarios.delete({ session: 'invl', id: '2-new' })).rejects.toThrow('Forbidden');
});
