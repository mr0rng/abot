import { Demand } from '@abot/model'
import { Response } from "../response";

export type ApiContractDemands = {
  count: (request: DemandsSearchRequest) => Promise<Response<DemandsCountResponse>>,
  search: (request: DemandsSearchRequest) => Promise<Response<Demand[]>>,
  create: (request: DemandsCreateRequest) => Promise<Response<DemandsCreateResponse>>,
  update: (request: DemandsUpdateRequest) => Promise<Response<undefined>>,
  next: (request: SessionRequired) => Promise<Response<Demand>>
  getActiveAsSender: (request: SessionRequired) => Promise<Response<Demand>>
  close: (request: SessionRequired) => Promise<undefined>
};

export type DemandsCountResponse = { 
  active: number,
  closed: number
};

export type DemandsSearchRequest = { 
  q: string,
  my?: boolean,
  login?: string,
  scenario?: string,
  isActive?: boolean,
  limit: number,
  offset: number
};

export type SessionRequired = { session: string }

export type DemandsCreateRequest = SessionRequired & Omit<Demand, "id" | "date" | "recipient" | "sender">;

export type DemandsCreateResponse = { id: string };

export type DemandsUpdateRequest = SessionRequired & Omit<Demand, "recipient" | "date">;

export {Demand};
