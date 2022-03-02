import { ApiContractUserPassword } from './password'

export type ApiContractUser = {
  password: ApiContractUserPassword,
  get: (request: UserGetRequest) => Promise<UserGetResponse>,
};

export type UserGetRequest = { };

export type UserGetResponse = {
  login: string,
  type: string,
  isAdmin: boolean,
  payload: object
};