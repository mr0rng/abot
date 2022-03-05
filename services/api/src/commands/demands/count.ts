import { DemandsCountResponse, DemandsSearchRequest } from '@abot/api-contract/target/demands';

import { ApplicationError, Command } from '..';
import Application from '../../app';
import { processQuery } from '../../models/search';

export default new Command<DemandsSearchRequest, DemandsCountResponse>(
  'demands.count',
  async (
    { dao, sessions }: Application,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    { session, q, id, my, login, scenario, isActive, limit, offset }: DemandsSearchRequest,
  ): Promise<DemandsCountResponse> => {
    const user = await sessions.get(session);
    if (user == null) {
      throw new ApplicationError(403, 'Forbidden');
    }

    const params: unknown[] = [];
    const expressions = processQuery(`"description"`, params, q);

    // isDeleted
    expressions.push(`"isDeleted" = FALSE`);

    // id
    if (id != null) {
      expressions.push(`"id" = $${params.push(id)}`);
    }

    // my
    if (my != null) {
      const userIdVar = `$${params.push(id)}`;
      expressions.push(`("recipient" = ${userIdVar} OR "sender" = ${userIdVar})`);
    }

    // login
    if (login != null) {
      if (!user.isAdmin) {
        throw new ApplicationError(403, 'Forbidden');
      }

      const loginVar = `$${params.push(login)}`;
      expressions.push(`("recipient" = ${loginVar} OR "sender" = ${loginVar})`);
    }

    return dao.executeOne(
      `
        SELECT count(id)::INTEGER as count
        FROM "Scenarios"
        WHERE ${expressions.join(' AND ')}
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
