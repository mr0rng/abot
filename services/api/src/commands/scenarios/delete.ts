import { ScenariosDeleteRequest } from '@abot/api-contract/target/scenarios';

import { ApplicationError, Command } from '..';
import Application from '../../app';

export default new Command<ScenariosDeleteRequest, void>(
  'scenarios.delete',
  async ({ dao, sessions }: Application, { id, session }: ScenariosDeleteRequest): Promise<void> => {
    const user = await sessions.get(session);
    if (user == null || !user.isAdmin) {
      throw new ApplicationError(403, 'Forbidden');
    }

    try {
      await dao.executeOne(
        `
          UPDATE "Scenarios" 
          SET "isDeleted" = true
          WHERE "id" = $1 AND "isDeleted" = FALSE
          RETURNING "id"
        `,
        [id],
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
    },
    required: ['session', 'id'],
    additionalProperties: false,
  },
);
