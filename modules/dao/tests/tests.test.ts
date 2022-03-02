import config from '@abot/config'
import TestsDAO from '../src/tests'

let dao: TestsDAO = new TestsDAO(config);

beforeEach(async () => {
  dao = new TestsDAO(config);
  await dao.clear();
});

afterEach(async () => {
  await dao.end();
})

test('clear', async () => {
  await dao.execute(`INSERT INTO "Users" VALUES ('tlogn', 'web', true, '{}'::JSONB, false) RETURNING "login"`);
  await dao.clear();

  const { count } = await dao.executeOne<{ count: number }>(`SELECT count(*) FROM "Users"`);
  expect(count).toEqual("0");
})

test('prepareDB', async () => {
  await dao.prepareDB({
    "Users": [
      { 
        id: "testusr",
        login: "testusr",
        type: "web",
        isAdmin: true,
        isBanned: false,
        payload: {}
      },
      { 
        id: "testusr2",
        login: "testusr2",
        type: "tg",
        isAdmin: false,
        isBanned: true,
        payload: {}
      }
    ],
    "Scenarios": [
      { id: "Gotham/Food", description: "fooooooood", isDeleted: false, payload: { } },
      { id: "Gotham/Pills", description: "pills", isDeleted: false, payload: { } },
      { id: "Gotham/Any", description: "any other", isDeleted: false, payload: { } },
    ],
    "UsersScenarios": [
      { user: "testusr", scenario: "Gotham/Food" }
    ],
    "Demands": [ ]
  })

  expect(await dao.executeOne<{ count: number }>(`SELECT count(*) FROM "Users"`))
    .toStrictEqual({ count: "2" });
  expect(await dao.executeOne<{ count: number }>(`SELECT count(*) FROM "Scenarios"`))
    .toStrictEqual({ count: "3" });
  expect(await dao.executeOne<{ count: number }>(`SELECT count(*) FROM "UsersScenarios"`))
    .toStrictEqual({ count: "1" });
  expect(await dao.executeOne<{ count: number }>(`SELECT count(*) FROM "Demands"`))
    .toStrictEqual({ count: "0" });
  expect(await dao.executeOne<{ count: number }>(`SELECT count(*) FROM "Messages"`))
    .toStrictEqual({ count: "0" });
})

test('tableData', async () => {
  await dao.prepareDB({
    "Scenarios": [
      { id: "Gotham/Food", description: "fooooooood", isDeleted: false, payload: { a: 1 } },
      { id: "Gotham/Pills", description: "pills", isDeleted: false, payload: { } },
      { id: "Gotham/Any", description: "any other", isDeleted: false, payload: { } },
    ]
  });

  expect(await dao.tableData("Scenarios", "id"))
    .toStrictEqual([
      { id: "Gotham/Any", description: "any other", isDeleted: false, payload: { } },
      { id: "Gotham/Food", description: "fooooooood", isDeleted: false, payload: { a: 1 } },
      { id: "Gotham/Pills", description: "pills", isDeleted: false, payload: { } },
    ]);
});