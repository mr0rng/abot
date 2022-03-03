import config from '@abot/config';
import ApiClient from '@abot/api-client';
import { SessionDao } from "../../../src/sessions/client";
import Application from '../../../src/app';

let application = new Application(config);
let client = new ApiClient(config);
let sessions = new SessionDao(config);

beforeAll(async () => {
    await application.start();
    await client.start();
    await sessions.start();
});

afterAll(async () => {
    await application.end();
    await client.end();
    await sessions.end();
});

describe("get user works", () => {
    const user_to_be = {
        id: "blah",
        login: "tuser",
        type: "telegraph",
        isAdmin: false,
        isBanned: false,
        payload: {}
    };
    let response;
    let sessionKey;

    beforeAll(async () => {
        sessionKey = await sessions.create_session(user_to_be);
        response = await client.user.get({"session": sessionKey});
    });

    test("response code correct", () => expect(response.code).toBe(200));
    test("response status correct", () => expect(response.status).toBe("ok"));
    test("session type is correct", () => expect(response.response.type).toBe(user_to_be.type));
    test("session login is correct", () => expect(response.response.login).toBe(user_to_be.login));
    test("session password not in session", () => expect(response.response).not.toContain("passwordHash"));

});
