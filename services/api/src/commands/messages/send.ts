import { MessageSendResponse, MessageSendRequest } from '@abot/api-contract/target/messages';

import {ApplicationError, Command, ForbiddenError} from '..';
import Application from '../../app';
import {UnexpectedNumberOfRows} from "@abot/dao";
import { v4 } from 'uuid';

export default new Command<MessageSendRequest, MessageSendResponse>(
  'messages.send',
  async (app: Application, request: MessageSendRequest): Promise<MessageSendResponse> => {
    return request.isSessionUserIsAdmin ?
      sendAdminMessage(app, request.demand, request.sessionUser, request.type, request.payload):
      sendCommonMessage(app, request.demand, request.sessionUser, request.type, request.payload);
  },
  {
    type: 'object',
    properties: {
      sessionUser: { type: 'string' },
      isSessionUserIsAdmin: { type: 'boolean' },
      demand: { type: 'string' },
      type: { type: 'string' },
      payload: { type: 'object' },
    },
    required: ['sessionUser', 'isSessionUserIsAdmin', 'demand', 'type', 'payload'],
    additionalProperties: false,
  }
);


const sendCommonMessage = async (
  app: Application, demand: string, user: string, type: string, payload: Record<string, any>
): Promise<MessageSendResponse> => {
  const sql = `
    INSERT INTO "Messages" ("id", "date", "demand", "author", "type", "payload")
      SELECT
        $1 as "id",
        CURRENT_TIMESTAMP as "date",
        $2::TEXT as "demand",
        $3::TEXT as "author",
        $4 as "type",
        $5 as "payload"
      FROM "Participants"
      WHERE "demand" = $2 AND "user" = $3
    RETURNING "id", "date";
  `;
  try {
    return await app.dao.executeOne(sql, [v4(), demand, user, type, payload]);
  } catch (e) {
    const error = e as UnexpectedNumberOfRows;
    if (error.isUnexpectedNumberOfRows) {
      throw new ForbiddenError();
    }
    throw e;
  }
}

const sendAdminMessage = async (
  app: Application, demand: string, user: string, type: string, payload: Record<string, any>
): Promise<MessageSendResponse> => {
  const sql = `
    INSERT INTO "Messages" ("id", "date", "demand", "author", "type", "payload")
    VALUES ($1, CURRENT_TIMESTAMP, $2, $3, $4, $5)
    RETURNING "id", "date";
  `;
  
  try {
    return await app.dao.executeOne(sql, [v4(), demand, user, type, payload]);
  } catch (e) {
    if (e.constraint === 'Messages_demand_fkey') {
      throw new ApplicationError(400, 'Wrong demand');
    }
    throw e;
  }
};
