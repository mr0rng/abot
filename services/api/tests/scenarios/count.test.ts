import { TestsEnv } from '..';

const env = new TestsEnv();

beforeEach(async () => env.start());
afterEach(async () => env.stop());

test('main', async () => {
  await env.dao.prepareDB({
    Scenarios: [
      { id: 'first', description: 'asldja asdklasd', isDeleted: false, payload: {} },
      { id: 'sceond', description: 'qewre qaweq eqw eqw eqwe', isDeleted: false, payload: {} },
    ],
  });

  expect(await env.client.scenarios.count({})).toStrictEqual({ count: 2 });
});

test('isDeleted', async () => {
  await env.dao.prepareDB({
    Scenarios: [
      { id: 'first', description: 'asldja asdklasd', isDeleted: false, payload: {} },
      { id: 'sceond', description: 'qewre qaweq eqw eqw eqwe', isDeleted: true, payload: {} },
    ],
  });

  expect(await env.client.scenarios.count({})).toStrictEqual({ count: 1 });
});

test('q', async () => {
  await env.dao.prepareDB({
    Scenarios: [
      { id: 'first', description: 'asldja asdklasd', isDeleted: false, payload: {} },
      { id: 'sceond', description: 'qewre qaweq eqw eqw eqwe', isDeleted: false, payload: {} },
    ],
  });

  expect(await env.client.scenarios.count({ q: 'asldja' })).toStrictEqual({ count: 1 });
});

test('id', async () => {
  await env.dao.prepareDB({
    Scenarios: [
      { id: 'first', description: 'asldja asdklasd', isDeleted: false, payload: {} },
      { id: 'sceond', description: 'qewre qaweq eqw eqw eqwe', isDeleted: false, payload: {} },
    ],
  });

  expect(await env.client.scenarios.count({ id: 'first' })).toStrictEqual({ count: 1 });
});
