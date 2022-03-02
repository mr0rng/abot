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

  dao = new DAO(config);
  client = new ApiClient(config);
});

test("signUp", async () => {
  const a = client.user.password.signUp({ login: "tstusr", passwordHash: "pwdhash" });
});