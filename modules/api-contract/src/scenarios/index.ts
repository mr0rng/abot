import { Scenario, SearchRequest, WithSession } from '@abot/model';

export interface ApiContractScenarios {
  count: (request: ScenariosSearchRequest) => Promise<ScenariosCountResponse>;
  search: (request: ScenariosSearchRequest & SearchRequest) => Promise<Scenario[]>;
  create: (request: Omit<Scenario, 'isDeleted'> & WithSession) => Promise<void>;
  update: (request: Omit<Scenario, 'isDeleted'> & WithSession) => Promise<void>;
  delete: (request: ScenariosDeleteRequest) => Promise<void>;
}

export type ScenariosCountResponse = { count: number };
export type ScenariosSearchRequest = { session: string; q?: string; id?: string };
export type ScenariosDeleteRequest = { session: string; id: string };
