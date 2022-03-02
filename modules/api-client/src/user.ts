import { UserGetRequest, UserGetResponse } from '@abot/api-contract/target/user';
import { PasswordSignUpInRequest, PasswordSignUpInResponse } from '@abot/api-contract/target/user/password';
import { Response } from "@abot/api-contract/src/response";

import APIClient from '.'

export default class APIClientUser {
  constructor (
    public apiClient: APIClient
  ) { }

  password = {
    signUp: (request: PasswordSignUpInRequest): Promise<Response<PasswordSignUpInResponse>> => {
      return this.apiClient.execute('user.password.signUp', request);
    },

    signIn: (request: PasswordSignUpInRequest): Promise<Response<PasswordSignUpInResponse>> => {
      return this.apiClient.execute('user.password.signIn', request);
    }
  }

  get (request: UserGetRequest): Promise<Response<UserGetResponse>> {
    return this.apiClient.execute('user.get', request);
  }
}