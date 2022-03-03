import config from '@abot/config';
import ApiClient from '@abot/api-client';
import { SessionDao } from "../../../src/sessions/client";
import Application from '../../../src/app';
import DAO from "@abot/dao/target/tests";
import {v4} from 'uuid';

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

describe("get active demand ad sender main scenario", () => {
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

    const sender2Session = {
        id: v4(),
        login: "admin_user2_login",
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

    const sender2User = {
        passwordHash: "user_pass_hash",
        ...sender2Session,
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

    const noiseDemand = {
        id: v4(),
        date: new Date(Date.now()).toISOString(),
        scenario: scenario.id,
        recipient: recipientUser.id,
        sender: sender2User.id,
        isActive: true,
        payload: {}
    }

    const demand = {
        id: v4(),
        date: new Date(Date.now()).toISOString(),
        scenario: scenario.id,
        recipient: recipientUser.id,
        sender: senderUser.id,
        isActive: true,
        payload: {}
    }

    const demand2 = {
        id: v4(),
        date: new Date(Date.now()).toISOString(),
        scenario: scenario.id,
        recipient: recipientUser.id,
        sender: senderUser.id,
        isActive: false,
        payload: {}
    }

    beforeAll(async () => {

        await dao.prepareDB(
          {
              "Users": [
                  senderUser,
                  sender2User,
                  recipientUser,
              ],
              "Scenarios": [
                  scenario,
              ],
              "Demands": [
                  noiseDemand,
                  demand,
                  demand2,
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
        response = await client.demands.getActiveAsSender({ session: session_key });
    });

    test("response code correct", () => expect(response.code).toBe(200));
    test("response status correct", () => expect(response.status).toBe("ok"));
    test("response demand id in answer", () => expect(response.response.id).toBe(demand.id));
});
