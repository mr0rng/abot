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

// eslint-disable-next-line @typescript-eslint/ban-types
export type UsersCountRequest = {};
export type UsersCountResponse = { count: number };

export type UsersSearchRequest = {
  q: string;
  login?: string;
  scenario?: string;
  limit: number;
  offset: number;
};
export type UsersSearchResponse = User[];

export type UsersRequest = { login: string };
export type UsersScenarioRequest = { login: string; scenario: string };
