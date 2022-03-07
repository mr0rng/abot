import { ApiContractUserPassword } from './password';
import { ApiContractUserTelegram } from './telegram';

export interface ApiContractUser {
  password: ApiContractUserPassword;
  telegram: ApiContractUserTelegram;
  get: (request: UserGetRequest) => Promise<UserGetResponse>;
}

export type UserGetRequest = { session: string };

export type UserGetResponse = {
  login: string;
  type: string;
  isAdmin: boolean;
  payload: object;
};
