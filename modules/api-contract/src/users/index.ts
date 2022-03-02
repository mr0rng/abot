export type ApiContractUsers = {
  count: (request: UsersCountRequest) => Promise<UsersCountResponse>,
  search: (request: UsersSearchRequest) => Promise<UsersSearchResponse>,
  ban: (request:  UsersRequest) => Promise<undefined>,
  setIsAdmin: (request:  UsersRequest) => Promise<undefined>,
  setIsAdminFalse: (request:  UsersRequest) => Promise<undefined>,
  assignScenario: (request: UsersScenarioRequest) => Promise<undefined>,
  breakScenario: (request: UsersScenarioRequest) => Promise<undefined>,
};

export type User = { login: string, type: string, isAdmin: boolean, payload: object };

export type UsersCountRequest = { };
export type UsersCountResponse = { count: number };

export type UsersSearchRequest = { 
  q: string,
  login?: string,
  scenario?: string,
  limit: number,
  offset: number
};
export type UsersSearchResponse = User[];

export type UsersRequest = { login: string };
export type UsersScenarioRequest = { login: string, scenario: string };