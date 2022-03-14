import { DemandsSearchRequest } from '@abot/api-contract/target/demands';
import { Demand, SearchRequest } from '@abot/model';

import { ApplicationError, Command } from '..';
import Application from '../../app';
import { expressions } from '../../models/search/demands';

export default new Command<DemandsSearchRequest & SearchRequest, Demand[]>(
  'demands.search',
  async ({ dao }: Application, request: DemandsSearchRequest & SearchRequest): Promise<Demand[]> => {
    if (!request.isSessionUserIsAdmin && request.my !== true) {
      throw new ApplicationError(403, 'Forbidden');
    }

    const params: unknown[] = [];
    const sql = `
      SELECT d."id", d."title", d."description", d."date", d."scenario", d."status", d."payload"
      FROM 
        "Demands" d
        ${
          request.my
            ? `INNER JOIN "Participants" p ON p.demand = d.id AND p.user = $${params.push(request.sessionUser)}`
            : ''
        }
        ${
          request.login == null
            ? ''
            : `INNER JOIN "Participants" p2 ON p2.demand = d.id AND p2.user = $${params.push(request.login)}`
        }
      WHERE ${expressions(request, params)}
      ORDER BY d."date" ASC
      LIMIT $${params.push(request.limit)}
      OFFSET $${params.push(request.offset)}
    `;

    const { rows } = await dao.execute<Demand>(sql, params);
    return rows;
  },
  {
    type: 'object',
    properties: {
      q: { type: 'string' },
      id: { type: 'string', nullable: true },
      my: { type: 'boolean', nullable: true },
      login: { type: 'string', nullable: true },
      scenario: { type: 'string', nullable: true },
      isActive: { type: 'boolean', nullable: true },
      limit: { type: 'number', minimum: 1, maximum: 100 },
      offset: { type: 'number', minimum: 0, maximum: 10000 },
      sessionUser: { type: 'string' },
      isSessionUserIsAdmin: { type: 'boolean' },
    },
    required: ['q', 'sessionUser', 'isSessionUserIsAdmin', 'limit', 'offset'],
    additionalProperties: false,
  },
);
