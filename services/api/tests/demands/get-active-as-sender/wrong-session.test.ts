import config from '@abot/config';
import ApiClient from '@abot/api-client';
import { TestSessionDao } from "../../../src/sessions/client";
import Application from '../../../src/app';
import DAO from "@abot/dao/target/tests";

let application = new Application(config);
let dao = new DAO(config);
let client = new ApiClient(config);
let sessions = new TestSessionDao(config);

beforeAll(async () => {
    await application.start();
    await client.start();
    await sessions.start();
    await sessions.clear();
    await dao.clear();
});

afterAll(async () => {
    await application.end();
    await client.end();
    await sessions.end();
    await dao.end();
});

describe("get active demand ad sender wrong session", () => {
    let response;

    beforeAll(async () => {
        response = await client.demands.getActiveAsSender({ session: "blah!" });
    });

    test("response code correct", () => expect(response.code).toBe(403));
    test("response status correct", () => expect(response.status).toBe("error"));
    test("response message correct", () => expect(response.message).toBe("Session is wrong."));
});
