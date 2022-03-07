import { Demand, SearchRequest, WithSession, WithSessionUser } from '@abot/model';

export interface ApiContractDemands {
  count: (request: DemandsSearchRequest) => Promise<DemandsCountResponse>;
  search: (request: DemandsSearchRequest & SearchRequest) => Promise<Demand[]>;
  create: (request: DemandsCreateRequest) => Promise<DemandsCreateResponse>;
  update: (request: DemandsUpdateRequest) => Promise<Demand>;
  close: (request: DemandsCloseRequest) => Promise<void>;
  next: (request: WithSessionUser) => Promise<Demand>;
  participants: {
    add: (request: DemandsAddParticipantRequest & WithSession) => Promise<void>;
    remove: (request: DemandsRemoveParticipantRequest & WithSession) => Promise<void>;
  };
}

export type DemandsAddParticipantRequest = {
  user: string;
  type: string;
};

export type DemandsRemoveParticipantRequest = {
  user: string;
};

export type DemandsCloseRequest = {
  id: string;
} & WithSessionUser;

export type DemandsCountResponse = {
  active: number;
  closed: number;
};

export type DemandsSearchRequest = {
  q: string;
  id?: string;
  my?: boolean;
  login?: string;
  scenario?: string;
  isActive?: boolean;
} & WithSessionUser;

export type DemandsCreateRequest = Omit<Demand, 'id' | 'date' | 'status'> & WithSessionUser;
export type DemandsCreateResponse = { id: string };
export type DemandsUpdateRequest = {
  id: string;
  title?: string;
  description?: string;
  scenario?: string;
  payload?: object;
} & WithSessionUser;
