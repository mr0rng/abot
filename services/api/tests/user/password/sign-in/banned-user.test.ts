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
    await dao.clear();
    await sessions.start();
});

afterAll(async () => {
    await application.end();
    await dao.end();
    await client.end();
    await sessions.end();
});

describe("try to signIn with banned user", () => {
    const user_to_be = { login: "tstusr", passwordHash: "pwdhash", type: "telegraph" };
    let response;

    beforeAll(async () => {
        await dao.clear();
        const user = await userModel.create(user_to_be.login, user_to_be.type, user_to_be.passwordHash);
        await userModel.setBanned(user.id, true);
        response = await client.user.password.signIn(user_to_be);
    });

    test("response code correct", () => expect(response.code).toBe(403));
    test("response status correct", () => expect(response.status).toBe("error"));
    test("response status correct", () => expect(response.message).toBe("User banned!"));
});
