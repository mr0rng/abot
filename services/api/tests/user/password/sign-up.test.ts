import config from '@abot/config';
import DAO from '@abot/dao/target/tests';
import ApiClient from '@abot/api-client';

import Application from '../../../src/app';

let application = new Application(config);
let dao = new DAO(config);
let client = new ApiClient(config);

beforeAll(async () => {
  await application.start();
  await dao.clear();
  await client.start();
});

afterAll(async () => {
  await application.end();
  await dao.end();
  await client.end();
});

test("signUp returns 200", async () => {
  const response = await client.user.password.signUp({ login: "tstusr", passwordHash: "pwdhash" });
  expect(response.code).toBe(200);
  expect(response.status).toBe("ok");
  expect(response.response.session).toBe("asdadas");
});

test("signUp returns 400", async () => {
  const response = await client.user.password.signUp({ login: "tstusr" });
  expect(response.code).toBe(400);
  expect(response.status).toBe("error");
});
