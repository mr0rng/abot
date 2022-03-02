import { ApiContractUserPassword } from './password'
import { Response } from "../response";

export type ApiContractUser = {
  password: ApiContractUserPassword,
  get: (request: UserGetRequest) => Promise<Response<UserGetResponse>>,
};

export type UserGetRequest = { session: string };

export type UserGetResponse = {
  login: string,
  type: string,
  isAdmin: boolean,
  payload: object
};