import { Scenario, WithSession } from '@abot/model';

import { ApplicationError, Command } from '..';
import Application from '../../app';

export default new Command<Omit<Scenario, 'isDeleted'> & WithSession, void>(
  'scenarios.update',
  async (
    { dao, sessions }: Application,
    { id, description, payload, session }: Omit<Scenario, 'isDeleted'> & WithSession,
  ): Promise<void> => {
    const user = await sessions.get(session);
    if (user == null || !user.isAdmin) {
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
      session: { type: 'string' },
      id: { type: 'string' },
      description: { type: 'string' },
      payload: { type: 'object' },
    },
    required: ['session', 'id', 'description', 'payload'],
    additionalProperties: false,
  },
);
