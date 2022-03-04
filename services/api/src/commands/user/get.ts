import { UserGetRequest, UserGetResponse } from '@abot/api-contract/target/user'

import Application from '../../app';
import {ApplicationError, Command} from '..';


export default new Command<UserGetRequest, UserGetResponse>(
  "user.get",
  async (app: Application, request: UserGetRequest): Promise<UserGetResponse> => {
      const user = await app.sessions.get_session(request.session);
      if (user == null) {
          throw new ApplicationError(404, "Session not found");
      }
      return {
          login: user.login,
          type: user.type,
          isAdmin: user.isAdmin,
          payload: user.payload,
      };
  },
  {
    type: "object",
    properties: {
      session: {type: "string"}
    },
    required: ["session"],
    additionalProperties: false
  }
);
