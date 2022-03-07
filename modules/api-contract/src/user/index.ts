import { WithSession } from '@abot/model';

import { ApiContractUserPassword } from './password';

export interface ApiContractUser {
  password: ApiContractUserPassword;
  get: (request: UserGetRequest) => Promise<UserGetResponse>;
}

export type UserGetRequest = WithSession;

export type UserGetResponse = {
  login: string;
  type: string;
  isAdmin: boolean;
  payload: object;
};
