import { ScenariosCountResponse, ScenariosSearchRequest } from '@abot/api-contract/target/scenarios';

import { Command } from '..';
import Application from '../../app';
import { expressions } from '../../models/search/scenarios';

export default new Command<ScenariosSearchRequest, ScenariosCountResponse>(
  'scenarios.count',
  async ({ dao }: Application, request: ScenariosSearchRequest): Promise<ScenariosCountResponse> => {
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
      q: { type: 'string', nullable: true },
      id: { type: 'string', nullable: true },
    },
    required: [],
    additionalProperties: false,
  },
);
