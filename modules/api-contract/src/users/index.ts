import { User } from '@abot/model';

export interface ApiContractUsers {
  count: (request: UsersSearchRequest) => Promise<UsersCountResponse>;
  search: (request: UsersSearchRequest) => Promise<UsersSearchResponse>;
  ban: (request: UsersRequest) => Promise<void>;
  setIsAdmin: (request: UsersRequest) => Promise<void>;
  setNotAdmin: (request: UsersRequest) => Promise<void>;
  assignScenario: (request: UsersScenarioRequest) => Promise<void>;
  unassignScenario: (request: UsersScenarioRequest) => Promise<void>;
}

export type UsersCountRequest = { session: string };
export type UsersCountResponse = { count: number };

export type UsersSearchRequest = {
  session: string;
  q: string;
  login?: string;
  scenario?: string;
  limit: number;
  offset: number;
};
export type UsersSearchResponse = User[];

export type UsersRequest = { session: string; login: string };
export type UsersScenarioRequest = { session: string; login: string; scenario: string };
