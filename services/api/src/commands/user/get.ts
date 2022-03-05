import { UserGetRequest, UserGetResponse } from '@abot/api-contract/target/user';

import { ApplicationError, Command } from '..';
import Application from '../../app';

export default new Command<UserGetRequest, UserGetResponse>(
  'user.get',
  async (app: Application, { session }: UserGetRequest): Promise<UserGetResponse> => {
    const user = await app.sessions.get(session);
    if (user == null) {
      throw new ApplicationError(404, 'Session not found');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { privateKeys: _, ...payload } = user.payload;
    return {
      login: user.login,
      type: user.type,
      isAdmin: user.isAdmin,
      payload,
    };
  },
  {
    type: 'object',
    properties: {
      session: { type: 'string' },
    },
    required: ['session'],
    additionalProperties: false,
  },
);
