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

describe("Update demand main scenario", () => {
    let session_key;
    let response;

    const adminSession = {
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

    const adminUser = {
        passwordHash: "user_pass_hash",
        ...adminSession,
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

    beforeAll(async () => {

        await dao.prepareDB(
            {
                "Users": [
                    user,
                    adminUser,
                ],
                "Scenarios": [
                    scenario,
                ],
                "Demands": [
                    demand,
                ],
            }
        )
        session_key = await sessions.create_session(adminSession);

        request = {
            id: demand.id,
            session: session_key,
            payload: {a: 42},
        };

        response = await client.demands.update(request);
    });

    test("response code correct", () => expect(response.code).toBe(200));
    test("response status correct", () => expect(response.status).toBe("ok"));

    describe("Demand should be updated", () => {
        let result;

        beforeAll(async () => {
            result = await demandModel.get(demand.id);
        });

        test("should update payload", () => expect(result.payload).toStrictEqual(request.payload));
        test("should not update isActive", () => expect(result.isActive).toBe(true));
    });
});
