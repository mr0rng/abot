import config from '@abot/config';

import DAO from '../src';
import TestDAO from '../src/tests';

let dao: DAO = new DAO(config);

beforeEach(async () => {
  const testDAO = new TestDAO(config);
  await testDAO.clear();
  await testDAO.end();

  dao = new DAO(config);
});

afterEach(async () => {
  await dao.end();
});

test('execute', async () => {
  const dao = new DAO(config);
  try {
    expect((await dao.execute("SELECT 1 as r1, 'aaa' as test", [])).rows).toStrictEqual([{ r1: 1, test: 'aaa' }]);
  } finally {
    await dao.end();
  }
});

test('executeOne', async () => {
  const dao = new DAO(config);
  try {
    expect(await dao.executeOne("SELECT 1 as r1, 'aaa' as test", [])).toStrictEqual({ r1: 1, test: 'aaa' });
  } finally {
    await dao.end();
  }
});
