import { TestsEnv } from '..';

const env = new TestsEnv();

beforeEach(() => env.start());
afterEach(() => env.stop());

test('main', async () => {
  const session = await env.createSession();
  await env.dao.prepareDB({
    Scenarios: [
      { id: 'first', description: 'asldja asdklasd', isDeleted: false, payload: {} },
      { id: 'sceond', description: 'qewre qaweq eqw eqw eqwe', isDeleted: false, payload: {} },
    ],
  });

  expect(await env.client.scenarios.count({ session })).toStrictEqual({ count: 2 });
});

test('isDeleted', async () => {
  const session = await env.createSession();
  await env.dao.prepareDB({
    Scenarios: [
      { id: 'first', description: 'asldja asdklasd', isDeleted: false, payload: {} },
      { id: 'sceond', description: 'qewre qaweq eqw eqw eqwe', isDeleted: true, payload: {} },
    ],
  });

  expect(await env.client.scenarios.count({ session })).toStrictEqual({ count: 1 });
});

test('q', async () => {
  const session = await env.createSession();
  await env.dao.prepareDB({
    Scenarios: [
      { id: 'first', description: 'asldja asdklasd', isDeleted: false, payload: {} },
      { id: 'sceond', description: 'qewre qaweq eqw eqw eqwe', isDeleted: false, payload: {} },
    ],
  });

  expect(await env.client.scenarios.count({ q: 'asldja', session })).toStrictEqual({ count: 1 });
});

test('id', async () => {
  const session = await env.createSession();
  await env.dao.prepareDB({
    Scenarios: [
      { id: 'first', description: 'asldja asdklasd', isDeleted: false, payload: {} },
      { id: 'sceond', description: 'qewre qaweq eqw eqw eqwe', isDeleted: false, payload: {} },
    ],
  });

  expect(await env.client.scenarios.count({ id: 'first', session })).toStrictEqual({ count: 1 });
});

test('invalid session', async () => {
  await env.dao.prepareDB({
    Scenarios: [
      { id: 'first', description: 'asldja asdklasd', isDeleted: false, payload: {} },
      { id: 'sceond', description: 'qewre qaweq eqw eqw eqwe', isDeleted: false, payload: {} },
    ],
  });

  await expect(env.client.scenarios.count({ session: 'ibfsvld' })).rejects.toThrow('Forbidden');
});
