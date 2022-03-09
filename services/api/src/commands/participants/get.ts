import { ParticipantGetRequest } from '@abot/api-contract/src/participants';
import { MessageSendResponse } from '@abot/api-contract/target/messages';
import { UserGetResponse } from '@abot/api-contract/target/user';
import { Message, User } from '@abot/model';

import { ApplicationError, Command, ForbiddenError, NotFoundError } from '..';
import Application from '../../app';

export default new Command<ParticipantGetRequest, UserGetResponse>(
  'participants.get',
  async (app: Application, request: ParticipantGetRequest): Promise<UserGetResponse> => {
    const expr = [];
    const params = [request.demand];
    if (request.type !== undefined) {
      expr.push('p."type" = $2');
      params.push(request.type);
    } else if (request.user !== undefined) {
      expr.push('p."user" = $2');
      params.push(request.user);
    }

    const sql = `
        SELECT u."id", u."login", u."type", u."isAdmin", u."isBanned", u."payload" 
        FROM "Users" u
          JOIN "Participants" p ON p.user = u.id
        WHERE
          p."demand" = $1
          AND ${expr.join(' AND ')}`;

    const { rows } = await app.dao.execute<User>(sql, params);
    if (rows.length === 0) {
      throw new NotFoundError();
    }
    if (rows.length > 1) {
      throw new ForbiddenError();
    }
    const user = rows[0];
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { privateKeys: _, ...payload } = user.payload;
    return {
      id: user.id,
      login: user.login,
      type: user.type,
      isAdmin: user.isAdmin,
      payload,
    };
  },
  {
    type: 'object',
    properties: {
      demand: { type: 'string' },
      user: { type: 'string' },
      type: { type: 'string' }
    },
    required: ['demand'],
    additionalProperties: false,
  },
);
