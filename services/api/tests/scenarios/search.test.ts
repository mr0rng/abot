import { TestsEnv } from '..';

const env = new TestsEnv();

beforeEach(() => env.start());
afterEach(() => env.stop());

test('search', async () => {
  const session = await env.createSession();
  await env.dao.prepareDB({
    Scenarios: [
      { id: 'first', description: 'asldja asdklasd', isDeleted: false, payload: {} },
      { id: 'second', description: 'qewre qaweq eqw eqw eqwe', isDeleted: false, payload: {} },
    ],
  });

  expect(await env.client.scenarios.search({ session, q: '', limit: 10, offset: 0 })).toStrictEqual([
    { id: 'first', description: 'asldja asdklasd', payload: {} },
    { id: 'second', description: 'qewre qaweq eqw eqw eqwe', payload: {} },
  ]);
});

test('limit & offset', async () => {
  const session = await env.createSession();
  await env.dao.prepareDB({
    Scenarios: [
      { id: '0', description: 'asldja asdklasd', isDeleted: false, payload: {} },
      { id: '1', description: 'qewre qaweq eqw eqw eqwe', isDeleted: false, payload: {} },
      { id: '2', description: 'qewre qaweq eqw eqw eqwe', isDeleted: false, payload: {} },
      { id: '3', description: 'qewre qaweq eqw eqw eqwe', isDeleted: false, payload: {} },
      { id: '4', description: 'qewre qaweq eqw eqw eqwe', isDeleted: false, payload: {} },
      { id: '5', description: 'qewre qaweq eqw eqw eqwe', isDeleted: false, payload: {} },
      { id: '6', description: 'qewre qaweq eqw eqw eqwe', isDeleted: false, payload: {} },
      { id: '7', description: 'qewre qaweq eqw eqw eqwe', isDeleted: false, payload: {} },
    ],
  });

  expect(await env.client.scenarios.search({ session, q: '', limit: 2, offset: 0 })).toStrictEqual([
    { id: '0', description: 'asldja asdklasd', payload: {} },
    { id: '1', description: 'qewre qaweq eqw eqw eqwe', payload: {} },
  ]);
  expect(await env.client.scenarios.search({ session, q: '', limit: 2, offset: 2 })).toStrictEqual([
    { id: '2', description: 'qewre qaweq eqw eqw eqwe', payload: {} },
    { id: '3', description: 'qewre qaweq eqw eqw eqwe', payload: {} },
  ]);
});

test('q', async () => {
  const session = await env.createSession();
  await env.dao.prepareDB({
    Scenarios: [
      { id: 'first', description: 'asldja asdklasd', isDeleted: false, payload: {} },
      { id: 'second', description: 'qewre qaweq eqw eqw eqwe', isDeleted: false, payload: {} },
    ],
  });

  expect(await env.client.scenarios.search({ session, q: 'asldja', limit: 10, offset: 0 })).toStrictEqual([
    { id: 'first', description: 'asldja asdklasd', payload: {} },
  ]);
});

test('id', async () => {
  const session = await env.createSession();
  await env.dao.prepareDB({
    Scenarios: [
      { id: 'first', description: 'asldja asdklasd', isDeleted: false, payload: {} },
      { id: 'second', description: 'qewre qaweq eqw eqw eqwe', isDeleted: false, payload: {} },
    ],
  });

  expect(await env.client.scenarios.search({ session, id: 'second', limit: 10, offset: 0 })).toStrictEqual([
    { id: 'second', description: 'qewre qaweq eqw eqw eqwe', payload: {} },
  ]);
});

test('isDeleted', async () => {
  const session = await env.createSession();
  await env.dao.prepareDB({
    Scenarios: [
      { id: 'first', description: 'asldja asdklasd', isDeleted: false, payload: {} },
      { id: 'second', description: 'qewre qaweq eqw eqw eqwe', isDeleted: true, payload: {} },
    ],
  });

  expect(await env.client.scenarios.search({ session, id: 'second', limit: 10, offset: 0 })).toStrictEqual([]);
});
