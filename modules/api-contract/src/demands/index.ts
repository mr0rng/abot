import { Demand, SearchRequest, WithSession, WithSessionUser } from '@abot/model';

export interface ApiContractDemands {
  count: (request: DemandsSearchRequest) => Promise<DemandsCountResponse>;
  search: (request: DemandsSearchRequest & SearchRequest) => Promise<Demand[]>;
  create: (request: DemandsCreateRequest) => Promise<DemandsCreateResponse>;
  update: (request: DemandsUpdateRequest) => Promise<void>;
  close: (request: DemandsCloseRequest) => Promise<void>;
  next: (request: WithSession) => Promise<Demand>;
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
};

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

export type DemandsCreateRequest = Omit<Demand, 'id' | 'date'> & WithSessionUser;
export type DemandsCreateResponse = { id: string } & WithSessionUser;
export type DemandsUpdateRequest = Omit<Demand, 'date'> & WithSessionUser;
