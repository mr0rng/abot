import { Scenario, SearchRequest, WithSessionUser } from '@abot/model';

export interface ApiContractScenarios {
  count: (request: ScenariosSearchRequest) => Promise<ScenariosCountResponse>;
  search: (request: ScenariosSearchRequest & SearchRequest) => Promise<Scenario[]>;
  create: (request: Omit<Scenario, 'isDeleted'> & WithSessionUser) => Promise<void>;
  update: (request: Omit<Scenario, 'isDeleted'> & WithSessionUser) => Promise<void>;
  delete: (request: ScenariosDeleteRequest) => Promise<void>;
}

export type ScenariosCountResponse = { count: number };
export type ScenariosSearchRequest = { q?: string; id?: string };
export type ScenariosDeleteRequest = { id: string } & WithSessionUser;
