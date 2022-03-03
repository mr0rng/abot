import config from '@abot/config';
import ApiClient from '@abot/api-client';
import { SessionDao } from "../../../src/sessions/client";
import Application from '../../../src/app';
import DemandModel from "../../../src/models/demand-model";
import DAO from "@abot/dao/target/tests";

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

describe("create demand main scenario", () => {
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
                "Scenarios": [
                    scenario,
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

    test("response code correct", () => expect(response.code).toBe(200));
    test("response status correct", () => expect(response.status).toBe("ok"));

    describe("Demand should be created", () => {
        let demand;

        beforeAll(async () => {
            demand = await demandModel.get(response.response.id);
        });

        test("Demand should point on user", () => expect(demand.recipient).toBe(user.id));
        test("Demand should have date", () => expect(demand.date).toBeTruthy());
        test("Demand should be without sender", () => expect(demand.sender).toBeNull());
        test("Demand should have correct scenario", () => expect(demand.scenario).toBe(scenario.id));
        test("Demand should be active", () => expect(demand.isActive).toBe(true));
        test("Demand should have payload", () => expect(demand.payload).toStrictEqual({}));

    });
});
