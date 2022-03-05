import { ScenariosSearchRequest } from '@abot/api-contract/target/scenarios';
import { Scenario, SearchRequest } from '@abot/model';

import { ApplicationError, Command } from '..';
import Application from '../../app';
import { expressions } from '../../models/search/scenarios';

export default new Command<ScenariosSearchRequest & SearchRequest, Scenario[]>(
  'scenarios.search',
  async ({ dao, sessions }: Application, request: ScenariosSearchRequest & SearchRequest): Promise<Scenario[]> => {
    const user = await sessions.get(request.session);
    if (user == null) {
      throw new ApplicationError(403, 'Forbidden');
    }

    const params: unknown[] = [];
    const { rows } = await dao.execute<Scenario>(
      `
        SELECT id, description, payload FROM "Scenarios"
        WHERE ${expressions(request, params)}
        LIMIT $${params.push(request.limit)}
        OFFSET $${params.push(request.offset)}
      `,
      params,
    );

    return rows;
  },
  {
    type: 'object',
    properties: {
      session: { type: 'string' },
      q: { type: 'string', nullable: true },
      id: { type: 'string', nullable: true },
      limit: { type: 'number', minimum: 1, maximum: 100 },
      offset: { type: 'number', minimum: 0, maximum: 10000 },
    },
    required: ['session', 'limit', 'offset'],
    additionalProperties: false,
  },
);
