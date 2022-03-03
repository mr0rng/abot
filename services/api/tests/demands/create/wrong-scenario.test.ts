import config from '@abot/config';
import ApiClient from '@abot/api-client';
import { SessionDao } from "../../../src/sessions/client";
import Application from '../../../src/app';
import DAO from "@abot/dao/target/tests";

let application = new Application(config);
let dao = new DAO(config);
let client = new ApiClient(config);
let sessions = new SessionDao(config);

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
    await dao.end();
});

describe("create demand scenario absent", () => {
    let session_key;
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
            }
        )
        session_key = await sessions.create_session(session);

        response = await client.demands.create(
            {
                session: session_key,
                scenario: scenario.id,
                isActive: true,
                payload: {},
            }
        );
    });

    test("response code correct", () => expect(response.code).toBe(400));
    test("response status correct", () => expect(response.status).toBe("error"));
    test("response message correct", () => expect(response.message).toBe("Invalid scenario!"));

});
