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

describe("Close demand no active demand", () => {
    let session_key;
    let response;

    const senderSession = {
        id: v4(),
        login: "admin_user_login",
        type: "user_type",
        isAdmin: false,
        isBanned: false,
        payload: {}
    };

    const recipientSession = {
        id: v4(),
        login: "user_login",
        type: "user_type",
        isAdmin: false,
        isBanned: false,
        payload: {}
    };

    const senderUser = {
        passwordHash: "user_pass_hash",
        ...senderSession,
    }

    const recipientUser = {
        passwordHash: "user_pass_hash",
        ...recipientSession,
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
        recipient: recipientUser.id,
        sender: null,
        isActive: true,
        payload: {}
    }

    beforeAll(async () => {

        await dao.prepareDB(
          {
              "Users": [
                  senderUser,
                  recipientUser,
              ],
              "Scenarios": [
                  scenario,
              ],
              "Demands": [
                  demand,
              ],
              "UsersScenarios": [
                  {
                      "user": senderUser.id,
                      "scenario": scenario.id,
                  }
              ],
          }
        )
        session_key = await sessions.create_session(senderSession);
        response = await client.demands.close({ session: session_key });
    });

    test("response code correct", () => expect(response.code).toBe(200));
    test("response status correct", () => expect(response.status).toBe("ok"));
});
