import config from '@abot/config';
import DAO from '@abot/dao/target/tests';
import ApiClient from '@abot/api-client';
import { SessionDao } from "../../../../src/sessions/client";

import Application from '../../../../src/app';
import UserModel from "../../../../src/models/user-model";

let application = new Application(config);
let dao = new DAO(config);
let client = new ApiClient(config);
let sessions = new SessionDao(config);
let userModel = new UserModel(dao);


beforeAll(async () => {
  await application.start();
  await client.start();
  await sessions.start();
  await dao.clear();
});

afterAll(async () => {
  await application.end();
  await client.end();
  await sessions.end();
});

describe("User cannot be signedUp twice", () => {
  const user_to_be = { login: "tstusr", passwordHash: "pwdhash", type: "telegraph" };
  let response;

  beforeAll(async () => {
    await userModel.create(user_to_be.login, user_to_be.type, "SomeOtherPass");
    response = await client.user.password.signUp(user_to_be);
  });

  test("response code correct", () => expect(response.code).toBe(409));
  test("response status correct", () => expect(response.status).toBe("error"));
  test("response message correct", () => expect(response.message).toBe("user already exists"));
});
