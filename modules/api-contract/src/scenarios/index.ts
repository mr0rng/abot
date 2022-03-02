import { Scenario } from '@abot/model'

export type ApiContractScenarios = {
  count: (request: ScenariosSearchRequest) => Promise<ScenariosCountResponse>,
  search: (request: ScenariosSearchRequest) => Promise<Scenario[]>,
  create: (request: Scenario) => Promise<undefined>,
  update: (request: Scenario) => Promise<undefined>,
  delete: (request:  ScenariosDeleteRequest) => Promise<undefined>,
};

export type ScenariosCountResponse = { count: number };

export type ScenariosSearchRequest = { 
  q: string,
  id?: string,
  limit: number,
  offset: number
};

export type ScenariosDeleteRequest = { id: string };