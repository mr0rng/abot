export type ApiContractScenarios = {
  count: (request: ScenariosCountRequest) => Promise<ScenariosCountResponse>,
  search: (request: ScenariosSearchRequest) => Promise<ScenariosSearchResponse>,
  create: (request: Scenario) => Promise<undefined>,
  update: (request: Scenario) => Promise<undefined>,
  delete: (request:  ScenariosDeleteRequest) => Promise<undefined>,
};

export type Scenario = { id: string, description: string, payload: object };

export type ScenariosCountRequest = { };
export type ScenariosCountResponse = { count: number };

export type ScenariosSearchRequest = { 
  q: string,
  id?: string,
  limit: number,
  offset: number
};

export type ScenariosSearchResponse = Scenario[];

export type ScenariosDeleteRequest = { id: string };