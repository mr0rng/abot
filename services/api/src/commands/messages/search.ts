import { MessageSearchResponse, MessagesSearchRequest } from '@abot/api-contract/target/messages';

import { Command } from '..';
import Application from '../../app';

export default new Command<MessagesSearchRequest, MessageSearchResponse>(
  'messages.search',
  async (app: Application, request: MessagesSearchRequest): Promise<MessageSearchResponse> => {
    return search(
      app,
      request.demand,
      request.lastSeenId,
      request.limit,
      request.order,
      request.isSessionUserIsAdmin,
      request.sessionUser,
    );
  },
  {
    type: 'object',
    properties: {
      demand: { type: 'string' },
      lastSeenId: { type: 'string' },
      order: { enum: [1, -1] },
      limit: { type: 'integer', minimum: 1, maximum: 1000 },
      sessionUser: { type: 'string' },
      isSessionUserIsAdmin: { type: 'boolean' },
    },
    required: ['sessionUser', 'isSessionUserIsAdmin', 'demand', 'order', 'limit'],
    additionalProperties: false,
  },
);

const search = async (
  app: Application,
  demand: string,
  lastSeenId: string | null,
  limit: number,
  order: number,
  userIsAdmin: boolean,
  user: string,
): Promise<MessageSearchResponse> => {
  const args = [demand];
  let where = `"demand" = $1`;

  if (lastSeenId !== undefined) {
    args.push(lastSeenId);
    where += ` AND "date" ${order == 1 ? '>' : '<'} (SELECT "date" FROM "Messages" WHERE "id" = $2 and "demand" = $1)`;
  }

  if (!userIsAdmin) {
    const DECLINED_TYPES = ['declined_donor'];
    args.push(DECLINED_TYPES);
    args.push(user);
    where += ` AND EXISTS(SELECT "id" FROM "Participants" WHERE "type" <> ANY($${args.length - 1}) AND "user" = $${
      args.length
    } AND "demand" = $1)`;
  }

  args.push(limit);
  const sql = `
  SELECT * FROM "Messages" WHERE ${where} ORDER BY "date" ${order == 1 ? 'ASC' : 'DESC'} LIMIT $${args.length};
  `;

  const result = await app.dao.execute(sql, args);
  return result.rows as MessageSearchResponse;
};
