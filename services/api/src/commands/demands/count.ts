import { DemandsCountResponse, DemandsSearchRequest } from '@abot/api-contract/target/demands';

import { ApplicationError, Command } from '..';
import Application from '../../app';
import { expressions } from '../../models/search/demands';

export default new Command<DemandsSearchRequest, DemandsCountResponse>(
  'demands.count',
  async ({ dao }: Application, request: DemandsSearchRequest): Promise<DemandsCountResponse> => {
    if (!request.isSessionUserIsAdmin && request.my !== true) {
      throw new ApplicationError(403, 'Forbidden');
    }

    const params: unknown[] = [];
    const sql = `
      SELECT count(d.id)::INTEGER as count
      FROM 
        "Demands" d
        ${
          request.my == null
            ? ''
            : `INNER JOIN "Participants" p ON p.demand = d.id AND p.user ${request.my ? '=' : '<>'} $${params.push(
                request.sessionUser,
              )}`
        }
        ${
          request.login == null
            ? ''
            : `INNER JOIN "Participants" p2 ON p2.demand = d.id AND p2.user = $${params.push(request.login)}`
        }
      WHERE ${expressions(request, params)}
    `;

    return dao.executeOne(sql, params);
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
      sessionUser: { type: 'string' },
      isSessionUserIsAdmin: { type: 'boolean' },
    },
    required: ['q', 'sessionUser', 'isSessionUserIsAdmin'],
    additionalProperties: false,
  },
);
