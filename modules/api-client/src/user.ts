import { UserGetRequest, UserGetResponse } from '@abot/api-contract/target/user';
import { PasswordSignUpInRequest, PasswordSignUpInResponse } from '@abot/api-contract/target/user/password';

import APIClient from '.'

export default class APIClientUser {
  constructor (
    public apiClient: APIClient
  ) { }

  password = {
    signUp: (request: PasswordSignUpInRequest): Promise<PasswordSignUpInResponse> => {
      return this.apiClient.execute('user.password.signUp', request);
    },

    signIn: (request: PasswordSignUpInRequest): Promise<PasswordSignUpInResponse> => {
      return this.apiClient.execute('user.password.signIn', request);
    }
  }

  get (request: UserGetRequest): Promise<UserGetResponse> {
    return this.apiClient.execute('user.get', request);
  }
}