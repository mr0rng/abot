import { MessageSendResponse } from '@abot/api-contract/target/messages';
import { Message, User } from '@abot/model';

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

      let sql = `
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

      const response = await app.dao.executeOne(sql, args);

      sql = `
        SELECT u."id", u."login", u."type", u."isAdmin", u."isBanned", u."payload" 
        FROM "Users" u
          JOIN "Participants" p ON p.user = u.id
        WHERE
          p."demand" = $1
          AND p."user" <> $2
          AND u."type" = $3
      `;
      const { rows } = await app.dao.execute<User[]>(sql, [message.demand, message.author, 'telegram']);
      app.apiClient.messages.notify({
        demand: message.demand,
        sender: message.author,
        payload: message.payload,
        recipients: rows
      });

      return response;
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
