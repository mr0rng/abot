import { TelegramUserGetRequest } from '@abot/api-contract/src/user/telegram';
import { UserGetResponse } from '@abot/api-contract/target/user';
import { UnexpectedNumberOfRows } from '@abot/dao';
import { User } from '@abot/model';

import { ApplicationError, Command } from '../..';
import Application from '../../../app';

export default new Command<TelegramUserGetRequest, UserGetResponse>(
  'user.telegram.get',
  async (app: Application, { session, telegramId }: TelegramUserGetRequest): Promise<UserGetResponse> => {
    const admin = await app.sessions.get(session);
    if (admin == null || !admin.isAdmin) {
      throw new ApplicationError(403, 'Forbidden');
    }

    try {
      const user = await app.dao.executeOne<User>(
        `
          SELECT "id", "login", "type", "isAdmin", "isBanned", "payload" 
          FROM "Users" 
          WHERE 
            "type" = $2 
            AND "payload"->>'telegramId' = $1
            AND "isBanned" = FALSE
          `,
        [telegramId, 'telegram'],
      );

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { privateKeys: _, ...payload } = user.payload;
      return {
        login: user.login,
        type: user.type,
        isAdmin: user.isAdmin,
        payload,
      };
    } catch (e) {
      const error = e as UnexpectedNumberOfRows;
      if (error.isUnexpectedNumberOfRows) {
        throw new ApplicationError(404, 'Not Found');
      }
      throw e;
    }
  },
  {
    type: 'object',
    properties: {
      session: { type: 'string' },
      telegramId: { type: 'string' },
    },
    required: ['session', 'telegramId'],
    additionalProperties: false,
  },
);
