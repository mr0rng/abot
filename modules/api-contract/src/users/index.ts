import { User } from '@abot/model'

export type ApiContractUsers = {
  count: (request: UsersSearchRequest) => Promise<UsersCountResponse>,
  search: (request: UsersSearchRequest) => Promise<UsersSearchResponse>,
  ban: (request:  UsersRequest) => Promise<undefined>,
  setIsAdmin: (request:  UsersRequest) => Promise<undefined>,
  setNotAdmin: (request:  UsersRequest) => Promise<undefined>,
  assignScenario: (request: UsersScenarioRequest) => Promise<undefined>,
  unassignScenario: (request: UsersScenarioRequest) => Promise<undefined>,
};

export type UsersCountRequest = { session: string };
export type UsersCountResponse = { count: number };

export type UsersSearchRequest = { 
  session: string,
  q: string,
  login?: string,
  scenario?: string,
  limit: number,
  offset: number
};
export type UsersSearchResponse = User[];

export type UsersRequest = { session: string, login: string };
export type UsersScenarioRequest = { session: string, login: string, scenario: string };