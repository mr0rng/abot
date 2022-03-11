import { Scenario, WithSessionUser } from '@abot/model';

import { ApplicationError, Command } from '..';
import Application from '../../app';

export default new Command<Omit<Omit<Scenario, 'isDeleted'> & WithSessionUser, 'isDeleted'>, void>(
  'scenarios.create',
  async (
    { dao }: Application,
    { id, description, payload, isSessionUserIsAdmin }: Omit<Scenario, 'isDeleted'> & WithSessionUser,
  ): Promise<void> => {
    if (!isSessionUserIsAdmin) {
      throw new ApplicationError(403, 'Forbidden');
    }

    try {
      await dao.execute(
        `
          INSERT INTO "Scenarios" ("id", "description", "isDeleted", "payload")
          VALUES ($1, $2, $3, $4)
        `,
        [id, description, false, JSON.stringify(payload)],
      );
    } catch (e) {
      if ((<any> e).constraint === 'Scenarios_pkey') {
        throw new ApplicationError(400, 'Scenario already exists');
      }

      throw e;
    }
  },
  {
    type: 'object',
    properties: {
      sessionUser: { type: 'string' },
      isSessionUserIsAdmin: { type: 'boolean' },
      id: { type: 'string' },
      description: { type: 'string' },
      payload: { type: 'object' },
    },
    required: ['id', 'description', 'payload', 'sessionUser', 'isSessionUserIsAdmin'],
    additionalProperties: false,
  },
);
