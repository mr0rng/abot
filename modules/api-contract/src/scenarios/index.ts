import { Scenario, SearchRequest, WithSession } from '@abot/model'
import { Response } from "../response";

export type ApiContractScenarios = {
  count: (request: ScenariosSearchRequest) => Promise<Response<ScenariosCountResponse>>,
  search: (request: ScenariosSearchRequest & SearchRequest) => Promise<Response<Scenario[]>>,
  create: (request: Scenario & WithSession) => Promise<Response<undefined>>,
  update: (request: Scenario & WithSession) => Promise<Response<undefined>>,
  delete: (request: ScenariosDeleteRequest & WithSession) => Promise<Response<undefined>>,
};

export type ScenariosCountResponse = { count: number };
export type ScenariosSearchRequest = { q?: string, id?: string };
export type ScenariosDeleteRequest = { id: string };