export type ApiContractDemands = {
  count: (request: DemandsCountRequest) => Promise<DemandsCountResponse>,
  search: (request: DemandsSearchRequest) => Promise<DemandsSearchResponse>,
  create: (request: Omit<Demand, "date" | "recipient">) => Promise<DemandsCreateResponse>,
  update: (request: Omit<Demand, "recipient">) => Promise<undefined>,
  next: (request: null) => Promise<Demand>
};

export type Demand = { 
  date: number, 
  scenario: string, 
  recipient: string, 
  sender: string, 
  isActive: boolean, 
  payload: object 
};

export type DemandsCountRequest = { 
  my?: boolean;
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
export type DemandsSearchResponse = Demand[];

export type DemandsCreateResponse = { date: number };
