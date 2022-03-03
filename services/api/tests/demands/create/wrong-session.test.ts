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
    await dao.clear();
    await sessions.clear();
});

afterAll(async () => {
    await application.end();
    await client.end();
    await sessions.end();
    await dao.end();
});

describe("create demand session absent", () => {
    let response;

    const session = {
        id: "user_id",
        login: "user_login",
        type: "user_type",
        isAdmin: false,
        isBanned: false,
        payload: {}
    };

    const user = {
        passwordHash: "user_pass_hash",
        ...session,
    }

    const scenario = {
        "id": "blah",
        "description": "Some scenario",
        "isDeleted": false,
        "payload": {},
    }

    beforeAll(async () => {
        await dao.prepareDB(
            {
                "Users": [
                    user,
                ],
                "Scenarios": [
                    scenario,
                ],
            }
        )

        response = await client.demands.create(
            {
                session: "some_session_here",
                scenario: scenario.id,
                isActive: true,
                payload: {},
            }
        );
    });

    test("response code correct", () => expect(response.code).toBe(403));
    test("response status correct", () => expect(response.status).toBe("error"));
    test("response message correct", () => expect(response.message).toBe("Session is wrong."));

});
