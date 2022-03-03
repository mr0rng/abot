import config from '@abot/config';
import DAO from '@abot/dao/target/tests';
import ApiClient from '@abot/api-client';
import { SessionDao } from "../../../../src/sessions/client";
import Application from '../../../../src/app';

let application = new Application(config);
let dao = new DAO(config);
let client = new ApiClient(config);
let sessions = new SessionDao(config);

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

test("signIn returns 400", async () => {
    await dao.clear();
    // @ts-ignore
    const response = await client.user.password.signIn({ login: "tstusr" });
    expect(response.code).toBe(400);
    expect(response.status).toBe("error");
});
