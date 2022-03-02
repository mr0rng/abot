import { Scenario } from '@abot/model'
import { Response } from "../response";

export type ApiContractScenarios = {
  count: (request: ScenariosSearchRequest) => Promise<Response<ScenariosCountResponse>>,
  search: (request: ScenariosSearchRequest) => Promise<Response<Scenario[]>>,
  create: (request: Scenario) => Promise<Response<undefined>>,
  update: (request: Scenario) => Promise<Response<undefined>>,
  delete: (request:  ScenariosDeleteRequest) => Promise<Response<undefined>>,
};

export type ScenariosCountResponse = { count: number };

export type ScenariosSearchRequest = { 
  q: string,
  id?: string,
  limit: number,
  offset: number
};

export type ScenariosDeleteRequest = { id: string };