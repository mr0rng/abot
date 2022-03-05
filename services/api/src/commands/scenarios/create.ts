import { Scenario, WithSession } from '@abot/model';

import { ApplicationError, Command } from '..';
import Application from '../../app';

export default new Command<Omit<Scenario, 'isDeleted'> & WithSession, void>(
  'scenarios.create',
  async (
    { dao, sessions }: Application,
    { id, description, payload, session }: Omit<Scenario, 'isDeleted'> & WithSession,
  ): Promise<void> => {
    const user = await sessions.get(session);
    if (user == null || !user.isAdmin) {
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
      if (e.constraint === 'Scenarios_pkey') {
        throw new ApplicationError(400, 'Scenario already exists');
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
