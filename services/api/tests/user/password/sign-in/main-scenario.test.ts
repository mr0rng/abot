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

describe("signIn correct work", () => {
    const user_to_be = { login: "tstusr", passwordHash: "pwdhash", type: "telegraph" };
    let response;

    beforeAll(async () => {
        await dao.clear();
        await userModel.create(user_to_be.login, user_to_be.type, user_to_be.passwordHash);
        response = await client.user.password.signIn(user_to_be);
    });

    test("response code correct", () => expect(response.code).toBe(200));
    test("response status correct", () => expect(response.status).toBe("ok"));

    describe("Session created", () => {
        let session;

        beforeAll(async () => {
            session = await sessions.get_session(response.response.session);
        });

        test("session type is correct", () => expect(session.type).toBe(user_to_be.type));
        test("session login is correct", () => expect(session.login).toBe(user_to_be.login));
        test("session password not in session", () => expect(session).not.toContain("passwordHash"));
    });

});
