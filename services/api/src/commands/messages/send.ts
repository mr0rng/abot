import { MessageSendResponse } from '@abot/api-contract/target/messages';
import { Message } from '@abot/model';

import { ApplicationError, Command, ForbiddenError } from '..';
import Application from '../../app';

export default new Command<Omit<Message, 'date'>, MessageSendResponse>(
  'messages.send',
  async (app: Application, message: Omit<Message, 'date'>): Promise<MessageSendResponse> => {
    try {
      const args = [
        message.demand,
        message.author,
        message.type,
        message.payload
      ];

      const sql = `
        INSERT INTO "Messages" ("date", "demand", "author", "type", "payload")
        SELECT * FROM ( VALUES (CURRENT_TIMESTAMP, $1, $2, $3, $4::jsonb) )
          AS data (timestamp, varchar, varchar, varchar, jsonb)
        WHERE EXISTS (
          SELECT "demand"
          FROM "Participants"
          WHERE "demand" = $1
            AND "user" = $2
        )
        RETURNING "id", "date";
      `;

      return await app.dao.executeOne(sql, args);
    } catch (e) {
      if (e.constraint === 'Messages_author_fkey') {
        throw new ForbiddenError();
      }
      if (e.isUnexpectedNumberOfRows) {
        throw new ForbiddenError();
      }
      throw e;
    }
  },
  {
    type: 'object',
    properties: {
      demand: { type: 'string' },
      author: { type: 'string' },
      type: { type: 'string' },
      payload: { type: 'object' }
    },
    required: ['demand', 'author', 'type', 'payload'],
    additionalProperties: false,
  },
);
