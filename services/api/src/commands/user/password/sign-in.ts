import { PasswordSignUpInRequest, PasswordSignUpInResponse } from '@abot/api-contract/target/user/password';
import { UnexpectedNumberOfRows } from '@abot/dao';
import { User } from '@abot/model';

import { ApplicationError, Command } from '../..';
import Application from '../../../app';

export default new Command<PasswordSignUpInRequest, PasswordSignUpInResponse>(
  'user.password.signIn',
  async (
    { dao, sessions }: Application,
    { login, passwordHash }: PasswordSignUpInRequest,
  ): Promise<PasswordSignUpInResponse> => {
    try {
      const user = await dao.executeOne<User>(
        `
          SELECT "id", "login", "type", "isAdmin", "isBanned", "payload" 
          FROM "Users" 
          WHERE 
            "type" = $2 
            AND "login" = $1 
            AND "payload"->'privateKeys'->>'passwordHash' = $3
            AND "isBanned" = FALSE
        `,
        [login, 'web', passwordHash],
      );
      const session = await sessions.create(user);

      return { session };
    } catch (e) {
      const error = e as UnexpectedNumberOfRows;
      if (error.isUnexpectedNumberOfRows) {
        throw new ApplicationError(403, 'Forbidden');
      }

      throw e;
    }
  },
  {
    type: 'object',
    properties: {
      login: { type: 'string' },
      passwordHash: { type: 'string' },
    },
    required: ['login', 'passwordHash'],
    additionalProperties: false,
  },
);
