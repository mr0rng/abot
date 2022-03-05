import { ScenariosCountResponse, ScenariosSearchRequest } from '@abot/api-contract/target/scenarios';

import { ApplicationError, Command } from '..';
import Application from '../../app';
import { expressions } from '../../models/search/scenarios';

export default new Command<ScenariosSearchRequest, ScenariosCountResponse>(
  'scenarios.count',
  async ({ dao, sessions }: Application, request: ScenariosSearchRequest): Promise<ScenariosCountResponse> => {
    const user = await sessions.get(request.session);
    if (user == null) {
      throw new ApplicationError(403, 'Forbidden');
    }

    const params: unknown[] = [];
    return dao.executeOne(
      `
        SELECT count(id)::INTEGER as count
        FROM "Scenarios"
        WHERE ${expressions(request, params)}
      `,
      params,
    );
  },
  {
    type: 'object',
    properties: {
      session: { type: 'string' },
      q: { type: 'string', nullable: true },
      id: { type: 'string', nullable: true },
    },
    required: ['session'],
    additionalProperties: false,
  },
);
