import { v4 } from 'uuid';

import { PasswordSignUpInRequest, PasswordSignUpInResponse } from '@abot/api-contract/target/user/password';

import { ApplicationError, Command } from '../..';
import Application from '../../../app';

export default new Command<PasswordSignUpInRequest, PasswordSignUpInResponse>(
  'user.password.signUp',
  async (
    { dao, sessions }: Application,
    { login, passwordHash }: PasswordSignUpInRequest,
  ): Promise<PasswordSignUpInResponse> => {
    try {
      const { id } = await dao.executeOne(
        `
          INSERT INTO "Users" ("id", "login", "type", "payload") 
          VALUES ($1, $2, $3, $4) 
          RETURNING "id"
        `,
        [v4(), login, 'web', JSON.stringify({ privateKeys: { passwordHash } })],
      );
      const session = await sessions.create({
        id,
        login,
        type: 'web',
        isAdmin: false,
        isBanned: false,
        payload: { privateKeys: { passwordHash } },
      });

      return { session };
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
      login: { type: 'string' },
      passwordHash: { type: 'string' },
    },
    required: ['login', 'passwordHash'],
    additionalProperties: false,
  },
);
