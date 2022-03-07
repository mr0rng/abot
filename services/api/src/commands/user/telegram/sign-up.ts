import { v4 } from 'uuid';

import { PasswordSignUpInRequest, PasswordSignUpInResponse } from '@abot/api-contract/target/user/password';

import { ApplicationError, Command } from '../..';
import Application from '../../../app';
import { TelegramUserSignUpRequest } from '@abot/api-contract/src/user/telegram';
import { UserGetResponse } from '@abot/api-contract/target/user';

export default new Command<TelegramUserSignUpRequest, UserGetResponse>(
  'user.telegram.signUp',
  async (
    { dao, sessions }: Application,
    request: TelegramUserSignUpRequest,
  ): Promise<UserGetResponse> => {
    const admin = await sessions.get(request.session);
    if (admin == null || !admin.isAdmin) {
      throw new ApplicationError(403, 'Forbidden');
    }

    try {
      const { id } = await dao.executeOne(
        `
          INSERT INTO "Users" ("id", "login", "type", "payload") 
          VALUES ($1, $2, $3, $4) 
          RETURNING "id"
        `,
        [v4(), request.login, 'telegram', JSON.stringify({ telegramId: request.telegramId })],
      );
      return {
        login: request.login,
        type: 'telegram',
        isAdmin: false,
        payload: { telegramId: request.telegramId },
      };
    } catch (error) {
      const e = error as { constraint: string };
      throw e && typeof e === 'object' && e['constraint'] === 'Users_login_type_key'
        ? new ApplicationError(400, 'User already exists')
        : e;
    }
  },
  {
    type: 'object',
    properties: {
      session: { type: 'string' },
      login: { type: 'string' },
      telegramId: { type: 'string' },
    },
    required: ['session', 'login', 'telegramId'],
    additionalProperties: false,
  },
);
