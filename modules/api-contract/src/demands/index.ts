import { Demand } from '@abot/model'
import { Response } from "../response";

export type ApiContractDemands = {
  count: (request: DemandsSearchRequest) => Promise<Response<DemandsCountResponse>>,
  search: (request: DemandsSearchRequest) => Promise<Response<Demand[]>>,
  create: (request: DemandsCreateRequest) => Promise<Response<DemandsCreateResponse>>,
  update: (request: Omit<Demand, "recipient">) => Promise<Response<undefined>>,
  next: (request: null) => Promise<Response<Demand>>
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

export type DemandsCreateRequest = {
  session: string,
} & Omit<Demand, "id" | "date" | "recipient" | "sender">;

export type DemandsCreateResponse = { id: string };
