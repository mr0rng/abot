import { Demand, WithSessionUser } from '@abot/api-contract/target/demands';

import { NotFoundError, Command } from '..';
import Application from '../../app';
import {UnexpectedNumberOfRows} from "@abot/dao";

export default new Command<WithSessionUser, Demand>(
  'demands.next',
  async (app: Application, request: WithSessionUser): Promise<Demand> => {
    const sql = `
    WITH
    "AssignedDemands" AS (
      SELECT "Demands"."id" as "id", "Participants"."user" as "user"
      FROM "Demands"
      INNER JOIN "Participants" ON "Demands"."id" = "Participants"."demand" AND "Participants"."type" = 'donor'
      WHERE
        "Participants"."user" = $1
        AND
        "Demands"."status" = 'active'
      FOR UPDATE
    ),
    "Decline" AS (
      UPDATE "Participants"
      SET "type" = 'declined_donor'
      FROM "AssignedDemands"
      WHERE "Participants"."user" = "AssignedDemands"."user" and "Participants"."demand" = "AssignedDemands"."id"
      RETURNING "demand"
    ),
    "GetNewDemand" AS (
      SELECT "Demands"."id" as "id"
      FROM "Demands"
      WHERE
        "Demands"."scenario" IN (
          SELECT "UsersScenarios"."scenario"
          FROM "UsersScenarios"
          INNER JOIN "Scenarios" ON "UsersScenarios"."scenario" = "Scenarios"."id"
          WHERE
            "UsersScenarios"."user" = $1
            AND
            NOT "Scenarios"."isDeleted"
        )
        AND
        "Demands"."status" = 'active'
        AND
        NOT EXISTS (
          SELECT "user"
          FROM "Participants"
          WHERE
            "Participants"."demand" = "Demands"."id"
            AND
            "Participants"."type" = 'donor'
        )
        AND NOT EXISTS (
          SELECT "user"
          FROM "Participants"
          WHERE
            "Participants"."demand" = "Demands"."id"
            AND
            "Participants"."type" = 'declined_donor'
            AND
            "Participants"."user" = $1
        )
      ORDER BY "Demands"."date" ASC
      LIMIT 1
      FOR UPDATE SKIP LOCKED
    ),
    "SetDonor" AS (
      INSERT INTO "Participants"
      SELECT "GetNewDemand"."id" as "demand", $1 as "user", 'donor' as "type", '{}'::JSONB as "payload"
      FROM "GetNewDemand" LEFT JOIN "Decline" ON TRUE
    )
    SELECT * FROM "Demands" WHERE "id" IN (SELECT "id" FROM "GetNewDemand")
    ;
    `;
  
    try {
      return await app.dao.executeOne(sql, [request.sessionUser]);
    } catch (e) {
      const error = e as UnexpectedNumberOfRows;
      if (error.isUnexpectedNumberOfRows) { throw new NotFoundError(); }
      throw e;
    }
  },
  {
    type: 'object',
    properties: {
      sessionUser: { type: 'string' },
      isSessionUserIsAdmin: { type: 'boolean' },
    },
    required: ['sessionUser', 'isSessionUserIsAdmin'],
    additionalProperties: false,
  },
);
