import config from '@abot/config'
import DAO from '../src'

test('execute', async () => {
  const dao = new DAO(config);
  try {
    expect((await dao.execute("SELECT 1 as r1, 'aaa' as test", [])).rows)
      .toStrictEqual([ { r1: 1, test: "aaa" } ])
  } finally {
    dao.end();
  }
})