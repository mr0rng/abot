import { PasswordSignUpInRequest, PasswordSignUpInResponse } from '@abot/api-contract/target/user/password'

import Application from '../../../app';
import { Command } from '../..';

export default new Command<PasswordSignUpInRequest, PasswordSignUpInResponse>(
  "user.password.signUp",
  async (app: Application, request: PasswordSignUpInRequest): Promise<PasswordSignUpInResponse> => {
    console.log('!!!!');
    return { session: "asdadas" };
  },
  {
    type: "object",
    properties: {
      login: {type: "string"},
      passwordHash: {type: "string"},
    },
    required: ["login", "passwordHash"],
    additionalProperties: false
  }
)
