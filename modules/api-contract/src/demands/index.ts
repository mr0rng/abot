import { Demand } from '@abot/model'

export type ApiContractDemands = {
  count: (request: DemandsSearchRequest) => Promise<DemandsCountResponse>,
  search: (request: DemandsSearchRequest) => Promise<Demand[]>,
  create: (request: Omit<Demand, "date" | "recipient">) => Promise<DemandsCreateResponse>,
  update: (request: Omit<Demand, "recipient">) => Promise<undefined>,
  next: (request: null) => Promise<Demand>
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

export type DemandsCreateResponse = { date: number };
