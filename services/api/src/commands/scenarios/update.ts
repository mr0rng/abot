import { Scenario, WithSessionUser } from '@abot/model';

import { ApplicationError, Command } from '..';
import Application from '../../app';

export default new Command<Omit<Scenario, 'isDeleted'> & WithSessionUser, void>(
  'scenarios.update',
  async (
    { dao }: Application,
    { id, description, payload, isSessionUserIsAdmin }: Omit<Scenario, 'isDeleted'> & WithSessionUser,
  ): Promise<void> => {
    if (!isSessionUserIsAdmin) {
      throw new ApplicationError(403, 'Forbidden');
    }

    try {
      await dao.executeOne(
        `
          UPDATE "Scenarios" 
          SET "description" = $2, "payload" = $3
          WHERE "id" = $1 AND "isDeleted" = FALSE
          RETURNING "id"
        `,
        [id, description, JSON.stringify(payload)],
      );
    } catch (e) {
      if (e.isUnexpectedNumberOfRows) {
        throw new ApplicationError(403, 'Scenario not found');
      }

      throw e;
    }
  },
  {
    type: 'object',
    properties: {
      id: { type: 'string' },
      description: { type: 'string' },
      payload: { type: 'object' },
      sessionUser: { type: 'string' },
      isSessionUserIsAdmin: { type: 'boolean' },
    },
    required: ['id', 'description', 'payload', 'sessionUser', 'isSessionUserIsAdmin'],
    additionalProperties: false,
  },
);
