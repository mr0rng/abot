// import { ApiContractDemands } from './demands';
// import { ApiContractMessages } from './messages';
import { ApiContractScenarios } from './scenarios';
import { ApiContractUser } from './user';

// import { ApiContractUsers } from './users';

export default interface ApiContract {
  // demands: ApiContractDemands;
  // messages: ApiContractMessages;
  scenarios: ApiContractScenarios;
  user: ApiContractUser;
  // users: ApiContractUsers;
}

export interface ResponseOk<T> {
  code: 200;
  response: T;
}

export interface ResponseError {
  code: number;
  message: string;
}

export type Response<T> = ResponseOk<T> | ResponseError;
