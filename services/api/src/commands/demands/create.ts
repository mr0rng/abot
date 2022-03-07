import { v4 } from 'uuid';

import { DemandsCreateRequest, DemandsCreateResponse } from '@abot/api-contract/target/demands';

import { ApplicationError, Command, ForbiddenError } from '..';
import Application from '../../app';

export default new Command<DemandsCreateRequest, DemandsCreateResponse>(
  'demands.create',
  async (app: Application, request: DemandsCreateRequest): Promise<DemandsCreateResponse> => {
    const INITIAL_STATUS = 'active';

    try {
      const id = v4();

      const args = [
        id,
        request.title,
        request.description,
        request.scenario,
        INITIAL_STATUS,
        request.payload,
        request.sessionUser,
      ];

      const sql = `
        WITH "CreatedDemand" AS (
          INSERT INTO "Demands" ("id", "title", "description", "date", "scenario", "status", "payload")
          VALUES ($1, $2, $3, CURRENT_TIMESTAMP, $4, $5, $6)
        )
        INSERT INTO "Participants" ("demand", "user", "type", "payload")
        VALUES ($1, $7, 'recipient', '{}'::JSONB)
      `;

      await app.dao.execute(sql, args);
      return { id };
    } catch (e) {
      if (e.constraint === 'Demands_scenario_fkey') {
        throw new ApplicationError(400, 'Wrong scenario');
      }
      if (e.constraint === 'Participants_user_fkey') {
        throw new ForbiddenError();
      }
      throw e;
    }
  },
  {
    type: 'object',
    properties: {
      title: { type: 'string' },
      description: { type: 'string' },
      scenario: { type: 'string' },
      payload: { type: 'object' },
      sessionUser: { type: 'string' },
      isSessionUserIsAdmin: { type: 'boolean' },
    },
    required: ['title', 'description', 'scenario', 'sessionUser', 'isSessionUserIsAdmin'],
    additionalProperties: false,
  },
);
