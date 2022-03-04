import { Scenario, WithSession } from '@abot/model';

import Application from '../../app';
import {ApplicationError, Command} from '..';

export default new Command<Scenario & WithSession, void>(
  "scenarios.create",
  async ({ dao, sessions }: Application, request: Scenario & WithSession): Promise<void> => {
    const user = await sessions.get_session(request.session);
    if (user == null || !user.isAdmin) {
      throw new ApplicationError(403, "Forbidden");
    }

    await dao.execute(
      `
        INSERT INTO "Scenarios" ("id", "description", "isDeleted", "payload")
        VALUES ($1, $2, $3, $4)
      `,
      [ request.id, request.description, request.isDeleted, JSON.stringify(request.payload) ]
    );
  },
  {
    type: "object",
    properties: {
      session: {type: "string"},
      id: {type: "string"},
      description: {type: "string"},
      isDeleted: {type: "boolean"},
      payload: {type: "object"},
    },
    required: ["session", "id", "description", "isDeleted", "payload"],
    additionalProperties: false
  }
);
