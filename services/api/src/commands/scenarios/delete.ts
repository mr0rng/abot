import { ScenariosDeleteRequest } from '@abot/api-contract/target/scenarios';
import { UnexpectedNumberOfRows } from '@abot/dao';

import { ApplicationError, Command } from '..';
import Application from '../../app';

export default new Command<ScenariosDeleteRequest, void>(
  'scenarios.delete',
  async ({ dao }: Application, { id, isSessionUserIsAdmin }: ScenariosDeleteRequest): Promise<void> => {
    if (!isSessionUserIsAdmin) {
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
      const err = e as UnexpectedNumberOfRows;
      if (err.isUnexpectedNumberOfRows) {
        throw new ApplicationError(403, 'Scenario not found');
      }

      throw e;
    }
  },
  {
    type: 'object',
    properties: {
      id: { type: 'string' },
      sessionUser: { type: 'string' },
      isSessionUserIsAdmin: { type: 'boolean' },
    },
    required: ['id', 'sessionUser', 'isSessionUserIsAdmin'],
    additionalProperties: false,
  },
);
