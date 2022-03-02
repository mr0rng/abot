import config from '@abot/config';
import ApiClient from '@abot/api-client';
import { SessionDao } from "../../../../src/sessions/client";

import Application from '../../../../src/app';

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

describe("signUp returns 400",  () => {

    let response;

    beforeAll(async () => {
        // @ts-ignore
        response = await client.user.password.signUp({ login: "tstusr" });
    });

    test("response code correct", () => expect(response.code).toBe(400));
    test("response status correct", () => expect(response.status).toBe("error"));
});
