import config from '@abot/config'
import ApiClient from '@abot/api-client';
import TestsDAO from '@abot/dao/target/tests'

import Application from '../../src/app';

let application = new Application(config);
let dao = new TestsDAO(config);
let client = new ApiClient(config);

beforeEach(async () => {
  application = new Application(config);
  dao = new TestsDAO(config);
  client = new ApiClient(config);

  await application.start();
  await dao.clear();
  await client.start()
});

afterEach(async () => {
  await application.end();
  await dao.end();
  await client.end();
});

test("main", async () => {
  await dao.prepareDB({
    Scenarios: [  
      { id: 'first', description: 'asldja asdklasd', isDeleted: false, payload: { } },
      { id: 'sceond', description: 'qewre qaweq eqw eqw eqwe', isDeleted: false, payload: { } }
    ]
  });

  expect(await client.scenarios.count({})).toStrictEqual({
    code: 200,
    response: { count: 2 },
    status: 'ok'
  });
})

test("isDeleted", async () => {
  await dao.prepareDB({
    Scenarios: [  
      { id: 'first', description: 'asldja asdklasd', isDeleted: false, payload: { } },
      { id: 'sceond', description: 'qewre qaweq eqw eqw eqwe', isDeleted: true, payload: { } }
    ]
  });

  expect(await client.scenarios.count({})).toStrictEqual({
    code: 200,
    response: { count: 1 },
    status: 'ok'
  });
})

test("q", async () => {
  await dao.prepareDB({
    Scenarios: [  
      { id: 'first', description: 'asldja asdklasd', isDeleted: false, payload: { } },
      { id: 'sceond', description: 'qewre qaweq eqw eqw eqwe', isDeleted: false, payload: { } }
    ]
  });

  expect(await client.scenarios.count({ q: "asldja" })).toStrictEqual({
    code: 200,
    response: { count: 1 },
    status: 'ok'
  });
})

test("id", async () => {
  await dao.prepareDB({
    Scenarios: [  
      { id: 'first', description: 'asldja asdklasd', isDeleted: false, payload: { } },
      { id: 'sceond', description: 'qewre qaweq eqw eqw eqwe', isDeleted: false, payload: { } }
    ]
  });

  expect(await client.scenarios.count({ id: "first" })).toStrictEqual({
    code: 200,
    response: { count: 1 },
    status: 'ok'
  });
})