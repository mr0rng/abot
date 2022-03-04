import config from '@abot/config';
import ApiClient from '@abot/api-client';
import { SessionDao } from "../../../src/sessions/client";
import Application from '../../../src/app';
import DemandModel from "../../../src/models/demand-model";
import DAO from "@abot/dao/target/tests";
import {v4} from 'uuid';

let application = new Application(config);
let dao = new DAO(config);
let client = new ApiClient(config);
let sessions = new SessionDao(config);
let demandModel = new DemandModel(dao);

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

describe("Update demand should decline for non admin", () => {
    let session_key;
    let response;

    const nonAdminSession = {
        id: v4(),
        login: "admin_user_login",
        type: "user_type",
        isAdmin: true,
        isBanned: false,
        payload: {}
    };

    const userSession = {
        id: v4(),
        login: "user_login",
        type: "user_type",
        isAdmin: false,
        isBanned: false,
        payload: {}
    };

    const nonAdminUser = {
        passwordHash: "user_pass_hash",
        ...nonAdminSession,
    }

    const user = {
        passwordHash: "user_pass_hash",
        ...userSession,
    }

    const scenario = {
        "id": "blah",
        "description": "Some scenario",
        "isDeleted": false,
        "payload": {},
    }

    const demand = {
        id: v4(),
        date: new Date(Date.now()).toISOString(),
        scenario: scenario.id,
        recipient: user.id,
        sender: null,
        isActive: true,
        payload: {}
    }

    let request;
    const id = v4();

    beforeAll(async () => {

        await dao.prepareDB(
            {
                "Users": [
                    user,
                    nonAdminUser,
                ],
                "Scenarios": [
                    scenario,
                ],
                "Demands": [
                    demand,
                ],
            }
        )
        session_key = await sessions.create_session(nonAdminUser);

        request = {
            id: id,
            session: session_key,
            payload: {a: 42},
        };

        response = await client.demands.update(request);
    });

    test("response code correct", () => expect(response.code).toBe(404));
    test("response status correct", () => expect(response.status).toBe("error"));

});
