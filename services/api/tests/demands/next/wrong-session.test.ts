import config from '@abot/config';
import ApiClient from '@abot/api-client';
import { TestSessionDao } from "../../../src/sessions/client";
import Application from '../../../src/app';
import DAO from "@abot/dao/target/tests";
import {v4} from 'uuid';

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

describe("Next demand wrong session", () => {
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
        sender: senderUser.id,
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
        response = await client.demands.next({ session: "blah!" });
    });

    test("response code correct", () => expect(response.code).toBe(403));
    test("response status correct", () => expect(response.status).toBe("error"));
    test("response message correct", () => expect(response.message).toBe("Session is wrong."));
});
