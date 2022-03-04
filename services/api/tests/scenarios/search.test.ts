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

test("search", async () => {
  await dao.prepareDB({
    Scenarios: [  
      { id: 'first', description: 'asldja asdklasd', isDeleted: false, payload: { } },
      { id: 'sceond', description: 'qewre qaweq eqw eqw eqwe', isDeleted: false, payload: { } }
    ]
  });

  expect(await client.scenarios.search({ q: '', limit: 10, offset: 0 })).toStrictEqual({
    code: 200,
    response: [
      { id: 'first', description: 'asldja asdklasd', payload: { } },
      { id: 'sceond', description: 'qewre qaweq eqw eqw eqwe', payload: { } }
    ],
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

  expect(await client.scenarios.search({ q: 'asldja', limit: 10, offset: 0 })).toStrictEqual({
    code: 200,
    response: [
      { id: 'first', description: 'asldja asdklasd', payload: { } },
    ],
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

  expect(await client.scenarios.search({ id: 'sceond', limit: 10, offset: 0 })).toStrictEqual({
    code: 200,
    response: [
      { id: 'sceond', description: 'qewre qaweq eqw eqw eqwe', payload: { } }
    ],
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

  expect(await client.scenarios.search({ id: 'sceond', limit: 10, offset: 0 })).toStrictEqual({
    code: 200,
    response: [ ],
    status: 'ok'
  });
})