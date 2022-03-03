import { PasswordSignUpInRequest, PasswordSignUpInResponse } from '@abot/api-contract/target/user/password'

import Application from '../../../app';
import { ApplicationError, Command } from '../..';
import UserModel, {UserExists} from "../../../models/user-model";


export default new Command<PasswordSignUpInRequest, PasswordSignUpInResponse>(
  "user.password.signUp",
  async (app: Application, request: PasswordSignUpInRequest): Promise<PasswordSignUpInResponse> => {
    const userModel = new UserModel(app.dao);
    try {
        const user = await userModel.create(request.login, request.type, request.passwordHash);
        const session = await app.sessions.create_session(user);
        return { session };
    } catch (e) {
        if (e instanceof UserExists) {
            throw new ApplicationError(409, "user already exists");
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
