import { Demand, WithSession } from '@abot/model';

export interface ApiContractDemands {
  count: (request: DemandsSearchRequest) => Promise<DemandsCountResponse>;
  search: (request: DemandsSearchRequest) => Promise<Demand[]>;
  create: (request: DemandsCreateRequest) => Promise<DemandsCreateResponse>;
  update: (request: DemandsUpdateRequest) => Promise<void>;
  next: (request: WithSession) => Promise<Demand>;
  close: (request: WithSession) => Promise<void>;
}

export type DemandsCountResponse = {
  active: number;
  closed: number;
};

export type DemandsSearchRequest = {
  session: string;
  q: string;
  id?: string;
  my?: boolean;
  login?: string;
  scenario?: string;
  isActive?: boolean;
  limit: number;
  offset: number;
};

export type DemandsCreateRequest = WithSession & Omit<Demand, 'id' | 'date' | 'recipient' | 'sender'>;
export type DemandsCreateResponse = { id: string };
export type DemandsUpdateRequest = WithSession & Omit<Demand, 'recipient' | 'date'>;
