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

describe("get user returns 404 on missing session", () => {
    let response;

    beforeAll(async () => {
        response = await client.user.get({"session": "someRandomKey"});
    });

    test("response code correct", () => expect(response.code).toBe(404));
    test("response status correct", () => expect(response.status).toBe("error"));
    test("response status correct", () => expect(response.message).toBe("Session not found"));

});
