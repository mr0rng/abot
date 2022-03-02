import { PasswordSignUpInRequest, PasswordSignUpInResponse } from '@abot/api-contract/target/user/password'

import Application from '../../../app';
import {ApplicationError, Command} from '../..';
import UserModel, {UserNotFound} from "../../../models/user-model";


export default new Command<PasswordSignUpInRequest, PasswordSignUpInResponse>(
  "user.password.signIn",
  async (app: Application, request: PasswordSignUpInRequest): Promise<PasswordSignUpInResponse> => {
      const userModel = new UserModel(app.dao);
      try {
          const user = await userModel.getByCredentials(request.login, request.type, request.passwordHash);
          const session = await app.sessions.create_session(user);
          return { session };
      } catch (e) {
          if (e instanceof UserNotFound) {
              throw new ApplicationError(403, "Auth failed");
          }
          throw e;
      }
  },
  {
    type: "object",
    properties: {
      type: {type: "string"},
      login: {type: "string"},
      passwordHash: {type: "string"},
    },
    required: ["login", "passwordHash", "type"],
    additionalProperties: false
  }
);
